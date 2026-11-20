/**
 * Independent-review regressions for JWS certificate-path validation.
 *
 * Certificates are generated in-process by node-forge; the expectations are
 * derived from RFC 5280 / the BCB manual, never from the verifier itself.
 */

import { createPrivateKey, createPublicKey, sign } from "node:crypto";
import * as forge from "node-forge";
import { describe, expect, it } from "vitest";
import { specExamples } from "../src/generated/examples.js";
import { verifyJws, type JwsFetch } from "../src/payload/jws.js";

const cobPayload = specExamples["cobPayload1"];
if (cobPayload === undefined) throw new Error("missing spec example");

interface CertPair {
  readonly certPem: string;
  readonly cert: forge.pki.Certificate;
  readonly keyPem: string;
  readonly privateKey: forge.pki.rsa.PrivateKey;
}

interface IssueOptions {
  readonly cn: string;
  readonly ca: boolean;
  readonly keyUsage: Readonly<Record<string, boolean>>;
  readonly pathLen?: number;
  readonly san?: string;
  readonly issuer?: CertPair;
  readonly expired?: boolean;
}

function issue(opts: IssueOptions): CertPair {
  const keys = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = String(Math.floor(Math.random() * 1e9));
  cert.validity.notBefore = new Date(Date.now() - 24 * 60 * 60 * 1000);
  cert.validity.notAfter = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  if (opts.expired === true) cert.validity.notAfter = new Date(Date.now() - 60 * 1000);
  const subject = [{ name: "commonName", value: opts.cn }];
  cert.setSubject(subject);
  cert.setIssuer(opts.issuer?.cert.subject.attributes ?? subject);
  // node-forge's named basicConstraints extension ignores `pathLen`, so encode
  // it as a raw ASN.1 value when the vector needs one.
  const basicConstraints: object =
    opts.pathLen === undefined
      ? { name: "basicConstraints", cA: opts.ca, critical: true }
      : {
          id: "2.5.29.19",
          critical: true,
          value: forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SEQUENCE, true, [
            forge.asn1.create(
              forge.asn1.Class.UNIVERSAL,
              forge.asn1.Type.BOOLEAN,
              false,
              opts.ca ? String.fromCharCode(0xff) : String.fromCharCode(0),
            ),
            forge.asn1.create(
              forge.asn1.Class.UNIVERSAL,
              forge.asn1.Type.INTEGER,
              false,
              String.fromCharCode(opts.pathLen),
            ),
          ]),
        };
  const keyUsage: object = { name: "keyUsage", critical: true };
  for (const [name, enabled] of Object.entries(opts.keyUsage)) {
    if (enabled) (keyUsage as unknown as Record<string, unknown>)[name] = true;
  }
  const extensions: object[] = [basicConstraints, keyUsage];
  if (opts.san !== undefined) {
    extensions.push({
      name: "subjectAltName",
      altNames: [{ type: 2, value: opts.san }],
    });
  }
  cert.setExtensions(extensions as Parameters<typeof cert.setExtensions>[0]);
  const signingKey = opts.issuer === undefined ? keys.privateKey : opts.issuer.privateKey;
  cert.sign(signingKey, forge.md.sha256.create());
  return {
    certPem: forge.pki.certificateToPem(cert),
    cert,
    keyPem: forge.pki.privateKeyToPem(keys.privateKey),
    privateKey: keys.privateKey,
  };
}

function jwsWith(chain: readonly CertPair[], signer: CertPair): string {
  const header = Buffer.from(
    JSON.stringify({
      alg: "RS256",
      x5c: chain.map((item) =>
        Buffer.from(
          forge.asn1.toDer(forge.pki.certificateToAsn1(item.cert)).getBytes(),
          "binary",
        ).toString("base64"),
      ),
    }),
    "utf8",
  ).toString("base64url");
  const payload = Buffer.from(JSON.stringify(cobPayload), "utf8").toString("base64url");
  const input = Buffer.from(`${header}.${payload}`, "ascii");
  const key = createPrivateKey(signer.keyPem);
  const signature = sign("sha256", input, key);
  return `${header}.${payload}.${signature.toString("base64url")}`;
}

async function expectRejected(code: string, promise: Promise<unknown>): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: "PixJwsError", code });
}

