/** txid generation conforming to the BCB spec pattern `[a-zA-Z0-9]{26,35}`. */

import { randomBytes } from "node:crypto";

export const TXID_MIN_LENGTH = 26;
export const TXID_MAX_LENGTH = 35;
export const TXID_DEFAULT_LENGTH = 32;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** 62 characters × 4 = 248; bytes ≥ 248 are rejected to avoid modulo bias. */
const REJECTION_THRESHOLD = 248;

/** Generates a cryptographically random, spec-conformant transaction id. */
export function generateTxid(length: number = TXID_DEFAULT_LENGTH): string {
  if (!Number.isInteger(length) || length < TXID_MIN_LENGTH || length > TXID_MAX_LENGTH) {
    throw new RangeError(
      `txid length must be an integer in [${String(TXID_MIN_LENGTH)}, ${String(TXID_MAX_LENGTH)}]`,
    );
  }

  let result = "";
  while (result.length < length) {
    const bytes = randomBytes((length - result.length) * 2);
    for (const byte of bytes) {
      if (byte >= REJECTION_THRESHOLD) continue;
      const character = ALPHABET[byte % ALPHABET.length];
      if (character === undefined) continue;
      result += character;
      if (result.length === length) break;
    }
  }
  return result;
}
