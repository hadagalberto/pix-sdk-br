/** Client orchestration: validation, pagination, resources, adapters. */

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import { PixError, PixValidationError } from "../src/client/errors.js";
import type { HttpFetch, HttpFetchInit, PixClientOptions } from "../src/client/types.js";
import { requestBodyExamples } from "../src/generated/examples.js";
import { requestBodyValidators } from "../src/generated/validators.js";
import { generateTxid } from "../src/txid.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
const clients: PixClient[] = [];
const LIST_QUERY = {
  inicio: "2026-01-01T00:00:00Z",
  fim: "2026-12-31T23:59:59Z",
};
const E2EID = "a".repeat(32);
const REC_ID = "b".repeat(29);

function makeClient(overrides: Partial<PixClientOptions> = {}): PixClient {
  const client = new PixClient({
    baseUrl: server.baseUrl,
    clientId: "mock-client",
    clientSecret: "mock-secret",
    certificate: {
      cert: server.certificates.clientCertPem,
      key: server.certificates.clientKeyPem,
      ca: server.certificates.caCertPem,
    },
    retry: false,
    ...overrides,
  });
  clients.push(client);
  return client;
}

/** Minimal valid bodies for request bodies the pinned spec ships no example for. */
const FALLBACK_BODIES: Readonly<Record<string, unknown>> = {
  PayloadLocationRecBody: { tipo: "rec" },
  WebhookCobConfigBody: { webhookUrl: "https://example.com/webhook" },
  WebhookCobVConfigBody: { webhookUrl: "https://example.com/webhook" },
};

/** Picks a known-valid official example (some upstream examples are defective). */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function bodyOf<T>(name: string): T {
  const validator = requestBodyValidators[name];
  const examples = requestBodyExamples[name] ?? [];
  let example = examples.find((item) => validator?.(item).ok === true);
  if (example === undefined) example = FALLBACK_BODIES[name];
  // Known upstream defect: CobVBody examples encode `modalidade` as a string
  // although the schema declares an integer.
  if (example === undefined && name === "CobVBody" && examples[0] !== undefined) {
    const repaired = repairModalidades(examples[0]);
    if (validator?.(repaired).ok === true) example = repaired;
  }
  if (example === undefined) throw new Error(`no valid example for ${name}`);
  return example as T;
}

function repairModalidades(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(repairModalidades);
  if (typeof value !== "object" || value === null) return value;
  const record = { ...(value as Record<string, unknown>) };
  for (const [key, child] of Object.entries(record)) {
    record[key] = repairModalidades(child);
  }
  const modalidade = record["modalidade"];
  if (typeof modalidade === "string" && /^\d+$/.test(modalidade)) {
    record["modalidade"] = Number(modalidade);
  }
  return record;
}

beforeAll(async () => {
  server = await startMockServer();
});

afterEach(async () => {
  server.reset();
  while (clients.length > 0) await clients.pop()?.close();
});

afterAll(async () => {
  await server.close();
});

describe("client configuration", () => {
  it("rejects a non-absolute or non-http baseUrl", () => {
    expect(() => makeClient({ baseUrl: "not-a-url" })).toThrow(RangeError);
    expect(() => makeClient({ baseUrl: "ftp://example.com" })).toThrow(RangeError);
  });

  it("rejects empty credentials", () => {
    expect(() => makeClient({ clientId: "" })).toThrow(RangeError);
    expect(() => makeClient({ clientSecret: "" })).toThrow(RangeError);
  });

  it("exposes the token provider for explicit invalidation", async () => {
    const client = makeClient();
    await client.auth.getToken();
    expect(client.auth.cachedToken).toBeDefined();
    client.auth.invalidate();
    expect(client.auth.cachedToken).toBeUndefined();
  });
});

describe("client-side validation", () => {
  it("rejects an invalid path parameter without making a request", async () => {
    const client = makeClient();
    await expect(client.cob.get("short")).rejects.toMatchObject({
      name: "PixValidationError",
      operation: "GetCobTxid",
    });
    expect(server.requests).toHaveLength(0);
  });

  it("reports field paths for a malformed request body", async () => {
    const client = makeClient();
    try {
      await client.cob.createWithTxid(generateTxid(), {} as never);
      throw new Error("expected validation failure");
    } catch (error) {
      expect(error).toBeInstanceOf(PixValidationError);
      const validation = error as PixValidationError;
      expect(validation.fieldPaths.length).toBeGreaterThan(0);
      expect(validation.message).toContain("missing required property");
    }
    expect(server.requests).toHaveLength(0);
  });

  it("rejects a missing required body", async () => {
    const client = makeClient();
    await expect(
      client.cob.createWithTxid(generateTxid(), undefined as never),
    ).rejects.toMatchObject({ name: "PixValidationError" });
  });

  it("rejects missing required query parameters", async () => {
    const client = makeClient();
    await expect(client.cob.list({} as never)).rejects.toMatchObject({
      name: "PixValidationError",
      operation: "GetCob",
    });
  });

  it("rejects an unknown operation name", async () => {
    const client = makeClient();
    await expect(client.request("NoSuchOperation")).rejects.toBeInstanceOf(PixError);
  });
});

describe("pagination", () => {
  it("walks every page of cob list results", async () => {
    const client = makeClient();
    const txids = [generateTxid(), generateTxid(), generateTxid()];
    for (const txid of txids) await client.cob.createWithTxid(txid, bodyOf("CobBody"));

    const seen: string[] = [];
    for await (const cob of client.cob.listAll({
      ...LIST_QUERY,
      "paginacao.itensPorPagina": 2,
    })) {
      seen.push(cob.txid);
    }
    expect(new Set(seen)).toEqual(new Set(txids));
  });
});

