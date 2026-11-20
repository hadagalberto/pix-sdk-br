/**
 * Independent OpenAPI loader for the mock Pix API.
 *
 * This module deliberately shares NO parser, errata helper or validator with
 * `scripts/generator/` or `src/generated/`. It reads the pinned YAML with the
 * `yaml` package, checks the pinned SHA-256 from `spec/spec.lock.json`, and
 * compiles request-body validators directly from `components.schemas` with
 * ajv. That way a generator bug cannot make a wrong request look valid just
 * because the mock and the client share the same validator.
 *
 * Only two *documented* upstream defects are corrected here, generically:
 * slash-delimited regexes, and `required` entries naming a property that no
 * schema (or composed member) declares. Both corrections are derived from the
 * spec's own examples and are the same corrections documented in SPEC.md; they
 * are implemented here from scratch, not imported from the generator.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Ajv, type ValidateFunction } from "ajv";
import * as formats from "ajv-formats";
import { parse } from "yaml";

const addFormats = formats.default as unknown as (ajv: Ajv) => void;
const SCHEMA_ID = "https://pix-sdk-br.test/independent-spec.json";
const SPEC_PATH = fileURLToPath(new URL("../../spec/openapi.yaml", import.meta.url));
const LOCK_PATH = fileURLToPath(new URL("../../spec/spec.lock.json", import.meta.url));

export interface MockResponse {
  readonly code: number;
  readonly contentType?: string;
  readonly schema?: string;
}

export interface MockOperation {
  readonly name: string;
  readonly method: string;
  readonly path: string;
  readonly tag: string;
  readonly scopes: readonly string[];
  readonly pathParams: readonly string[];
  readonly queryParams: readonly string[];
  readonly requestBody?: string;
  readonly requestBodyRequired: boolean;
  readonly responses: readonly MockResponse[];
}

export interface IndependentSpec {
  readonly operations: readonly MockOperation[];
  /** Validation result with ajv's own diagnostic text (independent of src/). */
  validateRequestBody(
    name: string,
    value: unknown,
  ): { readonly ok: boolean; readonly errors: string };
}

type RecordValue = Record<string, unknown>;
const METHODS = ["get", "put", "post", "patch", "delete"] as const;

/** Loads and independently compiles the pinned OpenAPI document. */
export function loadIndependentSpec(): IndependentSpec {
  const raw = readFileSync(SPEC_PATH, "utf8");
  const lock = JSON.parse(readFileSync(LOCK_PATH, "utf8")) as { readonly sha256: string };
  const digest = createHash("sha256").update(raw).digest("hex");
  if (digest !== lock.sha256) {
    throw new Error(`spec/openapi.yaml drifted: expected ${lock.sha256}, got ${digest}`);
  }
  const doc = parse(raw) as RecordValue;
  correctUpstreamDefects(doc);

  const requestBodies = (doc["components"] as RecordValue)["requestBodies"] as RecordValue;
  const schemas = structuredClone((doc["components"] as RecordValue)["schemas"] as RecordValue);
  // Some request bodies declare an inline schema (e.g. LoteCobVBody). Register
  // it under the component name, the same key the client-facing validator uses.
  for (const [name, body] of Object.entries(requestBodies)) {
    const media =
      isRecord(body) && isRecord(body["content"]) ? Object.values(body["content"])[0] : undefined;
    const inline = isRecord(media) ? media["schema"] : undefined;
    if (isRecord(inline) && schemaNameOf(inline) === undefined)
      schemas[name] = structuredClone(inline);
  }
  rewriteRefs(schemas);
  const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: true, allowUnionTypes: true });
  addFormats(ajv);
  ajv.addSchema({ $id: SCHEMA_ID, type: "object", definitions: schemas });

  const validators = new Map<string, ValidateFunction>();
  const operations = buildOperations(doc, requestBodies);

  return {
    operations,
    validateRequestBody(name, value) {
      let validator = validators.get(name);
      if (validator === undefined) {
        const body = requestBodies[name];
        const media =
          isRecord(body) && isRecord(body["content"])
            ? Object.values(body["content"])[0]
            : undefined;
        const schema = schemaNameOf(isRecord(media) ? media["schema"] : undefined) ?? name;
        if (body === undefined || schemas[schema] === undefined) {
          throw new Error(`independent spec has no request-body schema for ${name}`);
        }
        validator = ajv.compile({ $ref: `${SCHEMA_ID}#/definitions/${schema}` });
        validators.set(name, validator);
      }
      const data = structuredClone(value);
      if (validator(data)) return { ok: true, errors: "" };
      return { ok: false, errors: ajv.errorsText(validator.errors, { separator: "; " }) };
    },
  };
}

