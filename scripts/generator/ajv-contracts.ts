/**
 * Converts the errata-applied OpenAPI document into plain JSON Schema
 * (draft-07) contracts consumable by ajv.
 *
 * The output is committed as `src/generated/contracts.ts` (a generated data
 * module, not part of the published runtime surface) so the contract tests can
 * validate every request and response without parsing the gitignored YAML at
 * test time. `generator.test.ts` regenerates it and asserts byte-equality,
 * which ties it to the pinned spec exactly like the other generated modules.
 */

import type { OpenApiDocument, OpenApiSchema } from "./openapi.js";
import { SCHEMAS_PREFIX, SpecError, refName } from "./openapi.js";
import type { OperationsResult } from "./operations.js";

/** Canonical `$id` of the root schema holding every named definition. */
export const CONTRACT_SCHEMA_ID = "https://pix-sdk.br/spec/openapi.json";

/** A JSON Schema object (draft-07) emitted for ajv. */
export type JsonSchema = Record<string, unknown>;

export interface OperationAjvContract {
  readonly pathParams: JsonSchema;
  readonly queryParams: JsonSchema;
  readonly requestBody: JsonSchema | null;
  readonly responses: Readonly<Record<string, JsonSchema | null>>;
}

export interface OpenApiAjvContracts {
  readonly schemaId: string;
  readonly definitions: Readonly<Record<string, JsonSchema>>;
  readonly operations: Readonly<Record<string, OperationAjvContract>>;
}

/** Keywords that carry the same meaning in OpenAPI 3.0 and JSON Schema. */
const PASS_THROUGH = [
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
  "allOf",
  "oneOf",
  "anyOf",
  "additionalProperties",
  "default",
  "multipleOf",
  "minProperties",
  "maxProperties",
] as const;

function definitionRef(name: string): JsonSchema {
  return { $ref: `${CONTRACT_SCHEMA_ID}#/definitions/${name}` };
}

function copyValue(value: unknown, location: string): unknown {
  if (Array.isArray(value))
    return value.map((item, index) => copyValue(item, `${location}[${index}]`));
  if (typeof value !== "object" || value === null) return value;
  const record = value as Record<string, unknown>;
  const result: JsonSchema = {};
  for (const [key, child] of Object.entries(record)) {
    result[key] = copyValue(child, `${location}.${key}`);
  }
  return result;
}

/**
 * Converts one OpenAPI schema. OpenAPI-only annotations (`example`, `readOnly`,
 * …) are dropped; `nullable` and `$ref` siblings are rewritten into constructs
 * draft-07 understands without changing validation semantics.
 */
export function toJsonSchema(schema: OpenApiSchema, location: string): JsonSchema {
  const output: JsonSchema = {};

  if (schema.$ref !== undefined) {
    const name = refName(schema.$ref, SCHEMAS_PREFIX, location);
    output["$ref"] = definitionRef(name)["$ref"];
  }

  for (const key of PASS_THROUGH) {
    const value: unknown = (schema as unknown as Record<string, unknown>)[key];
    if (value === undefined) continue;
    if (key === "properties") {
      const properties = value as Record<string, OpenApiSchema>;
      const converted: Record<string, JsonSchema> = {};
      for (const [name, property] of Object.entries(properties)) {
        converted[name] = toJsonSchema(property, `${location}.properties.${name}`);
      }
      output["properties"] = converted;
    } else if (key === "items") {
      output["items"] = toJsonSchema(value as OpenApiSchema, `${location}.items`);
    } else if (key === "additionalProperties" && typeof value === "object" && value !== null) {
      output["additionalProperties"] = toJsonSchema(value, `${location}.additionalProperties`);
    } else if (key === "allOf" || key === "oneOf" || key === "anyOf") {
      output[key] = (value as OpenApiSchema[]).map((member, index) =>
        toJsonSchema(member, `${location}.${key}[${index}]`),
      );
    } else {
      output[key] = copyValue(value, `${location}.${key}`);
    }
  }

  if (schema.nullable === true) {
    const composed =
      output["$ref"] !== undefined ||
      output["allOf"] !== undefined ||
      output["oneOf"] !== undefined ||
      output["anyOf"] !== undefined;
    const type = output["type"];
    if (!composed && typeof type === "string") {
      output["type"] = [type, "null"];
      return output;
    }
    return { anyOf: [output, { type: "null" }] };
  }

  return output;
}

function parameterObject(
  params: OperationsResult["operations"][number]["pathParams"],
  location: string,
): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];
  for (const parameter of params) {
    properties[parameter.name] = toJsonSchema(parameter.schema, `${location}.${parameter.name}`);
    if (parameter.required) required.push(parameter.name);
  }
  return { type: "object", properties, required, additionalProperties: true };
}

/** Builds the complete ajv contract bundle from compiled operations. */
export function compileAjvContracts(
  doc: OpenApiDocument,
  operations: OperationsResult,
  extraNamed: ReadonlyMap<string, OpenApiSchema>,
): OpenApiAjvContracts {
  const named = new Map<string, OpenApiSchema>(Object.entries(doc.components.schemas ?? {}));
  for (const [name, schema] of extraNamed) {
    if (named.has(name)) {
      throw new SpecError(`inline schema "${name}" collides with a component schema`, locationOf());
    }
    named.set(name, schema);
  }

  const definitions: Record<string, JsonSchema> = {};
  const definitionLocations: Record<string, string> = {};
  for (const [name, schema] of named) {
    const location = `components.schemas.${name}`;
    definitions[name] = toJsonSchema(schema, location);
    definitionLocations[name] = location;
  }
  // Guard against empty conversions caused by a typo in a future schema.
  for (const [name, schema] of Object.entries(definitions)) {
    if (Object.keys(schema).length === 0) {
      throw new SpecError(
        `schema ${name} converted to an empty contract`,
        definitionLocations[name] ?? name,
      );
    }
  }

  const contracts: Record<string, OperationAjvContract> = {};
  for (const operation of operations.operations) {
    const requestBody = operation.requestBody;
    const responses: Record<string, JsonSchema | null> = {};
    for (const response of operation.responses) {
      responses[String(response.code)] =
        response.schemaName === undefined ? null : definitionRef(response.schemaName);
    }
    contracts[operation.name] = {
      pathParams: parameterObject(operation.pathParams, `${operation.name}.pathParams`),
      queryParams: parameterObject(operation.queryParams, `${operation.name}.queryParams`),
      requestBody: requestBody === undefined ? null : definitionRef(requestBody.schemaName),
      responses,
    };
  }

  return { schemaId: CONTRACT_SCHEMA_ID, definitions, operations: contracts };
}

function locationOf(): string {
  return "components.schemas / inline schemas";
}
