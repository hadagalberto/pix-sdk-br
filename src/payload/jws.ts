/**
 * JWS verification for dynamic Pix QR payloads, implemented with Node `crypto`
 * only (no `jose` dependency).
 *
 * Supported algorithms: RS256, ES256 and PS256. Signing keys are taken from the
 * protected header's `x5u` (X.509 certificate chain URL), `jku` (JWK Set URL)
 * or, for completeness, an embedded `x5c` chain. Certificate validity dates,
 * chain signatures, root trust and hostname rules are enforced before the
 * signature is checked.
 */

import {
  constants,
  createPublicKey,
  verify as cryptoVerify,
  X509Certificate,
  type KeyObject,
} from "node:crypto";
import { fetch as undiciFetch } from "undici";
import type { TlsData } from "../client/types.js";
import { PixJwsError } from "./errors.js";
import {
  validateCobPayload,
  validateCobVPayload,
  validateRecPayload,
} from "../generated/validators.js";
import type { ValidationResult } from "../validation/index.js";

/** Algorithms accepted by the BCB payload JWS specification. */
export type JwsAlgorithm = "RS256" | "ES256" | "PS256";

/** Which generated schema a verified payload must satisfy. */
export type PayloadSchema = "cob" | "cobv" | "rec" | "auto";

/** Parsed and validated JOSE protected header. */
export interface JwsHeader {
  readonly alg: JwsAlgorithm;
  readonly typ: string | undefined;
  readonly kid: string | undefined;
  readonly x5u: string | undefined;
  readonly jku: string | undefined;
  readonly x5c: readonly string[] | undefined;
}

/** Minimal response shape required from an injected key-document fetcher. */
export interface JwsFetchResponse {
  readonly status: number;
  text(): Promise<string>;
}

export type JwsFetch = (
  url: string,
  init: { readonly signal: AbortSignal },
) => Promise<JwsFetchResponse>;

export interface JwsVerifyOptions {
  /** Fetcher for `x5u`/`jku` documents. Defaults to undici `fetch`. */
  readonly keyFetch?: JwsFetch;
  /** Trusted CA certificates (PEM), used to validate an `x5u` chain. */
  readonly trustedCa?: TlsData | readonly TlsData[];
  /**
   * Accept a self-signed root found in the `x5u` chain. For local/test PKI
   * only; production callers must supply `trustedCa`. Default false.
   */
  readonly allowSelfSignedRoot?: boolean;
  /** Expected certificate / key-source hostname. Derived from the URL if omitted. */
  readonly expectedHostname?: string | readonly string[];
  /** Disable hostname checks entirely. Default false. */
  readonly skipHostnameCheck?: boolean;
  /** Location URL of the payload; its host is also required to match key sources. */
  readonly locationUrl?: string;
  /** Expected payload schema. Default `auto` (cob, cobv or rec). */
  readonly payloadSchema?: PayloadSchema | false;
  /** Clock used for certificate validity checks (injectable for tests). */
  readonly now?: () => Date;
  /** Maximum bytes accepted from a key document. Default 1 MiB. */
  readonly maxKeyBytes?: number;
  /** Timeout for key document fetches. Default 10 s. */
  readonly timeoutMs?: number;
  /** Abort signal forwarded to key document fetches. */
  readonly signal?: AbortSignal;
}

export interface JwsKeySource {
  readonly kind: "x5u" | "jku" | "x5c";
  readonly url: string | undefined;
  readonly certificate: X509Certificate | undefined;
  readonly keyId: string | undefined;
}

export interface VerifiedJws<T = unknown> {
  readonly header: JwsHeader;
  readonly payload: T;
  readonly payloadBytes: Buffer;
  readonly signature: Buffer;
  readonly signingInput: Buffer;
  readonly keySource: JwsKeySource;
  /** Resolved schema when `payloadSchema` was `auto`. */
  readonly payloadKind: PayloadSchema | undefined;
}

