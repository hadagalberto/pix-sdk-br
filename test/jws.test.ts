/** Dynamic QR JWS verification: valid keys, forged/expired/wrong-alg vectors. */

import {
  constants,
  createPrivateKey,
  generateKeyPairSync,
  sign,
  X509Certificate,
  type KeyObject,
} from "node:crypto";
import { describe, expect, it } from "vitest";
import { specExamples } from "../src/generated/examples.js";
import { PixClient } from "../src/client/client.js";
import { PixJwsError, type JwsFailureCode } from "../src/payload/errors.js";
import { verifyJws, type JwsFetch } from "../src/payload/jws.js";
import { inferPayloadSchema, resolveLocationUrl } from "../src/payload/verified.js";
import { testCertificates } from "./mock-server/certs.js";

const ex = (name: string): Record<string, unknown> => specExamples[name] as Record<string, unknown>;
const cobPayload = ex("cobPayload1");
const cobvPayload = ex("cobPayload2");
const recPayload = ex("recPayload1");
const JKU = "https://localhost/keys/jwks.json";

const rsaKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const ecKeys = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const ec384Keys = generateKeyPairSync("ec", { namedCurve: "secp384r1" });
const pki = testCertificates();

function makeJws(
  payloadText: string,
  header: Record<string, unknown>,
  privateKey: KeyObject,
  alg: string,
): string {
  const protectedHeader = Buffer.from(JSON.stringify({ alg, ...header }), "utf8").toString(
    "base64url",
  );
  const encodedPayload = Buffer.from(payloadText, "utf8").toString("base64url");
  const signingInput = Buffer.from(`${protectedHeader}.${encodedPayload}`, "ascii");
  let signature: Buffer;
  if (alg === "ES256") {
    signature = sign("sha256", signingInput, {
      key: privateKey,
      dsaEncoding: "ieee-p1363",
    });
  } else if (alg === "PS256") {
    signature = sign("sha256", signingInput, {
      key: privateKey,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
    });
  } else {
    signature = sign("sha256", signingInput, privateKey);
  }
  return `${protectedHeader}.${encodedPayload}.${signature.toString("base64url")}`;
}

function jsonJws(
  payload: unknown,
  header: Record<string, unknown>,
  privateKey: KeyObject,
  alg: string,
): string {
  // Most vectors use the shared JWK Set; x5u/x5c vectors supply their own key
  // source explicitly.
  const hasKeySource =
    header["jku"] !== undefined || header["x5u"] !== undefined || header["x5c"] !== undefined;
  return makeJws(
    JSON.stringify(payload),
    hasKeySource ? header : { ...header, jku: JKU },
    privateKey,
    alg,
  );
}

function forgeSignature(jws: string): string {
  const parts = jws.split(".");
  const signature = Buffer.from(parts[2] ?? "", "base64url");
  if (signature.length === 0) throw new Error("empty signature in test vector");
  const last = signature.length - 1;
  signature[last] = (signature[last] ?? 0) ^ 0x01;
  parts[2] = signature.toString("base64url");
  return parts.join(".");
}

function jwkFor(key: KeyObject, kid: string, alg: string): Record<string, unknown> {
  return {
    ...(key.export({ format: "jwk" }) as Record<string, unknown>),
    kid,
    alg,
    use: "sig",
  };
}

function documentFetch(documents: Readonly<Record<string, unknown>>): JwsFetch {
  return (url) => {
    const value = documents[url];
    if (value === undefined) {
      return Promise.resolve({ status: 404, text: () => Promise.resolve("") });
    }
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return Promise.resolve({ status: 200, text: () => Promise.resolve(text) });
  };
}

async function expectFailure(code: JwsFailureCode, promise: Promise<unknown>): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: "PixJwsError", code });
}

const X5U = "https://localhost/certs/chain.pem";
const leafCert = new X509Certificate(pki.serverCertPem);
const caCert = new X509Certificate(pki.caCertPem);
const pkiFetch = documentFetch({
  [X5U]: `${pki.serverCertPem}\n${pki.caCertPem}`,
  [JKU]: { keys: [jwkFor(rsaKeys.publicKey, "rsa-1", "RS256")] },
});

