/** OAuth2 client-credentials token provider with cache and single-flight. */

import { PixAuthError } from "./errors.js";
import type { ResolvedLogger } from "./logger.js";
import { withTimeout } from "./signal.js";
import { sendRequest, type TransportConfig } from "./transport.js";

export interface OAuthProviderConfig extends TransportConfig {
  readonly tokenUrl: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly scopes: readonly string[];
  readonly refreshSkewMs: number;
  readonly timeoutMs: number;
  readonly logger: ResolvedLogger;
  /** Injectable clock for deterministic expiry tests. Defaults to `Date.now`. */
  readonly clock?: () => number;
}

interface CachedToken {
  readonly token: string;
  /** Absolute time (ms) at which the token becomes stale. */
  readonly expiresAt: number;
}

/**
 * Acquires access tokens through the client-credentials grant. Tokens are
 * cached and proactively refreshed before expiry; concurrent callers share a
 * single in-flight refresh ("single-flight") so a token endpoint is never
 * stampeded.
 */
export class OAuthTokenProvider {
  private cached: CachedToken | undefined;
  private inFlight: Promise<string> | undefined;
  private readonly now: () => number;

  constructor(private readonly config: OAuthProviderConfig) {
    this.now = config.clock ?? Date.now;
  }

  /** Current cached token, if present (telemetry/testing aid). */
  get cachedToken(): string | undefined {
    return this.cached?.token;
  }

  /** Drops the cached token. The next `getToken` performs a refresh. */
  invalidate(): void {
    this.cached = undefined;
  }

  /** Returns a valid access token, refreshing it when needed. */
  async getToken(signal?: AbortSignal): Promise<string> {
    const cached = this.cached;
    if (cached !== undefined && this.now() < cached.expiresAt) return cached.token;

    if (this.inFlight !== undefined) return this.inFlight;

    const flight = this.refresh(signal);
    this.inFlight = flight;
    const settle = (): void => {
      if (this.inFlight === flight) this.inFlight = undefined;
    };
    flight.then(settle, settle);
    return flight;
  }

  private async refresh(signal: AbortSignal | undefined): Promise<string> {
    const { tokenUrl, clientId, clientSecret, scopes, timeoutMs, logger } = this.config;
    const body = new URLSearchParams({ grant_type: "client_credentials" });
    if (scopes.length > 0) body.set("scope", scopes.join(" "));

    const basic = Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64");
    const headers: Record<string, string> = {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${basic}`,
    };

    logger.debug("oauth token refresh started", { tokenUrl, scopeCount: scopes.length });
    const handle = withTimeout(signal, timeoutMs);
    let response;
    try {
      response = await sendRequest(
        tokenUrl,
        { method: "POST", headers, body: body.toString(), signal: handle.signal },
        {
          ...(this.config.fetch === undefined ? {} : { fetch: this.config.fetch }),
          ...(this.config.dispatcher === undefined ? {} : { dispatcher: this.config.dispatcher }),
        },
      );
    } catch (cause) {
      if (handle.timedOut()) {
        throw new PixAuthError(`Token endpoint timed out after ${String(timeoutMs)}ms`, tokenUrl, {
          cause,
        });
      }
      if (signal?.aborted === true) throw cause;
      throw new PixAuthError(`Token request failed: ${errorMessage(cause)}`, tokenUrl, { cause });
    } finally {
      handle.clear();
    }

    if (response.status < 200 || response.status >= 300) {
      throw new PixAuthError(
        `Token endpoint returned HTTP ${String(response.status)}: ${response.text.slice(0, 256)}`,
        tokenUrl,
        { status: response.status },
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(response.text);
    } catch (cause) {
      throw new PixAuthError("Token endpoint returned invalid JSON", tokenUrl, { cause });
    }
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      throw new PixAuthError("Token endpoint returned a non-object payload", tokenUrl);
    }

    const record = payload as Record<string, unknown>;
    const token = record["access_token"];
    const expiresIn = record["expires_in"];
    if (typeof token !== "string" || token === "") {
      throw new PixAuthError("Token response is missing a non-empty access_token", tokenUrl);
    }
    if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn) || expiresIn <= 0) {
      throw new PixAuthError("Token response has an invalid expires_in", tokenUrl);
    }

    const lifetime = Math.max(0, expiresIn * 1000 - this.config.refreshSkewMs);
    this.cached = { token, expiresAt: this.now() + lifetime };
    logger.info("oauth token acquired", {
      tokenUrl,
      expiresIn,
      proactiveRefreshMs: this.config.refreshSkewMs,
    });
    return token;
  }
}

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
