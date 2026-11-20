/**
 * Proves the generator covers every path, operation, schema, request body,
 * parameter component, response component, scope and example in the pinned
 * spec — by walking the spec itself and comparing against the generated
 * runtime registries. Also enforces that committed generated files are exactly
 * what the generator produces (drift check) and that the spec file matches the
 * pinned checksum.
 */

import { readdir, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { generate } from "../scripts/generate.js";
import { operationName, type HttpMethod } from "../scripts/generator/operations.js";
import type { OpenApiParameter } from "../scripts/generator/openapi.js";
import {
  loadErrataAppliedSpec,
  lockPath,
  readSpecLock,
  readSpecFile,
  scratchDir,
  sha256,
  specPath,
  walkSchemas,
} from "./helpers.js";
import { requestBodyValidators, schemaValidators } from "../src/generated/validators.js";
import { OPERATIONS } from "../src/generated/operations.js";
import {
  operationResponseExamples,
  requestBodyExamples,
  specExamples,
} from "../src/generated/examples.js";
import { OAUTH_SCOPES } from "../src/generated/scopes.js";
import { SPEC_ERRATA } from "../src/generated/meta.js";

const doc = await loadErrataAppliedSpec();

describe("pinned spec integrity", () => {
  it("spec/openapi.yaml matches the sha256 recorded in spec/spec.lock.json", async () => {
    const lock = await readSpecLock();
    expect(sha256(await readSpecFile())).toBe(lock.sha256);
  });

  it("spec version matches the lock and generated metadata", async () => {
    const lock = await readSpecLock();
    expect(doc.info.version).toBe(lock.specVersion);
    expect(doc.info.version).toBe("2.11.0-rc1");
  });
});

describe("generator drift check", () => {
  let summary: Awaited<ReturnType<typeof generate>>;

  beforeAll(async () => {
    await rm(scratchDir, { recursive: true, force: true });
    summary = await generate({ specPath, lockPath, outDir: scratchDir });
  });

  afterAll(async () => {
    await rm(scratchDir, { recursive: true, force: true });
  });

  it("regenerates byte-identical files for every generated module", async () => {
    const generated = await readdir(scratchDir);
    expect(generated.sort()).toEqual(
      [
        "examples.ts",
        "index.ts",
        "meta.ts",
        "operations.ts",
        "schemas.ts",
        "scopes.ts",
        "validators.ts",
      ].sort(),
    );
    for (const file of generated) {
      const regenerated = await readFile(resolve(scratchDir, file), "utf8");
      const committed = await readFile(resolve("src", "generated", file), "utf8");
      expect(regenerated, `committed src/generated/${file} differs from fresh generation`).toBe(
        committed,
      );
    }
  });

  it("reports the same counts as the spec", () => {
    expect(summary.schemaCount).toBe(Object.keys(doc.components.schemas ?? {}).length);
    expect(summary.requestBodyCount).toBe(Object.keys(doc.components.requestBodies ?? {}).length);
    expect(summary.operationCount).toBe(Object.values(OPERATIONS).length);
    expect(summary.exampleCount).toBe(Object.keys(doc.components.examples ?? {}).length);
    expect(summary.errataCount).toBe(SPEC_ERRATA.length);
  });
});

describe("operation coverage (every path × method in the spec)", () => {
  const specOperations = new Map<string, { method: HttpMethod; path: string }>();
  for (const [path, item] of Object.entries(doc.paths)) {
    for (const method of ["get", "put", "post", "patch", "delete"] as const) {
      if (item[method] !== undefined) {
        specOperations.set(operationName(method, path), { method, path });
      }
    }
  }

  it("every spec operation has a registry entry (and no extras)", () => {
    expect(Object.keys(OPERATIONS).sort()).toEqual([...specOperations.keys()].sort());
  });

  it("operation names are the deterministic method+path derivation", () => {
    for (const [name, info] of Object.entries(OPERATIONS)) {
      expect(name).toBe(operationName(info.method, info.path));
    }
  });

  it("each operation mirrors the spec: method, path, tag, scopes, body, params, responses", () => {
    for (const [name, expected] of specOperations) {
      const operation = OPERATIONS[name];
      const pathItem = doc.paths[expected.path];
      const specOperation = pathItem?.[expected.method];
      expect(operation, `missing operation ${name}`).toBeDefined();
      expect(specOperation, `missing spec operation ${name}`).toBeDefined();
      if (operation === undefined || specOperation === undefined) continue;

      expect(operation.method).toBe(expected.method);
      expect(operation.path).toBe(expected.path);
      expect(operation.tag).toBe(specOperation.tags?.[0]);
      expect(operation.summary).toBe(specOperation.summary);

      // Scopes (security OAuth2) or unauthenticated.
      const scopes = (specOperation.security ?? []).flatMap((entry) => entry["OAuth2"] ?? []);
      expect(operation.scopes).toEqual([...new Set(scopes)]);

      // Request body.
      const bodyRef = specOperation.requestBody?.$ref;
      if (bodyRef === undefined) {
        expect(operation.requestBody).toBeUndefined();
      } else {
        const bodyName = bodyRef.split("/").pop() ?? "";
        const body = doc.components.requestBodies?.[bodyName];
        expect(operation.requestBody?.name).toBe(bodyName);
        expect(operation.requestBody?.required).toBe(body?.required === true);
      }

      // Parameters: merge path-level + operation-level (component $refs resolved).
      const merged = new Map<string, { name: string; in: string; required: boolean }>();
      const resolveParameter = (
        parameter: OpenApiParameter | { $ref: string },
      ): OpenApiParameter => {
        if ("$ref" in parameter) {
          const resolved = doc.components.parameters?.[parameter.$ref.split("/").pop() ?? ""];
          if (resolved === undefined) throw new Error(`unresolved parameter ${parameter.$ref}`);
          return resolved;
        }
        return parameter;
      };
      for (const parameter of (pathItem?.parameters ?? []) as (
        OpenApiParameter | { $ref: string }
      )[]) {
        const resolved = resolveParameter(parameter);
        merged.set(resolved.name, {
          name: resolved.name,
          in: resolved.in,
          required: resolved.required === true,
        });
      }
      for (const parameter of (specOperation.parameters ?? []) as (
        OpenApiParameter | { $ref: string }
      )[]) {
        const resolved = resolveParameter(parameter);
        merged.set(resolved.name, {
          name: resolved.name,
          in: resolved.in,
          required: resolved.required === true,
        });
      }
      const expectedPath = [...merged.values()]
        .filter((parameter) => parameter.in === "path")
        .map((parameter) => ({ name: parameter.name, required: parameter.required }));
      const expectedQuery = [...merged.values()]
        .filter((parameter) => parameter.in === "query")
        .map((parameter) => ({ name: parameter.name, required: parameter.required }));
      expect(operation.pathParams, `${name} path params`).toEqual(expectedPath);
      expect(operation.queryParams, `${name} query params`).toEqual(expectedQuery);

      // Responses: codes, schema names, error body.
      const specResponses = specOperation.responses ?? {};
      const specCodes = Object.keys(specResponses).map(Number).sort();
      expect(operation.responses.map((response) => response.code).sort()).toEqual(specCodes);
      for (const response of operation.responses) {
        const specResponse = specResponses[String(response.code)];
        expect(specResponse, `missing spec response ${name}[${response.code}]`).toBeDefined();
        if (specResponse === undefined) continue;
        if ("$ref" in specResponse) {
          const resolved = doc.components.responses?.[specResponse.$ref.split("/").pop() ?? ""];
          expect(response.description).toBe(resolved?.description);
        } else {
          expect(response.description).toBe(specResponse.description);
        }
        if (response.code >= 400) {
          expect(response.schema).toBe("Problema");
        }
      }
      const success = operation.responses.filter((response) => response.code < 300);
      expect(operation.hasResponseBody).toBe(
        success.some((response) => response.schema !== undefined),
      );
      expect(operation.errorSchema).toBe("Problema");
    }
  });

  it("payload endpoints are unauthenticated; everything else uses OAuth2", () => {
    for (const [name, operation] of Object.entries(OPERATIONS)) {
      const unauthenticated =
        operation.path === "/{pixUrlAccessToken}" ||
        operation.path === "/cobv/{pixUrlAccessToken}" ||
        operation.path === "/rec/{recUrlAccessToken}";
      if (unauthenticated) {
        expect(operation.scopes, `${name} should be unauthenticated`).toEqual([]);
      } else {
        expect(operation.scopes.length, `${name} should declare scopes`).toBeGreaterThan(0);
      }
    }
  });

  it("every declared scope exists in the spec securitySchemes, except the documented upstream typo", () => {
    const declared = new Set<string>(OAUTH_SCOPES);
    const upstreamTypo = "webhookcobV.write"; // capital V, present in the pinned file
    for (const [name, operation] of Object.entries(OPERATIONS)) {
      for (const scope of operation.scopes) {
        if (scope === upstreamTypo) continue;
        expect(declared.has(scope), `${name} uses undeclared scope ${scope}`).toBe(true);
      }
    }
    const webhookCobvPut = OPERATIONS["PutWebhookcobv"];
    expect(webhookCobvPut, "PutWebhookcobv missing").toBeDefined();
    if (webhookCobvPut === undefined) return;
    expect(webhookCobvPut.scopes).toContain(upstreamTypo);
    expect([...OAUTH_SCOPES]).toContain("webhookcobv.write");
  });

  it("the spec's own scope list is exported verbatim", () => {
    const specScopes = Object.keys(
      doc.components.securitySchemes?.["OAuth2"]?.flows?.["clientCredentials"]?.scopes ?? {},
    );
    expect([...OAUTH_SCOPES]).toEqual(specScopes);
  });
});

describe("schema and request-body coverage", () => {
  it("every components.schemas entry has a runtime validator", () => {
    const specSchemas = Object.keys(doc.components.schemas ?? {}).sort();
    for (const name of specSchemas) {
      expect(typeof schemaValidators[name], `no validator for schema ${name}`).toBe("function");
    }
  });

  it("validators carry exactly the component schemas plus the inline (named) extras", () => {
    const specSchemas = new Set(Object.keys(doc.components.schemas ?? {}));
    const extras = new Set(Object.keys(schemaValidators));
    for (const name of specSchemas) extras.delete(name);
    expect([...extras].sort()).toEqual(
      // Inline request bodies + inline response schemas get named registrations.
      [
        "GetPixE2eidResponseSchema",
        "LoteCobVBody",
        "LoteCobVBodyRevisado",
        "PostCobrTxidRetentativaDataResponseSchema",
        "WebhookCobBody",
        "WebhookCobRBody",
        "WebhookCobVBody",
        "WebhookPixBody",
        "WebhookRecBody",
      ].sort(),
    );
  });

  it("every components.requestBodies entry has a validator", () => {
    const specBodies = Object.keys(doc.components.requestBodies ?? {}).sort();
    expect(Object.keys(requestBodyValidators).sort()).toEqual(specBodies);
  });

  it("every components.parameters entry is used by operations", () => {
    const parameterComponents = Object.keys(doc.components.parameters ?? {});
    expect(parameterComponents.sort()).toEqual(["itensPorPagina", "paginaAtual"]);
    const used = new Set<string>();
    for (const operation of Object.values(OPERATIONS)) {
      for (const parameter of [...operation.pathParams, ...operation.queryParams]) {
        used.add(parameter.name);
      }
    }
    expect(used.has("paginacao.paginaAtual")).toBe(true);
    expect(used.has("paginacao.itensPorPagina")).toBe(true);
  });

  it("every components.responses entry referenced by operations appears in their response lists; the unreferenced one is documented", () => {
    const responseComponents = Object.keys(doc.components.responses ?? {});
    expect(responseComponents.sort()).toEqual(
      ["AcessoNegado", "NaoEncontrado", "RequisicaoInvalida", "ServicoIndisponivel"].sort(),
    );
    const emitted = new Set<string>();
    for (const operation of Object.values(OPERATIONS)) {
      for (const response of operation.responses) {
        emitted.add(response.description);
      }
    }
    for (const name of responseComponents) {
      const description = doc.components.responses?.[name]?.description ?? "";
      const used = [...emitted].some((candidate) => candidate === description);
      if (name === "RequisicaoInvalida") {
        // Declared upstream but never referenced by any operation: the paths
        // declare their 400 responses inline instead. The generator faithfully
        // emits what the paths use.
        expect(used).toBe(false);
      } else {
        expect(used, `response component ${name} never used`).toBe(true);
      }
    }
  });

  it("every components.examples entry is exported in specExamples", () => {
    const specExampleNames = Object.keys(doc.components.examples ?? {}).sort();
    expect(Object.keys(specExamples).sort()).toEqual(specExampleNames);
  });

  it("request bodies with examples expose all of them", () => {
    for (const [bodyName, body] of Object.entries(doc.components.requestBodies ?? {})) {
      const media = body.content["application/json"];
      const count = Object.keys(media?.examples ?? {}).length;
      expect(requestBodyExamples[bodyName]?.length ?? 0).toBe(count);
    }
  });

  it("operations expose every response example the spec declares (including via $ref'd responses)", () => {
    for (const [name, operation] of Object.entries(OPERATIONS)) {
      const specOperation = doc.paths[operation.path]?.[operation.method];
      for (const [code, responseOrRef] of Object.entries(specOperation?.responses ?? {})) {
        let examples: Record<string, unknown> = {};
        if ("$ref" in responseOrRef) {
          const componentName = responseOrRef.$ref.split("/").pop() ?? "";
          examples =
            doc.components.responses?.[componentName]?.content?.["application/problem+json"]
              ?.examples ?? {};
        } else {
          for (const media of Object.values(responseOrRef.content ?? {})) {
            examples = { ...examples, ...(media.examples ?? {}) };
          }
        }
        expect(operationResponseExamples[name]?.[Number(code)]?.length ?? 0).toBe(
          Object.keys(examples).length,
        );
      }
    }
  });
});

describe("constraint-feature inventory (every constraint type in the spec)", () => {
  const inventory = new Set<string>();
  const formats = new Set<string>();
  walkSchemas(doc, (schema) => {
    if (schema.pattern !== undefined) inventory.add("pattern");
    if (schema.enum !== undefined) inventory.add("enum");
    if (schema.minLength !== undefined) inventory.add("minLength");
    if (schema.maxLength !== undefined) inventory.add("maxLength");
    if (schema.minimum !== undefined) inventory.add("minimum");
    if (schema.maximum !== undefined) inventory.add("maximum");
    if (schema.format !== undefined) formats.add(schema.format);
    if (schema.type === "boolean") inventory.add("boolean");
    if (schema.type === "integer") inventory.add("integer");
    if (schema.type === "array") inventory.add("array");
    if (schema.items !== undefined) inventory.add("items");
    if (schema.minItems !== undefined) inventory.add("minItems");
    if (schema.maxItems !== undefined) inventory.add("maxItems");
    if (schema.uniqueItems !== undefined) inventory.add("uniqueItems");
    if (schema.type === "object" || schema.properties !== undefined) inventory.add("object");
    if (schema.allOf !== undefined) inventory.add("allOf");
    if (schema.oneOf !== undefined) inventory.add("oneOf");
    if (schema.anyOf !== undefined) inventory.add("anyOf");
    if (schema.required !== undefined) inventory.add("required");
    if (schema.$ref !== undefined) inventory.add("$ref");
    if (
      schema.type === undefined &&
      schema.properties === undefined &&
      schema.required === undefined &&
      schema.allOf === undefined &&
      schema.pattern !== undefined
    ) {
      inventory.add("bare-pattern-member");
    }
    if (
      schema.type === undefined &&
      schema.properties === undefined &&
      schema.required !== undefined
    ) {
      inventory.add("bare-required-member");
    }
  });
  // Parameters can carry schemas too.
  for (const [, item] of Object.entries(doc.paths)) {
    for (const method of ["get", "put", "post", "patch", "delete"] as const) {
      const operation = item[method];
      for (const parameter of (operation?.parameters ?? []) as (
        | OpenApiParameter
        | {
            $ref: string;
          }
      )[]) {
        const resolved: OpenApiParameter | undefined =
          "$ref" in parameter
            ? doc.components.parameters?.[parameter.$ref.split("/").pop() ?? ""]
            : parameter;
        if (resolved?.schema?.pattern !== undefined) inventory.add("pattern");
        if (resolved?.schema?.format !== undefined) formats.add(resolved.schema.format);
      }
    }
  }

  it("the spec's constraint vocabulary is exactly what the engine supports", () => {
    expect([...inventory].sort()).toEqual(
      [
        "$ref",
        "allOf",
        "anyOf",
        "array",
        "bare-pattern-member",
        "bare-required-member",
        "boolean",
        "enum",
        "integer",
        "items",
        "maxItems",
        "maxLength",
        "minItems",
        "minLength",
        "object",
        "oneOf",
        "pattern",
        "required",
        "uniqueItems",
        "minimum",
        "maximum",
      ].sort(),
    );
  });

  it("string formats used by the spec are exactly date, date-time, uri, int32 and int64", () => {
    expect([...formats].sort()).toEqual(["date", "date-time", "int32", "int64", "uri"]);
  });
});
