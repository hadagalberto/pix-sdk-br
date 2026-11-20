/**
 * Independent-review regression: webhook.get() without a chave must not send
 * GET /webhook/. The spec's by-key operation is GET /webhook/{chave}; the
 * collection endpoint is only available through webhook.list().
 */

import { describe, expect, it, vi } from "vitest";
import { PixClient } from "../src/client/client.js";
import { PixValidationError } from "../src/client/errors.js";
import type { HttpFetch } from "../src/client/types.js";

function makeClient(fetch: HttpFetch): PixClient {
  return new PixClient({
    baseUrl: "https://api.example",
    clientId: "id",
    clientSecret: "secret",
    fetch,
    retry: false,
  });
}

describe("webhook.get path parameter (independent review)", () => {
  it("rejects a missing chave before sending a request", async () => {
    const fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        headers: { get: () => "application/json" },
        text: () => Promise.resolve("{}"),
      }),
    );
    const client = makeClient(fetch);

    expect(() => client.webhook.get()).toThrow(PixValidationError);
    expect(() => client.webhook.get()).toThrow(/chave/);
    expect(fetch).not.toHaveBeenCalled();
    await client.close();
  });

  it("still supports by-key and collection operations", async () => {
    const urls: string[] = [];
    const client = makeClient((url) => {
      urls.push(url);
      const text = url.includes("/oauth/token")
        ? JSON.stringify({ access_token: "token", expires_in: 3600 })
        : "{}";
      return Promise.resolve({
        status: 200,
        headers: { get: () => "application/json" },
        text: () => Promise.resolve(text),
      });
    });

    await client.webhook.get("12345678909");
    await client.webhookCob.get();
    expect(urls).toEqual([
      "https://api.example/oauth/token",
      "https://api.example/webhook/12345678909",
      "https://api.example/webhookcob",
    ]);
    await client.close();
  });
});
