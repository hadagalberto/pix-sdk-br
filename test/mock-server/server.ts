/**
 * Mock Pix API server used by the integration tests: real HTTPS + mTLS, real
 * OAuth2 client-credentials endpoint, in-memory resources and fault injection.
 * Responses for operations without bespoke state come from the spec's own
 * official examples, so the mock always emits spec-shaped payloads.
 */

import { createServer } from "node:https";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { operationResponseExamples } from "../../src/generated/examples.js";
import { OPERATIONS, type OperationInfo } from "../../src/generated/operations.js";
import { testCertificates, type TestCertificates } from "./certs.js";
import { FaultInjection } from "./faults.js";

export interface RecordedRequest {
  readonly method: string;
  readonly path: string;
  readonly authorization: string | undefined;
  readonly contentType: string | undefined;
  readonly body: string;
}

export interface MockServerOptions {
  readonly clientId?: string;
  readonly clientSecret?: string;
  readonly tokenExpiresIn?: number;
  readonly certificates?: TestCertificates;
  readonly faults?: FaultInjection;
}

export interface MockServer {
  readonly baseUrl: string;
  readonly port: number;
  readonly certificates: TestCertificates;
  readonly faults: FaultInjection;
  readonly requests: readonly RecordedRequest[];
  reset(): void;
  close(): Promise<void>;
}

interface Route {
  readonly operation: OperationInfo;
  readonly pattern: RegExp;
  readonly paramNames: readonly string[];
}

interface State {
  readonly cobs: Map<string, Record<string, unknown>>;
  readonly cobvs: Map<string, Record<string, unknown>>;
  readonly devolucoes: Map<string, Record<string, unknown>>;
  readonly webhooks: Map<string, Record<string, unknown>>;
  readonly locs: Map<string, Record<string, unknown>>;
  readonly locrecs: Map<string, Record<string, unknown>>;
  readonly pix: Map<string, Record<string, unknown>>;
  tokenCounter: number;
  readonly requests: RecordedRequest[];
}

