/**
 * Code generator entry point.
 *
 * Reads the pinned BCB "API Pix" OpenAPI file (spec/openapi.yaml), applies the
 * documented errata, and emits fully deterministic TypeScript into
 * `src/generated/`:
 *
 *   - schemas.ts      types for every schema (with upstream pt-BR TSDoc)
 *   - validators.ts   runtime validators (constraint IR) for every named schema
 *                     and request body
 *   - operations.ts   per-operation request/response types, the OPERATIONS
 *                     registry and parameter validators
 *   - examples.ts     the spec's official example payloads as data
 *   - contracts.ts    OpenAPI → JSON Schema contracts for the ajv contract tests
 *   - scopes.ts       OAuth2 scopes
 *   - meta.ts         provenance + errata list
 *   - index.ts         re-exports
 *
 * Run with `npm run generate`. The output is committed; a test regenerates into
 * a temporary directory and asserts byte-equality so CI catches drift.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compileAjvContracts } from "./generator/ajv-contracts.js";
import { applyErrata, errataInfo } from "./generator/errata.js";
import { collectSpecExamples, type NamedExample, type SpecExamples } from "./generator/examples.js";
import { createCompiler } from "./generator/ir.js";
import {
  compileOperations,
  type CompiledOperation,
  type OperationsResult,
} from "./generator/operations.js";
import {
  renderContractsFile,
  renderExamplesFile,
  renderIndexFile,
  renderMetaFile,
  renderOperationsFile,
  renderSchemasFile,
  renderScopesFile,
  renderValidatorsFile,
  type OperationResponseExamples,
  type RequestBodyInfo,
  type SpecMetaInput,
  formatTypeScript,
} from "./generator/emit.js";
import { loadSpec, SpecError, SCHEMAS_PREFIX, refName } from "./generator/openapi.js";
import type { OpenApiSchema } from "./generator/openapi.js";
import { typeContext } from "./generator/types.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export interface GenerateOptions {
  /** Path to spec/openapi.yaml (already fetched + checksum-verified). */
  readonly specPath: string;
  /** Path to spec/spec.lock.json (pinned commit + sha256). */
  readonly lockPath: string;
  /** Output directory (defaults to src/generated). */
  readonly outDir: string;
}

export interface GenerateSummary {
  readonly schemaCount: number;
  readonly requestBodyCount: number;
  readonly operationCount: number;
  readonly exampleCount: number;
  readonly errataCount: number;
  readonly files: readonly string[];
}

interface SpecLock {
  readonly source: string;
  readonly pinnedCommit: string;
  readonly specVersion: string;
  readonly sha256: string;
}

async function readLock(lockPath: string): Promise<SpecLock> {
  const { readFile } = await import("node:fs/promises");
  const lock = JSON.parse(await readFile(lockPath, "utf8")) as Partial<SpecLock>;
  if (
    lock.source === undefined ||
    lock.pinnedCommit === undefined ||
    lock.specVersion === undefined ||
    lock.sha256 === undefined
  ) {
    throw new SpecError("spec lock file is missing required fields", lockPath);
  }
  return lock as SpecLock;
}

