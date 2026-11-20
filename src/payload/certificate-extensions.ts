/**
 * Minimal DER reader for the two X.509 extensions needed to validate a JWS
 * certificate path: Basic Constraints (cA / pathLenConstraint) and Key Usage.
 *
 * Node's `X509Certificate` does not expose `pathLenConstraint` (and `ca` /
 * `keyUsage` only exist on recent Node releases), so reading the DER avoids a
 * runtime dependency and behaves identically on every supported Node version.
 * Only the small, fixed structure below is parsed; malformed encodings fail
 * closed (treated as "not a CA" / "no usable key usage").
 */

import type { X509Certificate } from "node:crypto";

export interface CertificateExtensions {
  /** Basic Constraints cA. Absent extension/malformed value means `false`. */
  readonly ca: boolean;
  /** Basic Constraints pathLenConstraint, when present. */
  readonly pathLen: number | undefined;
  /** Decoded Key Usage bit names; `undefined` when the extension is absent. */
  readonly keyUsage: ReadonlySet<string> | undefined;
}

interface Tlv {
  readonly tag: number;
  readonly start: number;
  readonly end: number;
}

const BASIC_CONSTRAINTS_OID = Buffer.from([0x55, 0x1d, 0x13]);
const KEY_USAGE_OID = Buffer.from([0x55, 0x1d, 0x0f]);

/** RFC 5280 KeyUsage bit positions (first bit is the most significant). */
const KEY_USAGE_BITS = [
  "digitalSignature",
  "nonRepudiation",
  "keyEncipherment",
  "dataEncipherment",
  "keyAgreement",
  "keyCertSign",
  "cRLSign",
  "encipherOnly",
  "decipherOnly",
] as const;

function readTlv(bytes: Buffer, offset: number): Tlv | undefined {
  if (offset + 2 > bytes.length) return undefined;
  const tag = bytes[offset];
  if (tag === undefined) return undefined;
  const firstLength = bytes[offset + 1];
  if (firstLength === undefined) return undefined;
  let contentStart = offset + 2;
  let length = firstLength;
  if ((firstLength & 0x80) !== 0) {
    const count = firstLength & 0x7f;
    // Indefinite length is forbidden in DER; 4-byte lengths are more than enough.
    if (count === 0 || count > 4 || contentStart + count > bytes.length) return undefined;
    length = 0;
    for (let index = 0; index < count; index += 1) {
      const byte = bytes[contentStart + index];
      if (byte === undefined) return undefined;
      length = length * 256 + byte;
    }
    contentStart += count;
  }
  const end = contentStart + length;
  if (end > bytes.length) return undefined;
  return { tag, start: contentStart, end };
}

function children(bytes: Buffer, parent: Tlv): Tlv[] {
  const result: Tlv[] = [];
  let offset = parent.start;
  while (offset < parent.end) {
    const child = readTlv(bytes, offset);
    if (child === undefined || child.end > parent.end) break;
    result.push(child);
    offset = child.end;
  }
  return result;
}

function content(bytes: Buffer, tlv: Tlv): Buffer {
  return bytes.subarray(tlv.start, tlv.end);
}

function parseBasicConstraints(bytes: Buffer, value: Tlv): Omit<CertificateExtensions, "keyUsage"> {
  // extnValue is an OCTET STRING wrapping the DER of `BasicConstraints ::=
  // SEQUENCE { cA BOOLEAN DEFAULT FALSE, pathLenConstraint INTEGER OPTIONAL }`.
  const sequence = children(bytes, value)[0];
  if (sequence?.tag !== 0x30) {
    return { ca: false, pathLen: undefined };
  }
  const members = children(bytes, sequence);
  let ca = false;
  let pathLen: number | undefined;
  const first = members[0];
  if (first?.tag === 0x01) {
    const flag = bytes[first.start];
    ca = flag !== undefined && flag !== 0x00;
  }
  const integerIndex = first?.tag === 0x01 ? 1 : 0;
  const integer = members[integerIndex];
  if (integer?.tag === 0x02) {
    const raw = content(bytes, integer);
    let parsed = 0;
    for (const byte of raw) parsed = parsed * 256 + byte;
    if (raw.length > 0 && (raw[0] ?? 0) < 0x80 && Number.isSafeInteger(parsed)) pathLen = parsed;
  }
  return { ca, pathLen };
}

function parseKeyUsage(bytes: Buffer, value: Tlv): ReadonlySet<string> | undefined {
  const bitString = children(bytes, value)[0];
  if (bitString?.tag !== 0x03) return undefined;
  const raw = content(bytes, bitString);
  if (raw.length < 2) return undefined;
  const unusedBits = raw[0] ?? 0;
  const data = raw.subarray(1);
  const names = new Set<string>();
  const usableBits = data.length * 8 - unusedBits;
  for (let bit = 0; bit < Math.min(usableBits, KEY_USAGE_BITS.length); bit += 1) {
    const byte = data[bit >>> 3];
    const name = KEY_USAGE_BITS[bit];
    if (name !== undefined && byte !== undefined && (byte & (0x80 >>> (bit & 7))) !== 0) {
      names.add(name);
    }
  }
  return names;
}

