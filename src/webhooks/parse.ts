/**
 * Framework-agnostic webhook parsing for every callback payload defined by the
 * BCB "API Pix" OpenAPI document (`WebhookPixBody`, `WebhookRecBody`,
 * `WebhookCobRBody`, `WebhookCobBody` and `WebhookCobVBody`).
 *
 * The parser never throws on malformed input: callers get a discriminated
 * result that either carries a typed, validated payload or the full list of
 * issues. `parseWebhookOrThrow` is provided for callers that prefer exceptions.
 */

import type {
  WebhookCobBody,
  WebhookCobRBody,
  WebhookCobVBody,
  WebhookPixBody,
  WebhookRecBody,
} from "../generated/schemas.js";
import {
  validateWebhookCobBody,
  validateWebhookCobRBody,
  validateWebhookCobVBody,
  validateWebhookPixBody,
  validateWebhookRecBody,
} from "../generated/validators.js";
import { PixError } from "../client/errors.js";
import type { ValidationIssue, ValidationResult } from "../validation/index.js";

/** The five callback families published by BCB. */
export type WebhookKind = "pix" | "rec" | "cobr" | "cob" | "cobv";

/** Maps a callback kind to its generated, spec-derived body type. */
export interface WebhookDataMap {
  readonly pix: WebhookPixBody;
  readonly rec: WebhookRecBody;
  readonly cobr: WebhookCobRBody;
  readonly cob: WebhookCobBody;
  readonly cobv: WebhookCobVBody;
}

/** Successful parse — `kind` discriminates the shape of `data`. */
export type WebhookParseSuccess = {
  [K in WebhookKind]: {
    readonly ok: true;
    readonly kind: K;
    readonly data: WebhookDataMap[K];
  };
}[WebhookKind];

export type WebhookIssueCode =
  | "invalid-json"
  | "not-object"
  | "missing-kind"
  | "ambiguous-kind"
  | "unexpected-field"
  | "invalid-body";

/** A validation failure located inside the callback document. */
export interface WebhookIssue extends ValidationIssue {
  readonly code: WebhookIssueCode;
}

/** Failed parse. `kind` is the detected family when it was unambiguous. */
export interface WebhookParseFailure {
  readonly ok: false;
  readonly kind: WebhookKind | undefined;
  readonly issues: readonly WebhookIssue[];
}

export type WebhookParseResult = WebhookParseSuccess | WebhookParseFailure;

export interface ParseWebhookOptions {
  /**
   * Reject top-level properties outside the single recognized callback array.
   * BCB schemas allow additional properties, so this is opt-in. Default false.
   */
  readonly strict?: boolean;
}

interface KindSpec<K extends WebhookKind> {
  readonly kind: K;
  /** Property that identifies this callback family in the JSON body. */
  readonly field: string;
  readonly validate: (value: unknown) => ValidationResult<WebhookDataMap[K]>;
}

const KIND_SPECS: readonly KindSpec<WebhookKind>[] = [
  { kind: "pix", field: "pix", validate: (value) => validateWebhookPixBody(value) },
  { kind: "rec", field: "recs", validate: (value) => validateWebhookRecBody(value) },
  { kind: "cobr", field: "cobsr", validate: (value) => validateWebhookCobRBody(value) },
  { kind: "cob", field: "cobs", validate: (value) => validateWebhookCobBody(value) },
  { kind: "cobv", field: "cobsv", validate: (value) => validateWebhookCobVBody(value) },
];

type JsonParse = { readonly ok: true; readonly value: unknown } | { readonly ok: false };

function parseJson(text: string): JsonParse {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  }
}

function failure(
  kind: WebhookKind | undefined,
  issues: readonly WebhookIssue[],
): WebhookParseFailure {
  return { ok: false, kind, issues };
}

/**
 * Parses and validates a Pix webhook callback.
 *
 * @param input Raw JSON text or an already-parsed value.
 * @returns A discriminated result carrying the typed payload or all issues.
 */
export function parseWebhook(
  input: unknown,
  options: ParseWebhookOptions = {},
): WebhookParseResult {
  let value: unknown = input;
  if (typeof input === "string") {
    const parsed = parseJson(input);
    if (!parsed.ok) {
      return failure(undefined, [
        { code: "invalid-json", path: "", message: "webhook body is not valid JSON" },
      ]);
    }
    value = parsed.value;
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return failure(undefined, [
      { code: "not-object", path: "", message: "webhook body must be a JSON object" },
    ]);
  }
  const record = value as Record<string, unknown>;

  const matched = KIND_SPECS.filter((spec) => record[spec.field] !== undefined);
  if (matched.length === 0) {
    return failure(undefined, [
      {
        code: "missing-kind",
        path: "",
        message: `webhook body must contain one of: ${KIND_SPECS.map((s) => s.field).join(", ")}`,
      },
    ]);
  }
  if (matched.length > 1) {
    return failure(matched[0]?.kind, [
      {
        code: "ambiguous-kind",
        path: "",
        message: `webhook body contains multiple callback families: ${matched
          .map((s) => s.field)
          .join(", ")}`,
      },
    ]);
  }

  const spec = matched[0];
  if (spec === undefined) {
    // Unreachable: `matched.length === 1` above. Kept explicit for strict TS.
    return failure(undefined, [{ code: "missing-kind", path: "", message: "no callback family" }]);
  }

  const issues: WebhookIssue[] = [];
  if (options.strict === true) {
    const recognized = new Set(KIND_SPECS.map((s) => s.field));
    for (const key of Object.keys(record)) {
      if (!recognized.has(key)) {
        issues.push({
          code: "unexpected-field",
          path: key,
          message: `unexpected top-level webhook property ${JSON.stringify(key)}`,
        });
      }
    }
  }

  const validation = spec.validate(record);
  if (!validation.ok) {
    for (const issue of validation.issues) {
      issues.push({ code: "invalid-body", path: issue.path, message: issue.message });
    }
    return failure(spec.kind, issues);
  }

  if (issues.length > 0) return failure(spec.kind, issues);

  // The generated validators only *describe* the data; the successful result
  // carries the exact spec-derived type for the detected family.
  return { ok: true, kind: spec.kind, data: validation.value } as WebhookParseSuccess;
}

/** Error thrown by `parseWebhookOrThrow`. */
export class PixWebhookError extends PixError {
  readonly issues: readonly WebhookIssue[];

  constructor(issues: readonly WebhookIssue[]) {
    const summary = issues
      .map((issue) => (issue.path === "" ? issue.message : `${issue.path}: ${issue.message}`))
      .join("; ");
    super(`Invalid webhook payload: ${summary}`);
    this.name = "PixWebhookError";
    this.issues = issues;
  }
}

/** Throwing variant of `parseWebhook`. */
export function parseWebhookOrThrow(
  input: unknown,
  options: ParseWebhookOptions = {},
): WebhookParseSuccess {
  const result = parseWebhook(input, options);
  if (!result.ok) throw new PixWebhookError(result.issues);
  return result;
}
