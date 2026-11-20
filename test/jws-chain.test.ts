/**
 * REGRESSION TESTS — independent-review findings on JWS chain validation.
 *
 * `verifyChain` previously verified only signature links and root trust: it
 * never checked that intermediates assert `basicConstraints cA=true`,
 * `keyUsage keyCertSign` or `pathLen`, nor that the leaf asserts
 * `digitalSignature`. The PoC below (mirroring the reviewer's) shows the hole:
 * an attacker holding ANY end-entity certificate issued by a trusted CA can
 * sign a forged certificate for the PSP host and present
 * [forged, attacker-leaf, trusted-root] — the chain was ACCEPTED.
 *
 * Vectors are generated locally with node-forge (CA → intermediate → leaf plus
 * the attacker PKI); expected outcomes are hand-derived from RFC 5280 path
 * validation (CA flags, keyUsage, pathLen, validity) and from the finding.
 */

import { createPublicKey, sign, X509Certificate } from "node:crypto";
import * as forge from "node-forge";
import { describe, expect, it } from "vitest";
import { specExamples } from "../src/generated/examples.js";
import { PixJwsError, type JwsFailureCode } from "../src/payload/errors.js";
import { verifyJws } from "../src/payload/jws.js";
import { readChainExtensions } from "../src/payload/x509-extensions.js";
import { testCertificates } from "./mock-server/certs.js";

const cobPayload = specExamples["cobPayload1"] as Record<string, unknown>;

// ---------------------------------------------------------------------------
// Attack PKI: a trusted root, a proper intermediate, and an attacker that
// holds nothing but an end-entity certificate issued by the trusted root.
// ---------------------------------------------------------------------------

interface ForgeKeys {
  readonly privateKey: forge.pki.rsa.PrivateKey;
  readonly publicKey: forge.pki.rsa.PublicKey;
}

interface Issued {
  readonly cert: forge.pki.Certificate;
  readonly keys: ForgeKeys;
}

function generateKeys(bits = 2048): ForgeKeys {
  return forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 });
}

function issueCert(options: {
  readonly keys: ForgeKeys;
  /** Issuer to sign with; omit for a self-signed certificate. */
  readonly issuer?: Issued;
  readonly subject: string;
  readonly serial: string;
  readonly extensions: object[];
  readonly notBefore?: Date;
  readonly notAfter?: Date;
}): Issued {
  const cert = forge.pki.createCertificate();
  cert.publicKey = options.keys.publicKey;
  cert.serialNumber = options.serial;
  cert.validity.notBefore = options.notBefore ?? new Date(Date.now() - 24 * 60 * 60 * 1000);
  cert.validity.notAfter = options.notAfter ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const subject = [{ name: "commonName", value: options.subject }];
  cert.setSubject(subject);
  cert.setIssuer(options.issuer === undefined ? subject : options.issuer.cert.subject.attributes);
  cert.setExtensions(options.extensions);
  cert.sign(
    options.issuer === undefined ? options.keys.privateKey : options.issuer.keys.privateKey,
    forge.md.sha256.create(),
  );
  return { cert, keys: options.keys };
}

// node-forge's named basicConstraints extension silently drops `pathLen`, so
// encode it as a raw ASN.1 value when a vector needs a real constraint.
const BASIC_CA = (pathLen?: number): object =>
  pathLen === undefined
    ? { name: "basicConstraints", cA: true, critical: true }
    : {
        id: "2.5.29.19",
        critical: true,
        value: forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SEQUENCE, true, [
          forge.asn1.create(
            forge.asn1.Class.UNIVERSAL,
            forge.asn1.Type.BOOLEAN,
            false,
            String.fromCharCode(0xff),
          ),
          forge.asn1.create(
            forge.asn1.Class.UNIVERSAL,
            forge.asn1.Type.INTEGER,
            false,
            String.fromCharCode(pathLen),
          ),
        ]),
      };
const BASIC_EE: object = { name: "basicConstraints", cA: false, critical: true };
const KEY_USAGE_CA: object = { name: "keyUsage", keyCertSign: true, cRLSign: true, critical: true };
const KEY_USAGE_SIGN: object = {
  name: "keyUsage",
  digitalSignature: true,
  keyEncipherment: true,
  critical: true,
};
const KEY_USAGE_ENC_ONLY: object = { name: "keyUsage", keyEncipherment: true, critical: true };
const KEY_USAGE_WITHOUT_CERTSIGN: object = {
  name: "keyUsage",
  digitalSignature: true,
  critical: true,
};
const HOST_SAN = (host: string): object => ({
  name: "subjectAltName",
  altNames: [{ type: 2, value: host }],
});
const LEAF_EXTENSIONS = [BASIC_EE, KEY_USAGE_SIGN, HOST_SAN("pix.psp.example")];

