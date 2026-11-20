/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * The spec's official example payloads as plain data — known-good (and, where upstream is self-contradictory, known-bad) vectors for validators and user-side tests.
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

/** Every `components.examples` value, composition markers resolved. */
export const specExamples: Readonly<Record<string, unknown>> = {
  cobBody1: {
    calendario: {
      dataDeVencimento: "2020-12-31",
      validadeAposVencimento: 30,
    },
    loc: {
      id: 789,
    },
    devedor: {
      logradouro: "Alameda Souza, Numero 80, Bairro Braz",
      cidade: "Recife",
      uf: "PE",
      cep: "70011750",
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    valor: {
      original: "123.45",
      multa: {
        modalidade: "2",
        valorPerc: "15.00",
      },
      juros: {
        modalidade: "2",
        valorPerc: "2.00",
      },
      desconto: {
        modalidade: "1",
        descontoDataFixa: [
          {
            data: "2020-11-30",
            valorPerc: "30.00",
          },
        ],
      },
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "sghhqerhrqew346346erg3346",
      },
      cbs: {
        informado: {
          valor: "4.32",
        },
      },
      ibs: {
        informado: {
          valor: "8.13",
        },
      },
    },
    chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  cobBody2: {
    calendario: {
      expiracao: 3600,
    },
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
        chaveDeAcesso: "wwrtjwrtj1623471765ny6nqergwrqerhwrthwtrht442eerg",
      },
      cbs: {
        informado: {
          valor: "1.20",
        },
      },
      ibs: {
        informado: {
          valor: "2.80",
        },
      },
    },
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
  cobBody3: {
    loc: {
      id: 7768,
    },
    devedor: {
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    valor: {
      original: "123.45",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "lkjalkjfspjroij2poij523lk2nflqkef",
      },
      cbs: {
        informado: {
          valor: "4.50",
        },
      },
      ibs: {
        informado: {
          valor: "8.60",
        },
      },
    },
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  cobBody4: {
    valor: {
      original: "567.89",
    },
    solicitacaoPagador: "Informar cartão fidelidade",
  },
  cobBody5: {
    status: "REMOVIDA_PELO_USUARIO_RECEBEDOR",
  },
  cobBody6: {
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
  cobBody7: {
    loc: {
      id: 789,
    },
    devedor: {
      logradouro: "Alameda Souza, Numero 80, Bairro Braz",
      cidade: "Recife",
      uf: "PE",
      cep: "70011750",
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    valor: {
      original: "123.45",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "lddlg2glkkl620fs9908093235",
      },
      cbs: {
        informado: {
          valor: "4.32",
        },
      },
      ibs: {
        informado: {
          valor: "8.13",
        },
      },
    },
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  cobBody8: {
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
  cobBody9: {
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
  cobRBody1: {
    idRec: "RR1234567820240115abcdefghijk",
    infoAdicional: "Serviços de Streamming de Música e Filmes.",
    calendario: {
      dataDeVencimento: "2024-04-15",
    },
    valor: {
      original: "106.07",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "gsgsglllwkfwfubrsjfd7373dfd235",
      },
      cbs: {
        informado: {
          valor: "3.71",
        },
      },
      ibs: {
        informado: {
          valor: "7.42",
        },
      },
    },
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
  },
  cobRBody2: {
    status: "CANCELADA",
  },
  cobRResponse1: {
    idRec: "RR1234567820240115abcdefghijk",
    txid: "3136957d93134f2184b369e8f1c0729d",
    infoAdicional: "Serviços de Streamming de Música e Filmes.",
    calendario: {
      criacao: "2024-04-01",
      dataDeVencimento: "2024-04-15",
    },
    status: "CRIADA",
    valor: {
      original: "106.07",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "wwkfkjkjknccxbvzfafaf727652jdjdjss",
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
  cobRResponse2: {
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
  cobRResponse3: {
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
      },
      {
        dataLiquidacao: "2024-06-24",
        tipo: "NTAG",
        endToEndId: "E12345678202406201221abcdef12345",
        status: "AGENDADA",
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
  cobRResponse4: {
    idRec: "RN985156112024071999000566354",
    txid: "517bd858b59d458a841280b0f0a60bfa",
    calendario: {
      criacao: "2024-05-20",
      dataDeVencimento: "2024-06-20",
    },
    valor: {
      original: "210.00",
    },
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "xjsjjfhasjhu821412ad7dajjqwfjjjvvjj",
      },
      cbs: {
        informado: {
          valor: "7.35",
          data: "2024-05-20T14:47:29.470Z",
        },
      },
      ibs: {
        informado: {
          valor: "14.70",
          data: "2024-05-20T14:47:29.470Z",
        },
      },
    },
    valorLiquidoEstimado: "187.95",
    status: "CANCELADA",
    politicaRetentativa: "NAO_PERMITE",
    ajusteDiaUtil: true,
    devedor: {
      cep: "26901340",
      cidade: "São Luís",
      email: "fulano.tal@mail.com",
      logradouro: "Alameda Cardoso 1007",
      uf: "MA",
    },
    recebedor: {
      cnpj: "31166575201770",
      conta: "107262",
      nome: "Empresa de Telecomunicações SA",
      tipoConta: "POUPANÇA",
    },
    tentativas: [
      {
        dataLiquidacao: "2024-06-20",
        tipo: "AGND",
        endToEndId: "E12345678202406201221abcdef12345",
        status: "CANCELADA",
      },
    ],
    encerramento: {
      cancelamento: {
        solicitante: "USUARIO_RECEBEDOR",
        codigo: "SLCR",
        descricao: "Cancelamento de agendamento solicitado pelo usuário recebedor",
      },
    },
    atualizacao: [
      {
        data: "2024-05-20T14:47:29.470Z",
        status: "CRIADA",
      },
      {
        data: "2024-05-21T10:18:20.120Z",
        status: "ATIVA",
      },
      {
        data: "2024-05-26T10:18:20.120Z",
        status: "CANCELADA",
      },
    ],
  },
  loteCobVBody1: {
    descricao: "Cobranças dos alunos do turno vespertino",
    cobsv: [
      {
        calendario: {
          dataDeVencimento: "2020-12-31",
          validadeAposVencimento: 30,
        },
        txid: "fb2761260e554ad593c7226beb5cb650",
        loc: {
          id: 789,
        },
        devedor: {
          logradouro: "Alameda Souza, Numero 80, Bairro Braz",
          cidade: "Recife",
          uf: "PE",
          cep: "70011750",
          cpf: "08577095428",
          nome: "João Souza",
        },
        valor: {
          original: "100.00",
        },
        chave: "7c084cd4-54af-4172-a516-a7d1a12b75cc",
        solicitacaoPagador: "Informar matrícula",
      },
      {
        calendario: {
          dataDeVencimento: "2020-12-31",
          validadeAposVencimento: 30,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        loc: {
          id: 57221,
        },
        devedor: {
          logradouro: "Rua 15, Numero 1, Bairro Campo Grande",
          cidade: "Recife",
          uf: "PE",
          cep: "70055751",
          cpf: "15311295449",
          nome: "Manoel Silva",
        },
        valor: {
          original: "100.00",
        },
        chave: "7c084cd4-54af-4172-a516-a7d1a12b75cc",
        solicitacaoPagador: "Informar matrícula",
      },
    ],
  },
  loteCobVBodyRevisado1: {
    cobsv: [
      {
        calendario: {
          dataDeVencimento: "2020-01-10",
        },
        txid: "fb2761260e554ad593c7226beb5cb650",
        valor: {
          original: "110.00",
        },
      },
      {
        calendario: {
          dataDeVencimento: "2020-01-10",
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        valor: {
          original: "110.00",
        },
      },
    ],
  },
  cobResponse1: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 0,
    loc: {
      id: 789,
      location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
      tipoCob: "cob",
    },
    location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
  cobResponse2: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "655dfdb1a4514b8fbb58254b958913fb",
    revisao: 1,
    loc: {
      id: 567,
      location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
    },
    location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
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
  cobResponse3: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 1,
    loc: {
      id: 7768,
      location: "pix.example.com/qr/b1/9d36b84fc70b478fb95c12729b90ca25",
      tipoCob: "cob",
    },
    location: "pix.example.com/qr/v1/9d36b84fc70b478fb95c12729b90ca25",
    status: "ATIVA",
    devedor: {
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    valor: {
      original: "123.45",
      modalidadeAlteracao: 0,
    },
    chave: "a1f4102e-a446-4a57-bcce-6fa48899c1d1",
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  },
  cobResponse4: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      dataDeVencimento: "2020-12-31",
      validadeAposVencimento: 30,
    },
    txid: "7978c0c97ea847e78e8849634473c1f1",
    revisao: 0,
    loc: {
      id: 789,
      location: "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25",
      tipoCob: "cobv",
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
      cnpj: "56989000019533",
      nome: "Empresa de Logística SA",
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
  cobResponse5: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "33beb661beda44a8928fef47dbeb2dc5",
    revisao: 0,
    loc: {
      id: 1004,
      location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
      tipoCob: "cob",
    },
    location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
  cobResponse6: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "33beb661beda44a8928fef47dbeb2dc5",
    revisao: 0,
    loc: {
      id: 1004,
      location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
      tipoCob: "cob",
    },
    location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
  cobResponse7: {
    calendario: {
      criacao: "2020-09-09T20:15:00.358Z",
      expiracao: 3600,
    },
    txid: "33beb661beda44a8928fef47dbeb2dc5",
    revisao: 0,
    loc: {
      id: 1004,
      location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
      tipoCob: "cob",
    },
    location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
  recBody1: {
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
    valor: {
      valorRec: "35.00",
    },
    politicaRetentativa: "NAO_PERMITE",
    loc: 108,
    ativacao: {
      dadosJornada: {
        txid: "33beb661beda44a8928fef47dbeb2dc5",
      },
    },
  },
  recBody2: {
    vinculo: {
      contrato: "998782003",
      devedor: {
        cpf: "02989131415",
        nome: "Beltrano da Silva",
      },
      objeto: "Serviço de Plano de Saúde.",
    },
    calendario: {
      dataInicial: "2024-10-10",
      periodicidade: "ANUAL",
    },
    valor: {
      valorMinimoRecebedor: "5000.00",
    },
    politicaRetentativa: "PERMITE_3R_7D",
  },
  recBody3: {
    loc: 108,
    vinculo: {
      devedor: {
        nome: "Fulano de Tal",
      },
    },
    calendario: {
      dataInicial: "2024-04-01",
    },
    ativacao: {
      dadosJornada: {
        txid: "33beb661beda44a8928fef47dbeb2dc5",
      },
    },
  },
  recBody4: {
    status: "CANCELADA",
  },
  recResponse1: {
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
      location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
      idRec: "RN1234567820240115abcdefghijk",
    },
    ativacao: {
      dadosJornada: {
        tipoJornada: "JORNADA_3",
        txid: "33beb661beda44a8928fef47dbeb2dc5",
      },
    },
    atualizacao: [
      {
        data: "2023-12-19T12:28:05.230Z",
        nome: "CRIADA",
      },
    ],
  },
  recResponse2: {
    idRec: "RR1234567820240115abcdefghijk",
    vinculo: {
      contrato: "998782003",
      devedor: {
        cpf: "02989131415",
        nome: "Beltrano da Silva",
      },
      objeto: "Serviço de Plano de Saúde.",
    },
    calendario: {
      dataInicial: "2024-10-10",
      periodicidade: "ANUAL",
    },
    politicaRetentativa: "PERMITE_3R_7D",
    recebedor: {
      cnpj: "09172302153900",
      nome: "Empresa de Serviços de Saúde SA",
    },
    valor: {
      valorMinimoRecebedor: "5000.00",
    },
    status: "CRIADA",
    atualizacao: [
      {
        data: "2024-01-11T10:27:01.280Z",
        nome: "CRIADA",
      },
    ],
  },
  recResponse3: {
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
      location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
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
      },
      {
        data: "2024-01-04T09:40:42.210Z",
        nome: "APROVADA",
      },
    ],
    dadosQR: {
      jornada: "JORNADA_2",
      pixCopiaECola:
        "00020126180014br.gov.bcb.pix5204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002630462C9",
    },
  },
  recResponse4: {
    idRec: "RR7784567820240528123defgh775",
    status: "CRIADA",
    valor: {
      valorRec: "250.00",
    },
    vinculo: {
      contrato: "9612389",
      devedor: {
        cpf: "45832633800",
        nome: "Alfredo Tavares",
      },
      objeto: "Serviços Esportivos",
    },
    calendario: {
      dataFinal: "2028-09-01",
      dataInicial: "2024-02-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "PERMITE_3R_7D",
    pagador: {
      codMun: "1509873",
      cpf: "45832633800",
      ispbParticipante: "52780028",
    },
    recebedor: {
      cnpj: "56958712500811",
      nome: "Academia Saúde",
    },
    atualizacao: [
      {
        data: "2024-01-03T08:30:02.050Z",
        nome: "CRIADA",
      },
    ],
  },
  recResponse5: {
    idRec: "RR1026652320240821lab77511abf",
    status: "CANCELADA",
    valor: {
      valorMinimoRecebedor: "800.00",
    },
    vinculo: {
      contrato: "298620560",
      devedor: {
        cpf: "12600511100",
        nome: "Sebastião Silva",
      },
      objeto: "Faculdade de Engenharia",
    },
    calendario: {
      dataFinal: "2027-09-01",
      dataInicial: "2024-10-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "PERMITE_3R_7D",
    pagador: {
      codMun: "1509873",
      cpf: "12600511100",
      ispbParticipante: "52780028",
    },
    recebedor: {
      cnpj: "61593007802371",
      nome: "Universidade Brasileira",
    },
    encerramento: {
      cancelamento: {
        solicitante: "USUARIO_RECEBEDOR",
        codigo: "SLCR",
        descricao: "Cancelamento solicitado pelo usuário recebedor",
      },
    },
    atualizacao: [
      {
        data: "2024-08-03T08:30:02.050Z",
        nome: "CRIADA",
      },
      {
        data: "2024-09-06T09:11:42.205Z",
        nome: "APROVADA",
      },
      {
        data: "2024-10-06T15:05:33.305Z",
        nome: "CANCELADA",
      },
    ],
    ativacao: {
      tipoJornada: "JORNADA_1",
    },
  },
  recResponse6: {
    idRec: "RN1234567820241203fghijkabcde",
    status: "CRIADA",
    valor: {
      valorRec: "150.00",
    },
    vinculo: {
      contrato: "5582610",
      devedor: {
        cpf: "45164632481",
        nome: "Fulano de Tal",
      },
      objeto: "Serviços de Gestão de Imóveis",
    },
    calendario: {
      dataFinal: "2028-09-01",
      dataInicial: "2025-02-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "NAO_PERMITE",
    loc: {
      criacao: "2024-10-01T10:15:01.115Z",
      id: 2726,
      location: "pix.example.com/qr/v2/rec/94ed2badcbc04c15b0bb7fa353194890",
      idRec: "RN1234567820241203fghijkabcde",
    },
    recebedor: {
      cnpj: "12345678000195",
      nome: "Empresa de Serviços SA",
    },
    atualizacao: [
      {
        data: "2024-12-03T08:30:02.050Z",
        nome: "CRIADA",
      },
    ],
    dadosQR: {
      jornada: "JORNADA_3",
      pixCopiaECola:
        "00020101021226760014br.gov.bcb.pix2554pix.example.com/qr/v2/8b3da2f39a4140d1a91abd93113bd4415204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/94ed2badcbc04c15b0bb7fa35319489063047741",
    },
  },
  recResponse7: {
    idRec: "RN1234567820241130lkwdefghijk",
    status: "CRIADA",
    valor: {
      valorRec: "210.00",
    },
    vinculo: {
      contrato: "11750023",
      devedor: {
        cpf: "75633122216",
        nome: "Francisco da Silva",
      },
      objeto: "Assinatura de Serviços de Transporte",
    },
    calendario: {
      dataFinal: "2026-12-01",
      dataInicial: "2025-03-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "NAO_PERMITE",
    loc: {
      criacao: "2024-05-19T10:28:05.230Z",
      id: 6153,
      location: "pix.example.com/qr/v2/rec/3ffa640fa4f14080adccb949fa2dc0d0",
      idRec: "RN1234567820241130lkwdefghijk",
    },
    recebedor: {
      cnpj: "56989000019533",
      nome: "Empresa de Logística SA",
    },
    atualizacao: [
      {
        data: "2024-11-30T08:30:02.050Z",
        nome: "CRIADA",
      },
    ],
    dadosQR: {
      jornada: "JORNADA_4",
      pixCopiaECola:
        "00020101021226810014br.gov.bcb.pix2559pix.example.com/qr/v2/cobv/1e6c54d3ec9449b7a7fc53b6b0f998e75204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/3ffa640fa4f14080adccb949fa2dc0d06304A441",
    },
  },
  recResponse8: {
    idRec: "RR3781267820250201123deabc339",
    status: "CRIADA",
    valor: {
      valorRec: "170.00",
    },
    vinculo: {
      contrato: "1793651",
      devedor: {
        cpf: "01536985566",
        nome: "Fulano de Tal",
      },
      objeto: "Serviços de Telefonia",
    },
    calendario: {
      dataFinal: "2028-03-01",
      dataInicial: "2025-03-01",
      periodicidade: "MENSAL",
    },
    politicaRetentativa: "NAO_PERMITE",
    pagador: {
      codMun: "1509873",
      cpf: "45832633800",
      ispbParticipante: "52780028",
    },
    recebedor: {
      convenio: "Master",
      cnpj: "56958712500811",
      nome: "Academia Saúde",
    },
    atualizacao: [
      {
        data: "2025-02-01T08:30:02.050Z",
        nome: "CRIADA",
      },
    ],
  },
  recWebhookNotification1: {
    recs: [
      {
        idRec: "RR1026652320240821lab77511abf",
        status: "APROVADA",
        atualizacao: [
          {
            status: "CRIADA",
            data: "2024-08-20T10:12:07.567Z",
          },
          {
            status: "APROVADA",
            data: "2024-08-22T12:43:53.337Z",
          },
        ],
        ativacao: {
          tipoJornada: "JORNADA_3",
          dadosJornada: {
            txid: "r9eFIFmwcZ55Nm4RsKZAAtIvvCrlcNN6",
          },
        },
      },
    ],
  },
  recPayload1: {
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
  solicRecBody1: {
    idRec: "RN123456782024011577825445612",
    calendario: {
      dataExpiracaoSolicitacao: "2023-12-20T12:17:11.926Z",
    },
    destinatario: {
      agencia: "2569",
      conta: "550689",
      cpf: "15231470190",
      ispbParticipante: "91193552",
    },
  },
  solicRecBody2: {
    status: "CANCELADA",
  },
  solicRecResponse1: {
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
    },
  },
  solicRecResponse2: {
    idSolicRec: "SC875116782024021577820565312",
    idRec: "RR692350012024051502650081069",
    calendario: {
      dataExpiracaoSolicitacao: "2024-12-15T12:17:11.926Z",
    },
    status: "REJEITADA",
    destinatario: {
      agencia: "1179",
      conta: "73851",
      cpf: "07031470825",
      ispbParticipante: "91193552",
    },
    atualizacao: [
      {
        data: "2024-12-15T12:18:18.618Z",
        status: "CRIADA",
      },
      {
        data: "2024-12-15T16:18:18.618Z",
        status: "ENVIADA",
      },
      {
        data: "2024-12-16T08:50:18.268Z",
        status: "REJEITADA",
      },
    ],
    recPayload: {
      idRec: "RR692350012024051502650081069",
      vinculo: {
        contrato: "Assinatura Individual",
        devedor: {
          cpf: "07031470825",
          nome: "Sebastião Silva",
        },
        objeto: "Serviços de Entrega de Alimentos",
      },
      valor: {
        valorMinimoRecebedor: "300.00",
      },
      calendario: {
        dataFinal: "2025-05-01",
        dataInicial: "2024-12-01",
        periodicidade: "MENSAL",
      },
      recebedor: {
        cnpj: "25603926517008",
        nome: "Empresa de Produtos Alimentícios SA",
      },
      atualizacao: [
        {
          data: "2023-12-08T16:24:35.233Z",
          status: "CRIADA",
        },
      ],
    },
  },
  solicRecResponse3: {
    idSolicRec: "SC876456782024021577825445312",
    idRec: "RN123456782024011577825445612",
    calendario: {
      dataExpiracaoSolicitacao: "2024-06-11T07:17:11.008Z",
    },
    status: "CANCELADA",
    destinatario: {
      agencia: "2569",
      conta: "550689",
      cpf: "15231470190",
      ispbParticipante: "91193552",
    },
    atualizacao: [
      {
        data: "2024-05-16T17:01:06.781Z",
        status: "CRIADA",
      },
      {
        data: "2024-05-30T10:18:18.618Z",
        status: "CANCELADA",
      },
    ],
    recPayload: {
      idRec: "RN123456782024011577825445612",
      vinculo: {
        contrato: "Banda Larga Fibra Ótica",
        devedor: {
          cpf: "15231470190",
          nome: "Fulano de Tal",
        },
        objeto: "Serviços de Telecomunicações",
      },
      valor: {
        valorRec: "1200.09",
      },
      calendario: {
        dataFinal: "2025-05-01",
        dataInicial: "2024-05-01",
        periodicidade: "MENSAL",
      },
      recebedor: {
        cnpj: "94370926517368",
        nome: "Empresa de Serviços SA",
      },
      atualizacao: [
        {
          data: "2023-12-08T16:24:35.233Z",
          status: "CRIADA",
        },
      ],
    },
  },
  loteCobVResponse1: {
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
  },
  loteCobVResponse2: {
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
  },
  payloadLocationBody1: {
    tipoCob: "cob",
  },
  payloadLocationBody2: {
    tipoCob: "cobv",
  },
  payloadLocationResponse1: {
    id: 7716,
    txid: "fda9460fe04e4f129b72863ae57ee22f",
    location: "pix.example.com/qr/v2/cobv/2353c790eefb11eaadc10242ac120002",
    tipoCob: "cobv",
    criacao: "2020-03-11T21:19:51.013Z",
  },
  payloadLocationResponse2: {
    id: 856,
    txid: "31e08604f9ce459bb59672332af8d672",
    location: "pix.example.com/qr/v2/cobv/39c9f435c6324867aa1dec1260e1127c",
    tipoCob: "cobv",
    criacao: "2020-02-10T19:22:52.013Z",
  },
  payloadLocationResponse3: {
    id: 2316,
    txid: "eb9d87f36fca4c92b7d5ec48e2ee3853",
    location: "pix.example.com/qr/v2/a8534e273ecb47d3ac30613104544466",
    tipoCob: "cob",
    criacao: "2020-05-31T19:39:54.013Z",
  },
  payloadLocationResponse4: {
    id: 2316,
    location: "pix.example.com/qr/v2/a8534e273ecb47d3ac30613104544466",
    tipoCob: "cob",
    criacao: "2020-05-31T19:39:54.013Z",
  },
  payloadLocationResponse5: {
    id: 7716,
    location: "pix.example.com/qr/v2/2353c790eefb11eaadc10242ac120002",
    tipoCob: "cob",
    criacao: "2020-03-11T21:19:51.013Z",
  },
  payloadLocationResponse6: {
    id: 856,
    location: "pix.example.com/qr/v2/cobv/39c9f435c6324867aa1dec1260e1127c",
    tipoCob: "cobv",
    criacao: "2020-02-10T19:22:52.013Z",
  },
  payloadLocationRecResponse1: {
    id: 12069,
    location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
    criacao: "2023-12-20T12:38:28.774Z",
    idRec: "RR123456782024011510056892226",
  },
  payloadLocationRecResponse2: {
    id: 12069,
    location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
    criacao: "2023-12-20T12:38:28.774Z",
  },
  pixResponse1: {
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
  pixResponse2: {
    endToEndId: "E12345678202009091221ghijk78901234",
    txid: "5b933948f3224266b1050ac54319e775",
    valor: "200.00",
    horario: "2020-09-10T13:03:33.902Z",
    infoPagador: "Revisão do carro",
  },
  pixResponse3: {
    endToEndId: "E88631478202009091221ghijk78901234",
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
  webhookBody1: {
    webhookUrl: "https://pix.example.com/api/webhook/",
  },
  webhookResponse1: {
    webhookUrl: "https://pix.example.com/api/webhook/",
    chave: "40a0932d-1918-4eee-845d-35a2da1690dc",
    criacao: "2020-11-11T10:15:00.358Z",
  },
  pixWebhook1: {
    endToEndId: "E12345678202009091221kkkkkkkkkkk",
    txid: "c3e0e7a4e7f1469a9f782d3d4999343c",
    valor: "110.00",
    horario: "2020-09-09T20:15:00.358Z",
    infoPagador: "0123456789",
    devolucoes: {
      id: "123ABC",
      rtrId: "D12345678202009091221abcdf098765",
      valor: "10.00",
      horario: {
        solicitacao: "2020-09-09T20:15:00.358Z",
      },
      status: "EM_PROCESSAMENTO",
    },
  },
  pixWebhook2: {
    endToEndId: "E87654321202009091221dfghi123456",
    txid: "971122d8f37211eaadc10242ac120002",
    valor: "110.00",
    horario: "2020-09-09T20:15:00.358Z",
    infoPagador: "0123456789",
  },
  recWebhookBody1: {
    webhookUrl: "https://usuario.recebedor.com/api/webhookrec/",
  },
  recWebhookResponse1: {
    webhookUrl: "https://usuario.recebedor.com/api/webhookrec/",
    criacao: "2023-12-20T12:51:16.485Z",
  },
  cobRWebhookBody1: {
    webhookUrl: "https://usuario.recebedor.com/api/webhookcobr/",
  },
  cobRWebhookResponse1: {
    webhookUrl: "https://usuario.recebedor.com/api/webhookcobr/",
    criacao: "2023-12-20T12:51:16.485Z",
  },
  cobRWebhookNotification1: {
    cobsr: [
      {
        idRec: "RR1234567820240115abcdefghijk",
        txid: "3136957d93134f2184b369e8f1c0729d",
        status: "ATIVA",
        atualizacao: [
          {
            status: "ATIVA",
            data: "2024-08-20T12:34:21.300Z",
          },
        ],
        tentativas: [
          {
            dataLiquidacao: "2024-20-08",
            tipo: "AGND",
            status: "SOLICITADA",
            endToEndId: "E12345678202406201221abcdef12345",
          },
        ],
        valor: {
          original: "100.00",
        },
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "lkkajfakfjkasjfaks8678126487126878",
          },
          cbs: {
            informado: {
              valor: "2.94",
              data: "2024-08-20T12:34:21.300Z",
            },
          },
          ibs: {
            informado: {
              valor: "5.88",
              data: "2024-08-20T12:34:21.300Z",
            },
          },
        },
        valorLiquidoEstimado: "91.18",
      },
    ],
  },
  devolucaoResponse1: {
    id: "123456",
    rtrId: "D12345678202009091000abcde123456",
    valor: "7.89",
    horario: {
      solicitacao: "2020-09-11T15:25:59.411Z",
    },
    status: "EM_PROCESSAMENTO",
  },
  devolucaoResponse2: {
    id: "502",
    rtrId: "D12345678202011111000fghij789012",
    valor: "20.00",
    horario: {
      solicitacao: "2020-09-11T15:25:59.411Z",
    },
    status: "NAO_REALIZADO",
    motivo: "Negado por timeout",
  },
  devolucaoSolicitada1: {
    valor: "7.89",
  },
  cobPayload1: {
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
  cobPayload2: {
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
      cnpj: "58900633120711",
      nome: "Empresa de Abastecimento SA",
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
  cobPayload3: {
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
  cobPayload4: {
    calendario: {
      criacao: "2025-11-20T14:22:10.000Z",
      apresentacao: "2025-12-01T09:30:00Z",
      expiracao: 3600,
    },
    txid: "a1b2c3d4e5f6478890abcdef12345678",
    revisao: 3,
    status: "ATIVA",
    valor: {
      original: "750.50",
      modalidadeAlteracao: 0,
    },
    chave: "9f8e7d6c-5b4a-11ee-9a34-0242ac120003",
    solicitacaoPagador: "Informar número do pedido",
    infoAdicionais: [
      {
        nome: "quantidade",
        valor: "2",
      },
      {
        nome: "produto",
        valor: "Assinatura Mensal",
      },
    ],
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "nchsgsgddkgjdhsueyrgkasjdh",
      },
      cbs: {
        informado: {
          valor: "20.00",
          data: "2025-11-20T14:22:10.000Z",
        },
      },
      ibs: {
        informado: {
          valor: "35.25",
          data: "2025-11-20T14:22:10.000Z",
        },
      },
    },
    valorLiquidoEstimado: "695.25",
  },
  cobPayload5: {
    calendario: {
      criacao: "2026-06-09T10:00:00.000Z",
      apresentacao: "2026-06-15T18:00:00Z",
      dataDeVencimento: "2026-07-31",
      validadeAposVencimento: 30,
    },
    devedor: {
      cnpj: "92221288310574",
      nome: "Imobiliária Bom Sucesso",
    },
    recebedor: {
      logradouro: "Rua 15 Numero 1200, Bairro São Luiz",
      cidade: "São Paulo",
      uf: "SP",
      cep: "70800100",
      cnpj: "37989000025711",
      nome: "Empresa de Logística SA",
    },
    txid: "d4f7a9b2c3e44f1a9b8c7d6e5f123abc",
    revisao: 3,
    status: "ATIVA",
    valor: {
      original: "200.00",
      multa: "10.00",
      juros: "1.50",
      final: "211.50",
    },
    chave: "b12f3e4a-6c7d-11ee-9a34-0242ac120010",
    solicitacaoPagador: "Informar cartão fidelidade",
    infoAdicionais: [
      {
        nome: "quantidade",
        valor: "2",
      },
    ],
    tributo: {
      documentoFiscal: {
        chaveDeAcesso: "oakeir7361u4n538d87ad8aj42jk",
      },
      cbs: {
        informado: {
          valor: "12.00",
          data: "2026-06-09T10:00:00.000Z",
        },
      },
      ibs: {
        informado: {
          valor: "8.50",
          data: "2026-06-09T10:00:00.000Z",
        },
      },
    },
    valorLiquidoEstimado: "179.50",
  },
  getCobs1: {
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
          location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
          location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
        },
        location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
  getCobs2: {
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
          expiracao: 3600,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 0,
        loc: {
          id: 789,
          location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
    ],
  },
  getCobsV1: {
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
          location: "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cobv",
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
          cnpj: "56989000019533",
          nome: "Empresa de Logística SA",
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
  getPix1: {
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
        endToEndId: "E12345678202009091221ghijk78901234",
        txid: "5b933948f3224266b1050ac54319e775",
        valor: "200.00",
        horario: "2020-09-10T13:03:33.902Z",
        infoPagador: "Revisão do carro",
      },
      {
        endToEndId: "E88631478202009091221ghijk78901234",
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
  getLotesCobsV: {
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
      },
    ],
  },
  getPayloadLocation1: {
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
        location: "pix.example.com/qr/v2/cobv/2353c790eefb11eaadc10242ac120002",
        tipoCob: "cobv",
        criacao: "2020-03-11T21:19:51.013Z",
      },
      {
        id: 856,
        txid: "31e08604f9ce459bb59672332af8d672",
        location: "pix.example.com/qr/v2/cobv/39c9f435c6324867aa1dec1260e1127c",
        tipoCob: "cobv",
        criacao: "2020-02-10T19:22:52.013Z",
      },
      {
        id: 2316,
        txid: "eb9d87f36fca4c92b7d5ec48e2ee3853",
        location: "pix.example.com/qr/v2/a8534e273ecb47d3ac30613104544466",
        tipoCob: "cob",
        criacao: "2020-05-31T19:39:54.013Z",
      },
    ],
  },
  getPayloadLocationRec1: {
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
        location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
        criacao: "2023-12-20T12:38:28.774Z",
        idRec: "RR123456782024011510056892226",
      },
    ],
  },
  getWebhook1: {
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
      },
    ],
  },
  getWebhookRec1: {
    parametros: {
      inicio: "2023-10-01T00:00:00Z",
      fim: "2024-04-01T23:59:59Z",
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
      },
    ],
  },
  getRec1: {
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
          location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
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
          },
          {
            data: "2024-01-04T09:40:42.210Z",
            nome: "APROVADA",
          },
        ],
      },
    ],
  },
  getCobR1: {
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
  RequisicaoInvalidaCobExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobOperacaoInvalida",
    title: "Cobrança inválida.",
    status: 400,
    detail:
      "A requisição que busca alterar ou criar uma cobrança para pagamento imediato não respeita o _schema_ ou está semanticamente errada.",
    violacoes: [
      {
        razao: "O campo cob.valor.original não respeita o _schema_.",
        propriedade: "cob.valor.original",
      },
    ],
  },
  OperacaoInvalidaCobExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobOperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail:
      "A requisição que busca alterar ou criar uma cobrança para pagamento imediato não respeita o _schema_ ou está semanticamente errada.",
  },
  RequisicaoInvalidaCobVExample1: {
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
  OperacaoInvalidaCobVExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobVOperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail:
      "Cobrança não encontra-se mais com o status ATIVA, somente cobranças ativas podem ser revisadas.",
  },
  OperacaoInvalidaCobRExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail: "A cobrança não respeita o schema.",
    violacoes: [
      {
        razao: "O objeto cobr.calendario não respeita o schema.",
        propriedade: "cobr.calendario",
      },
    ],
  },
  OperacaoInvalidaCobRExample2: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail:
      "Não é possível cancelar uma cobrança em uma data igual ou maior que a data prevista da primeira tentativa de liquidação.",
  },
  OperacaoInvalidaRecExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/RecOperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail: "A recorrência não respeita o schema.",
    violacoes: [
      {
        razao: "O campo rec.calendario.dataInicial não respeita o schema.",
        propriedade: "rec.calendario.dataInicial",
      },
    ],
  },
  OperacaoInvalidaSolicRecExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/SolicRecOperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail: "A solicitação de confirmação de recorrência não respeita o schema.",
    violacoes: [
      {
        razao: "O objeto solicrec.destinatario não respeita o schema.",
        propriedade: "solicrec.destinatario",
      },
    ],
  },
  OperacaoInvalidaSolicRecExample2: {
    type: "https://pix.bcb.gov.br/api/v2/error/SolicRecOperacaoInvalida",
    title: "Operação inválida.",
    status: 400,
    detail:
      "Não é possível cancelar uma solicitação de recorrência com o status diferente de CRIADA ou RECEBIDA.",
  },
  RequisicaoInvalidaCobPayloadExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobPayloadNaoEncontrado",
    title: "Cobrança não encontrada.",
    status: 404,
    detail: "A cobrança em questão não foi encontrada para a location requisitada.",
  },
  RequisicaoInvalidaRecPayloadExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/RecPayloadOperacaoInvalida",
    title: "Recorrência não encontrada.",
    status: 400,
    detail: "A recorrência em questão encontra-se expirada, cancelada ou rejeitada.",
  },
  RequisicaoInvalidaCobRTentativaExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
    title: "Cobrança não encontrada.",
    status: 400,
    detail: "A política configurada na recorrência não permite retentativa de cobrança.",
  },
  RequisicaoInvalidaLoteCobVExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/LoteCobVOperacaoInvalida",
    title: "Lote de cobranças inválido.",
    status: 400,
    detail:
      "A requisição que busca alterar ou criar um lote de cobranças com vencimento não respeita o _schema_ ou está semanticamente errada.",
    violacoes: [
      {
        razao: "O objeto loteCobV.cobsV não respeita o _schema_.",
        propriedade: "loteCobV.cobsV",
      },
      {
        razao: "O campo loteCobV.descricao não respeita o _schema_.",
        propriedade: "loteCobV.descricao",
      },
    ],
  },
  RequisicaoInvalidaDevolucaoExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/PixDevolucaoInvalida",
    title: "Devolução inválida.",
    status: 400,
    detail:
      "A presente requisição de devolução não respeita o _schema_ ou não faz sentido semanticamente.",
  },
  RequisicaoInvalidaWebhookExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/WebhookOperacaoInvalida",
    title: "Webhook inválido.",
    status: 400,
    detail:
      "A presente requisição busca criar um webhook sem respeitar o _schema_ ou, ainda, com sentido semanticamente inválido.",
  },
  RequisicaoInvalidaLocationExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/PayloadLocationOperacaoInvalida",
    title: "PayloadLocation inválido.",
    status: 400,
    detail: "A presente requisição busca criar uma location sem respeitar o _schema_ estabelecido.",
  },
  AcessoNegadoExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
    title: "Acesso Negado",
    status: 403,
    detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
  },
  NaoEncontradoExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
    title: "Não Encontrado",
    status: 404,
    detail: "Entidade não encontrada.",
  },
  ServicoIndisponivelExample1: {
    type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
    title: "Serviço Indisponível",
    status: 503,
    detail:
      "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
  },
};

