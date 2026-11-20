/**
 * Independent-review regression: insecure transport configuration must produce
 * an explicit warning. Expected values are the literal unsafe settings passed
 * by the test (`http:` base URL, `rejectUnauthorized: false`), never derived
 * from the SDK.
 */

import { describe, expect, it, vi } from "vitest";
import { PixClient } from "../src/client/client.js";
import type { HttpFetch } from "../src/client/types.js";

const fetch: HttpFetch = () =>
  Promise.resolve({
    status: 200,
    headers: { get: () => "application/json" },
    text: () => Promise.resolve("{}"),
  });

describe("insecure configuration warnings (independent review)", () => {
  it("warns when baseUrl uses plain http", async () => {
    const warn = vi.fn();
    const client = new PixClient({
      baseUrl: "http://api.example",
      clientId: "id",
      clientSecret: "secret",
      fetch,
      logger: { warn },
    });
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/http/i), expect.any(Object));
    await client.close();
  });

  it("warns when TLS server verification is disabled", async () => {
    const warn = vi.fn();
    const client = new PixClient({
      baseUrl: "https://api.example",
      clientId: "id",
      clientSecret: "secret",
      certificate: {
        cert: "cert",
        key: "key",
        rejectUnauthorized: false,
      },
      fetch,
      logger: { warn },
    });
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/rejectUnauthorized|verification/i),
      expect.any(Object),
    );
    await client.close();
  });

  it("stays silent for a safe https configuration", async () => {
    const warn = vi.fn();
    const client = new PixClient({
      baseUrl: "https://api.example",
      clientId: "id",
      clientSecret: "secret",
      fetch,
      logger: { warn },
    });
    expect(warn).not.toHaveBeenCalled();
    await client.close();
  });
});
