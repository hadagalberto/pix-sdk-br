/**
 * Emits the TypeScript declarations for every component schema (and every
 * inline request-body schema) into `src/generated/schemas.ts`.
 *
 * Emission rules:
 * - A schema composed only of its own object shape becomes an `interface`
 *   whose members carry the spec's pt-BR descriptions as TSDoc.
 * - A schema composed with `allOf` $refs / `oneOf` / `anyOf` becomes a type
 *   alias using intersections and unions (the OpenAPI composition maps 1:1).
 * - Required-only allOf members (e.g. `- required: ["original"]`) surface as
 *   properties typed through the composed schema via indexed access, e.g.
 *   `{ original: CobValor["original"] } & CobValor`.
 * - Redundant required entries already enforced by a composed schema are
 *   omitted, keeping aliases such as CobGerada["loc"] as plain `PayloadLocation`.
 */

import type { OpenApiDocument, OpenApiSchema } from "./openapi.js";
import { SpecError, SCHEMAS_PREFIX, refName } from "./openapi.js";

export interface TypeContext {
  readonly doc: OpenApiDocument;
  /** Extra named schemas beyond components.schemas (inline bodies, inline op responses). */
  readonly extraNamed: ReadonlyMap<string, OpenApiSchema>;
}

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function schemaByName(ctx: TypeContext, name: string, location: string): OpenApiSchema {
  const schema = ctx.extraNamed.get(name) ?? ctx.doc.components.schemas?.[name];
  if (schema === undefined) {
    throw new SpecError(`unknown named schema "${name}"`, location);
  }
  return schema;
}

function isPatternOnly(schema: OpenApiSchema): boolean {
  if (schema.allOf !== undefined || schema.oneOf !== undefined || schema.anyOf !== undefined) {
    return false;
  }
  if (
    schema.properties !== undefined ||
    schema.required !== undefined ||
    schema.$ref !== undefined
  ) {
    return false;
  }
  if (schema.type !== undefined && schema.type !== "string") return false;
  return schema.pattern !== undefined || schema.format !== undefined;
}

interface Composition {
  readonly literalProperties: ReadonlyMap<string, OpenApiSchema>;
  readonly requiredKeys: ReadonlySet<string>;
  readonly refNames: readonly string[];
  /** allOf members that neither merge as literals nor are refs (nested compositions). */
  readonly inlineMembers: readonly OpenApiSchema[];
  readonly patternOnly: boolean;
  readonly oneOf: readonly OpenApiSchema[];
  readonly anyOf: readonly OpenApiSchema[];
  readonly isObjectish: boolean;
}

function compose(schema: OpenApiSchema): Composition {
  const literalProperties = new Map<string, OpenApiSchema>();
  const requiredKeys = new Set<string>();
  const refNames: string[] = [];
  const inlineMembers: OpenApiSchema[] = [];
  let patternOnly = false;

  const mergeLiteral = (member: OpenApiSchema): void => {
    for (const [key, propertySchema] of Object.entries(member.properties ?? {})) {
      if (!literalProperties.has(key)) literalProperties.set(key, propertySchema);
    }
    for (const key of member.required ?? []) requiredKeys.add(key);
  };

  if (schema.properties !== undefined || schema.required !== undefined) {
    mergeLiteral(schema);
  }
  for (const member of schema.allOf ?? []) {
    if (member.$ref !== undefined) {
      refNames.push(refName(member.$ref, SCHEMAS_PREFIX, "types.compose"));
    } else if (
      member.allOf === undefined &&
      member.oneOf === undefined &&
      member.anyOf === undefined &&
      (member.type === undefined || member.type === "object")
    ) {
      mergeLiteral(member);
    } else if (isPatternOnly(member)) {
      patternOnly = true;
    } else {
      inlineMembers.push(member);
    }
  }

  return {
    literalProperties,
    requiredKeys,
    refNames,
    inlineMembers,
    patternOnly,
    oneOf: schema.oneOf ?? [],
    anyOf: schema.anyOf ?? [],
    isObjectish:
      schema.type === "object" ||
      (schema.type === undefined &&
        (schema.properties !== undefined || schema.required !== undefined)),
  };
}

/** Properties declared anywhere in the allOf closure of a named schema. */
function closureProperties(
  name: string,
  ctx: TypeContext,
  depth: number,
  location: string,
): ReadonlyMap<string, OpenApiSchema> {
  if (depth > 64) {
    throw new SpecError("schema nesting exceeds 64 levels while emitting types", location);
  }
  const into = new Map<string, OpenApiSchema>();
  const walk = (schema: OpenApiSchema): void => {
    const composed = compose(schema);
    for (const [key, propertySchema] of composed.literalProperties) {
      if (!into.has(key)) into.set(key, propertySchema);
    }
    for (const refName of composed.refNames) {
      if (refName === name) continue; // guard against pathological self-cycles
      for (const [key, propertySchema] of closureProperties(refName, ctx, depth + 1, location)) {
        if (!into.has(key)) into.set(key, propertySchema);
      }
    }
  };
  walk(schemaByName(ctx, name, location));
  return into;
}

