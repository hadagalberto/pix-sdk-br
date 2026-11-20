/**
 * Express webhook middleware adapter.
 *
 * Express itself and its types are optional peers: this module only relies on
 * the small structural surface it actually uses, so it can be imported without
 * installing Express.
 *
 * ```ts
 * import express from "express";
 * import { expressWebhook } from "pix-sdk-br/webhooks/express";
 *
 * const app = express();
 * app.use(express.json());
 * app.post("/hooks", expressWebhook({ onWebhook: (event) => handle(event) }));
 * ```
 */

import type { IncomingMessage } from "node:http";
import {
  DEFAULT_MAX_BODY_BYTES,
  handleWebhookRequest,
  readRawBody,
  WebhookBodyTooLargeError,
} from "./http.js";
import type { WebhookHandlerOptions } from "./http.js";

/** Minimal shape of an Express `Request` used by this adapter. */
export interface ExpressRequestLike {
  readonly method: string;
  readonly url: string;
  readonly originalUrl?: string;
  readonly body?: unknown;
}

/** Minimal shape of an Express `Response` used by this adapter. */
export interface ExpressResponseLike {
  status(statusCode: number): ExpressResponseLike;
  json(body: unknown): unknown;
}

export type ExpressNextFunction = (error?: unknown) => void;
export type ExpressWebhookHandler = (
  req: ExpressRequestLike,
  res: ExpressResponseLike,
  next: ExpressNextFunction,
) => void;

/** Creates Express middleware from a webhook handler configuration. */
export function expressWebhook(options: WebhookHandlerOptions): ExpressWebhookHandler {
  const limit = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  return (req, res, next): void => {
    void (async () => {
      const url = req.originalUrl ?? req.url;
      let body: unknown = req.body;
      try {
        if (body === undefined) {
          const raw = req as unknown as IncomingMessage;
          body = await readRawBody(raw, limit);
        }
      } catch (error) {
        if (error instanceof WebhookBodyTooLargeError) {
          res.status(413).json({ error: error.message });
          return;
        }
        res.status(400).json({ error: error instanceof Error ? error.message : "invalid body" });
        return;
      }
      try {
        const outcome = await handleWebhookRequest({
          method: req.method,
          url,
          body,
          options,
          request: req,
        });
        if (!outcome.matched) {
          next();
          return;
        }
        res.status(outcome.status).json(outcome.body);
      } catch (error) {
        if (error instanceof WebhookBodyTooLargeError) {
          res.status(413).json({ error: error.message });
          return;
        }
        const path = url.split(/[?#]/, 1)[0] ?? "/";
        options.onError?.(error, { method: req.method, path, suffix: undefined });
        res.status(500).json({ error: "webhook handler failed" });
      }
    })();
  };
}
