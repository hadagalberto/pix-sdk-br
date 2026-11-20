/**
 * Independent-review regressions for path-parameter validation.
 *
 * Hand-derived expectations (never produced by the library under test):
 *
 * 1. BCB "API Pix" OpenAPI 2.11.0-rc1 (pinned commit 3ebbd6a…):
 *    `components.schemas.PayloadLocationId` and `PayloadLocationRecId` are
 *    `type: integer, format: int64`. `/loc/{id}` and `/locrec/{id}` therefore
 *    identify a resource by the *decimal form of an int64 id*. The string
 *    `"1/../../x"` is not a decimal integer; it is a path-traversal attempt.
 *    Expected: PixValidationError, and ZERO HTTP requests sent.
 *
 * 2. Every path parameter occupies exactly ONE URL path segment (the template
 *    is `/loc/{id}`, `/cobr/{txid}/retentativa/{data}`, …). A value containing
 *    `/`, `\`, `?`, `#`, `%`, a control character, or the dot segments `.`/`..`
 *    can never be a valid single segment. Expected: PixValidationError for
 *    EVERY path parameter in the spec, before any bytes are written.
 *
 * The operation/path-parameter enumeration below is hand-written from the
 * spec's path templates; it is deliberately NOT derived from the resource
 * methods so a missing resource method cannot hide an unvalidated parameter.
 */

import { describe, expect, it, vi } from "vitest";
import { PixClient } from "../src/client/client.js";
import { PixValidationError } from "../src/client/errors.js";
import { OPERATIONS, validateGetLocIdPath } from "../src/generated/operations.js";
import type { HttpFetch, HttpResponseLike } from "../src/client/types.js";

const TRAVERSAL = "1/../../x";

/** Hand-written from the pinned OpenAPI path templates, grouped by param name. */
const DISTINCT_PATH_PARAMS: ReadonlySet<string> = new Set([
  "txid",
  "id",
  "e2eid",
  "idRec",
  "idSolicRec",
  "chave",
  "pixUrlAccessToken",
  "recUrlAccessToken",
  "data",
]);

const VALID_BY_PARAM: Readonly<Record<string, string>> = {
  txid: "a".repeat(30),
  id: "789",
  e2eid: "E".repeat(32),
  idRec: "R".repeat(29),
  idSolicRec: "S".repeat(29),
  chave: "12345678909",
  pixUrlAccessToken: "token",
  recUrlAccessToken: "token",
  data: "2026-01-01",
};

function makeClient(fetch: HttpFetch): PixClient {
  return new PixClient({
    baseUrl: "https://api.example",
    clientId: "id",
    clientSecret: "secret",
    fetch,
    retry: false,
  });
}

function recordingFetch(): Promise<HttpResponseLike> {
  return Promise.resolve({
    status: 200,
    headers: { get: () => "application/json" },
    text: () => Promise.resolve("{}"),
  });
}

describe("loc id path parameter (independent review)", () => {
  it("rejects client.loc.get('1/../../x') before sending any request", async () => {
    const fetch = vi.fn(recordingFetch);
    const client = makeClient(fetch);

    // Review finding: the old code sent GET .../loc/1%2F..%2F..%2Fx.
    await expect(client.loc.get(TRAVERSAL)).rejects.toThrow(PixValidationError);
    await expect(client.loc.get(TRAVERSAL)).rejects.toThrow(/id/);
    expect(fetch).not.toHaveBeenCalled();
    await client.close();
  });

  it("rejects the same traversal on every loc/locrec id operation", async () => {
    const fetch = vi.fn(recordingFetch);
    const client = makeClient(fetch);

    await expect(client.loc.deleteTxid(TRAVERSAL)).rejects.toThrow(PixValidationError);
    await expect(client.locrec.get(TRAVERSAL)).rejects.toThrow(PixValidationError);
    await expect(client.locrec.deleteIdRec(TRAVERSAL)).rejects.toThrow(PixValidationError);
    expect(fetch).not.toHaveBeenCalled();
    await client.close();
  });

  it("still sends a valid decimal int64 id unchanged", async () => {
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

    await client.loc.get(789);
    expect(urls).toEqual(["https://api.example/oauth/token", "https://api.example/loc/789"]);
    await client.close();
  });
});

describe("generated int64 path validator (hand-derived vectors)", () => {
  it("accepts decimal int64 ids", () => {
    for (const valid of ["0", "789", "9223372036854775807"]) {
      expect(validateGetLocIdPath({ id: valid }).ok, `expected ${valid} valid`).toBe(true);
    }
  });

  it("rejects non-integers, traversal and int64 overflow", () => {
    // int64 max = 2^63-1 = 9223372036854775807 (hand-derived, not from code).
    for (const invalid of [TRAVERSAL, "789.5", "abc", "", "9223372036854775808"]) {
      const result = validateGetLocIdPath({ id: invalid });
      expect(result.ok, `expected ${JSON.stringify(invalid)} invalid`).toBe(false);
    }
  });
});

describe("every path parameter in the spec is validated", () => {
  it("the hand-written parameter table covers every distinct spec path param", () => {
    const fromSpec = new Set<string>();
    for (const operation of Object.values(OPERATIONS)) {
      for (const param of operation.pathParams) fromSpec.add(param.name);
    }
    expect([...fromSpec].sort()).toEqual([...DISTINCT_PATH_PARAMS].sort());
  });

  for (const operation of Object.values(OPERATIONS)) {
    if (operation.pathParams.length === 0) continue;

    it(`${operation.name}: rejects '${TRAVERSAL}' in every path parameter`, async () => {
      const fetch = vi.fn(recordingFetch);
      const client = makeClient(fetch);
      const path: Record<string, string> = {};
      for (const param of operation.pathParams) {
        const valid = VALID_BY_PARAM[param.name];
        expect(valid, `missing hand-written vector for ${param.name}`).toBeDefined();
        path[param.name] = valid ?? "";
      }
      for (const param of operation.pathParams) {
        const attempt = { ...path, [param.name]: TRAVERSAL };
        await expect(
          client.request(operation.name, { path: attempt }),
          `${operation.name}.${param.name}`,
        ).rejects.toThrow(PixValidationError);
      }
      expect(fetch).not.toHaveBeenCalled();
      await client.close();
    });
  }
});
