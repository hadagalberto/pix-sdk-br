/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Runtime validators (constraint IR) for every named schema in the spec, plus one validator per request body. Evaluation lives in src/validation/engine.ts.
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

import { validate, type Constraint, type ValidationResult } from "../validation/index.js";
import type {
  TxId,
  EndToEndId,
  DevolucaoId,
  DevolucaoSolicitadaNatureza,
  DevolucaoNatureza,
  DevolucaoNaturezaPixAutomatico,
  PayloadLocationId,
  PayloadLocationRecId,
  Revisao,
  PessoaFisica,
  PessoaJuridica,
  PessoaFisicaRecorrencia,
  PessoaJuridicaRecorrencia,
  CPF,
  CNPJ,
  DadosComplementaresPessoa,
  DadosDevedor,
  DadosDevedorRecorrencia,
  DadosRecebedor,
  DadosBancarios,
  DadosBancariosRecebedor,
  DadosPagadorRec,
  WebhookSolicitado,
  WebhookCompleto,
  WebhookRecBase,
  WebhookRecCompleto,
  WebhookCobRCompleto,
  WebhookCobCompleto,
  WebhookCobVSolicitado,
  WebhookCobVCompleto,
  InfoBaseAgenciaConta,
  InfoBaseChave,
  WebhookRecSolicitado,
  WebhookCobRSolicitado,
  WebhookCobSolicitado,
  CobExpiracao,
  CobDataDeVencimento,
  CobApresentacao,
  CobCriacao,
  CobVValor,
  CobValor,
  CobPayloadValor,
  CobVPayloadValor,
  RecCompleta,
  RecCompletaPesquisada,
  RecGerada,
  RecSolicitada,
  RecPayload,
  RecRevisada,
  RecNotification,
  RecAtivacao,
  RecAtivacaoSolicitada,
  RecStatus,
  RecConfiguracao,
  RecAtualizacao,
  RecEncerramento,
  RecId,
  RecBase,
  SolicRecId,
  SolicRecBase,
  SolicRecStatus,
  SolicRecAtualizacao,
  SolicRecEncerramento,
  SolicRecSolicitada,
  SolicRecRevisada,
  SolicRecCompleta,
  TributoCompleto,
  TributoCompletoPix,
  TributoPayload,
  TributoInformadoCompleto,
  TributoInformadoSolicitado,
  RegistroCategoriaTributoInformadoSolicitado,
  RegistroCategoriaTributoInformadoCompleto,
  RegistroCategoriaTributoPayload,
  RegistroCategoriaTributoCompleto,
  RegistroCategoriaTributoCompletoPix,
  ValorTributoDetalheCompleto,
  ValorTributoDetalheSolicitado,
  ValorLiquidoEstimado,
  CobRGerada,
  CobRCompleta,
  CobRAtualizacao,
  CobRTentativas,
  CobRRevisada,
  CobRSolicitada,
  CobRNotification,
  CobNotification,
  CobVNotification,
  CobRConfiguracao,
  CobRStatus,
  CobRStatusRevisada,
  CobRBase,
  CobBase,
  CobBaseCopiaCola,
  CobSolicitada,
  CobVSolicitada,
  CobRevisada,
  CobVRevisada,
  CobGerada,
  CobVGerada,
  CobStatus,
  CobVStatus,
  LoteCobVGerado,
  CobVCompleta,
  CobCompleta,
  LoteCobVConsultado,
  LotesCobVConsultados,
  CobVPayload,
  CobPayload,
  PayloadLocation,
  PayloadLocationSolicitada,
  PayloadLocationRecSolicitada,
  PayloadLocationRecGerada,
  PayloadLocationRecCompleta,
  PayloadLocationCompleta,
  PayloadLocationCob,
  ParametrosConsultaRec,
  ParametrosConsultaCob,
  ParametrosConsultaCobR,
  ParametrosConsultaLote,
  CobsVConsultadas,
  CobsConsultadas,
  CobsRConsultadas,
  RecsConsultadas,
  Pix,
  PixAutomatico,
  PixValorOriginal,
  PixValorSaque,
  PixValorTroco,
  PixValorJuros,
  PixValorMulta,
  PixValorDesconto,
  PixValorAbatimento,
  Devolucao,
  DevolucaoPixAutomatico,
  DevolucaoSolicitada,
  ParametrosConsultaPayloadLocation,
  ParametrosConsultaPayloadLocationRec,
  PayloadLocationConsultadas,
  PayloadLocationRecConsultadas,
  ParametrosConsultaPix,
  ParametrosConsultaWebhooks,
  PixConsultado,
  PixAutomaticoConsultado,
  PixConsultados,
  WebhooksConsultados,
  WebhooksRecConsultados,
  Paginacao,
  Violacao,
  Problema,
  Inicio,
  Fim,
  LoteCobVBody,
  LoteCobVBodyRevisado,
  WebhookPixBody,
  WebhookRecBody,
  WebhookCobRBody,
  WebhookCobBody,
  WebhookCobVBody,
  GetPixE2eidResponseSchema,
  PostCobrTxidRetentativaDataResponseSchema,
  CobBody,
  CobRBody,
  CobVBody,
  CobBodyRevisada,
  CobRBodyRevisada,
  CobVBodyRevisada,
  PayloadLocationBody,
  PayloadLocationRecBody,
  DevolucaoBody,
  WebhookConfigBody,
  WebhookRecConfigBody,
  WebhookCobRConfigBody,
  WebhookCobConfigBody,
  WebhookCobVConfigBody,
  SolicRecBody,
  SolicRecBodyRevisada,
  RecBody,
  RecBodyRevisada,
} from "./schemas.js";

/**
 * Constraint IR for each named schema, in spec order. Values reference each
 * other by name through `{ kind: "ref" }` and are resolved via `constraintRegistry`.
 */
