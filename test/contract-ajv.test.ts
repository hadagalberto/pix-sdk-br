/**
 * ajv contract infrastructure and known-invalid vectors.
 *
 * Exercising every operation (what the client sends and how it parses every
 * documented response) lives in test/contract-operations.test.ts, with one
 * named test per operation. This file covers the contract compiler itself and
 * the negative cases that must be rejected by both validator implementations.
 */

import { Agent, request as undiciRequest } from "undici";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { requestBodyExamples } from "../src/generated/examples.js";
import { OPERATIONS } from "../src/generated/operations.js";
import { requestBodyValidators } from "../src/generated/validators.js";
import { generateTxid } from "../src/txid.js";
import { createContractValidators, type ContractValidators } from "./contract/ajv.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
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
  validators = createContractValidators();
});

beforeEach(() => server.reset());

afterAll(async () => {
  await agent.close();
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

  it("rejects a known-invalid request example with both validators", () => {
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
  });
});