/** Strict extension view used by the chain-validation regression vectors. */
export interface ChainExtensions {
  readonly basicConstraints: { readonly ca: boolean; readonly pathLen: number | undefined };
  readonly keyUsage: Readonly<Record<string, boolean>> | undefined;
}

/**
 * Parses Basic Constraints and Key Usage with strict DER validation (malformed
 * extension bytes throw `RangeError`). Accepts both a complete certificate and
 * a TBSCertificate-shaped structure whose first child is the [3] wrapper.
 */
export function readChainExtensions(certificate: { readonly raw: Uint8Array }): ChainExtensions {
  const bytes = Buffer.from(certificate.raw);
  const outer = readTlv(bytes, 0);
  if (outer?.tag !== 0x30) throw new RangeError("malformed certificate DER");
  const outerChildren = children(bytes, outer);
  let wrapper = outerChildren.find((tlv) => tlv.tag === 0xa3);
  if (wrapper === undefined) {
    const tbs = outerChildren[0];
    if (tbs?.tag !== 0x30) throw new RangeError("malformed TBSCertificate DER");
    wrapper = children(bytes, tbs).find((tlv) => tlv.tag === 0xa3);
  }
  if (wrapper === undefined) {
    return { basicConstraints: { ca: false, pathLen: undefined }, keyUsage: undefined };
  }
  const sequence = children(bytes, wrapper)[0];
  if (sequence?.tag !== 0x30) {
    throw new RangeError("malformed extensions DER");
  }

  let basicConstraints = { ca: false, pathLen: undefined as number | undefined };
  let keyUsage: Record<string, boolean> | undefined;
  for (const extension of children(bytes, sequence)) {
    if (extension.tag !== 0x30) throw new RangeError("malformed extension DER");
    const parts = children(bytes, extension);
    const oid = parts[0];
    const value = parts.find((part) => part.tag === 0x04);
    if (oid?.tag !== 0x06 || value === undefined) {
      throw new RangeError("malformed extension DER");
    }
    const oidBytes = content(bytes, oid);
    if (oidBytes.equals(BASIC_CONSTRAINTS_OID)) {
      const parsed = parseBasicConstraints(bytes, value);
      basicConstraints = { ca: parsed.ca, pathLen: parsed.pathLen };
    } else if (oidBytes.equals(KEY_USAGE_OID)) {
      const bitString = children(bytes, value)[0];
      if (bitString?.tag !== 0x03) {
        throw new RangeError("malformed keyUsage extension");
      }
      const raw = content(bytes, bitString);
      const unusedBits = raw[0] ?? 8;
      if (unusedBits > 7 || raw.length < 2 || unusedBits >= raw.length * 8) {
        throw new RangeError("malformed keyUsage BIT STRING");
      }
      keyUsage = {};
      for (let bit = 0; bit < KEY_USAGE_BITS.length; bit += 1) {
        const name = KEY_USAGE_BITS[bit];
        const byte = raw[1 + (bit >>> 3)] ?? 0;
        if (name !== undefined) keyUsage[name] = (byte & (0x80 >>> (bit & 7))) !== 0;
      }
    }
  }
  return { basicConstraints, keyUsage };
}

const cache = new WeakMap<X509Certificate, CertificateExtensions>();

/** Reads Basic Constraints and Key Usage from a certificate's DER encoding. */
export function readCertificateExtensions(certificate: X509Certificate): CertificateExtensions {
  const cached = cache.get(certificate);
  if (cached !== undefined) return cached;
  const empty: CertificateExtensions = { ca: false, pathLen: undefined, keyUsage: undefined };
  const bytes = Buffer.from(certificate.raw);
  const certificateTlv = readTlv(bytes, 0);
  if (certificateTlv?.tag !== 0x30) {
    cache.set(certificate, empty);
    return empty;
  }
  const tbs = children(bytes, certificateTlv)[0];
  if (tbs?.tag !== 0x30) {
    cache.set(certificate, empty);
    return empty;
  }
  const extensionsWrapper = children(bytes, tbs).find((tlv) => tlv.tag === 0xa3);
  if (extensionsWrapper === undefined) {
    cache.set(certificate, empty);
    return empty;
  }
  const extensions = children(bytes, extensionsWrapper)[0];
  if (extensions?.tag !== 0x30) {
    cache.set(certificate, empty);
    return empty;
  }

  let result: CertificateExtensions = empty;
  for (const extension of children(bytes, extensions)) {
    if (extension.tag !== 0x30) continue;
    const parts = children(bytes, extension);
    const oid = parts[0];
    if (oid?.tag !== 0x06) continue;
    const value = parts.find((part) => part.tag === 0x04);
    if (value === undefined) continue;
    const oidBytes = content(bytes, oid);
    if (oidBytes.equals(BASIC_CONSTRAINTS_OID)) {
      const basicConstraints = parseBasicConstraints(bytes, value);
      result = { ...result, ...basicConstraints };
    } else if (oidBytes.equals(KEY_USAGE_OID)) {
      result = { ...result, keyUsage: parseKeyUsage(bytes, value) };
    }
  }
  cache.set(certificate, result);
  return result;
}