const SUPPORTED_ALGORITHMS: readonly JwsAlgorithm[] = ["RS256", "ES256", "PS256"];
const BASE64URL_RE = /^[A-Za-z0-9_-]+$/;
const PEM_CERTIFICATE_RE = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g;
const DEFAULT_MAX_KEY_BYTES = 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 10_000;

const defaultKeyFetch: JwsFetch = async (url, init) => {
  const response = await undiciFetch(url, { signal: init.signal });
  return { status: response.status, text: () => response.text() };
};

function fail(code: PixJwsError["code"], message: string, detail?: string): never {
  throw new PixJwsError(code, message, detail === undefined ? undefined : { detail });
}

function decodeBase64Url(segment: string, label: string): Buffer {
  if (!BASE64URL_RE.test(segment)) {
    fail("INVALID_BASE64URL", `JWS ${label} is not valid base64url`);
  }
  return Buffer.from(segment, "base64url");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    fail("INVALID_HEADER", `JWS header ${key} must be a string`);
  }
  return value;
}

function parseHeader(bytes: Buffer): JwsHeader {
  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString("utf8")) as unknown;
  } catch {
    fail("INVALID_HEADER", "JWS header is not valid JSON");
  }
  if (!isRecord(parsed)) fail("INVALID_HEADER", "JWS header must be a JSON object");
  const alg = parsed["alg"];
  if (typeof alg !== "string" || !SUPPORTED_ALGORITHMS.includes(alg as JwsAlgorithm)) {
    fail("UNSUPPORTED_ALG", `unsupported JWS algorithm ${JSON.stringify(alg)}`);
  }
  const x5cValue = parsed["x5c"];
  let x5c: readonly string[] | undefined;
  if (x5cValue !== undefined) {
    if (!Array.isArray(x5cValue) || x5cValue.some((entry) => typeof entry !== "string")) {
      fail("INVALID_HEADER", "JWS header x5c must be an array of base64 strings");
    }
    x5c = x5cValue as string[];
  }
  return {
    alg: alg as JwsAlgorithm,
    typ: optionalString(parsed, "typ"),
    kid: optionalString(parsed, "kid"),
    x5u: optionalString(parsed, "x5u"),
    jku: optionalString(parsed, "jku"),
    x5c,
  };
}

function parseUrl(value: string, label: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    fail("KEY_FETCH_FAILED", `${label} is not an absolute URL: ${JSON.stringify(value)}`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    fail("KEY_FETCH_FAILED", `${label} must use http or https, received ${url.protocol}`);
  }
  return url;
}

async function fetchKeyDocument(url: string, options: JwsVerifyOptions): Promise<string> {
  const fetcher = options.keyFetch ?? defaultKeyFetch;
  const signal = options.signal ?? AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  let response: JwsFetchResponse;
  try {
    response = await fetcher(url, { signal });
  } catch (error) {
    fail("KEY_FETCH_FAILED", `failed to fetch key document ${JSON.stringify(url)}`, String(error));
  }
  if (response.status < 200 || response.status >= 300) {
    fail(
      "KEY_FETCH_FAILED",
      `key document ${JSON.stringify(url)} returned HTTP ${String(response.status)}`,
    );
  }
  let text: string;
  try {
    text = await response.text();
  } catch (error) {
    fail("KEY_FETCH_FAILED", `failed to read key document ${JSON.stringify(url)}`, String(error));
  }
  if (Buffer.byteLength(text, "utf8") > (options.maxKeyBytes ?? DEFAULT_MAX_KEY_BYTES)) {
    fail("KEY_FETCH_FAILED", `key document ${JSON.stringify(url)} exceeds the byte limit`);
  }
  return text;
}

function extractCertificates(text: string): X509Certificate[] {
  const blocks = text.match(PEM_CERTIFICATE_RE);
  if (blocks === null || blocks.length === 0) return [];
  try {
    return blocks.map((block) => new X509Certificate(block));
  } catch (error) {
    fail("INVALID_KEY", "x5u document contains an invalid X.509 certificate", String(error));
  }
}

