/** txid generator conformance. */

import { describe, expect, it } from "vitest";
import { generateTxid, TXID_MAX_LENGTH, TXID_MIN_LENGTH } from "../src/txid.js";
import { validateTxId } from "../src/generated/validators.js";

describe("generateTxid", () => {
  it("defaults to a spec-conformant 32-character id", () => {
    const txid = generateTxid();
    expect(txid).toHaveLength(32);
    expect(validateTxId(txid).ok).toBe(true);
  });

  it.each([TXID_MIN_LENGTH, 30, TXID_MAX_LENGTH])("honours length %i", (length) => {
    const txid = generateTxid(length);
    expect(txid).toHaveLength(length);
    expect(validateTxId(txid).ok).toBe(true);
  });

  it("uses only alphanumerics and is practically unique", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateTxid()));
    expect(ids.size).toBe(100);
    for (const id of ids) expect(id).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it.each([0, 25, 36, 1.5, Number.NaN])("rejects invalid length %s", (length) => {
    expect(() => generateTxid(length)).toThrow(RangeError);
  });
});
