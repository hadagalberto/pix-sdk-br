/**
 * Proves the generated validators enforce every constraint type present in the
 * spec, using known-valid and known-invalid vectors against the real schemas
 * (not synthetic ones). Also verifies each documented erratum by demonstrating
 * the behaviour it enables.
 */

import { describe, expect, it } from "vitest";
import {
  validateCobBase,
  validateCobCompleta,
  validateCobDataDeVencimento,
  validateCobExpiracao,
  validateCobRBase,
  validateCobSolicitada,
  validateCobStatus,
  validateCobVValor,
  validateCobValor,
  validateCobGerada,
  validateDadosBancariosRecebedor,
  validateDadosComplementaresPessoa,
  validateDevolucao,
  validateDevolucaoId,
  validateLoteCobVBody,
  validatePessoaFisica,
  validatePessoaJuridica,
  validatePix,
  validatePixConsultados,
  validateProblema,
  validateRecBase,
  validateRecConfiguracao,
  validateRecEncerramento,
  validateRecNotification,
  validateSolicRecCompleta,
  validateTxId,
  validateWebhookCompleto,
  validateWebhookPixBody,
  validateWebhookRecBody,
} from "../src/generated/validators.js";
import type { ValidationResult } from "../src/validation/engine.js";
import {
  validateGetCobQuery,
  validateGetCobrTxidPath,
  validateGetLocIdPath,
  validateGetPixE2eidDevolucaoIdPath,
  validateGetRecIdRecQuery,
  validatePutCobTxidPath,
} from "../src/generated/operations.js";

type Validator = (value: unknown) => ValidationResult<unknown>;

function issuesOf(validator: Validator, value: unknown): string[] {
  const result = validator(value);
  expect(result.ok, `expected validation failure, got success: ${JSON.stringify(value)}`).toBe(
    false,
  );
  if (!result.ok) return result.issues.map((issue) => `${issue.path}: ${issue.message}`);
  throw new Error("unreachable");
}

function expectValid(validator: Validator, value: unknown): void {
  const result = validator(value);
  if (!result.ok) {
    throw new Error(
      `expected valid, got: ${result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ")}`,
    );
  }
  expect(result.ok).toBe(true);
}

describe("pattern constraints", () => {
  it("txid: [a-zA-Z0-9]{26,35} is a full-string match (BCB spec intent)", () => {
    expectValid(validateTxId, "a".repeat(26));
    expectValid(validateTxId, "9".repeat(35));
    expect(issuesOf(validateTxId, "a".repeat(25))).toEqual([
      ": string does not match pattern /[a-zA-Z0-9]{26,35}/",
    ]);
    expect(issuesOf(validateTxId, "has spaces and !")).toEqual([
      ": string does not match pattern /[a-zA-Z0-9]{26,35}/",
    ]);
    expect(issuesOf(validateTxId, 123)).toEqual([": expected string, received number"]);
    // Review finding: an unanchored search accepted a 40-char value that merely
    // CONTAINED a valid 26–35 char run. The BCB regex constrains the whole txid.
    expect(issuesOf(validateTxId, "a".repeat(40))).toEqual([
      ": string does not match pattern /[a-zA-Z0-9]{26,35}/",
    ]);
    expect(issuesOf(validateTxId, `!${"a".repeat(30)}`)).toEqual([
      ": string does not match pattern /[a-zA-Z0-9]{26,35}/",
    ]);
  });

  it("CPF: the slash-delimited upstream pattern is unwrapped by the erratum", () => {
    // PessoaFisica.cpf pattern is written "/^\d{11}$/" upstream; with the
    // erratum the plain 11-digit form validates.
    expectValid(validatePessoaFisica, { cpf: "12345678909", nome: "Francisco da Silva" });
    expect(issuesOf(validatePessoaFisica, { cpf: "123.456.789-09", nome: "X" })).toEqual([
      "cpf: string does not match pattern /^\\d{11}$/",
    ]);
    expect(issuesOf(validatePessoaFisica, { cpf: "1234567890" })).toContain(
      ': missing required property "nome"',
    );
  });

  it("CNPJ: ^[0-9A-Z]{14}$", () => {
    expectValid(validatePessoaJuridica, { cnpj: "12345678000195", nome: "Empresa SA" });
    expect(issuesOf(validatePessoaJuridica, { cnpj: "1234567800019a", nome: "E" })).toEqual([
      "cnpj: string does not match pattern /^[0-9A-Z]{14}$/",
    ]);
  });

  it("money values: \\d{1,10}\\.\\d{2}", () => {
    const cobValor = (original: unknown): unknown => ({ original });
    expectValid(validateCobValor, cobValor("1234567890.99"));
    expect(issuesOf(validateCobValor, cobValor("1,00"))).toEqual([
      "original: string does not match pattern /\\d{1,10}\\.\\d{2}/",
    ]);
    expect(issuesOf(validateCobValor, cobValor("free text"))).toEqual([
      "original: string does not match pattern /\\d{1,10}\\.\\d{2}/",
    ]);
    expect(issuesOf(validateCobValor, cobValor(1.0))).toEqual([
      "original: expected string, received number",
    ]);
    // Review finding: an unanchored search accepted an 11-digit integer part
    // containing a valid 10-digit run. The BCB money pattern constrains the
    // whole value ("0.00" format with at most 10 integer digits).
    expect(issuesOf(validateCobValor, cobValor("12345678901.00"))).toEqual([
      "original: string does not match pattern /\\d{1,10}\\.\\d{2}/",
    ]);
  });
});

