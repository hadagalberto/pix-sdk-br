/** RFC 7807 parsing and the SDK error hierarchy. */

import { describe, expect, it } from "vitest";
import {
  fallbackProblem,
  parseProblem,
  PixAbortError,
  PixApiError,
  PixAuthError,
  PixError,
  PixNetworkError,
  PixValidationError,
} from "../src/client/errors.js";

describe("parseProblem", () => {
  it("parses a full RFC 7807 problem with BCB violacoes", () => {
    const problem = parseProblem(
      JSON.stringify({
        type: "https://pix.example.com/problems/validation",
        title: "Requisição inválida",
        status: 400,
        detail: "Campo obrigatório ausente",
        correlationId: "corr-123",
        violacoes: [
          { razao: "obrigatoriedade", propriedade: "devedor.cpf", valor: "123" },
          { razao: "formato" },
        ],
      }),
      400,
      "application/problem+json; charset=utf-8",
    );
    expect(problem).toEqual({
      type: "https://pix.example.com/problems/validation",
      title: "Requisição inválida",
      status: 400,
      detail: "Campo obrigatório ausente",
      correlationId: "corr-123",
      violacoes: [
        { razao: "obrigatoriedade", propriedade: "devedor.cpf", valor: "123" },
        { razao: "formato" },
      ],
    });
  });

  it("fills defaults for missing problem fields", () => {
    expect(parseProblem('{"detail":"oops"}', 500, "application/json")).toEqual({
      type: "about:blank",
      title: "HTTP 500",
      status: 500,
      detail: "oops",
    });
    expect(parseProblem("{}", 0)).toEqual({
      type: "about:blank",
      title: "Network error",
      status: 0,
    });
  });

  it("ignores an invalid status carried in the document", () => {
    const problem = parseProblem('{"status":"500","title":"x"}', 503, "application/json");
    expect(problem.status).toBe(503);
  });

  it("falls back for empty, non-JSON, array and non-JSON content-type bodies", () => {
    expect(parseProblem(undefined, 418)).toEqual(fallbackProblem(418));
    expect(parseProblem("   ", 418)).toEqual(fallbackProblem(418));
    expect(parseProblem("not json", 400, "application/json").detail).toBe("not json");
    expect(parseProblem("[]", 400, "application/json").title).toBe("HTTP 400");
    expect(parseProblem("oops", 400, "text/html").detail).toBe("oops");
  });

  it("discards non-object violacoes entries", () => {
    const problem = parseProblem(
      '{"violacoes":[null,42,{"propriedade":"chave","extra":true}]}',
      400,
      "application/json",
    );
    expect(problem.violacoes).toEqual([{ propriedade: "chave" }]);
  });
});

describe("error classes", () => {
  it("PixApiError exposes parsed fields and violation paths", () => {
    const problem = parseProblem(
      '{"type":"t","title":"bad","status":422,"detail":"d","violacoes":[{"propriedade":"valor.original"},{"razao":"x"}]}',
      422,
      "application/json",
    );
    const error = new PixApiError(problem, {
      method: "PUT",
      path: "/cob/txid",
      operation: "PutCobTxid",
      status: 422,
    });
    expect(error).toBeInstanceOf(PixError);
    expect(error.name).toBe("PixApiError");
    expect(error.type).toBe("t");
    expect(error.title).toBe("bad");
    expect(error.status).toBe(422);
    expect(error.detail).toBe("d");
    expect(error.correlationId).toBeUndefined();
    expect(error.violations).toHaveLength(2);
    expect(error.violationPaths).toEqual(["valor.original"]);
    expect(error.problem).toBe(problem);
    expect(error.context.operation).toBe("PutCobTxid");
    expect(error.retryAfterMs).toBeUndefined();
    expect(error.message).toContain("422 bad");
  });

  it("carries Retry-After and a cause when supplied", () => {
    const cause = new Error("root");
    const error = new PixApiError(
      fallbackProblem(429),
      { method: "GET", path: "/cob" },
      {
        retryAfterMs: 1500,
        cause,
      },
    );
    expect(error.retryAfterMs).toBe(1500);
    expect(error.cause).toBe(cause);
  });

  it("PixNetworkError records code, timeout flag and request context", () => {
    const cause = new Error("socket");
    const error = new PixNetworkError("failed", {
      code: "ETIMEDOUT",
      timeout: true,
      context: { method: "GET", path: "/pix" },
      cause,
    });
    expect(error).toBeInstanceOf(PixError);
    expect(error.name).toBe("PixNetworkError");
    expect(error.code).toBe("ETIMEDOUT");
    expect(error.timeout).toBe(true);
    expect(error.context?.path).toBe("/pix");
    expect(error.cause).toBe(cause);
  });

  it("PixAuthError records token URL and status", () => {
    const error = new PixAuthError("denied", "https://psp/oauth/token", { status: 401 });
    expect(error.name).toBe("PixAuthError");
    expect(error.tokenUrl).toBe("https://psp/oauth/token");
    expect(error.status).toBe(401);
  });

  it("PixValidationError exposes issues and field paths", () => {
    const error = new PixValidationError("PutCobTxid", [
      { path: "valor.original", message: "invalid money" },
      { path: "", message: "root issue" },
    ]);
    expect(error.name).toBe("PixValidationError");
    expect(error.operation).toBe("PutCobTxid");
    expect(error.issues).toHaveLength(2);
    expect(error.fieldPaths).toEqual(["valor.original", ""]);
    expect(error.message).toContain("valor.original: invalid money");
    expect(error.message).toContain("root issue");
  });

  it("PixAbortError preserves the AbortError name and cause", () => {
    const cause = new Error("aborted");
    const error = new PixAbortError("stopped", { cause });
    expect(error).toBeInstanceOf(PixError);
    expect(error.name).toBe("AbortError");
    expect(error.cause).toBe(cause);
  });

  it("base PixError sets its name and prototype", () => {
    const error = new PixError("base");
    expect(error.name).toBe("PixError");
    expect(error).toBeInstanceOf(PixError);
  });
});
