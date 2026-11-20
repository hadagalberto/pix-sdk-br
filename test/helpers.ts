/**
 * Shared test helpers: loads the pinned spec (with errata applied) so tests
 * can compare the generated artifacts against the source of truth directly.
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { applyErrata } from "../scripts/generator/errata.js";
import { parseSpecText } from "../scripts/generator/openapi.js";
import type { OpenApiDocument, OpenApiSchema } from "../scripts/generator/openapi.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const specPath = resolve(repoRoot, "spec", "openapi.yaml");
export const lockPath = resolve(repoRoot, "spec", "spec.lock.json");
export const generatedDir = resolve(repoRoot, "src", "generated");
export const scratchDir = resolve(repoRoot, ".test-tmp");

export interface SpecLock {
  readonly source: string;
  readonly pinnedCommit: string;
  readonly specVersion: string;
  readonly sha256: string;
}

export async function readSpecLock(): Promise<SpecLock> {
  return JSON.parse(await readFile(lockPath, "utf8")) as SpecLock;
}

export async function readSpecFile(): Promise<string> {
  return readFile(specPath, "utf8");
}

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

let cachedDocument: OpenApiDocument | undefined;
let cachedRawDocument: OpenApiDocument | undefined;

/** The parsed spec, unmodified (as downloaded). */
export async function loadRawSpec(): Promise<OpenApiDocument> {
  cachedRawDocument ??= parseSpecText(await readSpecFile());
  return cachedRawDocument;
}

/** The parsed spec, with the documented errata applied (like the generator sees it). */
export async function loadErrataAppliedSpec(): Promise<OpenApiDocument> {
  if (cachedDocument === undefined) {
    cachedDocument = parseSpecText(await readSpecFile());
    applyErrata(cachedDocument);
  }
  return cachedDocument;
}

/** Walks every schema in the document (components + inline bodies + params). */
export function walkSchemas(
  doc: OpenApiDocument,
  visit: (schema: OpenApiSchema, location: string) => void,
): void {
  const walk = (schema: OpenApiSchema | undefined, location: string): void => {
    if (schema === undefined) return;
    visit(schema, location);
    if (schema.$ref !== undefined) return;
    for (const [key, property] of Object.entries(schema.properties ?? {})) {
      walk(property, `${location}.${key}`);
    }
    walk(schema.items, `${location}.items`);
    for (const [index, member] of (schema.allOf ?? []).entries()) {
      walk(member, `${location}.allOf[${index}]`);
    }
    for (const [index, member] of (schema.oneOf ?? []).entries()) {
      walk(member, `${location}.oneOf[${index}]`);
    }
    for (const [index, member] of (schema.anyOf ?? []).entries()) {
      walk(member, `${location}.anyOf[${index}]`);
    }
  };
  for (const [name, schema] of Object.entries(doc.components.schemas ?? {})) {
    walk(schema, `components.schemas.${name}`);
  }
  for (const [name, body] of Object.entries(doc.components.requestBodies ?? {})) {
    walk(body.content["application/json"]?.schema, `components.requestBodies.${name}`);
  }
  for (const [path, item] of Object.entries(doc.paths)) {
    for (const [index, parameter] of (item.parameters ?? []).entries()) {
      walk(parameter.schema, `paths.${path}.parameters[${index}]`);
    }
    for (const method of ["get", "put", "post", "patch", "delete"] as const) {
      const operation = item[method];
      if (operation === undefined) continue;
      for (const [index, parameter] of (operation.parameters ?? []).entries()) {
        walk(parameter.schema, `paths.${path}.${method}.parameters[${index}]`);
      }
      for (const [code, response] of Object.entries(operation.responses ?? {})) {
        if ("$ref" in response) continue;
        for (const media of Object.values(response.content ?? {})) {
          walk(media.schema, `paths.${path}.${method}.responses.${code}`);
        }
      }
    }
  }
}