const ROUTES: readonly Route[] = Object.values(OPERATIONS)
  .map((operation) => {
    const paramNames: string[] = [];
    const segments = operation.path.split("/").map((segment) => {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        paramNames.push(segment.slice(1, -1));
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    return { operation, pattern: new RegExp(`^${segments.join("/")}$`), paramNames };
  })
  // Most-specific (most literal segments) first; scoped resource routes win
  // ties over the catch-all payload-token routes.
  .sort((a, b) => {
    const specificity = (route: Route): number =>
      route.operation.path.split("/").filter((segment) => !segment.startsWith("{")).length;
    return specificity(b) - specificity(a) || b.operation.scopes.length - a.operation.scopes.length;
  });

/** Starts the mock server on an ephemeral localhost port. */
export async function startMockServer(options: MockServerOptions = {}): Promise<MockServer> {
  const certificates = options.certificates ?? testCertificates();
  const faults = options.faults ?? new FaultInjection();
  const clientId = options.clientId ?? "mock-client";
  const clientSecret = options.clientSecret ?? "mock-secret";
  const tokenExpiresIn = options.tokenExpiresIn ?? 3600;

  const state: State = {
    cobs: new Map(),
    cobvs: new Map(),
    devolucoes: new Map(),
    webhooks: new Map(),
    locs: new Map(),
    locrecs: new Map(),
    pix: new Map(),
    tokenCounter: 0,
    requests: [],
  };

  const server = createServer(
    {
      key: certificates.serverKeyPem,
      cert: certificates.serverCertPem,
      ca: certificates.caCertPem,
      requestCert: true,
      rejectUnauthorized: true,
    },
    (request, response) => {
      void handle(request, response);
    },
  );

  async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", "https://localhost");
    const rawBody = await readBody(request);
    state.requests.push({
      method: request.method ?? "",
      path: url.pathname,
      authorization: request.headers.authorization,
      contentType: request.headers["content-type"],
      body: rawBody,
    });

    if (faults.delayMs > 0) await delay(faults.delayMs);

    if (url.pathname === "/oauth/token") {
      handleToken(request, response, rawBody);
      return;
    }

    const route = findRoute(request.method ?? "", url.pathname);
    const requiresAuth = route === undefined || route.operation.scopes.length > 0;
    if (faults.requireAuth && requiresAuth && !isAuthorized(request)) {
      sendProblem(response, 401, "Missing or invalid bearer token", "about:blank", "Unauthorized");
      return;
    }
    const fault = faults.nextApiFault();
    if (fault !== undefined) {
      const headers: Record<string, string> = {};
      if (fault.retryAfterSeconds !== undefined)
        headers["retry-after"] = String(fault.retryAfterSeconds);
      sendProblem(
        response,
        fault.status,
        "Injected fault",
        "https://pix.example.com/problems/fault",
        "Fault injected by mock server",
        undefined,
        headers,
      );
      return;
    }

    if (route === undefined) {
      sendProblem(response, 404, `No operation for ${url.pathname}`, "about:blank", "Not Found");
      return;
    }
    const params = extractParams(route, url.pathname);
    const body = parseJsonObject(rawBody);
    if (handleStateful(route.operation.name, params, body, url.searchParams, response, state))
      return;
    sendGenericResponse(route.operation, response);
  }

  function handleToken(request: IncomingMessage, response: ServerResponse, rawBody: string): void {
    if (request.method !== "POST") {
      sendProblem(response, 405, "Method not allowed", "about:blank", "Method Not Allowed");
      return;
    }
    const authorization = request.headers.authorization ?? "";
    const expected = `Basic ${Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")}`;
    if (authorization !== expected) {
      sendProblem(response, 401, "Invalid client credentials", "about:blank", "Unauthorized");
      return;
    }
    const tokenFault = faults.nextTokenFault();
    if (tokenFault !== undefined) {
      sendProblem(response, tokenFault, "Injected token fault", "about:blank", "Token fault");
      return;
    }
    const form = new URLSearchParams(rawBody);
    if (form.get("grant_type") !== "client_credentials") {
      sendProblem(response, 400, "Unsupported grant_type", "about:blank", "Bad Request");
      return;
    }
    state.tokenCounter += 1;
    const scope = form.get("scope");
    const payload: Record<string, unknown> = {
      access_token: `mock-access-token-${String(state.tokenCounter)}`,
      token_type: "Bearer",
      expires_in: tokenExpiresIn,
    };
    if (scope !== null) payload["scope"] = scope;
    sendJson(response, 200, payload);
  }

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address() as AddressInfo;

  return {
    baseUrl: `https://localhost:${String(address.port)}`,
    port: address.port,
    certificates,
    faults,
    get requests() {
      return state.requests;
    },
    reset() {
      state.cobs.clear();
      state.cobvs.clear();
      state.devolucoes.clear();
      state.webhooks.clear();
      state.locs.clear();
      state.locrecs.clear();
      state.pix.clear();
      state.requests.length = 0;
      state.tokenCounter = 0;
      faults.clear();
    },
    async close() {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error === undefined ? resolve() : reject(error)));
      });
    },
  };
}

function findRoute(method: string, pathname: string): Route | undefined {
  const verb = method.toLowerCase();
  return ROUTES.find((route) => route.operation.method === verb && route.pattern.test(pathname));
}

function extractParams(route: Route, pathname: string): readonly string[] {
  const match = route.pattern.exec(pathname);
  if (match === null) return [];
  return route.paramNames.map((_name, index) => decodeURIComponent(match[index + 1] ?? ""));
}

