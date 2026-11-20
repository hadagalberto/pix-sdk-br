/**
 * Unit tests for the hand-written validation engine: every constraint kind,
 * every string format, union semantics, issue paths and guard rails.
 */

import { describe, expect, it } from "vitest";
import {
  deepEqual,
  isRfc3339Date,
  isRfc3339DateTime,
  isUri,
  isValid,
  validate,
  type Constraint,
  type ConstraintRegistry,
} from "../src/validation/engine.js";

const registry: ConstraintRegistry = new Map<string, Constraint>([
  ["refString", { kind: "string", minLength: 2 }],
  [
    "refObject",
    {
      kind: "object",
      properties: { a: { kind: "ref", name: "refString" } },
      required: ["a"],
      additionalProperties: true,
    },
  ],
  [
    "cyclic",
    {
      kind: "object",
      properties: { child: { kind: "ref", name: "cyclic" } },
      required: [],
      additionalProperties: true,
    },
  ],
]);

function issuesOf(constraint: Constraint, value: unknown): string[] {
  const result = validate<unknown>(constraint, value, registry);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    return result.issues.map((issue) => `${issue.path}: ${issue.message}`);
  }
  throw new Error("expected failure");
}

describe("primitive constraints", () => {
  const stringConstraint: Constraint = {
    kind: "string",
    minLength: 2,
    maxLength: 5,
    pattern: /^[a-z]+$/,
  };

  it("accepts conforming strings", () => {
    expect(validate(stringConstraint, "abc", registry)).toEqual({ ok: true, value: "abc" });
  });

  it("rejects wrong types with a stable message", () => {
    expect(issuesOf(stringConstraint, 42)).toEqual([": expected string, received number"]);
    expect(issuesOf(stringConstraint, null)).toEqual([": expected string, received null"]);
    expect(issuesOf(stringConstraint, undefined)).toEqual([
      ": expected string, received undefined",
    ]);
    expect(issuesOf(stringConstraint, ["a"])).toEqual([": expected string, received array"]);
  });

  it("enforces minLength and maxLength with code-point counting", () => {
    expect(issuesOf(stringConstraint, "a")).toEqual([": string length 1 is less than minLength 2"]);
    expect(issuesOf(stringConstraint, "abcdef")).toEqual([": string length 6 exceeds maxLength 5"]);
    // 4 code points, 6 UTF-16 units: counts as 4 (emoji are one character).
    expect(validate({ kind: "string", maxLength: 5 }, "🎉🎉🎉🎉", registry).ok).toBe(true);
    expect(validate({ kind: "string", maxLength: 3 }, "🎉🎉🎉🎉", registry).ok).toBe(false);
  });

  it("enforces patterns", () => {
    expect(issuesOf(stringConstraint, "AB1")).toEqual([
      ": string does not match pattern /^[a-z]+$/",
    ]);
  });

  it("collects every failing string constraint at once", () => {
    expect(issuesOf(stringConstraint, "X")).toEqual([
      ": string length 1 is less than minLength 2",
      ": string does not match pattern /^[a-z]+$/",
    ]);
  });

  it("enforces enums with the allowed list in the message", () => {
    const enumConstraint: Constraint = { kind: "string", enumValues: ["ATIVA", "CONCLUIDA"] };
    expect(validate(enumConstraint, "ATIVA", registry).ok).toBe(true);
    expect(issuesOf(enumConstraint, "ativa")).toEqual([
      ': value "ativa" is not one of ["ATIVA", "CONCLUIDA"]',
    ]);
  });

  it("enforces numbers, integer checks and bounds", () => {
    const numberConstraint: Constraint = { kind: "number", integer: true, minimum: 1, maximum: 10 };
    expect(validate(numberConstraint, 5, registry)).toEqual({ ok: true, value: 5 });
    expect(issuesOf(numberConstraint, "5")).toEqual([": expected number, received string"]);
    expect(issuesOf(numberConstraint, 1.5)).toEqual([": expected integer, received 1.5"]);
    expect(issuesOf(numberConstraint, 0)).toEqual([": number 0 is less than minimum 1"]);
    expect(issuesOf(numberConstraint, 11)).toEqual([": number 11 exceeds maximum 10"]);
    expect(issuesOf(numberConstraint, Number.NaN)).toEqual([
      ": expected number, received non-finite number",
    ]);
  });

  it("enforces booleans", () => {
    expect(validate({ kind: "boolean" }, true, registry).ok).toBe(true);
    expect(validate({ kind: "boolean" }, false, registry).ok).toBe(true);
    expect(issuesOf({ kind: "boolean" }, "true")).toEqual([": expected boolean, received string"]);
  });
});

