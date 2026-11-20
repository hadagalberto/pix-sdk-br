/**
 * Mock Pix API server used by the integration and contract tests.
 *
 * Implements every operation in the pinned BCB spec with in-memory state, real
 * HTTPS + mTLS, an OAuth2 client-credentials endpoint, RFC 7807 problem+json
 * errors (including `violacoes`) and configurable fault injection. Responses
 * are seeded from the spec's official examples and repaired against the
 * spec-derived JSON Schemas, so every response the server emits is valid.
 */

import { createServer } from "node:https";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { operationResponseExamples } from "../../src/generated/examples.js";
import { OPERATIONS, type OperationInfo } from "../../src/generated/operations.js";
import { requestBodyValidators } from "../../src/generated/validators.js";
import { generateTxid } from "../../src/txid.js";
import { repairResponse } from "./repair.js";
import { testCertificates, type TestCertificates } from "./certs.js";
import { FaultInjection } from "./faults.js";

export interface RecordedRequest {
  readonly method: string;
  readonly path: string;
  readonly authorization: string | undefined;
  readonly contentType: string | undefined;
  readonly body: string;
}

/** One HTTP exchange with the API, as seen by the mock server. */
export interface RecordedExchange {
  readonly operation: string;
  readonly method: string;
  readonly path: string;
  readonly query: Readonly<Record<string, string>>;
  readonly requestBody: unknown;
  readonly status: number;
  readonly responseBody: unknown;
  readonly contentType: string | undefined;
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
  /** Every API request/response pair, keyed by the spec operation it matched. */
  readonly exchanges: readonly RecordedExchange[];
  reset(): void;
  close(): Promise<void>;
}

interface Route {
  readonly operation: OperationInfo;
  readonly pattern: RegExp;
  readonly paramNames: readonly string[];
}

type Stored = Record<string, unknown>;

interface State {
  readonly cobs: Map<string, Stored>;
  readonly cobvs: Map<string, Stored>;
  readonly lotecobvs: Map<string, Stored>;
  readonly locs: Map<string, Stored>;
  readonly locrecs: Map<string, Stored>;
  readonly pix: Map<string, Stored>;
  readonly devolucoes: Map<string, Stored>;
  readonly webhooks: Map<string, Stored>;
  readonly webhookSingles: Map<string, Stored>;
  readonly recs: Map<string, Stored>;
  readonly solicrecs: Map<string, Stored>;
  readonly cobrs: Map<string, Stored>;
  readonly retentativas: Map<string, Stored>;
  readonly payloadTokens: Map<string, Stored>;
  tokenCounter: number;
  readonly requests: RecordedRequest[];
  readonly exchanges: RecordedExchange[];
}

interface Sent {
  readonly status: number;
  readonly body: unknown;
  readonly contentType: string | undefined;
  readonly headers: Readonly<Record<string, string>>;
}

type Reply = ReturnType<typeof makeReply>;

