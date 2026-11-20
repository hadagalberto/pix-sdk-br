/** Money helpers: string "0.00" <-> integer cents. */

import { describe, expect, it } from "vitest";
import { formatMoney, fromCents, fromReais, parseMoney, toCents } from "../src/money.js";

describe("toCents", () => {
  it.each([
    ["0.00", 0],
    ["10.00", 1000],
    ["0.01", 1],
    ["1234.56", 123456],
    ["999999999999.99", 99999999999999],
  ])("parses %s into %i cents", (value, expected) => {
    expect(toCents(value)).toBe(expected);
    expect(parseMoney(value)).toBe(expected);
  });

  it.each(["10", "10.0", "10.000", "-1.00", "1e2.00", "abc", "", "1,00", " 1.00 "])(
    "rejects malformed value %j",
    (value) => {
      expect(() => toCents(value)).toThrow(TypeError);
    },
  );
});

describe("fromCents", () => {
  it.each([
    [0, "0.00"],
    [1, "0.01"],
    [1000, "10.00"],
    [123456, "1234.56"],
    [-25, "-0.25"],
  ])("formats %i cents as %s", (cents, expected) => {
    expect(fromCents(cents)).toBe(expected);
    expect(formatMoney(cents)).toBe(expected);
  });

  it("round-trips every value", () => {
    for (const cents of [0, 1, 99, 100, 999, 1000, 123456, 99999999999999]) {
      expect(toCents(fromCents(cents))).toBe(cents);
    }
  });

  it.each([1.5, Number.NaN, Number.POSITIVE_INFINITY])("rejects non-integer cents %s", (value) => {
    expect(() => fromCents(value)).toThrow(RangeError);
  });
});

describe("fromReais", () => {
  it("converts numbers and loose strings, rounding safely", () => {
    expect(fromReais(10)).toBe("10.00");
    expect(fromReais(10.1)).toBe("10.10");
    expect(fromReais("10.1")).toBe("10.10");
    expect(fromReais("0.005")).toBe("0.01");
    expect(fromReais(-3.5)).toBe("-3.50");
  });

  it.each(["abc", "", Number.NaN])("rejects non-finite input %j", (value) => {
    expect(() => fromReais(value)).toThrow(TypeError);
  });

  it("rejects values beyond the safe integer range", () => {
    expect(() => fromReais(1e15)).toThrow(RangeError);
  });
});
