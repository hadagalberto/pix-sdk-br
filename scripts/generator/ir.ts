/**
 * Compiles OpenAPI schemas into the constraint IR evaluated by
 * `src/validation/engine.ts`.
 *
 * Compilation is total and fail-loud: every keyword present in the spec must be
 * understood here, every `$ref` must point at a named schema, and every
 * `required` entry must be declared somewhere in the composition closure
 * (post-errata). Anything unexpected throws SpecError so an upstream spec
 * bump can never silently change what the generated validators enforce.
 */

import type { Constraint, ObjectConstraint, StringFormat } from "../../src/validation/engine.js";
import type { OpenApiDocument, OpenApiParameter, OpenApiSchema } from "./openapi.js";
import { SpecError, SCHEMAS_PREFIX, refName } from "./openapi.js";

/** Every schema keyword the compiler understands. Anything else is an error. */
const KNOWN_SCHEMA_KEYS: ReadonlySet<string> = new Set([
  "$ref",
  "type",
  "format",
  "title",
  "description",
  "properties",
  "required",
  "items",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minLength",
  "maxLength",
  "pattern",
  "enum",
  "minimum",
  "maximum",
  "nullable",
  "additionalProperties",
  "allOf",
  "oneOf",
  "anyOf",
  "example",
  "examples",
  "default",
  "readOnly",
]);

const STRING_FORMATS: ReadonlySet<string> = new Set(["date", "date-time", "uri", "int64"]);
const NUMBER_FORMATS: ReadonlySet<string> = new Set(["int32", "int64"]);

export interface IrCompiler {
  /** All named constraints, in registration order. */
  readonly constraints: ReadonlyMap<string, Constraint>;
  /** Compiles an anonymous schema located at `location` (used for params and inline bodies). */
  compile(schema: OpenApiSchema, location: string): Constraint;
  /** Named schemas available for `$ref` resolution. */
  readonly doc: OpenApiDocument;
}

