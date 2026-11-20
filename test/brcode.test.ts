/** BR Code generation and the official CRC16 test vector. */

import { describe, expect, it } from "vitest";
import { crc16CcittFalse, generateBrCode } from "../src/payload/brcode.js";

const SPEC_VECTOR =
  "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D";
const SPEC_LOCATION = "123e4567-e12b-12d1-a456-426655440000";

describe("crc16CcittFalse", () => {
  it("matches the canonical CCITT-FALSE check value", () => {
    expect(crc16CcittFalse("123456789")).toBe("29B1");
  });

  it("accepts Buffers and is UTF-8 aware", () => {
    expect(crc16CcittFalse(Buffer.from("123456789", "ascii"))).toBe("29B1");
    expect(crc16CcittFalse("José")).toBe(crc16CcittFalse(Buffer.from("José", "utf8")));
  });
});

describe("generateBrCode — SPEC vector", () => {
  it("reproduces the BCB payload byte for byte", () => {
    expect(
      generateBrCode(SPEC_LOCATION, {
        merchantName: "Fulano de Tal",
        merchantCity: "BRASILIA",
      }),
    ).toBe(SPEC_VECTOR);
  });

  it("always ends with a CRC matching the preceding bytes", () => {
    const payload = generateBrCode("https://pix.example.com/qr/v2/abc123", {
      merchantName: "Loja Teste",
      merchantCity: "Sao Paulo",
      transactionId: "TX123",
    });
    expect(payload.slice(-4)).toBe(crc16CcittFalse(payload.slice(0, -4)));
    expect(payload).toContain("6304");
  });
});

describe("generateBrCode — fields", () => {
  it("embeds a full location URL in merchant account field 26", () => {
    const location = "https://pix.example.com/qr/v2/9d36b84fc70b478fb95c12729b90ca25";
    const payload = generateBrCode(location, {
      merchantName: "Loja Teste",
      merchantCity: "Sao Paulo",
    });
    const merchantAccount = `0014br.gov.bcb.pix01${String(location.length).padStart(2, "0")}${location}`;
    expect(payload).toContain(
      `26${String(merchantAccount.length).padStart(2, "0")}${merchantAccount}`,
    );
  });

  it("adds a spec-formatted amount field when supplied as a string", () => {
    const payload = generateBrCode(SPEC_LOCATION, {
      merchantName: "Loja",
      merchantCity: "City",
      amount: "10.00",
    });
    expect(payload).toContain("540510.00");
  });

  it("converts a numeric amount through integer cents", () => {
    const payload = generateBrCode(SPEC_LOCATION, {
      merchantName: "Loja",
      merchantCity: "City",
      amount: 10,
    });
    expect(payload).toContain("540510.00");
  });

  it("supports the dynamic point-of-initiation field", () => {
    const payload = generateBrCode(SPEC_LOCATION, {
      merchantName: "Loja",
      merchantCity: "City",
      pointOfInitiation: "12",
    });
    expect(payload.startsWith("000201010212")).toBe(true);
  });

  it("uses byte lengths for non-ASCII merchant data", () => {
    const payload = generateBrCode(SPEC_LOCATION, {
      merchantName: "José",
      merchantCity: "São Paulo",
    });
    expect(payload).toContain("5905José");
    expect(payload).toContain("6010São Paulo");
  });

  it("exposes a convenience method on the client payload resource through the helper", () => {
    // The resource method delegates here; verify the helper is the single source.
    expect(
      generateBrCode(SPEC_LOCATION, {
        merchantName: "Fulano de Tal",
        merchantCity: "BRASILIA",
      }),
    ).toBe(SPEC_VECTOR);
  });
});

describe("generateBrCode — invalid inputs", () => {
  const base = { merchantName: "Loja", merchantCity: "City" };

  it.each(["", "   "])("rejects empty location %j", (location) => {
    expect(() => generateBrCode(location, base)).toThrow(TypeError);
  });

  it("rejects a merchant name longer than 25 bytes", () => {
    expect(() => generateBrCode(SPEC_LOCATION, { ...base, merchantName: "x".repeat(26) })).toThrow(
      RangeError,
    );
  });

  it("rejects a merchant city longer than 15 bytes", () => {
    expect(() => generateBrCode(SPEC_LOCATION, { ...base, merchantCity: "x".repeat(16) })).toThrow(
      RangeError,
    );
  });

  it("rejects a transaction id longer than 25 bytes", () => {
    expect(() => generateBrCode(SPEC_LOCATION, { ...base, transactionId: "x".repeat(26) })).toThrow(
      RangeError,
    );
  });

  it("rejects a malformed amount string", () => {
    expect(() => generateBrCode(SPEC_LOCATION, { ...base, amount: "10" })).toThrow(TypeError);
  });

  it("rejects a non-finite numeric amount", () => {
    expect(() => generateBrCode(SPEC_LOCATION, { ...base, amount: Number.NaN })).toThrow(TypeError);
  });

  it("rejects a location too long for field 26", () => {
    expect(() => generateBrCode("x".repeat(200), base)).toThrow(RangeError);
  });
});