describe("enum constraints", () => {
  it("CobStatus union", () => {
    expectValid(validateCobStatus, "ATIVA");
    expect(issuesOf(validateCobStatus, "ATIVA ")).toEqual([
      ': value "ATIVA " is not one of ["ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"]',
    ]);
  });

  it("tipoConta is ASCII in the spec: POUPANÇA (cedilla) is rejected", () => {
    expectValid(validateDadosBancariosRecebedor, { conta: "1", tipoConta: "POUPANCA" });
    expect(
      issuesOf(validateDadosBancariosRecebedor, { conta: "1", tipoConta: "POUPANÇA" }),
    ).toEqual(['tipoConta: value "POUPANÇA" is not one of ["CORRENTE", "POUPANCA", "PAGAMENTO"]']);
  });

  it("politicaRetentativa", () => {
    expectValid(validateRecConfiguracao, { politicaRetentativa: "PERMITE_3R_7D" });
    expect(issuesOf(validateRecConfiguracao, { politicaRetentativa: "SEMPRE" })).toEqual([
      'politicaRetentativa: value "SEMPRE" is not one of ["NAO_PERMITE", "PERMITE_3R_7D"]',
    ]);
  });
});

describe("length constraints", () => {
  it("maxLength on free text fields", () => {
    expectValid(validateDadosComplementaresPessoa, { uf: "SP", cep: "70055751" });
    expect(issuesOf(validateDadosComplementaresPessoa, { uf: "SPP" })).toEqual([
      "uf: string length 3 exceeds maxLength 2",
    ]);
    expect(issuesOf(validateDadosComplementaresPessoa, { cep: "c".repeat(9) })).toEqual([
      "cep: string length 9 exceeds maxLength 8",
    ]);
  });

  it("maxLength on chave (77)", () => {
    expectValid(validateCobBase, { chave: "c".repeat(77) });
    expect(issuesOf(validateCobBase, { chave: "c".repeat(78) })).toEqual([
      "chave: string length 78 exceeds maxLength 77",
    ]);
  });
});

