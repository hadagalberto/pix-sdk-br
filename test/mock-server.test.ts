/** Mock server: real mTLS, OAuth endpoint, state and fault injection. */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Agent, request as undiciRequest } from "undici";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
let agent: Agent;

beforeAll(async () => {
  server = await startMockServer({ tokenExpiresIn: 60 });
  agent = new Agent({
    connect: {
      cert: server.certificates.clientCertPem,
      key: server.certificates.clientKeyPem,
      ca: server.certificates.caCertPem,
    },
  });
});

afterAll(async () => {
  await agent.close();
  await server.close();
});

function tokenRequest(): Promise<Awaited<ReturnType<typeof undiciRequest>>> {
  const authorization = `Basic ${Buffer.from("mock-client:mock-secret").toString("base64")}`;
  return undiciRequest(`${server.baseUrl}/oauth/token`, {
    method: "POST",
    dispatcher: agent,
    headers: {
      authorization,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=cob.read",
  });
}

describe("mock server PKI", () => {
  it("generates a CA, server and client certificate plus a loadable PFX", () => {
    expect(server.certificates.caCertPem).toContain("BEGIN CERTIFICATE");
    expect(server.certificates.serverKeyPem).toContain("PRIVATE KEY");
    expect(server.certificates.clientCertPem).toContain("BEGIN CERTIFICATE");
    expect(server.certificates.clientPfx.length).toBeGreaterThan(100);
    expect(server.certificates.pfxPassphrase.length).toBeGreaterThan(0);
  });

  it("rejects a TLS client without a certificate", async () => {
    await expect(undiciRequest(`${server.baseUrl}/cob`, { method: "GET" })).rejects.toThrow();
  });

  it("accepts the generated client certificate", async () => {
    const response = await undiciRequest(`${server.baseUrl}/oauth/token`, {
      method: "GET",
      dispatcher: agent,
    });
    expect(response.statusCode).toBe(405);
    await response.body.text();
  });
});

describe("OAuth endpoint", () => {
  it("issues a bearer token for valid client credentials", async () => {
    const response = await tokenRequest();
    const body = await response.body.text();
    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(body) as Record<string, unknown>;
    expect(payload["token_type"]).toBe("Bearer");
    expect(payload["expires_in"]).toBe(60);
    expect(payload["scope"]).toBe("cob.read");
    expect(String(payload["access_token"])).toMatch(/^mock-access-token-\d+$/);
  });

  it("rejects invalid credentials and an unsupported grant type", async () => {
    const badCredentials = await undiciRequest(`${server.baseUrl}/oauth/token`, {
      method: "POST",
      dispatcher: agent,
      headers: {
        authorization: "Basic wrong",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    expect(badCredentials.statusCode).toBe(401);
    await badCredentials.body.text();

    const badGrant = await undiciRequest(`${server.baseUrl}/oauth/token`, {
      method: "POST",
      dispatcher: agent,
      headers: {
        authorization: `Basic ${Buffer.from("mock-client:mock-secret").toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=password",
    });
    expect(badGrant.statusCode).toBe(400);
    await badGrant.body.text();
  });
});

describe("API routes and faults", () => {
  it("requires a bearer token on API routes", async () => {
    const response = await undiciRequest(`${server.baseUrl}/cob`, {
      method: "GET",
      dispatcher: agent,
    });
    expect(response.statusCode).toBe(401);
    const problem = JSON.parse(await response.body.text()) as Record<string, unknown>;
    expect(problem["type"]).toBe("about:blank");
    expect(problem["title"]).toBe("Unauthorized");
  });

  it("injects a 429 with Retry-After and consumes it once", async () => {
    server.faults.enqueueApiFault({ status: 429, retryAfterSeconds: 2 });
    const headers = { authorization: "Bearer mock-token" };
    const first = await undiciRequest(`${server.baseUrl}/cob`, {
      method: "GET",
      dispatcher: agent,
      headers,
    });
    expect(first.statusCode).toBe(429);
    expect(first.headers["retry-after"]).toBe("2");
    await first.body.text();

    const second = await undiciRequest(`${server.baseUrl}/cob`, {
      method: "GET",
      dispatcher: agent,
      headers,
    });
    expect(second.statusCode).toBe(200);
    await second.body.text();
  });

  it("injects token-endpoint faults", async () => {
    server.faults.enqueueTokenFault(503);
    const response = await tokenRequest();
    expect(response.statusCode).toBe(503);
    await response.body.text();
  });

  it("returns 404 for an unknown path and records requests", async () => {
    const before = server.requests.length;
    const response = await undiciRequest(`${server.baseUrl}/definitely/not-a-route`, {
      method: "GET",
      dispatcher: agent,
      headers: { authorization: "Bearer mock-token" },
    });
    expect(response.statusCode).toBe(404);
    await response.body.text();
    expect(server.requests.length).toBe(before + 1);
    expect(server.requests[before]?.path).toBe("/definitely/not-a-route");
  });

  it("reset clears state and faults", () => {
    server.faults.enqueueApiFault({ status: 503 });
    server.reset();
    expect(server.faults.nextApiFault()).toBeUndefined();
    expect(server.requests).toHaveLength(0);
  });
});
