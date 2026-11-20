/**
 * PRIMARY CONTRACT SUITE — one named test per spec operation.
 *
 * For every one of the 57 operations this checks what the CLIENT puts on the
 * wire (method, path, query, headers, body) against the pinned OpenAPI
 * contracts, and that the client parses EVERY documented response status into
 * the correct typed result or typed `PixApiError`. Mock responses come from
 * static fixtures (no schema repair); ajv validates them independently.
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PixClient, type RequestArgs } from "../src/client/client.js";
import { PixApiError } from "../src/client/errors.js";
import { requestBodyExamples } from "../src/generated/examples.js";
import { OPERATIONS, type OperationInfo } from "../src/generated/operations.js";
import { OPERATION_NAMES } from "../src/generated/meta.js";
import { requestBodyValidators } from "../src/generated/validators.js";
import { generateTxid } from "../src/txid.js";
import { createContractValidators, type ContractValidators } from "./contract/ajv.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

const INICIO = "2026-01-01T00:00:00Z";
const FIM = "2026-12-31T23:59:59Z";
const E2EID = "a".repeat(32);
const ID_REC = "b".repeat(29);
const ID_SOLIC_REC = "c".repeat(29);
const CHAVE = "12345678909";

/** Hand-written, spec-derived bodies for examples upstream gets wrong or omits. */
const HAND_WRITTEN_BODIES: Readonly<Record<string, unknown>> = {
  CobVBody: {
    calendario: { dataDeVencimento: "2020-12-31", validadeAposVencimento: 30 },
    loc: { id: 789 },
    devedor: {
      logradouro: "Alameda Souza, Numero 80, Bairro Braz",
      cidade: "Recife",
      uf: "PE",
      cep: "70011750",
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    valor: {
      original: "123.45",
      multa: { modalidade: 2, valorPerc: "15.00" },
      juros: { modalidade: 2, valorPerc: "2.00" },
      desconto: { modalidade: 1, descontoDataFixa: [{ data: "2020-11-30", valorPerc: "30.00" }] },
    },
    chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  WebhookCobConfigBody: { webhookUrl: "https://example.com/webhookcob" },
  WebhookCobVConfigBody: { webhookUrl: "https://example.com/webhookcobv" },
};

function bodyOf(name: string): unknown {
  const validator = requestBodyValidators[name];
  expect(validator, `missing generated validator for ${name}`).toBeDefined();
  const handWritten = HAND_WRITTEN_BODIES[name];
  if (handWritten !== undefined) {
    expect(validator?.(handWritten).ok, `hand-written ${name} must be schema-valid`).toBe(true);
    return handWritten;
  }
  const example = (requestBodyExamples[name] ?? []).find((value) => validator?.(value).ok === true);
  expect(example, `no known-valid example for ${name}`).toBeDefined();
  return example;
}

const PATH_SAMPLES: Readonly<Record<string, string>> = {
  txid: generateTxid(),
  id: "1",
  e2eid: E2EID,
  chave: CHAVE,
  idRec: ID_REC,
  idSolicRec: ID_SOLIC_REC,
  pixUrlAccessToken: "token-cob",
  recUrlAccessToken: "token-rec",
  data: "2026-01-01",
};

function argsOf(info: OperationInfo): RequestArgs {
  const path: Record<string, string> = {};
  for (const param of info.pathParams) {
    const sample = PATH_SAMPLES[param.name];
    expect(sample, `no sample for path parameter ${param.name}`).toBeDefined();
    path[param.name] = sample ?? "";
  }
  const query: Record<string, string> = {};
  for (const param of info.queryParams) {
    if (!param.required) continue;
    if (param.name === "inicio") query[param.name] = INICIO;
    else if (param.name === "fim") query[param.name] = FIM;
    else throw new Error(`no sample for required query parameter ${param.name}`);
  }
  const hasJoseResponse = info.responses.some(
    (response) => response.contentType === "application/jose",
  );
  return {
    ...(Object.keys(path).length > 0 ? { path } : {}),
    ...(Object.keys(query).length > 0 ? { query } : {}),
    ...(info.requestBody === undefined ? {} : { body: bodyOf(info.requestBody.name) }),
    ...(info.scopes.length === 0 ? { skipAuth: true } : {}),
    ...(hasJoseResponse ? { responseType: "text" as const } : {}),
  };
}

function concretePath(info: OperationInfo, args: RequestArgs): string {
  return info.path.replace(/\{([A-Za-z0-9_]+)\}/g, (_match, key: string) =>
    encodeURIComponent(String(args.path?.[key] ?? "")),
  );
}

function decodeJose(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const segments = value.split(".");
  if (segments.length !== 3) return value;
  return JSON.parse(Buffer.from(segments[1] ?? "", "base64url").toString("utf8")) as unknown;
}

function assertWireContract(
  info: OperationInfo,
  args: RequestArgs,
  server: MockServer,
  validators: ContractValidators,
  status: number,
): void {
  const exchange = server.exchanges.at(-1);
  expect(exchange, "the mock should record the exchange").toBeDefined();
  if (exchange === undefined) return;
  expect(exchange.operation).toBe(info.name);
  expect(exchange.method).toBe(info.method.toUpperCase());
  expect(exchange.path).toBe(concretePath(info, args));
  expect(exchange.query).toEqual(args.query ?? {});
  expect(exchange.requestBody).toEqual(args.body);

  const pathParams = Object.fromEntries(
    info.pathParams.map((param) => [param.name, String(args.path?.[param.name] ?? "")]),
  );
  const pathResult = validators.validatePathParams(info.name, pathParams);
  expect(pathResult.ok, `${info.name} path: ${pathResult.errors}`).toBe(true);
  const queryResult = validators.validateQueryParams(info.name, args.query ?? {});
  expect(queryResult.ok, `${info.name} query: ${queryResult.errors}`).toBe(true);
  if (args.body !== undefined) {
    const bodyResult = validators.validateRequestBody(info.name, args.body);
    expect(bodyResult.ok, `${info.name} body: ${bodyResult.errors}`).toBe(true);
  }

  const request = [...server.requests]
    .reverse()
    .find((entry) => entry.path === exchange.path && entry.method === info.method.toUpperCase());
  expect(request, "request headers should be recorded").toBeDefined();
  if (request === undefined) return;
  expect(request.headers["accept"]).toBe("application/json");
  expect(request.headers["user-agent"]).toBe("pix-sdk-br/0.1.0");
  if (args.body === undefined) expect(request.headers["content-type"]).toBeUndefined();
  else expect(request.headers["content-type"]).toBe("application/json");
  if (args.skipAuth === true) expect(request.authorization).toBeUndefined();
  else expect(request.authorization).toMatch(/^Bearer \S+$/);

  expect(exchange.status).toBe(status);
  const responseSchema = info.responses.find((entry) => entry.code === status)?.schema;
  if (exchange.responseBody !== undefined && responseSchema !== undefined) {
    const value =
      exchange.contentType === "application/jose"
        ? decodeJose(exchange.responseBody)
        : exchange.responseBody;
    const responseResult = validators.validateResponseBody(info.name, status, value);
    expect(
      responseResult.ok,
      `${info.name} ${String(status)} response: ${responseResult.errors}`,
    ).toBe(true);
  }
}

const OPERATION_CASES: readonly (readonly [string, OperationInfo])[] = OPERATION_NAMES.map(
  (name) => {
    const info = OPERATIONS[name];
    if (info === undefined) throw new Error(`missing generated operation ${name}`);
    return [name, info] as const;
  },
);

let server: MockServer;
let client: PixClient;
let validators: ContractValidators;

beforeAll(async () => {
  server = await startMockServer();
  validators = createContractValidators();
  client = new PixClient({
    baseUrl: server.baseUrl,
    clientId: "mock-client",
    clientSecret: "mock-secret",
    certificate: {
      pfx: server.certificates.clientPfx,
      passphrase: server.certificates.pfxPassphrase,
      ca: server.certificates.caCertPem,
    },
    retry: false,
  });
});

beforeEach(() => server.reset());

afterAll(async () => {
  await client.close();
  await server.close();
});

describe("per-operation client contract (57 operations)", () => {
  expect(OPERATION_NAMES).toHaveLength(57);
  expect(new Set(OPERATION_NAMES).size).toBe(57);

  it.each(OPERATION_CASES)(
    "%s — wire contract and every documented response status",
    async (name, info) => {
      const args = argsOf(info);
      const expectedSuccess = info.responses.find(
        (response) => response.code >= 200 && response.code < 300,
      );
      expect(expectedSuccess, `${name} has no documented success status`).toBeDefined();
      const defaultStatus = expectedSuccess?.code ?? 200;

      // These two operations read a specific charge; seed it through the
      // documented idempotent-create path so the happy path is reachable.
      if (name === "GetCobTxid" || name === "PatchCobTxid") {
        await client.request("PutCobTxid", {
          path: { txid: String(args.path?.["txid"] ?? "") },
          body: bodyOf("CobBody"),
        });
      }

      const defaultResult = await client.request(name, args);
      assertWireContract(info, args, server, validators, defaultStatus);
      const defaultSchema = expectedSuccess?.schema;
      if (defaultSchema === undefined) expect(defaultResult).toBeUndefined();
      else {
        const parsed = decodeJose(defaultResult);
        const result = validators.validateResponseBody(name, defaultStatus, parsed);
        expect(result.ok, `${name} default result: ${result.errors}`).toBe(true);
      }

      for (const response of info.responses) {
        server.forceResponse(name, response.code);
        if (response.code >= 200 && response.code < 300) {
          const value = await client.request(name, args);
          assertWireContract(info, args, server, validators, response.code);
          if (response.schema === undefined) expect(value).toBeUndefined();
          else {
            const parsed = decodeJose(value);
            const result = validators.validateResponseBody(name, response.code, parsed);
            expect(result.ok, `${name} ${String(response.code)} result: ${result.errors}`).toBe(
              true,
            );
          }
          continue;
        }

        let caught: unknown;
        try {
          await client.request(name, args);
        } catch (error) {
          caught = error;
        }
        expect(caught, `${name} ${String(response.code)} should reject`).toBeInstanceOf(
          PixApiError,
        );
        const apiError = caught as PixApiError;
        expect(apiError.status, `${name} ${String(response.code)} status`).toBe(response.code);
        expect(apiError.context.operation).toBe(name);
        expect(apiError.context.method).toBe(info.method);
        expect(apiError.context.path).toBe(concretePath(info, args));
        const problem = validators.validateDefinition("Problema", apiError.problem);
        expect(problem.ok, `${name} problem: ${problem.errors}`).toBe(true);
        assertWireContract(info, args, server, validators, response.code);
      }
    },
  );
});