interface AttackPki {
  readonly root: Issued;
  readonly intermediate: Issued;
  readonly intermediate1: Issued;
  readonly intermediate2: Issued;
  readonly attackerLeaf: Issued;
  readonly forged: Issued;
  readonly goodLeaf: Issued;
  readonly encOnlyLeaf: Issued;
  readonly noKeyCertSignIntermediate: Issued;
  readonly expiredIntermediate: Issued;
}

let cached: AttackPki | undefined;

/** Builds (once) the CA/attacker PKI used by the chain-regression vectors. */
function attackPki(): AttackPki {
  cached ??= buildAttackPki();
  return cached;
}

function buildAttackPki(): AttackPki {
  const root = issueCert({
    keys: generateKeys(),
    subject: "Pix SDK Test Root CA",
    serial: "01",
    extensions: [BASIC_CA(), KEY_USAGE_CA],
  });

  const intermediate = issueCert({
    keys: generateKeys(),
    issuer: root,
    subject: "Pix SDK Intermediate CA",
    serial: "02",
    extensions: [BASIC_CA(0), KEY_USAGE_CA],
  });

  // intermediate1 allows exactly ONE intermediate below it.
  const intermediate1 = issueCert({
    keys: generateKeys(),
    issuer: root,
    subject: "Pix SDK Intermediate L1",
    serial: "03",
    extensions: [BASIC_CA(1), KEY_USAGE_CA],
  });

  const intermediate2 = issueCert({
    keys: generateKeys(),
    issuer: intermediate1,
    subject: "Pix SDK Intermediate L2",
    serial: "04",
    extensions: [BASIC_CA(0), KEY_USAGE_CA],
  });

  // The attacker's only asset: a legitimate end-entity certificate from the
  // trusted CA (cA=false, no keyCertSign — like any TLS client cert).
  const attackerLeaf = issueCert({
    keys: generateKeys(),
    issuer: root,
    subject: "attacker-client",
    serial: "05",
    extensions: [BASIC_EE, KEY_USAGE_SIGN],
  });

  // The forged certificate for the PSP host, signed with the attacker's
  // end-entity certificate — NOT by a CA.
  const forged = issueCert({
    keys: generateKeys(),
    issuer: attackerLeaf,
    subject: "pix.psp.example",
    serial: "06",
    extensions: LEAF_EXTENSIONS,
  });

  const goodLeaf = issueCert({
    keys: generateKeys(),
    issuer: intermediate,
    subject: "pix.psp.example",
    serial: "07",
    extensions: LEAF_EXTENSIONS,
  });

  const encOnlyLeaf = issueCert({
    keys: generateKeys(),
    issuer: intermediate,
    subject: "pix.psp.example",
    serial: "08",
    extensions: [BASIC_EE, KEY_USAGE_ENC_ONLY, HOST_SAN("pix.psp.example")],
  });

  // cA=true but keyUsage without keyCertSign — must not be trusted as an issuer.
  const noKeyCertSignIntermediate = issueCert({
    keys: generateKeys(),
    issuer: root,
    subject: "Pix SDK Fake CA (no keyCertSign)",
    serial: "09",
    extensions: [BASIC_CA(0), KEY_USAGE_WITHOUT_CERTSIGN],
  });

  const expiredIntermediate = issueCert({
    keys: generateKeys(),
    issuer: root,
    subject: "Pix SDK Expired Intermediate",
    serial: "10",
    extensions: [BASIC_CA(0), KEY_USAGE_CA],
    notBefore: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
    notAfter: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  });

  return {
    root,
    intermediate,
    intermediate1,
    intermediate2,
    attackerLeaf,
    forged,
    goodLeaf,
    encOnlyLeaf,
    noKeyCertSignIntermediate,
    expiredIntermediate,
  };
}

function pemOf(entry: Issued): string {
  return forge.pki.certificateToPem(entry.cert);
}

