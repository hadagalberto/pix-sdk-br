/**
 * Walks `paths` in the OpenAPI document and produces one compiled operation
 * per HTTP method, covering: parameters (path/query), request bodies,
 * responses (with their schemas and official examples), OAuth2 scopes and
 * metadata. The results feed `src/generated/operations.ts`.
 */

import type {
  JsonValue,
  OpenApiDocument,
  OpenApiMediaType,
  OpenApiParameter,
  OpenApiSchema,
} from "./openapi.js";
import type { SpecExamples } from "./examples.js";
import {
  SpecError,
  EXAMPLES_PREFIX,
  PARAMETERS_PREFIX,
  REQUEST_BODIES_PREFIX,
  RESPONSES_PREFIX,
  SCHEMAS_PREFIX,
  refName,
} from "./openapi.js";

export type HttpMethod = "get" | "put" | "post" | "patch" | "delete";

export const HTTP_METHODS: readonly HttpMethod[] = ["get", "put", "post", "patch", "delete"];

export interface CompiledParam {
  readonly name: string;
  readonly required: boolean;
  readonly schema: OpenApiSchema;
}

export interface CompiledExample {
  readonly name: string;
  readonly value: JsonValue;
}

export interface CompiledResponse {
  readonly code: number;
  readonly description: string;
  readonly contentType: string | undefined;
  /** Named schema for the response body (inline schemas are registered under `${op}Response`). */
  readonly schemaName: string | undefined;
  readonly examples: readonly CompiledExample[];
}

export interface CompiledRequestBody {
  readonly name: string;
  readonly required: boolean;
  readonly schemaName: string;
  readonly examples: readonly CompiledExample[];
}

export interface CompiledOperation {
  readonly name: string;
  readonly method: HttpMethod;
  readonly path: string;
  readonly tag: string;
  readonly summary: string;
  readonly scopes: readonly string[];
  readonly pathParams: readonly CompiledParam[];
  readonly queryParams: readonly CompiledParam[];
  readonly requestBody: CompiledRequestBody | undefined;
  readonly responses: readonly CompiledResponse[];
}

export interface OperationsResult {
  readonly operations: readonly CompiledOperation[];
  /** Inline response schemas, to be emitted as named schemas/types. */
  readonly inlineResponseSchemas: ReadonlyMap<string, OpenApiSchema>;
}

const PASCAL_WORDS_RE = /[^A-Za-z0-9]+/;

function pascalCase(value: string): string {
  return value
    .split(PASCAL_WORDS_RE)
    .filter((word) => word.length > 0)
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join("");
}

/** Deterministic operation name from method + path, e.g. `PUT /cob/{txid}` → `PutCobTxid`. */
export function operationName(method: HttpMethod, path: string): string {
  const segments = path
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) =>
      segment.startsWith("{") && segment.endsWith("}")
        ? pascalCase(segment.slice(1, -1))
        : pascalCase(segment),
    );
  return `${method[0]!.toUpperCase()}${method.slice(1)}${segments.join("")}`;
}

function resolveParameter(
  parameter: OpenApiParameter | { $ref: string },
  doc: OpenApiDocument,
  location: string,
): OpenApiParameter {
  if ("$ref" in parameter) {
    const ref = parameter.$ref;
    const name = refName(ref, PARAMETERS_PREFIX, location);
    const resolved = doc.components.parameters?.[name];
    if (resolved === undefined) {
      throw new SpecError(`unknown parameter component "${ref}"`, location);
    }
    return resolved;
  }
  return parameter;
}

function mediaType(operation: OpenApiMediaType | undefined, location: string): OpenApiMediaType {
  if (operation === undefined) {
    throw new SpecError("expected content media type", location);
  }
  return operation;
}

function schemaNameOf(
  schema: OpenApiSchema | undefined,
  doc: OpenApiDocument,
  location: string,
): { name: string; inline: OpenApiSchema | undefined } {
  if (schema === undefined) {
    throw new SpecError("expected schema", location);
  }
  if (schema.$ref !== undefined) {
    const name = refName(schema.$ref, SCHEMAS_PREFIX, location);
    if ((doc.components.schemas?.[name] ?? undefined) === undefined) {
      throw new SpecError(`unknown schema reference "${schema.$ref}"`, location);
    }
    return { name, inline: undefined };
  }
  return { name: "", inline: schema };
}

