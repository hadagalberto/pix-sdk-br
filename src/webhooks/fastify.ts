/**
 * Fastify webhook handler adapter.
 *
 * Fastify is an optional peer; only the structural `request`/`reply` surface
 * used below is required, so this module type-checks without Fastify installed.
 *
 * ```ts
 * import Fastify from "fastify";
 * import { fastifyWebhook } from "pix-sdk-br/webhooks/fastify";
 *
 * const app = Fastify();
 * app.post("/hooks", fastifyWebhook({ onWebhook: (event) => handle(event) }));
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

/** Minimal shape of a Fastify `Request` used by this adapter. */
export interface FastifyRequestLike {
  readonly method: string;
  readonly url: string;
  readonly body?: unknown;
  readonly raw?: IncomingMessage;
}

/** Minimal shape of a Fastify `Reply` used by this adapter. */
export interface FastifyReplyLike {
  code(statusCode: number): FastifyReplyLike;
  send(payload: unknown): unknown;
}

export type FastifyWebhookHandler = (
  request: FastifyRequestLike,
  reply: FastifyReplyLike,
) => Promise<unknown>;

/** Creates a Fastify route handler from a webhook handler configuration. */
export function fastifyWebhook(options: WebhookHandlerOptions): FastifyWebhookHandler {
  const limit = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  return async (request, reply) => {
    let body: unknown = request.body;
    try {
      if (body === undefined && request.raw !== undefined) {
        body = await readRawBody(request.raw, limit);
      }
    } catch (error) {
      const status = error instanceof WebhookBodyTooLargeError ? 413 : 400;
      return reply
        .code(status)
        .send({ error: error instanceof Error ? error.message : "invalid body" });
    }
    try {
      const outcome = await handleWebhookRequest({
        method: request.method,
        url: request.url,
        body,
        options,
        request: request.raw ?? request,
      });
      return reply.code(outcome.status).send(outcome.body);
    } catch (error) {
      options.onError?.(error, {
        method: request.method,
        path: request.url.split(/[?#]/, 1)[0] ?? "/",
        suffix: undefined,
      });
      return reply.code(500).send({ error: "webhook handler failed" });
    }
  };
}
