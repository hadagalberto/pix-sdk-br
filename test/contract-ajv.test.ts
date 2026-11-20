/**
 * Contract tests against the real OpenAPI specification.
 *
 * Every operation is exercised through the SDK against the in-memory mock API.
 * For each resulting exchange ajv validates:
 *   - the path parameters (coerced from the URL),
 *   - the query parameters,
 *   - the request body (when the operation declares one),
 *   - the response body for the returned status code (JWS payloads are decoded
 *     from their application/jose envelope before validation).
 * Known-invalid vectors assert that malformed data is rejected both by the
 * generated validators and by ajv, and that the mock emits a valid problem+json
 * response with `violacoes`.
 */

import { Agent, request as undiciRequest } from "undici";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import { requestBodyExamples } from "../src/generated/examples.js";
import { OPERATIONS } from "../src/generated/operations.js";
import { requestBodyValidators } from "../src/generated/validators.js";
import { generateTxid } from "../src/txid.js";
import { createContractValidators, type ContractValidators } from "./contract/ajv.js";
import { startMockServer, type MockServer, type RecordedExchange } from "./mock-server/server.js";

const LIST_QUERY = {
  inicio: "2026-01-01T00:00:00Z",
  fim: "2026-12-31T23:59:59Z",
};
const E2EID = "a".repeat(32);
const ID_REC = "b".repeat(29);
const CHAVE = "12345678909";

const FALLBACK_BODIES: Readonly<Record<string, unknown>> = {
  WebhookCobConfigBody: { webhookUrl: "https://example.com/webhookcob" },
  WebhookCobVConfigBody: { webhookUrl: "https://example.com/webhookcobv" },
};

/** Picks a known-valid request example, repairing the upstream modalidade defect. */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function bodyOf<T>(name: string): T {
  const validator = requestBodyValidators[name];
  const examples = requestBodyExamples[name] ?? [];
  let candidate = examples.find((example) => validator?.(example).ok === true);
  if (candidate === undefined && examples[0] !== undefined) {
    candidate = repairModalidades(examples[0]);
    if (validator?.(candidate).ok !== true) candidate = undefined;
  }
  candidate ??= FALLBACK_BODIES[name];
  if (candidate === undefined || validator?.(candidate).ok !== true) {
    throw new Error(`no known-valid example for request body ${name}`);
  }
  return candidate as T;
}

function repairModalidades(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(repairModalidades);
  if (typeof value !== "object" || value === null) return value;
  const record: Record<string, unknown> = { ...(value as Record<string, unknown>) };
  for (const [key, child] of Object.entries(record)) record[key] = repairModalidades(child);
  const modalidade = record["modalidade"];
  if (typeof modalidade === "string" && /^\d+$/.test(modalidade)) {
    record["modalidade"] = Number(modalidade);
  }
  return record;
}

function pathParamsOf(template: string, actual: string): Record<string, string> {
  const names = [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1] ?? "");
  const pattern = new RegExp(
    `^${template.replace(/\{[A-Za-z0-9_]+\}/g, "([^/]+)").replace(/\//g, "\\/")}$`,
  );
  const match = pattern.exec(actual);
  const result: Record<string, string> = {};
  names.forEach((name, index) => {
    result[name] = decodeURIComponent(match?.[index + 1] ?? "");
  });
  return result;
}

/** Decodes an application/jose response into the JSON Schema-validated payload. */
function decodeJose(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  const segments = raw.split(".");
  if (segments.length !== 3) return raw;
  return JSON.parse(Buffer.from(segments[1] ?? "", "base64url").toString("utf8")) as unknown;
}