function buildOperations(doc: RecordValue, requestBodies: RecordValue): readonly MockOperation[] {
  const result: MockOperation[] = [];
  const paths = doc["paths"] as RecordValue;
  for (const [path, itemValue] of Object.entries(paths)) {
    if (!isRecord(itemValue)) continue;
    const pathParams = collectParamNames(itemValue["parameters"], doc);
    for (const method of METHODS) {
      const opValue = itemValue[method];
      if (!isRecord(opValue)) continue;
      const scopes: string[] = [];
      const security = opValue["security"];
      if (Array.isArray(security)) {
        for (const entry of security) {
          if (!isRecord(entry)) continue;
          for (const value of Object.values(entry)) {
            if (Array.isArray(value))
              scopes.push(...value.filter((s): s is string => typeof s === "string"));
          }
        }
      }
      const queryParams = collectParamNames(opValue["parameters"], doc).filter(
        (name) => !pathParams.includes(name),
      );
      const bodyRef = opValue["requestBody"];
      const requestBody =
        isRecord(bodyRef) && typeof bodyRef["$ref"] === "string"
          ? bodyRef["$ref"].split("/").at(-1)
          : undefined;
      if (requestBody !== undefined && requestBodies[requestBody] === undefined) {
        throw new Error(`unknown request body component ${requestBody}`);
      }
      const name = operationName(method, path);
      const responses: MockResponse[] = [];
      const responseMap = opValue["responses"];
      if (isRecord(responseMap)) {
        for (const [code, responseValue] of Object.entries(responseMap)) {
          if (!isRecord(responseValue)) continue;
          const content = responseValue["content"];
          const first = isRecord(content) ? Object.values(content)[0] : undefined;
          // Inline response schemas are registered by the generator under
          // `<Operation>Response`; named $refs keep their component name.
          const rawSchema = isRecord(first) ? first["schema"] : undefined;
          const schema =
            schemaNameOf(rawSchema) ?? (isRecord(rawSchema) ? `${name}ResponseSchema` : undefined);
          const contentType = isRecord(content) ? Object.keys(content)[0] : undefined;
          responses.push({
            code: Number(code),
            ...(contentType === undefined ? {} : { contentType }),
            ...(schema === undefined ? {} : { schema }),
          });
        }
      }
      result.push({
        name,
        method,
        path,
        tag:
          typeof opValue["tags"] === "object" && Array.isArray(opValue["tags"])
            ? String(opValue["tags"][0] ?? "")
            : "",
        scopes,
        pathParams,
        queryParams,
        ...(requestBody === undefined ? {} : { requestBody }),
        requestBodyRequired:
          requestBody !== undefined &&
          (requestBodies[requestBody] as RecordValue)["required"] === true,
        responses,
      });
    }
  }
  return result;
}

/** Deterministic name from method + path, matching the committed registry's convention. */
export function operationName(method: string, path: string): string {
  const segments = path
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) =>
      pascal(segment.startsWith("{") && segment.endsWith("}") ? segment.slice(1, -1) : segment),
    );
  return `${method[0]?.toUpperCase() ?? ""}${method.slice(1)}${segments.join("")}`;
}

function pascal(value: string): string {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter((word) => word.length > 0)
    .map((word) => (word[0] ?? "").toUpperCase() + word.slice(1))
    .join("");
}

function collectParamNames(value: unknown, doc: RecordValue): string[] {
  if (!Array.isArray(value)) return [];
  const names: string[] = [];
  for (const entry of value) {
    const parameter = resolveParameter(entry, doc);
    if (parameter !== undefined && typeof parameter["name"] === "string")
      names.push(parameter["name"]);
  }
  return names;
}

