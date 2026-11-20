/**
 * Money helpers for the BCB Pix API, where every `valor` is a decimal string
 * with exactly two fraction digits ("10.00"). Conversions go through integer
 * cents so no binary floating point accumulates in stored values.
 */

const DECIMAL_RE = /^(\d{1,12})\.(\d{2})$/;

/** Parses a Pix decimal string into integer cents. */
export function toCents(value: string): number {
  const match = DECIMAL_RE.exec(value);
  if (match === null) {
    throw new TypeError(`invalid Pix money value ${JSON.stringify(value)} (expected "0.00")`);
  }
  const reaisText = match[1];
  const centsText = match[2];
  if (reaisText === undefined || centsText === undefined) {
    throw new TypeError("invalid Pix money value");
  }
  const total = Number(reaisText) * 100 + Number(centsText);
  if (!Number.isSafeInteger(total)) {
    throw new RangeError(`Pix money value ${JSON.stringify(value)} exceeds the safe integer range`);
  }
  return total;
}

/** Formats integer cents as a Pix decimal string. */
export function fromCents(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new RangeError("cents must be a safe integer");
  }
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  const reais = Math.floor(absolute / 100);
  const remainder = absolute % 100;
  return `${sign}${String(reais)}.${String(remainder).padStart(2, "0")}`;
}

/** Converts a JS number or loose decimal string into a spec-compliant value. */
export function fromReais(value: number | string): string {
  if (typeof value === "string" && value.trim() === "") {
    throw new TypeError("money value must be a finite number");
  }
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    throw new TypeError("money value must be a finite number");
  }
  const cents = Math.round((numeric + Number.EPSILON) * 100);
  if (!Number.isSafeInteger(cents)) {
    throw new RangeError("money value exceeds the safe integer range");
  }
  return fromCents(cents);
}

/** Alias of `toCents` for call sites that prefer `parseMoney`. */
export const parseMoney = toCents;

/** Alias of `fromCents` for call sites that prefer `formatMoney`. */
export const formatMoney = fromCents;
