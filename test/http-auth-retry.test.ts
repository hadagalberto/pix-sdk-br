/** Review regression: a 401 invalidates the cached token and retries once. */

import { describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import { PixApiError } from "../src/client/errors.js";
import type { HttpFetch, HttpFetchInit } from "../src/client/types.js";

const TXID = "a".repeat(30);

interface Harness {
  readonly fetch: HttpFetch;
  readonly apiAuth: string[];
  readonly tokenCalls: number;
}

function harness(apiStatus: (attempt: number) => number): Harness {
  const apiAuth: string[] = [];
  let tokenCalls = 0;
  const fetch: HttpFetch = (url, init: HttpFetchInit) => {
    if (url.endsWith("/oauth/token")) {
      tokenCalls += 1;
      return Promise.resolve({
        status: 200,
        headers: { get: () => "application/json" },
        text: () =>
          Promise.resolve(
            JSON.stringify({ access_token: `token-${String(tokenCalls)}`, expires_in: 3600 }),
          ),
      });
    }
    apiAuth.push(String(init.headers["authorization"]));
    const status = apiStatus(apiAuth.length);
    if (status !== 200) {
      return Promise.resolve({
        status,
        headers: { get: () => "application/problem+json" },
        text: () =>
          Promise.resolve(JSON.stringify({ type: "about:blank", title: "Unauthorized", status })),
      });
    }
    return Promise.resolve({
      status: 200,
      headers: { get: () => "application/json" },
      text: () => Promise.resolve(JSON.stringify({ txid: TXID })),
    });
  };
  return {
    fetch,
    apiAuth,
    get tokenCalls() {
      return tokenCalls;
    },
  };
}

function client(fetch: HttpFetch): PixClient {
  return new PixClient({
    baseUrl: "https://api.example/",
    clientId: "id",
    clientSecret: "secret",
    retry: false,
    fetch,
  });
}

describe("401 token invalidation", () => {
  it("gets a fresh token and retries the request exactly once", async () => {
    const h = harness((attempt) => (attempt === 1 ? 401 : 200));
    const sdk = client(h.fetch);
    const result = await sdk.cob.get(TXID);
    expect(result).toMatchObject({ txid: TXID });
    expect(h.apiAuth).toEqual(["Bearer token-1", "Bearer token-2"]);
    expect(h.tokenCalls).toBe(2);
    await sdk.close();
  });

  it("does not retry beyond one 401-refresh cycle", async () => {
    const h = harness(() => 401);
    const sdk = client(h.fetch);
    await expect(sdk.cob.get(TXID)).rejects.toBeInstanceOf(PixApiError);
    expect(h.apiAuth).toHaveLength(2);
    expect(h.tokenCalls).toBe(2);
    await sdk.close();
  });

  it("refreshes and retries a non-idempotent request too (401 means not processed)", async () => {
    const h = harness((attempt) => (attempt === 1 ? 401 : 200));
    const sdk = client(h.fetch);
    await sdk.cob.createWithTxid(TXID, {
      calendario: { expiracao: 3600 },
      chave: "key",
      valor: { original: "1.00" },
    });
    expect(h.apiAuth).toEqual(["Bearer token-1", "Bearer token-2"]);
    await sdk.close();
  });
});