describe("format constraints", () => {
  it("date (calendario.dataDeVencimento)", () => {
    expectValid(validateCobDataDeVencimento, { dataDeVencimento: "2020-12-31" });
    expect(issuesOf(validateCobDataDeVencimento, { dataDeVencimento: "2020-12-32" })).toEqual([
      "dataDeVencimento: string is not a valid RFC 3339 date (expected YYYY-MM-DD)",
    ]);
    expect(issuesOf(validateCobDataDeVencimento, { dataDeVencimento: "31-12-2020" })).toEqual([
      "dataDeVencimento: string is not a valid RFC 3339 date (expected YYYY-MM-DD)",
    ]);
  });

  it("date-time (horario.solicitacao on devoluções)", () => {
    expect(
      issuesOf(validateDevolucao, {
        id: "a".repeat(5),
        rtrId: "D".repeat(32),
        valor: "10.00",
        horario: { solicitacao: "2020-09-09 20:15:00" },
        status: "DEVOLVIDO",
      }),
    ).toEqual([
      "horario.solicitacao: string is not a valid RFC 3339 date-time (expected YYYY-MM-DDTHH:MM:SS[.frac](Z|±HH:MM))",
    ]);
  });

  it("uri: absolute webhook URLs validate; relative location values too; junk does not", () => {
    expectValid(validateWebhookCompleto, {
      webhookUrl: "https://pix.example.com/api/webhook/",
      cnpj: "12345678000195",
      criacao: "2020-11-11T10:15:00.358Z",
    });
    const relativeLocation: Validator = (value: unknown) =>
      validateCobGerada({
        calendario: { criacao: "2020-09-09T20:15:00.358Z", expiracao: 3600 },
        txid: "a".repeat(30),
        revisao: 0,
        status: "ATIVA",
        valor: { original: "123.45" },
        chave: "k",
        location: value,
      });
    expectValid(relativeLocation, "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25");
    expect(issuesOf(relativeLocation, "not a location")).toEqual([
      "location: string is not a valid URI",
    ]);
  });
});

describe("numeric constraints", () => {
  it("integer type (calendario.expiracao)", () => {
    expect(issuesOf(validateCobExpiracao, { expiracao: "3600" })).toEqual([
      "expiracao: expected number, received string",
    ]);
    expect(issuesOf(validateCobExpiracao, { expiracao: 1.5 })).toEqual([
      "expiracao: expected integer, received 1.5",
    ]);
  });

  it("minimum/maximum (valor.multa.modalidade 1..2, juros 1..8)", () => {
    expectValid(validateCobVValor, { multa: { modalidade: 1, valorPerc: "15.00" } });
    expect(issuesOf(validateCobVValor, { multa: { modalidade: 3, valorPerc: "15.00" } })).toEqual([
      "multa.modalidade: number 3 exceeds maximum 2",
    ]);
    expect(issuesOf(validateCobVValor, { juros: { modalidade: 0, valorPerc: "2.00" } })).toEqual([
      "juros.modalidade: number 0 is less than minimum 1",
    ]);
  });
});

describe("required properties and booleans", () => {
  it("CobSolicitada requires calendario/valor/chave (composed allOf requirements included)", () => {
    expectValid(validateCobSolicitada, {
      calendario: { expiracao: 3600 },
      chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
      valor: { original: "37.00" },
    });
    expect(issuesOf(validateCobSolicitada, { valor: { original: "37.00" } })).toEqual([
      ': missing required property "chave"',
      ': missing required property "calendario"',
    ]);
    // valor.original comes from a bare-required allOf member.
    expect(issuesOf(validateCobSolicitada, { calendario: {}, chave: "k", valor: {} })).toContain(
      'valor: missing required property "original"',
    );
  });

  it("boolean type (ajusteDiaUtil)", () => {
    expectValid(validateCobRBase, {
      calendario: { dataDeVencimento: "2024-04-15" },
      valor: { original: "106.07" },
      ajusteDiaUtil: true,
    });
    expect(
      issuesOf(validateCobRBase, {
        calendario: { dataDeVencimento: "2024-04-15" },
        valor: { original: "106.07" },
        ajusteDiaUtil: "true",
      }),
    ).toEqual(["ajusteDiaUtil: expected boolean, received string"]);
    expect(
      issuesOf(validateCobRBase, {
        calendario: { dataDeVencimento: "2024-04-15" },
        valor: { original: "106.07" },
      }),
    ).toEqual([': missing required property "ajusteDiaUtil"']);
  });
});