function assertValid(
  exchange: RecordedExchange,
  validators: ContractValidators,
  label: string,
  requestBodyValid = true,
): void {
  const info = OPERATIONS[exchange.operation];
  expect(info, `${label}: unknown operation ${exchange.operation}`).toBeDefined();
  if (info === undefined) return;

  const path = pathParamsOf(info.path, exchange.path);
  const pathResult = validators.validatePathParams(exchange.operation, path);
  expect(pathResult.ok, `${label} path: ${pathResult.errors}`).toBe(true);

  const queryResult = validators.validateQueryParams(exchange.operation, exchange.query);
  expect(queryResult.ok, `${label} query: ${queryResult.errors}`).toBe(true);

  if (exchange.requestBody !== undefined && requestBodyValid) {
    const bodyResult = validators.validateRequestBody(exchange.operation, exchange.requestBody);
    expect(bodyResult.ok, `${label} request body: ${bodyResult.errors}`).toBe(true);
  }

  if (exchange.responseBody === undefined) {
    const declared = info.responses.find((response) => response.code === exchange.status);
    expect(declared, `${label}: undeclared ${String(exchange.status)} response`).toBeDefined();
    expect(
      declared?.schema,
      `${label}: ${String(exchange.status)} should not carry a schema`,
    ).toBeUndefined();
    return;
  }
  const value =
    exchange.contentType === "application/jose"
      ? decodeJose(exchange.responseBody)
      : exchange.responseBody;
  const responseResult = validators.validateResponseBody(
    exchange.operation,
    exchange.status,
    value,
  );
  expect(responseResult.ok, `${label} response: ${responseResult.errors}`).toBe(true);
}

let server: MockServer;
let client: PixClient;
let agent: Agent;
let validators: ContractValidators;

beforeAll(async () => {
  server = await startMockServer();
  agent = new Agent({
    connect: {
      cert: server.certificates.clientCertPem,
      key: server.certificates.clientKeyPem,
      ca: server.certificates.caCertPem,
    },
  });
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
  validators = createContractValidators();
});

beforeEach(() => server.reset());

afterAll(async () => {
  await agent.close();
  await client.close();
  await server.close();
});

describe("ajv contract infrastructure", () => {
  it("compiles every spec definition and accepts/rejects known vectors", () => {
    expect(validators.definitionCount).toBeGreaterThan(150);
    expect(
      validators.validateDefinition("Problema", {
        type: "https://pix.example.com/erro/NaoEncontrado",
        title: "Not found",
        status: 404,
      }).ok,
    ).toBe(true);
    const invalid = validators.validateDefinition("Problema", { title: "Not found" });
    expect(invalid.ok).toBe(false);
    expect(invalid.errors).toContain("status");
  });

  it("every official request example accepted by the client validator is ajv-valid", () => {
    let checked = 0;
    for (const [name, examples] of Object.entries(requestBodyExamples)) {
      const validator = requestBodyValidators[name];
      for (const example of examples) {
        if (validator?.(example).ok !== true) continue;
        checked += 1;
        const operation = Object.values(OPERATIONS).find((op) => op.requestBody?.name === name);
        expect(operation, `no operation uses ${name}`).toBeDefined();
        const result = validators.validateRequestBody(operation?.name ?? "", example);
        expect(result.ok, `${name}: ${result.errors}`).toBe(true);
      }
    }
    expect(checked).toBeGreaterThan(20);
  });
});

