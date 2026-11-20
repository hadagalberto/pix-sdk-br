/** Node http, Express and Fastify webhook adapters plus the shared pipeline. */

import { createServer, type IncomingMessage, type Server } from "node:http";
import { Readable } from "node:stream";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { fetch as undiciFetch } from "undici";
import { specExamples } from "../src/generated/examples.js";
import {
  DEFAULT_MAX_BODY_BYTES,
  handleWebhookRequest,
  readRawBody,
  WebhookBodyTooLargeError,
} from "../src/webhooks/http.js";
import type { WebhookHandlerOptions } from "../src/webhooks/http.js";
import { createNodeWebhookHandler } from "../src/webhooks/node.js";
import { expressWebhook, type ExpressResponseLike } from "../src/webhooks/express.js";
import { fastifyWebhook, type FastifyReplyLike } from "../src/webhooks/fastify.js";
import type { WebhookParseSuccess } from "../src/webhooks/parse.js";

// Normalize the spec example's object-valued `devolucoes` into the array the
// generated PixConsultado validator requires.
const rawPix = specExamples["pixWebhook1"] as Record<string, unknown>;
const validPix = { ...rawPix, devolucoes: [rawPix["devolucoes"]] };
const pixBody = JSON.stringify({ pix: [validPix] });

function fakeStream(chunks: readonly string[]): IncomingMessage {
  return Readable.from(chunks.map((chunk) => Buffer.from(chunk))) as unknown as IncomingMessage;
}

describe("handleWebhookRequest (shared pipeline)", () => {
  const options = (onWebhook = vi.fn()): WebhookHandlerOptions => ({ onWebhook });

  it("invokes onWebhook and returns 200 for a valid POST", async () => {
    const onWebhook = vi.fn();
    const outcome = await handleWebhookRequest({
      method: "post",
      url: "/hooks/pix?token=abc",
      body: pixBody,
      options: options(onWebhook),
    });
    expect(outcome.matched).toBe(true);
    expect(outcome.status).toBe(200);
    expect(outcome.body).toEqual({ received: true, kind: "pix" });
    expect(outcome.context).toEqual({ method: "POST", path: "/hooks", suffix: "pix" });
    expect(onWebhook).toHaveBeenCalledTimes(1);
    expect((onWebhook.mock.calls[0]?.[0] as WebhookParseSuccess).kind).toBe("pix");
  });

  it("accepts an already-parsed body", async () => {
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: { pix: [validPix] },
      options: options(),
    });
    expect(outcome.status).toBe(200);
  });

  it("returns 405 for non-POST methods", async () => {
    const onWebhook = vi.fn();
    const outcome = await handleWebhookRequest({
      method: "GET",
      url: "/hooks",
      body: "",
      options: options(onWebhook),
    });
    expect(outcome).toMatchObject({ matched: false, status: 405 });
    expect(onWebhook).not.toHaveBeenCalled();
  });

  it("returns 404 and calls onUnmatched for an unmatched path", async () => {
    const onUnmatched = vi.fn();
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/different/pix",
      body: pixBody,
      options: { ...options(), path: { basePath: "/hooks" }, onUnmatched },
    });
    expect(outcome).toMatchObject({ matched: false, status: 404 });
    expect(onUnmatched).toHaveBeenCalledTimes(1);
  });

  it("returns 422 with issues for an invalid body", async () => {
    const onWebhook = vi.fn();
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: "{bad json",
      options: options(onWebhook),
    });
    expect(outcome.status).toBe(422);
    expect(outcome.body).toMatchObject({ error: "invalid webhook payload" });
    expect(onWebhook).not.toHaveBeenCalled();
  });

  it("returns 500 and calls onError when the user callback rejects", async () => {
    const onError = vi.fn();
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: pixBody,
      options: {
        onWebhook: () => {
          throw new Error("boom");
        },
        onError,
      },
    });
    expect(outcome.status).toBe(500);
    expect(outcome.body).toEqual({ error: "webhook handler failed" });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("awaits an async onWebhook", async () => {
    const order: string[] = [];
    const outcome = await handleWebhookRequest({
      method: "POST",
      url: "/hooks",
      body: pixBody,
      options: {
        onWebhook: async () => {
          await Promise.resolve();
          order.push("called");
        },
      },
    });
    order.push("done");
    expect(outcome.status).toBe(200);
    expect(order).toEqual(["called", "done"]);
  });
});

describe("readRawBody", () => {
  it("concatenates chunks as UTF-8 text", async () => {
    await expect(readRawBody(fakeStream(["hello ", "world"]), 100)).resolves.toBe("hello world");
  });

  it("rejects with WebhookBodyTooLargeError above the limit", async () => {
    await expect(readRawBody(fakeStream(["abcdef"]), 3)).rejects.toBeInstanceOf(
      WebhookBodyTooLargeError,
    );
  });

  it("uses the default 1 MiB limit constant", () => {
    expect(DEFAULT_MAX_BODY_BYTES).toBe(1024 * 1024);
  });
});