describe("oneOf / anyOf composition", () => {
  it("devedor: exactly one of PessoaFisica / PessoaJuridica", () => {
    expectValid(validateCobSolicitada, {
      calendario: { expiracao: 3600 },
      chave: "k",
      valor: { original: "1.00" },
      devedor: { cpf: "12345678909", nome: "F" },
    });
    expectValid(validateCobSolicitada, {
      calendario: { expiracao: 3600 },
      chave: "k",
      valor: { original: "1.00" },
      devedor: { cnpj: "12345678000195", nome: "E" },
    });
    expect(
      issuesOf(validateCobSolicitada, {
        calendario: { expiracao: 3600 },
        chave: "k",
        valor: { original: "1.00" },
        devedor: { cpf: "12345678909", cnpj: "12345678000195", nome: "X" },
      }),
    ).toContain("devedor: must match exactly one of 2 alternatives (matched 2)");
  });

  it("retirada: saque and troco are mutually exclusive (erratum retirada-oneof-required-branches)", () => {
    const saque = {
      valor: "5.00",
      modalidadeAgente: "AGFSS",
      prestadorDoServicoDeSaque: "12345678",
    };
    const troco = {
      valor: "5.00",
      modalidadeAgente: "AGTEC",
      prestadorDoServicoDeSaque: "12345678",
    };
    expectValid(validateCobValor, { original: "0.00", retirada: { saque } });
    expectValid(validateCobValor, { original: "10.00", retirada: { troco } });
    expect(issuesOf(validateCobValor, { original: "0.00", retirada: { saque, troco } })).toContain(
      "retirada: must match exactly one of 2 alternatives (matched 2)",
    );
  });

  it("encerramento: rejeicao and cancelamento are mutually exclusive (erratum)", () => {
    expectValid(validateRecEncerramento, {
      encerramento: {
        cancelamento: { solicitante: "USUARIO_RECEBEDOR", codigo: "SLCR", descricao: "d" },
      },
    });
    expect(
      issuesOf(validateRecEncerramento, {
        encerramento: {
          cancelamento: { solicitante: "USUARIO_RECEBEDOR", codigo: "SLCR", descricao: "d" },
          rejeicao: { codigo: "AP13", descricao: "d" },
        },
      }),
    ).toContain("encerramento: must match exactly one of 2 alternatives (matched 2)");
  });

  it("componentesValor: anyOf requires at least one populated branch (erratum)", () => {
    const base = {
      endToEndId: "E".repeat(32),
      valor: "100.00",
      horario: "2020-09-09T20:15:00.358Z",
    };
    expectValid(validatePix, { ...base, componentesValor: { original: { valor: "100.00" } } });
    expectValid(validatePix, {
      ...base,
      componentesValor: {
        original: { valor: "100.00" },
        saque: { valor: "1.00", modalidadeAgente: "AGFSS", prestadorDoServicoDeSaque: "12345678" },
      },
    });
    expect(issuesOf(validatePix, { ...base, componentesValor: {} })).toContain(
      "componentesValor: must match at least one of 7 alternatives",
    );
  });
});