function handleStateful(
  operation: string,
  params: readonly string[],
  body: Record<string, unknown> | undefined,
  query: URLSearchParams,
  response: ServerResponse,
  state: State,
): boolean {
  switch (operation) {
    case "PutCobTxid": {
      const txid = params[0] ?? "";
      const stored = withExample("PutCobTxid", 201, { txid });
      state.cobs.set(txid, stored);
      sendJson(response, 201, stored);
      return true;
    }
    case "GetCobTxid":
    case "PatchCobTxid": {
      const txid = params[0] ?? "";
      const stored = state.cobs.get(txid);
      if (stored === undefined) {
        sendProblem(response, 404, "Cobrança não encontrada", "about:blank", "Not Found");
        return true;
      }
      sendJson(response, 200, stored);
      return true;
    }
    case "GetCob": {
      sendList(response, state.cobs, "cobs", query);
      return true;
    }
    case "PutCobvTxid": {
      const txid = params[0] ?? "";
      const stored = withExample("PutCobvTxid", 201, { txid });
      state.cobvs.set(txid, stored);
      sendJson(response, 201, stored);
      return true;
    }
    case "GetCobvTxid":
    case "PatchCobvTxid": {
      const txid = params[0] ?? "";
      const stored = state.cobvs.get(txid);
      if (stored === undefined) {
        sendProblem(response, 404, "Cobrança não encontrada", "about:blank", "Not Found");
        return true;
      }
      sendJson(response, 200, stored);
      return true;
    }
    case "GetCobv": {
      sendList(response, state.cobvs, "cobs", query);
      return true;
    }
    case "PutPixE2eidDevolucaoId": {
      const key = `${params[0] ?? ""}/${params[1] ?? ""}`;
      const stored = withExample("PutPixE2eidDevolucaoId", 201, {});
      state.devolucoes.set(key, stored);
      sendJson(response, 201, stored);
      return true;
    }
    case "GetPixE2eidDevolucaoId": {
      const key = `${params[0] ?? ""}/${params[1] ?? ""}`;
      const stored = state.devolucoes.get(key);
      if (stored === undefined) {
        sendProblem(response, 404, "Devolução não encontrada", "about:blank", "Not Found");
        return true;
      }
      sendJson(response, 200, stored);
      return true;
    }
    case "GetPix": {
      sendList(response, state.pix, "pix", query);
      return true;
    }
    case "PutWebhookChave": {
      const chave = params[0] ?? "";
      const stored = withExample("PutWebhookChave", 200, { chave, ...body });
      state.webhooks.set(chave, stored);
      sendJson(response, 200, stored);
      return true;
    }
    case "GetWebhookChave": {
      const chave = params[0] ?? "";
      const stored = state.webhooks.get(chave);
      if (stored === undefined) {
        sendProblem(response, 404, "Webhook não encontrado", "about:blank", "Not Found");
        return true;
      }
      sendJson(response, 200, stored);
      return true;
    }
    case "DeleteWebhookChave": {
      state.webhooks.delete(params[0] ?? "");
      response.writeHead(204).end();
      return true;
    }
    case "PostLoc": {
      const stored = withExample("PostLoc", 201, {});
      const id = stringId(stored["id"]);
      state.locs.set(id, stored);
      sendJson(response, 201, stored);
      return true;
    }
    case "GetLocId": {
      sendJson(response, 200, withExample("GetLocId", 200, {}));
      return true;
    }
    case "PostLocrec": {
      const stored = withExample("PostLocrec", 201, {});
      const id = stringId(stored["id"]);
      state.locrecs.set(id, stored);
      sendJson(response, 201, stored);
      return true;
    }
    case "GetLocrecId": {
      sendJson(response, 200, withExample("GetLocrecId", 200, {}));
      return true;
    }
    case "GetPixUrlAccessToken":
    case "GetCobvPixUrlAccessToken":
    case "GetRecRecUrlAccessToken": {
      response.writeHead(200, { "content-type": "text/plain" }).end("mock.jws.payload");
      return true;
    }
    default:
      return false;
  }
}

function sendList(
  response: ServerResponse,
  store: ReadonlyMap<string, Record<string, unknown>>,
  key: "cobs" | "pix",
  query: URLSearchParams,
): void {
  const page = nonnegativeInt(query.get("paginacao.paginaAtual"), 0);
  const perPage = Math.max(1, nonnegativeInt(query.get("paginacao.itensPorPagina"), 10));
  const all = [...store.values()];
  const items = all.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  sendJson(response, 200, {
    parametros: {
      inicio: query.get("inicio") ?? "2020-01-01T00:00:00Z",
      fim: query.get("fim") ?? "2100-01-01T00:00:00Z",
      paginacao: {
        paginaAtual: page,
        itensPorPagina: perPage,
        quantidadeDePaginas: totalPages,
        quantidadeTotalDeItens: all.length,
      },
    },
    [key]: items,
  });
}