function resolveParameter(entry: unknown, doc: RecordValue): RecordValue | undefined {
  if (!isRecord(entry)) return undefined;
  if (typeof entry["$ref"] === "string") {
    const name = entry["$ref"].split("/").at(-1) ?? "";
    const components = doc["components"] as RecordValue;
    const parameters = components["parameters"] as RecordValue | undefined;
    const value = parameters?.[name];
    return isRecord(value) ? value : undefined;
  }
  return entry;
}

function schemaNameOf(value: unknown): string | undefined {
  if (!isRecord(value) || typeof value["$ref"] !== "string") return undefined;
  return value["$ref"].split("/").at(-1);
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Rewrites `#/components/schemas/X` to local `#/definitions/X` references. */
function rewriteRefs(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(rewriteRefs);
    return;
  }
  if (!isRecord(node)) return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "$ref" && typeof value === "string" && value.startsWith("#/components/schemas/")) {
      node[key] = `#/definitions/${value.slice("#/components/schemas/".length)}`;
    } else {
      rewriteRefs(value);
    }
  }
}

function correctUpstreamDefects(doc: RecordValue): void {
  const components = doc["components"] as RecordValue;
  const schemas = components["schemas"] as RecordValue;
  stripSlashDelimitedPatterns(schemas);
  // Drop required entries that no schema/composition declares. The official
  // examples prove those keys are not part of the payload; keeping them would
  // reject every valid request (see SPEC.md errata). Done generically here.
  for (const schema of Object.values(schemas)) {
    if (!isRecord(schema)) continue;
    if (Array.isArray(schema["required"])) {
      const declared = declaredProperties(schema, schemas, new Set<string>());
      schema["required"] = (schema["required"] as unknown[]).filter(
        (name) => typeof name === "string" && declared.has(name),
      );
    }
    // Upstream repeats the same oneOf branch twice (RecRevisada.devedor).
    // Identical branches make `oneOf` unsatisfiable; deduplicate them.
    dedupeOneOf(schema);
  }
}

function stripAnnotations(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(stripAnnotations);
  if (!isRecord(node)) return node;
  const result: RecordValue = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === "title" || key === "description") continue;
    result[key] = stripAnnotations(value);
  }
  return result;
}

function dedupeOneOf(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(dedupeOneOf);
    return;
  }
  if (!isRecord(node)) return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "oneOf" && Array.isArray(value)) {
      const seen = new Set<string>();
      node[key] = value.filter((branch) => {
        // Titles/descriptions are annotations and do not affect validation.
        const serialized = JSON.stringify(stripAnnotations(branch));
        if (seen.has(serialized)) return false;
        seen.add(serialized);
        return true;
      });
    } else {
      dedupeOneOf(value);
    }
  }
}

function declaredProperties(
  schema: RecordValue,
  schemas: RecordValue,
  visiting: Set<string>,
): Set<string> {
  const names = new Set<string>();
  if (isRecord(schema["properties"])) {
    for (const key of Object.keys(schema["properties"])) names.add(key);
  }
  if (Array.isArray(schema["allOf"])) {
    for (const member of schema["allOf"]) {
      for (const name of declaredProperties(resolveSchema(member, schemas), schemas, visiting)) {
        names.add(name);
      }
    }
  }
  return names;
}

function resolveSchema(value: unknown, schemas: RecordValue): RecordValue {
  if (isRecord(value) && typeof value["$ref"] === "string") {
    const name = value["$ref"].split("/").at(-1) ?? "";
    const resolved = schemas[name];
    return isRecord(resolved) ? resolved : {};
  }
  return isRecord(value) ? value : {};
}

function stripSlashDelimitedPatterns(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(stripSlashDelimitedPatterns);
    return;
  }
  if (!isRecord(node)) return;
  for (const [key, value] of Object.entries(node)) {
    if (
      key === "pattern" &&
      typeof value === "string" &&
      value.startsWith("/^") &&
      value.endsWith("$/")
    ) {
      node[key] = value.slice(1, -1);
    } else {
      stripSlashDelimitedPatterns(value);
    }
  }
}
