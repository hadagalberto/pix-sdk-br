/**
 * Independent-review regression: a 401 from the API must invalidate the cached
 * OAuth token and retry exactly once with a freshly acquired token.
 *
 * Hand-derived expectation: the mock token endpoint numbers tokens
 * monotonically, so the first API call uses mock-access-token-1, the retry
 * after invalidation must use mock-access-token-2, and no third call happens.
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import { PixApiError } from "../src/client/errors.js";
import { requestBodyExamples } from "../src/generated/examples.js";
import { generateTxid } from "../src/txid.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
let client: PixClient;

const cobBody = requestBodyExamples["CobBody"]?.[0] as never;

beforeAll(async () => {
  server = await startMockServer();
});

afterEach(async () => {
  await client.close();
  server.reset();
});

afterAll(async () => {
  await server.close();
});

function makeClient(): PixClient {
  return new PixClient({
    baseUrl: server.baseUrl,
    clientId: "mock-client",
    clientSecret: "mock-secret",
    certificate: {
      cert: server.certificates.clientCertPem,
      key: server.certificates.clientKeyPem,
      ca: server.certificates.caCertPem,
    },
    retry: false,
  });
}

describe("401 token refresh (independent review)", () => {
  it("invalidates the cached token and retries once with a fresh token", async () => {
    client = makeClient();
    const txid = generateTxid();
    await client.cob.createWithTxid(txid, cobBody);
    expect(await client.auth.getToken()).toBe("mock-access-token-1");

    server.faults.enqueueApiFault({ status: 401 });
    const created = await client.cob.get(txid);
    expect(created.txid).toBe(txid);

    const reads = server.requests.filter(
      (entry) => entry.method === "GET" && entry.path === `/cob/${txid}`,
    );
    expect(reads).toHaveLength(2);
    expect(reads[0]?.authorization).toBe("Bearer mock-access-token-1");
    expect(reads[1]?.authorization).toBe("Bearer mock-access-token-2");
    expect(server.requests.filter((entry) => entry.path === "/oauth/token")).toHaveLength(2);
  });

  it("does not loop when the fresh token is rejected too", async () => {
    client = makeClient();
    const txid = generateTxid();
    await client.cob.createWithTxid(txid, cobBody);
    server.faults.enqueueApiFault({ status: 401 });
    server.faults.enqueueApiFault({ status: 401 });

    await expect(client.cob.get(txid)).rejects.toBeInstanceOf(PixApiError);
    expect(
      server.requests.filter((entry) => entry.method === "GET" && entry.path === `/cob/${txid}`),
    ).toHaveLength(2);
    expect(server.requests.filter((entry) => entry.path === "/oauth/token")).toHaveLength(2);
  });
});