describe("Node http adapter (live server)", () => {
  let server: Server;
  let baseUrl: string;
  const contexts: { path: string; suffix: string | undefined }[] = [];

  beforeAll(async () => {
    server = createServer(
      createNodeWebhookHandler({
        path: { basePath: "/hooks" },
        onWebhook: (_result, context) => {
          contexts.push({ path: context.path, suffix: context.suffix });
        },
      }),
    );
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (address === null || typeof address === "string") throw new Error("no server address");
    baseUrl = `http://127.0.0.1:${String(address.port)}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error === undefined ? resolve() : reject(error))),
    );
  });

  it("accepts the PSP-appended /pix suffix", async () => {
    const response = await undiciFetch(`${baseUrl}/hooks/pix`, {
      method: "POST",
      body: pixBody,
      headers: { "content-type": "application/json" },
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true, kind: "pix" });
    expect(contexts.at(-1)).toEqual({ path: "/hooks", suffix: "pix" });
  });

  it("rejects invalid JSON with 422", async () => {
    const response = await undiciFetch(`${baseUrl}/hooks`, {
      method: "POST",
      body: "{broken",
    });
    expect(response.status).toBe(422);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe("invalid webhook payload");
  });

  it("rejects GET with 405", async () => {
    const response = await undiciFetch(`${baseUrl}/hooks`, { method: "GET" });
    expect(response.status).toBe(405);
  });

  it("rejects an unmatched path with 404", async () => {
    const response = await undiciFetch(`${baseUrl}/other`, {
      method: "POST",
      body: pixBody,
    });
    expect(response.status).toBe(404);
  });

  it("rejects an oversized body with 413", async () => {
    const response = await undiciFetch(`${baseUrl}/hooks`, {
      method: "POST",
      body: "x".repeat(1024 * 1024 + 10),
    });
    expect(response.status).toBe(413);
  });

  it("returns 500 when a path hook rejects", async () => {
    const server2 = createServer(
      createNodeWebhookHandler({
        path: { basePath: "/hooks" },
        onUnmatched: () => Promise.reject(new Error("hook failed")),
        onWebhook: vi.fn(),
      }),
    );
    await new Promise<void>((resolve) => server2.listen(0, "127.0.0.1", resolve));
    const address = server2.address();
    if (address === null || typeof address === "string") throw new Error("no server address");
    try {
      const response = await undiciFetch(`http://127.0.0.1:${String(address.port)}/other`, {
        method: "POST",
        body: pixBody,
      });
      expect(response.status).toBe(500);
    } finally {
      await new Promise<void>((resolve) => server2.close(() => resolve()));
    }
  });
});

