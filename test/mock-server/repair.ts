/**
 * Schema-driven response repair for the mock Pix API.
 *
 * The pinned BCB spec ships many examples that contradict its own schemas (the
 * same defects the generator's errata document). Rather than hard-code a long
 * list of one-off fixes, this module walks the spec-derived JSON Schema for a
 * response and completes/corrects the official example: missing required fields
 * are filled with conformant defaults, bad formats/enums/lengths are corrected,
 * and `oneOf` branches are made mutually exclusive. The mock can therefore emit
 * responses that satisfy the real OpenAPI schemas for every operation.
 */

import { OPENAPI_CONTRACTS, type JsonSchema } from "../../src/generated/contracts.js";
import { generateTxid } from "../../src/txid.js";

const DATE_TIME = "2026-01-01T00:00:00Z";
const DATE = "2026-01-01";
const URI = "https://pix.example.com/payload/token";
const REF_PREFIX = `${OPENAPI_CONTRACTS.schemaId}#/definitions/`;
const MAX_DEPTH = 24;

/** Known spec patterns with a value that satisfies them. */
const PATTERN_SAMPLES: Readonly<Record<string, string>> = {
  "[a-zA-Z0-9]{26,35}": generateTxid(),
  "[a-zA-Z0-9]{32}": "a".repeat(32),
  "[a-zA-Z0-9]{1,35}": "a".repeat(32),
  "[a-zA-Z0-9]{29}": "a".repeat(29),
  "^\\d{11}$": "12345678909",
  "^[0-9A-Z]{14}$": "12345678901234",
  "^\\d{7}$": "1234567",
};

/** Generates a satisfying sample for the spec's single-class regex patterns. */
function sampleFromPattern(pattern: string): string | undefined {
  const known = PATTERN_SAMPLES[pattern];
  if (known !== undefined) return known;
  const body = pattern.replace(/^\^/, "").replace(/\$$/, "");
  const match = /^(\[[^\]]+\]|\\d)\{(\d+)(?:,(\d+))?\}$/.exec(body);
  if (match === null) return undefined;
  const token = match[1] ?? "";
  const min = Number(match[2] ?? "1");
  const max = Number(match[3] ?? match[2] ?? min);
  const length = Math.min(max, Math.max(min, 8));
  const alphabet =
    token === "\\d"
      ? "0123456789"
      : token === "[0-9A-Z]"
        ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        : token === "[a-zA-Z0-9]"
          ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
          : undefined;
  if (alphabet === undefined) return undefined;
  let result = "";
  for (let index = 0; index < length; index += 1) {
    result += alphabet.charAt(index % alphabet.length);
  }
  return result;
}