const cTxId: Constraint = { kind: "string", pattern: /[a-zA-Z0-9]{26,35}/ };
const cEndToEndId: Constraint = {
  kind: "string",
  minLength: 32,
  maxLength: 32,
  pattern: /[a-zA-Z0-9]{32}/,
};
const cDevolucaoId: Constraint = { kind: "string", pattern: /[a-zA-Z0-9]{1,35}/ };
const cDevolucaoSolicitadaNatureza: Constraint = {
  kind: "string",
  enumValues: ["ORIGINAL", "RETIRADA"],
};
const cDevolucaoNatureza: Constraint = {
  kind: "string",
  enumValues: ["ORIGINAL", "RETIRADA", "MED_OPERACIONAL", "MED_FRAUDE", "MED_PIX_AUTOMATICO"],
};
const cDevolucaoNaturezaPixAutomatico: Constraint = {
  kind: "string",
  enumValues: ["ORIGINAL", "MED_PIX_AUTOMATICO", "MED_FRAUDE"],
};
const cPayloadLocationId: Constraint = { kind: "number", integer: true };
const cPayloadLocationRecId: Constraint = { kind: "number", integer: true };
const cRevisao: Constraint = { kind: "number", integer: true };
const cPessoaFisica: Constraint = {
  kind: "object",
  properties: {
    cpf: { kind: "string", pattern: /^\d{11}$/ },
    nome: { kind: "string", maxLength: 200 },
  },
  required: ["cpf", "nome"],
  additionalProperties: true,
};
const cPessoaJuridica: Constraint = {
  kind: "object",
  properties: {
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    nome: { kind: "string", maxLength: 200 },
  },
  required: ["cnpj", "nome"],
  additionalProperties: true,
};
const cPessoaFisicaRecorrencia: Constraint = {
  kind: "object",
  properties: {
    cpf: { kind: "string", pattern: /^\d{11}$/ },
    nome: { kind: "string", maxLength: 140 },
  },
  required: ["cpf", "nome"],
  additionalProperties: true,
};
const cPessoaJuridicaRecorrencia: Constraint = {
  kind: "object",
  properties: {
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    nome: { kind: "string", maxLength: 140 },
  },
  required: ["cnpj", "nome"],
  additionalProperties: true,
};
const cCPF: Constraint = {
  kind: "object",
  properties: {
    cpf: { kind: "string", pattern: /^\d{11}$/ },
  },
  required: ["cpf"],
  additionalProperties: true,
};
const cCNPJ: Constraint = {
  kind: "object",
  properties: {
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
  },
  required: ["cnpj"],
  additionalProperties: true,
};
const cDadosComplementaresPessoa: Constraint = {
  kind: "object",
  properties: {
    logradouro: { kind: "string", maxLength: 200 },
    cidade: { kind: "string", maxLength: 200 },
    uf: { kind: "string", maxLength: 2 },
    cep: { kind: "string", maxLength: 8 },
  },
  required: [],
  additionalProperties: true,
};
const cDadosDevedor: Constraint = {
  kind: "object",
  properties: {
    devedor: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {
            email: { kind: "string" },
          },
          required: [],
          additionalProperties: true,
        },
        { kind: "ref", name: "DadosComplementaresPessoa" },
        {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            { kind: "ref", name: "PessoaJuridica" },
          ],
        },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cDadosDevedorRecorrencia: Constraint = {
  kind: "object",
  properties: {
    devedor: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {
            email: { kind: "string" },
          },
          required: [],
          additionalProperties: true,
        },
        { kind: "ref", name: "DadosComplementaresPessoa" },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cDadosRecebedor: Constraint = {
  kind: "object",
  properties: {
    recebedor: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: ["logradouro", "cidade", "uf", "cep"],
          additionalProperties: true,
        },
        { kind: "ref", name: "DadosComplementaresPessoa" },
        {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            {
              kind: "allOf",
              members: [
                {
                  kind: "object",
                  properties: {
                    nomeFantasia: { kind: "string", maxLength: 200 },
                  },
                  required: [],
                  additionalProperties: true,
                },
                { kind: "ref", name: "PessoaJuridica" },
              ],
            },
          ],
        },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cDadosBancarios: Constraint = {
  kind: "object",
  properties: {
    conta: { kind: "string", maxLength: 20 },
    ispbParticipante: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
    agencia: { kind: "string", maxLength: 4 },
  },
  required: ["conta", "ispbParticipante"],
  additionalProperties: true,
};
const cDadosBancariosRecebedor: Constraint = {
  kind: "object",
  properties: {
    conta: { kind: "string", maxLength: 20 },
    tipoConta: { kind: "string", enumValues: ["CORRENTE", "POUPANCA", "PAGAMENTO"] },
    agencia: { kind: "string", maxLength: 4 },
  },
  required: ["conta", "tipoConta"],
  additionalProperties: true,
};
const cDadosPagadorRec: Constraint = {
  kind: "object",
  properties: {
    pagador: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {
            ispbParticipante: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
            codMun: { kind: "string", pattern: /^\d{7}$/ },
          },
          required: ["ispbParticipante"],
          additionalProperties: true,
        },
        {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "CPF" },
            { kind: "ref", name: "CNPJ" },
          ],
        },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cWebhookSolicitado: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookCompleto: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["webhookUrl", "cnpj", "criacao"],
  additionalProperties: true,
};
const cWebhookRecBase: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookRecCompleto: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookCobRCompleto: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookCobCompleto: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookCobVSolicitado: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookCobVCompleto: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cInfoBaseAgenciaConta: Constraint = {
  kind: "object",
  properties: {
    agencia: { kind: "string", maxLength: 4 },
    conta: { kind: "string", maxLength: 20 },
  },
  required: ["agencia", "conta"],
  additionalProperties: true,
};
const cInfoBaseChave: Constraint = {
  kind: "object",
  properties: {
    tipo: { kind: "string", enumValues: ["pix"] },
    chave: { kind: "string", maxLength: 77 },
  },
  required: ["tipo", "chave"],
  additionalProperties: true,
};
const cWebhookRecSolicitado: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "WebhookRecBase" },
  ],
};
const cWebhookCobRSolicitado: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cWebhookCobSolicitado: Constraint = {
  kind: "object",
  properties: {
    webhookUrl: { kind: "string", format: "uri" },
  },
  required: ["webhookUrl"],
  additionalProperties: true,
};
const cCobExpiracao: Constraint = {
  kind: "object",
  properties: {
    expiracao: { kind: "number", integer: true },
  },
  required: [],
  additionalProperties: true,
};
const cCobDataDeVencimento: Constraint = {
  kind: "object",
  properties: {
    dataDeVencimento: { kind: "string", format: "date" },
    validadeAposVencimento: { kind: "number", integer: true },
  },
  required: ["dataDeVencimento"],
  additionalProperties: true,
};
const cCobApresentacao: Constraint = {
  kind: "object",
  properties: {
    apresentacao: { kind: "string", format: "date-time" },
  },
  required: ["apresentacao"],
  additionalProperties: true,
};
const cCobCriacao: Constraint = {
  kind: "object",
  properties: {
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["criacao"],
  additionalProperties: true,
};
const cCobVValor: Constraint = {
  kind: "object",
  properties: {
    original: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    multa: {
      kind: "object",
      properties: {
        modalidade: { kind: "number", integer: true, minimum: 1, maximum: 2 },
        valorPerc: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["modalidade", "valorPerc"],
      additionalProperties: true,
    },
    juros: {
      kind: "object",
      properties: {
        modalidade: { kind: "number", integer: true, minimum: 1, maximum: 8 },
        valorPerc: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["modalidade", "valorPerc"],
      additionalProperties: true,
    },
    abatimento: {
      kind: "object",
      properties: {
        modalidade: { kind: "number", integer: true, minimum: 1, maximum: 2 },
        valorPerc: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["modalidade", "valorPerc"],
      additionalProperties: true,
    },
    desconto: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {
            modalidade: { kind: "number", integer: true, minimum: 1, maximum: 6 },
          },
          required: ["modalidade"],
          additionalProperties: true,
        },
        {
          kind: "oneOf",
          members: [
            {
              kind: "object",
              properties: {
                descontoDataFixa: {
                  kind: "array",
                  items: {
                    kind: "object",
                    properties: {
                      data: { kind: "string", format: "date" },
                      valorPerc: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
                    },
                    required: ["data", "valorPerc"],
                    additionalProperties: true,
                  },
                  minItems: 1,
                  maxItems: 3,
                  uniqueItems: true,
                },
              },
              required: [],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                valorPerc: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
              },
              required: ["valorPerc"],
              additionalProperties: true,
            },
          ],
        },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cCobValor: Constraint = {
  kind: "object",
  properties: {
    original: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    modalidadeAlteracao: { kind: "number", integer: true, minimum: 0, maximum: 1 },
    retirada: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
        {
          kind: "oneOf",
          members: [
            {
              kind: "object",
              properties: {
                saque: {
                  kind: "object",
                  properties: {
                    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
                    modalidadeAlteracao: { kind: "number", integer: true, minimum: 0, maximum: 1 },
                    modalidadeAgente: {
                      kind: "string",
                      enumValues: ["AGTEC", "AGTOT", "AGPSS", "AGFSS"],
                    },
                    prestadorDoServicoDeSaque: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                  additionalProperties: true,
                },
              },
              required: ["saque"],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                troco: {
                  kind: "object",
                  properties: {
                    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
                    modalidadeAlteracao: { kind: "number", integer: true, minimum: 0, maximum: 1 },
                    modalidadeAgente: { kind: "string", enumValues: ["AGTEC", "AGTOT"] },
                    prestadorDoServicoDeSaque: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                  additionalProperties: true,
                },
              },
              required: ["troco"],
              additionalProperties: true,
            },
          ],
        },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cCobPayloadValor: Constraint = {
  kind: "object",
  properties: {
    original: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    modalidadeAlteracao: { kind: "number", integer: true, minimum: 0, maximum: 1 },
    retirada: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
        {
          kind: "oneOf",
          members: [
            {
              kind: "object",
              properties: {
                saque: {
                  kind: "object",
                  properties: {
                    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
                    modalidadeAlteracao: { kind: "number", integer: true, minimum: 0, maximum: 1 },
                    modalidadeAgente: {
                      kind: "string",
                      enumValues: ["AGTEC", "AGTOT", "AGPSS", "AGFSS"],
                    },
                    prestadorDoServicoDeSaque: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                  additionalProperties: true,
                },
              },
              required: ["saque"],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                troco: {
                  kind: "object",
                  properties: {
                    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
                    modalidadeAlteracao: { kind: "number", integer: true, minimum: 0, maximum: 1 },
                    modalidadeAgente: { kind: "string", enumValues: ["AGTEC", "AGTOT"] },
                    prestadorDoServicoDeSaque: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                  additionalProperties: true,
                },
              },
              required: ["troco"],
              additionalProperties: true,
            },
          ],
        },
      ],
    },
  },
  required: ["original"],
  additionalProperties: true,
};
const cCobVPayloadValor: Constraint = {
  kind: "object",
  properties: {
    original: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    multa: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    juros: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    abatimento: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    desconto: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    final: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
  },
  required: ["final"],
  additionalProperties: true,
};
const cRecCompleta: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        recebedor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {
                convenio: { kind: "string", maxLength: 60 },
              },
              required: [],
              additionalProperties: true,
            },
            { kind: "ref", name: "PessoaJuridicaRecorrencia" },
          ],
        },
        loc: { kind: "ref", name: "PayloadLocationRecCompleta" },
        solicitacao: {
          kind: "array",
          items: { kind: "ref", name: "SolicRecCompleta" },
        },
        dadosQR: {
          kind: "object",
          properties: {
            jornada: { kind: "string", enumValues: ["JORNADA_2", "JORNADA_3", "JORNADA_4"] },
            pixCopiaECola: { kind: "string", maxLength: 512 },
          },
          required: [],
          additionalProperties: true,
        },
      },
      required: ["status", "recebedor"],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecBase" },
    { kind: "ref", name: "DadosPagadorRec" },
    { kind: "ref", name: "RecStatus" },
    { kind: "ref", name: "RecConfiguracao" },
    { kind: "ref", name: "RecAtualizacao" },
    { kind: "ref", name: "RecEncerramento" },
    { kind: "ref", name: "RecAtivacao" },
  ],
};
const cRecCompletaPesquisada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        recebedor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {
                convenio: { kind: "string", maxLength: 60 },
              },
              required: [],
              additionalProperties: true,
            },
            { kind: "ref", name: "PessoaJuridicaRecorrencia" },
          ],
        },
        loc: { kind: "ref", name: "PayloadLocationRecCompleta" },
        solicitacao: {
          kind: "array",
          items: { kind: "ref", name: "SolicRecCompleta" },
        },
      },
      required: ["status", "recebedor"],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecBase" },
    { kind: "ref", name: "DadosPagadorRec" },
    { kind: "ref", name: "RecStatus" },
    { kind: "ref", name: "RecConfiguracao" },
    { kind: "ref", name: "RecAtualizacao" },
    { kind: "ref", name: "RecEncerramento" },
    { kind: "ref", name: "RecAtivacao" },
  ],
};
const cRecGerada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        recebedor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {
                convenio: { kind: "string", maxLength: 60 },
              },
              required: [],
              additionalProperties: true,
            },
            { kind: "ref", name: "PessoaJuridicaRecorrencia" },
          ],
        },
        loc: { kind: "ref", name: "PayloadLocationRecCompleta" },
      },
      required: ["recebedor"],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecBase" },
    { kind: "ref", name: "RecStatus" },
    { kind: "ref", name: "RecAtualizacao" },
    { kind: "ref", name: "RecEncerramento" },
    { kind: "ref", name: "RecAtivacao" },
  ],
};
const cRecSolicitada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        recebedor: {
          kind: "object",
          properties: {
            convenio: { kind: "string", maxLength: 60 },
          },
          required: [],
          additionalProperties: true,
        },
        loc: { kind: "ref", name: "PayloadLocationRecId" },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecBase" },
    { kind: "ref", name: "RecConfiguracao" },
    { kind: "ref", name: "RecAtivacaoSolicitada" },
  ],
};
const cRecPayload: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        recebedor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {
                ispbParticipante: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
              },
              required: ["ispbParticipante"],
              additionalProperties: true,
            },
            { kind: "ref", name: "PessoaJuridicaRecorrencia" },
          ],
        },
      },
      required: ["idRec", "atualizacao", "recebedor"],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecBase" },
    { kind: "ref", name: "RecConfiguracao" },
    { kind: "ref", name: "RecAtualizacao" },
  ],
};
const cRecRevisada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        status: { kind: "string", enumValues: ["CANCELADA"] },
        vinculo: {
          kind: "object",
          properties: {
            devedor: {
              kind: "object",
              properties: {
                nome: { kind: "string", maxLength: 140 },
              },
              required: ["nome"],
              additionalProperties: true,
            },
          },
          required: [],
          additionalProperties: true,
        },
        loc: { kind: "ref", name: "PayloadLocationRecId" },
        calendario: {
          kind: "object",
          properties: {
            dataInicial: { kind: "string", format: "date" },
          },
          required: [],
          additionalProperties: true,
        },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecAtivacaoSolicitada" },
  ],
};
const cRecNotification: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
      },
      required: ["idRec", "status", "atualizacao"],
      additionalProperties: true,
    },
    { kind: "ref", name: "RecStatus" },
    { kind: "ref", name: "RecAtualizacao" },
    { kind: "ref", name: "RecEncerramento" },
    { kind: "ref", name: "RecAtivacao" },
  ],
};
const cRecAtivacao: Constraint = {
  kind: "object",
  properties: {
    ativacao: {
      kind: "object",
      properties: {
        tipoJornada: {
          kind: "string",
          enumValues: ["JORNADA_1", "JORNADA_2", "JORNADA_3", "JORNADA_4", "AGUARDANDO_DEFINICAO"],
        },
        dadosJornada: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: [],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                txid: { kind: "ref", name: "TxId" },
              },
              required: ["txid"],
              additionalProperties: true,
            },
          ],
        },
      },
      required: ["tipoJornada"],
      additionalProperties: true,
    },
  },
  required: [],
  additionalProperties: true,
};
const cRecAtivacaoSolicitada: Constraint = {
  kind: "object",
  properties: {
    ativacao: {
      kind: "object",
      properties: {
        dadosJornada: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: [],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                txid: { kind: "ref", name: "TxId" },
              },
              required: ["txid"],
              additionalProperties: true,
            },
          ],
        },
      },
      required: [],
      additionalProperties: true,
    },
  },
  required: [],
  additionalProperties: true,
};
const cRecStatus: Constraint = {
  kind: "object",
  properties: {
    status: {
      kind: "string",
      enumValues: ["CRIADA", "APROVADA", "REJEITADA", "EXPIRADA", "CANCELADA"],
    },
  },
  required: ["status"],
  additionalProperties: true,
};
const cRecConfiguracao: Constraint = {
  kind: "object",
  properties: {
    politicaRetentativa: { kind: "string", enumValues: ["NAO_PERMITE", "PERMITE_3R_7D"] },
  },
  required: ["politicaRetentativa"],
  additionalProperties: true,
};
const cRecAtualizacao: Constraint = {
  kind: "object",
  properties: {
    atualizacao: {
      kind: "array",
      items: {
        kind: "object",
        properties: {
          status: {
            kind: "string",
            enumValues: ["CRIADA", "APROVADA", "REJEITADA", "EXPIRADA", "CANCELADA"],
          },
          data: { kind: "string", format: "date-time" },
        },
        required: ["status", "data"],
        additionalProperties: true,
      },
    },
  },
  required: ["atualizacao"],
  additionalProperties: true,
};
const cRecEncerramento: Constraint = {
  kind: "object",
  properties: {
    encerramento: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
        {
          kind: "oneOf",
          members: [
            {
              kind: "object",
              properties: {
                rejeicao: {
                  kind: "object",
                  properties: {
                    codigo: { kind: "string", maxLength: 4, enumValues: ["AP13", "AP14", "AP15"] },
                    descricao: { kind: "string", maxLength: 400 },
                  },
                  required: ["codigo", "descricao"],
                  additionalProperties: true,
                },
              },
              required: ["rejeicao"],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                cancelamento: {
                  kind: "object",
                  properties: {
                    solicitante: {
                      kind: "string",
                      enumValues: [
                        "PSP_PAGADOR",
                        "USUARIO_PAGADOR",
                        "PSP_RECEBEDOR",
                        "USUARIO_RECEBEDOR",
                      ],
                    },
                    codigo: {
                      kind: "string",
                      maxLength: 4,
                      enumValues: ["ACCL", "CPCL", "DCSD", "ERSL", "FRUD", "PCFD", "SLCR", "SLDB"],
                    },
                    descricao: { kind: "string", maxLength: 400 },
                  },
                  required: ["solicitante", "codigo", "descricao"],
                  additionalProperties: true,
                },
              },
              required: ["cancelamento"],
              additionalProperties: true,
            },
          ],
        },
      ],
    },
  },
  required: [],
  additionalProperties: true,
};
const cRecId: Constraint = {
  kind: "string",
  minLength: 29,
  maxLength: 29,
  pattern: /[a-zA-Z0-9]{29}/,
};
const cRecBase: Constraint = {
  kind: "object",
  properties: {
    vinculo: {
      kind: "object",
      properties: {
        objeto: { kind: "string", maxLength: 35 },
        devedor: {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisicaRecorrencia" },
            { kind: "ref", name: "PessoaJuridicaRecorrencia" },
          ],
        },
        contrato: { kind: "string", maxLength: 35 },
      },
      required: ["contrato", "devedor"],
      additionalProperties: true,
    },
    calendario: {
      kind: "object",
      properties: {
        dataInicial: { kind: "string", format: "date" },
        dataFinal: { kind: "string", format: "date" },
        periodicidade: {
          kind: "string",
          enumValues: ["SEMANAL", "MENSAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"],
        },
      },
      required: ["dataInicial", "periodicidade"],
      additionalProperties: true,
    },
    valor: {
      kind: "object",
      properties: {
        valorRec: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
        valorMinimoRecebedor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: [],
      additionalProperties: true,
    },
  },
  required: ["calendario", "vinculo"],
  additionalProperties: true,
};
const cSolicRecId: Constraint = {
  kind: "object",
  properties: {
    idSolicRec: { kind: "string", minLength: 29, maxLength: 29, pattern: /[a-zA-Z0-9]{29}/ },
  },
  required: ["idSolicRec"],
  additionalProperties: true,
};
const cSolicRecBase: Constraint = {
  kind: "object",
  properties: {
    idRec: { kind: "ref", name: "RecId" },
    calendario: {
      kind: "object",
      properties: {
        dataExpiracaoSolicitacao: { kind: "string", format: "date-time" },
      },
      required: ["dataExpiracaoSolicitacao"],
      additionalProperties: true,
    },
    destinatario: {
      kind: "allOf",
      members: [
        { kind: "ref", name: "DadosBancarios" },
        {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "CPF" },
            { kind: "ref", name: "CNPJ" },
          ],
        },
      ],
    },
  },
  required: ["calendario", "idRec", "destinatario"],
  additionalProperties: true,
};
const cSolicRecStatus: Constraint = {
  kind: "object",
  properties: {
    status: {
      kind: "string",
      enumValues: ["CRIADA", "ENVIADA", "RECEBIDA", "REJEITADA", "ACEITA", "EXPIRADA", "CANCELADA"],
    },
  },
  required: ["status"],
  additionalProperties: true,
};
const cSolicRecAtualizacao: Constraint = {
  kind: "object",
  properties: {
    atualizacao: {
      kind: "array",
      items: {
        kind: "object",
        properties: {
          status: {
            kind: "string",
            enumValues: [
              "CRIADA",
              "ENVIADA",
              "RECEBIDA",
              "REJEITADA",
              "ACEITA",
              "EXPIRADA",
              "CANCELADA",
            ],
          },
          data: { kind: "string", format: "date-time" },
        },
        required: ["status", "data"],
        additionalProperties: true,
      },
    },
  },
  required: ["atualizacao"],
  additionalProperties: true,
};
const cSolicRecEncerramento: Constraint = {
  kind: "object",
  properties: {
    encerramento: {
      kind: "object",
      properties: {
        rejeicao: {
          kind: "object",
          properties: {
            motivo: { kind: "string", enumValues: ["DADOS_BANCARIOS_INVALIDOS"] },
          },
          required: ["motivo"],
          additionalProperties: true,
        },
      },
      required: [],
      additionalProperties: true,
    },
  },
  required: [],
  additionalProperties: true,
};
const cSolicRecSolicitada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "SolicRecBase" },
  ],
};
const cSolicRecRevisada: Constraint = {
  kind: "object",
  properties: {
    status: { kind: "string", enumValues: ["CANCELADA"] },
  },
  required: ["status"],
  additionalProperties: true,
};
const cSolicRecCompleta: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        recPayload: { kind: "ref", name: "RecPayload" },
      },
      required: ["recPayload"],
      additionalProperties: true,
    },
    { kind: "ref", name: "SolicRecId" },
    { kind: "ref", name: "SolicRecBase" },
    { kind: "ref", name: "SolicRecStatus" },
    { kind: "ref", name: "SolicRecAtualizacao" },
    { kind: "ref", name: "SolicRecEncerramento" },
  ],
};
const cTributoCompleto: Constraint = {
  kind: "object",
  properties: {
    documentoFiscal: {
      kind: "object",
      properties: {
        chaveDeAcesso: { kind: "string", pattern: /^[a-zA-Z0-9]{1,50}$/ },
      },
      required: ["chaveDeAcesso"],
      additionalProperties: true,
    },
    cbs: { kind: "ref", name: "RegistroCategoriaTributoCompleto" },
    ibs: { kind: "ref", name: "RegistroCategoriaTributoCompleto" },
  },
  required: ["cbs", "ibs"],
  additionalProperties: true,
};
const cTributoCompletoPix: Constraint = {
  kind: "object",
  properties: {
    documentoFiscal: {
      kind: "object",
      properties: {
        chaveDeAcesso: { kind: "string", pattern: /^[a-zA-Z0-9]{1,50}$/ },
      },
      required: ["chaveDeAcesso"],
      additionalProperties: true,
    },
    cbs: { kind: "ref", name: "RegistroCategoriaTributoCompletoPix" },
    ibs: { kind: "ref", name: "RegistroCategoriaTributoCompletoPix" },
  },
  required: ["cbs", "ibs"],
  additionalProperties: true,
};
const cTributoPayload: Constraint = {
  kind: "object",
  properties: {
    documentoFiscal: {
      kind: "object",
      properties: {
        chaveDeAcesso: { kind: "string", pattern: /^[a-zA-Z0-9]{1,50}$/ },
      },
      required: ["chaveDeAcesso"],
      additionalProperties: true,
    },
    cbs: { kind: "ref", name: "RegistroCategoriaTributoPayload" },
    ibs: { kind: "ref", name: "RegistroCategoriaTributoPayload" },
  },
  required: ["cbs", "ibs"],
  additionalProperties: true,
};
const cTributoInformadoCompleto: Constraint = {
  kind: "object",
  properties: {
    documentoFiscal: {
      kind: "object",
      properties: {
        chaveDeAcesso: { kind: "string", pattern: /^[a-zA-Z0-9]{1,50}$/ },
      },
      required: ["chaveDeAcesso"],
      additionalProperties: true,
    },
    cbs: { kind: "ref", name: "RegistroCategoriaTributoInformadoCompleto" },
    ibs: { kind: "ref", name: "RegistroCategoriaTributoInformadoCompleto" },
  },
  required: ["cbs", "ibs"],
  additionalProperties: true,
};
const cTributoInformadoSolicitado: Constraint = {
  kind: "object",
  properties: {
    documentoFiscal: {
      kind: "object",
      properties: {
        chaveDeAcesso: { kind: "string", pattern: /^[a-zA-Z0-9]{1,50}$/ },
      },
      required: ["chaveDeAcesso"],
      additionalProperties: true,
    },
    cbs: { kind: "ref", name: "RegistroCategoriaTributoInformadoSolicitado" },
    ibs: { kind: "ref", name: "RegistroCategoriaTributoInformadoSolicitado" },
  },
  required: ["cbs", "ibs"],
  additionalProperties: true,
};
const cRegistroCategoriaTributoInformadoSolicitado: Constraint = {
  kind: "object",
  properties: {
    informado: { kind: "ref", name: "ValorTributoDetalheSolicitado" },
  },
  required: ["informado"],
  additionalProperties: true,
};
const cRegistroCategoriaTributoInformadoCompleto: Constraint = {
  kind: "object",
  properties: {
    informado: { kind: "ref", name: "ValorTributoDetalheCompleto" },
  },
  required: ["informado"],
  additionalProperties: true,
};
const cRegistroCategoriaTributoPayload: Constraint = {
  kind: "object",
  properties: {
    informado: { kind: "ref", name: "ValorTributoDetalheCompleto" },
    corrigido: { kind: "ref", name: "ValorTributoDetalheCompleto" },
  },
  required: ["informado"],
  additionalProperties: true,
};
const cRegistroCategoriaTributoCompleto: Constraint = {
  kind: "object",
  properties: {
    segregado: { kind: "ref", name: "ValorTributoDetalheCompleto" },
    emAberto: { kind: "ref", name: "ValorTributoDetalheCompleto" },
    corrigido: { kind: "ref", name: "ValorTributoDetalheCompleto" },
    informado: { kind: "ref", name: "ValorTributoDetalheCompleto" },
  },
  required: ["informado"],
  additionalProperties: true,
};
const cRegistroCategoriaTributoCompletoPix: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: ["informado", "segregado"],
      additionalProperties: true,
    },
    { kind: "ref", name: "RegistroCategoriaTributoCompleto" },
  ],
};
const cValorTributoDetalheCompleto: Constraint = {
  kind: "object",
  properties: {
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    data: { kind: "string", format: "date-time" },
  },
  required: ["valor", "data"],
  additionalProperties: true,
};
const cValorTributoDetalheSolicitado: Constraint = {
  kind: "object",
  properties: {
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
  },
  required: ["valor"],
  additionalProperties: true,
};
const cValorLiquidoEstimado: Constraint = {
  kind: "object",
  properties: {
    valorLiquidoEstimado: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
  },
  required: [],
  additionalProperties: true,
};
const cCobRGerada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        txid: { kind: "ref", name: "TxId" },
        calendario: {
          kind: "object",
          properties: {
            criacao: { kind: "string", format: "date" },
          },
          required: ["criacao"],
          additionalProperties: true,
        },
        recebedor: { kind: "ref", name: "PessoaJuridicaRecorrencia" },
        tributo: { kind: "ref", name: "TributoInformadoCompleto" },
      },
      required: ["idRec", "txid", "status", "valor", "recebedor", "calendario"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobRBase" },
    { kind: "ref", name: "CobRStatus" },
    { kind: "ref", name: "DadosDevedorRecorrencia" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cCobRCompleta: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        txid: { kind: "ref", name: "TxId" },
        calendario: {
          kind: "object",
          properties: {
            criacao: { kind: "string", format: "date" },
          },
          required: ["criacao"],
          additionalProperties: true,
        },
        pix: {
          kind: "array",
          items: { kind: "ref", name: "PixAutomaticoConsultado" },
        },
        tributo: { kind: "ref", name: "TributoCompleto" },
      },
      required: ["idRec", "txid", "status", "valor", "recebedor", "calendario"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobRBase" },
    { kind: "ref", name: "CobRStatus" },
    { kind: "ref", name: "CobRConfiguracao" },
    { kind: "ref", name: "DadosDevedorRecorrencia" },
    { kind: "ref", name: "CobRAtualizacao" },
    { kind: "ref", name: "CobRTentativas" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cCobRAtualizacao: Constraint = {
  kind: "object",
  properties: {
    atualizacao: {
      kind: "array",
      items: {
        kind: "object",
        properties: {
          status: {
            kind: "string",
            enumValues: ["CRIADA", "ATIVA", "CONCLUIDA", "EXPIRADA", "REJEITADA", "CANCELADA"],
          },
          data: { kind: "string", format: "date-time" },
        },
        required: ["status", "data"],
        additionalProperties: true,
      },
    },
    encerramento: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
        {
          kind: "oneOf",
          members: [
            {
              kind: "object",
              properties: {
                cancelamento: {
                  kind: "object",
                  properties: {
                    solicitante: {
                      kind: "string",
                      enumValues: [
                        "PSP_PAGADOR",
                        "USUARIO_PAGADOR",
                        "PSP_RECEBEDOR",
                        "USUARIO_RECEBEDOR",
                      ],
                    },
                    codigo: {
                      kind: "string",
                      maxLength: 4,
                      enumValues: ["ACCT", "BLCK", "CCLD", "FAIL", "OTHR", "SLBD", "SLCR"],
                    },
                    descricao: { kind: "string", maxLength: 400 },
                  },
                  required: ["solicitante", "codigo", "descricao"],
                  additionalProperties: true,
                },
              },
              required: ["cancelamento"],
              additionalProperties: true,
            },
            {
              kind: "object",
              properties: {
                rejeicao: {
                  kind: "object",
                  properties: {
                    codigo: {
                      kind: "string",
                      maxLength: 4,
                      enumValues: [
                        "AB10",
                        "AC05",
                        "AC06",
                        "AM02",
                        "AM09",
                        "CRNC",
                        "DENC",
                        "DS27",
                        "DTED",
                        "DTNT",
                        "FBRD",
                        "FCD2",
                        "GRER",
                        "IRNT",
                        "MIDI",
                        "MSUC",
                        "NIEC",
                        "NIPA",
                        "NITX",
                        "QUNT",
                        "RC09",
                        "UDEI",
                      ],
                    },
                    descricao: { kind: "string", maxLength: 400 },
                  },
                  required: ["codigo", "descricao"],
                  additionalProperties: true,
                },
              },
              required: ["rejeicao"],
              additionalProperties: true,
            },
          ],
        },
      ],
    },
  },
  required: ["atualizacao"],
  additionalProperties: true,
};
const cCobRTentativas: Constraint = {
  kind: "object",
  properties: {
    tentativas: {
      kind: "array",
      items: {
        kind: "object",
        properties: {
          dataLiquidacao: { kind: "string", format: "date" },
          tipo: { kind: "string", enumValues: ["AGND", "NTAG", "RIFL"] },
          status: {
            kind: "string",
            enumValues: ["SOLICITADA", "AGENDADA", "PAGA", "CANCELADA", "REJEITADA", "EXPIRADA"],
          },
          endToEndId: { kind: "ref", name: "EndToEndId" },
          atualizacao: {
            kind: "array",
            items: {
              kind: "object",
              properties: {
                status: {
                  kind: "string",
                  enumValues: [
                    "SOLICITADA",
                    "AGENDADA",
                    "PAGA",
                    "CANCELADA",
                    "REJEITADA",
                    "EXPIRADA",
                  ],
                },
                data: { kind: "string", format: "date-time" },
              },
              required: ["status", "data"],
              additionalProperties: true,
            },
          },
          rejeicao: {
            kind: "object",
            properties: {
              codigo: {
                kind: "string",
                maxLength: 4,
                enumValues: [
                  "AB10",
                  "AC05",
                  "AC06",
                  "AM02",
                  "AM09",
                  "CRNC",
                  "DENC",
                  "DS27",
                  "DTED",
                  "DTNT",
                  "FBRD",
                  "FCD1",
                  "FCD2",
                  "GRER",
                  "IRNT",
                  "MIDI",
                  "MSUC",
                  "NIEC",
                  "NIPA",
                  "NITX",
                  "QUNT",
                  "RC09",
                  "UDEI",
                ],
              },
              descricao: { kind: "string", maxLength: 400 },
            },
            required: ["codigo", "descricao"],
            additionalProperties: true,
          },
        },
        required: ["dataLiquidacao", "tipo", "endToEndId", "status", "atualizacao"],
        additionalProperties: true,
      },
    },
  },
  required: [],
  additionalProperties: true,
};
const cCobRRevisada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobRStatusRevisada" },
  ],
};
const cCobRSolicitada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        tributo: { kind: "ref", name: "TributoInformadoSolicitado" },
      },
      required: ["idRec", "calendario", "valor", "recebedor"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobRBase" },
    { kind: "ref", name: "DadosDevedorRecorrencia" },
  ],
};
const cCobRNotification: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
        txid: { kind: "ref", name: "TxId" },
        valor: {
          kind: "object",
          properties: {
            original: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
          },
          required: ["original"],
          additionalProperties: true,
        },
        tributo: { kind: "ref", name: "TributoCompleto" },
        pix: {
          kind: "array",
          items: { kind: "ref", name: "PixAutomaticoConsultado" },
        },
      },
      required: ["idRec", "txid", "status", "atualizacao"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobRStatus" },
    { kind: "ref", name: "CobRAtualizacao" },
    { kind: "ref", name: "CobRTentativas" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cCobNotification: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: ["txid", "status"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobCompleta" },
  ],
};
const cCobVNotification: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: ["txid", "status"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobVCompleta" },
  ],
};
const cCobRConfiguracao: Constraint = {
  kind: "object",
  properties: {
    politicaRetentativa: { kind: "string", enumValues: ["NAO_PERMITE", "PERMITE_3R_7D"] },
  },
  required: ["politicaRetentativa"],
  additionalProperties: true,
};
const cCobRStatus: Constraint = {
  kind: "object",
  properties: {
    status: {
      kind: "string",
      enumValues: ["CRIADA", "ATIVA", "CONCLUIDA", "EXPIRADA", "REJEITADA", "CANCELADA"],
    },
  },
  required: [],
  additionalProperties: true,
};
const cCobRStatusRevisada: Constraint = {
  kind: "object",
  properties: {
    status: { kind: "string", enumValues: ["CANCELADA"] },
  },
  required: [],
  additionalProperties: true,
};
const cCobRBase: Constraint = {
  kind: "object",
  properties: {
    infoAdicional: { kind: "string", maxLength: 140 },
    calendario: {
      kind: "object",
      properties: {
        dataDeVencimento: { kind: "string", format: "date" },
      },
      required: ["dataDeVencimento"],
      additionalProperties: true,
    },
    valor: {
      kind: "object",
      properties: {
        original: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["original"],
      additionalProperties: true,
    },
    ajusteDiaUtil: { kind: "boolean" },
    recebedor: { kind: "ref", name: "DadosBancariosRecebedor" },
  },
  required: ["ajusteDiaUtil"],
  additionalProperties: true,
};
const cCobBase: Constraint = {
  kind: "object",
  properties: {
    chave: { kind: "string", maxLength: 77 },
    solicitacaoPagador: { kind: "string", maxLength: 140 },
    infoAdicionais: {
      kind: "array",
      items: {
        kind: "object",
        properties: {
          nome: { kind: "string", maxLength: 50 },
          valor: { kind: "string", maxLength: 200 },
        },
        required: ["nome", "valor"],
        additionalProperties: true,
      },
      maxItems: 50,
    },
  },
  required: [],
  additionalProperties: true,
};
const cCobBaseCopiaCola: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        pixCopiaECola: { kind: "string", maxLength: 512 },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobBase" },
  ],
};
const cCobSolicitada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: { kind: "ref", name: "CobExpiracao" },
        devedor: {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            { kind: "ref", name: "PessoaJuridica" },
          ],
        },
        loc: { kind: "ref", name: "PayloadLocationCob" },
        valor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["original"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobValor" },
          ],
        },
        tributo: { kind: "ref", name: "TributoInformadoSolicitado" },
      },
      required: ["valor", "chave", "calendario"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobBase" },
  ],
};
const cCobVSolicitada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: { kind: "ref", name: "CobDataDeVencimento" },
        loc: { kind: "ref", name: "PayloadLocationCob" },
        valor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["original"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobVValor" },
          ],
        },
        tributo: { kind: "ref", name: "TributoInformadoSolicitado" },
      },
      required: ["valor", "chave", "devedor", "calendario"],
      additionalProperties: true,
    },
    { kind: "ref", name: "DadosDevedor" },
    { kind: "ref", name: "CobBase" },
  ],
};
const cCobRevisada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: { kind: "ref", name: "CobExpiracao" },
        devedor: {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            { kind: "ref", name: "PessoaJuridica" },
          ],
        },
        loc: { kind: "ref", name: "PayloadLocationCob" },
        status: { kind: "string", enumValues: ["REMOVIDA_PELO_USUARIO_RECEBEDOR"] },
        valor: { kind: "ref", name: "CobValor" },
        tributo: { kind: "ref", name: "TributoInformadoSolicitado" },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobBase" },
  ],
};
const cCobVRevisada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: { kind: "ref", name: "CobDataDeVencimento" },
        loc: { kind: "ref", name: "PayloadLocationCob" },
        status: { kind: "string", enumValues: ["REMOVIDA_PELO_USUARIO_RECEBEDOR"] },
        valor: { kind: "ref", name: "CobVValor" },
        tributo: { kind: "ref", name: "TributoInformadoSolicitado" },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "DadosDevedor" },
    { kind: "ref", name: "CobBase" },
  ],
};
const cCobGerada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["expiracao"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobCriacao" },
            { kind: "ref", name: "CobExpiracao" },
          ],
        },
        txid: { kind: "ref", name: "TxId" },
        revisao: { kind: "ref", name: "Revisao" },
        devedor: {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            { kind: "ref", name: "PessoaJuridica" },
          ],
        },
        loc: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["id", "tipoCob", "criacao"],
              additionalProperties: true,
            },
            { kind: "ref", name: "PayloadLocation" },
          ],
        },
        location: { kind: "string", maxLength: 77, format: "uri" },
        status: { kind: "ref", name: "CobStatus" },
        valor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["original"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobValor" },
          ],
        },
        tributo: { kind: "ref", name: "TributoInformadoCompleto" },
      },
      required: ["txid", "calendario", "revisao", "status", "valor", "chave"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobBaseCopiaCola" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cCobVGerada: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["validadeAposVencimento"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobCriacao" },
            { kind: "ref", name: "CobDataDeVencimento" },
          ],
        },
        txid: { kind: "ref", name: "TxId" },
        revisao: { kind: "ref", name: "Revisao" },
        loc: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["id", "tipoCob", "criacao"],
              additionalProperties: true,
            },
            { kind: "ref", name: "PayloadLocation" },
          ],
        },
        status: { kind: "ref", name: "CobVStatus" },
        valor: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["original"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobVValor" },
          ],
        },
        tributo: { kind: "ref", name: "TributoInformadoCompleto" },
      },
      required: [
        "txid",
        "devedor",
        "calendario",
        "revisao",
        "status",
        "valor",
        "chave",
        "recebedor",
      ],
      additionalProperties: true,
    },
    { kind: "ref", name: "DadosDevedor" },
    { kind: "ref", name: "DadosRecebedor" },
    { kind: "ref", name: "CobBaseCopiaCola" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cCobStatus: Constraint = {
  kind: "string",
  enumValues: ["ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"],
};
const cCobVStatus: Constraint = {
  kind: "string",
  enumValues: [
    "ATIVA",
    "CONCLUIDA",
    "REMOVIDA_PELO_USUARIO_RECEBEDOR",
    "REMOVIDA_PELO_PSP",
    "REMOVIDA_PELO_PSP_BOLETO",
  ],
};
const cLoteCobVGerado: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "number", integer: true },
    descricao: { kind: "string" },
    criacao: { kind: "string", format: "date-time" },
    cobsv: {
      kind: "array",
      items: { kind: "ref", name: "CobVGerada" },
    },
  },
  required: ["id", "descricao", "criacao", "cobsv"],
  additionalProperties: true,
};
const cCobVCompleta: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        status: { kind: "ref", name: "CobVStatus" },
        tributo: { kind: "ref", name: "TributoCompleto" },
        pix: {
          kind: "array",
          items: {
            kind: "allOf",
            members: [
              {
                kind: "object",
                properties: {
                  txid: {
                    kind: "allOf",
                    members: [
                      { kind: "ref", name: "TxId" },
                      { kind: "string", pattern: /[a-zA-Z0-9]{26,35}/ },
                    ],
                  },
                },
                required: [],
                additionalProperties: true,
              },
              { kind: "ref", name: "PixConsultado" },
            ],
          },
        },
      },
      required: ["status"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobVGerada" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cCobCompleta: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        status: { kind: "ref", name: "CobStatus" },
        tributo: { kind: "ref", name: "TributoCompleto" },
        pix: {
          kind: "array",
          items: {
            kind: "allOf",
            members: [
              {
                kind: "object",
                properties: {
                  txid: {
                    kind: "allOf",
                    members: [
                      { kind: "ref", name: "TxId" },
                      { kind: "string", pattern: /[a-zA-Z0-9]{26,35}/ },
                    ],
                  },
                },
                required: [],
                additionalProperties: true,
              },
              { kind: "ref", name: "PixConsultado" },
            ],
          },
        },
      },
      required: ["status"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobGerada" },
    { kind: "ref", name: "ValorLiquidoEstimado" },
  ],
};
const cLoteCobVConsultado: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "number", integer: true },
    descricao: { kind: "string" },
    criacao: { kind: "string", format: "date-time" },
    cobsv: {
      kind: "array",
      items: {
        kind: "object",
        properties: {
          txid: { kind: "ref", name: "TxId" },
          status: { kind: "string", enumValues: ["EM_PROCESSAMENTO", "CRIADA", "NEGADA"] },
          problema: { kind: "ref", name: "Problema" },
          criacao: { kind: "string", format: "date-time" },
        },
        required: ["txid", "status"],
        additionalProperties: true,
      },
    },
  },
  required: ["id", "descricao", "criacao", "cobsv"],
  additionalProperties: true,
};
const cLotesCobVConsultados: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaLote" },
    lotes: {
      kind: "array",
      items: { kind: "ref", name: "LoteCobVConsultado" },
    },
  },
  required: ["parametros", "lotes"],
  additionalProperties: true,
};
const cCobVPayload: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["criacao", "apresentacao", "validadeAposVencimento"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobCriacao" },
            { kind: "ref", name: "CobApresentacao" },
            { kind: "ref", name: "CobDataDeVencimento" },
          ],
        },
        devedor: {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            { kind: "ref", name: "PessoaJuridica" },
          ],
        },
        txid: { kind: "ref", name: "TxId" },
        revisao: { kind: "ref", name: "Revisao" },
        status: { kind: "ref", name: "CobVStatus" },
        valor: { kind: "ref", name: "CobVPayloadValor" },
        tributo: { kind: "ref", name: "TributoPayload" },
      },
      required: [
        "txid",
        "calendario",
        "revisao",
        "status",
        "valor",
        "chave",
        "devedor",
        "recebedor",
      ],
      additionalProperties: true,
    },
    { kind: "ref", name: "DadosRecebedor" },
    { kind: "ref", name: "CobBase" },
  ],
};
const cCobPayload: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        calendario: {
          kind: "allOf",
          members: [
            {
              kind: "object",
              properties: {},
              required: ["criacao", "apresentacao", "expiracao"],
              additionalProperties: true,
            },
            { kind: "ref", name: "CobCriacao" },
            { kind: "ref", name: "CobApresentacao" },
            { kind: "ref", name: "CobExpiracao" },
          ],
        },
        txid: { kind: "ref", name: "TxId" },
        revisao: { kind: "ref", name: "Revisao" },
        devedor: {
          kind: "oneOf",
          members: [
            { kind: "ref", name: "PessoaFisica" },
            { kind: "ref", name: "PessoaJuridica" },
          ],
        },
        status: { kind: "ref", name: "CobStatus" },
        valor: { kind: "ref", name: "CobPayloadValor" },
        tributo: { kind: "ref", name: "TributoPayload" },
      },
      required: ["txid", "calendario", "revisao", "status", "valor", "chave"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobBase" },
  ],
};
const cPayloadLocation: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "ref", name: "PayloadLocationId" },
    location: { kind: "string", maxLength: 77, format: "uri" },
    tipoCob: { kind: "string", enumValues: ["cob", "cobv"] },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["id", "location", "tipoCob", "criacao"],
  additionalProperties: true,
};
const cPayloadLocationSolicitada: Constraint = {
  kind: "object",
  properties: {
    tipoCob: { kind: "string", enumValues: ["cob", "cobv"] },
  },
  required: ["tipoCob"],
  additionalProperties: true,
};
const cPayloadLocationRecSolicitada: Constraint = {
  kind: "object",
  properties: {
    tipo: { kind: "string", enumValues: ["rec"] },
  },
  required: ["tipo"],
  additionalProperties: true,
};
const cPayloadLocationRecGerada: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "ref", name: "PayloadLocationRecId" },
    location: { kind: "string", maxLength: 77, format: "uri" },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["id", "location", "criacao"],
  additionalProperties: true,
};
const cPayloadLocationRecCompleta: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        idRec: { kind: "ref", name: "RecId" },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "PayloadLocationRecGerada" },
  ],
};
const cPayloadLocationCompleta: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "ref", name: "PayloadLocationId" },
    txid: { kind: "ref", name: "TxId" },
    location: { kind: "string", maxLength: 77, format: "uri" },
    tipoCob: { kind: "string", enumValues: ["cob", "cobv"] },
    criacao: { kind: "string", format: "date-time" },
  },
  required: ["id", "location", "tipoCob", "criacao"],
  additionalProperties: true,
};
const cPayloadLocationCob: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "ref", name: "PayloadLocationId" },
  },
  required: ["id"],
  additionalProperties: true,
};
const cParametrosConsultaRec: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    cpf: { kind: "string", pattern: /^\d{11}$/ },
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    locationPresente: { kind: "boolean" },
    status: { kind: "string" },
    recebedor: {
      kind: "object",
      properties: {
        convenio: { kind: "string", maxLength: 60 },
      },
      required: [],
      additionalProperties: true,
    },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cParametrosConsultaCob: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    cpf: { kind: "string", pattern: /^\d{11}$/ },
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    locationPresente: { kind: "boolean" },
    status: { kind: "string" },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cParametrosConsultaCobR: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    idRec: { kind: "ref", name: "RecId" },
    cpf: { kind: "string", pattern: /^\d{11}$/ },
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    status: { kind: "string" },
    recebedor: {
      kind: "object",
      properties: {
        convenio: { kind: "string", maxLength: 60 },
      },
      required: [],
      additionalProperties: true,
    },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cParametrosConsultaLote: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cCobsVConsultadas: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaCob" },
    cobs: {
      kind: "array",
      items: {
        kind: "allOf",
        members: [
          {
            kind: "object",
            properties: {},
            required: ["status", "txid"],
            additionalProperties: true,
          },
          { kind: "ref", name: "CobVCompleta" },
        ],
      },
    },
  },
  required: ["parametros", "cobs"],
  additionalProperties: true,
};
const cCobsConsultadas: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaCob" },
    cobs: {
      kind: "array",
      items: {
        kind: "allOf",
        members: [
          {
            kind: "object",
            properties: {},
            required: ["status", "txid"],
            additionalProperties: true,
          },
          { kind: "ref", name: "CobCompleta" },
        ],
      },
    },
  },
  required: ["parametros", "cobs"],
  additionalProperties: true,
};
const cCobsRConsultadas: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaCobR" },
    cobsr: {
      kind: "array",
      items: { kind: "ref", name: "CobRCompleta" },
    },
  },
  required: ["parametros", "cobsr"],
  additionalProperties: true,
};
const cRecsConsultadas: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaRec" },
    recs: {
      kind: "array",
      items: { kind: "ref", name: "RecCompletaPesquisada" },
    },
  },
  required: ["parametros", "recs"],
  additionalProperties: true,
};
const cPix: Constraint = {
  kind: "object",
  properties: {
    endToEndId: { kind: "ref", name: "EndToEndId" },
    txid: {
      kind: "allOf",
      members: [
        { kind: "ref", name: "TxId" },
        { kind: "string", pattern: /[a-zA-Z0-9]{1,35}/ },
      ],
    },
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    componentesValor: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
        {
          kind: "anyOf",
          members: [
            { kind: "ref", name: "PixValorOriginal" },
            { kind: "ref", name: "PixValorSaque" },
            { kind: "ref", name: "PixValorTroco" },
            { kind: "ref", name: "PixValorJuros" },
            { kind: "ref", name: "PixValorMulta" },
            { kind: "ref", name: "PixValorAbatimento" },
            { kind: "ref", name: "PixValorDesconto" },
          ],
        },
      ],
    },
    chave: { kind: "string", maxLength: 77 },
    horario: { kind: "string", format: "date-time" },
    infoPagador: { kind: "string", maxLength: 140 },
    devolucoes: {
      kind: "array",
      items: { kind: "ref", name: "Devolucao" },
    },
    tributo: { kind: "ref", name: "TributoCompletoPix" },
    valorLiquido: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
  },
  required: ["endToEndId", "valor", "horario"],
  additionalProperties: true,
};
const cPixAutomatico: Constraint = {
  kind: "object",
  properties: {
    endToEndId: { kind: "ref", name: "EndToEndId" },
    txid: {
      kind: "allOf",
      members: [
        { kind: "ref", name: "TxId" },
        { kind: "string", pattern: /[a-zA-Z0-9]{1,35}/ },
      ],
    },
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    componentesValor: {
      kind: "allOf",
      members: [
        {
          kind: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
        {
          kind: "anyOf",
          members: [
            { kind: "ref", name: "PixValorOriginal" },
            { kind: "ref", name: "PixValorJuros" },
            { kind: "ref", name: "PixValorMulta" },
            { kind: "ref", name: "PixValorAbatimento" },
            { kind: "ref", name: "PixValorDesconto" },
          ],
        },
      ],
    },
    horario: { kind: "string", format: "date-time" },
    infoPagador: { kind: "string", maxLength: 140 },
    devolucoes: {
      kind: "array",
      items: { kind: "ref", name: "DevolucaoPixAutomatico" },
    },
    tributo: { kind: "ref", name: "TributoCompletoPix" },
    valorLiquido: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
  },
  required: ["txid", "endToEndId", "valor", "horario"],
  additionalProperties: true,
};
const cPixValorOriginal: Constraint = {
  kind: "object",
  properties: {
    original: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["valor"],
      additionalProperties: true,
    },
  },
  required: ["original"],
  additionalProperties: true,
};
const cPixValorSaque: Constraint = {
  kind: "object",
  properties: {
    saque: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
        modalidadeAgente: { kind: "string", enumValues: ["AGTEC", "AGTOT", "AGPSS", "AGFSS"] },
        prestadorDoServicoDeSaque: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
      },
      required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
      additionalProperties: true,
    },
  },
  required: ["saque"],
  additionalProperties: true,
};
const cPixValorTroco: Constraint = {
  kind: "object",
  properties: {
    troco: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
        modalidadeAgente: { kind: "string", enumValues: ["AGTEC", "AGTOT"] },
        prestadorDoServicoDeSaque: { kind: "string", pattern: /^[0-9A-Z]{8}$/ },
      },
      required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
      additionalProperties: true,
    },
  },
  required: ["troco"],
  additionalProperties: true,
};
const cPixValorJuros: Constraint = {
  kind: "object",
  properties: {
    juros: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["valor"],
      additionalProperties: true,
    },
  },
  required: ["juros"],
  additionalProperties: true,
};
const cPixValorMulta: Constraint = {
  kind: "object",
  properties: {
    multa: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["valor"],
      additionalProperties: true,
    },
  },
  required: ["multa"],
  additionalProperties: true,
};
const cPixValorDesconto: Constraint = {
  kind: "object",
  properties: {
    desconto: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["valor"],
      additionalProperties: true,
    },
  },
  required: ["desconto"],
  additionalProperties: true,
};
const cPixValorAbatimento: Constraint = {
  kind: "object",
  properties: {
    abatimento: {
      kind: "object",
      properties: {
        valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
      },
      required: ["valor"],
      additionalProperties: true,
    },
  },
  required: ["abatimento"],
  additionalProperties: true,
};
const cDevolucao: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "ref", name: "DevolucaoId" },
    rtrId: { kind: "string", minLength: 32, maxLength: 32, pattern: /[a-zA-Z0-9]{32}/ },
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    natureza: { kind: "ref", name: "DevolucaoNatureza" },
    descricao: { kind: "string", maxLength: 140 },
    horario: {
      kind: "object",
      properties: {
        solicitacao: { kind: "string", format: "date-time" },
        liquidacao: { kind: "string", format: "date-time" },
      },
      required: [],
      additionalProperties: true,
    },
    status: { kind: "string", enumValues: ["EM_PROCESSAMENTO", "DEVOLVIDO", "NAO_REALIZADO"] },
    motivo: { kind: "string", maxLength: 140 },
  },
  required: ["id", "rtrId", "valor", "horario", "status"],
  additionalProperties: true,
};
const cDevolucaoPixAutomatico: Constraint = {
  kind: "object",
  properties: {
    id: { kind: "ref", name: "DevolucaoId" },
    rtrId: { kind: "string", minLength: 32, maxLength: 32, pattern: /[a-zA-Z0-9]{32}/ },
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    natureza: { kind: "ref", name: "DevolucaoNaturezaPixAutomatico" },
    descricao: { kind: "string", maxLength: 140 },
    horario: {
      kind: "object",
      properties: {
        solicitacao: { kind: "string", format: "date-time" },
        liquidacao: { kind: "string", format: "date-time" },
      },
      required: [],
      additionalProperties: true,
    },
    status: { kind: "string", enumValues: ["EM_PROCESSAMENTO", "DEVOLVIDO", "NAO_REALIZADO"] },
    motivo: { kind: "string", maxLength: 140 },
  },
  required: ["id", "rtrId", "valor", "horario", "status"],
  additionalProperties: true,
};
const cDevolucaoSolicitada: Constraint = {
  kind: "object",
  properties: {
    valor: { kind: "string", pattern: /\d{1,10}\.\d{2}/ },
    natureza: { kind: "ref", name: "DevolucaoSolicitadaNatureza" },
    descricao: { kind: "string", maxLength: 140 },
  },
  required: ["valor"],
  additionalProperties: true,
};
const cParametrosConsultaPayloadLocation: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    txIdPresente: { kind: "boolean" },
    tipoCob: { kind: "string", enumValues: ["cob", "cobv"] },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cParametrosConsultaPayloadLocationRec: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    idRecPresente: { kind: "boolean" },
    recebedor: {
      kind: "object",
      properties: {
        convenio: { kind: "string", maxLength: 60 },
      },
      required: [],
      additionalProperties: true,
    },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cPayloadLocationConsultadas: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaPayloadLocation" },
    loc: {
      kind: "array",
      items: { kind: "ref", name: "PayloadLocationCompleta" },
    },
  },
  required: ["parametros", "loc"],
  additionalProperties: true,
};
const cPayloadLocationRecConsultadas: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaPayloadLocationRec" },
    loc: {
      kind: "array",
      items: { kind: "ref", name: "PayloadLocationRecCompleta" },
    },
  },
  required: ["parametros", "loc"],
  additionalProperties: true,
};
const cParametrosConsultaPix: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    txid: {
      kind: "allOf",
      members: [
        { kind: "ref", name: "TxId" },
        { kind: "string", pattern: /[a-zA-Z0-9]{1,35}/ },
      ],
    },
    txIdPresente: { kind: "boolean" },
    devolucaoPresente: { kind: "boolean" },
    finalidadeMED: { kind: "boolean" },
    cpf: { kind: "string", pattern: /^\d{11}$/ },
    cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: ["inicio", "fim", "paginacao"],
  additionalProperties: true,
};
const cParametrosConsultaWebhooks: Constraint = {
  kind: "object",
  properties: {
    inicio: { kind: "string", format: "date-time" },
    fim: { kind: "string", format: "date-time" },
    paginacao: { kind: "ref", name: "Paginacao" },
  },
  required: [],
  additionalProperties: true,
};
const cPixConsultado: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        tributo: { kind: "ref", name: "TributoCompletoPix" },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "Pix" },
  ],
};
const cPixAutomaticoConsultado: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {
        tributo: { kind: "ref", name: "TributoCompletoPix" },
        txid: {
          kind: "allOf",
          members: [
            { kind: "ref", name: "TxId" },
            { kind: "string", pattern: /[a-zA-Z0-9]{26,35}/ },
          ],
        },
      },
      required: [],
      additionalProperties: true,
    },
    { kind: "ref", name: "PixAutomatico" },
  ],
};
const cPixConsultados: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaPix" },
    pix: {
      kind: "array",
      items: { kind: "ref", name: "PixConsultado" },
    },
  },
  required: ["parametros", "pix"],
  additionalProperties: true,
};
const cWebhooksConsultados: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaWebhooks" },
    webhooks: {
      kind: "array",
      items: { kind: "ref", name: "WebhookCompleto" },
    },
  },
  required: ["webhooks"],
  additionalProperties: true,
};
const cWebhooksRecConsultados: Constraint = {
  kind: "object",
  properties: {
    parametros: { kind: "ref", name: "ParametrosConsultaWebhooks" },
    webhooksrec: {
      kind: "array",
      items: { kind: "ref", name: "WebhookRecCompleto" },
    },
  },
  required: ["webhooksrec"],
  additionalProperties: true,
};
const cPaginacao: Constraint = {
  kind: "object",
  properties: {
    paginaAtual: { kind: "number", integer: true, minimum: 0 },
    itensPorPagina: { kind: "number", integer: true, minimum: 1 },
    quantidadeDePaginas: { kind: "number", integer: true, minimum: 1 },
    quantidadeTotalDeItens: { kind: "number", integer: true, minimum: 0 },
  },
  required: ["paginaAtual", "itensPorPagina", "quantidadeDePaginas", "quantidadeTotalDeItens"],
  additionalProperties: true,
};
const cViolacao: Constraint = {
  kind: "object",
  properties: {
    razao: { kind: "string" },
    propriedade: { kind: "string" },
    valor: { kind: "string" },
  },
  required: [],
  additionalProperties: true,
};
const cProblema: Constraint = {
  kind: "object",
  properties: {
    type: { kind: "string", format: "uri" },
    title: { kind: "string" },
    status: { kind: "number", integer: true },
    detail: { kind: "string" },
    correlationId: { kind: "string" },
    violacoes: {
      kind: "array",
      items: { kind: "ref", name: "Violacao" },
    },
  },
  required: ["type", "title", "status"],
  additionalProperties: true,
};
const cInicio: Constraint = { kind: "string", format: "date-time" };
const cFim: Constraint = { kind: "string", format: "date-time" };
const cLoteCobVBody: Constraint = {
  kind: "object",
  properties: {
    descricao: { kind: "string" },
    cobsv: {
      kind: "array",
      items: {
        kind: "allOf",
        members: [
          {
            kind: "object",
            properties: {
              txid: { kind: "ref", name: "TxId" },
            },
            required: ["txid"],
            additionalProperties: true,
          },
          { kind: "ref", name: "CobVSolicitada" },
        ],
      },
    },
  },
  required: ["descricao", "cobsv"],
  additionalProperties: true,
};
const cLoteCobVBodyRevisado: Constraint = {
  kind: "object",
  properties: {
    descricao: { kind: "string" },
    cobsv: {
      kind: "array",
      items: {
        kind: "allOf",
        members: [
          {
            kind: "object",
            properties: {
              txid: { kind: "ref", name: "TxId" },
            },
            required: ["txid"],
            additionalProperties: true,
          },
          { kind: "ref", name: "CobVRevisada" },
        ],
      },
    },
  },
  required: [],
  additionalProperties: true,
};
const cWebhookPixBody: Constraint = {
  kind: "object",
  properties: {
    pix: {
      kind: "array",
      items: { kind: "ref", name: "PixConsultado" },
    },
  },
  required: [],
  additionalProperties: true,
};
const cWebhookRecBody: Constraint = {
  kind: "object",
  properties: {
    recs: {
      kind: "array",
      items: { kind: "ref", name: "RecNotification" },
    },
  },
  required: [],
  additionalProperties: true,
};
const cWebhookCobRBody: Constraint = {
  kind: "object",
  properties: {
    cobsr: {
      kind: "array",
      items: { kind: "ref", name: "CobRNotification" },
    },
  },
  required: [],
  additionalProperties: true,
};
const cWebhookCobBody: Constraint = {
  kind: "object",
  properties: {
    cobs: {
      kind: "array",
      items: { kind: "ref", name: "CobNotification" },
    },
  },
  required: [],
  additionalProperties: true,
};
const cWebhookCobVBody: Constraint = {
  kind: "object",
  properties: {
    cobsv: {
      kind: "array",
      items: { kind: "ref", name: "CobVNotification" },
    },
  },
  required: [],
  additionalProperties: true,
};
const cGetPixE2eidResponseSchema: Constraint = { kind: "ref", name: "PixConsultado" };
const cPostCobrTxidRetentativaDataResponseSchema: Constraint = {
  kind: "allOf",
  members: [
    {
      kind: "object",
      properties: {},
      required: ["tentativas"],
      additionalProperties: true,
    },
    { kind: "ref", name: "CobRCompleta" },
  ],
};

