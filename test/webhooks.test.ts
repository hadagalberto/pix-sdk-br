/** Framework-agnostic webhook parsing: valid and invalid vectors per family. */

import { describe, expect, it } from "vitest";
import { specExamples } from "../src/generated/examples.js";
import {
  parseWebhook,
  parseWebhookOrThrow,
  PixWebhookError,
  type WebhookParseSuccess,
} from "../src/webhooks/parse.js";

const ex = (name: string): Record<string, unknown> => specExamples[name] as Record<string, unknown>;

// The spec's `pixWebhook1` example encodes `devolucoes` as an object while the
// generated `PixConsultado` schema requires an array — normalize that erratum
// into a known-valid vector.
const rawPix1 = ex("pixWebhook1");
const pix1 = {
  ...rawPix1,
  devolucoes: [rawPix1["devolucoes"]],
};
const pixBody = {
  pix: [pix1, ex("pixWebhook2")],
};
const recBody = ex("recWebhookNotification1");
const cobrBody = {
  cobsr: [
    {
      idRec: "RR1234567820240115abcdefghijk",
      txid: "3136957d93134f2184b369e8f1c0729d",
      status: "ATIVA",
      atualizacao: [{ status: "ATIVA", data: "2024-08-20T12:34:21.300Z" }],
      valor: { original: "100.00" },
    },
  ],
};
const cobBody = { cobs: [ex("cobPayload1")] };
const cobvSources = (specExamples["getCobsV1"] as { cobs: readonly unknown[] }).cobs;
const cobvBody = {
  cobsv: cobvSources.map((charge) => ({
    ...(charge as Record<string, unknown>),
    loc: {
      ...(charge as { loc: Record<string, unknown> }).loc,
      criacao: "2020-09-15T19:39:54.013Z",
    },
  })),
};

describe("parseWebhook — known-valid vectors", () => {
  it("parses a Pix callback from JSON text", () => {
    const result = parseWebhook(JSON.stringify(pixBody));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.kind).toBe("pix");
    if (result.kind !== "pix") return;
    expect(result.data.pix).toHaveLength(2);
    expect(result.data.pix?.[0]?.valor).toBe("110.00");
  });

  it("parses a Pix callback from an already-parsed object", () => {
    const result = parseWebhook(pixBody);
    expect(result).toEqual({ ok: true, kind: "pix", data: pixBody });
  });

  it("parses a recorrência callback", () => {
    const result = parseWebhook(JSON.stringify(recBody));
    expect(result.ok).toBe(true);
    if (result.ok && result.kind === "rec") {
      expect(result.data.recs?.[0]?.status).toBe("APROVADA");
    }
  });

  it("parses a cobrança recorrente callback", () => {
    const result = parseWebhook(cobrBody);
    expect(result.ok).toBe(true);
    if (result.ok && result.kind === "cobr") {
      expect(result.data.cobsr?.[0]?.valor?.original).toBe("100.00");
    }
  });

  it("parses a cobrança imediata callback", () => {
    const result = parseWebhook(cobBody);
    expect(result.ok).toBe(true);
    if (result.ok && result.kind === "cob") {
      expect(result.data.cobs?.[0]?.txid).toBe("fc9a4366ff3d4964b5dbc6c91a8722d3");
    }
  });

  it("parses a cobrança com vencimento callback", () => {
    const result = parseWebhook(cobvBody);
    expect(result.ok).toBe(true);
    if (result.ok && result.kind === "cobv") {
      expect(result.data.cobsv?.length).toBeGreaterThan(0);
    }
  });

  it("accepts an empty callback array (spec has no minItems)", () => {
    expect(parseWebhook({ pix: [] })).toEqual({ ok: true, kind: "pix", data: { pix: [] } });
  });

  it("allows additional top-level properties by default", () => {
    expect(parseWebhook({ ...pixBody, traceId: "abc" }).ok).toBe(true);
  });
});

describe("parseWebhook — known-invalid vectors", () => {
  it("rejects malformed JSON", () => {
    const result = parseWebhook("{not json");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe("invalid-json");
      expect(result.kind).toBeUndefined();
    }
  });

  it.each([null, 42, [], true])("rejects non-object input %j", (input) => {
    const result = parseWebhook(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]?.code).toBe("not-object");
  });

  it("treats a plain string as JSON text, not as an already-parsed value", () => {
    const result = parseWebhook("plain text");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]?.code).toBe("invalid-json");
  });

  it("rejects a body with no callback family", () => {
    const result = parseWebhook({ unexpected: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe("missing-kind");
      expect(result.issues[0]?.message).toContain("pix");
    }
  });

  it("rejects an ambiguous body with two families", () => {
    const result = parseWebhook({ pix: [], recs: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe("ambiguous-kind");
      expect(result.issues[0]?.message).toContain("pix");
      expect(result.issues[0]?.message).toContain("recs");
    }
  });

  it("rejects a non-array callback value", () => {
    const result = parseWebhook({ pix: "not an array" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("pix");
      expect(result.issues[0]?.code).toBe("invalid-body");
      expect(result.issues[0]?.path).toBe("pix");
    }
  });

  it("reports the exact field path of an invalid Pix item", () => {
    const invalid = { pix: [{ ...pix1, valor: "not-money" }] };
    const result = parseWebhook(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("pix");
      expect(result.issues.some((issue) => issue.path === "pix[0].valor")).toBe(true);
    }
  });

  it("rejects an invalid endToEndId / txid pair", () => {
    const result = parseWebhook({
      pix: [{ ...ex("pixWebhook2"), txid: "too-short" }],
    });
    expect(result.ok).toBe(false);
  });

  it("rejects the spec's own malformed cobR example (bad date and missing field)", () => {
    const result = parseWebhook(ex("cobRWebhookNotification1"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("cobr");
      expect(result.issues.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("rejects unknown top-level fields in strict mode", () => {
    const result = parseWebhook({ ...pixBody, unknownField: 1 }, { strict: true });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe("unexpected-field");
      expect(result.issues[0]?.path).toBe("unknownField");
    }
  });

  it("reports strict-mode issues together with body issues", () => {
    const result = parseWebhook({ pix: "oops", extra: true }, { strict: true });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toEqual(
        expect.arrayContaining(["unexpected-field", "invalid-body"]),
      );
    }
  });
});

describe("parseWebhookOrThrow", () => {
  it("returns the typed success value", () => {
    const result: WebhookParseSuccess = parseWebhookOrThrow(pixBody);
    expect(result.kind).toBe("pix");
  });

  it("throws PixWebhookError carrying all issues", () => {
    expect(() => parseWebhookOrThrow({})).toThrow(PixWebhookError);
    try {
      parseWebhookOrThrow({});
    } catch (error) {
      expect(error).toBeInstanceOf(PixWebhookError);
      expect((error as PixWebhookError).issues[0]?.code).toBe("missing-kind");
      expect((error as PixWebhookError).message).toContain("Invalid webhook payload");
    }
  });
});