function trustedAuthorities(
  trustedCa: TlsData | readonly TlsData[] | undefined,
): X509Certificate[] {
  if (trustedCa === undefined) return [];
  const values: readonly TlsData[] = Array.isArray(trustedCa) ? trustedCa : [trustedCa];
  const result: X509Certificate[] = [];
  for (const value of values) {
    const text = typeof value === "string" ? value : value.toString("utf8");
    result.push(...extractCertificates(text));
  }
  return result;
}

function checkValidity(chain: readonly X509Certificate[], options: JwsVerifyOptions): void {
  const now = options.now?.() ?? new Date();
  for (const certificate of chain) {
    const notBefore = new Date(certificate.validFrom);
    const notAfter = new Date(certificate.validTo);
    if (now < notBefore) {
      fail("CERT_NOT_YET_VALID", "signing certificate is not valid yet", certificate.subject);
    }
    if (now > notAfter) {
      fail("CERT_EXPIRED", "signing certificate has expired", certificate.subject);
    }
  }
}

function verifyChain(chain: readonly X509Certificate[], options: JwsVerifyOptions): KeyObject {
  if (chain.length === 0) fail("CERT_CHAIN_INVALID", "certificate chain is empty");
  checkValidity(chain, options);

  for (let index = 0; index < chain.length - 1; index += 1) {
    const child = chain[index];
    const parent = chain[index + 1];
    if (child === undefined || parent === undefined) continue;
    let valid = false;
    try {
      valid = child.verify(parent.publicKey);
    } catch {
      valid = false;
    }
    if (!valid) {
      fail(
        "CERT_CHAIN_INVALID",
        `certificate at index ${String(index)} is not signed by its issuer`,
      );
    }
  }

  const root = chain.at(-1);
  if (root === undefined) fail("CERT_CHAIN_INVALID", "certificate chain is empty");
  const authorities = trustedAuthorities(options.trustedCa);

  if (authorities.length > 0) {
    const trusted = authorities.some((ca) => {
      if (ca.fingerprint === root.fingerprint) return true;
      try {
        return root.verify(ca.publicKey);
      } catch {
        return false;
      }
    });
    if (!trusted) fail("CERT_CHAIN_INVALID", "certificate chain does not reach a trusted CA");
  } else if (options.allowSelfSignedRoot === true) {
    let selfSigned = false;
    try {
      selfSigned = root.verify(root.publicKey);
    } catch {
      selfSigned = false;
    }
    if (!selfSigned) {
      fail("CERT_CHAIN_INVALID", "root certificate is not self-signed and no trusted CA was given");
    }
  } else {
    fail("CERT_CHAIN_INVALID", "no trusted CA configured for x5u chain verification");
  }

  const leaf = chain[0];
  if (leaf === undefined) fail("CERT_CHAIN_INVALID", "certificate chain is empty");
  return leaf.publicKey;
}

function checkCertificateHost(certificate: X509Certificate, hostnames: readonly string[]): void {
  if (hostnames.length === 0) return;
  for (const hostname of hostnames) {
    let matches = false;
    try {
      matches = certificate.checkHost(hostname) !== undefined;
    } catch {
      matches = false;
    }
    if (matches) return;
  }
  fail(
    "HOSTNAME_MISMATCH",
    `signing certificate does not match expected host(s): ${hostnames.join(", ")}`,
    certificate.subject,
  );
}

function collectHostnames(options: JwsVerifyOptions, sourceUrl: string | undefined): string[] {
  if (options.skipHostnameCheck === true) return [];
  let locationHost: string | undefined;
  if (options.locationUrl !== undefined) {
    locationHost = parseUrl(options.locationUrl, "locationUrl").hostname;
  }
  if (locationHost !== undefined && sourceUrl !== undefined) {
    const sourceHost = parseUrl(sourceUrl, "key source URL").hostname;
    if (sourceHost !== locationHost) {
      fail(
        "HOSTNAME_MISMATCH",
        `key source host ${sourceHost} does not match location host ${locationHost}`,
      );
    }
  }
  if (locationHost !== undefined) return [locationHost];
  if (options.expectedHostname !== undefined) {
    return typeof options.expectedHostname === "string"
      ? [options.expectedHostname]
      : [...options.expectedHostname];
  }
  if (sourceUrl !== undefined) return [parseUrl(sourceUrl, "key source URL").hostname];
  return [];
}