const constraints: Record<string, Constraint> = {
  TxId: cTxId,
  EndToEndId: cEndToEndId,
  DevolucaoId: cDevolucaoId,
  DevolucaoSolicitadaNatureza: cDevolucaoSolicitadaNatureza,
  DevolucaoNatureza: cDevolucaoNatureza,
  DevolucaoNaturezaPixAutomatico: cDevolucaoNaturezaPixAutomatico,
  PayloadLocationId: cPayloadLocationId,
  PayloadLocationRecId: cPayloadLocationRecId,
  Revisao: cRevisao,
  PessoaFisica: cPessoaFisica,
  PessoaJuridica: cPessoaJuridica,
  PessoaFisicaRecorrencia: cPessoaFisicaRecorrencia,
  PessoaJuridicaRecorrencia: cPessoaJuridicaRecorrencia,
  CPF: cCPF,
  CNPJ: cCNPJ,
  DadosComplementaresPessoa: cDadosComplementaresPessoa,
  DadosDevedor: cDadosDevedor,
  DadosDevedorRecorrencia: cDadosDevedorRecorrencia,
  DadosRecebedor: cDadosRecebedor,
  DadosBancarios: cDadosBancarios,
  DadosBancariosRecebedor: cDadosBancariosRecebedor,
  DadosPagadorRec: cDadosPagadorRec,
  WebhookSolicitado: cWebhookSolicitado,
  WebhookCompleto: cWebhookCompleto,
  WebhookRecBase: cWebhookRecBase,
  WebhookRecCompleto: cWebhookRecCompleto,
  WebhookCobRCompleto: cWebhookCobRCompleto,
  WebhookCobCompleto: cWebhookCobCompleto,
  WebhookCobVSolicitado: cWebhookCobVSolicitado,
  WebhookCobVCompleto: cWebhookCobVCompleto,
  InfoBaseAgenciaConta: cInfoBaseAgenciaConta,
  InfoBaseChave: cInfoBaseChave,
  WebhookRecSolicitado: cWebhookRecSolicitado,
  WebhookCobRSolicitado: cWebhookCobRSolicitado,
  WebhookCobSolicitado: cWebhookCobSolicitado,
  CobExpiracao: cCobExpiracao,
  CobDataDeVencimento: cCobDataDeVencimento,
  CobApresentacao: cCobApresentacao,
  CobCriacao: cCobCriacao,
  CobVValor: cCobVValor,
  CobValor: cCobValor,
  CobPayloadValor: cCobPayloadValor,
  CobVPayloadValor: cCobVPayloadValor,
  RecCompleta: cRecCompleta,
  RecCompletaPesquisada: cRecCompletaPesquisada,
  RecGerada: cRecGerada,
  RecSolicitada: cRecSolicitada,
  RecPayload: cRecPayload,
  RecRevisada: cRecRevisada,
  RecNotification: cRecNotification,
  RecAtivacao: cRecAtivacao,
  RecAtivacaoSolicitada: cRecAtivacaoSolicitada,
  RecStatus: cRecStatus,
  RecConfiguracao: cRecConfiguracao,
  RecAtualizacao: cRecAtualizacao,
  RecEncerramento: cRecEncerramento,
  RecId: cRecId,
  RecBase: cRecBase,
  SolicRecId: cSolicRecId,
  SolicRecBase: cSolicRecBase,
  SolicRecStatus: cSolicRecStatus,
  SolicRecAtualizacao: cSolicRecAtualizacao,
  SolicRecEncerramento: cSolicRecEncerramento,
  SolicRecSolicitada: cSolicRecSolicitada,
  SolicRecRevisada: cSolicRecRevisada,
  SolicRecCompleta: cSolicRecCompleta,
  TributoCompleto: cTributoCompleto,
  TributoCompletoPix: cTributoCompletoPix,
  TributoPayload: cTributoPayload,
  TributoInformadoCompleto: cTributoInformadoCompleto,
  TributoInformadoSolicitado: cTributoInformadoSolicitado,
  RegistroCategoriaTributoInformadoSolicitado: cRegistroCategoriaTributoInformadoSolicitado,
  RegistroCategoriaTributoInformadoCompleto: cRegistroCategoriaTributoInformadoCompleto,
  RegistroCategoriaTributoPayload: cRegistroCategoriaTributoPayload,
  RegistroCategoriaTributoCompleto: cRegistroCategoriaTributoCompleto,
  RegistroCategoriaTributoCompletoPix: cRegistroCategoriaTributoCompletoPix,
  ValorTributoDetalheCompleto: cValorTributoDetalheCompleto,
  ValorTributoDetalheSolicitado: cValorTributoDetalheSolicitado,
  ValorLiquidoEstimado: cValorLiquidoEstimado,
  CobRGerada: cCobRGerada,
  CobRCompleta: cCobRCompleta,
  CobRAtualizacao: cCobRAtualizacao,
  CobRTentativas: cCobRTentativas,
  CobRRevisada: cCobRRevisada,
  CobRSolicitada: cCobRSolicitada,
  CobRNotification: cCobRNotification,
  CobNotification: cCobNotification,
  CobVNotification: cCobVNotification,
  CobRConfiguracao: cCobRConfiguracao,
  CobRStatus: cCobRStatus,
  CobRStatusRevisada: cCobRStatusRevisada,
  CobRBase: cCobRBase,
  CobBase: cCobBase,
  CobBaseCopiaCola: cCobBaseCopiaCola,
  CobSolicitada: cCobSolicitada,
  CobVSolicitada: cCobVSolicitada,
  CobRevisada: cCobRevisada,
  CobVRevisada: cCobVRevisada,
  CobGerada: cCobGerada,
  CobVGerada: cCobVGerada,
  CobStatus: cCobStatus,
  CobVStatus: cCobVStatus,
  LoteCobVGerado: cLoteCobVGerado,
  CobVCompleta: cCobVCompleta,
  CobCompleta: cCobCompleta,
  LoteCobVConsultado: cLoteCobVConsultado,
  LotesCobVConsultados: cLotesCobVConsultados,
  CobVPayload: cCobVPayload,
  CobPayload: cCobPayload,
  PayloadLocation: cPayloadLocation,
  PayloadLocationSolicitada: cPayloadLocationSolicitada,
  PayloadLocationRecSolicitada: cPayloadLocationRecSolicitada,
  PayloadLocationRecGerada: cPayloadLocationRecGerada,
  PayloadLocationRecCompleta: cPayloadLocationRecCompleta,
  PayloadLocationCompleta: cPayloadLocationCompleta,
  PayloadLocationCob: cPayloadLocationCob,
  ParametrosConsultaRec: cParametrosConsultaRec,
  ParametrosConsultaCob: cParametrosConsultaCob,
  ParametrosConsultaCobR: cParametrosConsultaCobR,
  ParametrosConsultaLote: cParametrosConsultaLote,
  CobsVConsultadas: cCobsVConsultadas,
  CobsConsultadas: cCobsConsultadas,
  CobsRConsultadas: cCobsRConsultadas,
  RecsConsultadas: cRecsConsultadas,
  Pix: cPix,
  PixAutomatico: cPixAutomatico,
  PixValorOriginal: cPixValorOriginal,
  PixValorSaque: cPixValorSaque,
  PixValorTroco: cPixValorTroco,
  PixValorJuros: cPixValorJuros,
  PixValorMulta: cPixValorMulta,
  PixValorDesconto: cPixValorDesconto,
  PixValorAbatimento: cPixValorAbatimento,
  Devolucao: cDevolucao,
  DevolucaoPixAutomatico: cDevolucaoPixAutomatico,
  DevolucaoSolicitada: cDevolucaoSolicitada,
  ParametrosConsultaPayloadLocation: cParametrosConsultaPayloadLocation,
  ParametrosConsultaPayloadLocationRec: cParametrosConsultaPayloadLocationRec,
  PayloadLocationConsultadas: cPayloadLocationConsultadas,
  PayloadLocationRecConsultadas: cPayloadLocationRecConsultadas,
  ParametrosConsultaPix: cParametrosConsultaPix,
  ParametrosConsultaWebhooks: cParametrosConsultaWebhooks,
  PixConsultado: cPixConsultado,
  PixAutomaticoConsultado: cPixAutomaticoConsultado,
  PixConsultados: cPixConsultados,
  WebhooksConsultados: cWebhooksConsultados,
  WebhooksRecConsultados: cWebhooksRecConsultados,
  Paginacao: cPaginacao,
  Violacao: cViolacao,
  Problema: cProblema,
  Inicio: cInicio,
  Fim: cFim,
  LoteCobVBody: cLoteCobVBody,
  LoteCobVBodyRevisado: cLoteCobVBodyRevisado,
  WebhookPixBody: cWebhookPixBody,
  WebhookRecBody: cWebhookRecBody,
  WebhookCobRBody: cWebhookCobRBody,
  WebhookCobBody: cWebhookCobBody,
  WebhookCobVBody: cWebhookCobVBody,
  GetPixE2eidResponseSchema: cGetPixE2eidResponseSchema,
  PostCobrTxidRetentativaDataResponseSchema: cPostCobrTxidRetentativaDataResponseSchema,
};

