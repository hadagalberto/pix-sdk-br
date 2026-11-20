/** Retry policy: idempotency, backoff with jitter, `Retry-After`, sleeping. */

import { PixAbortError } from "./errors.js";
import type { RetryOptions } from "./types.js";

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  readonly jitter: number;
  readonly retryAfterCapMs: number;
  readonly random: () => number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 250,
  maxDelayMs: 10_000,
  jitter: 0.5,
  retryAfterCapMs: 60_000,
  random: Math.random,
};

/** Resolves user options into a fully-populated policy, validating ranges. */
export function resolveRetryPolicy(
  options: RetryOptions | false | undefined,
): RetryPolicy | undefined {
  if (options === false) return undefined;
  if (options === undefined) return DEFAULT_RETRY_POLICY;

  const maxAttempts = options.maxAttempts ?? DEFAULT_RETRY_POLICY.maxAttempts;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_RETRY_POLICY.baseDelayMs;
  const maxDelayMs = options.maxDelayMs ?? DEFAULT_RETRY_POLICY.maxDelayMs;
  const jitter = options.jitter ?? DEFAULT_RETRY_POLICY.jitter;
  const retryAfterCapMs = options.retryAfterCapMs ?? DEFAULT_RETRY_POLICY.retryAfterCapMs;

  assertRange("maxAttempts", maxAttempts, 1, 100, true);
  assertRange("baseDelayMs", baseDelayMs, 0, 3_600_000, true);
  assertRange("maxDelayMs", maxDelayMs, 0, 3_600_000, true);
  assertRange("jitter", jitter, 0, 1, false);
  assertRange("retryAfterCapMs", retryAfterCapMs, 0, 86_400_000, true);
  if (maxDelayMs < baseDelayMs) {
    throw new RangeError("retry.maxDelayMs must be >= retry.baseDelayMs");
  }

  return {
    maxAttempts,
    baseDelayMs,
    maxDelayMs,
    jitter,
    retryAfterCapMs,
    random: options.random ?? Math.random,
  };
}

function assertRange(
  name: string,
  value: number,
  min: number,
  max: number,
  integer: boolean,
): void {
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  ) {
    throw new RangeError(
      `retry.${name} must be ${integer ? "an integer" : "a number"} in [${String(min)}, ${String(max)}]`,
    );
  }
}

/**
 * HTTP methods safe to replay. PUT is idempotent by definition and is how the
 * BCB API creates charges (`PUT /cob/{txid}`), so a replay cannot duplicate a
 * resource.
 */
export function isIdempotentMethod(method: string): boolean {
  switch (method.toUpperCase()) {
    case "GET":
    case "HEAD":
    case "PUT":
    case "DELETE":
    case "OPTIONS":
      return true;
    default:
      return false;
  }
}

/** Transport/HTTP statuses considered transient. */
export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || (status >= 500 && status <= 599);
}

/** Parses `Retry-After` as delta-seconds or an HTTP-date. Returns milliseconds. */
export function parseRetryAfter(
  header: string | null | undefined,
  nowMs: number,
): number | undefined {
  if (header === null || header === undefined) return undefined;
  const value = header.trim();
  if (value === "") return undefined;
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    return Number.isSafeInteger(seconds) ? seconds * 1000 : undefined;
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return undefined;
  return Math.max(0, timestamp - nowMs);
}

/**
 * Exponential backoff with bounded jitter: `delay = exp * (1 - j + j*r)` with
 * `r` drawn from the policy's random source. Jitter 0 gives pure exponential.
 */
export function backoffDelayMs(attempt: number, policy: RetryPolicy): number {
  const exponential = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** attempt);
  const random = policy.random();
  return Math.round(exponential * (1 - policy.jitter + policy.jitter * random));
}

/** Chooses the effective delay: a honoured `Retry-After` wins over backoff. */
export function retryDelayMs(
  attempt: number,
  policy: RetryPolicy,
  retryAfterMs: number | undefined,
): number {
  if (retryAfterMs === undefined) return backoffDelayMs(attempt, policy);
  return Math.min(policy.retryAfterCapMs, retryAfterMs);
}

/** Cancellable sleep used between attempts. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  if (signal?.aborted === true) return Promise.reject(new PixAbortError());

  return new Promise<void>((resolve, reject) => {
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(new PixAbortError());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