describe("verifyJws — certificate path enforcement (review regressions)", () => {
  it("rejects the PoC: forged host cert signed by a trusted end-entity (cA=false)", async () => {
    const root = issue({
      cn: "Trusted Root",
      ca: true,
      keyUsage: { keyCertSign: true, cRLSign: true },
    });
    const attacker = issue({
      cn: "attacker leaf",
      ca: false,
      keyUsage: { digitalSignature: true },
      issuer: root,
    });
    const forged = issue({
      cn: "pix.psp.example",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: attacker,
    });
    const jws = jwsWith([forged, attacker], forged);
    // Before the fix this chain was ACCEPTED: the attacker leaf was never
    // checked for basicConstraints cA=true / keyUsage keyCertSign.
    await expectRejected(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, { trustedCa: root.certPem, expectedHostname: "pix.psp.example" }),
    );
  });

  it("rejects an intermediate CA without basicConstraints cA=true", async () => {
    const root = issue({ cn: "Root", ca: true, keyUsage: { keyCertSign: true } });
    const intermediate = issue({
      cn: "Not a CA",
      ca: false,
      keyUsage: { keyCertSign: true },
      issuer: root,
    });
    const leaf = issue({
      cn: "signer",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: intermediate,
    });
    const jws = jwsWith([leaf, intermediate], leaf);
    await expectRejected(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, {
        trustedCa: root.certPem,
        expectedHostname: "pix.psp.example",
      }),
    );
  });

  it("rejects an intermediate CA without keyUsage keyCertSign", async () => {
    const root = issue({ cn: "Root", ca: true, keyUsage: { keyCertSign: true } });
    const intermediate = issue({
      cn: "CA without certSign",
      ca: true,
      keyUsage: { digitalSignature: true, cRLSign: true },
      issuer: root,
    });
    const leaf = issue({
      cn: "signer",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: intermediate,
    });
    const jws = jwsWith([leaf, intermediate], leaf);
    await expectRejected(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, {
        trustedCa: root.certPem,
        expectedHostname: "pix.psp.example",
      }),
    );
  });

  it("enforces pathLen: a root with pathLen=1 cannot have two intermediate CAs", async () => {
    // node-forge omits pathLen=0 from the DER encoding, so the vector uses
    // pathLen=1 with two intermediate CAs (2 > 1) instead.
    const root = issue({
      cn: "Root",
      ca: true,
      keyUsage: { keyCertSign: true },
      pathLen: 1,
    });
    const intermediateA = issue({
      cn: "Intermediate A",
      ca: true,
      keyUsage: { keyCertSign: true },
      issuer: root,
    });
    const intermediateB = issue({
      cn: "Intermediate B",
      ca: true,
      keyUsage: { keyCertSign: true },
      issuer: intermediateA,
    });
    const leaf = issue({
      cn: "signer",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: intermediateB,
    });
    const jws = jwsWith([leaf, intermediateB, intermediateA], leaf);
    await expectRejected(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, {
        trustedCa: root.certPem,
        expectedHostname: "pix.psp.example",
      }),
    );
  });

  it("accepts a valid chain with pathLen=1 and one intermediate CA", async () => {
    const root = issue({
      cn: "Root",
      ca: true,
      keyUsage: { keyCertSign: true },
      pathLen: 1,
    });
    const intermediate = issue({
      cn: "Intermediate",
      ca: true,
      keyUsage: { keyCertSign: true },
      issuer: root,
    });
    const leaf = issue({
      cn: "signer",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: intermediate,
    });
    const jws = jwsWith([leaf, intermediate], leaf);
    const verified = await verifyJws(jws, {
      trustedCa: root.certPem,
      expectedHostname: "pix.psp.example",
    });
    expect(verified.payloadKind).toBe("cob");
  });

  it("rejects a signing leaf whose keyUsage lacks digitalSignature", async () => {
    const root = issue({ cn: "Root", ca: true, keyUsage: { keyCertSign: true } });
    const leaf = issue({
      cn: "pix.psp.example",
      ca: false,
      keyUsage: { keyEncipherment: true },
      san: "pix.psp.example",
      issuer: root,
    });
    const jws = jwsWith([leaf], leaf);
    await expectRejected(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, { trustedCa: root.certPem, expectedHostname: "pix.psp.example" }),
    );
  });

  it("rejects an expired intermediate certificate", async () => {
    const root = issue({ cn: "Root", ca: true, keyUsage: { keyCertSign: true } });
    const intermediate = issue({
      cn: "Intermediate",
      ca: true,
      keyUsage: { keyCertSign: true },
      issuer: root,
      expired: true,
    });
    const leaf = issue({
      cn: "signer",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: intermediate,
    });
    const jws = jwsWith([leaf, intermediate], leaf);
    await expectRejected(
      "CERT_EXPIRED",
      verifyJws(jws, {
        trustedCa: root.certPem,
        expectedHostname: "pix.psp.example",
      }),
    );
  });

  it("fails closed for an x5c chain when no hostname anchor is configured", async () => {
    const root = issue({ cn: "Root", ca: true, keyUsage: { keyCertSign: true } });
    const leaf = issue({
      cn: "pix.psp.example",
      ca: false,
      keyUsage: { digitalSignature: true },
      san: "pix.psp.example",
      issuer: root,
    });
    const jws = jwsWith([leaf], leaf);
    // collectHostnames() returned [] here and checkCertificateHost returned
    // early, so any x5c cert was accepted without a hostname check.
    await expectRejected("HOSTNAME_MISMATCH", verifyJws(jws, { trustedCa: root.certPem }));
  });

  it("rejects an RSA key smaller than 2048 bits", async () => {
    const weak = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
    // Build the JWK from Node so its shape is exactly what `createPublicKey` accepts.
    const keyObject = createPublicKey(forge.pki.privateKeyToPem(weak.privateKey));
    const publicJwk = keyObject.export({ format: "jwk" }) as Record<string, unknown>;
    const header = Buffer.from(
      JSON.stringify({ alg: "RS256", jku: "https://localhost/keys/weak.json", kid: "weak" }),
      "utf8",
    ).toString("base64url");
    const payload = Buffer.from(JSON.stringify(cobPayload), "utf8").toString("base64url");
    const input = Buffer.from(`${header}.${payload}`, "ascii");
    const signature = sign(
      "sha256",
      input,
      createPrivateKey(forge.pki.privateKeyToPem(weak.privateKey)),
    );
    const jws = `${header}.${payload}.${signature.toString("base64url")}`;
    const fetcher: JwsFetch = () =>
      Promise.resolve({
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify({ keys: [{ ...publicJwk, kid: "weak", alg: "RS256", use: "sig" }] }),
          ),
      });
    await expectRejected(
      "INVALID_KEY",
      verifyJws(jws, { keyFetch: fetcher, allowedKeyHosts: ["localhost"] }),
    );
  });
});