function firstCertificate(chain: readonly X509Certificate[], kind: string): X509Certificate {
  const leaf = chain[0];
  if (leaf === undefined) fail("INVALID_KEY", `${kind} chain contains no certificate`);
  return leaf;
}

function certificateChain(kind: "x5u" | "x5c", pemText: string): X509Certificate[] {
  const chain = extractCertificates(pemText);
  if (chain.length === 0) {
    fail("INVALID_KEY", `${kind} document contains no X.509 certificate`);
  }
  return chain;
}

async function resolveKey(
  header: JwsHeader,
  options: JwsVerifyOptions,
): Promise<{ readonly key: KeyObject; readonly source: JwsKeySource }> {
  if (header.x5u !== undefined) {
    const url = parseUrl(header.x5u, "x5u").toString();
    const text = await fetchKeyDocument(url, options);
    const chain = certificateChain("x5u", text);
    checkCertificateHost(firstCertificate(chain, "x5u"), collectHostnames(options, url));
    return {
      key: verifyChain(chain, options),
      source: { kind: "x5u", url, certificate: chain[0], keyId: header.kid },
    };
  }

  if (header.jku !== undefined) {
    const url = parseUrl(header.jku, "jku").toString();
    const text = await fetchKeyDocument(url, options);
    const key = keyFromJwkSet(text, header);
    const hosts = collectHostnames(options, url);
    if (hosts.length > 0 && !hosts.includes(parseUrl(url, "jku").hostname)) {
      fail("HOSTNAME_MISMATCH", `jku host does not match expected host(s): ${hosts.join(", ")}`);
    }
    return { key, source: { kind: "jku", url, certificate: undefined, keyId: header.kid } };
  }

  if (header.x5c !== undefined && header.x5c.length > 0) {
    let chain: X509Certificate[];
    try {
      chain = header.x5c.map((entry) => new X509Certificate(Buffer.from(entry, "base64")));
    } catch (error) {
      fail("INVALID_KEY", "x5c contains an invalid X.509 certificate", String(error));
    }
    checkCertificateHost(firstCertificate(chain, "x5c"), collectHostnames(options, undefined));
    return {
      key: verifyChain(chain, options),
      source: { kind: "x5c", url: undefined, certificate: chain[0], keyId: header.kid },
    };
  }

  fail("MISSING_KEY_SOURCE", "JWS header must provide x5u, jku or x5c to locate the signing key");
}

function keyFromJwkSet(text: string, header: JwsHeader): KeyObject {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    fail("INVALID_KEY", "jku document is not valid JSON");
  }
  if (!isRecord(parsed) || !Array.isArray(parsed["keys"])) {
    fail("INVALID_KEY", "jku document must be a JWK Set with a keys array");
  }
  const keys = parsed["keys"].filter(isRecord);
  let candidates = keys.filter((jwk) => {
    const use = jwk["use"];
    const operations = jwk["key_ops"];
    const alg = jwk["alg"];
    return (
      (use === undefined || use === "sig") &&
      (operations === undefined || (Array.isArray(operations) && operations.includes("verify"))) &&
      (alg === undefined || alg === header.alg)
    );
  });
  if (header.kid !== undefined) {
    candidates = candidates.filter((jwk) => jwk["kid"] === header.kid);
  }
  const selected = candidates[0];
  if (selected === undefined) {
    fail("INVALID_KEY", "jku document has no usable signing key for this JWS header");
  }
  try {
    return createPublicKey({ key: selected as never, format: "jwk" });
  } catch (error) {
    fail("INVALID_KEY", "jku key is not a valid public JWK", String(error));
  }
}

