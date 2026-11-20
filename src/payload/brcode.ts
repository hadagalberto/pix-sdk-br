/**
 * BR Code (Pix "copia e cola" / QR payload) generation.
 *
 * The format is a sequence of `ID` + 2-digit `length` + `value` fields, closed
 * by a CRC16/CCITT-FALSE field (`6304`). The official BCB test vector is
 * reproduced by the unit tests:
 * `00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D`.
 */

import { fromReais } from "../money.js";

const PIX_GUI = "br.gov.bcb.pix";
const CRC_FIELD = "6304";

export interface BrCodeOptions {
  /** Merchant name (up to 25 bytes). Required by the BCB manual. */
  readonly merchantName: string;
  /** Merchant city (up to 15 bytes). Required by the BCB manual. */
  readonly merchantCity: string;
  /**
   * Transaction id placed in additional-data field `05`. Defaults to `***`
   * (used when the charge has no meaningful reconciliation id in the payload).
   */
  readonly transactionId?: string;
  /** Optional transaction amount. Strings must use the Pix "0.00" format. */
  readonly amount?: string | number;
  /** Point of initiation: `11` static, `12` dynamic. Omitted when not supplied. */
  readonly pointOfInitiation?: "11" | "12";
}

function byteLength(value: string): number {
  return Buffer.byteLength(value, "utf8");
}

function field(id: string, value: string): string {
  const length = byteLength(value);
  if (length > 99) {
    throw new RangeError(`BR Code field ${id} exceeds 99 bytes (received ${String(length)})`);
  }
  return `${id}${String(length).padStart(2, "0")}${value}`;
}

/**
 * CRC16/CCITT-FALSE (poly 0x1021, init 0xFFFF, no reflection, xorout 0) as the
 * uppercase 4-hex string used by the BR Code `6304` field.
 */
export function crc16CcittFalse(data: string | Buffer): string {
  const bytes = typeof data === "string" ? Buffer.from(data, "utf8") : data;
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Builds a BR Code from a charge `location`.
 *
 * Dynamic Pix (with a URL/token location) uses merchant account information
 * field `26`: GUI `br.gov.bcb.pix` (`00`) plus the Payload Location URL in
 * sub-field `25` **without** its `https://` scheme (the reader prepends it).
 * A bare key (no URL scheme) is a static Pix charge and stays in sub-field
 * `01`. See the BCB "Manual de Padrões para Iniciação do Pix".
 */
export function generateBrCode(location: string, options: BrCodeOptions): string {
  if (typeof location !== "string" || location.trim() === "") {
    throw new TypeError("location must be a non-empty string");
  }
  const merchantName = options.merchantName;
  const merchantCity = options.merchantCity;
  if (byteLength(merchantName) < 1 || byteLength(merchantName) > 25) {
    throw new RangeError("merchantName must be between 1 and 25 bytes");
  }
  if (byteLength(merchantCity) < 1 || byteLength(merchantCity) > 15) {
    throw new RangeError("merchantCity must be between 1 and 15 bytes");
  }

  const transactionId = options.transactionId ?? "***";
  if (byteLength(transactionId) < 1 || byteLength(transactionId) > 25) {
    throw new RangeError("transactionId must be between 1 and 25 bytes");
  }

  const normalizedLocation = location.trim();
  // BCB manual: a dynamic payload carries the location URL in sub-field 25,
  // scheme stripped (readers prepend https://). A schemeless value is a static
  // Pix key and continues to use the Pix-key slot 01.
  const isUrl = /^https?:\/\//i.test(normalizedLocation);
  const locationValue = isUrl
    ? normalizedLocation.replace(/^https?:\/\//i, "")
    : normalizedLocation;
  const merchantAccount = field("00", PIX_GUI) + field(isUrl ? "25" : "01", locationValue);
  let payload = field("00", "01");
  if (options.pointOfInitiation !== undefined) {
    payload += field("01", options.pointOfInitiation);
  }
  payload += field("26", merchantAccount);
  payload += field("52", "0000");
  payload += field("53", "986");
  if (options.amount !== undefined) {
    const amount = typeof options.amount === "number" ? fromReais(options.amount) : options.amount;
    if (!/^\d{1,12}\.\d{2}$/.test(amount)) {
      throw new TypeError(`invalid BR Code amount ${JSON.stringify(amount)} (expected "0.00")`);
    }
    payload += field("54", amount);
  }
  payload += field("58", "BR");
  payload += field("59", merchantName);
  payload += field("60", merchantCity);
  payload += field("62", field("05", transactionId));
  payload += CRC_FIELD + crc16CcittFalse(payload + CRC_FIELD);
  return payload;
}
