/** `PixClient` — the public entry point wiring all layers together. */

import { OPERATIONS, paramValidators, type OperationInfo } from "../generated/operations.js";
import { requestBodyValidators } from "../generated/validators.js";
import type { Paginacao } from "../generated/schemas.js";
import { PixError, PixValidationError } from "./errors.js";
import { createMtlsDispatcher, HttpClient } from "./http.js";
import { resolveLogger } from "./logger.js";
import { OAuthTokenProvider } from "./oauth.js";
import { resolveRetryPolicy } from "./retry.js";
import type { TransportResponse } from "./transport.js";
import {
  CobRResource,
  CobResource,
  CobVResource,
  LocRecResource,
  LocResource,
  LoteCobVResource,
  PayloadResource,
  PixResource,
  RecResource,
  SolicRecResource,
  WebhookResource,
} from "./resources.js";
import type { PixClientOptions } from "./types.js";

/** Per-call options accepted by every resource method. */
export interface CallOptions {
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
}

/** Generic argument bag accepted by `PixClient.request`. */
export interface RequestArgs extends CallOptions {
  readonly path?: Readonly<Record<string, string | number>>;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly body?: unknown;
  readonly skipAuth?: boolean;
  readonly responseType?: "json" | "text";
}

/** Walks `parametros.paginacao` until the last page is consumed. */
export async function* paginate<TItem, TPage>(
  fetchPage: (page: number) => Promise<TPage>,
  itemsOf: (page: TPage) => readonly TItem[],
  paginationOf: (page: TPage) => Paginacao | undefined,
  firstPage = 0,
): AsyncGenerator<TItem> {
  let page = firstPage;
  for (;;) {
    const result = await fetchPage(page);
    yield* itemsOf(result);
    const pagination = paginationOf(result);
    page += 1;
    // Some list responses (e.g. webhooks) make `parametros.paginacao`
    // optional: without it there is nothing further to walk.
    if (pagination === undefined || page >= pagination.quantidadeDePaginas) return;
  }
}

/**
 * Fully configured Pix API client. Construct one per PSP credentials/mTLS pair
 * and reuse it: the OAuth token cache, dispatcher and retry state live here.
 */
export class PixClient {
  /** Normalized PSP base URL (trailing slash), exposed for URL resolution. */
  readonly baseUrl: URL;
  readonly cob: CobResource;
  readonly cobv: CobVResource;
  readonly lotecobv: LoteCobVResource;
  readonly loc: LocResource;
  readonly locrec: LocRecResource;
  readonly pix: PixResource;
  readonly webhook: WebhookResource;
  readonly webhookCob: WebhookResource;
  readonly webhookCobv: WebhookResource;
  readonly webhookCobr: WebhookResource;
  readonly webhookRec: WebhookResource;
  readonly rec: RecResource;
  readonly solicrec: SolicRecResource;
  readonly cobr: CobRResource;
  readonly payload: PayloadResource;

  private readonly http: HttpClient;
  private readonly tokenProvider: OAuthTokenProvider;

