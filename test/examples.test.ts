/**
 * Runs every official example payload from the spec through its validator.
 *
 * The upstream file ships a number of examples that contradict its own
 * schemas (missing required fields, string values for integer fields, enum
 * values with a cedilla, `nome` where `status` is declared, 34-char e2e ids,
 * devoluções modeled as an object). Those are pinned here as **known-invalid
 * fixtures** with the exact failing path, each documented with the reason —
 * they double as regression tests proving the validators do not silently
 * weaken. Everything else must pass.
 */

import { describe, expect, it } from "vitest";
import { requestBodyExamples, operationResponseExamples } from "../src/generated/examples.js";
import {
  requestBodyValidators,
  schemaValidators,
  validateProblema,
} from "../src/generated/validators.js";
import { OPERATIONS } from "../src/generated/operations.js";

interface InvalidExpectation {
  /** Part of the spec where the offending example is declared. */
  readonly example: string;
  /** Issue paths (or path prefixes) the validator must report. */
  readonly includes: readonly string[];
}

/** Request-body examples the upstream file declares against their own schema. */
const INVALID_REQUEST_BODIES: Record<string, InvalidExpectation[]> = {
  // cobBody6 / cobBody8 / cobBody9 (CobBody examples 2-4): the Saque/Troco
  // examples omit the required `calendario`.
  "CobBody[1]": [{ example: "cobBody6", includes: [': missing required property "calendario"'] }],
  "CobBody[2]": [{ example: "cobBody8", includes: [': missing required property "calendario"'] }],
  "CobBody[3]": [{ example: "cobBody9", includes: [': missing required property "calendario"'] }],
  // cobBody1 (CobVBody example 1): multa/juros/desconto `modalidade` written as
  // strings ("2") where the schema declares integer.
  "CobVBody[0]": [
    {
      example: "cobBody1",
      includes: [
        "valor.multa.modalidade: expected number, received string",
        "valor.juros.modalidade: expected number, received string",
        "valor.desconto.modalidade: expected number, received string",
      ],
    },
  ],
};