function privateKeyPem(keys: ForgeKeys): string {
  return forge.pki.privateKeyToPem(keys.privateKey);
}

function x5cJws(chain: readonly Issued[]): string {
  const leaf = chain[0];
  if (leaf === undefined) throw new Error("empty x5c chain");
  const header = {
    alg: "RS256",
    x5c: chain.map((entry) => Buffer.from(pemOf(entry)).toString("base64")),
  };
  const encodedHeader = Buffer.from(JSON.stringify(header), "utf8").toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(cobPayload), "utf8").toString("base64url");
  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`, "ascii");
  const signature = sign("sha256", signingInput, privateKeyPem(leaf.keys));
  return `${encodedHeader}.${encodedPayload}.${signature.toString("base64url")}`;
}

async function expectFailure(
  code: JwsFailureCode,
  promise: Promise<unknown>,
  messagePattern?: RegExp,
): Promise<void> {
  try {
    await promise;
  } catch (error) {
    expect(error, "verification must fail").toBeInstanceOf(PixJwsError);
    const jwsError = error as PixJwsError;
    expect(jwsError.code).toBe(code);
    if (messagePattern !== undefined) expect(jwsError.message).toMatch(messagePattern);
    return;
  }
  throw new Error(`expected verifyJws to fail with ${code}, but it resolved`);
}

// ---------------------------------------------------------------------------

describe("verifyJws — chain CA flags, keyUsage and pathLen (review PoC)", () => {
  it("REJECTS a forged chain signed by a non-CA end-entity cert from the trusted CA", async () => {
    const pki = attackPki();
    // PoC: [forged CN=pix.psp.example, attacker leaf cA=false, trusted root].
    // Signature links and root trust are fine, so only the missing CA flags on
    // the attacker leaf can (and must) stop this chain.
    const jws = x5cJws([pki.forged, pki.attackerLeaf, pki.root]);
    await expectFailure(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, {
        trustedCa: pemOf(pki.root),
        expectedHostname: "pix.psp.example",
      }),
      /index 1|cA is not asserted/i,
    );
  });

  it("rejects an issuer that asserts cA but lacks keyUsage keyCertSign", async () => {
    const pki = attackPki();
    const leafUnderFakeCa = issueCert({
      keys: generateKeys(),
      issuer: pki.noKeyCertSignIntermediate,
      subject: "pix.psp.example",
      serial: "11",
      extensions: LEAF_EXTENSIONS,
    });
    const jws = x5cJws([leafUnderFakeCa, pki.noKeyCertSignIntermediate, pki.root]);
    await expectFailure(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, { trustedCa: pemOf(pki.root), expectedHostname: "pix.psp.example" }),
      /keyCertSign/i,
    );
  });

  it("rejects a chain whose intermediate violates pathLen", async () => {
    // Build the violating chain explicitly: pathLen=0 issuer with an extra
    // intermediate between it and the leaf.
    const strictRoot = issueCert({
      keys: generateKeys(),
      subject: "Strict Root",
      serial: "13",
      extensions: [BASIC_CA(), KEY_USAGE_CA],
    });
    const strictInt = issueCert({
      keys: generateKeys(),
      issuer: strictRoot,
      subject: "Strict Int pathLen=0",
      serial: "14",
      extensions: [BASIC_CA(0), KEY_USAGE_CA],
    });
    const strictInt2 = issueCert({
      keys: generateKeys(),
      issuer: strictInt,
      subject: "Strict Int2 under pathLen=0",
      serial: "15",
      extensions: [BASIC_CA(0), KEY_USAGE_CA],
    });
    const strictLeaf = issueCert({
      keys: generateKeys(),
      issuer: strictInt2,
      subject: "pix.psp.example",
      serial: "16",
      extensions: LEAF_EXTENSIONS,
    });
    // Chain: [leaf, int2, int1(pathLen=0), root]. int1 allows ZERO
    // intermediates below it, but int2 sits between it and the leaf.
    const jws = x5cJws([strictLeaf, strictInt2, strictInt, strictRoot]);
    await expectFailure(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, {
        trustedCa: pemOf(strictRoot),
        expectedHostname: "pix.psp.example",
      }),
      /pathLen/i,
    );
  });

  it("rejects a leaf whose keyUsage lacks digitalSignature", async () => {
    const pki = attackPki();
    const jws = x5cJws([pki.encOnlyLeaf, pki.intermediate, pki.root]);
    await expectFailure(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, { trustedCa: pemOf(pki.root), expectedHostname: "pix.psp.example" }),
      /digitalSignature/i,
    );
  });

  it("rejects a chain containing an expired intermediate", async () => {
    const pki = attackPki();
    const leafUnderExpired = issueCert({
      keys: generateKeys(),
      issuer: pki.expiredIntermediate,
      subject: "pix.psp.example",
      serial: "17",
      extensions: LEAF_EXTENSIONS,
    });
    const jws = x5cJws([leafUnderExpired, pki.expiredIntermediate, pki.root]);
    await expectFailure(
      "CERT_EXPIRED",
      verifyJws(jws, { trustedCa: pemOf(pki.root), expectedHostname: "pix.psp.example" }),
    );
  });

  it("accepts the well-formed equivalent chain (positive control)", async () => {
    const pki = attackPki();
    const jws = x5cJws([pki.goodLeaf, pki.intermediate, pki.root]);
    const verified = await verifyJws(jws, {
      trustedCa: pemOf(pki.root),
      expectedHostname: "pix.psp.example",
    });
    expect(verified.payloadKind).toBe("cob");
    expect(verified.keySource.kind).toBe("x5c");
  });

  it("accepts a deeper chain that respects every pathLen constraint", async () => {
    const pki = attackPki();
    // [leaf, intermediate2(pathLen=0), intermediate1(pathLen=1), root]:
    // intermediate2 has only the leaf below it (0 intermediates) and
    // intermediate1 has exactly one (intermediate2).
    const deepLeaf = issueCert({
      keys: generateKeys(),
      issuer: pki.intermediate2,
      subject: "pix.psp.example",
      serial: "18",
      extensions: LEAF_EXTENSIONS,
    });
    const jws = x5cJws([deepLeaf, pki.intermediate2, pki.intermediate1, pki.root]);
    const verified = await verifyJws(jws, {
      trustedCa: pemOf(pki.root),
      expectedHostname: "pix.psp.example",
    });
    expect(verified.payloadKind).toBe("cob");
  });
});

describe("verifyJws — minimum RSA key size", () => {
  it("rejects an RSA key below 2048 bits", async () => {
    const weakKeys = generateKeys(1024);
    // A JWK must carry the RSA modulus/exponent; forge's key object does not.
    const jwk = {
      ...(createPublicKey(privateKeyPem(weakKeys)).export({ format: "jwk" }) as Record<
        string,
        unknown
      >),
      kid: "weak",
      alg: "RS256",
      use: "sig",
    };
    const header = { alg: "RS256", jku: "https://localhost/keys/weak.json" };
    const encodedHeader = Buffer.from(JSON.stringify(header), "utf8").toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(cobPayload), "utf8").toString("base64url");
    const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`, "ascii");
    const signature = sign("sha256", signingInput, privateKeyPem(weakKeys));
    const jws = `${encodedHeader}.${encodedPayload}.${signature.toString("base64url")}`;
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        allowedKeyHosts: ["localhost"],
        keyFetch: () =>
          Promise.resolve({
            status: 200,
            text: () => Promise.resolve(JSON.stringify({ keys: [jwk] })),
          }),
      }),
      /2048|1024|modulus/i,
    );
  });
});