/** True when `prop` is already required inside one of the composed schemas. */
function isRequiredInRefs(
  refNames: readonly string[],
  prop: string,
  ctx: TypeContext,
  location: string,
): boolean {
  return refNames.some((name) => {
    const schema = schemaByName(ctx, name, location);
    const composed = compose(schema);
    if (composed.requiredKeys.has(prop)) return true;
    return isRequiredInRefs(composed.refNames, prop, ctx, location);
  });
}

/** Indexed-access type (e.g. `CobValor["original"]`) for a prop declared in a composed schema. */
function indexedAccess(
  refNames: readonly string[],
  prop: string,
  ctx: TypeContext,
  location: string,
): string | undefined {
  for (const name of refNames) {
    const properties = closureProperties(name, ctx, 0, location);
    if (properties.has(prop)) return `${name}[${JSON.stringify(prop)}]`;
    const schema = schemaByName(ctx, name, location);
    const composed = compose(schema);
    const deeper = indexedAccess(composed.refNames, prop, ctx, location);
    if (deeper !== undefined) return deeper;
  }
  return undefined;
}

/** Emits the inline TypeScript type expression for a schema. */
export function tsType(
  schema: OpenApiSchema,
  ctx: TypeContext,
  location: string,
  depth = 0,
): string {
  if (depth > 64) {
    throw new SpecError("schema nesting exceeds 64 levels while emitting types", location);
  }
  const nullableSuffix = schema.nullable === true ? " | null" : "";

  if (schema.$ref !== undefined) {
    const name = refName(schema.$ref, SCHEMAS_PREFIX, location);
    schemaByName(ctx, name, location); // assert resolvable
    return name + nullableSuffix;
  }

  if (schema.enum !== undefined) {
    if (schema.enum.some((entry) => typeof entry !== "string")) {
      throw new SpecError("non-string enum values are not supported", location);
    }
    const literals = (schema.enum as string[]).map((entry) => JSON.stringify(entry)).join(" | ");
    return `(${literals})${nullableSuffix}`;
  }

  switch (schema.type) {
    case "string":
      return "string" + nullableSuffix;
    case "integer":
    case "number":
      return "number" + nullableSuffix;
    case "boolean":
      return "boolean" + nullableSuffix;
    case "array": {
      if (schema.items === undefined) {
        throw new SpecError("array schema without items", location);
      }
      const itemsType = tsType(schema.items, ctx, `${location}.items`, depth + 1);
      // Union/intersection item types need parentheses before `[]`.
      const needsParens = /[|&]/.test(itemsType) && !itemsType.startsWith("(");
      return `${needsParens ? `(${itemsType})` : itemsType}[]${nullableSuffix}`;
    }
    case "object":
      break;
    default:
      if (schema.properties !== undefined || schema.required !== undefined) break;
      if (schema.allOf !== undefined || schema.oneOf !== undefined || schema.anyOf !== undefined)
        break;
      if (schema.pattern !== undefined) return "string" + nullableSuffix;
      throw new SpecError(
        `cannot emit type for schema (${JSON.stringify(Object.keys(schema))})`,
        location,
      );
  }

  const composed = compose(schema);
  const parts: string[] = [];

  const ownLines: string[] = [];
  for (const [key, propertySchema] of composed.literalProperties) {
    const optional = composed.requiredKeys.has(key) ? "" : "?";
    ownLines.push(
      `${propertyKey(key)}${optional}: ${tsType(propertySchema, ctx, `${location}.${key}`, depth + 1)}`,
    );
  }
  for (const key of composed.requiredKeys) {
    if (composed.literalProperties.has(key)) continue;
    if (composed.refNames.length > 0 && isRequiredInRefs(composed.refNames, key, ctx, location))
      continue;
    const viaRefs = indexedAccess(composed.refNames, key, ctx, location);
    ownLines.push(`${propertyKey(key)}: ${viaRefs ?? "unknown"}`);
  }
  if (ownLines.length > 0) {
    parts.push(`{\n${indent(ownLines, 1).join("\n")}\n}`);
  }

  parts.push(...composed.refNames);
  for (const member of composed.inlineMembers) {
    parts.push(tsType(member, ctx, `${location}.allOf-inline`, depth + 1));
  }

  const unionMembers = [...composed.oneOf, ...composed.anyOf].map((member, index) =>
    tsType(member, ctx, `${location}.union[${index}]`, depth + 1),
  );
  if (unionMembers.length > 0) {
    const [single] = unionMembers;
    parts.push(
      unionMembers.length === 1 && single !== undefined ? single : `(${unionMembers.join(" | ")})`,
    );
  }

  if (parts.length === 0) {
    if (composed.patternOnly) return "string" + nullableSuffix;
    if (composed.isObjectish) return "Record<string, unknown>" + nullableSuffix;
    throw new SpecError("object schema without properties or composition members", location);
  }
  if (parts.length === 1) {
    const [single] = parts;
    if (single === undefined) {
      throw new SpecError("internal error: empty composition part", location);
    }
    return single + nullableSuffix;
  }
  return parts.join(" & ") + nullableSuffix;
}

