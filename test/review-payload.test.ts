/**
 * Independent-review regression: payload.get(fullLocationUrl) must contact the
 * location URL itself (https only, same host restrictions as key URLs) instead
 * of fetching baseUrl + last path segment.
 *
 * Hand-derived expectations use the recorded fetch URLs — never a value
 * produced by the SDK.
 */

import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import type { JwsFetch } from "../src/payload/jws.js";
import { specExamples } from "../src/generated/examples.js";
import type { HttpFetch, HttpResponseLike } from "../src/client/types.js";

const LOCATION = "https://pay.psp.example/pix/token-abc";

function textResponse(text: string): HttpResponseLike {
  return {
    status: 200,
    headers: { get: () => "application/jose" },
    text: () => Promise.resolve(text),
  };
}

function recordingFetch(seen: string[], response: HttpResponseLike): HttpFetch {
  return (url) => {
    seen.push(url);
    return Promise.resolve(response);
  };
}

function makeClient(fetch: HttpFetch): PixClient {
  return new PixClient({
    baseUrl: "https://api.psp.example",
    clientId: "id",
    clientSecret: "secret",
    fetch,
    retry: false,
  });
}

describe("payload location URL fetching (independent review)", () => {
  it("fetches the actual absolute location URL, not baseUrl + last segment", async () => {
    const seen: string[] = [];
    const client = makeClient(recordingFetch(seen, textResponse("jws-from-location")));

    const jws = await client.payload.get(LOCATION, {
      allowedLocationHosts: ["pay.psp.example"],
    });

    expect(jws).toBe("jws-from-location");
    // The old implementation requested https://api.psp.example/token-abc.
    expect(seen).toEqual([LOCATION]);
    await client.close();
  });

  it("rejects a plain http location without fetching it", async () => {
    const seen: string[] = [];
    const client = makeClient(recordingFetch(seen, textResponse("unused")));

    await expect(client.payload.get("http://pay.psp.example/pix/token")).rejects.toThrow(/https/);
    expect(seen).toEqual([]);
    await client.close();
  });

  it("rejects a location URL carrying embedded credentials", async () => {
    // Credentials in a URL are a classic SSRF/confusion vector; the location
    // fetcher must refuse them before any request leaves the process.
    const seen: string[] = [];
    const client = makeClient(recordingFetch(seen, textResponse("unused")));

    await expect(client.payload.get("https://user:pass@pay.psp.example/pix/token")).rejects.toThrow(
      /credentials/,
    );
    expect(seen).toEqual([]);
    await client.close();
  });

  it("rejects a redirect to a different host", async () => {
    const seen: string[] = [];
    const client = makeClient(
      recordingFetch(seen, {
        status: 302,
        headers: { get: () => "https://evil.example/pix/token" },
        text: () => Promise.resolve(""),
      }),
    );

    await expect(client.payload.get(LOCATION)).rejects.toThrow();
    expect(seen).toEqual([LOCATION]);
    await client.close();
  });

  it("verifies a JWS fetched from an absolute location against that host", async () => {
    // Derivation: the key URL host is pay.psp.example (the contacted location
    // host), NOT api.psp.example (the API base host). Verification must accept
    // it because the location is the host anchor.
    const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const encode = (value: unknown): string =>
      Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
    const header = encode({
      alg: "RS256",
      jku: "https://pay.psp.example/keys/jwks.json",
      kid: "k1",
    });
    const body = encode(specExamples["cobPayload1"]);
    const signingInput = `${header}.${body}`;
    const signature = sign("sha256", Buffer.from(signingInput, "ascii"), keys.privateKey).toString(
      "base64url",
    );
    const jws = `${signingInput}.${signature}`;
    const jwk = {
      ...(keys.publicKey.export({ format: "jwk" }) as Record<string, unknown>),
      kid: "k1",
      use: "sig",
    };

    const client = makeClient(recordingFetch([], textResponse(jws)));
    const keyFetch: JwsFetch = (url) =>
      Promise.resolve({
        status: url.includes("pay.psp.example") ? 200 : 404,
        text: () => Promise.resolve(JSON.stringify({ keys: [jwk] })),
      });

    const verified = await client.payload.fetchVerified(LOCATION, {
      allowedLocationHosts: ["pay.psp.example"],
      keyFetch,
    });
    expect(verified.payloadKind).toBe("cob");
    expect(verified.keySource.url).toBe("https://pay.psp.example/keys/jwks.json");
    await client.close();
  });
});