/** All named constraints; resolves `{ kind: "ref" }` links at validation time. */
export const constraintRegistry: ReadonlyMap<string, Constraint> = new Map(
  Object.entries(constraints),
);

export function validateTxId(value: unknown): ValidationResult<TxId> {
  return validate<TxId>(cTxId, value, constraintRegistry);
}

export function validateEndToEndId(value: unknown): ValidationResult<EndToEndId> {
  return validate<EndToEndId>(cEndToEndId, value, constraintRegistry);
}

export function validateDevolucaoId(value: unknown): ValidationResult<DevolucaoId> {
  return validate<DevolucaoId>(cDevolucaoId, value, constraintRegistry);
}

export function validateDevolucaoSolicitadaNatureza(
  value: unknown,
): ValidationResult<DevolucaoSolicitadaNatureza> {
  return validate<DevolucaoSolicitadaNatureza>(
    cDevolucaoSolicitadaNatureza,
    value,
    constraintRegistry,
  );
}

export function validateDevolucaoNatureza(value: unknown): ValidationResult<DevolucaoNatureza> {
  return validate<DevolucaoNatureza>(cDevolucaoNatureza, value, constraintRegistry);
}

export function validateDevolucaoNaturezaPixAutomatico(
  value: unknown,
): ValidationResult<DevolucaoNaturezaPixAutomatico> {
  return validate<DevolucaoNaturezaPixAutomatico>(
    cDevolucaoNaturezaPixAutomatico,
    value,
    constraintRegistry,
  );
}

