/** PSP presets: only officially confirmed endpoints, with real vectors. */

import { describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import type { HttpFetch } from "../src/client/types.js";
import {
  PSP_PRESETS,
  UNCONFIRMED_PSPS,
  endpointsFor,
  getPspPreset,
  isPspEnvironment,
  isPspId,
  listPspPresets,
  parsePspEnvironment,
  parsePspId,
  presetClientOptions,
  type PspEnvironment,
  type PspId,
} from "../src/presets.js";

const EXPECTED: Readonly<
  Record<
    PspId,
    Readonly<Record<PspEnvironment, { readonly baseUrl: string; readonly tokenUrl: string }>>
  >
> = {
  efi: {
    sandbox: {
      baseUrl: "https://pix-h.api.efipay.com.br",
      tokenUrl: "https://pix-h.api.efipay.com.br/oauth/token",
    },
    production: {
      baseUrl: "https://pix.api.efipay.com.br",
      tokenUrl: "https://pix.api.efipay.com.br/oauth/token",
    },
  },
  inter: {
    sandbox: {
      baseUrl: "https://cdpj-sandbox.partners.uatinter.co/pix/v2",
      tokenUrl: "https://cdpj-sandbox.partners.uatinter.co/oauth/v2/token",
    },
    production: {
      baseUrl: "https://cdpj.partners.bancointer.com.br/pix/v2",
      tokenUrl: "https://cdpj.partners.bancointer.com.br/oauth/v2/token",
    },
  },
};

const noNetworkFetch: HttpFetch = () =>
  Promise.resolve({
    status: 500,
    headers: { get: () => null },
    text: () => Promise.resolve(""),
  });

describe("PSP preset catalogue", () => {
  it("contains exactly the PSPs confirmed from official public docs", () => {
    expect(Object.keys(PSP_PRESETS).sort()).toEqual(["efi", "inter"]);
    expect(listPspPresets().map((preset) => preset.id)).toEqual(["efi", "inter"]);
  });

  it.each(["efi", "inter"] as const)(
    "%s has the documented endpoints for both environments",
    (id) => {
      const preset = getPspPreset(id);
      expect(preset.id).toBe(id);
      expect(preset.sandbox).toEqual(EXPECTED[id].sandbox);
      expect(preset.production).toEqual(EXPECTED[id].production);
      expect(endpointsFor(preset, "sandbox")).toEqual(EXPECTED[id].sandbox);
      expect(endpointsFor(preset, "production")).toEqual(EXPECTED[id].production);
    },
  );

  it("ships an official source URL and a verification date on every preset", () => {
    for (const preset of listPspPresets()) {
      expect(preset.sources.length).toBeGreaterThan(0);
      expect(preset.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(preset.verifiedOn).toBe("2026-11-20");
      expect(preset.name.length).toBeGreaterThan(0);
      for (const source of preset.sources) {
        expect(source.startsWith("https://")).toBe(true);
        expect(() => new URL(source)).not.toThrow();
      }
      for (const environment of ["sandbox", "production"] as const) {
        const endpoints = endpointsFor(preset, environment);
        const url = new URL(endpoints.baseUrl);
        const token = new URL(endpoints.tokenUrl);
        expect(url.protocol).toBe("https:");
        expect(token.protocol).toBe("https:");
        expect(token.origin).toBe(url.origin);
        expect(token.pathname.startsWith("/")).toBe(true);
      }
      expect(preset.sandbox.baseUrl).not.toBe(preset.production.baseUrl);
      expect(preset.sandbox.tokenUrl).not.toBe(preset.production.tokenUrl);
    }
  });

  it("documents every excluded PSP with an official portal and a concrete reason", () => {
    expect(UNCONFIRMED_PSPS.map((item) => item.name)).toEqual([
      "Sicoob",
      "Banco do Brasil",
      "Itaú",
      "Santander",
      "Sicredi",
    ]);
    for (const item of UNCONFIRMED_PSPS) {
      expect(item.docsUrl.startsWith("https://")).toBe(true);
      expect(item.reason.length).toBeGreaterThan(40);
    }
    const presetNames = new Set(listPspPresets().map((preset) => preset.name));
    for (const item of UNCONFIRMED_PSPS) expect(presetNames.has(item.name)).toBe(false);
  });
});

describe("preset parsing (known-valid and known-invalid vectors)", () => {
  it.each([
    ["efi", true],
    ["inter", true],
    ["EFI", false],
    ["nubank", false],
    ["", false],
  ] as const)("isPspId(%j) === %s", (value, expected) => {
    expect(isPspId(value)).toBe(expected);
  });

  it.each([
    ["sandbox", true],
    ["production", true],
    ["homologacao", false],
    ["prod", false],
    ["", false],
  ] as const)("isPspEnvironment(%j) === %s", (value, expected) => {
    expect(isPspEnvironment(value)).toBe(expected);
  });

  it.each(["efi", "inter"] as const)("parsePspId accepts %s", (value) => {
    expect(parsePspId(value)).toBe(value);
  });

  it("parsePspId rejects unknown ids with the supported list", () => {
    expect(() => parsePspId("itau")).toThrow(RangeError);
    expect(() => parsePspId("itau")).toThrow(/efi, inter/);
  });

  it.each(["sandbox", "production"] as const)("parsePspEnvironment accepts %s", (value) => {
    expect(parsePspEnvironment(value)).toBe(value);
  });

  it("parsePspEnvironment rejects typos", () => {
    expect(() => parsePspEnvironment("homologation")).toThrow(RangeError);
    expect(() => parsePspEnvironment("homologation")).toThrow(/sandbox or production/);
  });
});

describe("presetClientOptions", () => {
  it.each([
    ["efi", "sandbox"],
    ["efi", "production"],
    ["inter", "sandbox"],
    ["inter", "production"],
  ] as const)("produces real client options for %s/%s", (id, environment) => {
    const options = presetClientOptions(id, environment, {
      clientId: "test-client",
      clientSecret: "test-secret",
    });
    expect(options.baseUrl).toBe(EXPECTED[id][environment].baseUrl);
    expect(options.oauth?.tokenUrl).toBe(EXPECTED[id][environment].tokenUrl);
    expect(options.clientId).toBe("test-client");
    expect(options.clientSecret).toBe("test-secret");

    const client = new PixClient({ ...options, fetch: noNetworkFetch });
    expect(client.baseUrl.toString()).toBe(`${EXPECTED[id][environment].baseUrl}/`);
    expect(options.scopes).toEqual(getPspPreset(id).defaultScopes);
  });

  it("keeps preset scopes separate from caller-supplied scopes", () => {
    const options = presetClientOptions("efi", "sandbox", {
      clientId: "id",
      clientSecret: "secret",
    });
    expect(options.scopes).toContain("cob.read");
    expect(options.scopes).toContain("cob.write");
    expect(options.scopes).not.toContain("gn.balance.read");
  });

  it("does not invent options for unconfirmed PSPs", () => {
    expect(Object.keys(PSP_PRESETS)).not.toContain("sicoob");
    expect(Object.keys(PSP_PRESETS)).not.toContain("bb");
    expect(Object.keys(PSP_PRESETS)).not.toContain("itau");
    expect(Object.keys(PSP_PRESETS)).not.toContain("santander");
    expect(Object.keys(PSP_PRESETS)).not.toContain("sicredi");
  });
});
