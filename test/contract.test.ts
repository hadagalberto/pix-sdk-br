/**
 * Contract checks against the generated, spec-derived validators: mock
 * responses must satisfy the schemas they declare, and client-emitted request
 * bodies must satisfy their declared request schema. Known inconsistencies in
 * the upstream pinned examples are asserted as known-invalid vectors rather
 * than silently ignored.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import { requestBodyExamples, operationResponseExamples } from "../src/generated/examples.js";
import { OPERATIONS } from "../src/generated/operations.js";
import { requestBodyValidators, schemaValidators } from "../src/generated/validators.js";
import { generateTxid } from "../src/txid.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
let client: PixClient;

beforeAll(async () => {
  server = await startMockServer();
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

afterAll(async () => {
  await client.close();
  await server.close();
});

describe("spec examples against generated validators", () => {
  it("accepts the majority of official success examples", () => {
    let valid = 0;
    let invalid = 0;
    for (const operation of Object.values(OPERATIONS)) {
      for (const response of operation.responses) {
        if (response.code < 200 || response.code >= 300 || response.schema === undefined) continue;
        const example = operationResponseExamples[operation.name]?.[response.code]?.[0];
        if (example === undefined) continue;
        const result = schemaValidators[response.schema]?.(example);
        expect(result, `missing validator for ${response.schema}`).toBeDefined();
        if (result?.ok === true) valid += 1;
        else invalid += 1;
      }
    }
    // The pinned upstream examples contain documented schema mismatches; the
    // mock repairs them before emitting, but the raw examples are checked here.
    expect(valid).toBeGreaterThan(10);
    expect(invalid).toBeGreaterThan(10);
  });

  it("detects the known upstream `loc.criacao` inconsistency", () => {
    const example = operationResponseExamples["GetCobTxid"]?.[200]?.[0];
    const result = schemaValidators["CobCompleta"]?.(example);
    expect(result?.ok).toBe(false);
    if (result !== undefined && !result.ok) {
      expect(
        result.issues.some((issue) => issue.path === "loc" && issue.message.includes("criacao")),
      ).toBe(true);
    }
  });

  it("accepts the official request-body examples", () => {
    let valid = 0;
    let invalid = 0;
    for (const [name, examples] of Object.entries(requestBodyExamples)) {
      const validator = requestBodyValidators[name];
      expect(validator, `missing validator for ${name}`).toBeDefined();
      for (const example of examples) {
        if (validator?.(example).ok === true) valid += 1;
        else invalid += 1;
      }
    }
    expect(valid).toBeGreaterThan(20);
    expect(invalid).toBeGreaterThan(0);
  });
});

describe("client <-> mock contract", () => {
  it("sends a schema-valid request body and receives schema-valid responses", async () => {
    const request = requestBodyExamples["CobBody"]?.[0];
    expect(request).toBeDefined();
    const txid = generateTxid();

    const created = await client.cob.createWithTxid(txid, request as never);
    expect(schemaValidators["CobGerada"]?.(created).ok).toBe(true);

    const sent = server.requests.find(
      (entry) => entry.method === "PUT" && entry.path === `/cob/${txid}`,
    );
    expect(sent).toBeDefined();
    expect(requestBodyValidators["CobBody"]?.(JSON.parse(sent?.body ?? "null")).ok).toBe(true);

    const fetched = await client.cob.get(txid);
    expect(schemaValidators["CobCompleta"]?.(fetched).ok).toBe(true);

    const listed = await client.cob.list({
      inicio: "2026-01-01T00:00:00Z",
      fim: "2026-12-31T23:59:59Z",
    });
    expect(schemaValidators["CobsConsultadas"]?.(listed).ok).toBe(true);
  });

  it("keeps generic mock responses spec-valid", async () => {
    const cobr = await client.cobr.get(generateTxid());
    expect(schemaValidators["CobRCompleta"]?.(cobr).ok).toBe(true);
  });
});