export function validatePayloadLocationId(value: unknown): ValidationResult<PayloadLocationId> {
  return validate<PayloadLocationId>(cPayloadLocationId, value, constraintRegistry);
}

export function validatePayloadLocationRecId(
  value: unknown,
): ValidationResult<PayloadLocationRecId> {
  return validate<PayloadLocationRecId>(cPayloadLocationRecId, value, constraintRegistry);
}

export function validateRevisao(value: unknown): ValidationResult<Revisao> {
  return validate<Revisao>(cRevisao, value, constraintRegistry);
}

export function validatePessoaFisica(value: unknown): ValidationResult<PessoaFisica> {
  return validate<PessoaFisica>(cPessoaFisica, value, constraintRegistry);
}

export function validatePessoaJuridica(value: unknown): ValidationResult<PessoaJuridica> {
  return validate<PessoaJuridica>(cPessoaJuridica, value, constraintRegistry);
}

export function validatePessoaFisicaRecorrencia(
  value: unknown,
): ValidationResult<PessoaFisicaRecorrencia> {
  return validate<PessoaFisicaRecorrencia>(cPessoaFisicaRecorrencia, value, constraintRegistry);
}

export function validatePessoaJuridicaRecorrencia(
  value: unknown,
): ValidationResult<PessoaJuridicaRecorrencia> {
  return validate<PessoaJuridicaRecorrencia>(cPessoaJuridicaRecorrencia, value, constraintRegistry);
}

