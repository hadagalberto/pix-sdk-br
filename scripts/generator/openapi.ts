/**
 * Narrow, hand-rolled TypeScript types for the subset of OpenAPI 3.0 used by
 * the generator, plus the spec loader.
 *
 * `yaml` parses into plain objects; a single cast in `loadSpec` brings the
 * document into these types so the rest of the generator is fully type-safe.
 */

/** JSON value as produced by the YAML parser. */
export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export interface OpenApiSchema {
  $ref?: string;
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  items?: OpenApiSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
  nullable?: boolean;
  additionalProperties?: boolean | OpenApiSchema;
  allOf?: OpenApiSchema[];
  oneOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
  example?: JsonValue;
  default?: JsonValue;
  readOnly?: boolean;
}

export interface OpenApiParameter {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  title?: string;
  schema?: OpenApiSchema;
}

export interface OpenApiExampleRef {
  $ref: string;
}

export interface OpenApiMediaType {
  schema?: OpenApiSchema;
  examples?: Record<string, OpenApiExampleRef>;
}

export interface OpenApiRequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, OpenApiMediaType>;
}

export interface OpenApiResponse {
  description: string;
  headers?: unknown;
  content?: Record<string, OpenApiMediaType>;
}

export interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  security?: Record<string, string[]>[];
  parameters?: OpenApiParameter[];
  requestBody?: { $ref?: string };
  responses?: Record<string, OpenApiResponse | { $ref: string }>;
  servers?: unknown;
}

export interface OpenApiPathItem {
  parameters?: OpenApiParameter[];
  get?: OpenApiOperation;
  put?: OpenApiOperation;
  post?: OpenApiOperation;
  patch?: OpenApiOperation;
  delete?: OpenApiOperation;
}

export interface OpenApiComponents {
  securitySchemes?: Record<
    string,
    { type: string; flows?: Record<string, { tokenUrl?: string; scopes?: Record<string, string> }> }
  >;
  examples?: Record<string, { summary?: string; value?: JsonValue }>;
  requestBodies?: Record<string, OpenApiRequestBody>;
  schemas?: Record<string, OpenApiSchema>;
  parameters?: Record<string, OpenApiParameter>;
  responses?: Record<string, OpenApiResponse>;
}

export interface OpenApiDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: { url: string; description?: string }[];
  tags?: { name: string; "x-displayName"?: string; description?: string }[];
  paths: Record<string, OpenApiPathItem>;
  components: OpenApiComponents;
}

export class SpecError extends Error {
  constructor(
    message: string,
    readonly location: string,
  ) {
    super(`${message}\n  at: ${location}`);
    this.name = "SpecError";
  }
}

import { readFile } from "node:fs/promises";
import { parse } from "yaml";

/** Parses raw YAML text into the typed OpenAPI document (single internal cast). */
export function parseSpecText(text: string): OpenApiDocument {
  // `yaml`'s parse() is untyped (`any`); this is the one deliberate cast in
  // the generator — everything downstream is fully typed.
  return parse(text) as OpenApiDocument;
}

/** Loads and parses the OpenAPI document from disk. */
export async function loadSpec(specPath: string): Promise<OpenApiDocument> {
  return parseSpecText(await readFile(specPath, "utf8"));
}

/** Returns the final segment of an internal reference, e.g. `#/components/schemas/TxId` → `TxId`. */
export function refName(ref: string, expectedPrefix: string, location: string): string {
  if (!ref.startsWith(expectedPrefix)) {
    throw new SpecError(`unsupported $ref "${ref}" (expected prefix ${expectedPrefix})`, location);
  }
  return ref.slice(expectedPrefix.length);
}

export const SCHEMAS_PREFIX = "#/components/schemas/";
export const REQUEST_BODIES_PREFIX = "#/components/requestBodies/";
export const RESPONSES_PREFIX = "#/components/responses/";
export const PARAMETERS_PREFIX = "#/components/parameters/";
export const EXAMPLES_PREFIX = "#/components/examples/";