/** Literal first path segments that are real resources, not payload tokens. */
const RESOURCE_SEGMENTS: ReadonlySet<string> = new Set(
  Object.values(OPERATIONS)
    .map((operation) => operation.path.split("/")[1] ?? "")
    .filter((segment) => segment.length > 0 && !segment.startsWith("{")),
);

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
    lotecobvs: new Map(),
    locs: new Map(),
    locrecs: new Map(),
    pix: new Map(),
    devolucoes: new Map(),
    webhooks: new Map(),
    webhookSingles: new Map(),
    recs: new Map(),
    solicrecs: new Map(),
    cobrs: new Map(),
    retentativas: new Map(),
    payloadTokens: new Map(),
    tokenCounter: 0,
    requests: [],
    exchanges: [],
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

    const route = findRoute(
      request.method ?? "",
      url.pathname,
      request.headers.authorization !== undefined,
    );
    const query: Record<string, string> = {};
    for (const [key, value] of url.searchParams) query[key] = value;
    const requestBody = parseJsonObject(rawBody);
    const reply = makeReply(response, (sent) => {
      if (route === undefined) return;
      state.exchanges.push({
        operation: route.operation.name,
        method: request.method ?? "",
        path: url.pathname,
        query,
        requestBody,
        status: sent.status,
        responseBody: sent.body,
        contentType: sent.contentType,
      });
    });

    const requiresAuth = route === undefined || route.operation.scopes.length > 0;
    if (faults.requireAuth && requiresAuth && !isAuthorized(request)) {
      reply.problem(401, "Missing or invalid bearer token", "about:blank", "Unauthorized");
      return;
    }
    const fault = faults.nextApiFault();
    if (fault !== undefined) {
      const headers: Record<string, string> = {};
      if (fault.retryAfterSeconds !== undefined)
        headers["retry-after"] = String(fault.retryAfterSeconds);
      reply.problem(
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
      reply.problem(404, `No operation for ${url.pathname}`, "about:blank", "Not Found");
      return;
    }

    if (!validateRequestBody(route.operation, requestBody, reply)) return;

    const params = extractParams(route, url.pathname);
    if (handleStateful(route.operation.name, params, requestBody, query, reply, state)) return;
    sendGenericResponse(route.operation, reply);
  }

  function handleToken(request: IncomingMessage, response: ServerResponse, rawBody: string): void {
    const reply = makeReply(response, () => undefined);
    if (request.method !== "POST") {
      reply.problem(405, "Method not allowed", "about:blank", "Method Not Allowed");
      return;
    }
    const authorization = request.headers.authorization ?? "";
    const expected = `Basic ${Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")}`;
    if (authorization !== expected) {
      reply.problem(401, "Invalid client credentials", "about:blank", "Unauthorized");
      return;
    }
    const tokenFault = faults.nextTokenFault();
    if (tokenFault !== undefined) {
      reply.problem(tokenFault, "Injected token fault", "about:blank", "Token fault");
      return;
    }
    const form = new URLSearchParams(rawBody);
    if (form.get("grant_type") !== "client_credentials") {
      reply.problem(400, "Unsupported grant_type", "about:blank", "Bad Request");
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
    reply.json(200, payload);
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
    get exchanges() {
      return state.exchanges;
    },
    reset() {
      for (const map of [
        state.cobs,
        state.cobvs,
        state.lotecobvs,
        state.locs,
        state.locrecs,
        state.pix,
        state.devolucoes,
        state.webhooks,
        state.webhookSingles,
        state.recs,
        state.solicrecs,
        state.cobrs,
        state.retentativas,
        state.payloadTokens,
      ]) {
        map.clear();
      }
      state.requests.length = 0;
      state.exchanges.length = 0;
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

function findRoute(method: string, pathname: string, hasAuth: boolean): Route | undefined {
  const verb = method.toLowerCase();
  const matches = ROUTES.filter(
    (route) => route.operation.method === verb && route.pattern.test(pathname),
  );
  // `/cob/{txid}` and `/{pixUrlAccessToken}` (likewise cobv/rec) share a wire
  // shape. A request without a bearer token is the payload-token variant —
  // unless the first segment is a literal resource path such as `/cob`.
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  const firstSegment = segments[0] ?? "";
  const lastSegment = segments.at(-1) ?? "";
  const looksLikeResourceId = /^[a-zA-Z0-9]{26,35}$/.test(lastSegment);
  const reserved =
    segments.length === 1
      ? RESOURCE_SEGMENTS.has(firstSegment)
      : RESOURCE_SEGMENTS.has(firstSegment) && looksLikeResourceId;
  if (!hasAuth && !reserved) {
    const unauthenticated = matches.find((route) => route.operation.scopes.length === 0);
    if (unauthenticated !== undefined) return unauthenticated;
  }
  return matches[0];
}

function extractParams(route: Route, pathname: string): readonly string[] {
  const match = route.pattern.exec(pathname);
  if (match === null) return [];
  return route.paramNames.map((_name, index) => decodeURIComponent(match[index + 1] ?? ""));
}

/** Seeds a spec-valid payload for an operation/status from the official example. */
function fixture(
  operation: string,
  status: number,
  overrides: Record<string, unknown> = {},
): Stored {
  const example = operationResponseExamples[operation]?.[status]?.[0];
  const seed: unknown =
    typeof example === "object" && example !== null && !Array.isArray(example)
      ? { ...(example as Stored), ...overrides }
      : overrides;
  const repaired = repairResponse(operation, status, seed);
  return typeof repaired === "object" && repaired !== null && !Array.isArray(repaired)
    ? (repaired as Stored)
    : { ...overrides };
}

function getOrCreate(
  store: Map<string, Stored>,
  key: string,
  operation: string,
  status: number,
  overrides: Record<string, unknown>,
): Stored {
  const existing = store.get(key);
  if (existing !== undefined) return existing;
  const created = fixture(operation, status, overrides);
  store.set(key, created);
  return created;
}

function numericId(raw: string): number | string {
  return /^\d+$/.test(raw) ? Number(raw) : raw;
}

function stringId(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "1";
}

function handleStateful(
  operation: string,
  params: readonly string[],
  body: Stored | undefined,
  query: Readonly<Record<string, string>>,
  reply: Reply,
  state: State,
): boolean {
  switch (operation) {
    // ---- cob ----------------------------------------------------------------
    case "PutCobTxid": {
      const txid = params[0] ?? "";
      const stored = fixture("PutCobTxid", 201, { txid });
      state.cobs.set(txid, stored);
      reply.json(201, stored);
      return true;
    }
    case "PostCob": {
      const stored = fixture("PostCob", 201, { txid: generateTxid() });
      state.cobs.set(String(stored["txid"]), stored);
      reply.json(201, stored);
      return true;
    }
    case "GetCobTxid":
    case "PatchCobTxid": {
      const txid = params[0] ?? "";
      const stored = state.cobs.get(txid);
      if (stored === undefined) {
        reply.problem(404, "Cobrança não encontrada", "about:blank", "Not Found");
        return true;
      }
      reply.json(200, stored);
      return true;
    }
    case "GetCob": {
      sendList(reply, state.cobs, "cobs", operation, query);
      return true;
    }

    // ---- cobv ----------------------------------------------------------------
    case "PutCobvTxid": {
      const txid = params[0] ?? "";
      const stored = fixture("PutCobvTxid", 201, { txid });
      state.cobvs.set(txid, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetCobvTxid":
    case "PatchCobvTxid": {
      const txid = params[0] ?? "";
      const stored = getOrCreate(state.cobvs, txid, "GetCobvTxid", 200, { txid });
      reply.json(200, stored);
      return true;
    }
    case "GetCobv": {
      sendList(reply, state.cobvs, "cobs", operation, query);
      return true;
    }

    // ---- lotecobv ------------------------------------------------------------
    case "PutLotecobvId": {
      const id = params[0] ?? "";
      state.lotecobvs.set(id, fixture("GetLotecobvId", 200, { id: numericId(id) }));
      reply.empty(202);
      return true;
    }
    case "PatchLotecobvId": {
      const id = params[0] ?? "";
      getOrCreate(state.lotecobvs, id, "GetLotecobvId", 200, { id: numericId(id) });
      reply.empty(202);
      return true;
    }
    case "GetLotecobvId": {
      const id = params[0] ?? "";
      reply.json(
        200,
        getOrCreate(state.lotecobvs, id, "GetLotecobvId", 200, { id: numericId(id) }),
      );
      return true;
    }
    case "GetLotecobv": {
      sendList(reply, state.lotecobvs, "lotes", operation, query);
      return true;
    }

    // ---- payload locations ---------------------------------------------------
    case "PostLoc": {
      const stored = fixture("PostLoc", 201, { ...(body ?? {}) });
      const id = stringId(stored["id"]);
      state.locs.set(id, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetLocId":
    case "DeleteLocIdTxid": {
      const id = params[0] ?? "";
      const stored = getOrCreate(state.locs, id, "GetLocId", 200, { id: numericId(id) });
      reply.json(200, stored);
      return true;
    }
    case "GetLoc": {
      sendList(reply, state.locs, "loc", operation, query);
      return true;
    }
    case "PostLocrec": {
      const stored = fixture("PostLocrec", 201, { ...(body ?? {}) });
      const id = stringId(stored["id"]);
      state.locrecs.set(id, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetLocrecId":
    case "DeleteLocrecIdIdRec": {
      const id = params[0] ?? "";
      const stored = getOrCreate(state.locrecs, id, "GetLocrecId", 200, { id: numericId(id) });
      reply.json(200, stored);
      return true;
    }
    case "GetLocrec": {
      sendList(reply, state.locrecs, "loc", operation, query);
      return true;
    }

    // ---- pix + devolucao -----------------------------------------------------
    case "GetPixE2eid": {
      const e2eid = params[0] ?? "";
      reply.json(200, getOrCreate(state.pix, e2eid, "GetPixE2eid", 200, { endToEndId: e2eid }));
      return true;
    }
    case "GetPix": {
      sendList(reply, state.pix, "pix", operation, query);
      return true;
    }
    case "PutPixE2eidDevolucaoId": {
      const key = `${params[0] ?? ""}/${params[1] ?? ""}`;
      const stored = fixture("PutPixE2eidDevolucaoId", 201, {
        endToEndId: params[0] ?? "",
        id: params[1] ?? "",
        ...(body ?? {}),
      });
      state.devolucoes.set(key, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetPixE2eidDevolucaoId": {
      const key = `${params[0] ?? ""}/${params[1] ?? ""}`;
      reply.json(
        200,
        getOrCreate(state.devolucoes, key, "GetPixE2eidDevolucaoId", 200, {
          endToEndId: params[0] ?? "",
          id: params[1] ?? "",
        }),
      );
      return true;
    }

    // ---- unauthenticated payload tokens -------------------------------------
    case "GetPixUrlAccessToken":
    case "GetCobvPixUrlAccessToken":
    case "GetRecRecUrlAccessToken": {
      const token = params[0] ?? "";
      const stored = getOrCreate(state.payloadTokens, token, operation, 200, {});
      const encoded = Buffer.from(JSON.stringify(stored), "utf8").toString("base64url");
      const jws = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVSJ9.${encoded}.c2lnbmF0dXJl`;
      reply.text(200, jws, "application/jose");
      return true;
    }

    // ---- webhooks ------------------------------------------------------------
    case "GetWebhookChave": {
      const chave = params[0] ?? "";
      reply.json(200, getOrCreate(state.webhooks, chave, "GetWebhookChave", 200, {}));
      return true;
    }
    case "PutWebhookChave": {
      const chave = params[0] ?? "";
      state.webhooks.set(chave, fixture("GetWebhookChave", 200, { chave, ...(body ?? {}) }));
      reply.empty(200);
      return true;
    }
    case "DeleteWebhookChave": {
      state.webhooks.delete(params[0] ?? "");
      reply.empty(204);
      return true;
    }
    case "GetWebhook": {
      sendList(reply, state.webhooks, "webhooks", operation, query);
      return true;
    }
    case "GetWebhookrec":
    case "GetWebhookcobr":
    case "GetWebhookcob":
    case "GetWebhookcobv": {
      const stored = getOrCreate(state.webhookSingles, operation, operation, 200, {});
      reply.json(200, stored);
      return true;
    }
    case "PutWebhookrec":
    case "PutWebhookcobr":
    case "PutWebhookcob":
    case "PutWebhookcobv": {
      const stored = fixture(operation.replace(/^Put/, "Get"), 200, { ...(body ?? {}) });
      state.webhookSingles.set(operation, stored);
      reply.empty(200);
      return true;
    }
    case "DeleteWebhookrec":
    case "DeleteWebhookcobr":
    case "DeleteWebhookcob":
    case "DeleteWebhookcobv": {
      state.webhookSingles.delete(operation.replace(/^Delete/, "Get"));
      reply.empty(204);
      return true;
    }

    // ---- rec -----------------------------------------------------------------
    case "PostRec": {
      const stored = fixture("PostRec", 201, { ...(body ?? {}) });
      const id = stringId(stored["idRec"]);
      state.recs.set(id, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetRecIdRec": {
      const id = params[0] ?? "";
      reply.json(200, getOrCreate(state.recs, id, "GetRecIdRec", 200, { idRec: id }));
      return true;
    }
    case "PatchRecIdRec": {
      const id = params[0] ?? "";
      const stored = fixture("PatchRecIdRec", 200, { idRec: id, ...(body ?? {}) });
      state.recs.set(id, stored);
      reply.json(200, stored);
      return true;
    }
    case "GetRec": {
      sendList(reply, state.recs, "recs", operation, query);
      return true;
    }

    // ---- solicrec ------------------------------------------------------------
    case "PostSolicrec": {
      const stored = fixture("PostSolicrec", 201, { ...(body ?? {}) });
      const id = stringId(stored["idSolicRec"]);
      state.solicrecs.set(id, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetSolicrecIdSolicRec": {
      const id = params[0] ?? "";
      reply.json(
        200,
        getOrCreate(state.solicrecs, id, "GetSolicrecIdSolicRec", 200, { idSolicRec: id }),
      );
      return true;
    }
    case "PatchSolicrecIdSolicRec": {
      const id = params[0] ?? "";
      const stored = fixture("PatchSolicrecIdSolicRec", 201, { idSolicRec: id, ...(body ?? {}) });
      state.solicrecs.set(id, stored);
      reply.json(201, stored);
      return true;
    }

    // ---- cobr + retentativa --------------------------------------------------
    case "PutCobrTxid":
    case "PostCobr": {
      const txid = operation === "PutCobrTxid" ? (params[0] ?? "") : generateTxid();
      const stored = fixture("PutCobrTxid", 201, { txid, ...(body ?? {}) });
      state.cobrs.set(txid, stored);
      reply.json(201, stored);
      return true;
    }
    case "GetCobrTxid": {
      const txid = params[0] ?? "";
      reply.json(200, getOrCreate(state.cobrs, txid, "GetCobrTxid", 200, { txid }));
      return true;
    }
    case "PatchCobrTxid": {
      const txid = params[0] ?? "";
      const stored = fixture("PatchCobrTxid", 200, { txid, ...(body ?? {}) });
      state.cobrs.set(txid, stored);
      reply.json(200, stored);
      return true;
    }
    case "GetCobr": {
      sendList(reply, state.cobrs, "cobsr", operation, query);
      return true;
    }
    case "PostCobrTxidRetentativaData": {
      const txid = params[0] ?? "";
      const data = params[1] ?? "";
      const key = `${txid}/${data}`;
      const stored = fixture("PostCobrTxidRetentativaData", 201, { txid });
      state.retentativas.set(key, stored);
      reply.json(201, stored);
      return true;
    }

    default:
      return false;
  }
}

function sendList(
  reply: Reply,
  store: ReadonlyMap<string, Stored>,
  key: string,
  operation: string,
  query: Readonly<Record<string, string>>,
): void {
  const page = nonnegativeInt(query["paginacao.paginaAtual"], 0);
  const perPage = Math.max(1, nonnegativeInt(query["paginacao.itensPorPagina"], 10));
  const all = [...store.values()];
  const items = all.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const payload: Stored = {
    parametros: {
      inicio: query["inicio"] ?? "2026-01-01T00:00:00Z",
      fim: query["fim"] ?? "2026-12-31T23:59:59Z",
      paginacao: {
        paginaAtual: page,
        itensPorPagina: perPage,
        quantidadeDePaginas: totalPages,
        quantidadeTotalDeItens: all.length,
      },
    },
    [key]: items,
  };
  reply.json(200, repairResponse(operation, 200, payload) ?? payload);
}

function validateRequestBody(
  operation: OperationInfo,
  body: Stored | undefined,
  reply: Reply,
): boolean {
  const bodyName = operation.requestBody?.name;
  if (bodyName === undefined) return true;
  if (body === undefined) {
    if (operation.requestBody?.required !== true) return true;
    reply.problem(400, "Requisição com formato inválido.", "about:blank", "Bad Request", [
      { razao: "corpo da requisição é obrigatório", propriedade: "", valor: "" },
    ]);
    return false;
  }
  const result = requestBodyValidators[bodyName]?.(body);
  if (result?.ok === true) return true;
  const violations = (result?.issues ?? []).map((issue) => ({
    razao: issue.message,
    propriedade: issue.path,
    valor: "",
  }));
  reply.problem(400, "Requisição com formato inválido.", "about:blank", "Bad Request", violations);
  return false;
}

function makeReply(response: ServerResponse, onSend: (sent: Sent) => void) {
  const emit = (
    status: number,
    body: unknown,
    contentType: string | undefined,
    headers: Readonly<Record<string, string>>,
    text?: string,
  ): void => {
    const payload = text ?? JSON.stringify(body);
    const responseHeaders: Record<string, string> = {
      ...(contentType === undefined ? {} : { "content-type": contentType }),
      "content-length": String(Buffer.byteLength(payload)),
      ...headers,
    };
    response.writeHead(status, responseHeaders);
    response.end(payload);
    onSend({ status, body, contentType, headers });
  };

  return {
    json(status: number, payload: unknown, headers: Readonly<Record<string, string>> = {}): void {
      emit(status, payload, "application/json", headers);
    },
    text(
      status: number,
      payload: string,
      contentType: string,
      headers: Readonly<Record<string, string>> = {},
    ): void {
      emit(status, payload, contentType, headers, payload);
    },
    empty(status: number, headers: Readonly<Record<string, string>> = {}): void {
      response.writeHead(status, headers);
      response.end();
      onSend({ status, body: undefined, contentType: undefined, headers });
    },
    problem(
      status: number,
      detail: string,
      type: string,
      title: string,
      violations?: readonly { razao: string; propriedade: string; valor: string }[],
      headers: Readonly<Record<string, string>> = {},
    ): void {
      const problem: Stored = { type, title, status, detail };
      if (violations !== undefined) problem["violacoes"] = violations;
      emit(status, problem, "application/problem+json", headers);
    },
  };
}

function nonnegativeInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback;
  const value = Number(raw);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function sendGenericResponse(operation: OperationInfo, reply: Reply): void {
  const candidates = operation.responses
    .filter((entry) => entry.code >= 200 && entry.code < 300)
    .sort((a, b) => a.code - b.code);
  for (const candidate of candidates) {
    if (candidate.schema === undefined) {
      reply.empty(candidate.code);
      return;
    }
    const repaired = repairResponse(operation.name, candidate.code, {});
    if (repaired !== undefined) {
      reply.json(candidate.code, repaired);
      return;
    }
  }
  reply.empty(204);
}

function isAuthorized(request: IncomingMessage): boolean {
  const authorization = request.headers.authorization ?? "";
  return /^Bearer .+/.test(authorization);
}

function parseJsonObject(raw: string): Stored | undefined {
  if (raw === "") return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Stored;
    }
  } catch {
    // Non-JSON bodies are rejected by validateRequestBody for operations that
    // declare one.
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
