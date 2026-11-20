/**
 * Guard-rail tests: the generator must fail loudly on spec drift. Every
 * unsupported construct, undeclared required property, unknown reference and
 * erratum-precondition violation throws a SpecError — this is what makes the
 * "generator covers everything" guarantees trustworthy across future spec
 * bumps.
 */

import { describe, expect, it } from "vitest";
import { ERRATA, applyErrata } from "../scripts/generator/errata.js";
import { collectSpecExamples, resolveExampleValue } from "../scripts/generator/examples.js";
import { createCompiler, compileParameter } from "../scripts/generator/ir.js";
import { compileOperations, operationName } from "../scripts/generator/operations.js";
import { typeContext, tsType } from "../scripts/generator/types.js";
import { loadErrataAppliedSpec, loadRawSpec } from "./helpers.js";
import type { OpenApiDocument } from "../scripts/generator/openapi.js";
import { SpecError, parseSpecText } from "../scripts/generator/openapi.js";

function syntheticDoc(schemas: Record<string, Record<string, unknown>>): OpenApiDocument {
  const schemaYaml = Object.entries(schemas)
    .map(
      ([name, schema]) =>
        `    ${name}:\n${JSON.stringify(schema, null, 2).replace(/^/gm, "      ")}`,
    )
    .join("\n");
  return parseSpecText(`
openapi: 3.0.0
info:
  title: synthetic
  version: 0.0.0
paths: {}
components:
  schemas:
${schemaYaml}
`);
}

describe("IR compilation rejects unsupported constructs", () => {
  const expectSpecError = (fn: () => unknown): void => {
    expect(fn).toThrow(SpecError);
  };

  it("unknown schema keywords fail loudly", () => {
    expectSpecError(() =>
      createCompiler(syntheticDoc({ X: { type: "string", minumbo: 1 } }), new Map()),
    );
  });

  it("unsupported string formats fail loudly", () => {
    expectSpecError(() =>
      createCompiler(syntheticDoc({ X: { type: "string", format: "uuid" } }), new Map()),
    );
  });

  it("unsupported number formats fail loudly", () => {
    expectSpecError(() =>
      createCompiler(syntheticDoc({ X: { type: "integer", format: "int128" } }), new Map()),
    );
  });

  it("non-string enums fail loudly", () => {
    expectSpecError(() =>
      createCompiler(syntheticDoc({ X: { type: "string", enum: [1] } }), new Map()),
    );
  });

  it("arrays without items fail loudly", () => {
    expectSpecError(() => createCompiler(syntheticDoc({ X: { type: "array" } }), new Map()));
  });

  it("unknown schema types fail loudly", () => {
    expectSpecError(() => createCompiler(syntheticDoc({ X: { type: "file" } }), new Map()));
  });

  it("unparseable patterns fail loudly", () => {
    expectSpecError(() =>
      createCompiler(syntheticDoc({ X: { type: "string", pattern: "(" } }), new Map()),
    );
  });

  it("required properties undeclared in the composition closure fail loudly", () => {
    // This is the exact class of upstream defect the errata exist for: without
    // errata applied, the real spec trips this guard (that is the point).
    expectSpecError(() =>
      createCompiler(
        syntheticDoc({
          X: { type: "object", required: ["ghost"], properties: { a: { type: "string" } } },
        }),
        new Map(),
      ),
    );
  });

  it("unknown $ref targets fail loudly", () => {
    expectSpecError(() =>
      createCompiler(syntheticDoc({ X: { $ref: "#/components/schemas/Missing" } }), new Map()),
    );
  });

  it("parameter locations other than path/query fail loudly", () => {
    const compiler = createCompiler(syntheticDoc({ X: { type: "string" } }), new Map());
    expectSpecError(() =>
      compileParameter(
        { name: "h", in: "header", required: false, schema: { type: "string" } },
        "test",
        compiler,
      ),
    );
  });

  it("parameters without schemas fail loudly", () => {
    const compiler = createCompiler(syntheticDoc({ X: { type: "string" } }), new Map());
    expectSpecError(() =>
      compileParameter({ name: "p", in: "query", required: false }, "test", compiler),
    );
  });

  it("slash-delimited patterns are normalized defensively (idempotent)", () => {
    const compiler = createCompiler(
      syntheticDoc({ X: { type: "string", pattern: "/^\\d{11}$/" } }),
      new Map(),
    );
    expect(compiler.constraints.get("X")).toMatchObject({
      kind: "string",
      pattern: /^\d{11}$/,
    });
  });

  it("bare pattern-only allOf members apply as string constraints", () => {
    const compiler = createCompiler(
      syntheticDoc({
        X: { allOf: [{ $ref: "#/components/schemas/TxId" }, { pattern: "[a-zA-Z0-9]{1,35}" }] },
        TxId: { type: "string", pattern: "[a-zA-Z0-9]{26,35}" },
      }),
      new Map(),
    );
    const constraint = compiler.constraints.get("X");
    expect(constraint?.kind).toBe("allOf");
    if (constraint?.kind === "allOf") {
      expect(constraint.members).toHaveLength(2);
      expect(constraint.members[1]?.kind).toBe("string");
    }
  });
});