export function validateCPF(value: unknown): ValidationResult<CPF> {
  return validate<CPF>(cCPF, value, constraintRegistry);
}

export function validateCNPJ(value: unknown): ValidationResult<CNPJ> {
  return validate<CNPJ>(cCNPJ, value, constraintRegistry);
}

export function validateDadosComplementaresPessoa(
  value: unknown,
): ValidationResult<DadosComplementaresPessoa> {
  return validate<DadosComplementaresPessoa>(cDadosComplementaresPessoa, value, constraintRegistry);
}

export function validateDadosDevedor(value: unknown): ValidationResult<DadosDevedor> {
  return validate<DadosDevedor>(cDadosDevedor, value, constraintRegistry);
}

export function validateDadosDevedorRecorrencia(
  value: unknown,
): ValidationResult<DadosDevedorRecorrencia> {
  return validate<DadosDevedorRecorrencia>(cDadosDevedorRecorrencia, value, constraintRegistry);
}

export function validateDadosRecebedor(value: unknown): ValidationResult<DadosRecebedor> {
  return validate<DadosRecebedor>(cDadosRecebedor, value, constraintRegistry);
}

export function validateDadosBancarios(value: unknown): ValidationResult<DadosBancarios> {
  return validate<DadosBancarios>(cDadosBancarios, value, constraintRegistry);
}

export function validateDadosBancariosRecebedor(
  value: unknown,
): ValidationResult<DadosBancariosRecebedor> {
  return validate<DadosBancariosRecebedor>(cDadosBancariosRecebedor, value, constraintRegistry);
}

export function validateDadosPagadorRec(value: unknown): ValidationResult<DadosPagadorRec> {
  return validate<DadosPagadorRec>(cDadosPagadorRec, value, constraintRegistry);
}

export function validateWebhookSolicitado(value: unknown): ValidationResult<WebhookSolicitado> {
  return validate<WebhookSolicitado>(cWebhookSolicitado, value, constraintRegistry);
}

export function validateWebhookCompleto(value: unknown): ValidationResult<WebhookCompleto> {
  return validate<WebhookCompleto>(cWebhookCompleto, value, constraintRegistry);
}

export function validateWebhookRecBase(value: unknown): ValidationResult<WebhookRecBase> {
  return validate<WebhookRecBase>(cWebhookRecBase, value, constraintRegistry);
}

export function validateWebhookRecCompleto(value: unknown): ValidationResult<WebhookRecCompleto> {
  return validate<WebhookRecCompleto>(cWebhookRecCompleto, value, constraintRegistry);
}

export function validateWebhookCobRCompleto(value: unknown): ValidationResult<WebhookCobRCompleto> {
  return validate<WebhookCobRCompleto>(cWebhookCobRCompleto, value, constraintRegistry);
}

export function validateWebhookCobCompleto(value: unknown): ValidationResult<WebhookCobCompleto> {
  return validate<WebhookCobCompleto>(cWebhookCobCompleto, value, constraintRegistry);
}

export function validateWebhookCobVSolicitado(
  value: unknown,
): ValidationResult<WebhookCobVSolicitado> {
  return validate<WebhookCobVSolicitado>(cWebhookCobVSolicitado, value, constraintRegistry);
}

export function validateWebhookCobVCompleto(value: unknown): ValidationResult<WebhookCobVCompleto> {
  return validate<WebhookCobVCompleto>(cWebhookCobVCompleto, value, constraintRegistry);
}

export function validateInfoBaseAgenciaConta(
  value: unknown,
): ValidationResult<InfoBaseAgenciaConta> {
  return validate<InfoBaseAgenciaConta>(cInfoBaseAgenciaConta, value, constraintRegistry);
}

export function validateInfoBaseChave(value: unknown): ValidationResult<InfoBaseChave> {
  return validate<InfoBaseChave>(cInfoBaseChave, value, constraintRegistry);
}

export function validateWebhookRecSolicitado(
  value: unknown,
): ValidationResult<WebhookRecSolicitado> {
  return validate<WebhookRecSolicitado>(cWebhookRecSolicitado, value, constraintRegistry);
}

export function validateWebhookCobRSolicitado(
  value: unknown,
): ValidationResult<WebhookCobRSolicitado> {
  return validate<WebhookCobRSolicitado>(cWebhookCobRSolicitado, value, constraintRegistry);
}

export function validateWebhookCobSolicitado(
  value: unknown,
): ValidationResult<WebhookCobSolicitado> {
  return validate<WebhookCobSolicitado>(cWebhookCobSolicitado, value, constraintRegistry);
}

export function validateCobExpiracao(value: unknown): ValidationResult<CobExpiracao> {
  return validate<CobExpiracao>(cCobExpiracao, value, constraintRegistry);
}

export function validateCobDataDeVencimento(value: unknown): ValidationResult<CobDataDeVencimento> {
  return validate<CobDataDeVencimento>(cCobDataDeVencimento, value, constraintRegistry);
}

export function validateCobApresentacao(value: unknown): ValidationResult<CobApresentacao> {
  return validate<CobApresentacao>(cCobApresentacao, value, constraintRegistry);
}

export function validateCobCriacao(value: unknown): ValidationResult<CobCriacao> {
  return validate<CobCriacao>(cCobCriacao, value, constraintRegistry);
}

export function validateCobVValor(value: unknown): ValidationResult<CobVValor> {
  return validate<CobVValor>(cCobVValor, value, constraintRegistry);
}

export function validateCobValor(value: unknown): ValidationResult<CobValor> {
  return validate<CobValor>(cCobValor, value, constraintRegistry);
}

export function validateCobPayloadValor(value: unknown): ValidationResult<CobPayloadValor> {
  return validate<CobPayloadValor>(cCobPayloadValor, value, constraintRegistry);
}

export function validateCobVPayloadValor(value: unknown): ValidationResult<CobVPayloadValor> {
  return validate<CobVPayloadValor>(cCobVPayloadValor, value, constraintRegistry);
}

export function validateRecCompleta(value: unknown): ValidationResult<RecCompleta> {
  return validate<RecCompleta>(cRecCompleta, value, constraintRegistry);
}

export function validateRecCompletaPesquisada(
  value: unknown,
): ValidationResult<RecCompletaPesquisada> {
  return validate<RecCompletaPesquisada>(cRecCompletaPesquisada, value, constraintRegistry);
}

export function validateRecGerada(value: unknown): ValidationResult<RecGerada> {
  return validate<RecGerada>(cRecGerada, value, constraintRegistry);
}

export function validateRecSolicitada(value: unknown): ValidationResult<RecSolicitada> {
  return validate<RecSolicitada>(cRecSolicitada, value, constraintRegistry);
}

export function validateRecPayload(value: unknown): ValidationResult<RecPayload> {
  return validate<RecPayload>(cRecPayload, value, constraintRegistry);
}

export function validateRecRevisada(value: unknown): ValidationResult<RecRevisada> {
  return validate<RecRevisada>(cRecRevisada, value, constraintRegistry);
}

export function validateRecNotification(value: unknown): ValidationResult<RecNotification> {
  return validate<RecNotification>(cRecNotification, value, constraintRegistry);
}

export function validateRecAtivacao(value: unknown): ValidationResult<RecAtivacao> {
  return validate<RecAtivacao>(cRecAtivacao, value, constraintRegistry);
}

export function validateRecAtivacaoSolicitada(
  value: unknown,
): ValidationResult<RecAtivacaoSolicitada> {
  return validate<RecAtivacaoSolicitada>(cRecAtivacaoSolicitada, value, constraintRegistry);
}

export function validateRecStatus(value: unknown): ValidationResult<RecStatus> {
  return validate<RecStatus>(cRecStatus, value, constraintRegistry);
}

export function validateRecConfiguracao(value: unknown): ValidationResult<RecConfiguracao> {
  return validate<RecConfiguracao>(cRecConfiguracao, value, constraintRegistry);
}

export function validateRecAtualizacao(value: unknown): ValidationResult<RecAtualizacao> {
  return validate<RecAtualizacao>(cRecAtualizacao, value, constraintRegistry);
}

export function validateRecEncerramento(value: unknown): ValidationResult<RecEncerramento> {
  return validate<RecEncerramento>(cRecEncerramento, value, constraintRegistry);
}

export function validateRecId(value: unknown): ValidationResult<RecId> {
  return validate<RecId>(cRecId, value, constraintRegistry);
}

export function validateRecBase(value: unknown): ValidationResult<RecBase> {
  return validate<RecBase>(cRecBase, value, constraintRegistry);
}

export function validateSolicRecId(value: unknown): ValidationResult<SolicRecId> {
  return validate<SolicRecId>(cSolicRecId, value, constraintRegistry);
}

export function validateSolicRecBase(value: unknown): ValidationResult<SolicRecBase> {
  return validate<SolicRecBase>(cSolicRecBase, value, constraintRegistry);
}

export function validateSolicRecStatus(value: unknown): ValidationResult<SolicRecStatus> {
  return validate<SolicRecStatus>(cSolicRecStatus, value, constraintRegistry);
}

export function validateSolicRecAtualizacao(value: unknown): ValidationResult<SolicRecAtualizacao> {
  return validate<SolicRecAtualizacao>(cSolicRecAtualizacao, value, constraintRegistry);
}

export function validateSolicRecEncerramento(
  value: unknown,
): ValidationResult<SolicRecEncerramento> {
  return validate<SolicRecEncerramento>(cSolicRecEncerramento, value, constraintRegistry);
}

export function validateSolicRecSolicitada(value: unknown): ValidationResult<SolicRecSolicitada> {
  return validate<SolicRecSolicitada>(cSolicRecSolicitada, value, constraintRegistry);
}

export function validateSolicRecRevisada(value: unknown): ValidationResult<SolicRecRevisada> {
  return validate<SolicRecRevisada>(cSolicRecRevisada, value, constraintRegistry);
}

export function validateSolicRecCompleta(value: unknown): ValidationResult<SolicRecCompleta> {
  return validate<SolicRecCompleta>(cSolicRecCompleta, value, constraintRegistry);
}

export function validateTributoCompleto(value: unknown): ValidationResult<TributoCompleto> {
  return validate<TributoCompleto>(cTributoCompleto, value, constraintRegistry);
}

export function validateTributoCompletoPix(value: unknown): ValidationResult<TributoCompletoPix> {
  return validate<TributoCompletoPix>(cTributoCompletoPix, value, constraintRegistry);
}

export function validateTributoPayload(value: unknown): ValidationResult<TributoPayload> {
  return validate<TributoPayload>(cTributoPayload, value, constraintRegistry);
}

export function validateTributoInformadoCompleto(
  value: unknown,
): ValidationResult<TributoInformadoCompleto> {
  return validate<TributoInformadoCompleto>(cTributoInformadoCompleto, value, constraintRegistry);
}

export function validateTributoInformadoSolicitado(
  value: unknown,
): ValidationResult<TributoInformadoSolicitado> {
  return validate<TributoInformadoSolicitado>(
    cTributoInformadoSolicitado,
    value,
    constraintRegistry,
  );
}

export function validateRegistroCategoriaTributoInformadoSolicitado(
  value: unknown,
): ValidationResult<RegistroCategoriaTributoInformadoSolicitado> {
  return validate<RegistroCategoriaTributoInformadoSolicitado>(
    cRegistroCategoriaTributoInformadoSolicitado,
    value,
    constraintRegistry,
  );
}

export function validateRegistroCategoriaTributoInformadoCompleto(
  value: unknown,
): ValidationResult<RegistroCategoriaTributoInformadoCompleto> {
  return validate<RegistroCategoriaTributoInformadoCompleto>(
    cRegistroCategoriaTributoInformadoCompleto,
    value,
    constraintRegistry,
  );
}

export function validateRegistroCategoriaTributoPayload(
  value: unknown,
): ValidationResult<RegistroCategoriaTributoPayload> {
  return validate<RegistroCategoriaTributoPayload>(
    cRegistroCategoriaTributoPayload,
    value,
    constraintRegistry,
  );
}

export function validateRegistroCategoriaTributoCompleto(
  value: unknown,
): ValidationResult<RegistroCategoriaTributoCompleto> {
  return validate<RegistroCategoriaTributoCompleto>(
    cRegistroCategoriaTributoCompleto,
    value,
    constraintRegistry,
  );
}

export function validateRegistroCategoriaTributoCompletoPix(
  value: unknown,
): ValidationResult<RegistroCategoriaTributoCompletoPix> {
  return validate<RegistroCategoriaTributoCompletoPix>(
    cRegistroCategoriaTributoCompletoPix,
    value,
    constraintRegistry,
  );
}

