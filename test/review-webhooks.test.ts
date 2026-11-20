/**
 * Independent-review regression for webhook authentication:
 *  - an optional `authorize(req)` hook must gate delivery,
 *  - the mTLS helper must check `req.socket.authorized`,
 *  - validation details must not be echoed in 422 to unauthenticated callers.
 *
 * Hand-derived expectations: a caller that fails authorization must receive
 * 401 and must never reach `onWebhook`; a valid payload reaches `onWebhook`
 * only after an allow decision.
 */

import { describe, expect, it, vi } from "vitest";
import { handleWebhookRequest, isMtlsAuthorized } from "../src/webhooks/http.js";
import { specExamples } from "../src/generated/examples.js";

const rawPix = specExamples["pixWebhook1"] as Record<string, unknown>;
const validPix = { ...rawPix, devolucoes: [rawPix["devolucoes"]] };
const pixBody = JSON.stringify({ pix: [validPix] });

const authorizedRequest = { socket: { authorized: true, authorizationError: null } };
const anonymousRequest = { socket: { authorized: false } };

describe("webhook authorize hook (independent review)", () => {
  it("returns 401 and skips onWebhook when authorize denies the request", async () => {
    const onWebhook = vi.fn();
    const authorize = vi.fn(() => false);
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: pixBody,
      request: anonymousRequest,
      options: { onWebhook, authorize },
    });

    expect(outcome.status).toBe(401);
    expect(outcome.body).toEqual({ error: "unauthorized" });
    expect(outcome.parsed).toBeUndefined();
    expect(onWebhook).not.toHaveBeenCalled();
    expect(authorize).toHaveBeenCalledWith(anonymousRequest, expect.any(Object));
  });

  it("invokes onWebhook when authorize allows the request", async () => {
    const onWebhook = vi.fn();
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: pixBody,
      request: authorizedRequest,
      options: { onWebhook, authorize: () => true },
    });

    expect(outcome.status).toBe(200);
    expect(onWebhook).toHaveBeenCalledTimes(1);
  });

  it("fails closed when authorize is configured but no request was supplied", async () => {
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: pixBody,
      options: { onWebhook: vi.fn(), authorize: () => true },
    });
    expect(outcome.status).toBe(401);
  });

  it("omits 422 validation details by default and includes them for authorized callers", async () => {
    const anonymous = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: "{broken",
      options: { onWebhook: vi.fn() },
    });
    expect(anonymous.status).toBe(422);
    expect(anonymous.body).toEqual({ error: "invalid webhook payload" });
    expect("issues" in anonymous.body).toBe(false);

    const authenticated = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: "{broken",
      request: authorizedRequest,
      options: { onWebhook: vi.fn(), authorize: () => true },
    });
    expect(authenticated.status).toBe(422);
    expect(Array.isArray((authenticated.body as { issues?: unknown }).issues)).toBe(true);
  });

  it("isMtlsAuthorized checks the Node TLS socket state", () => {
    expect(isMtlsAuthorized(authorizedRequest)).toBe(true);
    expect(isMtlsAuthorized(anonymousRequest)).toBe(false);
    expect(isMtlsAuthorized({ socket: {} })).toBe(false);
    expect(isMtlsAuthorized(undefined)).toBe(false);
  });

  it("does not grant access when an authorized TLS socket has an authorization error", () => {
    expect(
      isMtlsAuthorized({ socket: { authorized: true, authorizationError: Error("bad cert") } }),
    ).toBe(false);
  });
});
