/** HTTP layer integration: mTLS, retries, timeouts, aborts, errors. */

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { PixAbortError, PixApiError, PixAuthError, PixNetworkError } from "../src/client/errors.js";
import { PixClient } from "../src/client/client.js";
import type { HttpFetch, PixClientOptions } from "../src/client/types.js";
import { requestBodyExamples } from "../src/generated/examples.js";
import { generateTxid } from "../src/txid.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
const clients: PixClient[] = [];

function makeClient(overrides: Partial<PixClientOptions> = {}): PixClient {
  const client = new PixClient({
    baseUrl: server.baseUrl,
    clientId: "mock-client",
    clientSecret: "mock-secret",
    certificate: {
      pfx: server.certificates.clientPfx,
      passphrase: server.certificates.pfxPassphrase,
      ca: server.certificates.caCertPem,
    },
    retry: false,
    ...overrides,
  });
  clients.push(client);
  return client;
}

const cobBody = requestBodyExamples["CobBody"]?.[0] as never;
const locBody = requestBodyExamples["PayloadLocationBody"]?.[0] as never;

beforeAll(async () => {
  server = await startMockServer();
});

afterEach(async () => {
  server.reset();
  while (clients.length > 0) await clients.pop()?.close();
  vi.restoreAllMocks();
});

afterAll(async () => {
  await server.close();
});

describe("mTLS transport", () => {
  it("creates and reads a cob using a PFX certificate", async () => {
    expect(cobBody).toBeDefined();
    const client = makeClient();
    const txid = generateTxid();
    const created = await client.cob.createWithTxid(txid, cobBody);
    expect(created.txid).toBe(txid);
    const fetched = await client.cob.get(txid);
    expect(fetched.txid).toBe(txid);
  });

  it("works with separate PEM certificate and key", async () => {
    const client = makeClient({
      certificate: {
        cert: server.certificates.clientCertPem,
        key: server.certificates.clientKeyPem,
        ca: server.certificates.caCertPem,
      },
    });
    const txid = generateTxid();
    await client.cob.createWithTxid(txid, cobBody);
    const result = await client.cob.get(txid);
    expect(result.status).toBe("ATIVA");
  });

  it("sends the acquired bearer token on API requests", async () => {
    const client = makeClient();
    const txid = generateTxid();
    await client.cob.createWithTxid(txid, cobBody);
    await client.cob.get(txid);
    const apiRequests = server.requests.filter((entry) => entry.path.startsWith("/cob"));
    expect(apiRequests.length).toBeGreaterThan(0);
    expect(apiRequests[0]?.authorization).toMatch(/^Bearer mock-access-token-\d+$/);
    expect(server.requests.some((entry) => entry.path === "/oauth/token")).toBe(true);
  });

  it("fetches a payload token without authentication as plain text", async () => {
    const client = makeClient();
    const jws = await client.payload.cob("mock-token");
    // application/jose: header.payload.signature, with a spec-shaped payload.
    const segments = jws.split(".");
    expect(segments).toHaveLength(3);
    const payload = JSON.parse(
      Buffer.from(segments[1] ?? "", "base64url").toString("utf8"),
    ) as Record<string, unknown>;
    expect(typeof payload["txid"]).toBe("string");
    expect(payload["calendario"]).toBeTypeOf("object");
    expect(server.requests.some((entry) => entry.path === "/oauth/token")).toBe(false);
  });
});

