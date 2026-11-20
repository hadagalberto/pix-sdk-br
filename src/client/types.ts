/** Public configuration types for `PixClient` and its layers. */

import type { Dispatcher } from "undici";
import type { PixLogger } from "./logger.js";

/** Bytes or UTF-8 text accepted for TLS material. */
export type TlsData = Buffer | string;

/** Trust anchors shared by PFX and PEM configurations. */
export interface TlsCommon {
  /** CA certificate(s) used to verify the PSP server certificate. */
  readonly ca?: TlsData | readonly TlsData[];
  /** Verify the server certificate. Defaults to `true`; never disable in production. */
  readonly rejectUnauthorized?: boolean;
  /** Server name to use for certificate hostname verification. */
  readonly servername?: string;
}

/** mTLS material supplied as a PKCS#12/PFX bundle. */
export interface PfxCertificate extends TlsCommon {
  readonly pfx: TlsData;
  readonly passphrase?: string;
}

/** mTLS material supplied as separate PEM certificate and private key. */
export interface PemCertificate extends TlsCommon {
  readonly cert: TlsData;
  readonly key: TlsData;
}

export type ClientCertificate = PfxCertificate | PemCertificate;

export function isPfxCertificate(certificate: ClientCertificate): certificate is PfxCertificate {
  return "pfx" in certificate;
}

/** Retry tuning. Every field is optional; see `DEFAULT_RETRY_POLICY`. */
export interface RetryOptions {
  /** Total number of attempts (including the first). Default 3. */
  readonly maxAttempts?: number;
  /** Base delay in milliseconds before the first retry. Default 250. */
  readonly baseDelayMs?: number;
  /** Upper bound for exponential backoff, in milliseconds. Default 10_000. */
  readonly maxDelayMs?: number;
  /** Jitter magnitude in [0, 1]. Default 0.5. */
  readonly jitter?: number;
  /** Upper bound for a honoured `Retry-After`, in milliseconds. Default 60_000. */
  readonly retryAfterCapMs?: number;
  /** Injectable source of randomness in [0, 1) — used by deterministic tests. */
  readonly random?: () => number;
}

/** OAuth2 client-credentials tuning. */
export interface OAuthOptions {
  /** Token endpoint. Defaults to `${baseUrl}/oauth/token`. */
  readonly tokenUrl?: string;
  /** Scopes requested via the `scope` parameter (space-separated). */
  readonly scopes?: readonly string[];
  /** Refresh this many milliseconds before the advertised expiry. Default 30_000. */
  readonly refreshSkewMs?: number;
}

/** Minimal response shape required from an injected `fetch` implementation. */
export interface HttpResponseLike {
  readonly status: number;
  readonly headers: { get(name: string): string | null };
  text(): Promise<string>;
}

/** Request init passed to an injected `fetch` implementation. */
export interface HttpFetchInit {
  readonly method: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly signal: AbortSignal;
  readonly dispatcher?: Dispatcher;
}

/**
 * Transport adapter. The global `fetch`, `undici.fetch`, or any compatible
 * implementation may be supplied. When omitted, `undici.request` is used so
 * mTLS can be configured through `certificate`.
 */
export type HttpFetch = (url: string, init: HttpFetchInit) => Promise<HttpResponseLike>;

/** Constructor options for `PixClient`. */
export interface PixClientOptions {
  /** PSP base URL, e.g. `https://pix.example.com`. */
  readonly baseUrl: string;
  /** OAuth2 client id. */
  readonly clientId: string;
  /** OAuth2 client secret. */
  readonly clientSecret: string;
  /** mTLS material for PFX or PEM. Omit only against non-mTLS test servers. */
  readonly certificate?: ClientCertificate;
  /** Default scopes requested at the token endpoint. */
  readonly scopes?: readonly string[];
  readonly oauth?: OAuthOptions;
  /** Custom fetch adapter (Bun/Deno/undici.fetch). */
  readonly fetch?: HttpFetch;
  /** Pre-built undici dispatcher (overrides `certificate` when both given). */
  readonly dispatcher?: Dispatcher;
  /** Retry policy, or `false` to disable retries entirely. */
  readonly retry?: RetryOptions | false;
  /** Default per-call timeout in milliseconds. Default 15_000. */
  readonly timeoutMs?: number;
  readonly logger?: PixLogger;
  /** `User-Agent` header value. */
  readonly userAgent?: string;
}
