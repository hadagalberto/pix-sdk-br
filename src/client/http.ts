/** HTTP request engine: mTLS transport, auth, retries, timeouts, errors. */

import { Agent, type Dispatcher } from "undici";
import { PixAbortError, PixApiError, PixNetworkError, parseProblem } from "./errors.js";
import type { ResolvedLogger } from "./logger.js";
import type { OAuthTokenProvider } from "./oauth.js";
import {
  isIdempotentMethod,
  isRetryableStatus,
  parseRetryAfter,
  retryDelayMs,
  sleep,
  type RetryPolicy,
} from "./retry.js";
import { withTimeout } from "./signal.js";
import { sendRequest, type TransportConfig, type TransportResponse } from "./transport.js";
import { isPfxCertificate, type ClientCertificate } from "./types.js";

export interface HttpClientConfig extends TransportConfig {
  readonly baseUrl: string;
  readonly tokenProvider: OAuthTokenProvider;
  readonly retryPolicy: RetryPolicy | undefined;
  readonly timeoutMs: number;
  readonly logger: ResolvedLogger;
  readonly userAgent: string;
  readonly ownsDispatcher: boolean;
}

export interface HttpRequestOptions {
  readonly method: string;
  /** Concrete path (path parameters already substituted), beginning with `/`. */
  readonly path: string;
  readonly operation: string;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly body?: unknown;
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
  /** Skip bearer authentication (used by endpoints outside the OAuth scope). */
  readonly skipAuth?: boolean;
  /** Parse a successful body as JSON (default) or return raw text. */
  readonly responseType?: "json" | "text";
}

type SendOutcome =
  | { readonly ok: true; readonly response: TransportResponse }
  | { readonly ok: false; readonly error: PixNetworkError | PixAbortError };

/**
 * Builds an undici dispatcher configured for mutual TLS. PFX and PEM material
 * are both supported; a CA may be supplied for server certificate verification.
 */
export function createMtlsDispatcher(certificate: ClientCertificate): Dispatcher {
  const connect: Record<string, unknown> = {
    rejectUnauthorized: certificate.rejectUnauthorized ?? true,
  };
  if (certificate.ca !== undefined) connect["ca"] = certificate.ca;
  if (certificate.servername !== undefined) connect["servername"] = certificate.servername;

  if (isPfxCertificate(certificate)) {
    connect["pfx"] = certificate.pfx;
    if (certificate.passphrase !== undefined) connect["passphrase"] = certificate.passphrase;
  } else {
    connect["cert"] = certificate.cert;
    connect["key"] = certificate.key;
  }
  return new Agent({ connect });
}

/** Executes API calls with retries and converts every failure to `PixError`. */
export class HttpClient {
  private readonly baseUrl: URL;
  private closed = false;

  constructor(private readonly config: HttpClientConfig) {
    const normalized = config.baseUrl.endsWith("/") ? config.baseUrl : `${config.baseUrl}/`;
    this.baseUrl = new URL(normalized);
  }

