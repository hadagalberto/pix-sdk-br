/**
 * Hand-curated mock response fixtures, keyed by the OpenAPI response schema name.
 *
 * Values are realistic Pix documents adapted from the pinned BCB spec examples
 * (see src/generated/examples.ts). They are STATIC LITERALS: no runtime repair
 * against the schemas they are later validated against. test/fixtures.test.ts
 * validates every fixture with ajv, so an invalid fixture fails the suite.
 */

import { OPENAPI_CONTRACTS } from "../../src/generated/contracts.js";
import type { OperationInfo } from "../../src/generated/operations.js";

export type FixtureDocument = Record<string, unknown>;

export const RESPONSE_FIXTURES: Readonly<Record<string, FixtureDocument>> = {
  CobCompleta: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 0,
    loc: {
      id: 789,
      location: "https://pix.example.com/payload/token",
      tipoCob: "cob",
      criacao: "2026-01-01T00:00:00Z",
    },
    location: "https://pix.example.com/payload/token",
    status: "ATIVA",
    devedor: {
      cnpj: "12345678000195",
      nome: "Empresa de Serviços SA",
    },
    valor: {
      original: "37.00",
      modalidadeAlteracao: 1,
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "mxncvbagudt38bw33b4ssdd",
      },
      cbs: {
        informado: {
          valor: "1.20",
          data: "2020-09-09T20:15:00.358Z",
        },
      },
      ibs: {
        informado: {
          valor: "2.80",
          data: "2020-09-09T20:15:00.358Z",
        },
      },
    },
    valorLiquidoEstimado: "33.00",
    chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
    solicitacaoPagador: "Serviço realizado.",
    infoAdicionais: [
      {
        nome: "Campo 1",
        valor: "Informação Adicional1 do PSP-Recebedor",
      },
      {
        nome: "Campo 2",
        valor: "Informação Adicional2 do PSP-Recebedor",
      },
    ],
  },
  CobGerada: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 0,
    loc: {
      id: 789,
      location: "https://pix.example.com/payload/token",
      tipoCob: "cob",
      criacao: "2026-01-01T00:00:00Z",
    },
    location: "https://pix.example.com/payload/token",
    status: "ATIVA",
    devedor: {
      cnpj: "12345678000195",
      nome: "Empresa de Serviços SA",
    },
    valor: {
      original: "37.00",
      modalidadeAlteracao: 1,
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "mxncvbagudt38bw33b4ssdd",
      },
      cbs: {
        informado: {
          valor: "1.20",
          data: "2020-09-09T20:15:00.358Z",
        },
      },
      ibs: {
        informado: {
          valor: "2.80",
          data: "2020-09-09T20:15:00.358Z",
        },
      },
    },
    valorLiquidoEstimado: "33.00",
    chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
    solicitacaoPagador: "Serviço realizado.",
    infoAdicionais: [
      {
        nome: "Campo 1",
        valor: "Informação Adicional1 do PSP-Recebedor",
      },
      {
        nome: "Campo 2",
        valor: "Informação Adicional2 do PSP-Recebedor",
      },
    ],
  },
  CobsConsultadas: {
    parametros: {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-02T10:00:00Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 2,
      },
    },
    cobs: [
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 0,
        loc: {
          id: 789,
          location: "https://pix.example.com/payload/token",
          tipoCob: "cob",
          criacao: "2026-01-01T00:00:00Z",
        },
        location: "https://pix.example.com/payload/token",
        status: "ATIVA",
        devedor: {
          cnpj: "12345678000195",
          nome: "Empresa de Serviços SA",
        },
        valor: {
          original: "37.00",
          modalidadeAlteracao: 1,
        },
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "mxncvbagudt38bw33b4ssdd",
          },
          cbs: {
            informado: {
              valor: "1.20",
              data: "2020-09-09T20:15:00.358Z",
            },
          },
          ibs: {
            informado: {
              valor: "2.80",
              data: "2020-09-09T20:15:00.358Z",
            },
          },
        },
        valorLiquidoEstimado: "33.00",
        chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
        solicitacaoPagador: "Serviço realizado.",
        infoAdicionais: [
          {
            nome: "Campo 1",
            valor: "Informação Adicional1 do PSP-Recebedor",
          },
          {
            nome: "Campo 2",
            valor: "Informação Adicional2 do PSP-Recebedor",
          },
        ],
      },
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "655dfdb1a4514b8fbb58254b958913fb",
        revisao: 1,
        loc: {
          id: 567,
          location: "https://pix.example.com/payload/token",
          tipoCob: "cob",
          criacao: "2026-01-01T00:00:00Z",
        },
        location: "https://pix.example.com/payload/token",
        status: "CONCLUIDA",
        devedor: {
          cnpj: "12345678000195",
          nome: "Empresa de Serviços SA",
        },
        valor: {
          original: "100.00",
          modalidadeAlteracao: 0,
        },
        chave: "40a0932d-1918-4eee-845d-35a2da1690dc",
        solicitacaoPagador: "Informar cartão fidelidade",
        pix: [
          {
            endToEndId: "E1234567820200909122120200808008",
            txid: "655dfdb1a4514b8fbb58254b958913fb",
            valor: "110.00",
            horario: "2020-09-09T20:15:00.358Z",
            infoPagador: "0123456789",
            devolucoes: [
              {
                id: "123ABC",
                rtrId: "D1234567820200909122120200808006",
                valor: "10.00",
                horario: {
                  solicitacao: "2020-09-09T20:15:00.358Z",
                },
                status: "EM_PROCESSAMENTO",
              },
            ],
          },
        ],
      },
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "33beb661beda44a8928fef47dbeb2dc5",
        revisao: 0,
        loc: {
          id: 1004,
          location: "https://pix.example.com/payload/token",
          tipoCob: "cob",
          criacao: "2026-01-01T00:00:00Z",
        },
        location: "https://pix.example.com/payload/token",
        status: "ATIVA",
        devedor: {
          cnpj: "12345678000195",
          nome: "Empresa de Serviços SA",
        },
        valor: {
          original: "0.00",
          modalidadeAlteracao: 0,
          retirada: {
            saque: {
              valor: "5.00",
              modalidadeAlteracao: 0,
              modalidadeAgente: "AGFSS",
              prestadorDoServicoDeSaque: "12345678",
            },
          },
        },
        chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
      },
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "33beb661beda44a8928fef47dbeb2dc5",
        revisao: 0,
        loc: {
          id: 1004,
          location: "https://pix.example.com/payload/token",
          tipoCob: "cob",
          criacao: "2026-01-01T00:00:00Z",
        },
        location: "https://pix.example.com/payload/token",
        status: "ATIVA",
        devedor: {
          cnpj: "12345678000195",
          nome: "Empresa de Serviços SA",
        },
        valor: {
          original: "0.00",
          modalidadeAlteracao: 0,
          retirada: {
            saque: {
              valor: "20.00",
              modalidadeAlteracao: 1,
              modalidadeAgente: "AGFSS",
              prestadorDoServicoDeSaque: "12345678",
            },
          },
        },
        chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
      },
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "33beb661beda44a8928fef47dbeb2dc5",
        revisao: 0,
        loc: {
          id: 1004,
          location: "https://pix.example.com/payload/token",
          tipoCob: "cob",
          criacao: "2026-01-01T00:00:00Z",
        },
        location: "https://pix.example.com/payload/token",
        status: "ATIVA",
        devedor: {
          cnpj: "12345678000195",
          nome: "Empresa de Serviços SA",
        },
        valor: {
          original: "10.00",
          modalidadeAlteracao: 0,
          retirada: {
            troco: {
              valor: "0.00",
              modalidadeAlteracao: 1,
              modalidadeAgente: "AGTEC",
              prestadorDoServicoDeSaque: "12345678",
            },
          },
        },
        chave: "7d9f0335-8dcc-4054-9bf9-0dbd61d36906",
      },
    ],
  },
  CobVCompleta: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      dataDeVencimento: "2020-12-31",
      validadeAposVencimento: 30,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 0,
    loc: {
      id: 789,
      location: "https://pix.example.com/payload/token",
      tipoCob: "cobv",
      criacao: "2026-01-01T00:00:00Z",
    },
    status: "ATIVA",
    devedor: {
      logradouro: "Alameda Souza, Numero 80, Bairro Braz",
      cidade: "Recife",
      uf: "PE",
      cep: "70011750",
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    recebedor: {
      logradouro: "Rua 15 Numero 1200, Bairro São Luiz",
      cidade: "São Paulo",
      uf: "SP",
      cep: "70800100",
      nome: "Empresa de Logística SA",
      cpf: "12345678909",
    },
    valor: {
      original: "123.45",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "kkjkasjfkafjkjjjuuuuyyyyee345fsfg",
      },
      cbs: {
        informado: {
          valor: "4.32",
          data: "2020-12-31T09:15:00.000Z",
        },
      },
      ibs: {
        informado: {
          valor: "8.13",
          data: "2020-12-31T09:15:00.000Z",
        },
      },
    },
    valorLiquidoEstimado: "111.00",
    chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  CobVGerada: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      dataDeVencimento: "2020-12-31",
      validadeAposVencimento: 30,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 0,
    loc: {
      id: 789,
      location: "https://pix.example.com/payload/token",
      tipoCob: "cobv",
      criacao: "2026-01-01T00:00:00Z",
    },
    status: "ATIVA",
    devedor: {
      logradouro: "Alameda Souza, Numero 80, Bairro Braz",
      cidade: "Recife",
      uf: "PE",
      cep: "70011750",
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    recebedor: {
      logradouro: "Rua 15 Numero 1200, Bairro São Luiz",
      cidade: "São Paulo",
      uf: "SP",
      cep: "70800100",
      nome: "Empresa de Logística SA",
      cpf: "12345678909",
    },
    valor: {
      original: "123.45",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "kkjkasjfkafjkjjjuuuuyyyyee345fsfg",
      },
      cbs: {
        informado: {
          valor: "4.32",
          data: "2020-12-31T09:15:00.000Z",
        },
      },
      ibs: {
        informado: {
          valor: "8.13",
          data: "2020-12-31T09:15:00.000Z",
        },
      },
    },
    valorLiquidoEstimado: "111.00",
    chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  CobsVConsultadas: {
    parametros: {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 1,
      },
    },
    cobs: [
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          dataDeVencimento: "2020-12-31",
          validadeAposVencimento: 30,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 0,
        loc: {
          id: 789,
          location: "https://pix.example.com/payload/token",
          tipoCob: "cobv",
          criacao: "2026-01-01T00:00:00Z",
        },
        status: "ATIVA",
        devedor: {
          logradouro: "Alameda Souza, Numero 80, Bairro Braz",
          cidade: "Recife",
          uf: "PE",
          cep: "70011750",
          cpf: "12345678909",
          nome: "Francisco da Silva",
        },
        recebedor: {
          logradouro: "Rua 15 Numero 1200, Bairro São Luiz",
          cidade: "São Paulo",
          uf: "SP",
          cep: "70800100",
          nome: "Empresa de Logística SA",
          cpf: "12345678909",
        },
        valor: {
          original: "123.45",
        },
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "kkjkasjfkafjkjjjuuuuyyyyee345fsfg",
          },
          cbs: {
            informado: {
              valor: "4.32",
              data: "2020-12-31T09:15:00.000Z",
            },
          },
          ibs: {
            informado: {
              valor: "8.13",
              data: "2020-12-31T09:15:00.000Z",
            },
          },
        },
        valorLiquidoEstimado: "111.00",
        chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
        solicitacaoPagador: "Cobrança dos serviços prestados.",
      },
    ],
  },
  LoteCobVConsultado: {
    descricao: "Cobranças dos alunos do turno vespertino",
    criacao: "2020-11-01T20:15:00.358Z",
    cobsv: [
      {
        criacao: "2020-11-01T20:15:00.358Z",
        txid: "fb2761260e554ad593c7226beb5cb650",
        status: "CRIADA",
      },
      {
        txid: "7978c0c97ea847e78e8849634473c1f1",
        status: "NEGADA",
        problema: {
          type: "https://pix.bcb.gov.br/api/v2/error/CobVOperacaoInvalida",
          title: "Cobrança inválida.",
          status: 400,
          detail:
            "A requisição que busca alterar ou criar uma cobrança com vencimento não respeita o _schema_ ou está semanticamente errada.",
          violacoes: [
            {
              razao: "O objeto cobv.devedor não respeita o _schema_.",
              propriedade: "cobv.devedor",
            },
          ],
        },
      },
    ],
    id: 1,
  },
  LotesCobVConsultados: {
    parametros: {
      inicio: "2020-01-01T00:00:00Z",
      fim: "2020-12-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 2,
      },
    },
    lotes: [
      {
        descricao: "Cobranças dos alunos do turno vespertino",
        criacao: "2020-11-01T20:15:00.358Z",
        cobsv: [
          {
            criacao: "2020-11-01T20:15:00.358Z",
            txid: "fb2761260e554ad593c7226beb5cb650",
            status: "CRIADA",
          },
          {
            txid: "7978c0c97ea847e78e8849634473c1f1",
            status: "NEGADA",
            problema: {
              type: "https://pix.bcb.gov.br/api/v2/error/CobVOperacaoInvalida",
              title: "Cobrança inválida.",
              status: 400,
              detail:
                "A requisição que busca alterar ou criar uma cobrança com vencimento não respeita o _schema_ ou está semanticamente errada.",
              violacoes: [
                {
                  razao: "O objeto cobv.devedor não respeita o _schema_.",
                  propriedade: "cobv.devedor",
                },
              ],
            },
          },
        ],
        id: 1,
      },
      {
        descricao: "Cobranças dos assinantes anuais",
        criacao: "2020-11-17T20:00:00.358Z",
        cobsv: [
          {
            criacao: "2020-11-17T20:00:00.358Z",
            txid: "06601eaa3822423fbe897f613b983e01",
            status: "CRIADA",
          },
          {
            criacao: "2020-11-17T20:00:00.358Z",
            txid: "4e07059760d54cf493de6e7f1fbfad9a",
            status: "CRIADA",
          },
        ],
        id: 1,
      },
    ],
  },
  PayloadLocationRecConsultadas: {
    parametros: {
      inicio: "2023-12-01T00:00:00Z",
      fim: "2024-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 1,
      },
    },
    loc: [
      {
        id: 12069,
        location: "https://pix.example.com/payload/token",
        criacao: "2023-12-20T12:38:28.774Z",
        idRec: "RR123456782024011510056892226",
      },
    ],
  },
  PayloadLocationRecGerada: {
    id: 12069,
    location: "https://pix.example.com/payload/token",
    criacao: "2023-12-20T12:38:28.774Z",
  },
  PayloadLocationRecCompleta: {
    id: 12069,
    location: "https://pix.example.com/payload/token",
    criacao: "2023-12-20T12:38:28.774Z",
    idRec: "RR123456782024011510056892226",
  },
  PayloadLocationConsultadas: {
    parametros: {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 3,
      },
    },
    loc: [
      {
        id: 7716,
        txid: "fda9460fe04e4f129b72863ae57ee22f",
        location: "https://pix.example.com/payload/token",
        tipoCob: "cobv",
        criacao: "2020-03-11T21:19:51.013Z",
      },
      {
        id: 856,
        txid: "31e08604f9ce459bb59672332af8d672",
        location: "https://pix.example.com/payload/token",
        tipoCob: "cobv",
        criacao: "2020-02-10T19:22:52.013Z",
      },
      {
        id: 2316,
        txid: "eb9d87f36fca4c92b7d5ec48e2ee3853",
        location: "https://pix.example.com/payload/token",
        tipoCob: "cob",
        criacao: "2020-05-31T19:39:54.013Z",
      },
    ],
  },
  PayloadLocation: {
    id: 7716,
    location: "https://pix.example.com/payload/token",
    tipoCob: "cob",
    criacao: "2020-03-11T21:19:51.013Z",
  },
  PayloadLocationCompleta: {
    id: 7716,
    txid: "fda9460fe04e4f129b72863ae57ee22f",
    location: "https://pix.example.com/payload/token",
    tipoCob: "cobv",
    criacao: "2020-03-11T21:19:51.013Z",
  },
  GetPixE2eidResponseSchema: {
    endToEndId: "E12345678202009091221abcdef12345",
    txid: "cd1fe328c875481285a6f233ae41b662",
    valor: "100.00",
    horario: "2020-09-10T13:03:33.902Z",
    infoPagador: "Reforma da casa",
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "laos93846878sdjadhjda6768adkj14814",
      },
      cbs: {
        segregado: {
          valor: "3.50",
          data: "2020-09-10T21:01:22.202Z",
        },
        informado: {
          valor: "3.50",
          data: "2020-09-10T13:03:33.902Z",
        },
      },
      ibs: {
        segregado: {
          valor: "6.60",
          data: "2020-09-10T21:01:22.202Z",
        },
        informado: {
          valor: "6.60",
          data: "2020-09-10T13:03:33.902Z",
        },
      },
    },
    valorLiquido: "89.90",
    devolucoes: [
      {
        id: "000AAA111",
        rtrId: "D12345678202009091000abcde123456",
        valor: "11.00",
        horario: {
          solicitacao: "2020-09-10T13:03:33.902Z",
        },
        status: "EM_PROCESSAMENTO",
      },
    ],
  },
  PixConsultados: {
    parametros: {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 2,
      },
    },
    pix: [
      {
        endToEndId: "E12345678202009091221abcdef12345",
        txid: "cd1fe328c875481285a6f233ae41b662",
        valor: "100.00",
        horario: "2020-09-10T13:03:33.902Z",
        infoPagador: "Reforma da casa",
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "laos93846878sdjadhjda6768adkj14814",
          },
          cbs: {
            segregado: {
              valor: "3.50",
              data: "2020-09-10T21:01:22.202Z",
            },
            informado: {
              valor: "3.50",
              data: "2020-09-10T13:03:33.902Z",
            },
          },
          ibs: {
            segregado: {
              valor: "6.60",
              data: "2020-09-10T21:01:22.202Z",
            },
            informado: {
              valor: "6.60",
              data: "2020-09-10T13:03:33.902Z",
            },
          },
        },
        valorLiquido: "89.90",
        devolucoes: [
          {
            id: "000AAA111",
            rtrId: "D12345678202009091000abcde123456",
            valor: "11.00",
            horario: {
              solicitacao: "2020-09-10T13:03:33.902Z",
            },
            status: "EM_PROCESSAMENTO",
          },
        ],
      },
      {
        endToEndId: "E12345678202009091221ghijk789012",
        txid: "5b933948f3224266b1050ac54319e775",
        valor: "200.00",
        horario: "2020-09-10T13:03:33.902Z",
        infoPagador: "Revisão do carro",
      },
      {
        endToEndId: "E88631478202009091221ghijk789012",
        txid: "82433415910c47e5adb6ac3527cca160",
        valor: "200.00",
        componentesValor: {
          original: {
            valor: "180.00",
          },
          saque: {
            valor: "20.00",
            modalidadeAgente: "AGFSS",
            prestadorDeServicoDeSaque: "12345678",
          },
        },
        horario: "2020-09-10T13:03:33.902Z",
        infoPagador: "Saque Pix",
      },
    ],
  },
  Devolucao: {
    id: "123456",
    rtrId: "D12345678202009091000abcde123456",
    valor: "7.89",
    horario: {
      solicitacao: "2020-09-11T15:25:59.411Z",
    },
    status: "EM_PROCESSAMENTO",
  },
  CobPayload: {
    calendario: {
      criacao: "2020-09-15T19:39:54.013Z",
      apresentacao: "2020-04-01T18:00:00Z",
      expiracao: 3600,
    },
    txid: "fc9a4366ff3d4964b5dbc6c91a8722d3",
    revisao: 3,
    status: "ATIVA",
    valor: {
      original: "500.00",
      modalidadeAlteracao: 0,
    },
    chave: "7407c9c8-f78b-11ea-adc1-0242ac120002",
    solicitacaoPagador: "Informar cartao fidelidade",
    infoAdicionais: [
      {
        nome: "quantidade",
        valor: "2",
      },
    ],
  },
  CobVPayload: {
    calendario: {
      criacao: "2020-09-15T19:39:54.013Z",
      apresentacao: "2020-04-01T18:00:00Z",
      dataDeVencimento: "2020-12-31",
      validadeAposVencimento: 30,
    },
    devedor: {
      cnpj: "56989000019533",
      nome: "Empresa de Alimentos SA",
    },
    recebedor: {
      logradouro: "Rua 20 Numero 70, Bairro Luz",
      cidade: "Belo Horizonte",
      uf: "MG",
      cep: "55120750",
      nome: "Empresa de Abastecimento SA",
      cpf: "12345678909",
    },
    txid: "fc9a4366ff3d4964b5dbc6c91a8722d3",
    revisao: 3,
    status: "ATIVA",
    valor: {
      original: "123.45",
      multa: "15.00",
      juros: "2.00",
      final: "140.45",
    },
    chave: "7407c9c8-f78b-11ea-adc1-0242ac120002",
    solicitacaoPagador: "Informar cartao fidelidade",
    infoAdicionais: [
      {
        nome: "quantidade",
        valor: "2",
      },
    ],
  },
  RecPayload: {
    idRec: "RN123456782024011577825445612",
    vinculo: {
      contrato: "5582610",
      devedor: {
        cpf: "45164632481",
        nome: "Fulano de Tal",
      },
      objeto: "Serviço de Streamming de Música.",
    },
    calendario: {
      dataFinal: "2025-04-01",
      dataInicial: "2024-04-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "NAO_PERMITE",
    valor: {
      valorRec: "35.00",
    },
    recebedor: {
      cnpj: "28765007802371",
      nome: "Startup Musical",
      ispbParticipante: "12345678",
    },
    atualizacao: [
      {
        status: "CRIADA",
        data: "2024-03-20T10:12:07.567Z",
      },
    ],
  },
  WebhookCompleto: {
    webhookUrl: "https://pix.example.com/api/webhook/",
    chave: "40a0932d-1918-4eee-845d-35a2da1690dc",
    criacao: "2020-11-11T10:15:00.358Z",
    cnpj: "12345678901234",
  },
  WebhooksConsultados: {
    parametros: {
      inicio: "2020-04-01T00:00:00Z",
      fim: "2020-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 1,
      },
    },
    webhooks: [
      {
        webhookUrl: "https://usuario.recebedor.com/api/webhookrec/",
        criacao: "2023-12-20T12:51:16.485Z",
        cnpj: "12345678901234",
      },
    ],
  },
  WebhookRecCompleto: {
    webhookUrl: "https://usuario.recebedor.com/api/webhookrec/",
    criacao: "2023-12-20T12:51:16.485Z",
  },
  WebhookCobRCompleto: {
    webhookUrl: "https://usuario.recebedor.com/api/webhookcobr/",
    criacao: "2023-12-20T12:51:16.485Z",
  },
  WebhookCobCompleto: {
    webhookUrl: "https://pix.example.com/payload/token",
  },
  WebhookCobVCompleto: {
    webhookUrl: "https://pix.example.com/payload/token",
  },
  RecCompleta: {
    idRec: "RN1234567820240115abcdefghijk",
    status: "APROVADA",
    valor: {
      valorRec: "300.00",
    },
    vinculo: {
      contrato: "98625023",
      devedor: {
        cpf: "87734514122",
        nome: "Fulano de Tal",
      },
      objeto: "Serviços de Gestão de Imóveis",
    },
    calendario: {
      dataFinal: "2028-09-01",
      dataInicial: "2024-02-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "NAO_PERMITE",
    loc: {
      criacao: "2023-12-19T12:28:05.230Z",
      id: 5100,
      location: "https://pix.example.com/payload/token",
      idRec: "RN1234567820240115abcdefghijk",
    },
    pagador: {
      codMun: "2673833",
      cpf: "75633122216",
      ispbParticipante: "81102623",
    },
    recebedor: {
      cnpj: "92221288310574",
      nome: "Imobiliária Bom Sucesso",
    },
    atualizacao: [
      {
        data: "2024-01-03T08:30:02.050Z",
        nome: "CRIADA",
        status: "CRIADA",
      },
      {
        data: "2024-01-04T09:40:42.210Z",
        nome: "APROVADA",
        status: "CRIADA",
      },
    ],
    dadosQR: {
      jornada: "JORNADA_2",
      pixCopiaECola:
        "00020126180014br.gov.bcb.pix5204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002630462C9",
    },
  },
  RecGerada: {
    idRec: "RN1234567820240115abcdefghijk",
    vinculo: {
      contrato: "63100862",
      devedor: {
        cpf: "45164632481",
        nome: "Fulano de Tal",
      },
      objeto: "Serviço de Streamming de Música.",
    },
    calendario: {
      dataFinal: "2025-04-01",
      dataInicial: "2024-04-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "NAO_PERMITE",
    recebedor: {
      cnpj: "01602606113708",
      nome: "Empresa de Serviços SA",
    },
    valor: {
      valorRec: "35.00",
    },
    status: "CRIADA",
    loc: {
      criacao: "2023-12-10T07:10:05.115Z",
      id: 108,
      location: "https://pix.example.com/payload/token",
      idRec: "RN1234567820240115abcdefghijk",
    },
    ativacao: {
      dadosJornada: {
        tipoJornada: "JORNADA_3",
        txid: "33beb661beda44a8928fef47dbeb2dc5",
      },
      tipoJornada: "JORNADA_1",
    },
    atualizacao: [
      {
        data: "2023-12-19T12:28:05.230Z",
        nome: "CRIADA",
        status: "CRIADA",
      },
    ],
  },
  RecsConsultadas: {
    parametros: {
      inicio: "2024-04-01T00:00:00Z",
      fim: "2024-04-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 1,
      },
    },
    recs: [
      {
        idRec: "RN1234567820240115abcdefghijk",
        status: "APROVADA",
        valor: {
          valorRec: "300.00",
        },
        vinculo: {
          contrato: "98625023",
          devedor: {
            cpf: "87734514122",
            nome: "Fulano de Tal",
          },
          objeto: "Serviços de Gestão de Imóveis",
        },
        calendario: {
          dataFinal: "2028-09-01",
          dataInicial: "2024-02-01",
          periodicidade: "MENSAL",
        },
        politicaRetentativa: "NAO_PERMITE",
        loc: {
          criacao: "2023-12-19T12:28:05.230Z",
          id: 5100,
          location: "https://pix.example.com/payload/token",
          idRec: "RN1234567820240115abcdefghijk",
        },
        pagador: {
          codMun: "2673833",
          cpf: "75633122216",
          ispbParticipante: "81102623",
        },
        recebedor: {
          cnpj: "92221288310574",
          nome: "Imobiliária Bom Sucesso",
        },
        atualizacao: [
          {
            data: "2024-01-03T08:30:02.050Z",
            nome: "CRIADA",
            status: "CRIADA",
          },
          {
            data: "2024-01-04T09:40:42.210Z",
            nome: "APROVADA",
            status: "CRIADA",
          },
        ],
      },
    ],
  },
  SolicRecCompleta: {
    idSolicRec: "SC876456782024021577825445312",
    idRec: "RN123456782024011577825445612",
    calendario: {
      dataExpiracaoSolicitacao: "2023-12-20T12:17:11.926Z",
    },
    status: "CRIADA",
    destinatario: {
      agencia: "2569",
      conta: "550689",
      cpf: "15231470190",
      ispbParticipante: "91193552",
    },
    atualizacao: [
      {
        data: "2023-12-20T12:18:18.618Z",
        status: "CRIADA",
      },
    ],
    recPayload: {
      idRec: "RN123456782024011577825445612",
      vinculo: {
        contrato: "561238008",
        devedor: {
          cpf: "15231470190",
          nome: "Fulano de Tal",
        },
        objeto: "Serviços de Telecomunicações",
      },
      calendario: {
        dataFinal: "2023-12-01",
        dataInicial: "2024-04-01",
        periodicidade: "MENSAL",
      },
      recebedor: {
        cnpj: "94370926517368",
        nome: "Empresa de Serviços SA",
        ispbParticipante: "01234567",
      },
      valor: {
        valorRec: "1200.09",
      },
      atualizacao: [
        {
          data: "2023-12-15T08:30:07.115Z",
          status: "CRIADA",
        },
      ],
      politicaRetentativa: "NAO_PERMITE",
    },
  },
  CobRCompleta: {
    idRec: "RR1234567820240115abcdefghijk",
    txid: "3136957d93134f2184b369e8f1c0729d",
    infoAdicional: "Serviços de Streamming de Música e Filmes.",
    calendario: {
      criacao: "2024-04-01",
      dataDeVencimento: "2024-04-15",
    },
    valor: {
      original: "106.07",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "asmfaskfajkfaskfjaskfjk2124124124dwwg8",
      },
      cbs: {
        informado: {
          valor: "3.71",
          data: "2024-04-01T14:47:29.470Z",
        },
      },
      ibs: {
        informado: {
          valor: "7.42",
          data: "2024-04-01T14:47:29.470Z",
        },
      },
    },
    valorLiquidoEstimado: "94.94",
    status: "CRIADA",
    politicaRetentativa: "PERMITE_3R_7D",
    ajusteDiaUtil: true,
    devedor: {
      cep: "89256140",
      cidade: "Uberlândia",
      email: "sebastiao.tavares@mail.com",
      logradouro: "Alameda Franco 1056",
      uf: "MG",
    },
    recebedor: {
      agencia: "9708",
      conta: "012682",
      tipoConta: "CORRENTE",
    },
    atualizacao: [
      {
        data: "2024-04-01T14:47:29.470Z",
        status: "CRIADA",
      },
    ],
  },
  CobRGerada: {
    idRec: "RR1234567820240115abcdefghijk",
    txid: "3136957d93134f2184b369e8f1c0729d",
    infoAdicional: "Serviços de Streamming de Música e Filmes.",
    calendario: {
      criacao: "2024-04-01",
      dataDeVencimento: "2024-04-15",
    },
    valor: {
      original: "106.07",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "asmfaskfajkfaskfjaskfjk2124124124dwwg8",
      },
      cbs: {
        informado: {
          valor: "3.71",
          data: "2024-04-01T14:47:29.470Z",
        },
      },
      ibs: {
        informado: {
          valor: "7.42",
          data: "2024-04-01T14:47:29.470Z",
        },
      },
    },
    valorLiquidoEstimado: "94.94",
    status: "CRIADA",
    politicaRetentativa: "PERMITE_3R_7D",
    ajusteDiaUtil: true,
    devedor: {
      cep: "89256140",
      cidade: "Uberlândia",
      email: "sebastiao.tavares@mail.com",
      logradouro: "Alameda Franco 1056",
      uf: "MG",
    },
    recebedor: {
      agencia: "9708",
      conta: "012682",
      tipoConta: "CORRENTE",
      cnpj: "12345678901234",
      nome: "aaaaaaaa",
    },
    atualizacao: [
      {
        data: "2024-04-01T14:47:29.470Z",
        status: "CRIADA",
      },
    ],
  },
  CobsRConsultadas: {
    parametros: {
      inicio: "2024-04-01T00:00:00Z",
      fim: "2024-12-01T23:59:59Z",
      paginacao: {
        paginaAtual: 0,
        itensPorPagina: 100,
        quantidadeDePaginas: 1,
        quantidadeTotalDeItens: 1,
      },
    },
    cobsr: [
      {
        idRec: "RR123456782024061999000566354",
        txid: "7f733863543b4a16b516d839bd4bc34e",
        calendario: {
          criacao: "2024-05-20",
          dataDeVencimento: "2024-06-20",
        },
        valor: {
          original: "50.33",
        },
        status: "ATIVA",
        ajusteDiaUtil: false,
        politicaRetentativa: "PERMITE_3R_7D",
        devedor: {
          cep: "63259740",
          cidade: "Campinas",
          email: "beltrano.silva@mail.com",
          logradouro: "Rua Gonçalves Dias 605",
          uf: "SP",
        },
        recebedor: {
          conta: "997182",
          tipoConta: "CORRENTE",
        },
        tentativas: [
          {
            dataLiquidacao: "2024-06-20",
            tipo: "AGND",
            status: "AGENDADA",
            endToEndId: "E12345678202406201221abcdef12345",
            atualizacao: [
              {
                data: "2024-05-21T10:40:16.730Z",
                status: "SOLICITADA",
              },
              {
                data: "2024-05-21T17:08:00.520Z",
                status: "AGENDADA",
              },
            ],
          },
        ],
        atualizacao: [
          {
            data: "2024-05-20T14:47:29.470Z",
            status: "CRIADA",
          },
          {
            data: "2024-05-21T10:18:20.120Z",
            status: "ATIVA",
          },
        ],
      },
    ],
  },
  PostCobrTxidRetentativaDataResponseSchema: {
    idRec: "RR123456782024061999000566354",
    txid: "7f733863543b4a16b516d839bd4bc34e",
    calendario: {
      criacao: "2024-05-20",
      dataDeVencimento: "2024-06-20",
    },
    valor: {
      original: "50.33",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "kjsyriedcncfgfkdks7shs62j39sd83",
      },
      cbs: {
        informado: {
          valor: "1.76",
          data: "2024-05-20T14:47:29.470Z",
        },
        corrigido: {
          valor: "1.80",
          data: "2024-06-20T09:00:00.000Z",
        },
      },
      ibs: {
        informado: {
          valor: "3.52",
          data: "2024-05-20T14:47:29.470Z",
        },
        corrigido: {
          valor: "3.60",
          data: "2024-06-20T09:00:00.000Z",
        },
      },
    },
    valorLiquidoEstimado: "44.93",
    status: "ATIVA",
    politicaRetentativa: "PERMITE_3R_7D",
    ajusteDiaUtil: true,
    devedor: {
      cep: "63259740",
      cidade: "Campinas",
      email: "beltrano.silva@mail.com",
      logradouro: "Rua Gonçalves Dias 605",
      uf: "SP",
    },
    recebedor: {
      cnpj: "58966551101210",
      conta: "997182",
      tipoConta: "CORRENTE",
    },
    tentativas: [
      {
        dataLiquidacao: "2024-06-22",
        tipo: "AGND",
        endToEndId: "E12345678202406201221abcdef12345",
        status: "EXPIRADA",
        atualizacao: [],
      },
      {
        dataLiquidacao: "2024-06-24",
        tipo: "NTAG",
        endToEndId: "E12345678202406201221abcdef12345",
        status: "AGENDADA",
        atualizacao: [],
      },
    ],
    atualizacao: [
      {
        data: "2024-05-20T14:47:29.470Z",
        status: "CRIADA",
      },
      {
        data: "2024-05-21T10:18:20.120Z",
        status: "ATIVA",
      },
    ],
  },
};

