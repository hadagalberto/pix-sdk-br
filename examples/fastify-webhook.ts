/**
 * Fastify webhook receiver for BCB Pix callbacks.
 *
 * The adapter validates the callback against the generated spec schemas and
 * handles the common PSP quirk of appending `/pix` to the registered URL.
 * mTLS is terminated by Fastify itself below when PIX_WEBHOOK_PFX is set;
 * behind a reverse proxy, terminate it there and drop the `https` block.
 *
 * Usage:
 *   PIX_WEBHOOK_PFX=./webhook.p12 \
 *   PIX_WEBHOOK_PASSPHRASE=... PIX_WEBHOOK_CA=./psp-ca.pem \
 *   npx tsx examples/fastify-webhook.ts
 *
 * No server is started by CI: this file is only type-checked there.
 */

import { readFileSync } from "node:fs";
import Fastify from "fastify";
import { fastifyWebhook } from "../src/webhooks/fastify.js";

const pfxPath = process.env["PIX_WEBHOOK_PFX"];
const caPath = process.env["PIX_WEBHOOK_CA"];
const passphrase = process.env["PIX_WEBHOOK_PASSPHRASE"];
const port = Number(process.env["PORT"] ?? "3000");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const app = Fastify({
  logger: true,
  ...(pfxPath === undefined
    ? {}
    : {
        https: {
          pfx: readFileSync(pfxPath),
          ...(passphrase === undefined ? {} : { passphrase }),
          ...(caPath === undefined ? {} : { ca: readFileSync(caPath) }),
          requestCert: true,
          rejectUnauthorized: true,
        },
      }),
});

app.post(
  "/webhook",
  fastifyWebhook({
    path: { basePath: "/webhook", pathSuffix: "strip" },
    onWebhook: (event, context) => {
      app.log.info({ kind: event.kind, path: context.path, suffix: context.suffix }, "webhook");
      if (event.kind === "pix") {
        for (const pix of event.data.pix ?? []) {
          app.log.info({ endToEndId: pix.endToEndId }, "pix received");
        }
      }
    },
    onError: (error, context) => {
      app.log.error({ err: error, path: context.path }, "webhook handler failed");
    },
  }),
);

await app.listen({ port, host: "0.0.0.0" });
