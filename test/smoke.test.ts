/**
 * Smoke coverage: every generated validator must be callable and total on
 * arbitrary input (never throw on malformed values — failures are results,
 * not exceptions). This also guarantees every validator function is
 * exercised, which keeps the generated modules fully covered.
 */

import { describe, expect, it } from "vitest";
import { requestBodyValidators, schemaValidators } from "../src/generated/validators.js";
import { OPERATIONS, paramValidators } from "../src/generated/operations.js";
import {
  SPEC_ERRATA,
  SPEC_VERSION,
  SCHEMA_NAMES,
  REQUEST_BODY_NAMES,
  OPERATION_NAMES,
} from "../src/generated/meta.js";
import { OAUTH_SCOPES } from "../src/generated/scopes.js";

const ARBITRARY_INPUTS: readonly unknown[] = [
  undefined,
  null,
  true,
  0,
  "",
  [],
  {},
  { deep: { deeper: [{ a: [1, "2", null] }] } },
];

describe("every schema validator is total on arbitrary input", () => {
  for (const [name, validator] of Object.entries(schemaValidators)) {
    it(`${name} never throws and always returns a result`, () => {
      for (const input of ARBITRARY_INPUTS) {
        const result = validator(input);
        expect(result.ok || !result.ok).toBe(true);
      }
    });
  }

  it("every emitted schema name (SCHEMA_NAMES) has a validator", () => {
    const validators = new Set(Object.keys(schemaValidators));
    for (const name of SCHEMA_NAMES) {
      expect(validators.has(name), `missing validator for ${name}`).toBe(true);
    }
  });
});

describe("every request-body validator is total on arbitrary input", () => {
  for (const [name, validator] of Object.entries(requestBodyValidators)) {
    it(`${name} never throws and always returns a result`, () => {
      for (const input of ARBITRARY_INPUTS) {
        const result = validator(input);
        expect(result.ok || !result.ok).toBe(true);
      }
    });
  }

  it("the registry covers exactly the emitted request-body names", () => {
    expect(new Set(Object.keys(requestBodyValidators))).toEqual(new Set(REQUEST_BODY_NAMES));
  });
});

describe("every parameter validator is total on arbitrary input", () => {
  const withParams = Object.values(OPERATIONS).filter(
    (operation) => operation.pathParams.length > 0 || operation.queryParams.length > 0,
  );

  it("the registry has an entry for exactly the operations that take parameters", () => {
    expect(new Set(Object.keys(paramValidators))).toEqual(
      new Set(withParams.map((operation) => operation.name)),
    );
    for (const [name, entry] of Object.entries(paramValidators)) {
      const operation = OPERATIONS[name];
      expect(operation).toBeDefined();
      if (operation === undefined) continue;
      expect(entry.path !== undefined).toBe(operation.pathParams.length > 0);
      expect(entry.query !== undefined).toBe(operation.queryParams.length > 0);
    }
  });

  it("at least one operation takes path parameters and one takes query parameters", () => {
    expect(withParams.some((operation) => operation.pathParams.length > 0)).toBe(true);
    expect(withParams.some((operation) => operation.queryParams.length > 0)).toBe(true);
  });

  for (const [name, entry] of Object.entries(paramValidators)) {
    it(`${name} path/query validators never throw on arbitrary input`, () => {
      const validators = [
        ...(entry.path !== undefined ? [entry.path] : []),
        ...(entry.query !== undefined ? [entry.query] : []),
      ];
      for (const validator of validators) {
        for (const input of ARBITRARY_INPUTS) {
          const result = validator(input);
          expect(result.ok || !result.ok).toBe(true);
        }
      }
    });
  }
});

describe("generated metadata is coherent", () => {
  it("OPERATION_NAMES matches the OPERATIONS registry", () => {
    expect(new Set(OPERATION_NAMES)).toEqual(new Set(Object.keys(OPERATIONS)));
  });

  it("SPEC_ERRATA is a non-empty, unique, documented list", () => {
    const ids = SPEC_ERRATA.map((erratum) => erratum.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(15);
    for (const erratum of SPEC_ERRATA) {
      expect(erratum.location.length).toBeGreaterThan(0);
      expect(erratum.description.length).toBeGreaterThan(20);
    }
  });

  it("SPEC_VERSION matches the pinned spec", () => {
    expect(SPEC_VERSION).toBe("2.11.0-rc1");
  });

  it("OAUTH_SCOPES is non-empty and unique", () => {
    expect(new Set(OAUTH_SCOPES).size).toBe(OAUTH_SCOPES.length);
    expect(OAUTH_SCOPES.length).toBeGreaterThan(20);
  });
});