  /** Closes the internally created dispatcher, if any. Safe to call twice. */
  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    if (this.config.ownsDispatcher) await this.config.dispatcher?.close();
  }

  async request<T>(options: HttpRequestOptions): Promise<T> {
    const url = this.buildUrl(options);
    const headers = await this.buildHeaders(options);
    const body = options.body === undefined ? undefined : JSON.stringify(options.body);
    if (body !== undefined) headers["content-type"] = "application/json";

    const policy = this.config.retryPolicy;
    const idempotent = isIdempotentMethod(options.method);
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs;
    let attempt = 0;

    for (;;) {
      const outcome = await this.sendOnce(
        url,
        options.method,
        headers,
        body,
        options.signal,
        timeoutMs,
      );
      const context = {
        method: options.method,
        path: options.path,
        operation: options.operation,
      };

      if (outcome.ok) {
        const response = outcome.response;
        if (response.status >= 200 && response.status < 300) {
          return this.parseSuccess(response, context, options.responseType) as T;
        }

        const retryAfterMs = parseRetryAfter(response.headers["retry-after"], Date.now());
        const error = new PixApiError(
          parseProblem(response.text, response.status, response.headers["content-type"]),
          { ...context, status: response.status, headers: response.headers },
          { ...(retryAfterMs === undefined ? {} : { retryAfterMs }) },
        );
        if (
          policy !== undefined &&
          idempotent &&
          isRetryableStatus(response.status) &&
          attempt + 1 < policy.maxAttempts
        ) {
          await this.backoff(attempt, policy, retryAfterMs, options, response.status, error);
          attempt += 1;
          continue;
        }
        throw error;
      }

      const error = outcome.error;
      if (error instanceof PixAbortError) throw error;
      if (policy !== undefined && idempotent && attempt + 1 < policy.maxAttempts) {
        await this.backoff(attempt, policy, undefined, options, undefined, error);
        attempt += 1;
        continue;
      }
      throw error;
    }
  }

  private buildUrl(options: HttpRequestOptions): URL {
    const path = options.path.startsWith("/") ? options.path.slice(1) : options.path;
    const url = new URL(path, this.baseUrl);
    if (options.query !== undefined) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined) continue;
        url.searchParams.append(key, String(value));
      }
    }
    return url;
  }

  private async buildHeaders(options: HttpRequestOptions): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      accept: "application/json",
      "user-agent": this.config.userAgent,
    };
    if (!options.skipAuth) {
      const token = await this.config.tokenProvider.getToken(options.signal);
      headers["authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async sendOnce(
    url: URL,
    method: string,
    headers: Readonly<Record<string, string>>,
    body: string | undefined,
    callerSignal: AbortSignal | undefined,
    timeoutMs: number,
  ): Promise<SendOutcome> {
    const handle = withTimeout(callerSignal, timeoutMs);
    try {
      const response = await sendRequest(
        url.toString(),
        {
          method,
          headers,
          ...(body === undefined ? {} : { body }),
          signal: handle.signal,
          ...(this.config.dispatcher === undefined ? {} : { dispatcher: this.config.dispatcher }),
        },
        {
          ...(this.config.fetch === undefined ? {} : { fetch: this.config.fetch }),
          ...(this.config.dispatcher === undefined ? {} : { dispatcher: this.config.dispatcher }),
        },
      );
      return { ok: true, response };
    } catch (cause) {
      if (handle.timedOut()) {
        return {
          ok: false,
          error: new PixNetworkError(`Request timed out after ${String(timeoutMs)}ms`, {
            code: "ETIMEDOUT",
            timeout: true,
            cause,
          }),
        };
      }
      if (callerSignal?.aborted === true) {
        return { ok: false, error: new PixAbortError("Request aborted", { cause }) };
      }
      return {
        ok: false,
        error: new PixNetworkError(`Network request failed: ${errorMessage(cause)}`, { cause }),
      };
    } finally {
      handle.clear();
    }
  }

  private parseSuccess(
    response: TransportResponse,
    context: { method: string; path: string; operation: string },
    responseType: "json" | "text" | undefined,
  ): unknown {
    const text = response.text.trim();
    if (text === "") return undefined;
    if (responseType === "text") return text;
    try {
      return JSON.parse(text) as unknown;
    } catch (cause) {
      throw new PixApiError(
        parseProblem(text, response.status, response.headers["content-type"]),
        { ...context, status: response.status, headers: response.headers },
        { cause },
      );
    }
  }

  private async backoff(
    attempt: number,
    policy: RetryPolicy,
    retryAfterMs: number | undefined,
    options: HttpRequestOptions,
    status: number | undefined,
    error: PixNetworkError | PixApiError,
  ): Promise<void> {
    const delayMs = retryDelayMs(attempt, policy, retryAfterMs);
    this.config.logger.warn("retrying idempotent request", {
      operation: options.operation,
      method: options.method,
      attempt: attempt + 1,
      maxAttempts: policy.maxAttempts,
      delayMs,
      status,
      reason: error.name,
    });
    await sleep(delayMs, options.signal);
  }
}

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