describe("string formats", () => {
  it("RFC 3339 full-date validation", () => {
    expect(isRfc3339Date("2024-02-29")).toBe(true);
    expect(isRfc3339Date("2023-02-29")).toBe(false); // not a leap year
    expect(isRfc3339Date("2024-13-01")).toBe(false); // bad month
    expect(isRfc3339Date("2024-04-31")).toBe(false); // April has 30 days
    expect(isRfc3339Date("2024-4-01")).toBe(false); // zero-padding required
    expect(isRfc3339Date("2024-04-01T00:00:00Z")).toBe(false); // date only
  });

  it("RFC 3339 date-time validation", () => {
    expect(isRfc3339DateTime("2020-09-09T20:15:00.358Z")).toBe(true);
    expect(isRfc3339DateTime("2020-09-09t20:15:00z")).toBe(true); // lowercase allowed by RFC 3339
    expect(isRfc3339DateTime("2020-09-09T20:15:00+05:30")).toBe(true);
    expect(isRfc3339DateTime("2020-09-09T20:15:00")).toBe(false); // offset required
    expect(isRfc3339DateTime("2020-09-09 20:15:00Z")).toBe(false); // 'T' required
    expect(isRfc3339DateTime("2020-09-09T25:15:00Z")).toBe(false); // bad hour
    expect(isRfc3339DateTime("2020-09-09T20:61:00Z")).toBe(false); // bad minute
    expect(isRfc3339DateTime("2020-09-09T20:15:00+25:00")).toBe(false); // bad offset hour
    expect(isRfc3339DateTime("2020-02-30T20:15:00Z")).toBe(false); // bad calendar day
  });

  it("URI validation accepts absolute URLs and relative references", () => {
    expect(isUri("https://pix.example.com/api/webhook/")).toBe(true);
    expect(isUri("pix.example.com/qr/v2/9d36b84fc70b478fb95c12729b90ca25")).toBe(true); // spec's own format
    expect(isUri("")).toBe(false);
    expect(isUri("not a uri")).toBe(false);
    expect(isUri("http://[::1")).toBe(false); // unparseable absolute URL
  });

  it("format failures produce the format-specific message", () => {
    expect(issuesOf({ kind: "string", format: "date" }, "2024-02-30")).toEqual([
      ": string is not a valid RFC 3339 date (expected YYYY-MM-DD)",
    ]);
    expect(issuesOf({ kind: "string", format: "date-time" }, "yesterday")).toEqual([
      ": string is not a valid RFC 3339 date-time (expected YYYY-MM-DDTHH:MM:SS[.frac](Z|±HH:MM))",
    ]);
    expect(issuesOf({ kind: "string", format: "uri" }, "nope nope")).toEqual([
      ": string is not a valid URI",
    ]);
  });
});