describe("pluggable fetch adapter", () => {
  it("calls the injected fetch with auth headers and no mTLS dispatcher", async () => {
    const seen: { url: string; init: HttpFetchInit }[] = [];
    const fetch: HttpFetch = (url, init) => {
      seen.push({ url, init });
      const isToken = url.includes("/oauth/token");
      const payload = isToken ? { access_token: "adapter-token", expires_in: 3600 } : { ok: true };
      return Promise.resolve({
        status: 200,
        headers: { get: () => "application/json" },
        text: () => Promise.resolve(JSON.stringify(payload)),
      });
    };
    const client = new PixClient({
      baseUrl: "https://psp.example",
      clientId: "id",
      clientSecret: "secret",
      scopes: ["cob.read"],
      fetch,
      retry: false,
    });
    clients.push(client);
    const result = await client.request<{ ok: boolean }>("GetCobTxid", {
      path: { txid: generateTxid() },
    });
    expect(result).toEqual({ ok: true });
    expect(seen).toHaveLength(2);
    const apiCall = seen[1];
    expect(apiCall?.url).toMatch(/^https:\/\/psp\.example\/cob\/[a-zA-Z0-9]+$/);
    expect(apiCall?.init.headers["authorization"]).toBe("Bearer adapter-token");
    expect(apiCall?.init.dispatcher).toBeUndefined();
  });
});

describe("resource namespaces", () => {
  it("exercises every namespace against the mock API", async () => {
    const client = makeClient();
    const txid = generateTxid();
    const key = "7d9f0335-8dcc-4054-9bf9-0dbd61d36906";

    await client.cob.createWithTxid(txid, bodyOf("CobBody"));
    await client.cobv.createWithTxid(txid, bodyOf("CobVBody"));
    await client.cob.create(bodyOf("CobBody"));
    await client.cob.get(txid, { revisao: 0 });
    await client.cob.update(txid, bodyOf("CobBodyRevisada"));
    await client.cob.list(LIST_QUERY);

    await client.cobv.create(bodyOf("CobVBody"));
    await client.cobv.get(txid, { revisao: 0 });
    await client.cobv.update(txid, bodyOf("CobVBodyRevisada"));
    await client.cobv.list(LIST_QUERY);

    await client.lotecobv.create(bodyOf("LoteCobVBody"));
    await client.lotecobv.get(txid);
    await client.lotecobv.update(txid, bodyOf("LoteCobVBody"));
    await client.lotecobv.list(LIST_QUERY);

    await client.loc.create(bodyOf("PayloadLocationBody"));
    await client.loc.get(789);
    await client.loc.deleteTxid(789);
    await client.loc.list(LIST_QUERY);

    await client.locrec.create(bodyOf("PayloadLocationRecBody"));
    await client.locrec.get(789);
    await client.locrec.deleteIdRec(789);
    await client.locrec.list(LIST_QUERY);

    await client.pix.get(E2EID);
    await client.pix.list(LIST_QUERY);
    await client.pix.devolucao.create(E2EID, "dev1", bodyOf("DevolucaoBody"));
    await client.pix.devolucao.get(E2EID, "dev1");

    const webhooks: readonly [typeof client.webhook, string][] = [
      [client.webhook, "WebhookConfigBody"],
      [client.webhookCob, "WebhookCobConfigBody"],
      [client.webhookCobv, "WebhookCobVConfigBody"],
      [client.webhookCobr, "WebhookCobRConfigBody"],
      [client.webhookRec, "WebhookRecConfigBody"],
    ];
    for (const [webhook, bodyName] of webhooks) {
      await webhook.list();
      await webhook.configure(key, bodyOf(bodyName));
      await webhook.get(key);
      await webhook.delete(key);
    }

    await client.rec.create(bodyOf("RecBody"));
    await client.rec.get(REC_ID);
    await client.rec.update(REC_ID, bodyOf("RecBodyRevisada"));
    await client.rec.list(LIST_QUERY);

    await client.solicrec.create(bodyOf("SolicRecBody"));
    await client.solicrec.get(REC_ID);
    await client.solicrec.update(REC_ID, bodyOf("SolicRecBodyRevisada"));

    await client.cobr.create(bodyOf("CobRBody"));
    await client.cobr.get(txid);
    await client.cobr.update(txid, bodyOf("CobRBodyRevisada"));
    await client.cobr.list(LIST_QUERY);
    await client.cobr.retry(txid, "2026-01-01");
  });

  it("retrieves all three payload-token endpoints as plain text", async () => {
    const urls: string[] = [];
    const fetch: HttpFetch = (url) => {
      urls.push(url);
      return Promise.resolve({
        status: 200,
        headers: { get: () => "text/plain" },
        text: () => Promise.resolve("jws.value"),
      });
    };
    const client = new PixClient({
      baseUrl: "https://psp.example",
      clientId: "id",
      clientSecret: "secret",
      fetch,
      retry: false,
    });
    clients.push(client);

    expect(await client.payload.cob("token")).toBe("jws.value");
    expect(await client.payload.cobv("token")).toBe("jws.value");
    expect(await client.payload.rec("token")).toBe("jws.value");
    expect(urls).toEqual([
      "https://psp.example/token",
      "https://psp.example/cobv/token",
      "https://psp.example/rec/token",
    ]);
  });
});