function verifySignature(
  alg: JwsAlgorithm,
  signingInput: Buffer,
  signature: Buffer,
  key: KeyObject,
): void {
  const keyType = key.asymmetricKeyType;
  if (alg === "ES256") {
    if (keyType !== "ec") fail("INVALID_KEY", "ES256 requires an EC signing key");
    const curve = key.asymmetricKeyDetails?.namedCurve;
    if (curve !== "prime256v1" && curve !== "secp256r1") {
      fail("INVALID_KEY", `ES256 requires the P-256 curve, received ${String(curve)}`);
    }
  } else if (keyType !== "rsa" && keyType !== "rsa-pss") {
    fail("INVALID_KEY", `${alg} requires an RSA signing key`);
  }

  const algorithm = "sha256";
  let verified = false;
  try {
    if (alg === "RS256") {
      verified = cryptoVerify(algorithm, signingInput, key, signature);
    } else if (alg === "PS256") {
      verified = cryptoVerify(
        algorithm,
        signingInput,
        {
          key,
          padding: constants.RSA_PKCS1_PSS_PADDING,
          saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
        },
        signature,
      );
    } else {
      verified = cryptoVerify(
        algorithm,
        signingInput,
        { key, dsaEncoding: "ieee-p1363" },
        signature,
      );
    }
  } catch (error) {
    fail("BAD_SIGNATURE", "JWS signature could not be verified", String(error));
  }
  if (!verified) fail("BAD_SIGNATURE", "JWS signature is invalid");
}

function validateWith(
  schema: Exclude<PayloadSchema, "auto">,
  value: unknown,
): ValidationResult<unknown> {
  switch (schema) {
    case "cob":
      return validateCobPayload(value);
    case "cobv":
      return validateCobVPayload(value);
    case "rec":
      return validateRecPayload(value);
  }
}

function parsePayload(
  bytes: Buffer,
  schema: PayloadSchema | false,
): { readonly payload: unknown; readonly kind: PayloadSchema | undefined } {
  let value: unknown;
  try {
    value = JSON.parse(bytes.toString("utf8")) as unknown;
  } catch {
    fail("INVALID_PAYLOAD", "JWS payload is not valid JSON");
  }
  if (schema === false) return { payload: value, kind: undefined };

  if (schema === "auto") {
    let firstIssues = "";
    for (const candidate of ["cob", "cobv", "rec"] as const) {
      const result = validateWith(candidate, value);
      if (result.ok) return { payload: result.value, kind: candidate };
      if (firstIssues === "") {
        firstIssues = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ");
      }
    }
    fail("INVALID_PAYLOAD", "JWS payload does not match any Pix payload schema", firstIssues);
  }

  const result = validateWith(schema, value);
  if (!result.ok) {
    fail(
      "INVALID_PAYLOAD",
      `JWS payload does not match the ${schema} schema`,
      result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; "),
    );
  }
  return { payload: result.value, kind: schema };
}

/**
 * Verifies a compact JWS and returns its validated payload.
 */
export async function verifyJws<T = unknown>(
  jws: string,
  options: JwsVerifyOptions = {},
): Promise<VerifiedJws<T>> {
  const compact = jws.trim();
  const segments = compact.split(".");
  if (segments.length !== 3 || segments.some((segment) => segment === "")) {
    fail("INVALID_COMPACT", "JWS must be three non-empty base64url segments");
  }
  const [headerSegment, payloadSegment, signatureSegment] = segments as [string, string, string];

  const headerBytes = decodeBase64Url(headerSegment, "header");
  const payloadBytes = decodeBase64Url(payloadSegment, "payload");
  const signature = decodeBase64Url(signatureSegment, "signature");
  const header = parseHeader(headerBytes);

  const { key, source } = await resolveKey(header, options);
  const signingInput = Buffer.from(`${headerSegment}.${payloadSegment}`, "ascii");
  verifySignature(header.alg, signingInput, signature, key);

  const parsed = parsePayload(payloadBytes, options.payloadSchema ?? "auto");
  return {
    header,
    payload: parsed.payload as T,
    payloadBytes,
    signature,
    signingInput,
    keySource: source,
    payloadKind: parsed.kind,
  };
}
