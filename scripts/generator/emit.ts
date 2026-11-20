/**
 * Renders the generated TypeScript sources (`src/generated/*.ts`) from the
 * compiled spec artifacts and formats them with Prettier.
 *
 * Output is fully deterministic: key order follows the spec document, no
 * timestamps are emitted, and formatting options are pinned below (mirroring
 * `.prettierrc`) so regenerating against the same pinned spec always produces
 * byte-identical files — the drift test relies on this.
 */

import * as prettier from "prettier";
import type { Constraint } from "../../src/validation/engine.js";
import type { OpenApiDocument, OpenApiSchema } from "./openapi.js";
import { SpecError } from "./openapi.js";
import type { CompiledOperation, CompiledParam, OperationsResult } from "./operations.js";
import type { IrCompiler } from "./ir.js";
import { compileParameter } from "./ir.js";
import type { NamedExample, SpecExamples } from "./examples.js";
import type { SchemaDeclaration, TypeContext } from "./types.js";
import { propertyKey, renderSchemaFile, schemaDeclaration, tsType } from "./types.js";
import type { SpecErratumInfo } from "./errata.js";

/** Mirrors .prettierrc — pinned here so output is environment-independent. */
const PRETTIER_OPTIONS: prettier.Options = {
  parser: "typescript",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
};

export interface SpecMetaInput {
  readonly version: string;
  readonly pinnedCommit: string;
  readonly sha256: string;
  readonly source: string;
}

function fileHeader(meta: SpecMetaInput, description: string): string {
  return [
    "/**",
    " * GENERATED FILE — DO NOT EDIT BY HAND.",
    " *",
    ` * ${description}`,
    " *",
    ` * Source of truth: BCB "API Pix" OpenAPI ${meta.version} (commit ${meta.pinnedCommit}).`,
    ` * Pinned upstream URL: ${meta.source}`,
    ` * Pinned file sha256: ${meta.sha256}`,
    " *",
    " * Regenerate with `npm run spec:fetch && npm run generate`.",
    " * The generator fails loudly on any spec drift (unknown keywords, undeclared",
    " * required properties, checksum changes) — see scripts/generator/.",
    " */",
  ].join("\n");
}

/** Appends `suffix` to the last line of a non-empty line block. */
function appendLast(lines: string[], suffix: string): void {
  const last = lines.pop();
  if (last === undefined) {
    throw new Error("internal error: appendLast on empty lines");
  }
  lines.push(last + suffix);
}

// ---------------------------------------------------------------------------
// Constraint IR → TypeScript source
// ---------------------------------------------------------------------------