describe("every operation: ajv-validated client <-> mock exchanges", () => {
  it("drives all spec operations and validates every request and response", async () => {
    const cobTxid = generateTxid();
    const cobvTxid = generateTxid();
    const cobrTxid = generateTxid();

    // cob
    await client.cob.createWithTxid(cobTxid, bodyOf("CobBody"));
    await client.cob.create(bodyOf("CobBody"));
    // POST variants have no resource method (create() is the idempotent PUT);
    // invoke them by operation name so every spec operation is exercised.
    await client.request("PostCob", { body: bodyOf("CobBody") });
    await client.cob.get(cobTxid);
    await client.cob.update(cobTxid, bodyOf("CobBodyRevisada"));
    await client.cob.list(LIST_QUERY);

    // cobv
    await client.cobv.createWithTxid(cobvTxid, bodyOf("CobVBody"));
    await client.cobv.create(bodyOf("CobVBody"));
    await client.cobv.get(cobvTxid);
    await client.cobv.update(cobvTxid, bodyOf("CobVBodyRevisada"));
    await client.cobv.list(LIST_QUERY);

    // lotecobv
    await client.lotecobv.create(bodyOf("LoteCobVBody"));
    await client.lotecobv.get("1");
    await client.lotecobv.update("1", bodyOf("LoteCobVBodyRevisado"));
    await client.lotecobv.list(LIST_QUERY);

    // loc + locrec
    await client.loc.create(bodyOf("PayloadLocationBody"));
    await client.loc.get(1);
    await client.loc.deleteTxid(1);
    await client.loc.list(LIST_QUERY);
    await client.locrec.create({});
    await client.locrec.get(1);
    await client.locrec.deleteIdRec(1);
    await client.locrec.list(LIST_QUERY);

    // pix, devolucao and unauthenticated payload endpoints
    await client.pix.get(E2EID);
    await client.pix.list(LIST_QUERY);
    await client.pix.devolucao.create(E2EID, "dev1", bodyOf("DevolucaoBody"));
    await client.pix.devolucao.get(E2EID, "dev1");
    await client.payload.cob("token-cob");
    await client.payload.cobv("token-cobv");
    await client.payload.rec("token-rec");

    // webhook family
    await client.webhook.get(CHAVE);
    await client.webhook.configure(CHAVE, bodyOf("WebhookConfigBody"));
    await client.webhook.delete(CHAVE);
    await client.webhook.list(LIST_QUERY);
    const webhookFamilies = [
      [client.webhookCob, "WebhookCobConfigBody"],
      [client.webhookCobv, "WebhookCobVConfigBody"],
      [client.webhookCobr, "WebhookCobRConfigBody"],
      [client.webhookRec, "WebhookRecConfigBody"],
    ] as const;
    for (const [resource, bodyName] of webhookFamilies) {
      await resource.get();
      await resource.configure(bodyOf(bodyName));
      await resource.delete();
      await resource.list();
    }

    // rec + solicrec
    await client.rec.create(bodyOf("RecBody"));
    await client.rec.get(ID_REC);
    await client.rec.update(ID_REC, bodyOf("RecBodyRevisada"));
    await client.rec.list(LIST_QUERY);
    await client.solicrec.create(bodyOf("SolicRecBody"));
    await client.solicrec.get(ID_REC);
    await client.solicrec.update(ID_REC, bodyOf("SolicRecBodyRevisada"));

    // cobr + retentativa
    await client.cobr.create(bodyOf("CobRBody"));
    await client.request("PostCobr", { body: bodyOf("CobRBody") });
    await client.cobr.get(cobrTxid);
    await client.cobr.update(cobrTxid, bodyOf("CobRBodyRevisada"));
    await client.cobr.list(LIST_QUERY);
    await client.cobr.retry(cobrTxid, "2026-01-01");

    const covered = new Set(server.exchanges.map((exchange) => exchange.operation));
    expect([...covered].sort()).toEqual(Object.keys(OPERATIONS).sort());
    expect(server.exchanges.length).toBeGreaterThanOrEqual(Object.keys(OPERATIONS).length);
    for (const [index, exchange] of server.exchanges.entries()) {
      assertValid(exchange, validators, `${exchange.operation}#${index}`);
    }
  });
});

describe("spec-conformant errors (known-invalid vectors)", () => {
  it("returns an ajv-valid problem+json with violacoes for a malformed body", async () => {
    const authorization = `Basic ${Buffer.from("mock-client:mock-secret", "utf8").toString("base64")}`;
    const token = await undiciRequest(`${server.baseUrl}/oauth/token`, {
      method: "POST",
      dispatcher: agent,
      headers: { authorization, "content-type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    const credentials = (await token.body.json()) as { access_token: string };

    const response = await undiciRequest(`${server.baseUrl}/cob/${generateTxid()}`, {
      method: "PUT",
      dispatcher: agent,
      headers: {
        authorization: `Bearer ${credentials.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    });
    expect(response.statusCode).toBe(400);
    const problem = (await response.body.json()) as Record<string, unknown>;
    expect(Array.isArray(problem["violacoes"])).toBe(true);
    expect((problem["violacoes"] as unknown[]).length).toBeGreaterThan(0);
    const result = validators.validateResponseBody("PutCobTxid", 400, problem);
    expect(result.ok, result.errors).toBe(true);

    const exchange = server.exchanges.find((entry) => entry.operation === "PutCobTxid");
    expect(exchange, "the invalid request should have been recorded").toBeDefined();
    if (exchange === undefined) throw new Error("missing recorded exchange");
    assertValid(exchange, validators, "invalid PutCobTxid", false);
  });

  it("rejects a known-invalid request example with ajv", () => {
    const examples = requestBodyExamples["CobBody"] ?? [];
    const invalid = examples.find(
      (example) => requestBodyValidators["CobBody"]?.(example).ok !== true,
    );
    expect(invalid).toBeDefined();
    const result = validators.validateRequestBody("PutCobTxid", invalid);
    expect(result.ok).toBe(false);
    expect(result.errors).not.toBe("");
  });
});