describe("array constraints", () => {
  const item = (data: string): unknown => ({ data, valorPerc: "30.00" });

  it("descontoDataFixa discriminates via the oneOf: valid lists pass, empty/oversized/duplicated do not", () => {
    expectValid(validateCobVValor, {
      desconto: { modalidade: 1, descontoDataFixa: [item("2020-11-30"), item("2020-12-01")] },
    });
    expect(
      issuesOf(validateCobVValor, { desconto: { modalidade: 1, descontoDataFixa: [] } }),
    ).toContain("desconto: must match exactly one of 2 alternatives (matched 0)");
    expect(
      issuesOf(validateCobVValor, {
        desconto: {
          modalidade: 1,
          descontoDataFixa: ["2020-11-30", "2020-12-01", "2020-12-02", "2020-12-03"].map(item),
        },
      }),
    ).toContain("desconto: must match exactly one of 2 alternatives (matched 0)");
    expect(
      issuesOf(validateCobVValor, {
        desconto: { modalidade: 1, descontoDataFixa: [item("2020-11-30"), item("2020-11-30")] },
      }),
    ).toContain("desconto: must match exactly one of 2 alternatives (matched 0)");
  });

  it("infoAdicionais: maxItems 50 (erratum cobbase-infoadicionais-maximum)", () => {
    const many = Array.from({ length: 51 }, (_, index) => ({ nome: `n${index}`, valor: "v" }));
    expect(issuesOf(validateCobBase, { infoAdicionais: many })).toContain(
      "infoAdicionais: array length 51 exceeds maxItems 50",
    );
    expectValid(validateCobBase, {
      infoAdicionais: Array.from({ length: 50 }, (_, index) => ({ nome: `n${index}`, valor: "v" })),
    });
  });

  it("array item schemas are enforced recursively", () => {
    expect(issuesOf(validateCobBase, { infoAdicionais: [{ nome: "n", valor: 1 }] })).toEqual([
      "infoAdicionais[0].valor: expected string, received number",
    ]);
    expect(
      issuesOf(validateCobBase, { infoAdicionais: [{ nome: "n".repeat(51), valor: "v" }] }),
    ).toEqual(["infoAdicionais[0].nome: string length 51 exceeds maxLength 50"]);
  });

  it("LoteCobVBody: cobsv items require txid + the composed CobVSolicitada shape", () => {
    expectValid(validateLoteCobVBody, {
      descricao: "lote",
      cobsv: [
        {
          txid: "a".repeat(30),
          calendario: { dataDeVencimento: "2020-12-31" },
          devedor: { cpf: "12345678909", nome: "F" },
          valor: { original: "100.00" },
          chave: "7c084cd4-54af-4172-a516-a7d1a12b75cc",
        },
      ],
    });
    expect(
      issuesOf(validateLoteCobVBody, {
        descricao: "lote",
        cobsv: [{ calendario: {}, valor: {}, chave: "k" }],
      }),
    ).toContain('cobsv[0]: missing required property "txid"');
    expect(issuesOf(validateLoteCobVBody, { descricao: "lote", cobsv: "nope" })).toEqual([
      "cobsv: expected array, received string",
    ]);
  });
});

describe("errata are observable in the validators", () => {
  it("recnotification-required-quote: atualizacao (no stray quote) is the required key", () => {
    expectValid(validateRecNotification, {
      idRec: "R".repeat(29),
      status: "APROVADA",
      atualizacao: [{ status: "APROVADA", data: "2024-08-22T12:43:53.337Z" }],
    });
    // Both RecNotification's own required list and the composed
    // RecAtualizacao demand atualizacao, hence two issues.
    expect(
      issuesOf(validateRecNotification, { idRec: "R".repeat(29), status: "APROVADA" }),
    ).toEqual([
      ': missing required property "atualizacao"',
      ': missing required property "atualizacao"',
    ]);
  });

  it("pixconsultados-required-cobs: the list payload requires pix, not cobs", () => {
    const parametros = {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 0,
      },
    };
    expectValid(validatePixConsultados, { parametros, pix: [] });
    expect(issuesOf(validatePixConsultados, { parametros, cobs: [] })).toEqual([
      ': missing required property "pix"',
    ]);
  });

  it("solicrecrerec-completa-required-rec: recPayload is required (renamed from 'rec')", () => {
    expect(issuesOf(validateSolicRecCompleta, {})).toContain(
      ': missing required property "recPayload"',
    );
  });

  it("payloadlocationcob-required-tipocob: loc: { id } alone is valid", () => {
    expectValid(validateCobSolicitada, {
      calendario: { expiracao: 3600 },
      chave: "k",
      valor: { original: "1.00" },
      loc: { id: 789 },
    });
  });
});