/**
 * Example request bodies per request-body component name (from the requestBody `examples` maps).
 */
export const requestBodyExamples: Readonly<Record<string, readonly unknown[]>> = {
  CobBody: [
    {
      calendario: {
        expiracao: 3600,
      },
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
          chaveDeAcesso: "wwrtjwrtj1623471765ny6nqergwrqerhwrthwtrht442eerg",
        },
        cbs: {
          informado: {
            valor: "1.20",
          },
        },
        ibs: {
          informado: {
            valor: "2.80",
          },
        },
      },
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
  CobRBody: [
    {
      idRec: "RR1234567820240115abcdefghijk",
      infoAdicional: "Serviços de Streamming de Música e Filmes.",
      calendario: {
        dataDeVencimento: "2024-04-15",
      },
      valor: {
        original: "106.07",
      },
      tributo: {
        documentoFiscal: {
          chaveDeAcesso: "gsgsglllwkfwfubrsjfd7373dfd235",
        },
        cbs: {
          informado: {
            valor: "3.71",
          },
        },
        ibs: {
          informado: {
            valor: "7.42",
          },
        },
      },
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
    },
  ],
  CobVBody: [
    {
      calendario: {
        dataDeVencimento: "2020-12-31",
        validadeAposVencimento: 30,
      },
      loc: {
        id: 789,
      },
      devedor: {
        logradouro: "Alameda Souza, Numero 80, Bairro Braz",
        cidade: "Recife",
        uf: "PE",
        cep: "70011750",
        cpf: "12345678909",
        nome: "Francisco da Silva",
      },
      valor: {
        original: "123.45",
        multa: {
          modalidade: "2",
          valorPerc: "15.00",
        },
        juros: {
          modalidade: "2",
          valorPerc: "2.00",
        },
        desconto: {
          modalidade: "1",
          descontoDataFixa: [
            {
              data: "2020-11-30",
              valorPerc: "30.00",
            },
          ],
        },
      },
      tributo: {
        documentoFiscal: {
          chaveDeAcesso: "sghhqerhrqew346346erg3346",
        },
        cbs: {
          informado: {
            valor: "4.32",
          },
        },
        ibs: {
          informado: {
            valor: "8.13",
          },
        },
      },
      chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
      solicitacaoPagador: "Cobrança dos serviços prestados.",
    },
  ],
  LoteCobVBody: [
    {
      descricao: "Cobranças dos alunos do turno vespertino",
      cobsv: [
        {
          calendario: {
            dataDeVencimento: "2020-12-31",
            validadeAposVencimento: 30,
          },
          txid: "fb2761260e554ad593c7226beb5cb650",
          loc: {
            id: 789,
          },
          devedor: {
            logradouro: "Alameda Souza, Numero 80, Bairro Braz",
            cidade: "Recife",
            uf: "PE",
            cep: "70011750",
            cpf: "08577095428",
            nome: "João Souza",
          },
          valor: {
            original: "100.00",
          },
          chave: "7c084cd4-54af-4172-a516-a7d1a12b75cc",
          solicitacaoPagador: "Informar matrícula",
        },
        {
          calendario: {
            dataDeVencimento: "2020-12-31",
            validadeAposVencimento: 30,
          },
          txid: "7978c0c97ea847e78e8849634473c1f1",
          loc: {
            id: 57221,
          },
          devedor: {
            logradouro: "Rua 15, Numero 1, Bairro Campo Grande",
            cidade: "Recife",
            uf: "PE",
            cep: "70055751",
            cpf: "15311295449",
            nome: "Manoel Silva",
          },
          valor: {
            original: "100.00",
          },
          chave: "7c084cd4-54af-4172-a516-a7d1a12b75cc",
          solicitacaoPagador: "Informar matrícula",
        },
      ],
    },
  ],
  LoteCobVBodyRevisado: [
    {
      cobsv: [
        {
          calendario: {
            dataDeVencimento: "2020-01-10",
          },
          txid: "fb2761260e554ad593c7226beb5cb650",
          valor: {
            original: "110.00",
          },
        },
        {
          calendario: {
            dataDeVencimento: "2020-01-10",
          },
          txid: "7978c0c97ea847e78e8849634473c1f1",
          valor: {
            original: "110.00",
          },
        },
      ],
    },
  ],
  CobBodyRevisada: [
    {
      loc: {
        id: 7768,
      },
      devedor: {
        cpf: "12345678909",
        nome: "Francisco da Silva",
      },
      valor: {
        original: "123.45",
      },
      tributo: {
        documentoFiscal: {
          chaveDeAcesso: "lkjalkjfspjroij2poij523lk2nflqkef",
        },
        cbs: {
          informado: {
            valor: "4.50",
          },
        },
        ibs: {
          informado: {
            valor: "8.60",
          },
        },
      },
      solicitacaoPagador: "Cobrança dos serviços prestados.",
    },
    {
      valor: {
        original: "567.89",
      },
      solicitacaoPagador: "Informar cartão fidelidade",
    },
    {
      status: "REMOVIDA_PELO_USUARIO_RECEBEDOR",
    },
  ],
  CobRBodyRevisada: [
    {
      status: "CANCELADA",
    },
  ],
  CobVBodyRevisada: [
    {
      loc: {
        id: 789,
      },
      devedor: {
        logradouro: "Alameda Souza, Numero 80, Bairro Braz",
        cidade: "Recife",
        uf: "PE",
        cep: "70011750",
        cpf: "12345678909",
        nome: "Francisco da Silva",
      },
      valor: {
        original: "123.45",
      },
      tributo: {
        documentoFiscal: {
          chaveDeAcesso: "lddlg2glkkl620fs9908093235",
        },
        cbs: {
          informado: {
            valor: "4.32",
          },
        },
        ibs: {
          informado: {
            valor: "8.13",
          },
        },
      },
      solicitacaoPagador: "Cobrança dos serviços prestados.",
    },
    {
      valor: {
        original: "567.89",
      },
      solicitacaoPagador: "Informar cartão fidelidade",
    },
    {
      status: "REMOVIDA_PELO_USUARIO_RECEBEDOR",
    },
  ],
  PayloadLocationBody: [
    {
      tipoCob: "cob",
    },
  ],
  DevolucaoBody: [
    {
      valor: "7.89",
    },
  ],
  WebhookConfigBody: [
    {
      webhookUrl: "https://pix.example.com/api/webhook/",
    },
  ],
  WebhookRecConfigBody: [
    {
      webhookUrl: "https://usuario.recebedor.com/api/webhookrec/",
    },
  ],
  WebhookCobRConfigBody: [
    {
      webhookUrl: "https://usuario.recebedor.com/api/webhookcobr/",
    },
  ],
  SolicRecBody: [
    {
      idRec: "RN123456782024011577825445612",
      calendario: {
        dataExpiracaoSolicitacao: "2023-12-20T12:17:11.926Z",
      },
      destinatario: {
        agencia: "2569",
        conta: "550689",
        cpf: "15231470190",
        ispbParticipante: "91193552",
      },
    },
  ],
  SolicRecBodyRevisada: [
    {
      status: "CANCELADA",
    },
  ],
  RecBody: [
    {
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
      valor: {
        valorRec: "35.00",
      },
      politicaRetentativa: "NAO_PERMITE",
      loc: 108,
      ativacao: {
        dadosJornada: {
          txid: "33beb661beda44a8928fef47dbeb2dc5",
        },
      },
    },
    {
      vinculo: {
        contrato: "998782003",
        devedor: {
          cpf: "02989131415",
          nome: "Beltrano da Silva",
        },
        objeto: "Serviço de Plano de Saúde.",
      },
      calendario: {
        dataInicial: "2024-10-10",
        periodicidade: "ANUAL",
      },
      valor: {
        valorMinimoRecebedor: "5000.00",
      },
      politicaRetentativa: "PERMITE_3R_7D",
    },
  ],
  RecBodyRevisada: [
    {
      loc: 108,
      vinculo: {
        devedor: {
          nome: "Fulano de Tal",
        },
      },
      calendario: {
        dataInicial: "2024-04-01",
      },
      ativacao: {
        dadosJornada: {
          txid: "33beb661beda44a8928fef47dbeb2dc5",
        },
      },
    },
    {
      status: "CANCELADA",
    },
  ],
};

