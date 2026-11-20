/**
 * Error hierarchy for the Pix client.
 *
 * Every failure surfaced by the SDK is a `PixError`. Server failures carry a
 * parsed RFC 7807 `application/problem+json` document (with the BCB-specific
 * `violacoes` array) on `PixApiError`.
 */

import type { Problema, Violacao } from "../generated/schemas.js";
import type { ValidationIssue } from "../validation/index.js";

/** Base class for every error thrown by this SDK. */
export class PixError extends Error {
  constructor(message: string, options?: { readonly cause?: unknown }) {
    super(message, options?.cause === undefined ? undefined : { cause: options.cause });
    this.name = "PixError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** One BCB `violacoes[]` entry, exposed with the spec's original field names. */
export type PixViolation = Violacao;

/** Metadata attached to errors originated from an HTTP call. */
export interface PixRequestContext {
  readonly method: string;
  readonly path: string;
  readonly operation?: string;
  readonly status?: number;
  readonly headers?: Readonly<Record<string, string>>;
}

function defaultProblemTitle(status: number): string {
  return status === 0 ? "Network error" : `HTTP ${String(status)}`;
}

/** Generic problem document used when a server does not send valid problem+json. */
export function fallbackProblem(status: number, detail?: string): Problema {
  const problem: Problema = {
    type: "about:blank",
    title: defaultProblemTitle(status),
    status,
  };
  return detail === undefined ? problem : { ...problem, detail };
}

/**
 * Parses an RFC 7807 problem document. Malformed or non-problem payloads are
 * converted into a deterministic fallback so callers can always rely on the
 * shape of `PixApiError.problem`.
 */
export function parseProblem(
  body: string | undefined,
  status: number,
  contentType?: string,
): Problema {
  const text = body?.trim();
  if (text === undefined || text === "") return fallbackProblem(status);

  if (contentType !== undefined && !/problem\+json|application\/json/i.test(contentType)) {
    return fallbackProblem(status, text.slice(0, 512));
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fallbackProblem(status, text.slice(0, 512));
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return fallbackProblem(status, text.slice(0, 512));
  }

  const record = parsed as Record<string, unknown>;
  const problem: Problema = {
    type: typeof record["type"] === "string" ? record["type"] : "about:blank",
    title: typeof record["title"] === "string" ? record["title"] : defaultProblemTitle(status),
    status:
      typeof record["status"] === "number" && Number.isFinite(record["status"])
        ? record["status"]
        : status,
  };
  return withOptionalProblemFields(problem, record);
}

function withOptionalProblemFields(problem: Problema, record: Record<string, unknown>): Problema {
  let result = problem;
  if (typeof record["detail"] === "string") result = { ...result, detail: record["detail"] };
  if (typeof record["correlationId"] === "string") {
    result = { ...result, correlationId: record["correlationId"] };
  }
  if (Array.isArray(record["violacoes"])) {
    const violations: Violacao[] = [];
    for (const entry of record["violacoes"]) {
      if (typeof entry !== "object" || entry === null) continue;
      const item = entry as Record<string, unknown>;
      const violation: Violacao = {};
      if (typeof item["razao"] === "string") violation.razao = item["razao"];
      if (typeof item["propriedade"] === "string") {
        violation.propriedade = item["propriedade"];
      }
      if (typeof item["valor"] === "string") violation.valor = item["valor"];
      violations.push(violation);
    }
    result = { ...result, violacoes: violations };
  }
  return result;
}

/** A non-2xx response from the Pix API, parsed per RFC 7807. */
export class PixApiError extends PixError {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string | undefined;
  readonly correlationId: string | undefined;
  readonly violations: readonly PixViolation[];
  readonly problem: Problema;
  readonly context: PixRequestContext;
  readonly retryAfterMs: number | undefined;

  constructor(
    problem: Problema,
    context: PixRequestContext,
    options?: {
      readonly retryAfterMs?: number;
      readonly cause?: unknown;
    },
  ) {
    const detail = problem.detail ?? problem.title;
    super(`${String(problem.status)} ${problem.title}: ${detail}`, options);
    this.name = "PixApiError";
    this.type = problem.type;
    this.title = problem.title;
    this.status = problem.status;
    this.detail = problem.detail;
    this.correlationId = problem.correlationId;
    this.violations = problem.violacoes ?? [];
    this.problem = problem;
    this.context = context;
    this.retryAfterMs = options?.retryAfterMs;
  }

  /** Field paths reported by the PSP, useful for surfacing form errors. */
  get violationPaths(): readonly string[] {
    return this.violations
      .map((violation) => violation.propriedade)
      .filter((path): path is string => typeof path === "string");
  }
}

/** A transport-level failure (connection refused, TLS, timeout, DNS, ...). */
export class PixNetworkError extends PixError {
  readonly code: string;
  readonly timeout: boolean;
  readonly context: PixRequestContext | undefined;

  constructor(
    message: string,
    options?: {
      readonly code?: string;
      readonly timeout?: boolean;
      readonly context?: PixRequestContext;
      readonly cause?: unknown;
    },
  ) {
    super(message, options);
    this.name = "PixNetworkError";
    this.code = options?.code ?? "ECONNECTION";
    this.timeout = options?.timeout ?? false;
    this.context = options?.context;
  }
}

/** Failure while acquiring or refreshing an OAuth2 access token. */
export class PixAuthError extends PixError {
  readonly status: number | undefined;
  readonly tokenUrl: string;

  constructor(
    message: string,
    tokenUrl: string,
    options?: {
      readonly status?: number;
      readonly cause?: unknown;
    },
  ) {
    super(message, options);
    this.name = "PixAuthError";
    this.tokenUrl = tokenUrl;
    this.status = options?.status;
  }
}

/** Client-side validation failure, raised before any byte is sent. */
export class PixValidationError extends PixError {
  readonly operation: string;
  readonly issues: readonly ValidationIssue[];
  readonly fieldPaths: readonly string[];

  constructor(operation: string, issues: readonly ValidationIssue[]) {
    const summary = issues
      .map((issue) => (issue.path === "" ? issue.message : `${issue.path}: ${issue.message}`))
      .join("; ");
    super(`Validation failed for ${operation}: ${summary}`);
    this.name = "PixValidationError";
    this.operation = operation;
    this.issues = issues;
    this.fieldPaths = issues.map((issue) => issue.path);
  }
}

/** Caller-supplied abort (distinct from an SDK timeout). */
export class PixAbortError extends PixError {
  constructor(message = "Request aborted", options?: { readonly cause?: unknown }) {
    super(message, options);
    this.name = "AbortError";
  }
}
