/** Retry policy behaviour with deterministic random sources and timers. */

import { describe, expect, it } from "vitest";
import {
  backoffDelayMs,
  DEFAULT_RETRY_POLICY,
  isIdempotentMethod,
  isRetryableStatus,
  parseRetryAfter,
  resolveRetryPolicy,
  retryDelayMs,
  sleep,
} from "../src/client/retry.js";
import { PixAbortError } from "../src/client/errors.js";

describe("resolveRetryPolicy", () => {
  it("returns the default policy (using Math.random) when unspecified", () => {
    expect(resolveRetryPolicy(undefined)).toBe(DEFAULT_RETRY_POLICY);
    expect(resolveRetryPolicy(undefined)?.random).toBe(Math.random);
  });

  it("disables retries when passed false", () => {
    expect(resolveRetryPolicy(false)).toBeUndefined();
  });

  it("merges overrides and validates ranges", () => {
    const random = () => 0.25;
    const policy = resolveRetryPolicy({
      maxAttempts: 5,
      baseDelayMs: 100,
      maxDelayMs: 1000,
      jitter: 0,
      retryAfterCapMs: 2000,
      random,
    });
    expect(policy).toEqual({
      maxAttempts: 5,
      baseDelayMs: 100,
      maxDelayMs: 1000,
      jitter: 0,
      retryAfterCapMs: 2000,
      random,
    });
  });

  it.each([
    [{ maxAttempts: 0 }, "maxAttempts"],
    [{ baseDelayMs: -1 }, "baseDelayMs"],
    [{ maxDelayMs: 1.5 }, "maxDelayMs"],
    [{ jitter: 2 }, "jitter"],
    [{ retryAfterCapMs: 1.5 }, "retryAfterCapMs"],
  ])("rejects invalid option %j", (options, field) => {
    expect(() => resolveRetryPolicy(options)).toThrow(new RegExp(`retry\\.${field}`));
  });

  it("rejects maxDelayMs below baseDelayMs", () => {
    expect(() => resolveRetryPolicy({ baseDelayMs: 1000, maxDelayMs: 10 })).toThrow(RangeError);
  });
});

describe("idempotency and retryable statuses", () => {
  it("treats GET/HEAD/PUT/DELETE/OPTIONS as idempotent", () => {
    for (const method of ["GET", "get", "HEAD", "PUT", "DELETE", "OPTIONS"]) {
      expect(isIdempotentMethod(method)).toBe(true);
    }
  });

  it("treats POST/PATCH as non-idempotent", () => {
    expect(isIdempotentMethod("POST")).toBe(false);
    expect(isIdempotentMethod("PATCH")).toBe(false);
    expect(isIdempotentMethod("something else")).toBe(false);
  });

  it("retries transient statuses only", () => {
    expect([408, 425, 429, 500, 503, 599].every(isRetryableStatus)).toBe(true);
    expect([200, 201, 400, 401, 403, 404, 422, 600].some(isRetryableStatus)).toBe(false);
  });
});

describe("Retry-After", () => {
  const now = Date.parse("2026-01-01T12:00:00Z");

  it("parses delta-seconds", () => {
    expect(parseRetryAfter("7", now)).toBe(7000);
    expect(parseRetryAfter(" 2 ", now)).toBe(2000);
  });

  it("parses HTTP-dates relative to now", () => {
    expect(parseRetryAfter("Wed, 01 Jan 2026 12:00:03 GMT", now)).toBe(3000);
    expect(parseRetryAfter("Wed, 01 Jan 2026 11:59:00 GMT", now)).toBe(0);
  });

  it("returns undefined for empty or malformed values", () => {
    expect(parseRetryAfter(null, now)).toBeUndefined();
    expect(parseRetryAfter(undefined, now)).toBeUndefined();
    expect(parseRetryAfter("", now)).toBeUndefined();
    expect(parseRetryAfter("not a date", now)).toBeUndefined();
  });
});

describe("backoff", () => {
  const policy = {
    ...DEFAULT_RETRY_POLICY,
    baseDelayMs: 100,
    maxDelayMs: 1000,
    jitter: 0,
    random: () => 0,
  };

  it("grows exponentially and caps at maxDelayMs", () => {
    expect(backoffDelayMs(0, policy)).toBe(100);
    expect(backoffDelayMs(1, policy)).toBe(200);
    expect(backoffDelayMs(2, policy)).toBe(400);
    expect(backoffDelayMs(10, policy)).toBe(1000);
  });

  it("applies jitter within the configured band", () => {
    const jittery = { ...policy, jitter: 0.5, random: () => 1 };
    expect(backoffDelayMs(1, jittery)).toBe(200);
    expect(backoffDelayMs(1, { ...jittery, random: () => 0 })).toBe(100);
  });

  it("prefers a capped Retry-After over backoff", () => {
    expect(retryDelayMs(2, policy, 50_000)).toBe(50_000);
    expect(retryDelayMs(2, policy, 1_000_000)).toBe(policy.retryAfterCapMs);
    expect(retryDelayMs(2, policy, undefined)).toBe(400);
  });
});

describe("sleep", () => {
  it("resolves after the delay", async () => {
    await expect(sleep(5)).resolves.toBeUndefined();
  });

  it("resolves immediately for non-positive delays", async () => {
    await expect(sleep(0)).resolves.toBeUndefined();
    await expect(sleep(-10)).resolves.toBeUndefined();
  });

  it("rejects with PixAbortError when aborted", async () => {
    const controller = new AbortController();
    const pending = sleep(10_000, controller.signal);
    controller.abort();
    await expect(pending).rejects.toBeInstanceOf(PixAbortError);
  });

  it("rejects immediately when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(sleep(10, controller.signal)).rejects.toBeInstanceOf(PixAbortError);
  });
});