describe("parameter validators", () => {
  it("PUT /cob/{txid} path params enforce the TxId pattern", () => {
    expectValid(validatePutCobTxidPath, { txid: "a".repeat(30) });
    expect(issuesOf(validatePutCobTxidPath, { txid: "short" })).toContain(
      "txid: string does not match pattern /[a-zA-Z0-9]{26,35}/",
    );
    expect(issuesOf(validatePutCobTxidPath, {})).toContain(': missing required property "txid"');
    // Review finding: the unanchored regex accepted 36+ char ids. The spec's
    // {26,35} quantifier bounds the ENTIRE value.
    expect(issuesOf(validatePutCobTxidPath, { txid: "a".repeat(36) })).toContain(
      "txid: string does not match pattern /[a-zA-Z0-9]{26,35}/",
    );
    expect(issuesOf(validatePutCobTxidPath, { txid: `-${"a".repeat(30)}` })).toContain(
      "txid: string does not match pattern /[a-zA-Z0-9]{26,35}/",
    );
  });

  it("devolucao id enforces [a-zA-Z0-9]{1,35} and rejects out-of-spec values", () => {
    expectValid(validateDevolucaoId, "dev1");
    expectValid(validateDevolucaoId, "a".repeat(35));
    expect(issuesOf(validateDevolucaoId, "dev-1")).toEqual([
      ": string does not match pattern /[a-zA-Z0-9]{1,35}/",
    ]);
    expect(issuesOf(validateDevolucaoId, "a".repeat(36))).toEqual([
      ": string does not match pattern /[a-zA-Z0-9]{1,35}/",
    ]);
    expect(
      issuesOf(validateGetPixE2eidDevolucaoIdPath, {
        e2eid: "a".repeat(32),
        id: "bad/id",
      }),
    ).toContain("id: string does not match pattern /[a-zA-Z0-9]{1,35}/");
  });

  it("loc id is a non-empty decimal int64 string", () => {
    expectValid(validateGetLocIdPath, { id: "789" });
    // BUG-CORRECTION (independent review): the old assertion accepted any
    // non-empty string because upstream types the /loc/{id} path param as a
    // bare `type: string`. The identifier it addresses is
    // components.schemas.PayloadLocationId (`type: integer, format: int64`),
    // so the textual path param must be a decimal int64 — see erratum
    // `location-path-id-int64`. Traversal and overflow are not valid ids.
    expect(issuesOf(validateGetLocIdPath, { id: "1/../../x" })).toEqual([
      "id: string is not a decimal integer in the int64 range",
    ]);
    expect(issuesOf(validateGetLocIdPath, { id: "9223372036854775808" })).toEqual([
      "id: string is not a decimal integer in the int64 range",
    ]);
    expect(issuesOf(validateGetLocIdPath, { id: "" })).toEqual([
      "id: string length 0 is less than minLength 1",
      "id: string is not a decimal integer in the int64 range",
    ]);
  });

  it("GET /cob query params enforce required date-times and pagination bounds", () => {
    expectValid(validateGetCobQuery, {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-02T10:00:00Z",
      cpf: "12345678909",
      locationPresente: true,
      status: "ATIVA",
      "paginacao.paginaAtual": 0,
      "paginacao.itensPorPagina": 100,
    });
    expect(issuesOf(validateGetCobQuery, { inicio: "nope" })).toEqual([
      ': missing required property "fim"',
      "inicio: string is not a valid RFC 3339 date-time (expected YYYY-MM-DDTHH:MM:SS[.frac](Z|±HH:MM))",
    ]);
    expect(
      issuesOf(validateGetCobQuery, {
        inicio: "2020-04-01T00:00:00Z",
        fim: "2020-04-02T10:00:00Z",
        "paginacao.paginaAtual": -1,
        "paginacao.itensPorPagina": 1001,
      }),
    ).toEqual([
      "paginacao.paginaAtual: number -1 is less than minimum 0",
      "paginacao.itensPorPagina: number 1001 exceeds maximum 1000",
    ]);
  });

  it("GET /rec/{idRec} query param enforces the txid filter pattern", () => {
    expectValid(validateGetRecIdRecQuery, { txid: "a".repeat(26) });
    expect(issuesOf(validateGetRecIdRecQuery, { txid: "abc" })).toContain(
      "txid: string does not match pattern /[a-zA-Z0-9]{26,35}/",
    );
  });

  it("GET /cobr/{txid} path param enforces TxId", () => {
    expectValid(validateGetCobrTxidPath, { txid: "A".repeat(35) });
    expect(issuesOf(validateGetCobrTxidPath, { txid: 42 })).toEqual([
      "txid: expected string, received number",
    ]);
  });
});

