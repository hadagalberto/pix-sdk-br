/** Review regression: payload.get fetches the REAL location URL, not baseUrl + token. */

import { describe, expect, it, vi } from "vitest";
import { PixClient } from "../src/client/client.js";
import type { HttpFetch, HttpFetchInit } from "../src/client/types.js";

function fetchSpy(text = "jws.value"): {
  readonly fetch: HttpFetch;
  readonly calls: { readonly url: string; readonly init: HttpFetchInit }[];
} {
  const calls: { url: string; init: HttpFetchInit }[] = [];
  const fetch: HttpFetch = (url, init) => {
    calls.push({ url, init });
    return Promise.resolve({
      status: 200,
      headers: { get: () => "application/jose" },
      text: () => Promise.resolve(text),
    });
  };
  return { fetch, calls };
}

function client(fetch: HttpFetch): PixClient {
  return new PixClient({
    baseUrl: "https://api.psp.example/v2/",
    clientId: "id",
    clientSecret: "secret",
    retry: false,
    fetch,
  });
}

describe("payload location URL fetching", () => {
  it("fetches the exact absolute location URL including host and path", async () => {
    const spy = fetchSpy();
    const sdk = client(spy.fetch);
    await sdk.payload.get("https://payload.psp.example/qr/v2/token-a", {
      allowedLocationHosts: ["payload.psp.example"],
    });
    expect(spy.calls).toHaveLength(1);
    // Before the fix this was https://api.psp.example/v2/token-a.
    expect(spy.calls[0]?.url).toBe("https://payload.psp.example/qr/v2/token-a");
    expect(spy.calls[0]?.init.method.toUpperCase()).toBe("GET");
    await sdk.close();
  });

  it("resolves a relative location against baseUrl and fetches that path", async () => {
    const spy = fetchSpy();
    const sdk = client(spy.fetch);
    await sdk.payload.get("/qr/v2/token-b");
    expect(spy.calls[0]?.url).toBe("https://api.psp.example/qr/v2/token-b");
    await sdk.close();
  });

  it("uses a spec operation only for a bare token", async () => {
    const spy = fetchSpy();
    const sdk = client(spy.fetch);
    await sdk.payload.get("bare-token");
    expect(spy.calls[0]?.url).toBe("https://api.psp.example/v2/bare-token");
    await sdk.close();
  });

  it("refuses a non-https location URL (SSRF hardening)", async () => {
    const spy = fetchSpy();
    const sdk = client(spy.fetch);
    await expect(sdk.payload.get("http://payload.psp.example/qr/v2/token")).rejects.toThrow(
      /https/,
    );
    expect(spy.calls).toHaveLength(0);
    await sdk.close();
  });

  it("does not follow a redirect to another host", async () => {
    const sdk = client(() =>
      Promise.resolve({
        status: 302,
        headers: {
          get: (name: string) =>
            name.toLowerCase() === "location" ? "https://evil.example/" : null,
        },
        text: () => Promise.resolve(""),
      }),
    );
    await expect(sdk.payload.get("https://payload.psp.example/qr/v2/token")).rejects.toThrow();
    await sdk.close();
  });

  it("verifies JWS against the host actually contacted", async () => {
    const { generateKeyPairSync, sign } = await import("node:crypto");
    const pki = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const header = Buffer.from(
      JSON.stringify({ alg: "RS256", jku: "https://api.psp.example/keys/jwks.json", kid: "k" }),
    ).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({ chave: "k", calendario: { expiracao: 60 } }),
    ).toString("base64url");
    const signature = sign(
      "sha256",
      Buffer.from(`${header}.${payload}`, "ascii"),
      pki.privateKey,
    ).toString("base64url");
    const jws = `${header}.${payload}.${signature}`;
    const jwk = {
      ...(pki.publicKey.export({ format: "jwk" }) as Record<string, unknown>),
      kid: "k",
      use: "sig",
    };
    const sdk = client(() =>
      Promise.resolve({
        status: 200,
        headers: { get: () => "application/jose" },
        text: () => Promise.resolve(jws),
      }),
    );
    const keyFetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ keys: [jwk] })),
      }),
    );
    // No extra host is trusted: the only valid key host is the host actually
    // contacted (payload.psp.example), not the client's baseUrl host.
    await expect(
      sdk.payload.fetchVerified("https://payload.psp.example/qr/v2/token", {
        allowedLocationHosts: ["payload.psp.example"],
        keyFetch,
        payloadSchema: false,
      }),
    ).rejects.toMatchObject({ code: "KEY_URL_HOST_MISMATCH" });
    await sdk.close();
  });
});