export function createCompiler(
  doc: OpenApiDocument,
  extraNamed: ReadonlyMap<string, OpenApiSchema>,
): IrCompiler {
  const constraints = new Map<string, Constraint>();

  const assertKnownKeys = (schema: OpenApiSchema, location: string): void => {
    for (const key of Object.keys(schema)) {
      if (!KNOWN_SCHEMA_KEYS.has(key)) {
        throw new SpecError(`unsupported schema keyword "${key}"`, location);
      }
    }
  };

  const normalizePattern = (pattern: string, location: string): RegExp => {
    let source = pattern;
    // Erratum "slash-delimited-pattern" already normalized these; stay defensive.
    if (source.startsWith("/^") && source.endsWith("$/") && source.length > 3) {
      source = source.slice(1, -1);
    }
    try {
      return new RegExp(source);
    } catch (error) {
      throw new SpecError(`invalid pattern /${source}/ (${String(error)})`, location);
    }
  };

  /**
   * Whether a subschema is a "mergeable literal object": no $ref, no
   * oneOf/anyOf, and either typed as object (or untyped with properties or
   * required). Such members contribute properties/required directly to the
   * composed object instead of staying independent allOf branches.
   */
  const isMergeableLiteral = (schema: OpenApiSchema): boolean => {
    if (schema.$ref !== undefined) return false;
    if (schema.allOf !== undefined || schema.oneOf !== undefined || schema.anyOf !== undefined) {
      return false;
    }
    if (schema.type !== undefined && schema.type !== "object") return false;
    return schema.properties !== undefined || schema.required !== undefined;
  };

  const compileAt = (schema: OpenApiSchema, location: string, depth: number): Constraint => {
    if (depth > 64) {
      throw new SpecError("schema nesting exceeds 64 levels", location);
    }
    assertKnownKeys(schema, location);

    if (schema.$ref !== undefined) {
      const name = refName(schema.$ref, SCHEMAS_PREFIX, location);
      const resolved = extraNamed.get(name) ?? doc.components.schemas?.[name];
      if (resolved === undefined) {
        throw new SpecError(`$ref target "${schema.$ref}" is not a known schema`, location);
      }
      return { kind: "ref", name };
    }

    if (schema.nullable === true) {
      const { nullable: _ignored, ...inner } = schema;
      return { kind: "nullable", inner: compileAt(inner, location, depth + 1) };
    }

    const isObjectish =
      (schema.type === undefined &&
        (schema.properties !== undefined || schema.required !== undefined)) ||
      schema.type === "object";

    // ---------------------------------------------------------------- strings
    if (schema.type === "string") {
      if (schema.format !== undefined && !STRING_FORMATS.has(schema.format)) {
        throw new SpecError(`unsupported string format "${schema.format}"`, location);
      }
      if (schema.enum?.some((entry) => typeof entry !== "string") === true) {
        throw new SpecError("non-string enum values are not supported", location);
      }
      return {
        kind: "string",
        ...(schema.minLength !== undefined && { minLength: schema.minLength }),
        ...(schema.maxLength !== undefined && { maxLength: schema.maxLength }),
        ...(schema.pattern !== undefined && {
          pattern: normalizePattern(schema.pattern, location),
        }),
        ...(schema.format !== undefined && { format: schema.format as StringFormat }),
        ...(schema.enum !== undefined && { enumValues: schema.enum as string[] }),
      };
    }

    // ---------------------------------------------------------------- numbers
    if (schema.type === "integer" || schema.type === "number") {
      if (schema.format !== undefined && !NUMBER_FORMATS.has(schema.format)) {
        throw new SpecError(`unsupported number format "${schema.format}"`, location);
      }
      if (schema.enum !== undefined) {
        throw new SpecError("enum on numeric types is not supported", location);
      }
      return {
        kind: "number",
        ...(schema.type === "integer" && { integer: true }),
        ...(schema.minimum !== undefined && { minimum: schema.minimum }),
        ...(schema.maximum !== undefined && { maximum: schema.maximum }),
      };
    }

    if (schema.type === "boolean") {
      return { kind: "boolean" };
    }

    // -------------------------------------------- bare constraint-only schemas
    // Some allOf members carry only string/number keywords without `type`
    // (e.g. `- pattern: "[a-zA-Z0-9]{1,35}"` under `allOf: [{$ref: TxId}, …]`).
    // They apply those constraints to the composed value directly.
    const isBareStringSchema =
      schema.type === undefined &&
      schema.properties === undefined &&
      schema.required === undefined &&
      schema.allOf === undefined &&
      schema.oneOf === undefined &&
      schema.anyOf === undefined &&
      (schema.pattern !== undefined ||
        schema.enum !== undefined ||
        schema.minLength !== undefined ||
        schema.maxLength !== undefined ||
        schema.format !== undefined);
    if (isBareStringSchema) {
      if (schema.format !== undefined && !STRING_FORMATS.has(schema.format)) {
        throw new SpecError(`unsupported string format "${schema.format}"`, location);
      }
      if (schema.enum?.some((entry) => typeof entry !== "string") === true) {
        throw new SpecError("non-string enum values are not supported", location);
      }
      return {
        kind: "string",
        ...(schema.minLength !== undefined && { minLength: schema.minLength }),
        ...(schema.maxLength !== undefined && { maxLength: schema.maxLength }),
        ...(schema.pattern !== undefined && {
          pattern: normalizePattern(schema.pattern, location),
        }),
        ...(schema.format !== undefined && { format: schema.format as StringFormat }),
        ...(schema.enum !== undefined && { enumValues: schema.enum as string[] }),
      };
    }
    const isBareNumberSchema =
      schema.type === undefined &&
      schema.properties === undefined &&
      schema.required === undefined &&
      schema.allOf === undefined &&
      schema.oneOf === undefined &&
      schema.anyOf === undefined &&
      (schema.minimum !== undefined || schema.maximum !== undefined);
    if (isBareNumberSchema) {
      return {
        kind: "number",
        ...(schema.minimum !== undefined && { minimum: schema.minimum }),
        ...(schema.maximum !== undefined && { maximum: schema.maximum }),
      };
    }

    // ----------------------------------------------------------------- arrays
    if (schema.type === "array") {
      if (schema.items === undefined) {
        throw new SpecError("array schema without items", location);
      }
      return {
        kind: "array",
        items: compileAt(schema.items, `${location}.items`, depth + 1),
        ...(schema.minItems !== undefined && { minItems: schema.minItems }),
        ...(schema.maxItems !== undefined && { maxItems: schema.maxItems }),
        ...(schema.uniqueItems === true && { uniqueItems: true }),
      };
    }

    if (schema.type !== undefined && schema.type !== "object") {
      throw new SpecError(`unsupported schema type "${schema.type}"`, location);
    }

    // --------------------------------------------------------- objects & allOf
    const literalProperties = new Map<string, OpenApiSchema>();
    const requiredKeys = new Set<string>();
    const allOfMembers: OpenApiSchema[] = [];
    let mergedAdditionalProperties = schema.additionalProperties === false ? false : true;

    const mergeLiteral = (member: OpenApiSchema): void => {
      for (const [key, propertySchema] of Object.entries(member.properties ?? {})) {
        if (!literalProperties.has(key)) {
          literalProperties.set(key, propertySchema);
        }
      }
      for (const key of member.required ?? []) {
        requiredKeys.add(key);
      }
      if (member.additionalProperties === false) {
        mergedAdditionalProperties = false;
      }
    };

    if (schema.properties !== undefined || schema.required !== undefined) {
      mergeLiteral(schema);
    }
    for (const member of schema.allOf ?? []) {
      if (isMergeableLiteral(member)) {
        mergeLiteral(member);
      } else {
        allOfMembers.push(member);
      }
    }

    const parts: Constraint[] = [];

    if (isObjectish || literalProperties.size > 0 || requiredKeys.size > 0) {
      // Validate required ⊆ declared closure (guarded after errata).
      const declared = new Set<string>(literalProperties.keys());
      collectAllOfPropertyNames(allOfMembers, declared, doc, extraNamed, location, 0);
      for (const key of requiredKeys) {
        if (!declared.has(key)) {
          throw new SpecError(
            `required property "${key}" is not declared in the composition closure`,
            location,
          );
        }
      }
      const objectConstraint: ObjectConstraint = {
        kind: "object",
        properties: Object.fromEntries(
          [...literalProperties.entries()].map(([key, propertySchema]) => [
            key,
            compileAt(propertySchema, `${location}.properties.${key}`, depth + 1),
          ]),
        ),
        required: [...requiredKeys],
        additionalProperties: mergedAdditionalProperties,
      };
      parts.push(objectConstraint);
    }

    for (const member of allOfMembers) {
      parts.push(compileAt(member, `${location}.allOf[]`, depth + 1));
    }

    if (schema.oneOf !== undefined) {
      const members = schema.oneOf.map((member, index) =>
        compileAt(member, `${location}.oneOf[${index}]`, depth + 1),
      );
      parts.push(singleMember(members) ?? { kind: "oneOf", members });
    }
    if (schema.anyOf !== undefined) {
      const members = schema.anyOf.map((member, index) =>
        compileAt(member, `${location}.anyOf[${index}]`, depth + 1),
      );
      parts.push(singleMember(members) ?? { kind: "anyOf", members });
    }

    if (parts.length === 0) {
      // Empty schema: accepts anything.
      return { kind: "object", properties: {}, required: [], additionalProperties: true };
    }
    if (parts.length === 1) {
      const [single] = parts;
      if (single === undefined) {
        throw new SpecError("internal error: empty constraint part", location);
      }
      return single;
    }
    return { kind: "allOf", members: parts };
  };

  /** Returns the single member of a one-element list, or undefined. */
  const singleMember = (members: readonly Constraint[]): Constraint | undefined => {
    const [first] = members;
    return members.length === 1 ? first : undefined;
  };

  const compiler: IrCompiler = {
    doc,
    constraints,
    compile: (schema, location) => compileAt(schema, location, 0),
  };
  // Register every named schema (component schemas first, then extras such as
  // inline request bodies and inline operation responses).
  for (const [name, schema] of Object.entries(doc.components.schemas ?? {})) {
    constraints.set(name, compileAt(schema, `components.schemas.${name}`, 0));
  }
  for (const [name, schema] of extraNamed) {
    if (constraints.has(name)) {
      throw new SpecError(`duplicate named schema "${name}"`, "ir");
    }
    constraints.set(name, compileAt(schema, name, 0));
  }

  return compiler;
}

