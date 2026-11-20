/**
 * Independent-review regression: the shared token refresh must not be bound
 * to the first caller's AbortSignal.
 *
 * Expected value is hand-derived from the single-flight contract already
 * documented in SPEC.md ("single-flight refresh under concurrency"): N
 * concurrent callers cause exactly ONE token request and all surviving callers
 * receive the token returned by that request. One caller aborting only stops
 * that caller's wait — it must not abort the shared request.
 */

import { describe, expect, it } from "vitest";
import { PixAbortError } from "../src/client/errors.js";
import { noopLogger } from "../src/client/logger.js";
import { OAuthTokenProvider, type OAuthProviderConfig } from "../src/client/oauth.js";
import type { HttpFetch, HttpResponseLike } from "../src/client/types.js";

function response(status: number, text: string): HttpResponseLike {
  return {
    status,
    headers: { get: () => "application/json" },
    text: () => Promise.resolve(text),
  };
}

function makeProvider(fetch: HttpFetch): OAuthTokenProvider {
  const config: Omit<OAuthProviderConfig, "fetch" | "logger"> = {
    tokenUrl: "https://psp.example/oauth/token",
    clientId: "client",
    clientSecret: "secret",
    scopes: [],
    refreshSkewMs: 30_000,
    timeoutMs: 10_000,
  };
  return new OAuthTokenProvider({ ...config, fetch, logger: noopLogger });
}

describe("OAuth single-flight abort isolation (independent review)", () => {
  it("keeps the shared refresh alive when one of concurrent callers aborts", async () => {
    let tokenRequests = 0;
    let sharedSignal: AbortSignal | undefined;
    let complete: (() => void) | undefined;
    const fetch: HttpFetch = (_url, init) => {
      tokenRequests += 1;
      sharedSignal = init.signal;
      return new Promise<HttpResponseLike>((resolve) => {
        complete = () =>
          resolve(
            response(
              200,
              JSON.stringify({ access_token: "token-from-single-flight", expires_in: 3600 }),
            ),
          );
      });
    };
    const provider = makeProvider(fetch);
    const controller = new AbortController();

    const aborted = provider.getToken(controller.signal);
    const survivor = provider.getToken();
    controller.abort();
    await expect(aborted).rejects.toBeInstanceOf(PixAbortError);

    // Hand-derived expectations: one HTTP call, its signal still live, and the
    // surviving caller receives exactly the token that call returned.
    expect(tokenRequests).toBe(1);
    expect(sharedSignal?.aborted).toBe(false);
    complete?.();
    expect(await survivor).toBe("token-from-single-flight");
  });
});
