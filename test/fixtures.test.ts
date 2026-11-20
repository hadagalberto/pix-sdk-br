/**
 * Static mock fixtures are data, not schema-derived magic: every one is checked
 * against the real OpenAPI schemas. If a fixture drifts or is edited into an
 * invalid document, this suite fails instead of silently "repairing" it.
 */

import { describe, expect, it } from "vitest";
import { OPERATIONS } from "../src/generated/operations.js";
import { createContractValidators } from "./contract/ajv.js";
import { ERROR_FIXTURES, RESPONSE_FIXTURES, responseSchemaName } from "./mock-server/fixtures.js";

const validators = createContractValidators();

describe("static mock response fixtures", () => {
  it("has exactly one ajv-valid fixture per documented success schema", () => {
    const used = new Set<string>();
    for (const operation of Object.values(OPERATIONS)) {
      for (const response of operation.responses) {
        if (response.code < 200 || response.code >= 300 || response.schema === undefined) continue;
        const schema = response.schema;
        used.add(schema);
        expect(responseSchemaName(operation.name, response.code), operation.name).toBe(schema);
        const fixture = RESPONSE_FIXTURES[schema];
        expect(fixture, `missing fixture for ${schema}`).toBeDefined();
        const result = validators.validateDefinition(schema, fixture);
        expect(result.ok, `${schema}: ${result.errors}`).toBe(true);
      }
    }
    expect(new Set(Object.keys(RESPONSE_FIXTURES))).toEqual(used);
  });

  it("has an ajv-valid problem document for every documented error status", () => {
    const statuses = new Set<string>();
    for (const operation of Object.values(OPERATIONS)) {
      for (const response of operation.responses) {
        if (response.code < 400) continue;
        const status = String(response.code);
        statuses.add(status);
        const fixture = ERROR_FIXTURES[status];
        expect(fixture, `missing error fixture for ${status}`).toBeDefined();
        const result = validators.validateDefinition("Problema", fixture);
        expect(result.ok, `${status}: ${result.errors}`).toBe(true);
        expect(fixture?.["status"]).toBe(response.code);
      }
    }
    expect(new Set(Object.keys(ERROR_FIXTURES))).toEqual(statuses);
  });

  it("includes violacoes on the 400 fixture so validation errors are realistic", () => {
    const violations = ERROR_FIXTURES["400"]?.["violacoes"];
    expect(Array.isArray(violations)).toBe(true);
    const result = validators.validateDefinition("Problema", ERROR_FIXTURES["400"]);
    expect(result.ok, result.errors).toBe(true);
  });
});