/**
 * Example response payloads per operation name and HTTP status code
 * (error examples validate against the Problema schema).
 */
export const operationResponseExamples: Readonly<
  Record<string, Readonly<Record<number, readonly unknown[]>>>
> = {
  GetCobTxid: {
    200: [
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 0,
        loc: {
          id: 789,
          location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
          location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
        },
        location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutCobTxid: {
    201: [
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 0,
        loc: {
          id: 789,
          location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
        txid: "33beb661beda44a8928fef47dbeb2dc5",
        revisao: 0,
        loc: {
          id: 1004,
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobOperacaoInvalida",
        title: "Cobrança inválida.",
        status: 400,
        detail:
          "A requisição que busca alterar ou criar uma cobrança para pagamento imediato não respeita o _schema_ ou está semanticamente errada.",
        violacoes: [
          {
            razao: "O campo cob.valor.original não respeita o _schema_.",
            propriedade: "cob.valor.original",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PatchCobTxid: {
    200: [
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 1,
        loc: {
          id: 7768,
          location: "pix.example.com/qr/b1/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/v1/9d36b84fc70b478fb95c12729b90ca25",
        status: "ATIVA",
        devedor: {
          cpf: "12345678909",
          nome: "Francisco da Silva",
        },
        valor: {
          original: "123.45",
          modalidadeAlteracao: 0,
        },
        chave: "a1f4102e-a446-4a57-bcce-6fa48899c1d1",
        solicitacaoPagador: "Cobrança dos serviços prestados.",
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail:
          "A requisição que busca alterar ou criar uma cobrança para pagamento imediato não respeita o _schema_ ou está semanticamente errada.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetCob: {
    200: [
      {
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
              location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
              tipoCob: "cob",
            },
            location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
              location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
            },
            location: "pix.example.com/qr/1dd7f893a58e417287028dc33e21a403",
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
              location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
              tipoCob: "cob",
            },
            location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
              location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
              tipoCob: "cob",
            },
            location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
              location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
              tipoCob: "cob",
            },
            location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
      {
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
              expiracao: 3600,
            },
            txid: "7978c0c97ea847e78e8849634473c1f1",
            revisao: 0,
            loc: {
              id: 789,
              location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
              tipoCob: "cob",
            },
            location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostCob: {
    201: [
      {
        calendario: {
          criacao: "2020-09-09T20:15:00.358Z",
          expiracao: 3600,
        },
        txid: "7978c0c97ea847e78e8849634473c1f1",
        revisao: 0,
        loc: {
          id: 789,
          location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/9d36b84fc70b478fb95c12729b90ca25",
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
        txid: "33beb661beda44a8928fef47dbeb2dc5",
        revisao: 0,
        loc: {
          id: 1004,
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
          location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
          tipoCob: "cob",
        },
        location: "pix.example.com/qr/7faa6893c4e64893a503baf0d40af213",
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
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobOperacaoInvalida",
        title: "Cobrança inválida.",
        status: 400,
        detail:
          "A requisição que busca alterar ou criar uma cobrança para pagamento imediato não respeita o _schema_ ou está semanticamente errada.",
        violacoes: [
          {
            razao: "O campo cob.valor.original não respeita o _schema_.",
            propriedade: "cob.valor.original",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetCobvTxid: {
    200: [
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
          location: "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cobv",
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
          cnpj: "56989000019533",
          nome: "Empresa de Logística SA",
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
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutCobvTxid: {
    201: [
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
          location: "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cobv",
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
          cnpj: "56989000019533",
          nome: "Empresa de Logística SA",
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
    400: [
      {
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
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PatchCobvTxid: {
    200: [
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
          location: "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25",
          tipoCob: "cobv",
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
          cnpj: "56989000019533",
          nome: "Empresa de Logística SA",
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
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobVOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail:
          "Cobrança não encontra-se mais com o status ATIVA, somente cobranças ativas podem ser revisadas.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetCobv: {
    200: [
      {
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
              location: "pix.example.com/qr/c2/cobv/9d36b84fc70b478fb95c12729b90ca25",
              tipoCob: "cobv",
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
              cnpj: "56989000019533",
              nome: "Empresa de Logística SA",
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
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetLotecobvId: {
    200: [
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
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutLotecobvId: {
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/LoteCobVOperacaoInvalida",
        title: "Lote de cobranças inválido.",
        status: 400,
        detail:
          "A requisição que busca alterar ou criar um lote de cobranças com vencimento não respeita o _schema_ ou está semanticamente errada.",
        violacoes: [
          {
            razao: "O objeto loteCobV.cobsV não respeita o _schema_.",
            propriedade: "loteCobV.cobsV",
          },
          {
            razao: "O campo loteCobV.descricao não respeita o _schema_.",
            propriedade: "loteCobV.descricao",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PatchLotecobvId: {
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobVOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail:
          "Cobrança não encontra-se mais com o status ATIVA, somente cobranças ativas podem ser revisadas.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetLotecobv: {
    200: [
      {
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
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetLocrec: {
    200: [
      {
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
            location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
            criacao: "2023-12-20T12:38:28.774Z",
            idRec: "RR123456782024011510056892226",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostLocrec: {
    201: [
      {
        id: 12069,
        location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
        criacao: "2023-12-20T12:38:28.774Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetLocrecId: {
    200: [
      {
        id: 12069,
        location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
        criacao: "2023-12-20T12:38:28.774Z",
        idRec: "RR123456782024011510056892226",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteLocrecIdIdRec: {
    200: [
      {
        id: 12069,
        location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
        criacao: "2023-12-20T12:38:28.774Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetLoc: {
    200: [
      {
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
            location: "pix.example.com/qr/v2/cobv/2353c790eefb11eaadc10242ac120002",
            tipoCob: "cobv",
            criacao: "2020-03-11T21:19:51.013Z",
          },
          {
            id: 856,
            txid: "31e08604f9ce459bb59672332af8d672",
            location: "pix.example.com/qr/v2/cobv/39c9f435c6324867aa1dec1260e1127c",
            tipoCob: "cobv",
            criacao: "2020-02-10T19:22:52.013Z",
          },
          {
            id: 2316,
            txid: "eb9d87f36fca4c92b7d5ec48e2ee3853",
            location: "pix.example.com/qr/v2/a8534e273ecb47d3ac30613104544466",
            tipoCob: "cob",
            criacao: "2020-05-31T19:39:54.013Z",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostLoc: {
    201: [
      {
        id: 7716,
        location: "pix.example.com/qr/v2/2353c790eefb11eaadc10242ac120002",
        tipoCob: "cob",
        criacao: "2020-03-11T21:19:51.013Z",
      },
      {
        id: 856,
        location: "pix.example.com/qr/v2/cobv/39c9f435c6324867aa1dec1260e1127c",
        tipoCob: "cobv",
        criacao: "2020-02-10T19:22:52.013Z",
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/PayloadLocationOperacaoInvalida",
        title: "PayloadLocation inválido.",
        status: 400,
        detail:
          "A presente requisição busca criar uma location sem respeitar o _schema_ estabelecido.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetLocId: {
    200: [
      {
        id: 7716,
        txid: "fda9460fe04e4f129b72863ae57ee22f",
        location: "pix.example.com/qr/v2/cobv/2353c790eefb11eaadc10242ac120002",
        tipoCob: "cobv",
        criacao: "2020-03-11T21:19:51.013Z",
      },
      {
        id: 856,
        txid: "31e08604f9ce459bb59672332af8d672",
        location: "pix.example.com/qr/v2/cobv/39c9f435c6324867aa1dec1260e1127c",
        tipoCob: "cobv",
        criacao: "2020-02-10T19:22:52.013Z",
      },
      {
        id: 2316,
        txid: "eb9d87f36fca4c92b7d5ec48e2ee3853",
        location: "pix.example.com/qr/v2/a8534e273ecb47d3ac30613104544466",
        tipoCob: "cob",
        criacao: "2020-05-31T19:39:54.013Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteLocIdTxid: {
    200: [
      {
        id: 2316,
        location: "pix.example.com/qr/v2/a8534e273ecb47d3ac30613104544466",
        tipoCob: "cob",
        criacao: "2020-05-31T19:39:54.013Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetPixE2eid: {
    200: [
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
        endToEndId: "E12345678202009091221ghijk78901234",
        txid: "5b933948f3224266b1050ac54319e775",
        valor: "200.00",
        horario: "2020-09-10T13:03:33.902Z",
        infoPagador: "Revisão do carro",
      },
      {
        endToEndId: "E88631478202009091221ghijk78901234",
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
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetPix: {
    200: [
      {
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
            endToEndId: "E12345678202009091221ghijk78901234",
            txid: "5b933948f3224266b1050ac54319e775",
            valor: "200.00",
            horario: "2020-09-10T13:03:33.902Z",
            infoPagador: "Revisão do carro",
          },
          {
            endToEndId: "E88631478202009091221ghijk78901234",
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
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetPixE2eidDevolucaoId: {
    200: [
      {
        id: "123456",
        rtrId: "D12345678202009091000abcde123456",
        valor: "7.89",
        horario: {
          solicitacao: "2020-09-11T15:25:59.411Z",
        },
        status: "EM_PROCESSAMENTO",
      },
      {
        id: "502",
        rtrId: "D12345678202011111000fghij789012",
        valor: "20.00",
        horario: {
          solicitacao: "2020-09-11T15:25:59.411Z",
        },
        status: "NAO_REALIZADO",
        motivo: "Negado por timeout",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutPixE2eidDevolucaoId: {
    201: [
      {
        id: "123456",
        rtrId: "D12345678202009091000abcde123456",
        valor: "7.89",
        horario: {
          solicitacao: "2020-09-11T15:25:59.411Z",
        },
        status: "EM_PROCESSAMENTO",
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/PixDevolucaoInvalida",
        title: "Devolução inválida.",
        status: 400,
        detail:
          "A presente requisição de devolução não respeita o _schema_ ou não faz sentido semanticamente.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetPixUrlAccessToken: {
    200: [
      {
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
      {
        calendario: {
          criacao: "2025-11-20T14:22:10.000Z",
          apresentacao: "2025-12-01T09:30:00Z",
          expiracao: 3600,
        },
        txid: "a1b2c3d4e5f6478890abcdef12345678",
        revisao: 3,
        status: "ATIVA",
        valor: {
          original: "750.50",
          modalidadeAlteracao: 0,
        },
        chave: "9f8e7d6c-5b4a-11ee-9a34-0242ac120003",
        solicitacaoPagador: "Informar número do pedido",
        infoAdicionais: [
          {
            nome: "quantidade",
            valor: "2",
          },
          {
            nome: "produto",
            valor: "Assinatura Mensal",
          },
        ],
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "nchsgsgddkgjdhsueyrgkasjdh",
          },
          cbs: {
            informado: {
              valor: "20.00",
              data: "2025-11-20T14:22:10.000Z",
            },
          },
          ibs: {
            informado: {
              valor: "35.25",
              data: "2025-11-20T14:22:10.000Z",
            },
          },
        },
        valorLiquidoEstimado: "695.25",
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobPayloadNaoEncontrado",
        title: "Cobrança não encontrada.",
        status: 404,
        detail: "A cobrança em questão não foi encontrada para a location requisitada.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetCobvPixUrlAccessToken: {
    200: [
      {
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
          cnpj: "58900633120711",
          nome: "Empresa de Abastecimento SA",
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
      {
        calendario: {
          criacao: "2026-06-09T10:00:00.000Z",
          apresentacao: "2026-06-15T18:00:00Z",
          dataDeVencimento: "2026-07-31",
          validadeAposVencimento: 30,
        },
        devedor: {
          cnpj: "92221288310574",
          nome: "Imobiliária Bom Sucesso",
        },
        recebedor: {
          logradouro: "Rua 15 Numero 1200, Bairro São Luiz",
          cidade: "São Paulo",
          uf: "SP",
          cep: "70800100",
          cnpj: "37989000025711",
          nome: "Empresa de Logística SA",
        },
        txid: "d4f7a9b2c3e44f1a9b8c7d6e5f123abc",
        revisao: 3,
        status: "ATIVA",
        valor: {
          original: "200.00",
          multa: "10.00",
          juros: "1.50",
          final: "211.50",
        },
        chave: "b12f3e4a-6c7d-11ee-9a34-0242ac120010",
        solicitacaoPagador: "Informar cartão fidelidade",
        infoAdicionais: [
          {
            nome: "quantidade",
            valor: "2",
          },
        ],
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "oakeir7361u4n538d87ad8aj42jk",
          },
          cbs: {
            informado: {
              valor: "12.00",
              data: "2026-06-09T10:00:00.000Z",
            },
          },
          ibs: {
            informado: {
              valor: "8.50",
              data: "2026-06-09T10:00:00.000Z",
            },
          },
        },
        valorLiquidoEstimado: "179.50",
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobPayloadNaoEncontrado",
        title: "Cobrança não encontrada.",
        status: 404,
        detail: "A cobrança em questão não foi encontrada para a location requisitada.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetRecRecUrlAccessToken: {
    200: [
      {
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
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/RecPayloadOperacaoInvalida",
        title: "Recorrência não encontrada.",
        status: 400,
        detail: "A recorrência em questão encontra-se expirada, cancelada ou rejeitada.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetWebhookChave: {
    200: [
      {
        webhookUrl: "https://pix.example.com/api/webhook/",
        chave: "40a0932d-1918-4eee-845d-35a2da1690dc",
        criacao: "2020-11-11T10:15:00.358Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutWebhookChave: {
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/WebhookOperacaoInvalida",
        title: "Webhook inválido.",
        status: 400,
        detail:
          "A presente requisição busca criar um webhook sem respeitar o _schema_ ou, ainda, com sentido semanticamente inválido.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteWebhookChave: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetWebhook: {
    200: [
      {
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
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetWebhookrec: {
    200: [
      {
        webhookUrl: "https://usuario.recebedor.com/api/webhookrec/",
        criacao: "2023-12-20T12:51:16.485Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutWebhookrec: {
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/WebhookOperacaoInvalida",
        title: "Webhook inválido.",
        status: 400,
        detail:
          "A presente requisição busca criar um webhook sem respeitar o _schema_ ou, ainda, com sentido semanticamente inválido.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteWebhookrec: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetWebhookcobr: {
    200: [
      {
        webhookUrl: "https://usuario.recebedor.com/api/webhookcobr/",
        criacao: "2023-12-20T12:51:16.485Z",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutWebhookcobr: {
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/WebhookOperacaoInvalida",
        title: "Webhook inválido.",
        status: 400,
        detail:
          "A presente requisição busca criar um webhook sem respeitar o _schema_ ou, ainda, com sentido semanticamente inválido.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteWebhookcobr: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetWebhookcob: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutWebhookcob: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteWebhookcob: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetWebhookcobv: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutWebhookcobv: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  DeleteWebhookcobv: {
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetRecIdRec: {
    200: [
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
          location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
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
          },
          {
            data: "2024-01-04T09:40:42.210Z",
            nome: "APROVADA",
          },
        ],
        dadosQR: {
          jornada: "JORNADA_2",
          pixCopiaECola:
            "00020126180014br.gov.bcb.pix5204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002630462C9",
        },
      },
      {
        idRec: "RR7784567820240528123defgh775",
        status: "CRIADA",
        valor: {
          valorRec: "250.00",
        },
        vinculo: {
          contrato: "9612389",
          devedor: {
            cpf: "45832633800",
            nome: "Alfredo Tavares",
          },
          objeto: "Serviços Esportivos",
        },
        calendario: {
          dataFinal: "2028-09-01",
          dataInicial: "2024-02-01",
          periodicidade: "MENSAL",
        },
        politicaRetentativa: "PERMITE_3R_7D",
        pagador: {
          codMun: "1509873",
          cpf: "45832633800",
          ispbParticipante: "52780028",
        },
        recebedor: {
          cnpj: "56958712500811",
          nome: "Academia Saúde",
        },
        atualizacao: [
          {
            data: "2024-01-03T08:30:02.050Z",
            nome: "CRIADA",
          },
        ],
      },
      {
        idRec: "RR1026652320240821lab77511abf",
        status: "CANCELADA",
        valor: {
          valorMinimoRecebedor: "800.00",
        },
        vinculo: {
          contrato: "298620560",
          devedor: {
            cpf: "12600511100",
            nome: "Sebastião Silva",
          },
          objeto: "Faculdade de Engenharia",
        },
        calendario: {
          dataFinal: "2027-09-01",
          dataInicial: "2024-10-01",
          periodicidade: "MENSAL",
        },
        politicaRetentativa: "PERMITE_3R_7D",
        pagador: {
          codMun: "1509873",
          cpf: "12600511100",
          ispbParticipante: "52780028",
        },
        recebedor: {
          cnpj: "61593007802371",
          nome: "Universidade Brasileira",
        },
        encerramento: {
          cancelamento: {
            solicitante: "USUARIO_RECEBEDOR",
            codigo: "SLCR",
            descricao: "Cancelamento solicitado pelo usuário recebedor",
          },
        },
        atualizacao: [
          {
            data: "2024-08-03T08:30:02.050Z",
            nome: "CRIADA",
          },
          {
            data: "2024-09-06T09:11:42.205Z",
            nome: "APROVADA",
          },
          {
            data: "2024-10-06T15:05:33.305Z",
            nome: "CANCELADA",
          },
        ],
        ativacao: {
          tipoJornada: "JORNADA_1",
        },
      },
      {
        idRec: "RN1234567820241203fghijkabcde",
        status: "CRIADA",
        valor: {
          valorRec: "150.00",
        },
        vinculo: {
          contrato: "5582610",
          devedor: {
            cpf: "45164632481",
            nome: "Fulano de Tal",
          },
          objeto: "Serviços de Gestão de Imóveis",
        },
        calendario: {
          dataFinal: "2028-09-01",
          dataInicial: "2025-02-01",
          periodicidade: "MENSAL",
        },
        politicaRetentativa: "NAO_PERMITE",
        loc: {
          criacao: "2024-10-01T10:15:01.115Z",
          id: 2726,
          location: "pix.example.com/qr/v2/rec/94ed2badcbc04c15b0bb7fa353194890",
          idRec: "RN1234567820241203fghijkabcde",
        },
        recebedor: {
          cnpj: "12345678000195",
          nome: "Empresa de Serviços SA",
        },
        atualizacao: [
          {
            data: "2024-12-03T08:30:02.050Z",
            nome: "CRIADA",
          },
        ],
        dadosQR: {
          jornada: "JORNADA_3",
          pixCopiaECola:
            "00020101021226760014br.gov.bcb.pix2554pix.example.com/qr/v2/8b3da2f39a4140d1a91abd93113bd4415204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/94ed2badcbc04c15b0bb7fa35319489063047741",
        },
      },
      {
        idRec: "RN1234567820241130lkwdefghijk",
        status: "CRIADA",
        valor: {
          valorRec: "210.00",
        },
        vinculo: {
          contrato: "11750023",
          devedor: {
            cpf: "75633122216",
            nome: "Francisco da Silva",
          },
          objeto: "Assinatura de Serviços de Transporte",
        },
        calendario: {
          dataFinal: "2026-12-01",
          dataInicial: "2025-03-01",
          periodicidade: "MENSAL",
        },
        politicaRetentativa: "NAO_PERMITE",
        loc: {
          criacao: "2024-05-19T10:28:05.230Z",
          id: 6153,
          location: "pix.example.com/qr/v2/rec/3ffa640fa4f14080adccb949fa2dc0d0",
          idRec: "RN1234567820241130lkwdefghijk",
        },
        recebedor: {
          cnpj: "56989000019533",
          nome: "Empresa de Logística SA",
        },
        atualizacao: [
          {
            data: "2024-11-30T08:30:02.050Z",
            nome: "CRIADA",
          },
        ],
        dadosQR: {
          jornada: "JORNADA_4",
          pixCopiaECola:
            "00020101021226810014br.gov.bcb.pix2559pix.example.com/qr/v2/cobv/1e6c54d3ec9449b7a7fc53b6b0f998e75204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***80800014br.gov.bcb.pix2558pix.example.com/qr/v2/rec/3ffa640fa4f14080adccb949fa2dc0d06304A441",
        },
      },
      {
        idRec: "RR3781267820250201123deabc339",
        status: "CRIADA",
        valor: {
          valorRec: "170.00",
        },
        vinculo: {
          contrato: "1793651",
          devedor: {
            cpf: "01536985566",
            nome: "Fulano de Tal",
          },
          objeto: "Serviços de Telefonia",
        },
        calendario: {
          dataFinal: "2028-03-01",
          dataInicial: "2025-03-01",
          periodicidade: "MENSAL",
        },
        politicaRetentativa: "NAO_PERMITE",
        pagador: {
          codMun: "1509873",
          cpf: "45832633800",
          ispbParticipante: "52780028",
        },
        recebedor: {
          convenio: "Master",
          cnpj: "56958712500811",
          nome: "Academia Saúde",
        },
        atualizacao: [
          {
            data: "2025-02-01T08:30:02.050Z",
            nome: "CRIADA",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PatchRecIdRec: {
    200: [
      {
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
          location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
          idRec: "RN1234567820240115abcdefghijk",
        },
        ativacao: {
          dadosJornada: {
            tipoJornada: "JORNADA_3",
            txid: "33beb661beda44a8928fef47dbeb2dc5",
          },
        },
        atualizacao: [
          {
            data: "2023-12-19T12:28:05.230Z",
            nome: "CRIADA",
          },
        ],
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/RecOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail: "A recorrência não respeita o schema.",
        violacoes: [
          {
            razao: "O campo rec.calendario.dataInicial não respeita o schema.",
            propriedade: "rec.calendario.dataInicial",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetRec: {
    200: [
      {
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
              location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
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
              },
              {
                data: "2024-01-04T09:40:42.210Z",
                nome: "APROVADA",
              },
            ],
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostRec: {
    201: [
      {
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
          location: "pix.example.com/qr/v2/rec/2353c790eefb11eaadc10242ac120002",
          idRec: "RN1234567820240115abcdefghijk",
        },
        ativacao: {
          dadosJornada: {
            tipoJornada: "JORNADA_3",
            txid: "33beb661beda44a8928fef47dbeb2dc5",
          },
        },
        atualizacao: [
          {
            data: "2023-12-19T12:28:05.230Z",
            nome: "CRIADA",
          },
        ],
      },
      {
        idRec: "RR1234567820240115abcdefghijk",
        vinculo: {
          contrato: "998782003",
          devedor: {
            cpf: "02989131415",
            nome: "Beltrano da Silva",
          },
          objeto: "Serviço de Plano de Saúde.",
        },
        calendario: {
          dataInicial: "2024-10-10",
          periodicidade: "ANUAL",
        },
        politicaRetentativa: "PERMITE_3R_7D",
        recebedor: {
          cnpj: "09172302153900",
          nome: "Empresa de Serviços de Saúde SA",
        },
        valor: {
          valorMinimoRecebedor: "5000.00",
        },
        status: "CRIADA",
        atualizacao: [
          {
            data: "2024-01-11T10:27:01.280Z",
            nome: "CRIADA",
          },
        ],
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/RecOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail: "A recorrência não respeita o schema.",
        violacoes: [
          {
            razao: "O campo rec.calendario.dataInicial não respeita o schema.",
            propriedade: "rec.calendario.dataInicial",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostSolicrec: {
    201: [
      {
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
        },
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/SolicRecOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail: "A solicitação de confirmação de recorrência não respeita o schema.",
        violacoes: [
          {
            razao: "O objeto solicrec.destinatario não respeita o schema.",
            propriedade: "solicrec.destinatario",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetSolicrecIdSolicRec: {
    200: [
      {
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
        },
      },
      {
        idSolicRec: "SC875116782024021577820565312",
        idRec: "RR692350012024051502650081069",
        calendario: {
          dataExpiracaoSolicitacao: "2024-12-15T12:17:11.926Z",
        },
        status: "REJEITADA",
        destinatario: {
          agencia: "1179",
          conta: "73851",
          cpf: "07031470825",
          ispbParticipante: "91193552",
        },
        atualizacao: [
          {
            data: "2024-12-15T12:18:18.618Z",
            status: "CRIADA",
          },
          {
            data: "2024-12-15T16:18:18.618Z",
            status: "ENVIADA",
          },
          {
            data: "2024-12-16T08:50:18.268Z",
            status: "REJEITADA",
          },
        ],
        recPayload: {
          idRec: "RR692350012024051502650081069",
          vinculo: {
            contrato: "Assinatura Individual",
            devedor: {
              cpf: "07031470825",
              nome: "Sebastião Silva",
            },
            objeto: "Serviços de Entrega de Alimentos",
          },
          valor: {
            valorMinimoRecebedor: "300.00",
          },
          calendario: {
            dataFinal: "2025-05-01",
            dataInicial: "2024-12-01",
            periodicidade: "MENSAL",
          },
          recebedor: {
            cnpj: "25603926517008",
            nome: "Empresa de Produtos Alimentícios SA",
          },
          atualizacao: [
            {
              data: "2023-12-08T16:24:35.233Z",
              status: "CRIADA",
            },
          ],
        },
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PatchSolicrecIdSolicRec: {
    201: [
      {
        idSolicRec: "SC876456782024021577825445312",
        idRec: "RN123456782024011577825445612",
        calendario: {
          dataExpiracaoSolicitacao: "2024-06-11T07:17:11.008Z",
        },
        status: "CANCELADA",
        destinatario: {
          agencia: "2569",
          conta: "550689",
          cpf: "15231470190",
          ispbParticipante: "91193552",
        },
        atualizacao: [
          {
            data: "2024-05-16T17:01:06.781Z",
            status: "CRIADA",
          },
          {
            data: "2024-05-30T10:18:18.618Z",
            status: "CANCELADA",
          },
        ],
        recPayload: {
          idRec: "RN123456782024011577825445612",
          vinculo: {
            contrato: "Banda Larga Fibra Ótica",
            devedor: {
              cpf: "15231470190",
              nome: "Fulano de Tal",
            },
            objeto: "Serviços de Telecomunicações",
          },
          valor: {
            valorRec: "1200.09",
          },
          calendario: {
            dataFinal: "2025-05-01",
            dataInicial: "2024-05-01",
            periodicidade: "MENSAL",
          },
          recebedor: {
            cnpj: "94370926517368",
            nome: "Empresa de Serviços SA",
          },
          atualizacao: [
            {
              data: "2023-12-08T16:24:35.233Z",
              status: "CRIADA",
            },
          ],
        },
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/SolicRecOperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail:
          "Não é possível cancelar uma solicitação de recorrência com o status diferente de CRIADA ou RECEBIDA.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetCobrTxid: {
    200: [
      {
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
          },
          {
            dataLiquidacao: "2024-06-24",
            tipo: "NTAG",
            endToEndId: "E12345678202406201221abcdef12345",
            status: "AGENDADA",
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
      {
        idRec: "RN985156112024071999000566354",
        txid: "517bd858b59d458a841280b0f0a60bfa",
        calendario: {
          criacao: "2024-05-20",
          dataDeVencimento: "2024-06-20",
        },
        valor: {
          original: "210.00",
        },
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "xjsjjfhasjhu821412ad7dajjqwfjjjvvjj",
          },
          cbs: {
            informado: {
              valor: "7.35",
              data: "2024-05-20T14:47:29.470Z",
            },
          },
          ibs: {
            informado: {
              valor: "14.70",
              data: "2024-05-20T14:47:29.470Z",
            },
          },
        },
        valorLiquidoEstimado: "187.95",
        status: "CANCELADA",
        politicaRetentativa: "NAO_PERMITE",
        ajusteDiaUtil: true,
        devedor: {
          cep: "26901340",
          cidade: "São Luís",
          email: "fulano.tal@mail.com",
          logradouro: "Alameda Cardoso 1007",
          uf: "MA",
        },
        recebedor: {
          cnpj: "31166575201770",
          conta: "107262",
          nome: "Empresa de Telecomunicações SA",
          tipoConta: "POUPANÇA",
        },
        tentativas: [
          {
            dataLiquidacao: "2024-06-20",
            tipo: "AGND",
            endToEndId: "E12345678202406201221abcdef12345",
            status: "CANCELADA",
          },
        ],
        encerramento: {
          cancelamento: {
            solicitante: "USUARIO_RECEBEDOR",
            codigo: "SLCR",
            descricao: "Cancelamento de agendamento solicitado pelo usuário recebedor",
          },
        },
        atualizacao: [
          {
            data: "2024-05-20T14:47:29.470Z",
            status: "CRIADA",
          },
          {
            data: "2024-05-21T10:18:20.120Z",
            status: "ATIVA",
          },
          {
            data: "2024-05-26T10:18:20.120Z",
            status: "CANCELADA",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PutCobrTxid: {
    201: [
      {
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
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail: "A cobrança não respeita o schema.",
        violacoes: [
          {
            razao: "O objeto cobr.calendario não respeita o schema.",
            propriedade: "cobr.calendario",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PatchCobrTxid: {
    200: [
      {
        idRec: "RN985156112024071999000566354",
        txid: "517bd858b59d458a841280b0f0a60bfa",
        calendario: {
          criacao: "2024-05-20",
          dataDeVencimento: "2024-06-20",
        },
        valor: {
          original: "210.00",
        },
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "xjsjjfhasjhu821412ad7dajjqwfjjjvvjj",
          },
          cbs: {
            informado: {
              valor: "7.35",
              data: "2024-05-20T14:47:29.470Z",
            },
          },
          ibs: {
            informado: {
              valor: "14.70",
              data: "2024-05-20T14:47:29.470Z",
            },
          },
        },
        valorLiquidoEstimado: "187.95",
        status: "CANCELADA",
        politicaRetentativa: "NAO_PERMITE",
        ajusteDiaUtil: true,
        devedor: {
          cep: "26901340",
          cidade: "São Luís",
          email: "fulano.tal@mail.com",
          logradouro: "Alameda Cardoso 1007",
          uf: "MA",
        },
        recebedor: {
          cnpj: "31166575201770",
          conta: "107262",
          nome: "Empresa de Telecomunicações SA",
          tipoConta: "POUPANÇA",
        },
        tentativas: [
          {
            dataLiquidacao: "2024-06-20",
            tipo: "AGND",
            endToEndId: "E12345678202406201221abcdef12345",
            status: "CANCELADA",
          },
        ],
        encerramento: {
          cancelamento: {
            solicitante: "USUARIO_RECEBEDOR",
            codigo: "SLCR",
            descricao: "Cancelamento de agendamento solicitado pelo usuário recebedor",
          },
        },
        atualizacao: [
          {
            data: "2024-05-20T14:47:29.470Z",
            status: "CRIADA",
          },
          {
            data: "2024-05-21T10:18:20.120Z",
            status: "ATIVA",
          },
          {
            data: "2024-05-26T10:18:20.120Z",
            status: "CANCELADA",
          },
        ],
      },
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail:
          "Não é possível cancelar uma cobrança em uma data igual ou maior que a data prevista da primeira tentativa de liquidação.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  GetCobr: {
    200: [
      {
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
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostCobr: {
    201: [
      {
        idRec: "RR1234567820240115abcdefghijk",
        txid: "3136957d93134f2184b369e8f1c0729d",
        infoAdicional: "Serviços de Streamming de Música e Filmes.",
        calendario: {
          criacao: "2024-04-01",
          dataDeVencimento: "2024-04-15",
        },
        status: "CRIADA",
        valor: {
          original: "106.07",
        },
        tributo: {
          documentoFiscal: {
            chaveDeAcesso: "wwkfkjkjknccxbvzfafaf727652jdjdjss",
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
    ],
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
        title: "Operação inválida.",
        status: 400,
        detail: "A cobrança não respeita o schema.",
        violacoes: [
          {
            razao: "O objeto cobr.calendario não respeita o schema.",
            propriedade: "cobr.calendario",
          },
        ],
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
  PostCobrTxidRetentativaData: {
    201: [
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
          },
          {
            dataLiquidacao: "2024-06-24",
            tipo: "NTAG",
            endToEndId: "E12345678202406201221abcdef12345",
            status: "AGENDADA",
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
    400: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/CobROperacaoInvalida",
        title: "Cobrança não encontrada.",
        status: 400,
        detail: "A política configurada na recorrência não permite retentativa de cobrança.",
      },
    ],
    403: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/AcessoNegado",
        title: "Acesso Negado",
        status: 403,
        detail: "Requisição de participante autenticado que viola alguma regra de autorização.",
      },
    ],
    404: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/NaoEncontrado",
        title: "Não Encontrado",
        status: 404,
        detail: "Entidade não encontrada.",
      },
    ],
    503: [
      {
        type: "https://pix.bcb.gov.br/api/v2/error/ServicoIndisponivel",
        title: "Serviço Indisponível",
        status: 503,
        detail:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
      },
    ],
  },
};