/** Resolves `examples` entries (all are `$ref`s to components.examples in this spec). */
function collectExamples(
  media: OpenApiMediaType,
  specExamples: SpecExamples,
  location: string,
): readonly CompiledExample[] {
  const resolved: CompiledExample[] = [];
  for (const [key, example] of Object.entries(media.examples ?? {})) {
    const name = refName(example.$ref, EXAMPLES_PREFIX, location);
    const value = specExamples.byName.get(name)?.value;
    if (value === undefined) {
      throw new SpecError(`unknown example "${example.$ref}"`, location);
    }
    resolved.push({ name: key, value });
  }
  return resolved;
}

export function compileOperations(
  doc: OpenApiDocument,
  specExamples: SpecExamples,
): OperationsResult {
  const operations: CompiledOperation[] = [];
  const inlineResponseSchemas = new Map<string, OpenApiSchema>();
  const usedNames = new Set<string>();

  for (const [path, pathItem] of Object.entries(doc.paths)) {
    const pathParameters: OpenApiParameter[] = [];

    for (const parameter of pathItem.parameters ?? []) {
      const resolved = resolveParameter(parameter, doc, `paths.${path}.parameters`);
      pathParameters.push(resolved);
    }

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation === undefined) continue;
      const opLocation = `paths.${path}.${method}`;
      const name = operationName(method, path);
      if (usedNames.has(name)) {
        throw new SpecError(`operation name collision "${name}"`, opLocation);
      }
      usedNames.add(name);

      // ---- parameters (operation-level entries override path-level ones) ----
      const mergedParameters = new Map<string, OpenApiParameter>();
      for (const parameter of pathParameters) {
        mergedParameters.set(parameter.name, parameter);
      }
      for (const parameter of operation.parameters ?? []) {
        const resolved = resolveParameter(parameter, doc, `${opLocation}.parameters`);
        mergedParameters.set(resolved.name, resolved);
      }

      const pathParams: CompiledParam[] = [];
      const queryParams: CompiledParam[] = [];
      for (const parameter of mergedParameters.values()) {
        if (parameter.in === "path") {
          if (parameter.required !== true) {
            throw new SpecError(`path parameter "${parameter.name}" must be required`, opLocation);
          }
          pathParams.push({
            name: parameter.name,
            required: true,
            schema: requireSchema(parameter, opLocation),
          });
        } else if (parameter.in === "query") {
          queryParams.push({
            name: parameter.name,
            required: parameter.required === true,
            schema: requireSchema(parameter, opLocation),
          });
        } else {
          throw new SpecError(`unsupported parameter location "${parameter.in}"`, opLocation);
        }
      }

      // ---- request body -----------------------------------------------------
      let requestBody: CompiledRequestBody | undefined;
      const requestBodyRef = operation.requestBody?.$ref;
      if (requestBodyRef !== undefined) {
        const bodyName = refName(requestBodyRef, REQUEST_BODIES_PREFIX, opLocation);
        const body = doc.components.requestBodies?.[bodyName];
        if (body === undefined) {
          throw new SpecError(`unknown requestBody "${requestBodyRef}"`, opLocation);
        }
        const media = mediaType(body.content["application/json"], `${opLocation}.requestBody`);
        const { name: schemaName, inline } = schemaNameOf(
          media.schema,
          doc,
          `${opLocation}.requestBody`,
        );
        if (inline !== undefined) {
          // Inline request bodies are registered under their component name by
          // the orchestrator (generate.ts); reference them by that name.
          requestBody = {
            name: bodyName,
            required: body.required === true,
            schemaName: bodyName,
            examples: collectExamples(media, specExamples, `${opLocation}.requestBody`),
          };
        } else {
          requestBody = {
            name: bodyName,
            required: body.required === true,
            schemaName,
            examples: collectExamples(media, specExamples, `${opLocation}.requestBody`),
          };
        }
      }

      // ---- responses ---------------------------------------------------------
      const responses: CompiledResponse[] = [];
      for (const [codeText, responseOrRef] of Object.entries(operation.responses ?? {})) {
        const code = Number(codeText);
        if (!Number.isInteger(code) || code < 100 || code > 599) {
          throw new SpecError(`invalid response code "${codeText}"`, opLocation);
        }
        let description: string;
        let media: OpenApiMediaType | undefined;
        let contentType: string | undefined;
        let examples: readonly CompiledExample[] = [];

        if ("$ref" in responseOrRef) {
          const responseRef = responseOrRef.$ref;
          const responseName = refName(responseRef, RESPONSES_PREFIX, opLocation);
          const resolved = doc.components.responses?.[responseName];
          if (resolved === undefined) {
            throw new SpecError(`unknown response component "${responseRef}"`, opLocation);
          }
          description = resolved.description;
          [contentType, media] = selectMediaType(
            resolved.content,
            `${opLocation}.responses.${codeText}`,
          );
          examples =
            media === undefined
              ? []
              : collectExamples(media, specExamples, `${opLocation}.responses.${codeText}`);
        } else {
          const response = responseOrRef;
          description = response.description;
          [contentType, media] = selectMediaType(
            response.content,
            `${opLocation}.responses.${codeText}`,
          );
          examples =
            media === undefined
              ? []
              : collectExamples(media, specExamples, `${opLocation}.responses.${codeText}`);
        }

        let schemaName: string | undefined;
        if (media?.schema !== undefined) {
          const resolved = schemaNameOf(media.schema, doc, `${opLocation}.responses.${codeText}`);
          if (resolved.inline === undefined) {
            schemaName = resolved.name;
          } else {
            // Registered as a named schema so it gets types + validators like
            // any other; suffixed "…ResponseSchema" to avoid colliding with
            // the per-operation `${name}Response` type alias below.
            const inlineName = `${name}ResponseSchema`;
            const existing = inlineResponseSchemas.get(inlineName);
            if (
              existing !== undefined &&
              JSON.stringify(existing) !== JSON.stringify(resolved.inline)
            ) {
              throw new SpecError(`conflicting inline response schema "${inlineName}"`, opLocation);
            }
            inlineResponseSchemas.set(inlineName, resolved.inline);
            schemaName = inlineName;
          }
        }
        responses.push({ code, description, contentType, schemaName, examples });
      }

      // ---- scopes --------------------------------------------------------------
      const scopes: string[] = [];
      for (const requirement of operation.security ?? []) {
        for (const [scheme, required] of Object.entries(requirement)) {
          if (scheme !== "OAuth2") {
            throw new SpecError(`unsupported security scheme "${scheme}"`, opLocation);
          }
          scopes.push(...required);
        }
      }

      const tag = operation.tags?.[0];
      if (tag === undefined) {
        throw new SpecError("operation without tag", opLocation);
      }

      operations.push({
        name,
        method,
        path,
        tag,
        summary: operation.summary ?? "",
        scopes: [...new Set(scopes)],
        pathParams,
        queryParams,
        requestBody,
        responses,
      });
    }
  }

  return { operations, inlineResponseSchemas };
}

function requireSchema(parameter: OpenApiParameter, location: string): OpenApiSchema {
  if (parameter.schema === undefined) {
    throw new SpecError(`parameter "${parameter.name}" without schema`, location);
  }
  return parameter.schema;
}

/** Picks the JSON media type from a response `content` map, returning [key, media]. */
function selectMediaType(
  content: Record<string, OpenApiMediaType> | undefined,
  location: string,
): [string | undefined, OpenApiMediaType | undefined] {
  if (content === undefined) return [undefined, undefined];
  const preferred = ["application/json", "application/problem+json", "application/jose"];
  for (const key of preferred) {
    const media = content[key];
    if (media !== undefined) return [key, media];
  }
  const keys = Object.keys(content);
  if (keys.length > 0) {
    throw new SpecError(`unsupported response content type "${keys[0]}"`, location);
  }
  return [undefined, undefined];
}