export function validateValorTributoDetalheCompleto(
  value: unknown,
): ValidationResult<ValorTributoDetalheCompleto> {
  return validate<ValorTributoDetalheCompleto>(
    cValorTributoDetalheCompleto,
    value,
    constraintRegistry,
  );
}

export function validateValorTributoDetalheSolicitado(
  value: unknown,
): ValidationResult<ValorTributoDetalheSolicitado> {
  return validate<ValorTributoDetalheSolicitado>(
    cValorTributoDetalheSolicitado,
    value,
    constraintRegistry,
  );
}

export function validateValorLiquidoEstimado(
  value: unknown,
): ValidationResult<ValorLiquidoEstimado> {
  return validate<ValorLiquidoEstimado>(cValorLiquidoEstimado, value, constraintRegistry);
}

export function validateCobRGerada(value: unknown): ValidationResult<CobRGerada> {
  return validate<CobRGerada>(cCobRGerada, value, constraintRegistry);
}

export function validateCobRCompleta(value: unknown): ValidationResult<CobRCompleta> {
  return validate<CobRCompleta>(cCobRCompleta, value, constraintRegistry);
}

export function validateCobRAtualizacao(value: unknown): ValidationResult<CobRAtualizacao> {
  return validate<CobRAtualizacao>(cCobRAtualizacao, value, constraintRegistry);
}

export function validateCobRTentativas(value: unknown): ValidationResult<CobRTentativas> {
  return validate<CobRTentativas>(cCobRTentativas, value, constraintRegistry);
}

export function validateCobRRevisada(value: unknown): ValidationResult<CobRRevisada> {
  return validate<CobRRevisada>(cCobRRevisada, value, constraintRegistry);
}

export function validateCobRSolicitada(value: unknown): ValidationResult<CobRSolicitada> {
  return validate<CobRSolicitada>(cCobRSolicitada, value, constraintRegistry);
}

export function validateCobRNotification(value: unknown): ValidationResult<CobRNotification> {
  return validate<CobRNotification>(cCobRNotification, value, constraintRegistry);
}

export function validateCobNotification(value: unknown): ValidationResult<CobNotification> {
  return validate<CobNotification>(cCobNotification, value, constraintRegistry);
}

export function validateCobVNotification(value: unknown): ValidationResult<CobVNotification> {
  return validate<CobVNotification>(cCobVNotification, value, constraintRegistry);
}

export function validateCobRConfiguracao(value: unknown): ValidationResult<CobRConfiguracao> {
  return validate<CobRConfiguracao>(cCobRConfiguracao, value, constraintRegistry);
}

export function validateCobRStatus(value: unknown): ValidationResult<CobRStatus> {
  return validate<CobRStatus>(cCobRStatus, value, constraintRegistry);
}

export function validateCobRStatusRevisada(value: unknown): ValidationResult<CobRStatusRevisada> {
  return validate<CobRStatusRevisada>(cCobRStatusRevisada, value, constraintRegistry);
}

export function validateCobRBase(value: unknown): ValidationResult<CobRBase> {
  return validate<CobRBase>(cCobRBase, value, constraintRegistry);
}

export function validateCobBase(value: unknown): ValidationResult<CobBase> {
  return validate<CobBase>(cCobBase, value, constraintRegistry);
}

export function validateCobBaseCopiaCola(value: unknown): ValidationResult<CobBaseCopiaCola> {
  return validate<CobBaseCopiaCola>(cCobBaseCopiaCola, value, constraintRegistry);
}

export function validateCobSolicitada(value: unknown): ValidationResult<CobSolicitada> {
  return validate<CobSolicitada>(cCobSolicitada, value, constraintRegistry);
}

export function validateCobVSolicitada(value: unknown): ValidationResult<CobVSolicitada> {
  return validate<CobVSolicitada>(cCobVSolicitada, value, constraintRegistry);
}

export function validateCobRevisada(value: unknown): ValidationResult<CobRevisada> {
  return validate<CobRevisada>(cCobRevisada, value, constraintRegistry);
}

export function validateCobVRevisada(value: unknown): ValidationResult<CobVRevisada> {
  return validate<CobVRevisada>(cCobVRevisada, value, constraintRegistry);
}

export function validateCobGerada(value: unknown): ValidationResult<CobGerada> {
  return validate<CobGerada>(cCobGerada, value, constraintRegistry);
}

export function validateCobVGerada(value: unknown): ValidationResult<CobVGerada> {
  return validate<CobVGerada>(cCobVGerada, value, constraintRegistry);
}

export function validateCobStatus(value: unknown): ValidationResult<CobStatus> {
  return validate<CobStatus>(cCobStatus, value, constraintRegistry);
}

export function validateCobVStatus(value: unknown): ValidationResult<CobVStatus> {
  return validate<CobVStatus>(cCobVStatus, value, constraintRegistry);
}

export function validateLoteCobVGerado(value: unknown): ValidationResult<LoteCobVGerado> {
  return validate<LoteCobVGerado>(cLoteCobVGerado, value, constraintRegistry);
}

export function validateCobVCompleta(value: unknown): ValidationResult<CobVCompleta> {
  return validate<CobVCompleta>(cCobVCompleta, value, constraintRegistry);
}

export function validateCobCompleta(value: unknown): ValidationResult<CobCompleta> {
  return validate<CobCompleta>(cCobCompleta, value, constraintRegistry);
}

export function validateLoteCobVConsultado(value: unknown): ValidationResult<LoteCobVConsultado> {
  return validate<LoteCobVConsultado>(cLoteCobVConsultado, value, constraintRegistry);
}

export function validateLotesCobVConsultados(
  value: unknown,
): ValidationResult<LotesCobVConsultados> {
  return validate<LotesCobVConsultados>(cLotesCobVConsultados, value, constraintRegistry);
}

export function validateCobVPayload(value: unknown): ValidationResult<CobVPayload> {
  return validate<CobVPayload>(cCobVPayload, value, constraintRegistry);
}

export function validateCobPayload(value: unknown): ValidationResult<CobPayload> {
  return validate<CobPayload>(cCobPayload, value, constraintRegistry);
}

export function validatePayloadLocation(value: unknown): ValidationResult<PayloadLocation> {
  return validate<PayloadLocation>(cPayloadLocation, value, constraintRegistry);
}

export function validatePayloadLocationSolicitada(
  value: unknown,
): ValidationResult<PayloadLocationSolicitada> {
  return validate<PayloadLocationSolicitada>(cPayloadLocationSolicitada, value, constraintRegistry);
}

export function validatePayloadLocationRecSolicitada(
  value: unknown,
): ValidationResult<PayloadLocationRecSolicitada> {
  return validate<PayloadLocationRecSolicitada>(
    cPayloadLocationRecSolicitada,
    value,
    constraintRegistry,
  );
}

export function validatePayloadLocationRecGerada(
  value: unknown,
): ValidationResult<PayloadLocationRecGerada> {
  return validate<PayloadLocationRecGerada>(cPayloadLocationRecGerada, value, constraintRegistry);
}

export function validatePayloadLocationRecCompleta(
  value: unknown,
): ValidationResult<PayloadLocationRecCompleta> {
  return validate<PayloadLocationRecCompleta>(
    cPayloadLocationRecCompleta,
    value,
    constraintRegistry,
  );
}

export function validatePayloadLocationCompleta(
  value: unknown,
): ValidationResult<PayloadLocationCompleta> {
  return validate<PayloadLocationCompleta>(cPayloadLocationCompleta, value, constraintRegistry);
}

export function validatePayloadLocationCob(value: unknown): ValidationResult<PayloadLocationCob> {
  return validate<PayloadLocationCob>(cPayloadLocationCob, value, constraintRegistry);
}

export function validateParametrosConsultaRec(
  value: unknown,
): ValidationResult<ParametrosConsultaRec> {
  return validate<ParametrosConsultaRec>(cParametrosConsultaRec, value, constraintRegistry);
}

export function validateParametrosConsultaCob(
  value: unknown,
): ValidationResult<ParametrosConsultaCob> {
  return validate<ParametrosConsultaCob>(cParametrosConsultaCob, value, constraintRegistry);
}

export function validateParametrosConsultaCobR(
  value: unknown,
): ValidationResult<ParametrosConsultaCobR> {
  return validate<ParametrosConsultaCobR>(cParametrosConsultaCobR, value, constraintRegistry);
}

export function validateParametrosConsultaLote(
  value: unknown,
): ValidationResult<ParametrosConsultaLote> {
  return validate<ParametrosConsultaLote>(cParametrosConsultaLote, value, constraintRegistry);
}

export function validateCobsVConsultadas(value: unknown): ValidationResult<CobsVConsultadas> {
  return validate<CobsVConsultadas>(cCobsVConsultadas, value, constraintRegistry);
}

export function validateCobsConsultadas(value: unknown): ValidationResult<CobsConsultadas> {
  return validate<CobsConsultadas>(cCobsConsultadas, value, constraintRegistry);
}

export function validateCobsRConsultadas(value: unknown): ValidationResult<CobsRConsultadas> {
  return validate<CobsRConsultadas>(cCobsRConsultadas, value, constraintRegistry);
}

export function validateRecsConsultadas(value: unknown): ValidationResult<RecsConsultadas> {
  return validate<RecsConsultadas>(cRecsConsultadas, value, constraintRegistry);
}

export function validatePix(value: unknown): ValidationResult<Pix> {
  return validate<Pix>(cPix, value, constraintRegistry);
}

export function validatePixAutomatico(value: unknown): ValidationResult<PixAutomatico> {
  return validate<PixAutomatico>(cPixAutomatico, value, constraintRegistry);
}

export function validatePixValorOriginal(value: unknown): ValidationResult<PixValorOriginal> {
  return validate<PixValorOriginal>(cPixValorOriginal, value, constraintRegistry);
}

export function validatePixValorSaque(value: unknown): ValidationResult<PixValorSaque> {
  return validate<PixValorSaque>(cPixValorSaque, value, constraintRegistry);
}

export function validatePixValorTroco(value: unknown): ValidationResult<PixValorTroco> {
  return validate<PixValorTroco>(cPixValorTroco, value, constraintRegistry);
}

export function validatePixValorJuros(value: unknown): ValidationResult<PixValorJuros> {
  return validate<PixValorJuros>(cPixValorJuros, value, constraintRegistry);
}

export function validatePixValorMulta(value: unknown): ValidationResult<PixValorMulta> {
  return validate<PixValorMulta>(cPixValorMulta, value, constraintRegistry);
}

export function validatePixValorDesconto(value: unknown): ValidationResult<PixValorDesconto> {
  return validate<PixValorDesconto>(cPixValorDesconto, value, constraintRegistry);
}

export function validatePixValorAbatimento(value: unknown): ValidationResult<PixValorAbatimento> {
  return validate<PixValorAbatimento>(cPixValorAbatimento, value, constraintRegistry);
}

export function validateDevolucao(value: unknown): ValidationResult<Devolucao> {
  return validate<Devolucao>(cDevolucao, value, constraintRegistry);
}

export function validateDevolucaoPixAutomatico(
  value: unknown,
): ValidationResult<DevolucaoPixAutomatico> {
  return validate<DevolucaoPixAutomatico>(cDevolucaoPixAutomatico, value, constraintRegistry);
}

export function validateDevolucaoSolicitada(value: unknown): ValidationResult<DevolucaoSolicitada> {
  return validate<DevolucaoSolicitada>(cDevolucaoSolicitada, value, constraintRegistry);
}

export function validateParametrosConsultaPayloadLocation(
  value: unknown,
): ValidationResult<ParametrosConsultaPayloadLocation> {
  return validate<ParametrosConsultaPayloadLocation>(
    cParametrosConsultaPayloadLocation,
    value,
    constraintRegistry,
  );
}

export function validateParametrosConsultaPayloadLocationRec(
  value: unknown,
): ValidationResult<ParametrosConsultaPayloadLocationRec> {
  return validate<ParametrosConsultaPayloadLocationRec>(
    cParametrosConsultaPayloadLocationRec,
    value,
    constraintRegistry,
  );
}

export function validatePayloadLocationConsultadas(
  value: unknown,
): ValidationResult<PayloadLocationConsultadas> {
  return validate<PayloadLocationConsultadas>(
    cPayloadLocationConsultadas,
    value,
    constraintRegistry,
  );
}

export function validatePayloadLocationRecConsultadas(
  value: unknown,
): ValidationResult<PayloadLocationRecConsultadas> {
  return validate<PayloadLocationRecConsultadas>(
    cPayloadLocationRecConsultadas,
    value,
    constraintRegistry,
  );
}

export function validateParametrosConsultaPix(
  value: unknown,
): ValidationResult<ParametrosConsultaPix> {
  return validate<ParametrosConsultaPix>(cParametrosConsultaPix, value, constraintRegistry);
}

export function validateParametrosConsultaWebhooks(
  value: unknown,
): ValidationResult<ParametrosConsultaWebhooks> {
  return validate<ParametrosConsultaWebhooks>(
    cParametrosConsultaWebhooks,
    value,
    constraintRegistry,
  );
}

export function validatePixConsultado(value: unknown): ValidationResult<PixConsultado> {
  return validate<PixConsultado>(cPixConsultado, value, constraintRegistry);
}

export function validatePixAutomaticoConsultado(
  value: unknown,
): ValidationResult<PixAutomaticoConsultado> {
  return validate<PixAutomaticoConsultado>(cPixAutomaticoConsultado, value, constraintRegistry);
}

export function validatePixConsultados(value: unknown): ValidationResult<PixConsultados> {
  return validate<PixConsultados>(cPixConsultados, value, constraintRegistry);
}

export function validateWebhooksConsultados(value: unknown): ValidationResult<WebhooksConsultados> {
  return validate<WebhooksConsultados>(cWebhooksConsultados, value, constraintRegistry);
}

export function validateWebhooksRecConsultados(
  value: unknown,
): ValidationResult<WebhooksRecConsultados> {
  return validate<WebhooksRecConsultados>(cWebhooksRecConsultados, value, constraintRegistry);
}

export function validatePaginacao(value: unknown): ValidationResult<Paginacao> {
  return validate<Paginacao>(cPaginacao, value, constraintRegistry);
}

export function validateViolacao(value: unknown): ValidationResult<Violacao> {
  return validate<Violacao>(cViolacao, value, constraintRegistry);
}

export function validateProblema(value: unknown): ValidationResult<Problema> {
  return validate<Problema>(cProblema, value, constraintRegistry);
}

export function validateInicio(value: unknown): ValidationResult<Inicio> {
  return validate<Inicio>(cInicio, value, constraintRegistry);
}

export function validateFim(value: unknown): ValidationResult<Fim> {
  return validate<Fim>(cFim, value, constraintRegistry);
}

export function validateLoteCobVBody(value: unknown): ValidationResult<LoteCobVBody> {
  return validate<LoteCobVBody>(cLoteCobVBody, value, constraintRegistry);
}

export function validateLoteCobVBodyRevisado(
  value: unknown,
): ValidationResult<LoteCobVBodyRevisado> {
  return validate<LoteCobVBodyRevisado>(cLoteCobVBodyRevisado, value, constraintRegistry);
}

export function validateWebhookPixBody(value: unknown): ValidationResult<WebhookPixBody> {
  return validate<WebhookPixBody>(cWebhookPixBody, value, constraintRegistry);
}

export function validateWebhookRecBody(value: unknown): ValidationResult<WebhookRecBody> {
  return validate<WebhookRecBody>(cWebhookRecBody, value, constraintRegistry);
}

export function validateWebhookCobRBody(value: unknown): ValidationResult<WebhookCobRBody> {
  return validate<WebhookCobRBody>(cWebhookCobRBody, value, constraintRegistry);
}