describe("verifyJws — JWK Set key source", () => {
  it("verifies RS256 and returns the typed cob payload", async () => {
    const jws = jsonJws(cobPayload, { kid: "rsa-1", typ: "JWT" }, rsaKeys.privateKey, "RS256");
    const verified = await verifyJws(jws, { keyFetch: pkiFetch });
    expect(verified.payloadKind).toBe("cob");
    expect(verified.payload).toEqual(cobPayload);
    expect(verified.header).toMatchObject({ alg: "RS256", kid: "rsa-1", typ: "JWT" });
    expect(verified.keySource).toMatchObject({ kind: "jku", url: JKU, keyId: "rsa-1" });
    expect(verified.signingInput.toString()).toBe(jws.split(".").slice(0, 2).join("."));
    expect(verified.signature.length).toBeGreaterThan(0);
  });

  it("verifies PS256 with PSS padding", async () => {
    const url = "https://localhost/keys/ps256.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "ps-1" }, rsaKeys.privateKey, "PS256");
    const verified = await verifyJws(jws, {
      keyFetch: documentFetch({ [url]: { keys: [jwkFor(rsaKeys.publicKey, "ps-1", "PS256")] } }),
    });
    expect(verified.header.alg).toBe("PS256");
    expect(verified.payloadKind).toBe("cob");
  });

  it("verifies ES256 in raw R||S (IEEE P1363) encoding", async () => {
    const url = "https://localhost/keys/es256.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "ec-1" }, ecKeys.privateKey, "ES256");
    const verified = await verifyJws(jws, {
      keyFetch: documentFetch({ [url]: { keys: [jwkFor(ecKeys.publicKey, "ec-1", "ES256")] } }),
    });
    expect(verified.header.alg).toBe("ES256");
    expect(verified.payloadKind).toBe("cob");
  });

  it.each(["cobv", "rec"] as const)("auto-detects the %s payload schema", async (kind) => {
    const payload = kind === "cobv" ? cobvPayload : recPayload;
    const jws = jsonJws(payload, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    const verified = await verifyJws(jws, { keyFetch: pkiFetch });
    expect(verified.payloadKind).toBe(kind);
    expect(verified.payload).toEqual(payload);
  });

  it("skips payload schema validation when payloadSchema is false", async () => {
    const jws = jsonJws({ hello: "world" }, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    const verified = await verifyJws(jws, { keyFetch: pkiFetch, payloadSchema: false });
    expect(verified.payload).toEqual({ hello: "world" });
    expect(verified.payloadKind).toBeUndefined();
  });
});

describe("verifyJws — x5u / x5c key sources", () => {
  it("verifies an x5u chain against a trusted CA", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    const verified = await verifyJws(jws, {
      keyFetch: pkiFetch,
      trustedCa: pki.caCertPem,
    });
    expect(verified.keySource.kind).toBe("x5u");
    expect(verified.keySource.certificate?.subject).toBe(leafCert.subject);
    expect(verified.payloadKind).toBe("cob");
  });

  it("accepts a self-signed root when explicitly allowed", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    const verified = await verifyJws(jws, { keyFetch: pkiFetch, allowSelfSignedRoot: true });
    expect(verified.keySource.kind).toBe("x5u");
  });

  it("accepts a leaf-only chain whose issuer is in the trust store", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    const verified = await verifyJws(jws, {
      keyFetch: documentFetch({ [X5U]: pki.serverCertPem }),
      trustedCa: pki.caCertPem,
    });
    expect(verified.payloadKind).toBe("cob");
  });

  it("verifies an embedded x5c chain", async () => {
    const jws = jsonJws(
      cobPayload,
      {
        x5c: [leafCert.raw.toString("base64"), caCert.raw.toString("base64")],
      },
      createPrivateKey(pki.serverKeyPem),
      "RS256",
    );
    const verified = await verifyJws(jws, {
      trustedCa: pki.caCertPem,
      expectedHostname: "localhost",
    });
    expect(verified.keySource.kind).toBe("x5c");
    expect(verified.keySource.certificate?.subject).toBe(leafCert.subject);
  });

  it("rejects a chain with no trust anchor", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    await expectFailure("CERT_CHAIN_INVALID", verifyJws(jws, { keyFetch: pkiFetch }));
  });

  it("rejects a chain anchored at the wrong CA", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    await expectFailure(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, { keyFetch: pkiFetch, trustedCa: pki.clientCertPem }),
    );
  });

  it("rejects a certificate chain whose link signature is forged", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    // The leaf is signed by the CA, not by the client certificate used here as
    // its purported issuer, so the chain link check must fail.
    await expectFailure(
      "CERT_CHAIN_INVALID",
      verifyJws(jws, {
        keyFetch: documentFetch({ [X5U]: `${pki.serverCertPem}\n${pki.clientCertPem}` }),
        trustedCa: pki.caCertPem,
      }),
    );
  });

  it("rejects an expired certificate", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    await expectFailure(
      "CERT_EXPIRED",
      verifyJws(jws, {
        keyFetch: pkiFetch,
        trustedCa: pki.caCertPem,
        now: () => new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
      }),
    );
  });

  it("rejects a certificate that is not valid yet", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    await expectFailure(
      "CERT_NOT_YET_VALID",
      verifyJws(jws, {
        keyFetch: pkiFetch,
        trustedCa: pki.caCertPem,
        now: () => new Date("1990-01-01T00:00:00Z"),
      }),
    );
  });

  it("rejects a certificate hostname mismatch", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    await expectFailure(
      "HOSTNAME_MISMATCH",
      verifyJws(jws, {
        keyFetch: pkiFetch,
        trustedCa: pki.caCertPem,
        expectedHostname: "evil.example.com",
      }),
    );
  });

  it("rejects a key source host that differs from the location host", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    await expectFailure(
      "HOSTNAME_MISMATCH",
      verifyJws(jws, {
        keyFetch: pkiFetch,
        trustedCa: pki.caCertPem,
        locationUrl: "https://payments.example/qr/token",
      }),
    );
  });

  it("can skip hostname checks explicitly", async () => {
    const jws = jsonJws(cobPayload, { x5u: X5U }, createPrivateKey(pki.serverKeyPem), "RS256");
    const verified = await verifyJws(jws, {
      keyFetch: pkiFetch,
      trustedCa: pki.caCertPem,
      expectedHostname: "evil.example.com",
      skipHostnameCheck: true,
    });
    expect(verified.payloadKind).toBe("cob");
  });
});