const REF_PREFIX = `${OPENAPI_CONTRACTS.schemaId}#/definitions/`;

/** Response schema backing an operation/status, from the committed contracts. */
export function responseSchemaName(operation: string, status: number): string | undefined {
  const ref = OPENAPI_CONTRACTS.operations[operation]?.responses[String(status)]?.["$ref"];
  return typeof ref === "string" && ref.startsWith(REF_PREFIX)
    ? ref.slice(REF_PREFIX.length)
    : undefined;
}

/** All documented error documents, valid against the `Problema` schema. */
export const ERROR_FIXTURES: Readonly<Record<string, FixtureDocument>> = {
  "400": {
    type: "https://pix.example.com/problems/ParametrosInvalidos",
    title: "Parâmetros inválidos",
    status: 400,
    detail: "Requisição com formato inválido.",
    violacoes: [{ razao: "campo obrigatório ausente", propriedade: "valor.original", valor: "" }],
  },
  "403": {
    type: "https://pix.example.com/problems/AcessoNegado",
    title: "Acesso negado",
    status: 403,
    detail: "O cliente não possui escopo para esta operação.",
  },
  "404": {
    type: "https://pix.example.com/problems/NaoEncontrado",
    title: "Não encontrado",
    status: 404,
    detail: "Recurso não encontrado.",
  },
  "503": {
    type: "https://pix.example.com/problems/ServicoIndisponivel",
    title: "Serviço indisponível",
    status: 503,
    detail: "PSP temporariamente indisponível.",
  },
};

/** Fixture for a response status: a typed success document or a problem document. */
export function fixtureForStatus(
  operation: OperationInfo,
  status: number,
): FixtureDocument | undefined {
  if (status >= 200 && status < 300) {
    const schema = operation.responses.find((entry) => entry.code === status)?.schema;
    return schema === undefined ? undefined : RESPONSE_FIXTURES[schema];
  }
  return ERROR_FIXTURES[String(status)];
}