/** Runs the full generation pipeline; writes files into `options.outDir`. */
export async function generate(options: GenerateOptions): Promise<GenerateSummary> {
  const lock = await readLock(options.lockPath);
  const doc = await loadSpec(options.specPath);
  if (doc.info.version !== lock.specVersion) {
    throw new SpecError(
      `spec version mismatch: lock says ${lock.specVersion}, file says ${doc.info.version}`,
      "info.version",
    );
  }

  applyErrata(doc);

  const specExamples: SpecExamples = collectSpecExamples(doc);
  const operations: OperationsResult = compileOperations(doc, specExamples);

  // Named extra schemas: inline request-body schemas (named after their
  // component) and inline response schemas (named after the operation).
  const extraNamed = new Map<string, OpenApiSchema>();
  const requestBodies: RequestBodyInfo[] = [];
  for (const [name, body] of Object.entries(doc.components.requestBodies ?? {})) {
    const media = body.content["application/json"];
    if (media?.schema === undefined) {
      throw new SpecError(
        `request body "${name}" without application/json schema`,
        "requestBodies",
      );
    }
    if (media.schema.$ref !== undefined) {
      const schemaName = refName(media.schema.$ref, SCHEMAS_PREFIX, `requestBodies.${name}`);
      requestBodies.push({
        name,
        description: body.description,
        required: body.required === true,
        schemaName,
      });
    } else {
      if (extraNamed.has(name) || (doc.components.schemas?.[name] ?? undefined) !== undefined) {
        throw new SpecError(
          `inline request body "${name}" collides with a schema name`,
          "requestBodies",
        );
      }
      extraNamed.set(name, media.schema);
      requestBodies.push({
        name,
        description: body.description,
        required: body.required === true,
        schemaName: name,
      });
    }
  }
  for (const [name, schema] of operations.inlineResponseSchemas) {
    extraNamed.set(name, schema);
  }

  const compiler = createCompiler(doc, extraNamed);
  const ctx = typeContext(doc, extraNamed);
  const meta: SpecMetaInput = {
    version: doc.info.version,
    pinnedCommit: lock.pinnedCommit,
    sha256: lock.sha256,
    source: lock.source,
  };

  // Example payloads per request body / per operation+status.
  const requestBodyExamples = new Map<string, readonly NamedExample[]>();
  const operationResponseExamples: OperationResponseExamples[] = [];
  for (const operation of operations.operations) {
    if (operation.requestBody !== undefined) {
      requestBodyExamples.set(operation.requestBody.name, [...operation.requestBody.examples]);
    }
    for (const response of operation.responses) {
      if (response.examples.length > 0) {
        operationResponseExamples.push({
          operation: operation.name,
          code: response.code,
          examples: response.examples,
        });
      }
    }
  }

  const schemaNames = Object.keys(doc.components.schemas ?? {});
  const operationNames = operations.operations.map(
    (operation: CompiledOperation) => operation.name,
  );

  const files: Record<string, string> = {
    "schemas.ts": renderSchemasFile(
      meta,
      doc,
      ctx,
      operations.inlineResponseSchemas,
      requestBodies,
    ),
    "validators.ts": renderValidatorsFile(
      meta,
      compiler,
      [...compiler.constraints.keys()],
      requestBodies,
    ),
    "operations.ts": renderOperationsFile(meta, operations, compiler, ctx),
    "examples.ts": renderExamplesFile(
      meta,
      specExamples,
      requestBodies,
      requestBodyExamples,
      operationResponseExamples,
    ),
    "contracts.ts": renderContractsFile(meta, compileAjvContracts(doc, operations, extraNamed)),
    "scopes.ts": renderScopesFile(meta, doc),
    "meta.ts": renderMetaFile(
      meta,
      errataInfo(),
      schemaNames,
      requestBodies.map((body) => body.name),
      operationNames,
    ),
    "index.ts": renderIndexFile(meta),
  };

  await mkdir(options.outDir, { recursive: true });
  const written: string[] = [];
  for (const [fileName, source] of Object.entries(files)) {
    const formatted = await formatTypeScript(source);
    const target = resolve(options.outDir, fileName);
    await writeFile(target, formatted, "utf8");
    written.push(target);
  }

  return {
    schemaCount: schemaNames.length,
    requestBodyCount: requestBodies.length,
    operationCount: operations.operations.length,
    exampleCount: specExamples.byName.size,
    errataCount: errataInfo().length,
    files: written,
  };
}

const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const summary = await generate({
    specPath: resolve(repoRoot, "spec", "openapi.yaml"),
    lockPath: resolve(repoRoot, "spec", "spec.lock.json"),
    outDir: resolve(repoRoot, "src", "generated"),
  });
  console.log(
    [
      `generated ${summary.files.length} files into src/generated`,
      `  schemas:      ${summary.schemaCount}`,
      `  requestBodies:${summary.requestBodyCount}`,
      `  operations:   ${summary.operationCount}`,
      `  examples:     ${summary.exampleCount}`,
      `  errata:       ${summary.errataCount}`,
    ].join("\n"),
  );
}