describe("arrays", () => {
  const arrayConstraint: Constraint = {
    kind: "array",
    items: { kind: "string", pattern: /^\d{2}$/ },
    minItems: 1,
    maxItems: 3,
    uniqueItems: true,
  };

  it("validates items and cardinality", () => {
    expect(validate(arrayConstraint, ["01", "02"], registry).ok).toBe(true);
    expect(issuesOf(arrayConstraint, "not-array")).toEqual([": expected array, received string"]);
    expect(issuesOf(arrayConstraint, [])).toEqual([": array length 0 is less than minItems 1"]);
    expect(issuesOf(arrayConstraint, ["01", "02", "03", "04"])).toEqual([
      ": array length 4 exceeds maxItems 3",
    ]);
    expect(issuesOf(arrayConstraint, ["01", "1"])).toEqual([
      "[1]: string does not match pattern /^\\d{2}$/",
    ]);
  });

  it("enforces uniqueItems, including deep object equality", () => {
    expect(issuesOf(arrayConstraint, ["01", "01"])).toContain(
      ": array items at index 0 and 1 are equal (uniqueItems is required)",
    );
    const objects: Constraint = { kind: "array", uniqueItems: true, items: { kind: "boolean" } };
    expect(validate(objects, [true, false], registry).ok).toBe(true);
    expect(issuesOf(objects, [true, true])).toEqual([
      ": array items at index 0 and 1 are equal (uniqueItems is required)",
    ]);
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
});

describe("objects", () => {
  const objectConstraint: Constraint = {
    kind: "object",
    properties: { txid: { kind: "string", pattern: /^[a-zA-Z0-9]{26,35}$/ } },
    required: ["txid", "undeclared"],
    additionalProperties: true,
  };

  it("requires keys, including presence-only (undeclared) keys", () => {
    expect(issuesOf(objectConstraint, {})).toEqual([
      ': missing required property "txid"',
      ': missing required property "undeclared"',
    ]);
    // presence-only key: value may be anything except undefined
    expect(
      validate(objectConstraint, { txid: "a".repeat(26), undeclared: null }, registry).ok,
    ).toBe(true);
    expect(
      validate(objectConstraint, { txid: "a".repeat(26), undeclared: undefined }, registry).ok,
    ).toBe(false);
  });

  it("rejects non-objects", () => {
    expect(issuesOf(objectConstraint, [])).toEqual([": expected object, received array"]);
    expect(issuesOf(objectConstraint, null)).toEqual([": expected object, received null"]);
  });

  it("allows unknown keys by default and rejects them when additionalProperties is false", () => {
    const value = { txid: "a".repeat(26), undeclared: 1, extra: true };
    expect(validate(objectConstraint, value, registry).ok).toBe(true);
    expect(issuesOf({ ...objectConstraint, additionalProperties: false }, value)).toContain(
      ': unexpected property "extra"',
    );
  });

  it("builds nested issue paths", () => {
    const nested: Constraint = {
      kind: "object",
      properties: {
        pix: {
          kind: "array",
          items: {
            kind: "object",
            properties: { valor: { kind: "string", pattern: /^\d+\.\d{2}$/ } },
            required: [],
            additionalProperties: true,
          },
        },
      },
      required: [],
      additionalProperties: true,
    };
    expect(issuesOf(nested, { pix: [{ valor: "10.00" }, { valor: "1,00" }] })).toEqual([
      "pix[1].valor: string does not match pattern /^\\d+\\.\\d{2}$/",
    ]);
  });
});

describe("composition", () => {
  it("allOf requires every member to pass and merges their issues", () => {
    const composed: Constraint = {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: { a: { kind: "string" } },
          required: ["a"],
          additionalProperties: true,
        },
        {
          kind: "object",
          properties: { b: { kind: "number" } },
          required: ["b"],
          additionalProperties: true,
        },
      ],
    };
    expect(validate(composed, { a: "x", b: 1 }, registry).ok).toBe(true);
    expect(issuesOf(composed, { a: "x" })).toEqual([': missing required property "b"']);
    expect(issuesOf(composed, { a: 1, b: "x" })).toEqual([
      "a: expected string, received number",
      "b: expected number, received string",
    ]);
  });

  it("oneOf demands exactly one matching branch", () => {
    const oneOf: Constraint = {
      kind: "oneOf",
      members: [
        {
          kind: "object",
          properties: { cpf: { kind: "string" } },
          required: ["cpf"],
          additionalProperties: true,
        },
        {
          kind: "object",
          properties: { cnpj: { kind: "string" } },
          required: ["cnpj"],
          additionalProperties: true,
        },
      ],
    };
    expect(validate(oneOf, { cpf: "123" }, registry).ok).toBe(true);
    expect(validate(oneOf, { cnpj: "123" }, registry).ok).toBe(true);
    expect(issuesOf(oneOf, {})).toEqual([": must match exactly one of 2 alternatives (matched 0)"]);
    expect(issuesOf(oneOf, { cpf: "1", cnpj: "2" })).toEqual([
      ": must match exactly one of 2 alternatives (matched 2)",
    ]);
  });

  it("anyOf demands at least one matching branch (multiple matches are fine)", () => {
    const anyOf: Constraint = {
      kind: "anyOf",
      members: [
        {
          kind: "object",
          properties: { a: { kind: "boolean" } },
          required: ["a"],
          additionalProperties: true,
        },
        {
          kind: "object",
          properties: { b: { kind: "boolean" } },
          required: ["b"],
          additionalProperties: true,
        },
      ],
    };
    expect(validate(anyOf, { a: true }, registry).ok).toBe(true);
    expect(validate(anyOf, { a: true, b: false }, registry).ok).toBe(true);
    expect(issuesOf(anyOf, {})).toEqual([": must match at least one of 2 alternatives"]);
  });

  it("nullable accepts null and otherwise validates the inner constraint", () => {
    const nullable: Constraint = { kind: "nullable", inner: { kind: "string" } };
    expect(validate(nullable, null, registry)).toEqual({ ok: true, value: null });
    expect(validate(nullable, "x", registry).ok).toBe(true);
    expect(issuesOf(nullable, 1)).toEqual([": expected string, received number"]);
  });

  it("refs resolve lazily through the registry, including self-references", () => {
    expect(validate({ kind: "ref", name: "refObject" }, { a: "ab" }, registry).ok).toBe(true);
    expect(issuesOf({ kind: "ref", name: "refObject" }, { a: "x" })).toEqual([
      "a: string length 1 is less than minLength 2",
    ]);
    // A self-referential schema terminates on a finite value (no cycles in the
    // data): the chain ends with an empty object.
    const chain: unknown = { child: { child: { child: {} } } };
    expect(validate({ kind: "ref", name: "cyclic" }, chain, registry).ok).toBe(true);
  });

  it("unknown refs throw (programming error, not a validation failure)", () => {
    expect(() => validate({ kind: "ref", name: "missing" }, {}, registry)).toThrow(
      'unknown constraint reference "missing"',
    );
  });

  it("unknown constraint kinds throw (exhaustiveness guard)", () => {
    expect(() => validate({ kind: "mystery" } as unknown as Constraint, "x", registry)).toThrow(
      'unknown constraint kind {"kind":"mystery"}',
    );
  });
});

describe("engine guard rails", () => {
  it("records an issue instead of crashing on pathologically deep values", () => {
    let deep: Constraint = { kind: "boolean" };
    for (let level = 0; level < 80; level += 1) {
      deep = { kind: "object", properties: { d: deep }, required: [], additionalProperties: true };
    }
    let value: unknown = true;
    for (let level = 0; level < 80; level += 1) {
      value = { d: value };
    }
    const issues = issuesOf(deep, value);
    expect(issues).toEqual([
      `d.${"d.".repeat(63)}d: value nesting exceeds the maximum supported depth (64)`,
    ]);
  });

  it("isValid is a boolean convenience wrapper", () => {
    expect(isValid({ kind: "string" }, "x", registry)).toBe(true);
    expect(isValid({ kind: "string" }, 0, registry)).toBe(false);
  });
});