function stringId(value: unknown): string {
  if (typeof value === "number" || typeof value === "string") return String(value);
  return "1";
}

function nonnegativeInt(raw: string | null, fallback: number): number {
  if (raw === null) return fallback;
  const value = Number(raw);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function withExample(
  operation: string,
  code: number,
  overrides: Record<string, unknown>,
): Record<string, unknown> {
  const example = operationResponseExamples[operation]?.[code]?.[0];
  const repaired = repairExample(example, operation);
  const base =
    typeof repaired === "object" && repaired !== null
      ? { ...(repaired as Record<string, unknown>) }
      : {};
  return { ...base, ...overrides };
}

/**
 * The pinned spec's own examples have a few known inconsistencies with its
 * schemas (e.g. cob `loc` omits the required `criacao`). The mock repairs them
 * so every response it emits satisfies the generated, spec-derived validator.
 */
function repairExample(value: unknown, operation: string): unknown {
  if (Array.isArray(value)) return value.map((item) => repairExample(item, operation));
  if (typeof value !== "object" || value === null) return value;

  const record = { ...(value as Record<string, unknown>) };
  for (const [key, child] of Object.entries(record)) {
    record[key] = repairExample(child, operation);
  }
  const loc = record["loc"];
  if (typeof loc === "object" && loc !== null && !Array.isArray(loc)) {
    const locRecord = loc as Record<string, unknown>;
    record["loc"] = {
      criacao: "2020-09-09T20:15:00.358Z",
      tipoCob: typeof locRecord["tipoCob"] === "string" ? locRecord["tipoCob"] : "cob",
      ...locRecord,
    };
  }
  if (operation.startsWith("GetLotecobv") && record["id"] === undefined) record["id"] = 1;
  const e2eid = record["endToEndId"];
  if (typeof e2eid === "string" && e2eid.length > 32) {
    record["endToEndId"] = e2eid.slice(0, 32);
  }
  return record;
}

function sendGenericResponse(operation: OperationInfo, response: ServerResponse): void {
  const candidates = operation.responses
    .filter((entry) => entry.code >= 200 && entry.code < 300)
    .sort((a, b) => a.code - b.code);
  for (const candidate of candidates) {
    const example = operationResponseExamples[operation.name]?.[candidate.code]?.[0];
    if (example !== undefined) {
      sendJson(response, candidate.code, repairExample(example, operation.name));
      return;
    }
  }
  response.writeHead(204).end();
}

function sendJson(
  response: ServerResponse,
  status: number,
  payload: unknown,
  extraHeaders: Readonly<Record<string, string>> = {},
): void {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "content-type": "application/json",
    "content-length": String(Buffer.byteLength(body)),
    ...extraHeaders,
  });
  response.end(body);
}

function sendProblem(
  response: ServerResponse,
  status: number,
  detail: string,
  type: string,
  title: string,
  violations?: readonly { razao: string; propriedade: string }[],
  extraHeaders: Readonly<Record<string, string>> = {},
): void {
  const problem: Record<string, unknown> = { type, title, status, detail };
  if (violations !== undefined) {
    problem["violacoes"] = violations.map((item) => ({ ...item, valor: "invalid" }));
  }
  sendJson(response, status, problem, {
    "content-type": "application/problem+json",
    ...extraHeaders,
  });
}

function isAuthorized(request: IncomingMessage): boolean {
  const authorization = request.headers.authorization ?? "";
  return /^Bearer .+/.test(authorization);
}

function parseJsonObject(raw: string): Record<string, unknown> | undefined {
  if (raw === "") return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Non-JSON bodies are ignored; validators on the client reject them.
  }
  return undefined;
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