describe("verifyJws — forged and malformed inputs", () => {
  it("rejects a forged RS256 signature", async () => {
    const jws = jsonJws(cobPayload, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure("BAD_SIGNATURE", verifyJws(forgeSignature(jws), { keyFetch: pkiFetch }));
  });

  it("rejects a forged ES256 signature", async () => {
    const url = "https://localhost/keys/es256.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "ec-1" }, ecKeys.privateKey, "ES256");
    await expectFailure(
      "BAD_SIGNATURE",
      verifyJws(forgeSignature(jws), {
        keyFetch: documentFetch({ [url]: { keys: [jwkFor(ecKeys.publicKey, "ec-1", "ES256")] } }),
      }),
    );
  });

  it("rejects alg none and other unsupported algorithms", async () => {
    const none = makeJws(JSON.stringify(cobPayload), {}, rsaKeys.privateKey, "HS256");
    await expectFailure("UNSUPPORTED_ALG", verifyJws(none, { keyFetch: pkiFetch }));
  });

  it("rejects RS256 signed with an EC key", async () => {
    const url = "https://localhost/keys/wrong-type.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "ec-1" }, ecKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        keyFetch: documentFetch({ [url]: { keys: [jwkFor(ecKeys.publicKey, "ec-1", "RS256")] } }),
      }),
    );
  });

  it("rejects ES256 signed with an RSA key", async () => {
    const url = "https://localhost/keys/wrong-type2.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "rsa-1" }, rsaKeys.privateKey, "ES256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        keyFetch: documentFetch({ [url]: { keys: [jwkFor(rsaKeys.publicKey, "rsa-1", "ES256")] } }),
      }),
    );
  });

  it("rejects ES256 on a non-P-256 curve", async () => {
    const url = "https://localhost/keys/p384.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "p384" }, ec384Keys.privateKey, "ES256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        keyFetch: documentFetch({
          [url]: { keys: [jwkFor(ec384Keys.publicKey, "p384", "ES256")] },
        }),
      }),
    );
  });

  it.each(["", "abc", "a.b", "a.b.c.d", "a..c"])("rejects invalid compact JWS %j", async (jws) => {
    await expectFailure("INVALID_COMPACT", verifyJws(jws, { keyFetch: pkiFetch }));
  });

  it("rejects non-base64url characters in a segment", async () => {
    await expectFailure("INVALID_BASE64URL", verifyJws("e30=.e30.sig", { keyFetch: pkiFetch }));
  });

  it("rejects a non-JSON header", async () => {
    const header = Buffer.from("not json", "utf8").toString("base64url");
    await expectFailure(
      "INVALID_HEADER",
      verifyJws(`${header}.e30.signature`, { keyFetch: pkiFetch }),
    );
  });

  it("rejects a header that is not an object", async () => {
    const header = Buffer.from("[]", "utf8").toString("base64url");
    await expectFailure(
      "INVALID_HEADER",
      verifyJws(`${header}.e30.signature`, { keyFetch: pkiFetch }),
    );
  });

  it("rejects a malformed x5c header", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "RS256", x5c: "oops" }), "utf8").toString(
      "base64url",
    );
    await expectFailure(
      "INVALID_HEADER",
      verifyJws(`${header}.e30.signature`, { keyFetch: pkiFetch }),
    );
  });

  it("rejects a non-string jku header", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "RS256", jku: 7 }), "utf8").toString(
      "base64url",
    );
    await expectFailure(
      "INVALID_HEADER",
      verifyJws(`${header}.e30.signature`, { keyFetch: pkiFetch }),
    );
  });

  it("rejects a JWS without any key source", async () => {
    const jws = makeJws(JSON.stringify(cobPayload), {}, rsaKeys.privateKey, "RS256");
    await expectFailure("MISSING_KEY_SOURCE", verifyJws(jws, { keyFetch: pkiFetch }));
  });

  it("rejects a malformed x5c certificate", async () => {
    const jws = jsonJws(cobPayload, { x5c: ["not-a-cert"] }, rsaKeys.privateKey, "RS256");
    await expectFailure("INVALID_KEY", verifyJws(jws, { keyFetch: pkiFetch }));
  });
});