/** Response examples that contradict the schemas, with the failing paths. */
const INVALID_RESPONSES: Record<string, InvalidExpectation[]> = {
  // cobResponse1-7: the `loc` objects never carry `criacao` (PayloadLocation
  // requires it; the dedicated location examples all do) — cobResponse2 also
  // omits `tipoCob`. Upstream documentation bug, not a schema defect.
  "GetCobTxid[200][0]": [
    { example: "cobResponse1", includes: ['loc: missing required property "criacao"'] },
  ],
  "GetCobTxid[200][1]": [
    { example: "cobResponse2", includes: ['loc: missing required property "tipoCob"'] },
  ],
  "GetCobTxid[200][2]": [
    { example: "cobResponse5", includes: ['loc: missing required property "criacao"'] },
  ],
  "GetCobTxid[200][3]": [
    { example: "cobResponse6", includes: ['loc: missing required property "criacao"'] },
  ],
  "GetCobTxid[200][4]": [
    { example: "cobResponse7", includes: ['loc: missing required property "criacao"'] },
  ],
  "PutCobTxid[201][0]": [
    { example: "cobResponse1", includes: ['loc: missing required property "criacao"'] },
  ],
  "PutCobTxid[201][1]": [
    { example: "cobResponse5", includes: ['loc: missing required property "criacao"'] },
  ],
  "PutCobTxid[201][2]": [
    { example: "cobResponse6", includes: ['loc: missing required property "criacao"'] },
  ],
  "PutCobTxid[201][3]": [
    { example: "cobResponse7", includes: ['loc: missing required property "criacao"'] },
  ],
  "PatchCobTxid[200][0]": [
    { example: "cobResponse3", includes: ['loc: missing required property "criacao"'] },
  ],
  "GetCob[200][0]": [
    {
      example: "getCobs1 (cobs[0] = cobResponse1)",
      includes: ['cobs[0].loc: missing required property "criacao"'],
    },
    {
      example: "getCobs1 (cobs[1] = cobResponse2)",
      includes: ['cobs[1].loc: missing required property "tipoCob"'],
    },
  ],
  "GetCob[200][1]": [
    {
      example: "getCobs2 (cobs[0] = cobResponse1)",
      includes: ['cobs[0].loc: missing required property "criacao"'],
    },
  ],
  "PostCob[201][0]": [
    { example: "cobResponse1", includes: ['loc: missing required property "criacao"'] },
  ],
  "PostCob[201][1]": [
    { example: "cobResponse5", includes: ['loc: missing required property "criacao"'] },
  ],
  "PostCob[201][2]": [
    { example: "cobResponse6", includes: ['loc: missing required property "criacao"'] },
  ],
  "PostCob[201][3]": [
    { example: "cobResponse7", includes: ['loc: missing required property "criacao"'] },
  ],
  "GetCobvTxid[200][0]": [
    { example: "cobResponse4", includes: ['loc: missing required property "criacao"'] },
  ],
  "PutCobvTxid[201][0]": [
    { example: "cobResponse4", includes: ['loc: missing required property "criacao"'] },
  ],
  "PatchCobvTxid[200][0]": [
    { example: "cobResponse4", includes: ['loc: missing required property "criacao"'] },
  ],
  "GetCobv[200][0]": [
    {
      example: "getCobsV1 (cobs[0] = cobResponse4)",
      includes: ['cobs[0].loc: missing required property "criacao"'],
    },
  ],
  // loteCobVResponse1/2 omit the required `id` of the lote.
  "GetLotecobvId[200][0]": [
    { example: "loteCobVResponse1", includes: [': missing required property "id"'] },
  ],
  "GetLotecobv[200][0]": [
    { example: "getLotesCobsV", includes: ['lotes[0]: missing required property "id"'] },
  ],
  // pixResponse2/3 use 34-character EndToEndIds; the schema fixes exactly 32.
  "GetPixE2eid[200][1]": [
    { example: "pixResponse2", includes: ["endToEndId: string length 34 exceeds maxLength 32"] },
  ],
  "GetPixE2eid[200][2]": [
    { example: "pixResponse3", includes: ["endToEndId: string length 34 exceeds maxLength 32"] },
  ],
  "GetPix[200][0]": [
    {
      example: "getPix1 (pix[1] = pixResponse2)",
      includes: ["pix[1].endToEndId: string length 34 exceeds maxLength 32"],
    },
    {
      example: "getPix1 (pix[2] = pixResponse3)",
      includes: ["pix[2].endToEndId: string length 34 exceeds maxLength 32"],
    },
  ],
  // webhookResponse1 omits the required `cnpj`.
  "GetWebhookChave[200][0]": [
    { example: "webhookResponse1", includes: [': missing required property "cnpj"'] },
  ],
  "GetWebhook[200][0]": [
    { example: "getWebhook1", includes: ['webhooks[0]: missing required property "cnpj"'] },
  ],
  // recResponse1-8 write `nome:` where the schema declares `status:` in
  // `atualizacao`; recResponse1 also omits ativacao.tipoJornada and
  // recResponse7 exceeds vinculo.objeto maxLength by one character.
  "GetRecIdRec[200][0]": [
    { example: "recResponse3", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "GetRecIdRec[200][1]": [
    { example: "recResponse4", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "GetRecIdRec[200][2]": [
    { example: "recResponse5", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "GetRecIdRec[200][3]": [
    { example: "recResponse6", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "GetRecIdRec[200][4]": [
    {
      example: "recResponse7",
      includes: ["vinculo.objeto: string length 36 exceeds maxLength 35"],
    },
  ],
  "GetRecIdRec[200][5]": [
    { example: "recResponse8", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "PatchRecIdRec[200][0]": [
    { example: "recResponse1", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "GetRec[200][0]": [
    {
      example: "getRec1",
      includes: ['recs[0].atualizacao[0]: missing required property "status"'],
    },
  ],
  "PostRec[201][0]": [
    { example: "recResponse1", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  "PostRec[201][1]": [
    { example: "recResponse2", includes: ['atualizacao[0]: missing required property "status"'] },
  ],
  // solicRecResponse1-3: recPayload omits the required politicaRetentativa
  // (RecConfiguracao) and recebedor.ispbParticipante (RecPayload).
  "PostSolicrec[201][0]": [
    {
      example: "solicRecResponse1",
      includes: ['recPayload: missing required property "politicaRetentativa"'],
    },
  ],
  "GetSolicrecIdSolicRec[200][0]": [
    {
      example: "solicRecResponse1",
      includes: ['recPayload: missing required property "politicaRetentativa"'],
    },
  ],
  "GetSolicrecIdSolicRec[200][1]": [
    {
      example: "solicRecResponse2",
      includes: ['recPayload: missing required property "politicaRetentativa"'],
    },
  ],
  "PatchSolicrecIdSolicRec[201][0]": [
    {
      example: "solicRecResponse3",
      includes: ['recPayload: missing required property "politicaRetentativa"'],
    },
  ],
  // cobRResponse2-4 / getCobR1: recebedor omits cnpj/nome (PessoaJuridica-
  // Recorrencia composed into CobRGerada), tipoConta uses "POUPANÇA" (cedilla)
  // and tentativas omit their required atualizacao history.
  "GetCobrTxid[200][1]": [
    {
      example: "cobRResponse3",
      includes: ['tentativas[0]: missing required property "atualizacao"'],
    },
  ],
  "GetCobrTxid[200][2]": [
    {
      example: "cobRResponse4",
      includes: ['tentativas[0]: missing required property "atualizacao"'],
    },
  ],
  "PutCobrTxid[201][0]": [
    { example: "cobRResponse2", includes: ['recebedor: missing required property "cnpj"'] },
  ],
  "PatchCobrTxid[200][0]": [
    { example: "cobRResponse4", includes: ['recebedor.tipoConta: value "POUPANÇA" is not one of'] },
  ],
  "PostCobr[201][0]": [
    { example: "cobRResponse1", includes: ['recebedor: missing required property "cnpj"'] },
  ],
  "PostCobrTxidRetentativaData[201][0]": [
    {
      example: "cobRResponse3",
      includes: ['tentativas[0]: missing required property "atualizacao"'],
    },
  ],
};

function key(op: string, code: number | string, index: number): string {
  return `${op}[${code}][${index}]`;
}

describe("official request-body examples", () => {
  it("every example validates, except the documented upstream contradictions", () => {
    const seen: string[] = [];
    for (const [bodyName, examples] of Object.entries(requestBodyExamples)) {
      for (const [index, example] of examples.entries()) {
        const id = `${bodyName}[${index}]`;
        seen.push(id);
        const validator = requestBodyValidators[bodyName];
        expect(validator, `missing validator for request body ${bodyName}`).toBeDefined();
        if (validator === undefined) continue;
        const result = validator(example);
        const expected = INVALID_REQUEST_BODIES[id];
        if (expected === undefined) {
          if (!result.ok) {
            throw new Error(
              `${id} unexpectedly invalid:\n${result.issues.map((i) => `  ${i.path}: ${i.message}`).join("\n")}`,
            );
          }
        } else {
          expect(result.ok, `${id} should be invalid (see INVALID_REQUEST_BODIES)`).toBe(false);
          if (!result.ok) {
            const paths = result.issues.map((issue) => `${issue.path}: ${issue.message}`);
            for (const expectation of expected) {
              for (const include of expectation.includes) {
                expect(
                  paths.some((path) => path.includes(include)),
                  `${id} (${expectation.example}) should report:\n  ${include}\nreported:\n${paths.join("\n  ")}`,
                ).toBe(true);
              }
            }
          }
        }
      }
    }
    // Guard: every curated expectation is actually exercised.
    for (const id of Object.keys(INVALID_REQUEST_BODIES)) {
      expect(seen, `curated expectation ${id} does not match any example`).toContain(id);
    }
  });
});

describe("official response examples", () => {
  it("every 2xx and 4xx/5xx example validates against its schema, except the documented upstream contradictions", () => {
    const seen: string[] = [];
    for (const [opName, byCode] of Object.entries(operationResponseExamples)) {
      const operation = OPERATIONS[opName];
      expect(operation, `unknown operation ${opName}`).toBeDefined();
      if (operation === undefined) continue;
      for (const [code, examples] of Object.entries(byCode)) {
        const schemaName = operation.responses.find(
          (response) => response.code === Number(code),
        )?.schema;
        expect(schemaName, `no schema for ${opName}[${code}]`).toBeDefined();
        if (schemaName === undefined) continue;
        const validator =
          schemaName === "Problema" ? validateProblema : schemaValidators[schemaName];
        expect(validator, `no validator for schema ${schemaName}`).toBeDefined();
        if (validator === undefined) continue;
        for (const [index, example] of examples.entries()) {
          const id = key(opName, code, index);
          seen.push(id);
          const result = validator(example);
          const expected = INVALID_RESPONSES[id];
          if (expected === undefined) {
            if (!result.ok) {
              throw new Error(
                `${id} unexpectedly invalid:\n${result.issues.map((i) => `  ${i.path}: ${i.message}`).join("\n")}`,
              );
            }
          } else {
            expect(result.ok, `${id} should be invalid (see INVALID_RESPONSES)`).toBe(false);
            if (!result.ok) {
              const paths = result.issues.map((issue) => `${issue.path}: ${issue.message}`);
              for (const expectation of expected) {
                for (const include of expectation.includes) {
                  expect(
                    paths.some((path) => path.includes(include)),
                    `${id} (${expectation.example}) should report:\n  ${include}\nreported:\n${paths
                      .map((path) => path)
                      .join("\n  ")}`,
                  ).toBe(true);
                }
              }
            }
          }
        }
      }
    }
    for (const id of Object.keys(INVALID_RESPONSES)) {
      expect(seen, `curated expectation ${id} does not match any example`).toContain(id);
    }
  });

  it("the valid set is substantial: the upstream file is mostly consistent", () => {
    const total =
      Object.values(operationResponseExamples).reduce(
        (sum, byCode) =>
          sum + Object.values(byCode).reduce((inner, examples) => inner + examples.length, 0),
        0,
      ) + Object.values(requestBodyExamples).reduce((sum, examples) => sum + examples.length, 0);
    const invalid =
      Object.keys(INVALID_REQUEST_BODIES).length + Object.keys(INVALID_RESPONSES).length;
    // Sanity guard: if this ratio ever shifts dramatically, the curated table
    // needs a review (either the upstream spec changed, or a validator broke).
    expect(total).toBeGreaterThan(180);
    expect(invalid).toBeGreaterThan(30);
    expect(invalid / total).toBeLessThan(0.3);
  });
});