describe("operation compilation rejects ambiguous shapes", () => {
  it("colliding operation names fail loudly", () => {
    const doc = parseSpecText(`
openapi: 3.0.0
info:
  title: t
  version: "0"
paths:
  "/a/{x}":
    get:
      tags: [T]
      responses: {}
  "/a/x":
    get:
      tags: [T]
      responses: {}
components: {}
`);
    const examples = collectSpecExamples(doc);
    expect(() => compileOperations(doc, examples)).toThrow(SpecError);
  });

  it("operation names are derived deterministically from method and path", () => {
    expect(operationName("get", "/cob/{txid}")).toBe("GetCobTxid");
    expect(operationName("put", "/lotecobv/{id}")).toBe("PutLotecobvId");
    expect(operationName("post", "/cobr/{txid}/retentativa/{data}")).toBe(
      "PostCobrTxidRetentativaData",
    );
    expect(operationName("delete", "/loc/{id}/txid")).toBe("DeleteLocIdTxid");
    expect(operationName("get", "/{pixUrlAccessToken}")).toBe("GetPixUrlAccessToken");
  });
});

describe("erratum preconditions are enforced (drift fails loudly)", () => {
  it("re-applying errata to an already-corrected spec fails the preconditions", async () => {
    const corrected = structuredClone(await loadErrataAppliedSpec());
    expect(() => applyErrata(corrected)).toThrow(SpecError);
  });

  it("a missing target schema fails the corresponding erratum", async () => {
    const doc = structuredClone(await loadRawSpec());
    delete doc.components.schemas?.["RecBase"];
    expect(() => applyErrata(doc)).toThrow(/RecBase/);
  });

  it("the errata fix the defects they describe (RecBase keeps only declared keys)", async () => {
    const doc = await loadErrataAppliedSpec();
    expect(doc.components.schemas?.["RecBase"]?.required).toEqual(["calendario", "vinculo"]);
    // The stray-quote variant is gone:
    expect(doc.components.schemas?.["RecNotification"]?.required).toEqual([
      "idRec",
      "status",
      "atualizacao",
    ]);
  });

  it("every erratum self-describes with an upstream location and rationale", () => {
    const ids = ERRATA.map((erratum) => erratum.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const erratum of ERRATA) {
      expect(erratum.location.length).toBeGreaterThan(10);
      expect(erratum.description.length).toBeGreaterThan(40);
    }
  });
});

describe("type emission resolves everything or fails loudly", () => {
  it("emitting a type for an unknown named schema reference fails", () => {
    const doc = syntheticDoc({});
    const ctx = typeContext(doc, new Map());
    expect(() => tsType({ $ref: "#/components/schemas/Missing" }, ctx, "test")).toThrow(SpecError);
  });

  it("bare-required allOf members surface as indexed accesses onto the composed schema", async () => {
    const doc = await loadErrataAppliedSpec();
    const cobSolicitada = doc.components.schemas?.["CobSolicitada"];
    expect(cobSolicitada, "CobSolicitada missing from spec").toBeDefined();
    if (cobSolicitada === undefined) return;
    const ctx = typeContext(doc, new Map());
    const type = tsType(cobSolicitada, ctx, "test");
    expect(type).toContain('CobValor["original"]');
  });
});

describe("example composition resolution", () => {
  const resolver = (ref: string): { from: string } => ({ from: ref.split("/").at(-2) ?? ref });

  it("resolves single allOf/$ref markers to the referenced value", () => {
    const resolved = resolveExampleValue(
      { list: [{ allOf: [{ $ref: "#/components/examples/a/value" }] }] },
      resolver,
      "test",
    );
    expect(resolved).toEqual({ list: [{ from: "a" }] });
  });

  it("merges multiple allOf members like JSON Schema allOf (later members win)", () => {
    const resolved = resolveExampleValue(
      {
        allOf: [
          { $ref: "#/components/examples/b/value" },
          { $ref: "#/components/examples/c/value" },
        ],
      },
      resolver,
      "test",
    );
    expect(resolved).toEqual({ from: "c" });
  });

  it("resolves a direct $ref marker", () => {
    expect(
      resolveExampleValue({ $ref: "#/components/examples/x/value" }, resolver, "test"),
    ).toEqual({
      from: "x",
    });
  });

  it("rejects malformed markers", () => {
    expect(() => resolveExampleValue({ allOf: "nope" }, resolver, "test")).toThrow();
    expect(() => resolveExampleValue({ allOf: [1, 2] }, resolver, "test")).toThrow();
    expect(() =>
      resolveExampleValue({ $ref: "#/components/examples/a" }, () => ({}), "test"),
    ).not.toThrow();
  });
});