  constructor(options: PixClientOptions) {
    const baseUrl = normalizeBaseUrl(options.baseUrl);
    this.baseUrl = baseUrl;
    if (options.clientId === "") throw new RangeError("clientId must not be empty");
    if (options.clientSecret === "") throw new RangeError("clientSecret must not be empty");

    const logger = resolveLogger(options.logger);
    if (baseUrl.protocol === "http:") {
      logger.warn(
        "baseUrl uses plain http:; credentials travel unencrypted — use https in production",
        {
          baseUrl: baseUrl.origin,
        },
      );
    }
    if (options.certificate?.rejectUnauthorized === false) {
      logger.warn(
        "certificate.rejectUnauthorized=false disables TLS server verification — unsafe in production",
        {
          baseUrl: baseUrl.origin,
        },
      );
    }
    let dispatcher = options.dispatcher;
    let ownsDispatcher = false;
    if (
      dispatcher === undefined &&
      options.certificate !== undefined &&
      options.fetch === undefined
    ) {
      dispatcher = createMtlsDispatcher(options.certificate);
      ownsDispatcher = true;
    }
    const tokenProvider = new OAuthTokenProvider({
      tokenUrl: options.oauth?.tokenUrl ?? `${baseUrl.toString()}oauth/token`,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      scopes: options.scopes ?? options.oauth?.scopes ?? [],
      refreshSkewMs: options.oauth?.refreshSkewMs ?? 30_000,
      timeoutMs: options.timeoutMs ?? 15_000,
      logger,
      ...(dispatcher === undefined ? {} : { dispatcher }),
      ...(options.fetch === undefined ? {} : { fetch: options.fetch }),
    });

    this.tokenProvider = tokenProvider;
    this.http = new HttpClient({
      baseUrl: baseUrl.toString(),
      tokenProvider,
      retryPolicy: resolveRetryPolicy(options.retry),
      timeoutMs: options.timeoutMs ?? 15_000,
      logger,
      userAgent: options.userAgent ?? "pix-sdk-br/0.1.0",
      ownsDispatcher,
      ...(dispatcher === undefined ? {} : { dispatcher }),
      ...(options.fetch === undefined ? {} : { fetch: options.fetch }),
    });

    this.cob = new CobResource(this);
    this.cobv = new CobVResource(this);
    this.lotecobv = new LoteCobVResource(this);
    this.loc = new LocResource(this);
    this.locrec = new LocRecResource(this);
    this.pix = new PixResource(this);
    this.webhook = new WebhookResource(this, {
      list: "GetWebhook",
      byChave: { get: "GetWebhookChave", put: "PutWebhookChave", delete: "DeleteWebhookChave" },
      configure: "PutWebhookChave",
      delete: "DeleteWebhookChave",
    });
    this.webhookCob = new WebhookResource(this, {
      list: "GetWebhookcob",
      configure: "PutWebhookcob",
      delete: "DeleteWebhookcob",
    });
    this.webhookCobv = new WebhookResource(this, {
      list: "GetWebhookcobv",
      configure: "PutWebhookcobv",
      delete: "DeleteWebhookcobv",
    });
    this.webhookCobr = new WebhookResource(this, {
      list: "GetWebhookcobr",
      configure: "PutWebhookcobr",
      delete: "DeleteWebhookcobr",
    });
    this.webhookRec = new WebhookResource(this, {
      list: "GetWebhookrec",
      configure: "PutWebhookrec",
      delete: "DeleteWebhookrec",
    });
    this.rec = new RecResource(this);
    this.solicrec = new SolicRecResource(this);
    this.cobr = new CobRResource(this);
    this.payload = new PayloadResource(this);
  }

  /** OAuth token provider (exposed for observability and explicit invalidation). */
  get auth(): OAuthTokenProvider {
    return this.tokenProvider;
  }

  /** GETs an absolute payload location with this client's transport (no OAuth). */
  fetchLocation(url: URL, options?: CallOptions): Promise<TransportResponse> {
    return this.http.fetchExternal(url, options);
  }

  /**
   * Executes a spec operation by name. Path params, query params and request
   * bodies are validated against the generated validators before any I/O.
   */
  async request<T>(operation: string, args: RequestArgs = {}): Promise<T> {
    const info = OPERATIONS[operation];
    if (info === undefined) {
      throw new PixError(`unknown Pix operation "${operation}"`);
    }
    this.validateArguments(info, operation, args);
    const path = interpolatePath(info.path, operation, args.path ?? {});

    return this.http.request<T>({
      method: info.method,
      path,
      operation,
      ...(args.query === undefined ? {} : { query: args.query }),
      ...(args.body === undefined ? {} : { body: args.body }),
      ...(args.signal === undefined ? {} : { signal: args.signal }),
      ...(args.timeoutMs === undefined ? {} : { timeoutMs: args.timeoutMs }),
      ...(args.skipAuth === undefined ? {} : { skipAuth: args.skipAuth }),
      ...(args.responseType === undefined ? {} : { responseType: args.responseType }),
    });
  }