function indent(lines: readonly string[], level: number): string[] {
  const prefix = "  ".repeat(level);
  return lines.map((line) => prefix + line);
}

export function propertyKey(key: string): string {
  return IDENTIFIER_RE.test(key) ? key : JSON.stringify(key);
}

// ---------------------------------------------------------------------------
// TSDoc helpers
// ---------------------------------------------------------------------------

/** Builds a JSDoc/TSDoc block from raw description lines (kept in pt-BR). */
export function tsdocBlock(lines: readonly string[]): string {
  const cleaned = lines.map((line) => line.replace(/\*\//g, "*\\/").trimEnd());
  while (cleaned.length > 0 && cleaned[cleaned.length - 1] === "") cleaned.pop();
  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return `/** ${cleaned[0]} */`;
  return ["/**", ...cleaned.map((line) => (line === "" ? " *" : ` * ${line}`)), " */"].join("\n");
}

function schemaDoc(schema: OpenApiSchema): string {
  const lines: string[] = [];
  if (schema.title !== undefined && schema.title.trim() !== "")
    lines.push(`**${schema.title.trim()}**`);
  if (schema.description !== undefined) {
    if (lines.length > 0) lines.push("");
    lines.push(...schema.description.split("\n"));
  }
  return tsdocBlock(lines);
}

function propertyDoc(schema: OpenApiSchema): string {
  const lines: string[] = [];
  if (schema.title !== undefined && schema.title.trim() !== "")
    lines.push(`**${schema.title.trim()}**`);
  if (schema.description !== undefined) {
    if (lines.length > 0) lines.push("");
    lines.push(...schema.description.split("\n"));
  }
  return tsdocBlock(lines);
}

// ---------------------------------------------------------------------------
// Declarations
// ---------------------------------------------------------------------------

export interface SchemaDeclaration {
  readonly name: string;
  readonly doc: string;
  readonly declaration: string;
}

/**
 * Emits one exported declaration for a named schema.
 * Plain object shapes become interfaces (with member TSDoc); compositions
 * become type aliases.
 */
export function schemaDeclaration(
  name: string,
  schema: OpenApiSchema,
  ctx: TypeContext,
  location: string,
): SchemaDeclaration {
  const composed = compose(schema);

  const hasRefsOrUnions =
    composed.refNames.length > 0 ||
    composed.inlineMembers.length > 0 ||
    composed.oneOf.length > 0 ||
    composed.anyOf.length > 0;
  const needsExtraRequired = [...composed.requiredKeys].some(
    (key) =>
      !composed.literalProperties.has(key) &&
      !(composed.refNames.length > 0 && isRequiredInRefs(composed.refNames, key, ctx, location)),
  );

  if (
    !hasRefsOrUnions &&
    !needsExtraRequired &&
    (composed.isObjectish || composed.literalProperties.size > 0)
  ) {
    const members: string[] = [];
    for (const [key, propertySchema] of composed.literalProperties) {
      const optional = composed.requiredKeys.has(key) ? "" : "?";
      const doc = propertyDoc(propertySchema);
      const type = tsType(propertySchema, ctx, `${location}.${key}`);
      members.push(
        ...(doc === "" ? [] : [...doc.split("\n")]),
        `${propertyKey(key)}${optional}: ${type};`,
      );
    }
    const body =
      members.length === 0 ? "Record<string, unknown>" : `{\n${indent(members, 1).join("\n")}\n}`;
    return {
      name,
      doc: schemaDoc(schema),
      declaration: `export interface ${name} ${body}`,
    };
  }

  const typeExpression = tsType(schema, ctx, location);
  return {
    name,
    doc: schemaDoc(schema),
    declaration: `export type ${name} = ${typeExpression};`,
  };
}

/** Renders a set of declarations into the final `schemas.ts` source. */
export function renderSchemaFile(
  header: string,
  declarations: readonly SchemaDeclaration[],
): string {
  const chunks: string[] = [header, ""];
  for (const declaration of declarations) {
    if (declaration.doc !== "") chunks.push(declaration.doc);
    chunks.push(declaration.declaration);
    chunks.push("");
  }
  return chunks.join("\n");
}

export function typeContext(
  doc: OpenApiDocument,
  extraNamed: ReadonlyMap<string, OpenApiSchema>,
): TypeContext {
  return { doc, extraNamed };
}