describe("retries", () => {
  it("retries a 429 with Retry-After on an idempotent request", async () => {
    server.faults.enqueueApiFault({ status: 429, retryAfterSeconds: 1 });
    const warn = vi.fn();
    const client = makeClient({
      retry: { maxAttempts: 2, baseDelayMs: 1, retryAfterCapMs: 5, random: () => 0 },
      logger: { warn },
    });

    const txid = generateTxid();
    const result = await client.cob.createWithTxid(txid, cobBody);
    expect(result.txid).toBe(txid);
    const writes = server.requests.filter(
      (entry) => entry.method === "PUT" && entry.path === `/cob/${txid}`,
    );
    expect(writes).toHaveLength(2);
    expect(warn).toHaveBeenCalledWith(
      "retrying idempotent request",
      expect.objectContaining({ status: 429, delayMs: 5, attempt: 1 }),
    );
  });

  it("retries 503 responses on GET", async () => {
    const client = makeClient({
      retry: { maxAttempts: 3, baseDelayMs: 1, random: () => 0 },
    });
    const txid = generateTxid();
    await client.cob.createWithTxid(txid, cobBody);
    server.faults.enqueueApiFault({ status: 503 });
    const result = await client.cob.get(txid);
    expect(result.status).toBe("ATIVA");
    expect(server.requests.filter((entry) => entry.method === "GET")).toHaveLength(2);
  });

  it("does not retry a non-idempotent POST", async () => {
    server.faults.enqueueApiFault({ status: 503 });
    expect(locBody).toBeDefined();
    const client = makeClient({
      retry: { maxAttempts: 3, baseDelayMs: 1, random: () => 0 },
    });
    await expect(client.loc.create(locBody)).rejects.toBeInstanceOf(PixApiError);
    expect(server.requests.filter((entry) => entry.path === "/loc")).toHaveLength(1);
  });

  it("gives up after maxAttempts", async () => {
    server.faults.enqueueApiFault({ status: 503 });
    server.faults.enqueueApiFault({ status: 503 });
    const client = makeClient({
      retry: { maxAttempts: 2, baseDelayMs: 1, random: () => 0 },
    });
    await expect(client.cob.get(generateTxid())).rejects.toMatchObject({ status: 503 });
    expect(server.requests.filter((entry) => entry.method === "GET")).toHaveLength(2);
  });
});

describe("timeouts and aborts", () => {
  it("times out a slow response as PixNetworkError", async () => {
    const client = makeClient({ timeoutMs: 20 });
    await client.auth.getToken();
    server.faults.setResponseDelay(200);
    await expect(client.cob.get(generateTxid())).rejects.toMatchObject({
      name: "PixNetworkError",
      code: "ETIMEDOUT",
      timeout: true,
    });
  });

  it("propagates a caller abort as PixAbortError", async () => {
    const client = makeClient({ timeoutMs: 5000 });
    await client.auth.getToken();
    server.faults.setResponseDelay(200);
    const controller = new AbortController();
    const pending = client.cob.get(generateTxid(), { signal: controller.signal });
    setTimeout(() => controller.abort(), 10);
    await expect(pending).rejects.toBeInstanceOf(PixAbortError);
  });

  it("wraps connection failures in PixNetworkError", async () => {
    const fetch: HttpFetch = (url) => {
      if (url.includes("/oauth/token")) {
        return Promise.resolve({
          status: 200,
          headers: { get: () => "application/json" },
          text: () => Promise.resolve(JSON.stringify({ access_token: "t", expires_in: 3600 })),
        });
      }
      return Promise.reject(new Error("socket exploded"));
    };
    const client = makeClient({ baseUrl: "https://psp.example", fetch });
    await expect(client.cob.get(generateTxid())).rejects.toBeInstanceOf(PixNetworkError);
  });
});

describe("error parsing", () => {
  it("parses problem+json error responses into PixApiError", async () => {
    const client = makeClient();
    try {
      await client.cob.get(generateTxid());
      throw new Error("expected failure");
    } catch (error) {
      expect(error).toBeInstanceOf(PixApiError);
      const apiError = error as PixApiError;
      expect(apiError.status).toBe(404);
      expect(apiError.type).toBe("about:blank");
      expect(apiError.title).toBe("Not Found");
      expect(apiError.detail).toBe("Cobrança não encontrada");
      expect(apiError.context.method).toBe("get");
    }
  });

  it("surfaces token-endpoint failures as PixAuthError", async () => {
    server.faults.enqueueTokenFault(401);
    const client = makeClient();
    await expect(client.cob.get(generateTxid())).rejects.toBeInstanceOf(PixAuthError);
  });
});

describe("lifecycle", () => {
  it("closes an internally created dispatcher", async () => {
    const client = makeClient();
    await expect(client.close()).resolves.toBeUndefined();
  });
});
