/**
 * Node.js `http` webhook receiver adapter.
 *
 * ```ts
 * import { createServer } from "node:https";
 * import { readFileSync } from "node:fs";
 * import { createNodeWebhookHandler, isMtlsAuthorized } from "pix-sdk-br/webhooks/node";
 *
 * // Pix callbacks are normally mTLS. A plain http.createServer() accepts
 * // unauthenticated POSTs — never expose one to the internet.
 * createServer(
 *   {
 *     pfx: readFileSync("webhook.p12"),
 *     passphrase: process.env["WEBHOOK_PASSPHRASE"],
 *     ca: readFileSync("psp-ca.pem"),
 *     requestCert: true,
 *     rejectUnauthorized: true,
 *   },
 *   createNodeWebhookHandler({
 *     authorize: isMtlsAuthorized,
 *     path: { pathSuffix: "strip" },
 *     onWebhook: (event) => console.log(event.kind, event.data),
 *   }),
 * ).listen(443);
 * ```
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import {
  DEFAULT_MAX_BODY_BYTES,
  handleWebhookRequest,
  readRawBody,
  WebhookBodyTooLargeError,
} from "./http.js";
import type { WebhookHandlerOptions } from "./http.js";

export { isMtlsAuthorized } from "./http.js";

export type NodeWebhookHandler = (req: IncomingMessage, res: ServerResponse) => void;

function respond(res: ServerResponse, status: number, body: unknown): void {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

/** Creates a `request` listener for `node:http` / `node:https` servers. */
export function createNodeWebhookHandler(options: WebhookHandlerOptions): NodeWebhookHandler {
  const limit = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  return (req, res): void => {
    void (async () => {
      const url = req.url ?? "/";
      const method = req.method ?? "";
      let body: unknown;
      try {
        body = await readRawBody(req, limit);
      } catch (error) {
        const status = error instanceof WebhookBodyTooLargeError ? 413 : 400;
        respond(res, status, { error: error instanceof Error ? error.message : "invalid body" });
        return;
      }
      try {
        const outcome = await handleWebhookRequest({ method, url, body, options, request: req });
        respond(res, outcome.status, outcome.body);
      } catch (error) {
        options.onError?.(error, { method, path: url, suffix: undefined });
        respond(res, 500, { error: "webhook handler failed" });
      }
    })();
  };
}