  /** Releases the internally created undici dispatcher. Call on shutdown. */
  async close(): Promise<void> {
    await this.http.close();
  }

  private validateArguments(info: OperationInfo, operation: string, args: RequestArgs): void {
    // Path params are interpolated into a single URL segment. Validate that
    // property for EVERY param (including those whose spec schema is a bare
    // `string`) before any generated constraint or HTTP call runs. Otherwise a
    // value such as "1/../../x" is encoded to "%2F..%2F..%2F" and sent to the
    // PSP — a path-traversal/SSRF vector that no length check catches.
    assertSingleSegmentPathParams(info, operation, args.path ?? {});
    const validators = paramValidators[operation];
    if (validators?.path !== undefined) {
      this.assertValid(operation, validators.path(args.path ?? {}));
    }
    if (validators?.query !== undefined) {
      this.assertValid(operation, validators.query(args.query ?? {}));
    }
    const bodyName = info.requestBody?.name;
    if (bodyName !== undefined) {
      if (info.requestBody?.required === true && args.body === undefined) {
        throw new PixValidationError(operation, [
          { path: "", message: `missing required request body (${bodyName})` },
        ]);
      }
      if (args.body !== undefined) {
        const validator = requestBodyValidators[bodyName];
        if (validator === undefined) {
          throw new PixError(`missing generated validator for request body ${bodyName}`);
        }
        this.assertValid(operation, validator(args.body));
      }
    }
  }

  private assertValid(
    operation: string,
    result: {
      readonly ok: boolean;
      readonly issues?: readonly { readonly path: string; readonly message: string }[];
    },
  ): void {
    if (result.ok) return;
    throw new PixValidationError(operation, result.issues ?? []);
  }
}

function normalizeBaseUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new RangeError(`baseUrl must be an absolute URL, received ${JSON.stringify(raw)}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new RangeError(`baseUrl must use http or https, received ${url.protocol}`);
  }
  if (!url.pathname.endsWith("/")) url.pathname = `${url.pathname}/`;
  return url;
}

/**
 * A path parameter replaces exactly one `{segment}` in the spec's path
 * template. Characters that can terminate that segment (`/`, `\`, `?`, `#`),
 * introduce an escape (`%`, control characters) or form a dot segment must be
 * rejected locally. Type-specific constraints (TxId regex, int64 ids, dates)
 * are still enforced by the generated validators below.
 */
function assertSingleSegmentPathParams(
  info: OperationInfo,
  operation: string,
  params: Readonly<Record<string, string | number>>,
): void {
  for (const param of info.pathParams) {
    const raw = params[param.name];
    if (typeof raw !== "string" && typeof raw !== "number") continue;
    const value = String(raw);
    if (value === "" || value === "." || value === ".." || hasUnsafeSegmentChar(value)) {
      throw new PixValidationError(operation, [
        {
          path: param.name,
          message:
            "path parameter must be a single safe URL segment (no /, \\, ?, #, %, control characters or dot segments)",
        },
      ]);
    }
  }
}

/** True when a value cannot occupy a single URL path segment safely. */
function hasUnsafeSegmentChar(value: string): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0x1f || code === 0x7f) return true;
    if (char === "/" || char === "\\" || char === "?" || char === "#" || char === "%") {
      return true;
    }
  }
  return false;
}

function interpolatePath(
  template: string,
  operation: string,
  params: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (_match, key: string) => {
    const value = params[key];
    if (value === undefined) {
      throw new PixValidationError(operation, [
        { path: key, message: "missing required path parameter" },
      ]);
    }
    return encodeURIComponent(String(value));
  });
}