function regexLiteral(pattern: RegExp): string {
  const source = pattern.source.replace(/\//g, "\\/");
  return `/${source}/${pattern.flags}`;
}

/**
 * Renders a constraint as TypeScript source lines. Lines are relative (no
 * leading indent on the first line); callers embed them with `indentSource`
 * and append trailing punctuation.
 */
export function constraintSource(constraint: Constraint): string[] {
  switch (constraint.kind) {
    case "string": {
      const parts: string[] = ['kind: "string"'];
      if (constraint.minLength !== undefined) parts.push(`minLength: ${constraint.minLength}`);
      if (constraint.maxLength !== undefined) parts.push(`maxLength: ${constraint.maxLength}`);
      if (constraint.pattern !== undefined)
        parts.push(`pattern: ${regexLiteral(constraint.pattern)}`);
      if (constraint.format !== undefined)
        parts.push(`format: ${JSON.stringify(constraint.format)}`);
      if (constraint.enumValues !== undefined) {
        parts.push(
          `enumValues: [${constraint.enumValues.map((v) => JSON.stringify(v)).join(", ")}]`,
        );
      }
      return [`{ ${parts.join(", ")} }`];
    }
    case "number": {
      const parts: string[] = ['kind: "number"'];
      if (constraint.integer === true) parts.push("integer: true");
      if (constraint.minimum !== undefined) parts.push(`minimum: ${constraint.minimum}`);
      if (constraint.maximum !== undefined) parts.push(`maximum: ${constraint.maximum}`);
      return [`{ ${parts.join(", ")} }`];
    }
    case "boolean":
      return ['{ kind: "boolean" }'];
    case "ref":
      return [`{ kind: "ref", name: ${JSON.stringify(constraint.name)} }`];
    case "nullable": {
      const inner = constraintSource(constraint.inner);
      if (inner.length === 1) {
        return [`{ kind: "nullable", inner: ${inner[0]!} }`];
      }
      const lines = ["{", '  kind: "nullable",', `  inner: ${inner[0]!}`];
      lines.push(...inner.slice(1).map((line) => `  ${line}`));
      appendLast(lines, ",");
      lines.push("}");
      return lines;
    }
    case "array": {
      const items = constraintSource(constraint.items);
      const lines: string[] = ["{", '  kind: "array",'];
      lines.push(`  items: ${items[0]!}`);
      lines.push(...items.slice(1).map((line) => `  ${line}`));
      appendLast(lines, ",");
      if (constraint.minItems !== undefined) lines.push(`  minItems: ${constraint.minItems},`);
      if (constraint.maxItems !== undefined) lines.push(`  maxItems: ${constraint.maxItems},`);
      if (constraint.uniqueItems === true) lines.push("  uniqueItems: true,");
      lines.push("}");
      return lines;
    }
    case "object": {
      const propertyEntries = Object.entries(constraint.properties);
      const lines: string[] = ["{", '  kind: "object",'];
      if (propertyEntries.length === 0) {
        lines.push("  properties: {},");
      } else {
        lines.push("  properties: {");
        for (const [key, propertyConstraint] of propertyEntries) {
          const nested = constraintSource(propertyConstraint);
          lines.push(`    ${propertyKey(key)}: ${nested[0]!}`);
          lines.push(...nested.slice(1).map((line) => `    ${line}`));
          appendLast(lines, ",");
        }
        lines.push("  },");
      }
      lines.push(
        `  required: [${constraint.required.map((key) => JSON.stringify(key)).join(", ")}],`,
      );
      lines.push(`  additionalProperties: ${constraint.additionalProperties ? "true" : "false"},`);
      lines.push("}");
      return lines;
    }
    case "allOf":
    case "oneOf":
    case "anyOf": {
      const lines: string[] = ["{", `  kind: "${constraint.kind}",`, "  members: ["];
      for (const member of constraint.members) {
        const nested = constraintSource(member);
        lines.push(`    ${nested[0]!}`);
        lines.push(...nested.slice(1).map((line) => `    ${line}`));
        appendLast(lines, ",");
      }
      lines.push("  ],");
      lines.push("}");
      return lines;
    }
  }
}

/** Shifts a block of relative source lines to the given indentation level. */
export function embedLines(lines: readonly string[], level: number): string[] {
  const prefix = "  ".repeat(level);
  return lines.map((line) => (line === "" ? line : prefix + line));
}

// ---------------------------------------------------------------------------
// schemas.ts
// ---------------------------------------------------------------------------

export interface RequestBodyInfo {
  readonly name: string;
  readonly description: string | undefined;
  readonly required: boolean;
  readonly schemaName: string;
}

export function renderSchemasFile(
  meta: SpecMetaInput,
  doc: OpenApiDocument,
  ctx: TypeContext,
  inlineResponseSchemas: ReadonlyMap<string, OpenApiSchema>,
  requestBodies: readonly RequestBodyInfo[],
): string {
  const declarations: SchemaDeclaration[] = [];

  for (const [name, schema] of Object.entries(doc.components.schemas ?? {})) {
    declarations.push(schemaDeclaration(name, schema, ctx, `components.schemas.${name}`));
  }
  for (const body of requestBodies) {
    const inline = ctx.extraNamed.get(body.name);
    if (inline !== undefined) {
      declarations.push(schemaDeclaration(body.name, inline, ctx, `requestBodies.${body.name}`));
    } else {
      declarations.push({
        name: body.name,
        doc: "",
        declaration: `export type ${body.name} = ${body.schemaName};`,
      });
    }
  }
  for (const [name, schema] of inlineResponseSchemas) {
    declarations.push(schemaDeclaration(name, schema, ctx, `inlineResponse.${name}`));
  }

  return renderSchemaFile(
    fileHeader(
      meta,
      "TypeScript types for every schema in the spec, with the upstream pt-BR descriptions as TSDoc.",
    ),
    declarations,
  );
}

// ---------------------------------------------------------------------------
// validators.ts
// ---------------------------------------------------------------------------

export function renderValidatorsFile(
  meta: SpecMetaInput,
  compiler: IrCompiler,
  typeNames: readonly string[],
  requestBodies: readonly RequestBodyInfo[],
): string {
  const chunks: string[] = [];
  chunks.push(
    fileHeader(
      meta,
      "Runtime validators (constraint IR) for every named schema in the spec, plus one validator per request body. Evaluation lives in src/validation/engine.ts.",
    ),
  );
  chunks.push("");
  chunks.push(
    'import { validate, type Constraint, type ValidationResult } from "../validation/index.js";',
  );
  // Inline request bodies are already named schemas; $ref bodies contribute
  // their own alias type (declared in schemas.ts) used by their validators.
  const aliasBodyNames = requestBodies
    .filter((body) => body.name !== body.schemaName)
    .map((body) => body.name);
  const imports = [...typeNames, ...aliasBodyNames].join(", ");
  chunks.push(`import type { ${imports} } from "./schemas.js";`);
  chunks.push("");
  chunks.push(
    [
      "/**",
      " * Constraint IR for each named schema, in spec order. Values reference each",
      ' * other by name through `{ kind: "ref" }` and are resolved via `constraintRegistry`.',
      " */",
    ].join("\n"),
  );

  const constraintDeclarations: string[] = [];
  const constraintEntries: string[] = [];
  const validatorLines: string[] = [];
  const validatorMapEntries: string[] = [];

  for (const [name, constraint] of compiler.constraints) {
    const lines = constraintSource(constraint);
    constraintDeclarations.push(`const ${constraintConstName(name)}: Constraint = ${lines[0]!}`);
    if (lines.length > 1) {
      constraintDeclarations.push(...lines.slice(1));
    }
    appendLast(constraintDeclarations, ";");
    constraintEntries.push(`${JSON.stringify(name)}: ${constraintConstName(name)},`);
  }
  for (const name of compiler.constraints.keys()) {
    validatorLines.push(
      `export function validate${name}(value: unknown): ValidationResult<${name}> {`,
      `  return validate<${name}>(${constraintConstName(name)}, value, constraintRegistry);`,
      "}",
      "",
    );
    validatorMapEntries.push(`${JSON.stringify(name)}: validate${name},`);
  }

  for (const declaration of constraintDeclarations) {
    chunks.push(declaration);
  }
  chunks.push("");
  chunks.push("const constraints: Record<string, Constraint> = {");
  chunks.push(...constraintEntries.map((line) => `  ${line}`));
  chunks.push("};");
  chunks.push("");
  chunks.push(
    '/** All named constraints; resolves `{ kind: "ref" }` links at validation time. */',
    "export const constraintRegistry: ReadonlyMap<string, Constraint> = new Map(",
    "  Object.entries(constraints),",
    ");",
  );
  chunks.push("");
  chunks.push(...validatorLines);

  // One validator per request body component. Inline bodies (schemaName ===
  // name) already got a validator in the named-schema loop above.
  const bodyValidatorLines: string[] = [];
  const bodyMapEntries: string[] = [];
  for (const body of requestBodies) {
    if (body.name === body.schemaName) {
      bodyMapEntries.push(`${JSON.stringify(body.name)}: validate${body.name},`);
      continue;
    }
    bodyValidatorLines.push(
      `export function validate${body.name}(value: unknown): ValidationResult<${body.name}> {`,
      `  return validate<${body.name}>(${constraintConstName(body.schemaName)}, value, constraintRegistry);`,
      "}",
      "",
    );
    bodyMapEntries.push(`${JSON.stringify(body.name)}: validate${body.name},`);
  }
  chunks.push(...bodyValidatorLines);

  chunks.push(
    "/** Validators by schema name — every schema in the spec has an entry. */",
    "export const schemaValidators: Readonly<Record<string, (value: unknown) => ValidationResult<unknown>>> = {",
  );
  chunks.push(...validatorMapEntries.map((line) => `  ${line}`));
  chunks.push("};");
  chunks.push("");
  chunks.push(
    "/** Validators by request-body name — every request body in the spec has an entry. */",
    "export const requestBodyValidators: Readonly<Record<string, (value: unknown) => ValidationResult<unknown>>> = {",
  );
  chunks.push(...bodyMapEntries.map((line) => `  ${line}`));
  chunks.push("};");
  chunks.push("");
  return chunks.join("\n");
}

function constraintConstName(name: string): string {
  return `c${name}`;
}

// ---------------------------------------------------------------------------
// operations.ts
// ---------------------------------------------------------------------------

function successSchema(operation: CompiledOperation): string | undefined {
  const schemas = operation.responses
    .filter(
      (response) =>
        response.code >= 200 && response.code < 300 && response.schemaName !== undefined,
    )
    .map((response) => response.schemaName!);
  const unique = [...new Set(schemas)];
  if (unique.length > 1) {
    throw new SpecError(
      `multiple success body schemas (${unique.join(", ")})`,
      `operations.${operation.name}`,
    );
  }
  return unique[0];
}

function paramDoc(parameter: CompiledParam): string {
  return parameter.schema.description?.trim() ?? "";
}

export function renderOperationsFile(
  meta: SpecMetaInput,
  operations: OperationsResult,
  compiler: IrCompiler,
  ctx: TypeContext,
): string {
  const chunks: string[] = [];
  chunks.push(
    fileHeader(
      meta,
      "Per-operation request/response types, the runtime OPERATIONS registry, and parameter validators for every path in the spec.",
    ),
  );
  chunks.push("");
  chunks.push('import { validate, type ValidationResult } from "../validation/index.js";');
  chunks.push('import { constraintRegistry } from "./validators.js";');

  const importedTypes = new Set<string>();
  for (const operation of operations.operations) {
    for (const param of [...operation.pathParams, ...operation.queryParams]) {
      if (param.schema.$ref !== undefined) {
        importedTypes.add(param.schema.$ref.split("/").pop()!);
      }
    }
    if (operation.requestBody !== undefined) {
      importedTypes.add(operation.requestBody.name);
    }
    const success = successSchema(operation);
    if (success !== undefined) importedTypes.add(success);
    importedTypes.add("Problema");
  }
  const sortedImports = [...importedTypes].sort();
  chunks.push(`import type { ${sortedImports.join(", ")} } from "./schemas.js";`);
  chunks.push("");
  chunks.push(
    [
      "/**",
      " * HTTP methods available in the spec.",
      " */",
      'export type HttpMethod = "get" | "put" | "post" | "patch" | "delete";',
      "",
      "export interface ParamInfo {",
      "  readonly name: string;",
      "  readonly required: boolean;",
      "}",
      "",
      "export interface RequestBodyInfo {",
      "  readonly name: string;",
      "  readonly required: boolean;",
      "  readonly schema: string;",
      "}",
      "",
      "export interface ResponseInfo {",
      "  readonly code: number;",
      "  readonly description: string;",
      "  readonly contentType?: string;",
      "  readonly schema?: string;",
      "}",
      "",
      "export interface OperationInfo {",
      "  readonly name: string;",
      "  readonly method: HttpMethod;",
      "  readonly path: string;",
      "  readonly tag: string;",
      "  readonly summary: string;",
      "  readonly scopes: readonly string[];",
      "  readonly pathParams: readonly ParamInfo[];",
      "  readonly queryParams: readonly ParamInfo[];",
      "  readonly requestBody?: RequestBodyInfo;",
      "  readonly responses: readonly ResponseInfo[];",
      "  readonly hasResponseBody: boolean;",
      "  readonly errorSchema: string;",
      "}",
    ].join("\n"),
  );
  chunks.push("");

  for (const operation of operations.operations) {
    const opDoc = [
      `/**`,
      ` * ${operation.method.toUpperCase()} ${operation.path} — ${operation.summary}`,
      ` *`,
      ` * Tag: ${operation.tag}. Scopes: ${
        operation.scopes.length > 0 ? operation.scopes.join(", ") : "(unauthenticated)"
      }.`,
      ` */`,
    ].join("\n");

    chunks.push(opDoc);

    if (operation.pathParams.length > 0) {
      chunks.push(`export interface ${operation.name}Path {`);
      for (const param of operation.pathParams) {
        const doc = paramDoc(param);
        if (doc !== "") chunks.push(`  /** ${doc} */`);
        chunks.push(
          `  ${propertyKey(param.name)}: ${tsType(param.schema, ctx, `${operation.name}.path`)};`,
        );
      }
      chunks.push("}");
      chunks.push("");
    }

    if (operation.queryParams.length > 0) {
      chunks.push(`export interface ${operation.name}Query {`);
      for (const param of operation.queryParams) {
        const doc = paramDoc(param);
        if (doc !== "") chunks.push(`  /** ${doc} */`);
        chunks.push(
          `  ${propertyKey(param.name)}${param.required ? "" : "?"}: ${tsType(param.schema, ctx, `${operation.name}.query`)};`,
        );
      }
      chunks.push("}");
      chunks.push("");
    }

    if (operation.requestBody !== undefined) {
      chunks.push(`export type ${operation.name}RequestBody = ${operation.requestBody.name};`);
    }
    const success = successSchema(operation);
    // `undefined` (not `void`) — the alias is used as a value type, and void
    // in type-alias position is invalid per our lint rules anyway.
    chunks.push(`export type ${operation.name}Response = ${success ?? "undefined"};`);
    const errorSchemas = [
      ...new Set(
        operation.responses
          .filter((response) => response.code >= 400 && response.schemaName !== undefined)
          .map((response) => response.schemaName!),
      ),
    ];
    if (errorSchemas.length !== 1) {
      throw new SpecError(
        `expected exactly one error schema (${errorSchemas.join(", ")})`,
        operation.name,
      );
    }
    chunks.push(`export type ${operation.name}Error = ${errorSchemas[0]!};`);
    chunks.push("");

    // Parameter validators.
    const paramValidator = (
      params: readonly CompiledParam[],
      typeName: string,
      suffix: string,
    ): string => {
      const constraint: Constraint = {
        kind: "object",
        properties: Object.fromEntries(
          params.map((param) => [
            param.name,
            compileParameter(
              {
                name: param.name,
                in: suffix === "Path" ? "path" : "query",
                required: param.required,
                schema: param.schema,
              },
              `operations.${operation.name}.${suffix}`,
              compiler,
            ),
          ]),
        ),
        required: params.filter((param) => param.required).map((param) => param.name),
        additionalProperties: true,
      };
      const constraintLines = constraintSource(constraint);
      const body = embedLines(constraintLines, 2);
      appendLast(body, ",");
      return [
        `export function validate${operation.name}${suffix}(value: unknown): ValidationResult<${typeName}> {`,
        `  return validate<${typeName}>(`,
        ...body,
        "    value,",
        "    constraintRegistry,",
        "  );",
        "}",
      ].join("\n");
    };

    if (operation.pathParams.length > 0) {
      chunks.push(paramValidator(operation.pathParams, `${operation.name}Path`, "Path"));
      chunks.push("");
    }
    if (operation.queryParams.length > 0) {
      chunks.push(paramValidator(operation.queryParams, `${operation.name}Query`, "Query"));
      chunks.push("");
    }
  }

  // Parameter validator registry (one entry per operation with parameters).
  chunks.push(
    [
      "/**",
      " * Parameter validators by operation name — the SDK client validates path and",
      " * query parameters with these before sending a request.",
      " */",
      "export interface ParamValidators {",
      "  readonly path?: (value: unknown) => ValidationResult<unknown>;",
      "  readonly query?: (value: unknown) => ValidationResult<unknown>;",
      "}",
      "",
      "export const paramValidators: Readonly<Record<string, ParamValidators>> = {",
    ].join("\n"),
  );
  for (const operation of operations.operations) {
    const entries: string[] = [];
    if (operation.pathParams.length > 0) entries.push(`path: validate${operation.name}Path`);
    if (operation.queryParams.length > 0) entries.push(`query: validate${operation.name}Query`);
    if (entries.length === 0) continue;
    chunks.push(`  ${JSON.stringify(operation.name)}: { ${entries.join(", ")} },`);
  }
  chunks.push("};");
  chunks.push("");

  // Runtime registry.
  chunks.push(
    "/**",
    " * Every operation in the spec, keyed by generated operation name.",
    " */",
    "export const OPERATIONS: Readonly<Record<string, OperationInfo>> = {",
  );
  for (const operation of operations.operations) {
    const lines: string[] = [];
    lines.push(`${operation.name}: {`);
    lines.push(`  name: ${JSON.stringify(operation.name)},`);
    lines.push(`  method: ${JSON.stringify(operation.method)},`);
    lines.push(`  path: ${JSON.stringify(operation.path)},`);
    lines.push(`  tag: ${JSON.stringify(operation.tag)},`);
    lines.push(`  summary: ${JSON.stringify(operation.summary)},`);
    lines.push(`  scopes: [${operation.scopes.map((scope) => JSON.stringify(scope)).join(", ")}],`);
    lines.push(
      `  pathParams: [${operation.pathParams
        .map((param) => `{ name: ${JSON.stringify(param.name)}, required: ${param.required} }`)
        .join(", ")}],`,
    );
    lines.push(
      `  queryParams: [${operation.queryParams
        .map((param) => `{ name: ${JSON.stringify(param.name)}, required: ${param.required} }`)
        .join(", ")}],`,
    );
    if (operation.requestBody !== undefined) {
      lines.push(
        `  requestBody: { name: ${JSON.stringify(operation.requestBody.name)}, required: ${
          operation.requestBody.required
        }, schema: ${JSON.stringify(operation.requestBody.schemaName)} },`,
      );
    }
    lines.push("  responses: [");
    for (const response of operation.responses) {
      lines.push(
        `    { code: ${response.code}, description: ${JSON.stringify(response.description)}${
          response.contentType === undefined
            ? ""
            : `, contentType: ${JSON.stringify(response.contentType)}`
        }${response.schemaName === undefined ? "" : `, schema: ${JSON.stringify(response.schemaName)}`} },`,
      );
    }
    lines.push("  ],");
    lines.push(`  hasResponseBody: ${successSchema(operation) !== undefined},`);
    lines.push(`  errorSchema: "Problema",`);
    lines.push("},");
    chunks.push(...lines.map((line) => `  ${line}`));
  }
  chunks.push("};");
  chunks.push("");
  return chunks.join("\n");
}

// ---------------------------------------------------------------------------
// examples.ts
// ---------------------------------------------------------------------------

export interface OperationResponseExamples {
  readonly operation: string;
  readonly code: number;
  readonly examples: readonly NamedExample[];
}

function jsonLiteral(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function renderExamplesFile(
  meta: SpecMetaInput,
  specExamples: SpecExamples,
  requestBodies: readonly RequestBodyInfo[],
  requestBodyExamples: ReadonlyMap<string, readonly NamedExample[]>,
  operationResponseExamples: readonly OperationResponseExamples[],
): string {
  const chunks: string[] = [];
  chunks.push(
    fileHeader(
      meta,
      "The spec's official example payloads as plain data — known-good (and, where upstream is self-contradictory, known-bad) vectors for validators and user-side tests.",
    ),
  );
  chunks.push("");
  chunks.push("/** Every `components.examples` value, composition markers resolved. */");
  chunks.push("export const specExamples: Readonly<Record<string, unknown>> = {");
  for (const example of specExamples.byName.values()) {
    chunks.push(`${JSON.stringify(example.name)}: ${jsonLiteral(example.value)},`);
  }
  chunks.push("};");
  chunks.push("");
  chunks.push(
    "/**",
    " * Example request bodies per request-body component name (from the requestBody `examples` maps).",
    " */",
    "export const requestBodyExamples: Readonly<Record<string, readonly unknown[]>> = {",
  );
  for (const body of requestBodies) {
    const examples = requestBodyExamples.get(body.name) ?? [];
    if (examples.length === 0) continue;
    const parts = examples.map((example) => jsonLiteral(example.value));
    chunks.push(`${JSON.stringify(body.name)}: [${parts.join(",\n")}],`);
  }
  chunks.push("};");
  chunks.push("");
  chunks.push(
    "/**",
    " * Example response payloads per operation name and HTTP status code",
    " * (error examples validate against the Problema schema).",
    " */",
    "export const operationResponseExamples: Readonly<",
    "  Record<string, Readonly<Record<number, readonly unknown[]>>>",
    "> = {",
  );
  const byOperation = new Map<string, OperationResponseExamples[]>();
  for (const entry of operationResponseExamples) {
    const list = byOperation.get(entry.operation) ?? [];
    list.push(entry);
    byOperation.set(entry.operation, list);
  }
  for (const [operation, entries] of byOperation) {
    chunks.push(`${JSON.stringify(operation)}: {`);
    for (const entry of entries) {
      const parts = entry.examples.map((example) => jsonLiteral(example.value));
      chunks.push(`${entry.code}: [${parts.join(",\n")}],`);
    }
    chunks.push("},");
  }
  chunks.push("};");
  chunks.push("");
  return chunks.join("\n");
}

// ---------------------------------------------------------------------------
// scopes.ts
// ---------------------------------------------------------------------------

export function renderScopesFile(meta: SpecMetaInput, doc: OpenApiDocument): string {
  const scopes =
    doc.components.securitySchemes?.["OAuth2"]?.flows?.["clientCredentials"]?.scopes ?? {};
  const names = Object.keys(scopes);
  const chunks: string[] = [];
  chunks.push(
    fileHeader(
      meta,
      "OAuth2 client-credentials scopes declared by the spec (securitySchemes.OAuth2).",
    ),
  );
  chunks.push("");
  chunks.push("/** Every OAuth2 scope declared by the spec. */");
  chunks.push(
    `export const OAUTH_SCOPES = [${names.map((name) => JSON.stringify(name)).join(", ")}] as const;`,
  );
  chunks.push("");
  chunks.push("export type OAuthScope = (typeof OAUTH_SCOPES)[number];");
  chunks.push("");
  chunks.push("/** Upstream pt-BR descriptions per scope. */");
  chunks.push("export const OAUTH_SCOPE_DESCRIPTIONS: Readonly<Record<OAuthScope, string>> = {");
  for (const [name, description] of Object.entries(scopes)) {
    chunks.push(`${JSON.stringify(name)}: ${JSON.stringify(description)},`);
  }
  chunks.push("};");
  chunks.push("");
  return chunks.join("\n");
}

// ---------------------------------------------------------------------------
// meta.ts
// ---------------------------------------------------------------------------

export function renderMetaFile(
  meta: SpecMetaInput,
  errata: readonly SpecErratumInfo[],
  schemaNames: readonly string[],
  requestBodyNames: readonly string[],
  operationNames: readonly string[],
): string {
  const chunks: string[] = [];
  chunks.push(
    fileHeader(
      meta,
      "Machine-readable provenance of the pinned spec and the errata applied during generation.",
    ),
  );
  chunks.push("");
  chunks.push(`export const SPEC_VERSION = ${JSON.stringify(meta.version)};`);
  chunks.push(`export const SPEC_SOURCE = ${JSON.stringify(meta.source)};`);
  chunks.push(`export const SPEC_PINNED_COMMIT = ${JSON.stringify(meta.pinnedCommit)};`);
  chunks.push(`export const SPEC_SHA256 = ${JSON.stringify(meta.sha256)};`);
  chunks.push("");
  chunks.push("export interface SpecErratum {");
  chunks.push("  readonly id: string;");
  chunks.push("  readonly location: string;");
  chunks.push("  readonly description: string;");
  chunks.push("}");
  chunks.push("");
  chunks.push(
    "/**",
    " * Documented corrections applied to the pinned upstream file before generation.",
    " * Every entry is evidence-backed; see scripts/generator/errata.ts and README.md.",
    " */",
    "export const SPEC_ERRATA: readonly SpecErratum[] = [",
  );
  for (const erratum of errata) {
    chunks.push(
      `  { id: ${JSON.stringify(erratum.id)}, location: ${JSON.stringify(
        erratum.location,
      )}, description: ${JSON.stringify(erratum.description)} },`,
    );
  }
  chunks.push("];");
  chunks.push("");
  chunks.push(
    `export const SCHEMA_NAMES = [${schemaNames.map((n) => JSON.stringify(n)).join(", ")}] as const;`,
  );
  chunks.push(
    `export const REQUEST_BODY_NAMES = [${requestBodyNames.map((n) => JSON.stringify(n)).join(", ")}] as const;`,
  );
  chunks.push(
    `export const OPERATION_NAMES = [${operationNames.map((n) => JSON.stringify(n)).join(", ")}] as const;`,
  );
  chunks.push("");
  return chunks.join("\n");
}

// ---------------------------------------------------------------------------
// index.ts
// ---------------------------------------------------------------------------

export function renderIndexFile(meta: SpecMetaInput): string {
  return [
    fileHeader(meta, "Public entry point re-exporting every generated module."),
    "",
    'export * from "./schemas.js";',
    'export * from "./validators.js";',
    'export * from "./operations.js";',
    'export * from "./examples.js";',
    'export * from "./scopes.js";',
    'export * from "./meta.js";',
    'export * from "../validation/index.js";',
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export async function formatTypeScript(source: string): Promise<string> {
  return prettier.format(source, PRETTIER_OPTIONS);
}