describe("verifyJws — x5c/x5u certificate hostname fail-closed", () => {
  it("REJECTS x5c when no hostname anchor is configured", async () => {
    const pki = testCertificates();
    const leaf = new X509Certificate(pki.serverCertPem);
    const ca = new X509Certificate(pki.caCertPem);
    const jws = x5cJwsFromNodeCerts([leaf, ca]);
    // No locationUrl, no expectedHostname, no allowedKeyHosts: the previous
    // implementation silently skipped the certificate hostname check and
    // accepted whatever host the certificate claimed.
    await expectFailure(
      "HOSTNAME_MISMATCH",
      verifyJws(jws, { trustedCa: pki.caCertPem }),
      /expected hostname|locationUrl/i,
    );
  });

  it("checks the x5u certificate host against the fetched host when no explicit anchor exists", async () => {
    const pki = testCertificates();
    // The client certificate is signed by the trusted CA but has no DNS name
    // entry for "localhost": fetching it from a localhost URL must fail the
    // certificate hostname check instead of skipping it.
    const x5u = "https://localhost/certs/client.pem";
    const jws = nodeSignedJws({ x5u }, pki.clientKeyPem);
    await expectFailure(
      "HOSTNAME_MISMATCH",
      verifyJws(jws, {
        trustedCa: pki.caCertPem,
        allowedKeyHosts: ["localhost"],
        keyFetch: () =>
          Promise.resolve({ status: 200, text: () => Promise.resolve(pki.clientCertPem) }),
      }),
      /does not match expected host|localhost/i,
    );
  });

  it("still accepts x5c with an explicit expectedHostname", async () => {
    const pki = testCertificates();
    const leaf = new X509Certificate(pki.serverCertPem);
    const ca = new X509Certificate(pki.caCertPem);
    const jws = x5cJwsFromNodeCerts([leaf, ca], pki.serverKeyPem);
    const verified = await verifyJws(jws, {
      trustedCa: pki.caCertPem,
      expectedHostname: "localhost",
    });
    expect(verified.keySource.kind).toBe("x5c");
  });
});

