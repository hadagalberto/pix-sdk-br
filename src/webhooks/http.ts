/** Shared request handling used by the Node, Express and Fastify adapters. */

import type { IncomingMessage } from "node:http";
import { normalizeWebhookPath } from "./path.js";
import type { WebhookPathOptions } from "./path.js";
import { parseWebhook } from "./parse.js";
import type { WebhookParseResult, WebhookParseSuccess, WebhookKind } from "./parse.js";

/** Default upper bound for a buffered webhook body (1 MiB). */
export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;

/** Information about the HTTP request that carried a webhook. */
export interface WebhookRequestContext {
  readonly method: string;
  /** Pathname after PSP-suffix normalization. */
  readonly path: string;
  /** PSP-appended suffix detected on the original pathname, if any. */
  readonly suffix: string | undefined;
}

export interface WebhookHandlerOptions {
  /** Called after a payload has been fully validated. */
  readonly onWebhook: (
    result: WebhookParseSuccess,
    context: WebhookRequestContext,
  ) => void | Promise<void>;
  /** Path-suffix handling (see `WebhookPathOptions`). */
  readonly path?: WebhookPathOptions;
  /** Maximum buffered body size in bytes. Default 1 MiB. */
  readonly maxBodyBytes?: number;
  /** Called for an unmatched path before the adapter's 404/next response. */
  readonly onUnmatched?: (context: WebhookRequestContext) => void | Promise<void>;
  /** Called when `onWebhook` rejects. */
  readonly onError?: (error: unknown, context: WebhookRequestContext) => void;
  /**
   * Optional authentication gate. Return `true` to accept the request. Node
   * adapters pass the live `IncomingMessage`; use `isMtlsAuthorized` to require
   * a validated client certificate. When omitted, the endpoint is open — do
   * not expose it to untrusted networks without transport-level protection.
   */
  readonly authorize?: (
    request: unknown,
    context: WebhookRequestContext,
  ) => boolean | Promise<boolean>;
}

export interface WebhookHandlingOutcome {
  /** Whether the request path matched a webhook path. */
  readonly matched: boolean;
  readonly status: number;
  /** JSON-serializable response body. */
  readonly body: WebhookResultBody;
  readonly parsed: WebhookParseResult | undefined;
  readonly context: WebhookRequestContext;
}

export type WebhookResultBody =
  | { readonly received: true; readonly kind: WebhookKind }
  | { readonly error: string; readonly issues?: readonly unknown[] };

export interface HandleWebhookInput {
  readonly method: string;
  /** Request target, including an optional query string. */
  readonly url: string;
  /** Raw JSON text or an already-parsed body (framework body parser). */
  readonly body: unknown;
  readonly options: WebhookHandlerOptions;
  /** Live framework request, forwarded to `options.authorize`. */
  readonly request?: unknown;
}

/**
 * Framework-independent webhook request pipeline: path handling, method check,
 * parsing/validation and user callback invocation.
 */
export async function handleWebhookRequest(
  input: HandleWebhookInput,
): Promise<WebhookHandlingOutcome> {
  const { method, url, body, options, request } = input;
  const normalized = normalizeWebhookPath(url, options.path);
  const context: WebhookRequestContext = {
    method: method.toUpperCase(),
    path: normalized.path,
    suffix: normalized.suffix,
  };

  if (!normalized.accepted) {
    await options.onUnmatched?.(context);
    return notHandled(context, 404, { error: "not found" });
  }

  // Authorize before revealing method/validation state. Failing closed here
  // also keeps 422 issue details away from unauthenticated callers.
  let authenticated = false;
  if (options.authorize !== undefined) {
    try {
      authenticated = request !== undefined && (await options.authorize(request, context));
    } catch {
      authenticated = false;
    }
    if (!authenticated) return notHandled(context, 401, { error: "unauthorized" });
  }

  if (context.method !== "POST") {
    return notHandled(context, 405, { error: "method not allowed" });
  }

  const parsed = parseWebhook(body);
  if (!parsed.ok) {
    return {
      matched: true,
      status: 422,
      body: authenticated
        ? { error: "invalid webhook payload", issues: parsed.issues }
        : { error: "invalid webhook payload" },
      parsed,
      context,
    };
  }

  try {
    await options.onWebhook(parsed, context);
  } catch (error) {
    options.onError?.(error, context);
    return {
      matched: true,
      status: 500,
      body: { error: "webhook handler failed" },
      parsed,
      context,
    };
  }

  return {
    matched: true,
    status: 200,
    body: { received: true, kind: parsed.kind },
    parsed,
    context,
  };
}

function notHandled(
  context: WebhookRequestContext,
  status: number,
  body: WebhookResultBody,
): WebhookHandlingOutcome {
  return { matched: false, status, body, parsed: undefined, context };
}

/**
 * Authorization helper for `options.authorize`: accept only requests whose TLS
 * socket carries a client certificate the Node TLS stack actually validated.
 * Plain `http:` sockets and sockets with a verification error are rejected.
 */
export function isMtlsAuthorized(request: unknown): boolean {
  const socket = (
    request as
      | {
          readonly socket?: {
            readonly authorized?: boolean;
            readonly authorizationError?: unknown;
          };
        }
      | undefined
  )?.socket;
  return (
    socket?.authorized === true &&
    (socket.authorizationError === undefined || socket.authorizationError === null)
  );
}

/** Error thrown when a webhook body exceeds the configured byte limit. */
export class WebhookBodyTooLargeError extends Error {
  constructor(readonly limitBytes: number) {
    super(`webhook body exceeds ${String(limitBytes)} bytes`);
    this.name = "WebhookBodyTooLargeError";
  }
}

/**
 * Buffers a Node readable stream into UTF-8 text, enforcing `limitBytes`.
 * The stream is consumed (and destroyed on overflow).
 */
export function readRawBody(stream: IncomingMessage, limitBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let settled = false;

    const fail = (error: unknown): void => {
      if (settled) return;
      settled = true;
      reject(error instanceof Error ? error : new Error(String(error)));
    };
    const succeed = (): void => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(chunks).toString("utf8"));
    };

    stream.on("data", (chunk: Buffer | string) => {
      const buffer = typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk;
      size += buffer.length;
      if (size > limitBytes) {
        fail(new WebhookBodyTooLargeError(limitBytes));
        // Keep draining the request so the adapter can still write a response
        // (destroying a live socket would tear down the HTTP connection).
        stream.resume();
        return;
      }
      chunks.push(buffer);
    });
    stream.on("end", succeed);
    stream.on("error", fail);
    stream.on("aborted", () => fail(new Error("webhook request aborted")));
  });
}
