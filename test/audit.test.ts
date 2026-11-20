/**
 * Final audit — turns the claims in AUDIT.md and SPEC.md into executable
 * assertions: every pinned spec path/method, schema, request body and operation
 * must be emitted, typed, validated, tested and documented. Also enforces the
 * cross-platform CI checklist and the "no stubs" hard constraint.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { operationName } from "../scripts/generator/operations.js";
import { PixClient } from "../src/client/client.js";
import { OPENAPI_CONTRACTS } from "../src/generated/contracts.js";
import {
  OPERATION_NAMES,
  REQUEST_BODY_NAMES,
  SCHEMA_NAMES,
  SPEC_SHA256,
  SPEC_VERSION,
} from "../src/generated/meta.js";
import { OPERATIONS, paramValidators } from "../src/generated/operations.js";
import { requestBodyValidators, schemaValidators } from "../src/generated/validators.js";
import { loadErrataAppliedSpec, readSpecLock } from "./helpers.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative: string): string => readFileSync(resolve(root, relative), "utf8");
const declarationOf = (name: string): RegExp => new RegExp(`export (?:interface|type) ${name}\\b`);
const METHODS = ["get", "put", "post", "patch", "delete"] as const;

const operationsText = read("src/generated/operations.ts");
const schemasText = read("src/generated/schemas.ts");
const auditText = read("AUDIT.md");

describe("final audit — source of truth and completeness", () => {
  it("the pinned spec checksum is the one in the lock file", async () => {
    const lock = await readSpecLock();
    expect(SPEC_SHA256).toBe(lock.sha256);
    expect(SPEC_VERSION).toBe(lock.specVersion);
  });

  it("all 57 spec paths/methods have a generated operation (no more, no less)", async () => {
    const spec = await loadErrataAppliedSpec();
    const expected = new Set<string>();
    for (const [path, item] of Object.entries(spec.paths)) {
      for (const method of METHODS) {
        if (item[method] === undefined) continue;
        expected.add(operationName(method, path));
      }
    }
    expect(expected.size).toBe(57);
    expect([...expected].sort()).toEqual([...OPERATION_NAMES].sort());
    expect(Object.keys(OPERATIONS)).toHaveLength(57);
  });

  it("every spec schema is emitted as a typed declaration and a runtime validator", async () => {
    const spec = await loadErrataAppliedSpec();
    expect([...Object.keys(spec.components.schemas ?? {})].sort()).toEqual(
      [...SCHEMA_NAMES].sort(),
    );
    for (const name of SCHEMA_NAMES) {
      expect(schemasText, `missing type for ${name}`).toMatch(declarationOf(name));
      expect(schemaValidators[name], `missing validator for ${name}`).toBeDefined();
      expect(
        OPENAPI_CONTRACTS.definitions[name],
        `missing ajv definition for ${name}`,
      ).toBeDefined();
    }
  });

  it("every request body is emitted as a typed declaration and a runtime validator", () => {
    expect(new Set(REQUEST_BODY_NAMES)).toEqual(new Set(Object.keys(requestBodyValidators)));
    for (const name of REQUEST_BODY_NAMES) {
      expect(schemasText, `missing type for ${name}`).toMatch(declarationOf(name));
    }
  });

  it("every operation is typed, param-validated, contract-backed and documented", () => {
    for (const operation of Object.values(OPERATIONS)) {
      const name = operation.name;
      expect(operationsText, `${name} response type`).toMatch(declarationOf(`${name}Response`));
      if (operation.pathParams.length > 0) {
        expect(operationsText, `${name} path type`).toMatch(declarationOf(`${name}Path`));
        expect(paramValidators[name]?.path, `${name} path validator`).toBeDefined();
      }
      if (operation.queryParams.length > 0) {
        expect(operationsText, `${name} query type`).toMatch(declarationOf(`${name}Query`));
        expect(paramValidators[name]?.query, `${name} query validator`).toBeDefined();
      }
      if (operation.requestBody !== undefined) {
        expect(operationsText, `${name} body type`).toMatch(declarationOf(`${name}RequestBody`));
        expect(requestBodyValidators[operation.requestBody.name]).toBeDefined();
      }
      expect(OPENAPI_CONTRACTS.operations[name], `${name} ajv contract`).toBeDefined();
      expect(operation.responses.length, `${name} response declarations`).toBeGreaterThan(0);
      expect(auditText, `${name} present in AUDIT.md`).toMatch(new RegExp(`\\|\\s*${name}\\s*\\|`));
    }
  });

  it("AUDIT.md covers every SPEC feature area", () => {
    for (const label of [
      "Source of truth",
      "ALL 57 spec endpoints",
      "Code generation",
      "Client: mTLS",
      "Errors:",
      "Pagination helpers",
      "PSP presets",
      "Webhooks:",
      "Dynamic QR payload",
      "BR Code generation",
      "Mock Pix API",
      "Contract tests",
      "Unit tests:",
      "Example apps",
      "ESM + CJS",
    ]) {
      expect(auditText, `AUDIT.md missing ${label}`).toContain(label);
    }
  });

  it("the client exposes every resource namespace from the SPEC", async () => {
    const client = new PixClient({
      baseUrl: "https://psp.example.com/api/",
      clientId: "id",
      clientSecret: "secret",
    });
    for (const namespace of [
      "cob",
      "cobv",
      "lotecobv",
      "loc",
      "locrec",
      "pix",
      "webhook",
      "webhookCob",
      "webhookCobv",
      "webhookCobr",
      "webhookRec",
      "rec",
      "solicrec",
      "cobr",
      "payload",
    ]) {
      expect((client as unknown as Record<string, unknown>)[namespace], namespace).toBeDefined();
    }
    await client.close();
  });

  it("no production source contains stubs, TODOs or placeholder tests", () => {
    const files = readdirSync(resolve(root, "src"), { recursive: true })
      .filter((entry): entry is string => typeof entry === "string" && entry.endsWith(".ts"))
      .map((entry) => resolve(root, "src", entry));
    expect(files.length).toBeGreaterThan(20);
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      expect(text, `${file} must not contain TODO`).not.toMatch(/\bTODO\b/);
      expect(text, `${file} must not contain NotImplemented`).not.toMatch(/NotImplemented/);
    }
  });
});

describe("final audit — cross-platform CI checklist", () => {
  it("normalizes line endings and marks byte-exact assets binary", () => {
    const attributes = read(".gitattributes");
    expect(attributes).toContain("* text=auto eol=lf");
    for (const extension of ["png", "pfx", "pem", "crt", "key"]) {
      expect(attributes, `${extension} binary marker`).toMatch(
        new RegExp(`\\*\\.${extension} binary`),
      );
    }
    expect(read(".prettierrc")).toContain('"endOfLine": "lf"');
  });

  it("the CI matrix runs every gate on Linux and Windows", () => {
    const workflow = read(".github/workflows/ci.yml");
    for (const os of ["ubuntu-latest", "windows-latest"]) expect(workflow).toContain(os);
    expect(workflow).toContain("node: [20, 22, 24]");
    for (const step of [
      "npm ci",
      "npm run spec:fetch",
      "npm run generate",
      "git diff --exit-code src/generated",
      "npm run format:check",
      "npm run lint",
      "npm run typecheck",
      "npm run typecheck:examples",
      "npm run build",
      "npm run test:coverage",
    ]) {
      expect(workflow, `CI step ${step}`).toContain(step);
    }
  });

  it("no test locates tooling through a runtime binary path", () => {
    const tests = readdirSync(resolve(root, "test"), { recursive: true })
      .filter((entry): entry is string => typeof entry === "string" && entry.endsWith(".ts"))
      .map((entry) => resolve(root, "test", entry));
    for (const file of tests) {
      const text = readFileSync(file, "utf8");
      expect(text, `${file} must not resolve npm/dotnet/cargo via a runtime path`).not.toMatch(
        /dirname\(process\.execPath\)|dirname\(process\.argv\[0\]\)/,
      );
    }
  });
});