function nodeSignedJws(header: Record<string, unknown>, signingKeyPem: string): string {
  const encodedHeader = Buffer.from(JSON.stringify({ alg: "RS256", ...header }), "utf8").toString(
    "base64url",
  );
  const encodedPayload = Buffer.from(JSON.stringify(cobPayload), "utf8").toString("base64url");
  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`, "ascii");
  const signature = sign("sha256", signingInput, signingKeyPem);
  return `${encodedHeader}.${encodedPayload}.${signature.toString("base64url")}`;
}

/** Builds an x5c JWS from Node X509Certificate objects (DER payloads). */
function x5cJwsFromNodeCerts(chain: readonly X509Certificate[], signingKeyPem?: string): string {
  const pki = testCertificates();
  const header = { alg: "RS256", x5c: chain.map((cert) => cert.raw.toString("base64")) };
  return nodeSignedJws(header, signingKeyPem ?? pki.serverKeyPem);
}

describe("readChainExtensions (DER parsing of the enforced extensions)", () => {
  it("reads basicConstraints and keyUsage bits from the test PKI", () => {
    const pki = testCertificates();
    const ca = readChainExtensions(new X509Certificate(pki.caCertPem));
    expect(ca.basicConstraints).toEqual({ ca: true, pathLen: undefined });
    expect(ca.keyUsage?.["keyCertSign"]).toBe(true);

    const server = readChainExtensions(new X509Certificate(pki.serverCertPem));
    expect(server.basicConstraints).toEqual({ ca: false, pathLen: undefined });
    expect(server.keyUsage?.["digitalSignature"]).toBe(true);
    expect(server.keyUsage?.["keyCertSign"]).toBe(false);
  });

  it("reads pathLenConstraint from forge-generated CA certificates", () => {
    const pki = attackPki();
    const int = readChainExtensions(new X509Certificate(pemOf(pki.intermediate)));
    expect(int.basicConstraints).toEqual({ ca: true, pathLen: 0 });
    const int1 = readChainExtensions(new X509Certificate(pemOf(pki.intermediate1)));
    expect(int1.basicConstraints).toEqual({ ca: true, pathLen: 1 });
  });

  it("throws on malformed extension bytes instead of silently passing", () => {
    // Hand-built DER: TBSCertificate-shaped SEQUENCE whose only content is an
    // extensions [3] wrapper holding a keyUsage Extension entry (OID 55 1D 0F)
    // with a malformed extnValue that is not a valid BIT STRING.
    const badExtension = Buffer.from([
      0x30,
      0x0b, // Extension SEQUENCE, length 11
      0x06,
      0x03,
      0x55,
      0x1d,
      0x0f, // OID 2.5.29.15 (keyUsage)
      0x04,
      0x02,
      0xff,
      0x9f, // OCTET STRING claiming garbage as BIT STRING
      0x00,
      0x00, // padding inside the SEQUENCE
    ]);
    // [3] EXPLICIT Extensions (SEQUENCE OF Extension) — wrap twice.
    const extensionsInner = Buffer.concat([Buffer.from([0x30, badExtension.length]), badExtension]);
    const tbs = Buffer.concat([Buffer.from([0xa3, extensionsInner.length]), extensionsInner]);
    const der = Buffer.concat([Buffer.from([0x30, tbs.length]), tbs]);
    expect(() => readChainExtensions({ raw: der })).toThrow(RangeError);
  });
});