export function validateWebhookCobBody(value: unknown): ValidationResult<WebhookCobBody> {
  return validate<WebhookCobBody>(cWebhookCobBody, value, constraintRegistry);
}

export function validateWebhookCobVBody(value: unknown): ValidationResult<WebhookCobVBody> {
  return validate<WebhookCobVBody>(cWebhookCobVBody, value, constraintRegistry);
}

export function validateGetPixE2eidResponseSchema(
  value: unknown,
): ValidationResult<GetPixE2eidResponseSchema> {
  return validate<GetPixE2eidResponseSchema>(cGetPixE2eidResponseSchema, value, constraintRegistry);
}

export function validatePostCobrTxidRetentativaDataResponseSchema(
  value: unknown,
): ValidationResult<PostCobrTxidRetentativaDataResponseSchema> {
  return validate<PostCobrTxidRetentativaDataResponseSchema>(
    cPostCobrTxidRetentativaDataResponseSchema,
    value,
    constraintRegistry,
  );
}

export function validateCobBody(value: unknown): ValidationResult<CobBody> {
  return validate<CobBody>(cCobSolicitada, value, constraintRegistry);
}

export function validateCobRBody(value: unknown): ValidationResult<CobRBody> {
  return validate<CobRBody>(cCobRSolicitada, value, constraintRegistry);
}

export function validateCobVBody(value: unknown): ValidationResult<CobVBody> {
  return validate<CobVBody>(cCobVSolicitada, value, constraintRegistry);
}

export function validateCobBodyRevisada(value: unknown): ValidationResult<CobBodyRevisada> {
  return validate<CobBodyRevisada>(cCobRevisada, value, constraintRegistry);
}

export function validateCobRBodyRevisada(value: unknown): ValidationResult<CobRBodyRevisada> {
  return validate<CobRBodyRevisada>(cCobRRevisada, value, constraintRegistry);
}

export function validateCobVBodyRevisada(value: unknown): ValidationResult<CobVBodyRevisada> {
  return validate<CobVBodyRevisada>(cCobVRevisada, value, constraintRegistry);
}

export function validatePayloadLocationBody(value: unknown): ValidationResult<PayloadLocationBody> {
  return validate<PayloadLocationBody>(cPayloadLocationSolicitada, value, constraintRegistry);
}

export function validatePayloadLocationRecBody(
  value: unknown,
): ValidationResult<PayloadLocationRecBody> {
  return validate<PayloadLocationRecBody>(cPayloadLocationRecSolicitada, value, constraintRegistry);
}

export function validateDevolucaoBody(value: unknown): ValidationResult<DevolucaoBody> {
  return validate<DevolucaoBody>(cDevolucaoSolicitada, value, constraintRegistry);
}

export function validateWebhookConfigBody(value: unknown): ValidationResult<WebhookConfigBody> {
  return validate<WebhookConfigBody>(cWebhookSolicitado, value, constraintRegistry);
}

export function validateWebhookRecConfigBody(
  value: unknown,
): ValidationResult<WebhookRecConfigBody> {
  return validate<WebhookRecConfigBody>(cWebhookRecSolicitado, value, constraintRegistry);
}

export function validateWebhookCobRConfigBody(
  value: unknown,
): ValidationResult<WebhookCobRConfigBody> {
  return validate<WebhookCobRConfigBody>(cWebhookCobRSolicitado, value, constraintRegistry);
}

export function validateWebhookCobConfigBody(
  value: unknown,
): ValidationResult<WebhookCobConfigBody> {
  return validate<WebhookCobConfigBody>(cWebhookCobSolicitado, value, constraintRegistry);
}

export function validateWebhookCobVConfigBody(
  value: unknown,
): ValidationResult<WebhookCobVConfigBody> {
  return validate<WebhookCobVConfigBody>(cWebhookCobVSolicitado, value, constraintRegistry);
}

export function validateSolicRecBody(value: unknown): ValidationResult<SolicRecBody> {
  return validate<SolicRecBody>(cSolicRecSolicitada, value, constraintRegistry);
}

export function validateSolicRecBodyRevisada(
  value: unknown,
): ValidationResult<SolicRecBodyRevisada> {
  return validate<SolicRecBodyRevisada>(cSolicRecRevisada, value, constraintRegistry);
}

export function validateRecBody(value: unknown): ValidationResult<RecBody> {
  return validate<RecBody>(cRecSolicitada, value, constraintRegistry);
}

export function validateRecBodyRevisada(value: unknown): ValidationResult<RecBodyRevisada> {
  return validate<RecBodyRevisada>(cRecRevisada, value, constraintRegistry);
}

/** Validators by schema name — every schema in the spec has an entry. */
export const schemaValidators: Readonly<
  Record<string, (value: unknown) => ValidationResult<unknown>>
> = {
  TxId: validateTxId,
  EndToEndId: validateEndToEndId,
  DevolucaoId: validateDevolucaoId,
  DevolucaoSolicitadaNatureza: validateDevolucaoSolicitadaNatureza,
  DevolucaoNatureza: validateDevolucaoNatureza,
  DevolucaoNaturezaPixAutomatico: validateDevolucaoNaturezaPixAutomatico,
  PayloadLocationId: validatePayloadLocationId,
  PayloadLocationRecId: validatePayloadLocationRecId,
  Revisao: validateRevisao,
  PessoaFisica: validatePessoaFisica,
  PessoaJuridica: validatePessoaJuridica,
  PessoaFisicaRecorrencia: validatePessoaFisicaRecorrencia,
  PessoaJuridicaRecorrencia: validatePessoaJuridicaRecorrencia,
  CPF: validateCPF,
  CNPJ: validateCNPJ,
  DadosComplementaresPessoa: validateDadosComplementaresPessoa,
  DadosDevedor: validateDadosDevedor,
  DadosDevedorRecorrencia: validateDadosDevedorRecorrencia,
  DadosRecebedor: validateDadosRecebedor,
  DadosBancarios: validateDadosBancarios,
  DadosBancariosRecebedor: validateDadosBancariosRecebedor,
  DadosPagadorRec: validateDadosPagadorRec,
  WebhookSolicitado: validateWebhookSolicitado,
  WebhookCompleto: validateWebhookCompleto,
  WebhookRecBase: validateWebhookRecBase,
  WebhookRecCompleto: validateWebhookRecCompleto,
  WebhookCobRCompleto: validateWebhookCobRCompleto,
  WebhookCobCompleto: validateWebhookCobCompleto,
  WebhookCobVSolicitado: validateWebhookCobVSolicitado,
  WebhookCobVCompleto: validateWebhookCobVCompleto,
  InfoBaseAgenciaConta: validateInfoBaseAgenciaConta,
  InfoBaseChave: validateInfoBaseChave,
  WebhookRecSolicitado: validateWebhookRecSolicitado,
  WebhookCobRSolicitado: validateWebhookCobRSolicitado,
  WebhookCobSolicitado: validateWebhookCobSolicitado,
  CobExpiracao: validateCobExpiracao,
  CobDataDeVencimento: validateCobDataDeVencimento,
  CobApresentacao: validateCobApresentacao,
  CobCriacao: validateCobCriacao,
  CobVValor: validateCobVValor,
  CobValor: validateCobValor,
  CobPayloadValor: validateCobPayloadValor,
  CobVPayloadValor: validateCobVPayloadValor,
  RecCompleta: validateRecCompleta,
  RecCompletaPesquisada: validateRecCompletaPesquisada,
  RecGerada: validateRecGerada,
  RecSolicitada: validateRecSolicitada,
  RecPayload: validateRecPayload,
  RecRevisada: validateRecRevisada,
  RecNotification: validateRecNotification,
  RecAtivacao: validateRecAtivacao,
  RecAtivacaoSolicitada: validateRecAtivacaoSolicitada,
  RecStatus: validateRecStatus,
  RecConfiguracao: validateRecConfiguracao,
  RecAtualizacao: validateRecAtualizacao,
  RecEncerramento: validateRecEncerramento,
  RecId: validateRecId,
  RecBase: validateRecBase,
  SolicRecId: validateSolicRecId,
  SolicRecBase: validateSolicRecBase,
  SolicRecStatus: validateSolicRecStatus,
  SolicRecAtualizacao: validateSolicRecAtualizacao,
  SolicRecEncerramento: validateSolicRecEncerramento,
  SolicRecSolicitada: validateSolicRecSolicitada,
  SolicRecRevisada: validateSolicRecRevisada,
  SolicRecCompleta: validateSolicRecCompleta,
  TributoCompleto: validateTributoCompleto,
  TributoCompletoPix: validateTributoCompletoPix,
  TributoPayload: validateTributoPayload,
  TributoInformadoCompleto: validateTributoInformadoCompleto,
  TributoInformadoSolicitado: validateTributoInformadoSolicitado,
  RegistroCategoriaTributoInformadoSolicitado: validateRegistroCategoriaTributoInformadoSolicitado,
  RegistroCategoriaTributoInformadoCompleto: validateRegistroCategoriaTributoInformadoCompleto,
  RegistroCategoriaTributoPayload: validateRegistroCategoriaTributoPayload,
  RegistroCategoriaTributoCompleto: validateRegistroCategoriaTributoCompleto,
  RegistroCategoriaTributoCompletoPix: validateRegistroCategoriaTributoCompletoPix,
  ValorTributoDetalheCompleto: validateValorTributoDetalheCompleto,
  ValorTributoDetalheSolicitado: validateValorTributoDetalheSolicitado,
  ValorLiquidoEstimado: validateValorLiquidoEstimado,
  CobRGerada: validateCobRGerada,
  CobRCompleta: validateCobRCompleta,
  CobRAtualizacao: validateCobRAtualizacao,
  CobRTentativas: validateCobRTentativas,
  CobRRevisada: validateCobRRevisada,
  CobRSolicitada: validateCobRSolicitada,
  CobRNotification: validateCobRNotification,
  CobNotification: validateCobNotification,
  CobVNotification: validateCobVNotification,
  CobRConfiguracao: validateCobRConfiguracao,
  CobRStatus: validateCobRStatus,
  CobRStatusRevisada: validateCobRStatusRevisada,
  CobRBase: validateCobRBase,
  CobBase: validateCobBase,
  CobBaseCopiaCola: validateCobBaseCopiaCola,
  CobSolicitada: validateCobSolicitada,
  CobVSolicitada: validateCobVSolicitada,
  CobRevisada: validateCobRevisada,
  CobVRevisada: validateCobVRevisada,
  CobGerada: validateCobGerada,
  CobVGerada: validateCobVGerada,
  CobStatus: validateCobStatus,
  CobVStatus: validateCobVStatus,
  LoteCobVGerado: validateLoteCobVGerado,
  CobVCompleta: validateCobVCompleta,
  CobCompleta: validateCobCompleta,
  LoteCobVConsultado: validateLoteCobVConsultado,
  LotesCobVConsultados: validateLotesCobVConsultados,
  CobVPayload: validateCobVPayload,
  CobPayload: validateCobPayload,
  PayloadLocation: validatePayloadLocation,
  PayloadLocationSolicitada: validatePayloadLocationSolicitada,
  PayloadLocationRecSolicitada: validatePayloadLocationRecSolicitada,
  PayloadLocationRecGerada: validatePayloadLocationRecGerada,
  PayloadLocationRecCompleta: validatePayloadLocationRecCompleta,
  PayloadLocationCompleta: validatePayloadLocationCompleta,
  PayloadLocationCob: validatePayloadLocationCob,
  ParametrosConsultaRec: validateParametrosConsultaRec,
  ParametrosConsultaCob: validateParametrosConsultaCob,
  ParametrosConsultaCobR: validateParametrosConsultaCobR,
  ParametrosConsultaLote: validateParametrosConsultaLote,
  CobsVConsultadas: validateCobsVConsultadas,
  CobsConsultadas: validateCobsConsultadas,
  CobsRConsultadas: validateCobsRConsultadas,
  RecsConsultadas: validateRecsConsultadas,
  Pix: validatePix,
  PixAutomatico: validatePixAutomatico,
  PixValorOriginal: validatePixValorOriginal,
  PixValorSaque: validatePixValorSaque,
  PixValorTroco: validatePixValorTroco,
  PixValorJuros: validatePixValorJuros,
  PixValorMulta: validatePixValorMulta,
  PixValorDesconto: validatePixValorDesconto,
  PixValorAbatimento: validatePixValorAbatimento,
  Devolucao: validateDevolucao,
  DevolucaoPixAutomatico: validateDevolucaoPixAutomatico,
  DevolucaoSolicitada: validateDevolucaoSolicitada,
  ParametrosConsultaPayloadLocation: validateParametrosConsultaPayloadLocation,
  ParametrosConsultaPayloadLocationRec: validateParametrosConsultaPayloadLocationRec,
  PayloadLocationConsultadas: validatePayloadLocationConsultadas,
  PayloadLocationRecConsultadas: validatePayloadLocationRecConsultadas,
  ParametrosConsultaPix: validateParametrosConsultaPix,
  ParametrosConsultaWebhooks: validateParametrosConsultaWebhooks,
  PixConsultado: validatePixConsultado,
  PixAutomaticoConsultado: validatePixAutomaticoConsultado,
  PixConsultados: validatePixConsultados,
  WebhooksConsultados: validateWebhooksConsultados,
  WebhooksRecConsultados: validateWebhooksRecConsultados,
  Paginacao: validatePaginacao,
  Violacao: validateViolacao,
  Problema: validateProblema,
  Inicio: validateInicio,
  Fim: validateFim,
  LoteCobVBody: validateLoteCobVBody,
  LoteCobVBodyRevisado: validateLoteCobVBodyRevisado,
  WebhookPixBody: validateWebhookPixBody,
  WebhookRecBody: validateWebhookRecBody,
  WebhookCobRBody: validateWebhookCobRBody,
  WebhookCobBody: validateWebhookCobBody,
  WebhookCobVBody: validateWebhookCobVBody,
  GetPixE2eidResponseSchema: validateGetPixE2eidResponseSchema,
  PostCobrTxidRetentativaDataResponseSchema: validatePostCobrTxidRetentativaDataResponseSchema,
};

/** Validators by request-body name — every request body in the spec has an entry. */
export const requestBodyValidators: Readonly<
  Record<string, (value: unknown) => ValidationResult<unknown>>
> = {
  CobBody: validateCobBody,
  CobRBody: validateCobRBody,
  CobVBody: validateCobVBody,
  LoteCobVBody: validateLoteCobVBody,
  LoteCobVBodyRevisado: validateLoteCobVBodyRevisado,
  CobBodyRevisada: validateCobBodyRevisada,
  CobRBodyRevisada: validateCobRBodyRevisada,
  CobVBodyRevisada: validateCobVBodyRevisada,
  PayloadLocationBody: validatePayloadLocationBody,
  PayloadLocationRecBody: validatePayloadLocationRecBody,
  DevolucaoBody: validateDevolucaoBody,
  WebhookConfigBody: validateWebhookConfigBody,
  WebhookRecConfigBody: validateWebhookRecConfigBody,
  WebhookCobRConfigBody: validateWebhookCobRConfigBody,
  WebhookCobConfigBody: validateWebhookCobConfigBody,
  WebhookCobVConfigBody: validateWebhookCobVConfigBody,
  SolicRecBody: validateSolicRecBody,
  SolicRecBodyRevisada: validateSolicRecBodyRevisada,
  RecBody: validateRecBody,
  RecBodyRevisada: validateRecBodyRevisada,
  WebhookPixBody: validateWebhookPixBody,
  WebhookRecBody: validateWebhookRecBody,
  WebhookCobRBody: validateWebhookCobRBody,
  WebhookCobBody: validateWebhookCobBody,
  WebhookCobVBody: validateWebhookCobVBody,
};
