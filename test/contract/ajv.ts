/**
 * ajv-backed validators built from the committed, spec-derived OpenAPI → JSON
 * Schema contracts. Every request the client sends and every response the mock
 * emits is checked here — against the real specification, not a hand-written
 * approximation of it.
 */

import { Ajv, type ValidateFunction } from "ajv";
import * as formats from "ajv-formats";

// ajv-formats v3 is CJS: under NodeNext its callable module.exports is exposed
// through the namespace's `default` property.
const addFormats = formats.default as unknown as (ajv: Ajv) => void;
import {
  OPENAPI_CONTRACTS,
  type JsonSchema,
  type OpenApiAjvContracts,
} from "../../src/generated/contracts.js";

export interface ValidationOutcome {
  readonly ok: boolean;
  readonly errors: string;
}

export interface ContractValidators {
  /** Compiles every named definition eagerly so a bad conversion fails loudly. */
  readonly definitionCount: number;
  validateDefinition(name: string, value: unknown): ValidationOutcome;
  validatePathParams(operation: string, value: unknown): ValidationOutcome;
  validateQueryParams(operation: string, value: unknown): ValidationOutcome;
  validateRequestBody(operation: string, value: unknown): ValidationOutcome;
  validateResponseBody(operation: string, status: number, value: unknown): ValidationOutcome;
  knownOperations(): readonly string[];
}

export function createContractValidators(
  contracts: OpenApiAjvContracts = OPENAPI_CONTRACTS,
): ContractValidators {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    coerceTypes: true,
    allowUnionTypes: true,
    validateFormats: true,
  });
  addFormats(ajv);
  ajv.addSchema({
    $id: contracts.schemaId,
    type: "object",
    definitions: contracts.definitions,
  });

  const cache = new Map<string, ValidateFunction>();
  const definitionCache = new Map<string, ValidateFunction>();

  const compile = (schema: JsonSchema | null): ValidateFunction | null => {
    if (schema === null) return null;
    const key = JSON.stringify(schema);
    const existing = cache.get(key);
    if (existing !== undefined) return existing;
    const compiled = ajv.compile(schema);
    cache.set(key, compiled);
    return compiled;
  };

  const run = (validator: ValidateFunction | null, value: unknown): ValidationOutcome => {
    if (validator === null) return { ok: true, errors: "" };
    const data: unknown = structuredClone(value);
    if (validator(data)) return { ok: true, errors: "" };
    return { ok: false, errors: ajv.errorsText(validator.errors, { separator: "; " }) };
  };

  const operationOf = (name: string) => {
    const operation = contracts.operations[name];
    if (operation === undefined) throw new Error(`no ajv contract for operation ${name}`);
    return operation;
  };

  const definitionValidator = (name: string): ValidateFunction => {
    const existing = definitionCache.get(name);
    if (existing !== undefined) return existing;
    const compiled = ajv.compile({ $ref: `${contracts.schemaId}#/definitions/${name}` });
    definitionCache.set(name, compiled);
    return compiled;
  };

  for (const name of Object.keys(contracts.definitions)) definitionValidator(name);

  return {
    definitionCount: Object.keys(contracts.definitions).length,
    validateDefinition(name, value) {
      return run(definitionValidator(name), value);
    },
    validatePathParams(operation, value) {
      return run(compile(operationOf(operation).pathParams), value);
    },
    validateQueryParams(operation, value) {
      return run(compile(operationOf(operation).queryParams), value);
    },
    validateRequestBody(operation, value) {
      return run(compile(operationOf(operation).requestBody), value);
    },
    validateResponseBody(operation, status, value) {
      const schema = operationOf(operation).responses[String(status)];
      if (schema === undefined) {
        return { ok: false, errors: `operation ${operation} declares no ${status} response` };
      }
      return run(compile(schema), value);
    },
    knownOperations() {
      return Object.keys(contracts.operations);
    },
  };
}