describe("webhook callback payloads", () => {
  it("pix webhook body: array of consulted Pix objects", () => {
    expectValid(validateWebhookPixBody, {
      pix: [
        {
          endToEndId: "E87654321202009091221dfghi123456",
          txid: "971122d8f37211eaadc10242ac120002",
          valor: "110.00",
          horario: "2020-09-09T20:15:00.358Z",
          infoPagador: "0123456789",
        },
      ],
    });
    // pixWebhook1 from the spec models devolucoes as an object — the schema
    // (and the pacs.004 reality) demands an array.
    expect(
      issuesOf(validateWebhookPixBody, {
        pix: [
          {
            endToEndId: "E12345678202009091221kkkkkkkkkkk",
            txid: "c3e0e7a4e7f1469a9f782d3d4999343c",
            valor: "110.00",
            horario: "2020-09-09T20:15:00.358Z",
            infoPagador: "0123456789",
            devolucoes: {
              id: "123ABC",
              rtrId: "D".repeat(32),
              valor: "10.00",
              horario: {},
              status: "EM_PROCESSAMENTO",
            },
          },
        ],
      }),
    ).toContain("pix[0].devolucoes: expected array, received object");
  });

  it("rec webhook body: recs array of RecNotification", () => {
    expectValid(validateWebhookRecBody, {
      recs: [
        {
          idRec: "RR1026652320240821lab77511abf",
          status: "APROVADA",
          atualizacao: [{ status: "CRIADA", data: "2024-08-20T10:12:07.567Z" }],
          ativacao: {
            tipoJornada: "JORNADA_3",
            dadosJornada: { txid: "r9eFIFmwcZ55Nm4RsKZAAtIvvCrlcNN6" },
          },
        },
      ],
    });
    expect(issuesOf(validateWebhookRecBody, { recs: [{ status: "APROVADA" }] })).toContain(
      'recs[0]: missing required property "idRec"',
    );
  });
});

describe("problem+json error bodies", () => {
  it("Problema validates RFC 7807 vectors from the spec", () => {
    expectValid(validateProblema, {
      type: "https://pix.bcb.gov.br/api/v2/error/CobOperacaoInvalida",
      title: "Cobrança inválida.",
      status: 400,
      detail: "…",
      violacoes: [
        {
          razao: "O campo cob.valor.original não respeita o _schema_.",
          propriedade: "cob.valor.original",
        },
      ],
    });
    expect(issuesOf(validateProblema, { title: "x", status: 400 })).toEqual([
      ': missing required property "type"',
    ]);
  });

  it("CobCompleta composes CobGerada with status, pix, tributo and valorLiquidoEstimado", () => {
    const complete = {
      calendario: { criacao: "2020-09-09T20:15:00.358Z", expiracao: 3600 },
      txid: "7978c0c97ea847e78e8849634473c1f1",
      revisao: 0,
      loc: {
        id: 789,
        location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
        tipoCob: "cob",
        criacao: "2020-09-09T20:15:00.358Z",
      },
      status: "ATIVA",
      valor: { original: "37.00" },
      chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
    };
    expectValid(validateCobCompleta, complete);
    // The status enum is enforced both by CobGerada (composed) and by
    // CobCompleta's own status member, hence two issues.
    expect(issuesOf(validateCobCompleta, { ...complete, status: "STATUS_INEXISTENTE" })).toEqual([
      'status: value "STATUS_INEXISTENTE" is not one of ["ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"]',
      'status: value "STATUS_INEXISTENTE" is not one of ["ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"]',
    ]);
  });
});

describe("RecBase (post-errata shape)", () => {
  it("requires vinculo and calendario only — retentativa/idRec removed by errata", () => {
    expectValid(validateRecBase, {
      vinculo: { contrato: "63100862", devedor: { cpf: "45164632481", nome: "Fulano de Tal" } },
      calendario: { dataInicial: "2024-04-01", periodicidade: "MENSAL" },
    });
    expect(issuesOf(validateRecBase, {})).toEqual([
      ': missing required property "calendario"',
      ': missing required property "vinculo"',
    ]);
  });
});