function resolve(schema: JsonSchema, depth: number): JsonSchema {
  const ref = schema["$ref"];
  if (typeof ref !== "string" || !ref.startsWith(REF_PREFIX) || depth > MAX_DEPTH) return schema;
  const name = ref.slice(REF_PREFIX.length);
  const target = OPENAPI_CONTRACTS.definitions[name];
  return target ?? {};
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sampleForString(schema: JsonSchema): string {
  const format = schema["format"];
  if (format === "date-time") return DATE_TIME;
  if (format === "date") return DATE;
  if (format === "uri") return URI;
  const values = schema["enum"];
  if (Array.isArray(values) && typeof values[0] === "string") return values[0];
  const pattern = schema["pattern"];
  if (typeof pattern === "string") {
    const sample = sampleFromPattern(pattern);
    if (sample !== undefined) return sample;
  }
  const maxLength = schema["maxLength"];
  const minLength = schema["minLength"];
  const length =
    typeof minLength === "number" && minLength > 0
      ? minLength
      : typeof maxLength === "number"
        ? Math.min(maxLength, 8)
        : 8;
  return "a".repeat(Math.max(1, length));
}

function repairString(value: unknown, schema: JsonSchema): string {
  let result = typeof value === "string" ? value : sampleForString(schema);
  const values = schema["enum"];
  if (Array.isArray(values) && !values.includes(result)) {
    const first: unknown = values[0];
    result =
      typeof first === "string"
        ? first
        : typeof first === "number" || typeof first === "boolean"
          ? String(first)
          : "";
  }
  const pattern = schema["pattern"];
  if (typeof pattern === "string") {
    try {
      if (!new RegExp(pattern).test(result)) {
        result = sampleFromPattern(pattern) ?? sampleForString(schema);
      }
    } catch {
      // The generator rejects unparseable patterns; nothing to repair here.
    }
  }
  const format = schema["format"];
  if (
    format === "date-time" &&
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(result)
  ) {
    result = DATE_TIME;
  }
  if (format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(result)) result = DATE;
  if (format === "uri" && !/^https?:\/\//.test(result)) result = URI;

  const minLength = schema["minLength"];
  if (typeof minLength === "number" && result.length < minLength) {
    result = result.padEnd(minLength, "a");
  }
  const maxLength = schema["maxLength"];
  if (typeof maxLength === "number" && result.length > maxLength) {
    result = result.slice(0, maxLength);
  }
  return result;
}

function repairNumber(value: unknown, schema: JsonSchema, integer: boolean): number {
  let result = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(result)) result = 1;
  if (integer) result = Math.round(result);
  const minimum = schema["minimum"];
  if (typeof minimum === "number" && result < minimum) result = minimum;
  const maximum = schema["maximum"];
  if (typeof maximum === "number" && result > maximum) result = maximum;
  return result;
}

/** All property names reachable through a branch, including composed members. */
function branchKeys(schema: JsonSchema, depth = 0): readonly string[] {
  const resolved = resolve(schema, depth);
  const keys = new Set(Object.keys(resolved["properties"] ?? {}));
  for (const key of ["allOf", "oneOf", "anyOf"] as const) {
    const members = resolved[key];
    if (!Array.isArray(members)) continue;
    for (const member of members as readonly JsonSchema[]) {
      for (const nested of branchKeys(member, depth + 1)) keys.add(nested);
    }
  }
  return [...keys];
}

function chooseBranch(value: unknown, branches: readonly JsonSchema[]): JsonSchema {
  const keys = isObject(value) ? Object.keys(value) : [];
  for (const branch of branches) {
    const resolved = resolve(branch, 0);
    const required = (resolved["required"] ?? []) as readonly string[];
    if (required.length > 0 && required.every((key) => keys.includes(key))) return branch;
  }
  for (const branch of branches) {
    if (branchKeys(branch).some((key) => keys.includes(key))) return branch;
  }
  return branches[0] ?? {};
}

/**
 * Recursively completes `value` so it satisfies `schema`. The input example is
 * preserved wherever it is already conformant; only defective parts change.
 */
export function repairWithSchema(value: unknown, schema: JsonSchema, depth = 0): unknown {
  const resolved = resolve(schema, depth);
  if (depth > MAX_DEPTH) return value ?? null;

  let result = value;

  const allOf = resolved["allOf"];
  if (Array.isArray(allOf)) {
    if (
      result === undefined &&
      allOf.some((member) => isObject(member) && Object.keys(member).length > 0)
    ) {
      result = {};
    }
    for (const member of allOf as readonly JsonSchema[]) {
      result = repairWithSchema(result, member, depth + 1);
    }
  }

  const oneOf = resolved["oneOf"];
  const anyOf = resolved["anyOf"];
  if (Array.isArray(oneOf) || Array.isArray(anyOf)) {
    const branches = (oneOf ?? anyOf) as readonly JsonSchema[];
    const chosen = chooseBranch(result, branches);
    if (Array.isArray(oneOf) && isObject(result)) {
      const kept = new Set(branchKeys(chosen));
      const drop = new Set<string>();
      for (const branch of branches) {
        if (branch === chosen) continue;
        for (const key of branchKeys(branch)) {
          if (!kept.has(key)) drop.add(key);
        }
      }
      if (drop.size > 0) {
        const pruned: Record<string, unknown> = {};
        for (const [key, child] of Object.entries(result)) {
          if (!drop.has(key)) pruned[key] = child;
        }
        result = pruned;
      }
    }
    return repairWithSchema(result, chosen, depth + 1);
  }

  const rawType = resolved["type"];
  const type = Array.isArray(rawType)
    ? ((rawType as readonly string[]).find((candidate) => candidate !== "null") ?? "object")
    : rawType;
  const properties = isObject(resolved["properties"])
    ? (resolved["properties"] as Record<string, JsonSchema>)
    : undefined;
  const required = Array.isArray(resolved["required"])
    ? (resolved["required"] as readonly string[])
    : [];

  if (type === "object" || properties !== undefined || required.length > 0) {
    const record: Record<string, unknown> = isObject(result) ? { ...result } : {};
    for (const key of required) {
      if (!(key in record))
        record[key] = repairWithSchema(undefined, properties?.[key] ?? {}, depth + 1);
    }
    for (const [key, property] of Object.entries(properties ?? {})) {
      if (key in record) record[key] = repairWithSchema(record[key], property, depth + 1);
    }
    const extra = resolved["additionalProperties"];
    if (isObject(extra)) {
      for (const [key, child] of Object.entries(record)) {
        if (properties?.[key] === undefined)
          record[key] = repairWithSchema(child, extra, depth + 1);
      }
    }
    return record;
  }

  if (type === "array" || resolved["items"] !== undefined) {
    const items = (resolved["items"] ?? {}) as JsonSchema;
    const source = Array.isArray(result) ? result : [];
    const repaired = source.map((item) => repairWithSchema(item, items, depth + 1));
    const minItems = resolved["minItems"];
    if (typeof minItems === "number") {
      while (repaired.length < minItems)
        repaired.push(repairWithSchema(undefined, items, depth + 1));
    }
    const maxItems = resolved["maxItems"];
    if (typeof maxItems === "number" && repaired.length > maxItems) repaired.length = maxItems;
    if (resolved["uniqueItems"] === true) {
      const unique = new Set(repaired.map((item) => JSON.stringify(item)));
      return [...unique].map((item) => JSON.parse(item) as unknown);
    }
    return repaired;
  }

  if (type === "integer" || type === "number") {
    return repairNumber(result, resolved, type === "integer");
  }
  if (type === "string" || resolved["format"] !== undefined || resolved["pattern"] !== undefined) {
    return repairString(result, resolved);
  }
  if (type === "boolean") return typeof result === "boolean" ? result : true;
  if (result === undefined) return null;
  return result;
}

/** Name of the JSON Schema definition backing an operation's response code. */
export function responseSchemaName(operation: string, status: number): string | undefined {
  const ref = OPENAPI_CONTRACTS.operations[operation]?.responses[String(status)]?.["$ref"];
  if (typeof ref !== "string" || !ref.startsWith(REF_PREFIX)) return undefined;
  return ref.slice(REF_PREFIX.length);
}

/** Repairs an official example (or any seed) against the response schema. */
export function repairResponse(operation: string, status: number, value: unknown): unknown {
  const name = responseSchemaName(operation, status);
  if (name === undefined) return value;
  const schema = OPENAPI_CONTRACTS.definitions[name];
  if (schema === undefined) return value;
  return repairWithSchema(value, schema);
}