describe("Express adapter", () => {
  function reply() {
    const state: { status: number | undefined; body: unknown } = {
      status: undefined,
      body: undefined,
    };
    const res: ExpressResponseLike = {
      status(code) {
        state.status = code;
        return res;
      },
      json(body) {
        state.body = body;
        return res;
      },
    };
    return { res, state };
  }

  it("uses a pre-parsed body and responds with 200", () => {
    const onWebhook = vi.fn();
    const { res, state } = reply();
    expressWebhook({ onWebhook })(
      { method: "POST", url: "/hooks/pix", body: JSON.parse(pixBody) as unknown },
      res,
      vi.fn(),
    );
    return vi.waitFor(() => {
      expect(onWebhook).toHaveBeenCalledTimes(1);
      expect(state).toMatchObject({ status: 200, body: { received: true, kind: "pix" } });
    });
  });

  it("calls next() for an unmatched path", () => {
    const next = vi.fn();
    const { res, state } = reply();
    expressWebhook({ onWebhook: vi.fn(), path: { basePath: "/hooks" } })(
      { method: "POST", url: "/other", body: {} },
      res,
      next,
    );
    return vi.waitFor(() => {
      expect(next).toHaveBeenCalledTimes(1);
      expect(state.status).toBeUndefined();
    });
  });

  it("returns 422 for an invalid pre-parsed body", () => {
    const { res, state } = reply();
    expressWebhook({ onWebhook: vi.fn() })(
      { method: "POST", url: "/hooks", body: { unrelated: true } },
      res,
      vi.fn(),
    );
    return vi.waitFor(() => expect(state.status).toBe(422));
  });

  it("returns 500 when onWebhook rejects", () => {
    const { res, state } = reply();
    expressWebhook({
      onWebhook: () => {
        throw new Error("boom");
      },
    })(
      {
        method: "POST",
        url: "/hooks",
        originalUrl: "/hooks",
        body: JSON.parse(pixBody) as unknown,
      },
      res,
      vi.fn(),
    );
    return vi.waitFor(() => expect(state.status).toBe(500));
  });

  it("buffers the raw stream when no body parser ran", () => {
    const { res, state } = reply();
    const req = Object.assign(fakeStream([pixBody]), {
      method: "POST",
      url: "/hooks",
    }) as unknown as Parameters<ReturnType<typeof expressWebhook>>[0];
    expressWebhook({ onWebhook: vi.fn() })(req, res, vi.fn());
    return vi.waitFor(() => expect(state.status).toBe(200));
  });

  it("returns 413 when the raw stream exceeds the limit", () => {
    const { res, state } = reply();
    const req = Object.assign(fakeStream(["x".repeat(50)]), {
      method: "POST",
      url: "/hooks",
    }) as unknown as Parameters<ReturnType<typeof expressWebhook>>[0];
    expressWebhook({ onWebhook: vi.fn(), maxBodyBytes: 10 })(req, res, vi.fn());
    return vi.waitFor(() => expect(state.status).toBe(413));
  });

  it("returns 400 when the raw stream fails", () => {
    const { res, state } = reply();
    const broken = fakeStream([pixBody]);
    const req = Object.assign(broken, {
      method: "POST",
      url: "/hooks",
    }) as unknown as Parameters<ReturnType<typeof expressWebhook>>[0];
    expressWebhook({ onWebhook: vi.fn() })(req, res, vi.fn());
    broken.emit("error", new Error("read failed"));
    return vi.waitFor(() => expect(state.status).toBe(400));
  });

  it("returns 500 when a path hook rejects", () => {
    const onError = vi.fn();
    const { res, state } = reply();
    expressWebhook({
      onWebhook: vi.fn(),
      path: { basePath: "/hooks" },
      onUnmatched: () => Promise.reject(new Error("hook failed")),
      onError,
    })({ method: "POST", url: "/other", body: {} }, res, vi.fn());
    return vi.waitFor(() => {
      expect(state.status).toBe(500);
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Fastify adapter", () => {
  function reply() {
    const state: { status: number | undefined; body: unknown } = {
      status: undefined,
      body: undefined,
    };
    const res: FastifyReplyLike = {
      code(status) {
        state.status = status;
        return res;
      },
      send(body) {
        state.body = body;
        return res;
      },
    };
    return { res, state };
  }

  it("verifies a pre-parsed body", async () => {
    const onWebhook = vi.fn();
    const { res, state } = reply();
    await fastifyWebhook({ onWebhook })(
      {
        method: "POST",
        url: "/hooks/pix",
        body: JSON.parse(pixBody) as unknown,
      },
      res,
    );
    expect(state).toMatchObject({ status: 200, body: { received: true, kind: "pix" } });
    expect(onWebhook).toHaveBeenCalledTimes(1);
  });

  it("returns 404 for an unmatched path", async () => {
    const { res, state } = reply();
    await fastifyWebhook({ onWebhook: vi.fn(), path: { basePath: "/hooks" } })(
      { method: "POST", url: "/other", body: {} },
      res,
    );
    expect(state.status).toBe(404);
  });

  it("reads the raw request when no body parser ran", async () => {
    const { res, state } = reply();
    await fastifyWebhook({ onWebhook: vi.fn() })(
      {
        method: "POST",
        url: "/hooks",
        raw: fakeStream([pixBody]),
      },
      res,
    );
    expect(state.status).toBe(200);
  });

  it("returns 413 for an oversized raw request", async () => {
    const { res, state } = reply();
    await fastifyWebhook({ onWebhook: vi.fn(), maxBodyBytes: 8 })(
      {
        method: "POST",
        url: "/hooks",
        raw: fakeStream(["x".repeat(40)]),
      },
      res,
    );
    expect(state.status).toBe(413);
  });

  it("returns 400 when the raw stream fails", async () => {
    const { res, state } = reply();
    const broken = fakeStream([pixBody]);
    const promise = fastifyWebhook({ onWebhook: vi.fn() })(
      {
        method: "POST",
        url: "/hooks",
        raw: broken,
      },
      res,
    );
    broken.emit("error", new Error("read failed"));
    await promise;
    expect(state.status).toBe(400);
  });

  it("returns 500 when a path hook rejects", async () => {
    const onError = vi.fn();
    const { res, state } = reply();
    await fastifyWebhook({
      onWebhook: vi.fn(),
      path: { basePath: "/hooks" },
      onUnmatched: () => Promise.reject(new Error("hook failed")),
      onError,
    })({ method: "POST", url: "/other", body: {} }, res);
    expect(state.status).toBe(500);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
