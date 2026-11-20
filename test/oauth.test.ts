/** OAuth2 client-credentials cache, single-flight and proactive refresh. */

import { afterEach, describe, expect, it, vi } from "vitest";
import { PixAuthError } from "../src/client/errors.js";
import { noopLogger } from "../src/client/logger.js";
import { OAuthTokenProvider, type OAuthProviderConfig } from "../src/client/oauth.js";
import type { HttpFetch, HttpFetchInit, HttpResponseLike } from "../src/client/types.js";

function response(
  status: number,
  text: string,
  headers: Record<string, string> = {},
): HttpResponseLike {
  return {
    status,
    headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
    text: () => Promise.resolve(text),
  };
}

function tokenBody(token: string, expiresIn = 3600): string {
  return JSON.stringify({ access_token: token, token_type: "Bearer", expires_in: expiresIn });
}

function makeProvider(
  fetch: HttpFetch,
  overrides: Partial<
    Omit<
      OAuthProviderConfig,
      "fetch" | "logger" | "tokenUrl" | "clientId" | "clientSecret" | "scopes"
    >
  > = {},
): OAuthTokenProvider {
  return new OAuthTokenProvider({
    fetch,
    logger: noopLogger,
    tokenUrl: "https://psp.example/oauth/token",
    clientId: "client",
    clientSecret: "secret",
    scopes: ["cob.read", "pix.read"],
    refreshSkewMs: 30_000,
    timeoutMs: 1000,
    ...overrides,
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("OAuthTokenProvider", () => {
  it("sends Basic auth, grant_type and scopes, then caches the token", async () => {
    const seen: HttpFetchInit[] = [];
    const fetch: HttpFetch = (_url, init) => {
      seen.push(init);
      return Promise.resolve(response(200, tokenBody("token-1")));
    };
    const provider = makeProvider(fetch);

    expect(await provider.getToken()).toBe("token-1");
    expect(await provider.getToken()).toBe("token-1");
    expect(seen).toHaveLength(1);
    expect(seen[0]?.method).toBe("POST");
    expect(seen[0]?.headers["authorization"]).toBe(
      `Basic ${Buffer.from("client:secret").toString("base64")}`,
    );
    expect(seen[0]?.headers["content-type"]).toBe("application/x-www-form-urlencoded");
    expect(seen[0]?.body).toBe("grant_type=client_credentials&scope=cob.read+pix.read");
    expect(provider.cachedToken).toBe("token-1");
  });

  it("does not send a scope parameter when no scopes are configured", async () => {
    let body = "";
    const fetch: HttpFetch = (_url, init) => {
      body = init.body ?? "";
      return Promise.resolve(response(200, tokenBody("token")));
    };
    const provider = new OAuthTokenProvider({
      fetch,
      logger: noopLogger,
      tokenUrl: "https://psp.example/oauth/token",
      clientId: "client",
      clientSecret: "secret",
      scopes: [],
      refreshSkewMs: 0,
      timeoutMs: 1000,
    });
    await provider.getToken();
    expect(body).toBe("grant_type=client_credentials");
  });

  it("single-flights concurrent refreshes", async () => {
    let counter = 0;
    const fetch: HttpFetch = async () => {
      counter += 1;
      await Promise.resolve();
      return response(200, tokenBody(`token-${String(counter)}`));
    };
    const provider = makeProvider(fetch);

    const results = await Promise.all(Array.from({ length: 12 }, () => provider.getToken()));
    expect(results).toEqual(Array.from({ length: 12 }, () => "token-1"));
    expect(counter).toBe(1);
  });

  it("refreshes proactively before expiry using the injected clock", async () => {
    let now = 1_000_000;
    let counter = 0;
    const fetch: HttpFetch = () => {
      counter += 1;
      return Promise.resolve(response(200, tokenBody(`token-${String(counter)}`, 60)));
    };
    const provider = makeProvider(fetch, { clock: () => now });

    expect(await provider.getToken()).toBe("token-1");
    now += 29_000;
    expect(await provider.getToken()).toBe("token-1");
    now += 2_000;
    expect(await provider.getToken()).toBe("token-2");
    expect(counter).toBe(2);
  });

  it("drops a failed in-flight refresh so the next call can retry", async () => {
    let counter = 0;
    const fetch: HttpFetch = () => {
      counter += 1;
      return Promise.resolve(
        counter === 1 ? response(401, "denied") : response(200, tokenBody("token-ok")),
      );
    };
    const provider = makeProvider(fetch);

    await expect(provider.getToken()).rejects.toBeInstanceOf(PixAuthError);
    expect(await provider.getToken()).toBe("token-ok");
    expect(counter).toBe(2);
  });

  it("invalidates the cached token", async () => {
    let counter = 0;
    const fetch: HttpFetch = () => {
      counter += 1;
      return Promise.resolve(response(200, tokenBody(`token-${String(counter)}`)));
    };
    const provider = makeProvider(fetch);
    await provider.getToken();
    provider.invalidate();
    expect(provider.cachedToken).toBeUndefined();
    expect(await provider.getToken()).toBe("token-2");
  });

  it.each([
    ["invalid JSON", "not-json"],
    ["non-object payload", "[]"],
    ["missing access_token", "{}"],
    ["empty access_token", '{"access_token":""}'],
    ["invalid expires_in", '{"access_token":"x","expires_in":0}'],
  ])("rejects a token response with %s", async (_label, text) => {
    const fetch: HttpFetch = () => Promise.resolve(response(200, text));
    await expect(makeProvider(fetch).getToken()).rejects.toBeInstanceOf(PixAuthError);
  });

  it("reports a non-2xx token endpoint status", async () => {
    const fetch: HttpFetch = () => Promise.resolve(response(401, "invalid_client"));
    await expect(makeProvider(fetch).getToken()).rejects.toMatchObject({ status: 401 });
  });

  it("wraps transport failures in PixAuthError", async () => {
    const cause = new Error("connection refused");
    const fetch: HttpFetch = () => Promise.reject(cause);
    await expect(makeProvider(fetch).getToken()).rejects.toMatchObject({ cause });
  });

  it("propagates a caller abort without wrapping", async () => {
    const fetch: HttpFetch = (_url, init) =>
      init.signal.aborted
        ? Promise.reject(new Error("aborted by caller"))
        : Promise.resolve(response(200, tokenBody("token")));
    const controller = new AbortController();
    controller.abort();
    await expect(makeProvider(fetch).getToken(controller.signal)).rejects.toThrow(
      "aborted by caller",
    );
  });

  it("times out a stalled token endpoint", async () => {
    vi.useFakeTimers();
    const fetch: HttpFetch = (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(new Error("aborted")));
      });
    const provider = makeProvider(fetch, { timeoutMs: 500 });

    const pending = provider.getToken();
    const assertion = expect(pending).rejects.toMatchObject({ name: "PixAuthError" });
    await vi.advanceTimersByTimeAsync(600);
    await assertion;
  });
});
