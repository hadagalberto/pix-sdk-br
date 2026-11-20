/**
 * Extracts every official example from `components.examples`, resolving the
 * `$ref` composition markers that the upstream file uses inside list examples
 * (e.g. `getCobs1.cobs: [{ allOf: [{ $ref: "#/components/examples/cobResponse1/value" }] }]`).
 *
 * The emitted `src/generated/examples.ts` gives the test suite — and SDK users —
 * the spec's own known-good (and, where the upstream file is self-contradictory,
 * known-bad, see tests) payload vectors as plain data.
 */

import type { JsonValue, OpenApiDocument } from "./openapi.js";
import { SpecError, EXAMPLES_PREFIX } from "./openapi.js";

export interface NamedExample {
  readonly name: string;
  readonly value: JsonValue;
}

export interface SpecExamples {
  /** Every `components.examples` entry, composition markers resolved. */
  readonly byName: ReadonlyMap<string, NamedExample>;
}

const EXAMPLE_REF_RE = /^#\/components\/examples\/([^/]+?)(?:\/value)?$/;

/**
 * Recursively resolves `{ allOf: [{ $ref: "#/components/examples/<name>/value" }] }`
 * composition markers, merging multiple members like JSON Schema `allOf`.
 */
export function resolveExampleValue(
  value: JsonValue,
  resolveRef: (ref: string, location: string) => JsonValue,
  location: string,
): JsonValue {
  return resolveValue(value, resolveRef, location, new Set());
}

function resolveValue(
  value: JsonValue,
  resolveRef: (ref: string, location: string) => JsonValue,
  location: string,
  seen: ReadonlySet<string>,
): JsonValue {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      resolveValue(item, resolveRef, `${location}[${index}]`, seen),
    );
  }
  if (typeof value !== "object" || value === null) {
    return value;
  }
  const entries = Object.entries(value);

  if (entries.length === 1 && entries[0]![0] === "$ref" && typeof entries[0]![1] === "string") {
    return resolveRef(entries[0]![1], location);
  }
  if (entries.length === 1 && entries[0]![0] === "allOf") {
    const members = entries[0]![1];
    if (!Array.isArray(members)) {
      throw new SpecError("allOf composition marker must be an array", location);
    }
    const resolved = members.map((member, index) =>
      resolveValue(member, resolveRef, `${location}.allOf[${index}]`, seen),
    );
    const [single] = resolved;
    if (resolved.length === 1 && single !== undefined) return single;
    return resolved.reduce((merged, part) => {
      if (
        typeof merged !== "object" ||
        merged === null ||
        typeof part !== "object" ||
        part === null
      ) {
        throw new SpecError("allOf composition members must be objects", location);
      }
      return { ...(merged as Record<string, JsonValue>), ...(part as Record<string, JsonValue>) };
    });
  }

  const resolvedObject: Record<string, JsonValue> = {};
  for (const [key, inner] of entries) {
    resolvedObject[key] = resolveValue(inner, resolveRef, `${location}.${key}`, seen);
  }
  return resolvedObject;
}

export function collectSpecExamples(doc: OpenApiDocument): SpecExamples {
  const raw = new Map<string, JsonValue>();
  for (const [name, example] of Object.entries(doc.components.examples ?? {})) {
    raw.set(name, example.value ?? null);
  }
  const byName = new Map<string, NamedExample>();

  const resolveRef = (ref: string, location: string, seen: ReadonlySet<string>): JsonValue => {
    const match = EXAMPLE_REF_RE.exec(ref);
    if (match === null) {
      throw new SpecError(`unexpected example $ref "${ref}"`, location);
    }
    const name = match[1]!;
    if (seen.has(name)) {
      throw new SpecError(`cyclic example composition involving "${name}"`, location);
    }
    const value = raw.get(name);
    if (value === undefined) {
      throw new SpecError(`unknown example "${ref}"`, location);
    }
    return resolveValue(
      value,
      (innerRef, innerLocation) => resolveRef(innerRef, innerLocation, new Set(seen).add(name)),
      `components.examples.${name}`,
      new Set(seen).add(name),
    );
  };

  for (const [name, value] of raw) {
    byName.set(name, {
      name,
      value: resolveValue(
        value,
        (ref, location) => resolveRef(ref, location, new Set([name])),
        `components.examples.${name}`,
        new Set([name]),
      ),
    });
  }
  return { byName };
}

/** Resolves `#.../examples/<name>` references from an `examples` map. */
export function lookupExampleValue(
  examples: SpecExamples,
  ref: string,
  location: string,
): JsonValue {
  if (!ref.startsWith(EXAMPLES_PREFIX)) {
    throw new SpecError(`unexpected example $ref "${ref}"`, location);
  }
  const name = ref.slice(EXAMPLES_PREFIX.length).replace(/\/value$/, "");
  const example = examples.byName.get(name);
  if (example === undefined) {
    throw new SpecError(`unknown example "${ref}"`, location);
  }
  return example.value;
}