describe("verifyJws — key document and payload failures", () => {
  it("rejects a failing key fetch", async () => {
    const url = "https://localhost/keys/missing.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure("KEY_FETCH_FAILED", verifyJws(jws, { keyFetch: documentFetch({}) }));
  });

  it("rejects a rejected key fetch", async () => {
    const failingFetch: JwsFetch = () => Promise.reject(new Error("offline"));
    const url = "https://localhost/keys/offline.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure("KEY_FETCH_FAILED", verifyJws(jws, { keyFetch: failingFetch }));
  });

  it("rejects an absurdly large key document", async () => {
    const url = "https://localhost/keys/huge.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "KEY_FETCH_FAILED",
      verifyJws(jws, { keyFetch: documentFetch({ [url]: "x".repeat(1000) }), maxKeyBytes: 10 }),
    );
  });

  it("rejects an x5u document with no certificate", async () => {
    const url = "https://localhost/certs/empty.pem";
    const jws = jsonJws(cobPayload, { x5u: url }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, { keyFetch: documentFetch({ [url]: "not a PEM certificate" }) }),
    );
  });

  it("rejects an x5u document with an invalid certificate", async () => {
    const url = "https://localhost/certs/invalid.pem";
    const jws = jsonJws(cobPayload, { x5u: url }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        keyFetch: documentFetch({
          [url]: "-----BEGIN CERTIFICATE-----!!!!-----END CERTIFICATE-----",
        }),
      }),
    );
  });

  it("rejects a malformed JWK Set", async () => {
    const url = "https://localhost/keys/broken.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, { keyFetch: documentFetch({ [url]: "not json" }) }),
    );
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, { keyFetch: documentFetch({ [url]: { something: "else" } }) }),
    );
  });

  it("rejects a JWK Set with no matching kid", async () => {
    const url = "https://localhost/keys/other-kid.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "unknown" }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        keyFetch: documentFetch({ [url]: { keys: [jwkFor(rsaKeys.publicKey, "rsa-1", "RS256")] } }),
      }),
    );
  });

  it("rejects a JWK marked for encryption only", async () => {
    const url = "https://localhost/keys/enc.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "enc-1" }, rsaKeys.privateKey, "RS256");
    const encryptionKey = { ...jwkFor(rsaKeys.publicKey, "enc-1", "RS256"), use: "enc" };
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, { keyFetch: documentFetch({ [url]: { keys: [encryptionKey] } }) }),
    );
  });

  it("rejects a JWK with incompatible key_ops", async () => {
    const url = "https://localhost/keys/ops.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "ops-1" }, rsaKeys.privateKey, "RS256");
    const signingOnly = { ...jwkFor(rsaKeys.publicKey, "ops-1", "RS256"), key_ops: ["sign"] };
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, { keyFetch: documentFetch({ [url]: { keys: [signingOnly] } }) }),
    );
  });

  it("accepts a JWK with an unrelated alg field", async () => {
    const url = "https://localhost/keys/no-alg.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    const key = jwkFor(rsaKeys.publicKey, "rsa-1", "RS256");
    delete key["alg"];
    const verified = await verifyJws(jws, {
      keyFetch: documentFetch({ [url]: { keys: [key] } }),
    });
    expect(verified.payloadKind).toBe("cob");
  });

  it("rejects a structurally invalid JWK", async () => {
    const url = "https://localhost/keys/invalid-jwk.json";
    const jws = jsonJws(cobPayload, { jku: url, kid: "bad" }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_KEY",
      verifyJws(jws, {
        keyFetch: documentFetch({ [url]: { keys: [{ kid: "bad", kty: "RSA" }] } }),
      }),
    );
  });

  it("rejects a jku host that differs from the location host", async () => {
    const jws = jsonJws(cobPayload, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "HOSTNAME_MISMATCH",
      verifyJws(jws, {
        keyFetch: pkiFetch,
        locationUrl: "https://payments.example/qr/token",
      }),
    );
  });

  it("rejects a non-JSON payload", async () => {
    const jws = makeJws("not json", { jku: JKU, kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure("INVALID_PAYLOAD", verifyJws(jws, { keyFetch: pkiFetch }));
  });

  it("rejects a payload that matches no Pix schema", async () => {
    const jws = jsonJws({ unrelated: true }, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure("INVALID_PAYLOAD", verifyJws(jws, { keyFetch: pkiFetch }));
  });

  it("rejects a payload that violates an explicitly requested schema", async () => {
    const jws = jsonJws(recPayload, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    await expectFailure(
      "INVALID_PAYLOAD",
      verifyJws(jws, { keyFetch: pkiFetch, payloadSchema: "cob" }),
    );
  });

  it("exposes the original detail on PixJwsError", () => {
    const error = new PixJwsError("INVALID_PAYLOAD", "bad payload", { detail: "field" });
    expect(error.name).toBe("PixJwsError");
    expect(error.detail).toBe("field");
    expect(new PixJwsError("BAD_SIGNATURE", "bad").detail).toBeUndefined();
  });
});

describe("payload location helpers and fetchVerified", () => {
  it("infers the payload schema from the location path", () => {
    expect(inferPayloadSchema("/pix/token")).toBe("cob");
    expect(inferPayloadSchema("https://host/cobv/token?x=1")).toBe("cobv");
    expect(inferPayloadSchema("https://host/rec/token#frag")).toBe("rec");
  });

  it("resolves absolute and relative locations", () => {
    const base = new URL("https://localhost:8443/api/");
    expect(resolveLocationUrl("/pix/token", base)).toBe("https://localhost:8443/pix/token");
    expect(resolveLocationUrl("https://other.example/token", base)).toBe(
      "https://other.example/token",
    );
    expect(resolveLocationUrl("%%%", undefined)).toBeUndefined();
  });

  it.each([
    ["/pix/token", cobPayload, "cob"],
    ["/cobv/token", cobvPayload, "cobv"],
    ["/rec/token", recPayload, "rec"],
  ] as const)("fetches and verifies a %s location", async (location, payload, kind) => {
    const jws = jsonJws(payload, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256");
    const client = new PixClient({
      baseUrl: "https://localhost",
      clientId: "id",
      clientSecret: "secret",
      fetch: () =>
        Promise.resolve({
          status: 200,
          headers: { get: () => "application/json" },
          text: () => Promise.resolve(jws),
        }),
    });
    const verified = await client.payload.fetchVerified(location, { keyFetch: pkiFetch });
    expect(verified.payloadKind).toBe(kind);
    expect(verified.payload).toEqual(payload);
    await client.close();
  });

  it("propagates a verification error from fetchVerified", async () => {
    const jws = forgeSignature(jsonJws(cobPayload, { kid: "rsa-1" }, rsaKeys.privateKey, "RS256"));
    const client = new PixClient({
      baseUrl: "https://localhost",
      clientId: "id",
      clientSecret: "secret",
      fetch: () =>
        Promise.resolve({
          status: 200,
          headers: { get: () => "application/json" },
          text: () => Promise.resolve(jws),
        }),
    });
    await expectFailure(
      "BAD_SIGNATURE",
      client.payload.fetchVerified("/pix/token", { keyFetch: pkiFetch }),
    );
    await client.close();
  });
});
