/**
 * Independent-review regression: the mock API must validate requests using the
 * raw pinned OpenAPI document, not the generator's validators. Hand-derived
 * expected values come from parsing spec/openapi.yaml with the `yaml` package
 * directly in this test.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { OPERATIONS } from "../src/generated/operations.js";
import { loadIndependentSpec } from "./mock-server/independent-spec.js";

const specPath = fileURLToPath(new URL("../spec/openapi.yaml", import.meta.url));
const serverPath = fileURLToPath(new URL("./mock-server/server.ts", import.meta.url));

describe("mock server spec independence (independent review)", () => {
  it("does not import generator validators or the SDK txid helper", () => {
    const source = readFileSync(serverPath, "utf8");
    expect(source).not.toMatch(/from ["'].*src\/generated/);
    expect(source).not.toMatch(/from ["'].*src\/txid/);
  });

  it("derives one operation per method of every spec path", () => {
    const doc = parse(readFileSync(specPath, "utf8")) as {
      paths: Record<string, Record<string, unknown>>;
    };
    const methods = new Set(["get", "put", "post", "patch", "delete"]);
    let expected = 0;
    for (const item of Object.values(doc.paths)) {
      for (const key of Object.keys(item)) if (methods.has(key)) expected += 1;
    }
    const independent = loadIndependentSpec();
    expect(independent.operations).toHaveLength(expected);
    // Names must still line up with the committed registry (drift detector).
    expect(new Set(independent.operations.map((operation) => operation.name))).toEqual(
      new Set(Object.keys(OPERATIONS)),
    );
  });

  it("rejects an empty CobBody using ajv built from the raw schemas", () => {
    const independent = loadIndependentSpec();
    const result = independent.validateRequestBody("CobBody", {});
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("required");
  });
});