/** Names of properties declared by a schema's allOf closure (no oneOf/anyOf descent). */
function collectAllOfPropertyNames(
  members: readonly OpenApiSchema[],
  into: Set<string>,
  doc: OpenApiDocument,
  extraNamed: ReadonlyMap<string, OpenApiSchema>,
  location: string,
  depth: number,
): void {
  if (depth > 64) {
    throw new SpecError("schema nesting exceeds 64 levels while resolving properties", location);
  }
  for (const member of members) {
    if (member.$ref !== undefined) {
      const name = refName(member.$ref, SCHEMAS_PREFIX, location);
      const resolved = extraNamed.get(name) ?? doc.components.schemas?.[name];
      if (resolved === undefined) {
        throw new SpecError(`$ref target "${member.$ref}" is not a known schema`, location);
      }
      for (const key of Object.keys(resolved.properties ?? {})) {
        into.add(key);
      }
      collectAllOfPropertyNames(resolved.allOf ?? [], into, doc, extraNamed, location, depth + 1);
    } else {
      for (const key of Object.keys(member.properties ?? {})) {
        into.add(key);
      }
      collectAllOfPropertyNames(member.allOf ?? [], into, doc, extraNamed, location, depth + 1);
    }
  }
}

/** Compiles an operation parameter (path/query) into its constraint. */
export function compileParameter(
  parameter: OpenApiParameter,
  location: string,
  compiler: IrCompiler,
): Constraint {
  if (parameter.in !== "path" && parameter.in !== "query") {
    throw new SpecError(`unsupported parameter location "${parameter.in}"`, location);
  }
  if (parameter.schema === undefined) {
    throw new SpecError("parameter without schema", location);
  }
  const constraint = compiler.compile(parameter.schema, location);
  // A path parameter is interpolated into the request URL: an empty value can
  // never identify a resource (it would produce a doubled slash or a trailing
  // slash). The BCB spec omits minLength on several path schemas; enforce it
  // here so validation is strict even where the raw spec is silent.
  if (
    parameter.in === "path" &&
    constraint.kind === "string" &&
    constraint.minLength === undefined
  ) {
    return { ...constraint, minLength: 1 };
  }
  return constraint;
}
