/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * OpenAPI → JSON Schema contracts used by the ajv contract tests (test-only data module).
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

/** Shape of a generated JSON Schema object. */
export type JsonSchema = Record<string, unknown>;

/** Per-operation request/response contracts keyed by generated operation name. */
export interface OperationAjvContract {
  readonly pathParams: JsonSchema;
  readonly queryParams: JsonSchema;
  readonly requestBody: JsonSchema | null;
  readonly responses: Readonly<Record<string, JsonSchema | null>>;
}

/** The complete spec-derived contract bundle. */
export interface OpenApiAjvContracts {
  readonly schemaId: string;
  readonly definitions: Readonly<Record<string, JsonSchema>>;
  readonly operations: Readonly<Record<string, OperationAjvContract>>;
}

export const OPENAPI_CONTRACTS: OpenApiAjvContracts = {
  schemaId: "https://pix-sdk.br/spec/openapi.json",
  definitions: {
    TxId: {
      type: "string",
      title: "Id da Transação",
      description:
        "# Identificador da transação\n\nO campo `txid` determina o identificador da transação.\nO objetivo desse campo é ser um elemento que possibilite ao PSP do recebedor apresentar ao usuário recebedor a funcionalidade de conciliação de pagamentos.\n\nNa pacs.008, é referenciado como `TransactionIdentification <txId>` ou `idConciliacaoRecebedor`.\n\nEm termos de fluxo de funcionamento, o txid é lido pelo aplicativo do PSP do pagador e, \ndepois de confirmado o pagamento, é enviado para o SPI via pacs.008. \nUma pacs.008 também é enviada ao PSP do recebedor, contendo, além de todas as informações usuais \ndo pagamento, o txid.\nAo perceber um recebimento dotado de txid, o PSP do recebedor está apto a se comunicar com o usuário recebedor, \ninformando que um pagamento específico foi liquidado.\n\nO txid é criado exclusivamente pelo usuário recebedor e está sob sua responsabilidade.\nO txid, no contexto de representação de uma cobrança, é único por CPF/CNPJ do usuário recebedor. Cabe ao \nPSP recebedor validar essa regra na API Pix.\n",
      pattern: "[a-zA-Z0-9]{26,35}",
    },
    EndToEndId: {
      type: "string",
      title: "Id fim a fim da transação",
      description: "EndToEndIdentification que transita na PACS002, PACS004 e PACS008",
      minLength: 32,
      maxLength: 32,
      pattern: "[a-zA-Z0-9]{32}",
    },
    DevolucaoId: {
      type: "string",
      title: "Id da Devolução",
      description: "Id gerado pelo cliente para representar unicamente uma devolução.",
      pattern: "[a-zA-Z0-9]{1,35}",
    },
    DevolucaoSolicitadaNatureza: {
      type: "string",
      title: "Natureza da Devolução Solicitada",
      description:
        "Indica qual é a natureza da devolução solicitada. Uma solicitação de devolução pelo usuário recebedor pode ser relacionada a um Pix\n comum (com código: `MD06` da pacs.004), ou a um Pix de Saque ou Troco (com códigos possíveis: `MD06` e `SL02` da pacs.004). Na ausência \n deste campo a natureza deve ser interpretada como sendo de um Pix comum (`ORIGINAL`).\n\nAs naturezas são assim definidas:\n- `ORIGINAL`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix comum ou ao valor da compra em um Pix Troco (`MD06`);\n- `RETIRADA`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix Saque ou ao valor do troco em um Pix Troco (`SL02`).\n\nOs valores de devoluções são sempre limitados aos valores máximos a seguir:\n- Pix comum: o valor da devolução é limitado ao valor do próprio Pix (a natureza nesse caso deve ser: ORIGINAL);\n- Pix Saque: o valor da devolução é limitado ao valor da retirada (a natureza nesse caso deve ser: RETIRADA); e\n- Pix Troco: o valor da devolução é limitado ao valor relativo à compra ou ao troco:\n  - Quando a devolução for referente à compra, o valor limita-se ao valor da compra (a natureza nesse caso deve ser ORIGINAL); e\n  - Quando a devolução for referente ao troco, o valor limita-se ao valor do troco (a natureza nesse caso deve ser RETIRADA).\n",
      enum: ["ORIGINAL", "RETIRADA"],
    },
    DevolucaoNatureza: {
      type: "string",
      title: "Natureza da Devolução",
      description:
        "Indica qual é a natureza da devolução. Uma devolução pode ser relacionada a um Pix comum (com códigos possíveis: `MD06`, `BE08` e `FR01` da pacs.004 e `REFU` da pacs.008), \nou a um Pix de Saque ou Troco (com códigos possíveis:  `MD06` e `SL02` da pacs.004). Na ausência deste campo a natureza deve ser interpretada como \nsendo de um Pix comum (`ORIGINAL`).\n\nAs naturezas são assim definidas:\n  - `ORIGINAL`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix comum ou ao valor da compra em um Pix Troco (`MD06`);\n  - `RETIRADA`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix Saque ou ao valor do troco em um Pix Troco (`SL02`);\n  - `MED_OPERACIONAL`: quando a devolução ocorre no âmbito do MED por motivo de falha operacional e se refere a um Pix comum (`BE08`);\n  - `MED_FRAUDE`: quando a devolução ocorre no âmbito do MED por fundada suspeita de fraude e se refere a um Pix comum (`FR01`).\n  - `MED_PIX_AUTOMATICO` (em desuso - será removido na próxima major release): reembolso total ou parcial ao participante do usuário pagador no âmbito do MED (Mecanismo Especial de Devolução) para o Pix Automático pela utilização de recursos próprios para ressarcimento do usuário pagador.(`REFU`);\n\nOs valores de devoluções são sempre limitados aos valores máximos a seguir:\n- Pix comum: o valor da devolução é limitado ao `valor` do próprio Pix (a natureza nesse caso pode ser: ORIGINAL, MED_OPERACIONAL ou MED_FRAUDE);\n- Pix Saque: o valor da devolução é limitado ao valor da retirada (a natureza nesse caso deve ser: RETIRADA); e\n- Pix Troco: o valor da devolução é limitado ao valor relativo à compra ou ao troco:\n  - Quando a devolução for referente à compra, o valor limita-se ao valor da compra (a natureza nesse caso deve ser ORIGINAL); e\n  - Quando a devolução for referente ao troco, o valor limita-se ao valor do troco (a natureza nesse caso deve ser RETIRADA).\n",
      enum: ["ORIGINAL", "RETIRADA", "MED_OPERACIONAL", "MED_FRAUDE", "MED_PIX_AUTOMATICO"],
    },
    DevolucaoNaturezaPixAutomatico: {
      type: "string",
      title: "Natureza da Devolução",
      description:
        "Indica qual é a natureza da devolução. Uma devolução pode ser relacionada a um Pix comum (com códigos possíveis: `MD06` e `FR01` da pacs.004 e `REFU` da pacs.008). Na ausência deste campo a natureza deve ser interpretada como \nsendo de um Pix comum (`ORIGINAL`).\n\nAs naturezas são assim definidas:\n  - `ORIGINAL`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix comum (`MD06`);\n  - `MED_FRAUDE`: quando a devolução ocorre no âmbito do MED (Mecanismo Especial de Devolução) por fundada suspeita de fraude e se refere a um Pix comum (`FR01`).\n  - `MED_PIX_AUTOMATICO` (em desuso - será removido na próxima major release): reembolso total ou parcial ao participante do usuário pagador no âmbito do MED (Mecanismo Especial de Devolução) para o Pix Automático pela utilização de recursos próprios para ressarcimento do usuário pagador.(`REFU`);\n\nOs valores de devoluções são sempre limitados aos valores máximos a seguir:\n- Pix comum: o valor da devolução é limitado ao `valor` do próprio Pix (a natureza nesse caso pode ser: ORIGINAL, MED_PIX_AUTOMATICO ou MED_FRAUDE);\n",
      enum: ["ORIGINAL", "MED_PIX_AUTOMATICO", "MED_FRAUDE"],
    },
    PayloadLocationId: {
      type: "integer",
      format: "int64",
      title: "Id da location",
      description: "Identificador da location a ser informada na criação da cobrança .",
    },
    PayloadLocationRecId: {
      type: "integer",
      format: "int64",
      title: "Id da location",
      description: "Identificador da location a ser informada na criação de uma recorrência .",
    },
    Revisao: {
      type: "integer",
      format: "int32",
      title: "Revisão",
      description:
        "# O campo `revisao`\n\nDenota a revisão da cobrança.  Sempre começa em zero. Sempre varia em acréscimos de 1.\n\nO incremento em uma cobrança deve ocorrer sempre que um objeto da cobrança em questão for alterado.\nO campo `loc` é uma exceção a esta regra.\n\nSe em uma determinada alteração em uma cobrança, o único campo alterado for o campo `loc`,\nentão esta operação não incrementa a revisão da cobrança.\n\nO campo `loc` não ocasiona uma alteração na cobrança em si.\nNão é necessário armazenar histórico das alterações do campo `loc` para uma determinada cobrança.\nPara os outros campos da cobrança, registra-se histórico.\n",
    },
    PessoaFisica: {
      type: "object",
      title: "Pessoa Física",
      properties: {
        cpf: {
          type: "string",
          title: "CPF",
          description: "CPF do usuário.",
          pattern: "^\\d{11}$",
        },
        nome: {
          type: "string",
          title: "Nome",
          description: "Nome do usuário.",
          maxLength: 200,
        },
      },
      required: ["cpf", "nome"],
    },
    PessoaJuridica: {
      type: "object",
      title: "Pessoa Jurídica",
      properties: {
        cnpj: {
          type: "string",
          title: "CNPJ",
          description: "CNPJ do usuário.",
          pattern: "^[0-9A-Z]{14}$",
        },
        nome: {
          type: "string",
          title: "Nome",
          description: "Nome do usuário.",
          maxLength: 200,
        },
      },
      required: ["cnpj", "nome"],
    },
    PessoaFisicaRecorrencia: {
      type: "object",
      title: "Pessoa Física",
      properties: {
        cpf: {
          type: "string",
          title: "CPF",
          description: "CPF do usuário.",
          pattern: "^\\d{11}$",
        },
        nome: {
          type: "string",
          title: "Nome",
          description: "Nome do usuário.",
          maxLength: 140,
        },
      },
      required: ["cpf", "nome"],
    },
    PessoaJuridicaRecorrencia: {
      type: "object",
      title: "Pessoa Jurídica",
      properties: {
        cnpj: {
          type: "string",
          title: "CNPJ",
          description: "CNPJ do usuário.",
          pattern: "^[0-9A-Z]{14}$",
        },
        nome: {
          type: "string",
          title: "Nome",
          description: "Nome do usuário.",
          maxLength: 140,
        },
      },
      required: ["cnpj", "nome"],
    },
    CPF: {
      type: "object",
      title: "Pessoa Física",
      properties: {
        cpf: {
          type: "string",
          title: "CPF",
          description: "CPF do usuário.",
          pattern: "^\\d{11}$",
        },
      },
      required: ["cpf"],
    },
    CNPJ: {
      type: "object",
      title: "Pessoa Jurídica",
      properties: {
        cnpj: {
          type: "string",
          title: "CNPJ",
          description: "CNPJ do usuário.",
          pattern: "^[0-9A-Z]{14}$",
        },
      },
      required: ["cnpj"],
    },
    DadosComplementaresPessoa: {
      type: "object",
      properties: {
        logradouro: {
          type: "string",
          title: "Logradouro",
          description: "Logradouro do usuário.",
          maxLength: 200,
        },
        cidade: {
          type: "string",
          title: "Cidade",
          description: "Cidade do usuário.",
          maxLength: 200,
        },
        uf: {
          type: "string",
          title: "UF",
          description: "UF do usuário.",
          maxLength: 2,
        },
        cep: {
          type: "string",
          title: "CEP",
          description: "CEP do usuário.",
          maxLength: 8,
        },
      },
    },
    DadosDevedor: {
      type: "object",
      properties: {
        devedor: {
          description: "O objeto devedor organiza as informações sobre o devedor da cobrança.",
          allOf: [
            {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  title: "Email",
                  description: "Email do usuário.",
                },
              },
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosComplementaresPessoa",
            },
          ],
          oneOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
            },
          ],
        },
      },
    },
    DadosDevedorRecorrencia: {
      type: "object",
      properties: {
        devedor: {
          description: "O objeto devedor organiza as informações sobre o devedor da recorrência.",
          allOf: [
            {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  title: "Email",
                  description: "Email do usuário.",
                },
              },
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosComplementaresPessoa",
            },
          ],
        },
      },
    },
    DadosRecebedor: {
      type: "object",
      properties: {
        recebedor: {
          description: "O objeto recebedor organiza as informações sobre o credor da cobrança.",
          allOf: [
            {
              required: ["logradouro", "cidade", "uf", "cep"],
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosComplementaresPessoa",
            },
          ],
          oneOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
            },
            {
              type: "object",
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
                },
                {
                  type: "object",
                  properties: {
                    nomeFantasia: {
                      type: "string",
                      title: "Nome fantasia",
                      description: "Nome fantasia.",
                      maxLength: 200,
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
    DadosBancarios: {
      type: "object",
      properties: {
        conta: {
          type: "string",
          title: "Conta do Usuário Pagador",
          description: "Número da conta do usuário pagador.",
          maxLength: 20,
        },
        ispbParticipante: {
          type: "string",
          title: "ISPB do usuário pagador.",
          description: "ISPB do usuário pagador.",
          pattern: "^[0-9A-Z]{8}$",
        },
        agencia: {
          type: "string",
          title: "Agência do Usuário Pagador",
          description: "Número da agência do usuário pagador.",
          maxLength: 4,
        },
      },
      required: ["conta", "ispbParticipante"],
    },
    DadosBancariosRecebedor: {
      type: "object",
      properties: {
        conta: {
          type: "string",
          description: "Número da conta do usuário recebedor.",
          maxLength: 20,
        },
        tipoConta: {
          type: "string",
          title: "Tipo da conta do usuário recebedor",
          description: "Tipo da conta do usuário recebedor.",
          enum: ["CORRENTE", "POUPANCA", "PAGAMENTO"],
        },
        agencia: {
          type: "string",
          description: "Número da agência do usuário recebedor.",
          maxLength: 4,
        },
      },
      required: ["conta", "tipoConta"],
    },
    DadosPagadorRec: {
      type: "object",
      title: "Dados do Pagador",
      properties: {
        pagador: {
          allOf: [
            {
              type: "object",
              properties: {
                ispbParticipante: {
                  type: "string",
                  title: "ISPB do PSP pagador.",
                  description: "ISPB do PSP pagador.",
                  pattern: "^[0-9A-Z]{8}$",
                },
              },
              required: ["ispbParticipante"],
            },
            {
              type: "object",
              properties: {
                codMun: {
                  type: "string",
                  title: "Código do município",
                  description:
                    "Código baseado na Tabela de Códigos de Municípios do __[IBGE](https://www.ibge.gov.br/explica/codigos-dos-municipios.php)__ que apresenta a lista dos municípios brasileiros associados a um código composto de 7 dígitos, sendo os dois primeiros referentes ao código da Unidade da Federação.\n",
                  pattern: "^\\d{7}$",
                },
              },
            },
          ],
          oneOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CPF",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CNPJ",
            },
          ],
        },
      },
    },
    WebhookSolicitado: {
      type: "object",
      title: "Webhook",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookCompleto: {
      type: "object",
      title: "Webhook",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
        },
        cnpj: {
          type: "string",
          title: "CNPJ",
          description:
            "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
          pattern: "^[0-9A-Z]{14}$",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.",
        },
      },
      required: ["webhookUrl", "cnpj", "criacao"],
    },
    WebhookRecBase: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookRecCompleto: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookCobRCompleto: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookCobCompleto: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookCobVSolicitado: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookCobVCompleto: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.",
        },
      },
      required: ["webhookUrl"],
    },
    InfoBaseAgenciaConta: {
      type: "object",
      title: "Informações de Agência e Conta",
      properties: {
        agencia: {
          type: "string",
          title: "Agência",
          description: "Número da agência do usuário.",
          maxLength: 4,
        },
        conta: {
          type: "string",
          title: "Conta Corrente",
          description: "Número da conta do usuário.",
          maxLength: 20,
        },
      },
      required: ["agencia", "conta"],
    },
    InfoBaseChave: {
      type: "object",
      title: "Informação de Chave DICT",
      properties: {
        tipo: {
          type: "string",
          title: "Tipo do Objeto",
          enum: ["pix"],
        },
        chave: {
          type: "string",
          title: "Chave DICT do recebedor",
          description:
            '# Formato do campo chave\n\n* O campo chave determina a chave Pix registrada no DICT que será utilizada para a cobrança. Essa chave será lida pelo aplicativo do PSP do pagador para consulta ao DICT, que retornará a informação que identificará o recebedor da cobrança.\n* Os tipos de chave podem ser: telefone, e-mail, cpf/cnpj ou EVP.\n* O formato das chaves pode ser encontrado na seção "Formatação das chaves do DICT no BR Code" do [Manual de Padrões para iniciação do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).\n',
          maxLength: 77,
        },
      },
      required: ["tipo", "chave"],
    },
    WebhookRecSolicitado: {
      type: "object",
      title: "Webhook Solicitado",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookRecBase",
        },
      ],
    },
    WebhookCobRSolicitado: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
      },
      required: ["webhookUrl"],
    },
    WebhookCobSolicitado: {
      type: "object",
      title: "Webhook Base",
      properties: {
        webhookUrl: {
          type: "string",
          format: "uri",
          title: "URL Webhook",
        },
      },
      required: ["webhookUrl"],
    },
    CobExpiracao: {
      type: "object",
      title: "Expiração",
      properties: {
        expiracao: {
          type: "integer",
          format: "int32",
          title: "Tempo de vida da cobrança, especificado em segundos.",
          description:
            "Tempo de vida da cobrança, especificado em segundos a partir da data de criação (Calendario.criacao)\n",
          default: "86400",
        },
      },
    },
    CobDataDeVencimento: {
      type: "object",
      title: "Data de Vencimento",
      properties: {
        dataDeVencimento: {
          type: "string",
          format: "date",
          title: "Data de vencimento da cobrança",
          description:
            "Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. É a data de vencimento da cobrança. A cobrança pode ser honrada até esse dia, inclusive, em qualquer horário do dia.",
        },
        validadeAposVencimento: {
          type: "integer",
          format: "int32",
          title: "Validade após vencimento",
          description:
            "Trata-se da quantidade de dias corridos após calendario.dataDeVencimento,\nem que a cobrança poderá ser paga.\n\nSempre que a data de vencimento cair em um fim de semana ou em um feriado para o usuário pagador,\n ela deve ser automaticamente prorrogada para o primeiro dia útil subsequente. Todos os campos \n que façam referência a esta data (`validadeAposVencimento`; `desconto`; `juros` e `multa`) devem assumir \n essa prorrogação, quando for o caso.\n\nPara ilustrar o funcionamento, seguem alguns exemplos, onde:\n- ``(#)`` representa a data de vencimento;\n- ``(*)`` representa a data ajustada em função de dias não úteis;\n- os ``(<número>)`` correspondem aos dias adicionais de validade para o pagamento.\n\nExemplo A:\n\n```txt\ndataDeVencimento: 2020-10-20, terça-feira.\nvalidadeAposVencimento: 4\n\nTenta-se pagar no dia 2020-10-20, terça: aceito. (#)(*)\nTenta-se pagar no dia 2020-10-21, quarta: aceito. (1)\nTenta-se pagar no dia 2020-10-22, quinta: aceito. (2)\nTenta-se pagar no dia 2020-10-23, sexta: aceito. (3)\nTenta-se pagar no dia 2020-10-24, sábado: aceito. \nTenta-se pagar no dia 2020-10-25, domingo: aceito. (Feriado)\nTenta-se pagar no dia 2020-10-26, segunda: aceito. (4)\nTenta-se pagar no dia 2020-10-27, terça: negado.\n```\n\nExemplo B:\n\n```txt\ndataDeVencimento: 2020-12-25, sexta-feira, feriado.\nvalidadeAposVencimento: 0\n\nTenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)\nTenta-se pagar no dia 2020-12-26, sábado: aceito.\nTenta-se pagar no dia 2020-12-27, domingo: aceito.\nTenta-se pagar no dia 2020-12-28, segunda: aceito. (*)\nTenta-se pagar no dia 2020-12-29, terça: negado.\n```\n\nExemplo C:\n\n```txt\ndataDeVencimento: 2020-12-25, sexta-feira, feriado.\nvalidadeAposVencimento: 1\n\nTenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)\nTenta-se pagar no dia 2020-12-26, sábado: aceito.\nTenta-se pagar no dia 2020-12-27, domingo: aceito.\nTenta-se pagar no dia 2020-12-28, segunda: aceito. (*)\nTenta-se pagar no dia 2020-12-29, terça: aceito. (1)\nTenta-se pagar no dia 2020-12-30, quarta: negado.\n```\n\nExemplo D:\n\n```txt\ndataDeVencimento: 2020-12-25, sexta-feira, feriado.\nvalidadeAposVencimento: 3\n\nTenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)\nTenta-se pagar no dia 2020-12-26, sábado: aceito.\nTenta-se pagar no dia 2020-12-27, domingo: aceito.\nTenta-se pagar no dia 2020-12-28, segunda: aceito. (*)\nTenta-se pagar no dia 2020-12-29, terça: aceito. (1)\nTenta-se pagar no dia 2020-12-30, quarta: aceito. (2)\nTenta-se pagar no dia 2020-12-31, quinta: aceito. (3)\nTenta-se pagar no dia 2021-01-01, sexta: negado.\n```\n\nExemplo E:\n\n```txt\ndataDeVencimento: 2020-12-25, sexta-feira, feriado.\nvalidadeAposVencimento: 4\n\nTenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)\nTenta-se pagar no dia 2020-12-26, sábado: aceito.\nTenta-se pagar no dia 2020-12-27, domingo: aceito.\nTenta-se pagar no dia 2020-12-28, segunda: aceito. (*)\nTenta-se pagar no dia 2020-12-29, terça: aceito. (1)\nTenta-se pagar no dia 2020-12-30, quarta: aceito. (2)\nTenta-se pagar no dia 2020-12-31, quinta: aceito. (3)\nTenta-se pagar no dia 2021-01-01, sexta: aceito. (Feriado)\nTenta-se pagar no dia 2021-01-02, sábado: aceito.\nTenta-se pagar no dia 2021-01-03, domingo: aceito.\nTenta-se pagar no dia 2021-01-04, segunda: aceito. (4)\nTenta-se pagar no dia 2021-01-05, terça: negado. \n```\n\nExemplo F:\n\n```txt\ndataDeVencimento: 2021-08-27, sexta-feira.\nvalidadeAposVencimento: 5\n\nTenta-se pagar no dia 2021-08-27, sexta: aceito. (#)(*)\nTenta-se pagar no dia 2021-08-28, sábado: aceito. (1)\nTenta-se pagar no dia 2021-08-29, domingo: aceito. (2)\nTenta-se pagar no dia 2021-08-30, segunda: aceito. (3)\nTenta-se pagar no dia 2021-08-31, terça: aceito. (4)\nTenta-se pagar no dia 2021-09-01, quarta: aceito. (5)\nTenta-se pagar no dia 2021-09-02, quinta: negado. \n```\n\nExemplo G:\n\n```txt\ndataDeVencimento: 2021-08-28, sábado.\nvalidadeAposVencimento: 5\n\nTenta-se pagar no dia 2021-08-28, sábado: aceito. (#)\nTenta-se pagar no dia 2021-08-29, domingo: aceito. \nTenta-se pagar no dia 2021-08-30, segunda: aceito. (*)\nTenta-se pagar no dia 2021-08-31, terça: aceito. (1)\nTenta-se pagar no dia 2021-09-01, quarta: aceito. (2)\nTenta-se pagar no dia 2021-09-02, quinta: aceito. (3)\nTenta-se pagar no dia 2021-09-03, sexta: aceito. (4)\nTenta-se pagar no dia 2021-09-04, sabado: aceito. \nTenta-se pagar no dia 2021-09-05, domingo: aceito. \nTenta-se pagar no dia 2021-09-06, segunda: aceito. (5) \n```\n",
          default: 30,
        },
      },
      required: ["dataDeVencimento"],
    },
    CobApresentacao: {
      type: "object",
      title: "Apresentação",
      properties: {
        apresentacao: {
          type: "string",
          format: "date-time",
          title: "Timestamp de apresentação do QR Code",
          description:
            "Timestamp que indica o momento em que o payload JSON que representa a cobrança foi recuperado. Ou seja, idealmente, é o momento em que o usuário realizou a captura do QR Code para verificar os dados de pagamento. Respeita o formato definido na RFC 3339.",
        },
      },
      required: ["apresentacao"],
    },
    CobCriacao: {
      type: "object",
      title: "Criação",
      properties: {
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description:
            "Timestamp que indica o momento em que foi criada a cobrança. Respeita o formato definido na RFC 3339.",
        },
      },
      required: ["criacao"],
    },
    CobVValor: {
      type: "object",
      title: "Valor da cobrança com vencimento",
      description: "Valores monetários.",
      properties: {
        original: {
          type: "string",
          title: "Valor",
          description: "Valor original da cobrança.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        multa: {
          type: "object",
          title: "Multa aplicada",
          description: "Multa aplicada à cobrança",
          properties: {
            modalidade: {
              type: "integer",
              format: "int32",
              title: "Modalidade da multa",
              description:
                "##### Modalidade da multa, conforme tabela de domínios.\n<table><tr><th>Descrição</th><th>Domínio</th></tr><tr><td>Valor Fixo</td><td>1</td></tr><tr><td>Percentual</td><td>2</td></tr></table>\n",
              minimum: 1,
              maximum: 2,
            },
            valorPerc: {
              type: "string",
              title: "Valor da multa absoluta",
              description:
                'Multa do documento em valor absoluto ou percentual, conforme "valor.multa.modalidade".',
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["modalidade", "valorPerc"],
        },
        juros: {
          type: "object",
          title: "Juro aplicado",
          description: "Juro aplicado à cobrança",
          properties: {
            modalidade: {
              type: "integer",
              format: "int32",
              title: "Modalidade de juros",
              description:
                "##### Modalidade de juros, conforme tabela de domínios.\n<table><tr><th>Descrição</th><th>Domínio</th></tr><tr><td>Valor (dias corridos)</td><td>1</td></tr><tr><td>Percentual ao dia (dias corridos)</td><td>2</td></tr><tr><td>Percentual ao mês (dias corridos)</td><td>3</td></tr><tr><td>Percentual ao ano (dias corridos)</td><td>4</td></tr><tr><td>Valor (dias úteis)</td><td>5</td></tr><tr><td>Percentual ao dia (dias úteis)</td><td>6</td></tr><tr><td>Percentual ao mês (dias úteis)</td><td>7</td></tr><tr><td>Percentual ao ano (dias úteis)</td><td>8</td></tr></table>\n",
              minimum: 1,
              maximum: 8,
            },
            valorPerc: {
              type: "string",
              title: "Valor",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["modalidade", "valorPerc"],
        },
        abatimento: {
          title: "Abatimento aplicado",
          description: "Abatimento aplicado à cobrança",
          properties: {
            modalidade: {
              type: "integer",
              format: "int32",
              title: "Modalidade de abatimentos",
              description:
                "##### Modalidade de abatimentos, conforme tabela de domínios.\n<table><tr><th>Descrição</th><th>Domínio</th></tr><tr><td>Valor Fixo</td><td>1</td></tr><tr><td>Percentual</td><td>2</td></tr></table>\n",
              minimum: 1,
              maximum: 2,
            },
            valorPerc: {
              type: "string",
              title: "Abatimentos",
              description:
                "Abatimentos ou outras deduções aplicadas ao documento, em valor absoluto ou percentual do valor original do documento.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["modalidade", "valorPerc"],
        },
        desconto: {
          title: "Descontos aplicados",
          description: "Descontos aplicados à cobrança",
          required: ["modalidade"],
          allOf: [
            {
              type: "object",
              properties: {
                modalidade: {
                  type: "integer",
                  format: "int32",
                  title: "Modalidade de descontos",
                  description:
                    "##### Modalidade de desconto, conforme tabela de domínios.\n<table><tr><th>Descrição</th><th>Domínio</th></tr><tr><td>Valor Fixo até a[s] data[s] informada[s]</td><td>1</td></tr><tr><td>Percentual até a data informada</td><td>2</td></tr><tr><td>Valor por antecipação dia corrido</td><td>3</td></tr><tr><td>Valor por antecipação dia útil</td><td>4</td></tr><tr><td>Percentual por antecipação dia corrido</td><td>5</td></tr><tr><td>Percentual por antecipação dia útil</td><td>6</td></tr></table>\n",
                  minimum: 1,
                  maximum: 6,
                },
              },
            },
          ],
          oneOf: [
            {
              type: "object",
              properties: {
                descontoDataFixa: {
                  type: "array",
                  title: "Lista de Descontos",
                  description: "Descontos absolutos aplicados à cobrança.",
                  items: {
                    required: ["data", "valorPerc"],
                    allOf: [
                      {
                        properties: {
                          data: {
                            type: "string",
                            format: "date",
                            title: "Data limite para o desconto absoluto da cobrança",
                            description:
                              'Descontos por pagamento antecipado, com data fixa. Matriz com até três elementos, sendo que cada elemento é composto por um par "data e valorPerc", para estabelecer descontos percentuais ou absolutos, até aquela data de pagamento. Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. A data de desconto obrigatoriamente deverá ser menor ou igual à data de vencimento da cobrança.',
                          },
                        },
                      },
                      {
                        properties: {
                          valorPerc: {
                            type: "string",
                            title: "Valor do desconto absoluto",
                            description:
                              "Desconto em valor absoluto ou percentual por dia, útil ou corrido, conforme valor.desconto.modalidade",
                            pattern: "\\d{1,10}\\.\\d{2}",
                          },
                        },
                      },
                    ],
                  },
                  minItems: 1,
                  maxItems: 3,
                  uniqueItems: true,
                },
              },
            },
            {
              type: "object",
              properties: {
                valorPerc: {
                  type: "string",
                  title: "Abatimentos",
                  description:
                    "Abatimentos ou outras deduções aplicadas ao documento, em valor absoluto ou percentual do valor original do documento.",
                  pattern: "\\d{1,10}\\.\\d{2}",
                },
              },
              required: ["valorPerc"],
            },
          ],
        },
      },
    },
    CobValor: {
      type: "object",
      title: "Valor da cobrança imediata",
      description: "valores monetários referentes à cobrança.",
      properties: {
        original: {
          type: "string",
          title: "Valor",
          description: "Valor original da cobrança.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        modalidadeAlteracao: {
          type: "integer",
          format: "int32",
          title: "Modalidade de alteração",
          description:
            "Trata-se de um campo que determina se o valor final do documento pode ser alterado pelo pagador. Na ausência desse campo, assume-se que não se pode alterar o valor do documento de cobrança, ou seja, assume-se o valor 0. Se o campo estiver presente e com valor 1, então está determinado que o valor final da cobrança pode ter seu valor alterado pelo pagador.",
          minimum: 0,
          maximum: 1,
        },
        retirada: {
          type: "object",
          title: "Informações de retirada",
          description:
            'É uma estrutura opcional relacionada ao conceito de recebimento de numerário. Apenas um agrupamento por vez é permitido, quando há `saque` não há `troco` e vice-versa. \n\nQuando uma cobrança imediata tem uma estrutura de `retirada` ela deixa de ser considerada Pix comum e passa à categoria de Pix Saque ou Pix Troco. \n\nPara que o preenchimento do objeto `retirada` seja considerado válido as seguintes regras se aplicam:\n- os campos `modalidadeAgente` e `prestadorDoServicoDeSaque` são de **preenchimento obrigatório**;\n- quando o `saque` estiver presente a cobrança deve respeitar as seguintes condições:\n  - O campo `valor.original` deve ser preenchido com **valor igual a 0.00 (zero)**;\n  - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).\n- quando o `troco` estiver presente a cobrança deve respeitar as seguintes condições:\n  - O campo `valor.original` deve ser preenchido com **valor maior que 0.00 (zero)**;\n  - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).\n\n**IMPORTANTE**: \n- Quando usados o `saque` ou `troco` não será permitida a alteração do `valor.original` recebido. Na presença de `saque` ou `troco` o recebimento do campo `valor.modalidadeAlteracao` com valor 1 (um) é considerado erro.\n- O campo `modalidadeAgente` é de preenchimento obrigatório tanto para o saque quanto para o troco. No mapeamento do campo da API Pix (AGPSS) para o campo \'modalidadeAgente\', da pacs.008, o domínio a ser considerado é AGFSS.\n\n#### Exemplos válidos:\nConsiderando os campos da estrutura `valor` e o predicado \'presente\' cujo resultado é verdade quando a estrutura apontada é encontrada temos: \n- **uma cobrança com valor fixo** (condições: valor.original > 0 && valor.modalidadeAlteração = 0 && !presente(valor.retirada))\n  ```\n  ...\n  "valor": {\n    "original": "10.00"\n  },\n  ...\n  ```\n- **uma cobrança com valor alterável** (condições: valor.original >= 0.00 && modalidadeAlteração = 1 && !presente(valor.retirada))\n  ```\n  ...\n  "valor": {\n    "original": "10.00",\n    "modalidadeAlteracao": 1\n  },\n  ```\n- **saque com valor fixo** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor > 0 && valor.retirada.saque.modalidadeAlteracao = 0)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **saque com valor alterável** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor >= 0 && valor.retirada.saque.modalidadeAlteracao = 1)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAlteracao": 1,\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **cobrança com troco fixo** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor > 0 && valor.retirada.troco.modalidadeAlteracao = 0)\n  ```\n  ...\n  "valor": {\n    "original": "10.00",\n    "retirada": {\n      "troco": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGTEC",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **cobrança com troco alterável** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor >= 0 && valor.retirada.troco.modalidadeAlteracao = 1)\n  ```\n  ...\n    "valor": {\n      "original": "10.00",\n      "retirada": {\n        "troco": {\n          "valor": "0.00",\n          "modalidadeAlteracao": 1,\n          "modalidadeAgente": "AGTEC",\n          "prestadorDoServicoDeSaque": "12345678"\n        }\n      }\n    },\n  ...\n  ```\n#### Exemplos inválidos:\nAbaixo alguns exemplos que **não são válidos**. Convém observar que esta listagem não tem pretensão de ser completa, sendo tão somente uma referência para alguns erros possíveis.\n- **saque sem `modalidadeAgente` e `prestadorDoServicoDeSaque`** \n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00"\n      }\n    }\n  },\n  ...\n  ```\n- **cobrança com saque e troco juntos** (não pode ter os dois ao mesmo tempo)\n  ```\n  ...\n  "valor": {\n    "original": "100.00",\n    "retirada": {\n      "saque": {\n        "valor": "50.00",\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      },\n      "troco": {\n        "valor": "30.00",\n        "modalidadeAgente": "AGTEC",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **saque com valor.original maior que 0.00 (zero)** (saque requer valor.original = 0.00)\n  ```\n  ...\n  "valor": {\n    "original": "10.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **troco com valor.original igual a 0.00 (zero)** (para haver troco tem que haver valor.original > 0.00)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "troco": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGTEC",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **saque com valor.original alterável** (não se pode alterar o valor.original na presença do saque)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "modalidadeAlteracao": 1,\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAlteracao": 1,\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **troco com valor.original alterável** (não se pode alterar o valor.original na presença do troco)\n  ```\n  ...\n  "valor": {\n    "original": "0.01",\n    "modalidadeAlteracao": 1,\n    "retirada": {\n      "troco": {\n        "valor": "5.00",\n        "modalidadeAlteracao": 1,\n        "modalidadeAgente": "AGTOT",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n',
          oneOf: [
            {
              type: "object",
              properties: {
                saque: {
                  type: "object",
                  title: "Saque",
                  description: "Informações relacionadas ao saque",
                  properties: {
                    valor: {
                      type: "string",
                      title: "Valor do saque",
                      description: "Valor do saque efetuado",
                      pattern: "\\d{1,10}\\.\\d{2}",
                    },
                    modalidadeAlteracao: {
                      type: "integer",
                      format: "int32",
                      title: "Modalidade de alteração do saque",
                      description:
                        "Modalidade de alteração de valor do saque. Quando não preenchido o valor assumido é o 0 (zero).",
                      minimum: 0,
                      maximum: 1,
                      default: 0,
                    },
                    modalidadeAgente: {
                      type: "string",
                      title: "Modalidade do Agente",
                      description:
                        "##### Modalidade do Agente\n<table><tr><th>SIGLA</th><th>Descrição</th></tr><tr><td>AGTEC</td><td>Agente Estabelecimento Comercial</td></tr><tr><td>AGTOT</td><td>Agente Outra Espécie de Pessoa Jurídica ou Correspondente no País</td></tr><tr><td>AGPSS</td><td>Em desuso. Utilizar <b>AGFSS</b>.</td></tr><tr><td>AGFSS</td><td>Agente Facilitador de Serviço de Saque</td></tr></table>\n",
                      enum: ["AGTEC", "AGTOT", "AGPSS", "AGFSS"],
                    },
                    prestadorDoServicoDeSaque: {
                      type: "string",
                      title: "Facilitador de Serviço de Saque",
                      description: "ISPB do Facilitador de Serviço de Saque",
                      pattern: "^[0-9A-Z]{8}$",
                    },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                },
              },
              required: ["saque"],
            },
            {
              type: "object",
              properties: {
                troco: {
                  type: "object",
                  title: "Troco",
                  description: "Informações relacionadas ao troco",
                  properties: {
                    valor: {
                      type: "string",
                      title: "Valor do troco",
                      description: "Valor do troco efetuado",
                      pattern: "\\d{1,10}\\.\\d{2}",
                    },
                    modalidadeAlteracao: {
                      type: "integer",
                      format: "int32",
                      title: "Modalidade de alteração do troco",
                      description:
                        "Modalidade de alteração de valor do troco. Quando não preenchido o valor assumido é o 0 (zero).",
                      minimum: 0,
                      maximum: 1,
                      default: 0,
                    },
                    modalidadeAgente: {
                      type: "string",
                      title: "Modalidade do Agente",
                      description:
                        "##### Modalidade do Agente\n<table><tr><th>SIGLA</th><th>Descrição</th></tr><tr><td>AGTEC</td><td>Agente Estabelecimento Comercial</td></tr><tr><td>AGTOT</td><td>Agente Outra Espécie de Pessoa Jurídica ou Correspondente no País</td></tr></table>\n",
                      enum: ["AGTEC", "AGTOT"],
                    },
                    prestadorDoServicoDeSaque: {
                      type: "string",
                      title: "Facilitador de Serviço de Saque",
                      description: "ISPB do Facilitador de Serviço de Saque",
                      pattern: "^[0-9A-Z]{8}$",
                    },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                },
              },
              required: ["troco"],
            },
          ],
        },
      },
    },
    CobPayloadValor: {
      type: "object",
      title: "Valor da cobrança imediata retornada pelo payload",
      description:
        "Todos os campos que indicam valores monetários obedecem ao pattern \\d{1,10}\\.\\d{2}. O separador decimal é o caractere ponto. Não é aplicável utilizar separador de milhar. Exemplos de valores aderentes ao padrão: “1.00”, “123.99”, “123456789.23",
      properties: {
        original: {
          type: "string",
          title: "Valor",
          description: "Valor original da cobrança.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        modalidadeAlteracao: {
          type: "integer",
          format: "int32",
          title: "Modalidade de alteração",
          description:
            "Trata-se de um campo que determina se o valor final do documento pode ser alterado pelo pagador. Na ausência desse campo, assume-se que não se pode alterar o valor do documento de cobrança, ou seja, assume-se o valor 0. Se o campo estiver presente e com valor 1, então está determinado que o valor final da cobrança pode ter seu valor alterado pelo pagador.",
          minimum: 0,
          maximum: 1,
        },
        retirada: {
          type: "object",
          title: "Informações de retirada",
          description:
            'É uma estrutura opcional relacionada ao conceito de recebimento de numerário. Apenas um agrupamento por vez é permitido, quando há `saque` não há `troco` e vice-versa. \n\nQuando uma cobrança imediata tem uma estrutura de `retirada` ela deixa de ser considerada Pix comum e passa à categoria de Pix Saque ou Pix Troco. \n\nPara que o preenchimento do objeto `retirada` seja considerado válido as seguintes regras se aplicam:\n- os campos `modalidadeAgente` e `prestadorDoServicoDeSaque` são de **preenchimento obrigatório**;\n- quando o `saque` estiver presente a cobrança deve respeitar as seguintes condições:\n  - O campo `valor.original` deve ser preenchido com **valor igual a 0.00 (zero)**;\n  - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).\n- quando o `troco` estiver presente a cobrança deve respeitar as seguintes condições:\n  - O campo `valor.original` deve ser preenchido com **valor maior que 0.00 (zero)**;\n  - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).\n\n**IMPORTANTE**: \n- Quando usados o `saque` ou `troco` não será permitida a alteração do `valor.original` recebido. Na presença de `saque` ou `troco` o recebimento do campo `valor.modalidadeAlteracao` com valor 1 (um) é considerado erro.\n- O campo `modalidadeAgente` é de preenchimento obrigatório tanto para o saque quanto para o troco. No caso do saque, o valor "AGPSS" foi substituído por "AGFSS".\n\n#### Exemplos válidos:\nConsiderando os campos da estrutura `valor` e o predicado \'presente\' cujo resultado é verdade quando a estrutura apontada é encontrada temos: \n- **uma cobrança com valor fixo** (condições: valor.original > 0 && valor.modalidadeAlteração = 0 && !presente(valor.retirada))\n  ```\n  ...\n  "valor": {\n    "original": "10.00"\n  },\n  ...\n  ```\n- **uma cobrança com valor alterável** (condições: valor.original >= 0.00 && modalidadeAlteração = 1 && !presente(valor.retirada))\n  ```\n  ...\n  "valor": {\n    "original": "10.00",\n    "modalidadeAlteracao": 1\n  },\n  ```\n- **saque com valor fixo** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor > 0 && valor.retirada.saque.modalidadeAlteracao = 0)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **saque com valor alterável** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor >= 0 && valor.retirada.saque.modalidadeAlteracao = 1)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAlteracao": 1,\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **cobrança com troco fixo** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor > 0 && valor.retirada.troco.modalidadeAlteracao = 0)\n  ```\n  ...\n  "valor": {\n    "original": "10.00",\n    "retirada": {\n      "troco": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGTEC",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **cobrança com troco alterável** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor >= 0 && valor.retirada.troco.modalidadeAlteracao = 1)\n  ```\n  ...\n    "valor": {\n      "original": "10.00",\n      "retirada": {\n        "troco": {\n          "valor": "0.00",\n          "modalidadeAlteracao": 1,\n          "modalidadeAgente": "AGTEC",\n          "prestadorDoServicoDeSaque": "12345678"\n        }\n      }\n    },\n  ...\n  ```\n#### Exemplos inválidos:\nAbaixo alguns exemplos que **não são válidos**. Convém observar que esta listagem não tem pretensão de ser completa, sendo tão somente uma referência para alguns erros possíveis.\n- **saque sem `modalidadeAgente` e `prestadorDoServicoDeSaque`** \n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00"\n      }\n    }\n  },\n  ...\n  ```\n- **cobrança com saque e troco juntos** (não pode ter os dois ao mesmo tempo)\n  ```\n  ...\n  "valor": {\n    "original": "100.00",\n    "retirada": {\n      "saque": {\n        "valor": "50.00",\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      },\n      "troco": {\n        "valor": "30.00",\n        "modalidadeAgente": "AGTEC",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **saque com valor.original maior que 0.00 (zero)** (saque requer valor.original = 0.00)\n  ```\n  ...\n  "valor": {\n    "original": "10.00",\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **troco com valor.original igual a 0.00 (zero)** (para haver troco tem que haver valor.original > 0.00)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "retirada": {\n      "troco": {\n        "valor": "5.00",\n        "modalidadeAgente": "AGTEC",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **saque com valor.original alterável** (não se pode alterar o valor.original na presença do saque)\n  ```\n  ...\n  "valor": {\n    "original": "0.00",\n    "modalidadeAlteracao": 1,\n    "retirada": {\n      "saque": {\n        "valor": "5.00",\n        "modalidadeAlteracao": 1,\n        "modalidadeAgente": "AGFSS",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n- **troco com valor.original alterável** (não se pode alterar o valor.original na presença do troco)\n  ```\n  ...\n  "valor": {\n    "original": "0.01",\n    "modalidadeAlteracao": 1,\n    "retirada": {\n      "troco": {\n        "valor": "5.00",\n        "modalidadeAlteracao": 1,\n        "modalidadeAgente": "AGTOT",\n        "prestadorDoServicoDeSaque": "12345678"\n      }\n    }\n  },\n  ...\n  ```\n',
          oneOf: [
            {
              type: "object",
              properties: {
                saque: {
                  type: "object",
                  title: "Saque",
                  description: "Informações relacionadas ao saque",
                  properties: {
                    valor: {
                      type: "string",
                      title: "Valor do saque",
                      description: "Valor do saque efetuado",
                      pattern: "\\d{1,10}\\.\\d{2}",
                    },
                    modalidadeAlteracao: {
                      type: "integer",
                      format: "int32",
                      title: "Modalidade de alteração do saque",
                      description:
                        "Modalidade de alteração de valor do saque. Quando não preenchido o valor assumido é o 0 (zero).",
                      minimum: 0,
                      maximum: 1,
                      default: 0,
                    },
                    modalidadeAgente: {
                      type: "string",
                      title: "Modalidade do Agente",
                      description:
                        "##### Modalidade do Agente\n<table><tr><th>SIGLA</th><th>Descrição</th></tr><tr><td>AGTEC</td><td>Agente Estabelecimento Comercial</td></tr><tr><td>AGTOT</td><td>Agente Outra Espécie de Pessoa Jurídica ou Correspondente no País</td></tr><tr><td>AGPSS</td><td>Em desuso. Utilizar <b>AGFSS</b>.</td></tr><tr><td>AGFSS</td><td>Agente Facilitador de Serviço de Saque</td></tr></table>\n",
                      enum: ["AGTEC", "AGTOT", "AGPSS", "AGFSS"],
                    },
                    prestadorDoServicoDeSaque: {
                      type: "string",
                      title: "Facilitador de Serviço de Saque",
                      description: "ISPB do Facilitador de Serviço de Saque",
                      pattern: "^[0-9A-Z]{8}$",
                    },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                },
              },
              required: ["saque"],
            },
            {
              type: "object",
              properties: {
                troco: {
                  type: "object",
                  title: "Troco",
                  description: "Informações relacionadas ao troco",
                  properties: {
                    valor: {
                      type: "string",
                      title: "Valor do troco",
                      description: "Valor do troco efetuado",
                      pattern: "\\d{1,10}\\.\\d{2}",
                    },
                    modalidadeAlteracao: {
                      type: "integer",
                      format: "int32",
                      title: "Modalidade de alteração do troco",
                      description:
                        "Modalidade de alteração de valor do troco. Quando não preenchido o valor assumido é o 0 (zero).",
                      minimum: 0,
                      maximum: 1,
                      default: 0,
                    },
                    modalidadeAgente: {
                      type: "string",
                      title: "Modalidade do Agente",
                      description:
                        "##### Modalidade do Agente\n<table><tr><th>SIGLA</th><th>Descrição</th></tr><tr><td>AGTEC</td><td>Agente Estabelecimento Comercial</td></tr><tr><td>AGTOT</td><td>Agente Outra Espécie de Pessoa Jurídica ou Correspondente no País</td></tr></table>\n",
                      enum: ["AGTEC", "AGTOT"],
                    },
                    prestadorDoServicoDeSaque: {
                      type: "string",
                      title: "Facilitador de Serviço de Saque",
                      description: "ISPB do Facilitador de Serviço de Saque",
                      pattern: "^[0-9A-Z]{8}$",
                    },
                  },
                  required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
                },
              },
              required: ["troco"],
            },
          ],
        },
      },
      required: ["original"],
    },
    CobVPayloadValor: {
      type: "object",
      title: "Valor da cobrança com vencimento calculada retornada pelo payload",
      description:
        "Todos os campos que indicam valores monetários obedecem ao pattern \\d{1,10}\\.\\d{2}. O separador decimal é o caractere ponto. Não é aplicável utilizar separador de milhar. Exemplos de valores aderentes ao padrão: “1.00”, “123.99”, “123456789.23",
      properties: {
        original: {
          type: "string",
          title: "Valor",
          description: "Valor original da cobrança.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        multa: {
          type: "string",
          title: "Multa aplicada",
          description: "Multa aplicada à cobrança",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        juros: {
          type: "string",
          title: "Juro aplicado",
          description: "Juro aplicado à cobrança",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        abatimento: {
          type: "string",
          title: "Abatimento aplicado",
          description: "Abatimento aplicado à cobrança",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        desconto: {
          type: "string",
          title: "Desconto aplicado",
          description: "Descontos aplicados à cobrança",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        final: {
          type: "string",
          title: "Valor final",
          description: "Valor final da cobrança.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
      },
      required: ["final"],
    },
    RecCompleta: {
      type: "object",
      title: "Recorrência Completa",
      description: "Atributos de Configuração de Recorrência",
      required: ["status", "recebedor"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecBase",
        },
        {
          type: "object",
          properties: {
            recebedor: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    convenio: {
                      type: "string",
                      title: "Convênio",
                      description: "Convênio entre usuário e participante recebedor.",
                      maxLength: 60,
                    },
                  },
                },
              ],
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridicaRecorrencia",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosPagadorRec",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecConfiguracao",
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecCompleta",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecEncerramento",
        },
        {
          type: "object",
          properties: {
            solicitacao: {
              type: "array",
              title: "Solicitações vinculadas",
              description: "Solicitações vinculadas",
              items: {
                allOf: [
                  {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecCompleta",
                  },
                ],
              },
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtivacao",
        },
        {
          type: "object",
          properties: {
            dadosQR: {
              type: "object",
              title: "Informações do QR Composto.",
              description:
                '##### Informações relacionadas aos parâmetros `idRec` e `txid` informados na requisição.\nAo consultar uma recorrência via endpoint GET `/rec/{idRec}?txid={txid}`, o usuário recebedor pode optar pela consulta sem \no `txid` ou por compor a requisição com um `txid` de uma cobrança imediata, ou cobrança com vencimento, de forma a obter o QR Composto\npara a jornada de interesse.\n\nOs `dadosQR` retornados variam de acordo com a jornada desejada, indicada pela presença dos parâmetros de interesse, conforme a tabela abaixo:\n<table  >\n<tr><td width="15%">idRec</td><td  width="15%">txid de Cob</td><td  width="15%">txid de CobV</td><td width="100%">Conteúdo esperado</td></tr>\n<tr><td>X</td><td>-</td><td>-</td><td><pre>{ jornada: "JORNADA_2", pixCopiaECola: "QR Composto da recorrência" }</pre></td></tr>\n<tr><td>X</td><td>X</td><td>-</td><td><pre>{ jornada: "JORNADA_3", pixCopiaECola: "QR Composto da cobrança imediata + recorrência" }</pre></td></tr>\n<tr><td>X</td><td>-</td><td>X</td><td><pre>{ jornada: "JORNADA_4", pixCopiaECola: "QR Composto da cobrança com vencimento + recorrência" }</pre></td></tr>\n</table>\n\nOs campos `dadosQR.jornada` e `dadosQR.pixCopiaECola` só serão retornados se as respectivas locations necessárias para a construção do QR Composto\nestiverem preenchidas na recorrência e na eventual cobrança, a depender da jornada desejada.\n',
              properties: {
                jornada: {
                  type: "string",
                  title: "Jornada de ativação",
                  enum: ["JORNADA_2", "JORNADA_3", "JORNADA_4"],
                },
                pixCopiaECola: {
                  type: "string",
                  title: "Pix Copia e Cola correspondente à Recorrência.",
                  description:
                    "Este campo retorna o valor do Pix Copia e Cola correspondente à recorrência. Trata-se da sequência de caracteres que representa o BR Code.",
                  maxLength: 512,
                },
              },
            },
          },
        },
      ],
    },
    RecCompletaPesquisada: {
      type: "object",
      title: "Recorrência Completa Pesquisada",
      description: "Atributos de Configuração de Recorrência",
      required: ["status", "recebedor"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecBase",
        },
        {
          type: "object",
          properties: {
            recebedor: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    convenio: {
                      type: "string",
                      title: "Convênio",
                      description: "Convênio entre usuário e participante recebedor.",
                      maxLength: 60,
                    },
                  },
                },
              ],
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridicaRecorrencia",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosPagadorRec",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecConfiguracao",
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecCompleta",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecEncerramento",
        },
        {
          type: "object",
          properties: {
            solicitacao: {
              type: "array",
              title: "Solicitações vinculadas",
              description: "Solicitações vinculadas",
              items: {
                allOf: [
                  {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecCompleta",
                  },
                ],
              },
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtivacao",
        },
      ],
    },
    RecGerada: {
      type: "object",
      title: "Recorrência Gerada",
      description: "Atributos de Configuração de Recorrência",
      required: ["recebedor"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecBase",
        },
        {
          type: "object",
          properties: {
            recebedor: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    convenio: {
                      type: "string",
                      title: "Convênio",
                      description: "Convênio entre usuário e participante recebedor.",
                      maxLength: 60,
                    },
                  },
                },
              ],
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridicaRecorrencia",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecStatus",
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecCompleta",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecEncerramento",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtivacao",
        },
      ],
    },
    RecSolicitada: {
      type: "object",
      title: "Recorrência Solicitada",
      description: "Atributos de Configuração de Recorrência",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecBase",
        },
        {
          type: "object",
          properties: {
            recebedor: {
              type: "object",
              properties: {
                convenio: {
                  type: "string",
                  title: "Convênio",
                  description: "Convênio entre usuário e participante recebedor.",
                  maxLength: 60,
                },
              },
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecConfiguracao",
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecId",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtivacaoSolicitada",
        },
      ],
    },
    RecPayload: {
      type: "object",
      title: "Payload da Recorrência",
      description: "Atributos de Configuração de Recorrência",
      required: ["idRec", "atualizacao", "recebedor"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecBase",
        },
        {
          type: "object",
          properties: {
            recebedor: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    ispbParticipante: {
                      type: "string",
                      title: "ISPB do usuário recebedor.",
                      description: "ISPB do usuário recebedor.",
                      pattern: "^[0-9A-Z]{8}$",
                    },
                  },
                  required: ["ispbParticipante"],
                },
              ],
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridicaRecorrencia",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecConfiguracao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtualizacao",
        },
      ],
    },
    RecRevisada: {
      type: "object",
      title: "Recorrência Revisada",
      description: "Atributos de Revisão da Configuração de Recorrência",
      allOf: [
        {
          type: "object",
          title: "Status da Recorrência",
          properties: {
            status: {
              type: "string",
              title: "Status do registro da recorrência",
              enum: ["CANCELADA"],
            },
          },
        },
        {
          type: "object",
          properties: {
            vinculo: {
              type: "object",
              properties: {
                devedor: {
                  type: "object",
                  title: "Pessoa Física",
                  description:
                    "O objeto devedor organiza as informações sobre o devedor da recorrência.",
                  properties: {
                    nome: {
                      type: "string",
                      title: "Nome",
                      description: "Nome do usuário.",
                      maxLength: 140,
                    },
                  },
                  required: ["nome"],
                },
              },
            },
          },
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecId",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            calendario: {
              type: "object",
              title: "Informações sobre calendário da recorrência",
              description: "Informações sobre calendário da recorrência",
              properties: {
                dataInicial: {
                  type: "string",
                  format: "date",
                  title: "Data estimada de primeiro pagamento.",
                  description:
                    "Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. Data estimada de primeiro pagamento.",
                },
              },
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtivacaoSolicitada",
        },
      ],
    },
    RecNotification: {
      type: "object",
      title: "Recorrência Notificada",
      description: "Atributos de Notificação de Recorrência",
      required: ["idRec", "status", "atualizacao"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecEncerramento",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecAtivacao",
        },
      ],
    },
    RecAtivacao: {
      type: "object",
      title: "Dados relacionados à confirmação da ativação da recorrência.",
      properties: {
        ativacao: {
          type: "object",
          title: "Dados relacionados à confirmação da ativação da recorrência.",
          description: "Dados relacionados à confirmação da ativação da recorrência.",
          properties: {
            tipoJornada: {
              type: "string",
              title: "Jornada de ativação",
              description:
                "Dado relacionado ao caminho percorrido pelo processo de adesão a recorrência pelo usuário pagador, os valores possíveis são:\n  - JORNADA_1: Usuário pagador aceitou a recorrência através de notificação externa ao ecossistema\n  - JORNADA_2: Usuário pagador aceitou a recorrência através de leitura de QR Code de recorrência\n  - JORNADA_3: Usuário pagador iniciou a recorrência através de leitura de QR Code composto e pagamento de cobrança imediata. O uso desta jornada torna obrigatório o preenchimento da informação dadosJornada.txid\n  - JORNADA_4: Usuário pagador escolheu aderir à recorrência através de leitura de QR Code composto relacionado à cobrança com vencimento ou estática relacionada a um contrato vigente\n  - AGUARDANDO_DEFINICAO: Valor inicial posterior a criação e anterior a ativação da recorrência.\n",
              enum: ["JORNADA_1", "JORNADA_2", "JORNADA_3", "JORNADA_4", "AGUARDANDO_DEFINICAO"],
            },
            dadosJornada: {
              type: "object",
              title: "Dados de confirmação da jornada e início da recorrência",
              oneOf: [
                {
                  type: "object",
                  title: "Cobrança imediata vinculada à Jornada 3",
                  description:
                    "Dado de preenchimento obrigatório quando utilizada a Jornada 3. Este campo deve ser removido pelo PSP Recebedor quando a ativação for realizada pelas jornadas 1, 2 ou 4.",
                  properties: {
                    txid: {
                      $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                    },
                  },
                  required: ["txid"],
                },
              ],
            },
          },
          required: ["tipoJornada"],
        },
      },
    },
    RecAtivacaoSolicitada: {
      type: "object",
      title: "Dados relacionados à confirmação da ativação da recorrência.",
      properties: {
        ativacao: {
          type: "object",
          title: "Dados relacionados à confirmação da ativação da recorrência.",
          description: "Dados relacionados à confirmação da ativação da recorrência.",
          properties: {
            dadosJornada: {
              type: "object",
              title: "Dados de confirmação da jornada e início da recorrência",
              oneOf: [
                {
                  type: "object",
                  title: "Cobrança imediata vinculada à Jornada 3",
                  description:
                    "Dado de preenchimento obrigatório quando utilizada a Jornada 3. Este campo deve ser removido pelo PSP Recebedor quando a ativação for realizada pelas jornadas 1, 2 ou 4.",
                  properties: {
                    txid: {
                      $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                    },
                  },
                  required: ["txid"],
                },
              ],
            },
          },
        },
      },
    },
    RecStatus: {
      type: "object",
      title: "Status da Recorrência",
      properties: {
        status: {
          type: "string",
          title: "Status do registro da recorrência",
          enum: ["CRIADA", "APROVADA", "REJEITADA", "EXPIRADA", "CANCELADA"],
        },
      },
      required: ["status"],
    },
    RecConfiguracao: {
      type: "object",
      title: "Configuração da Recorrência",
      properties: {
        politicaRetentativa: {
          type: "string",
          title: "Política de retentativa pós vencimento da recorrência",
          enum: ["NAO_PERMITE", "PERMITE_3R_7D"],
        },
      },
      required: ["politicaRetentativa"],
    },
    RecAtualizacao: {
      type: "object",
      title: "Histórico de atualização da recorrência.",
      properties: {
        atualizacao: {
          type: "array",
          title: "Histórico de Status",
          description: "Histórico das mudanças de status da recorrência.",
          items: {
            type: "object",
            properties: {
              status: {
                type: "string",
                title: "Status da recorrência",
                description: "Status da recorrência.",
                enum: ["CRIADA", "APROVADA", "REJEITADA", "EXPIRADA", "CANCELADA"],
              },
              data: {
                type: "string",
                format: "date-time",
                description: "Data e hora do registro de status atualizado. Respeita RFC 3339.",
              },
            },
            required: ["status", "data"],
          },
        },
      },
      required: ["atualizacao"],
    },
    RecEncerramento: {
      type: "object",
      title: "Detalhamento do encerramento da recorrência.",
      properties: {
        encerramento: {
          type: "object",
          title: "Detalhamento do encerramento da recorrência.",
          oneOf: [
            {
              type: "object",
              properties: {
                rejeicao: {
                  type: "object",
                  title: "Informações sobre a rejeição da recorrência",
                  description: "Informações sobre a rejeição da recorrência",
                  properties: {
                    codigo: {
                      type: "string",
                      title: "Código da rejeição",
                      description:
                        "Código da rejeição. Corresponde ao código de rejeição presente no catálogo de mensagens.",
                      maxLength: 4,
                      enum: ["AP13", "AP14", "AP15"],
                    },
                    descricao: {
                      type: "string",
                      title: "Descricao da rejeição",
                      description: "Descricao da causa da rejeição",
                      maxLength: 400,
                    },
                  },
                  required: ["codigo", "descricao"],
                },
              },
              required: ["rejeicao"],
            },
            {
              type: "object",
              properties: {
                cancelamento: {
                  type: "object",
                  title: "Informações sobre o cancelamento da recorrência",
                  description: "Informações sobre o cancelamento da recorrência",
                  properties: {
                    solicitante: {
                      type: "string",
                      title: "Solicitante do cancelamento",
                      enum: [
                        "PSP_PAGADOR",
                        "USUARIO_PAGADOR",
                        "PSP_RECEBEDOR",
                        "USUARIO_RECEBEDOR",
                      ],
                    },
                    codigo: {
                      type: "string",
                      title: "Código do cancelamento",
                      description:
                        "Código do cancelamento. Corresponde ao código de cancelamento presente no catálogo de mensagens. **IMPORTANTE:** `PCFD` e `ERSL` estão em desuso (deprecated) sem substitutos.",
                      maxLength: 4,
                      enum: ["ACCL", "CPCL", "DCSD", "ERSL", "FRUD", "PCFD", "SLCR", "SLDB"],
                    },
                    descricao: {
                      type: "string",
                      title: "Descricao do cancelamento",
                      description: "Descricao do cancelamento.",
                      maxLength: 400,
                    },
                  },
                  required: ["solicitante", "codigo", "descricao"],
                },
              },
              required: ["cancelamento"],
            },
          ],
        },
      },
    },
    RecId: {
      type: "string",
      title: "ID Recorrência",
      description:
        '# Identificador da Recorrência\n\nRegra de formação:\n- RAxxxxxxxxyyyyMMddkkkkkkkkkkk (29 caracteres; "case sensitive", isso é, diferencia letras maiúsculas e minúsculas), sendo:\n  - "R":  fixo (1 caractere). "R" para a recorrência criada dentro do Pix;\n  - "A": identificação da possibilidade de novas tentativas, sendo possíveis os valores "R" ou "N" (1 caractere). "R" caso a recorrência permita novas tentativas de pagamento pós vencimento, ou "N" caso não permita novas tentativas.\n  - "xxxxxxxx":  identificação do agente que presta serviço para o usuário recebedor que gerou o ID Recorrência, podendo ser: o ISPB do participante direto, o ISPB do participante indireto ou os 8 primeiros caracteres do CNPJ do prestador de serviço de iniciação (8 caracteres alfanuméricos [A-Z|0-9]);\n  - "yyyyMMdd":  data (8 caracteres) de criação da recorrência;\n  - "kkkkkkkkkkk": sequencial criado pelo agente que gerou o ID Recorrência (11 caracteres alfanuméricos [a-z|A-Z|0-9]). Deve ser único dentro de cada "yyyyMMdd".\n\nDessa forma, o ID da recorrência deve ser formado de acordo com um dos tipos a seguir:\n- "RRxxxxxxxxyyyyMMddkkkkkkkkkkk"; para recorrência criada dentro do Pix e que permite novas tentativas de pagamento pós vencimento; ou\n- "RNxxxxxxxxyyyyMMddkkkkkkkkkkk"; para recorrência criada dentro do Pix e que não permite novas tentativas de pagamento pós vencimento.”\n',
      minLength: 29,
      maxLength: 29,
      pattern: "[a-zA-Z0-9]{29}",
    },
    RecBase: {
      type: "object",
      title: "Recorrência Base",
      description: "Atributos de Configuração de Recorrência",
      properties: {
        vinculo: {
          type: "object",
          title: "Descrição do Objeto da Recorrência",
          description: "Informações sobre o objeto da recorrência.",
          properties: {
            objeto: {
              type: "string",
              title: "Identificador do objeto de vínculo",
              description:
                "Campo de texto livre para informações referentes ao contrato que permitam ao usuário pagador reconhecer o objeto dos pagamentos periódicos por meio do Pix Automático.",
              maxLength: 35,
            },
            devedor: {
              description:
                "O objeto devedor organiza as informações sobre o devedor da recorrência.",
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisicaRecorrencia",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridicaRecorrencia",
                },
              ],
            },
            contrato: {
              type: "string",
              title: "Objeto da autorização",
              description:
                "Número, identificador, ou código que representa o objeto da autorização (contrato, pedido etc.).",
              maxLength: 35,
            },
          },
          required: ["contrato", "devedor"],
        },
        calendario: {
          type: "object",
          title: "Informações sobre calendário da recorrência",
          description: "Informações sobre calendário da recorrência",
          properties: {
            dataInicial: {
              type: "string",
              format: "date",
              title: "Data estimada de primeiro pagamento.",
              description:
                "Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. Data estimada de primeiro pagamento.",
            },
            dataFinal: {
              type: "string",
              format: "date",
              title: "Data final da vigência.",
              description:
                "Campo opcional que deve ser preenchido para autorizações com vigência pré-definida, devendo ser compatível com os valores informados em tipoFrequencia e a dataInicialRecorrencia. Não deve ser preenchido para autorizações por tempo indeterminado. Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601.",
            },
            periodicidade: {
              type: "string",
              title: "Periodicidade das cobranças recorrentes.",
              enum: ["SEMANAL", "MENSAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"],
            },
          },
          required: ["dataInicial", "periodicidade"],
        },
        valor: {
          type: "object",
          properties: {
            valorRec: {
              type: "string",
              title: "Valor da recorrência",
              description:
                "Campo opcional, deve ser preenchido apenas quando o valor dos pagamentos for fixo ou não for sujeito a alteração durante a vigência da autorização.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
            valorMinimoRecebedor: {
              type: "string",
              title: "Valor mínimo da recorrência",
              description:
                "Campo opcional. Valor definido pelo usuário recebedor. Se o usuário pagador atribuir um valor máximo para os pagamentos daquela autorização, ele não poderá ser inferior ao piso definido pelo usuário recebedor. Não pode ser preenchido nas autorizações de valor fixo, ou seja, com campo valor preenchido.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
        },
      },
      required: ["calendario", "vinculo"],
    },
    SolicRecId: {
      type: "object",
      title: "Id da Solicitação de recorrência",
      description: "Dados criados ou alterados da cobrança recorrente via API Pix",
      properties: {
        idSolicRec: {
          type: "string",
          title: "ID Solicitação da Recorrência",
          description:
            "# Identificador da Solicitação da Recorrência\n\nRegra de formação:\n- SCxxxxxxxxyyyyMMddkkkkkkkkkkk (29 caracteres; “case sensitive”, isso é, diferencia letras maiúsculas e minúsculas), sendo:\n  - SC - fixo (2 caracteres);\n  - xxxxxxxx – ISPB do agente que envia a mensagem pain.009 de solicitação de confirmação da recorrência (8 caracteres alfanuméricos [A-Z|0-9]);\n  - yyyyMMdd – data (8 caracteres) de criação da mensagem pain.009 de solicitação de confirmação da recorrência;\n  - kkkkkkkkkkk – sequencial criado pelo agente que gerou a mensagem de solicitação de confirmação da recorrência (11 caracteres alfanuméricos [a-z|A-Z|0-9]). Deve ser único dentro de cada “yyyyMMdd”.\n",
          minLength: 29,
          maxLength: 29,
          pattern: "[a-zA-Z0-9]{29}",
        },
      },
      required: ["idSolicRec"],
    },
    SolicRecBase: {
      type: "object",
      title: "Solicitação de Recorrência Base",
      description: "Dados criados ou alterados da cobrança recorrente via API Pix",
      properties: {
        idRec: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
        },
        calendario: {
          type: "object",
          title: "Informações de Calendário da Solicitação da Recorrência",
          properties: {
            dataExpiracaoSolicitacao: {
              type: "string",
              format: "date-time",
              title: "Data da expiração da solicitação enviada ao usuário pagador.",
              description:
                "Data da expiração da solicitação enviada ao usuário pagador. Respeita RFC 3339.",
            },
          },
          required: ["dataExpiracaoSolicitacao"],
        },
        destinatario: {
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosBancarios",
            },
          ],
          oneOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CPF",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CNPJ",
            },
          ],
        },
      },
      required: ["calendario", "idRec", "destinatario"],
    },
    SolicRecStatus: {
      type: "object",
      title: "Status da Solicitação de Recorrência",
      properties: {
        status: {
          type: "string",
          title: "Status do registro da solicitação de recorrência",
          enum: ["CRIADA", "ENVIADA", "RECEBIDA", "REJEITADA", "ACEITA", "EXPIRADA", "CANCELADA"],
        },
      },
      required: ["status"],
    },
    SolicRecAtualizacao: {
      type: "object",
      title: "Histórico de Status da Solicitação de Recorrência",
      properties: {
        atualizacao: {
          type: "array",
          title: "Histórico de Status da Solicitação de Recorrência",
          description: "",
          items: {
            type: "object",
            properties: {
              status: {
                type: "string",
                title: "Status do registro da solicitação de recorrência",
                enum: [
                  "CRIADA",
                  "ENVIADA",
                  "RECEBIDA",
                  "REJEITADA",
                  "ACEITA",
                  "EXPIRADA",
                  "CANCELADA",
                ],
              },
              data: {
                type: "string",
                format: "date-time",
                description: "Data e hora do registro de status atualizado. Respeita RFC 3339.",
              },
            },
            required: ["status", "data"],
          },
        },
      },
      required: ["atualizacao"],
    },
    SolicRecEncerramento: {
      type: "object",
      title: "Detalhamento do encerramento da solicitação de recorrência.",
      properties: {
        encerramento: {
          type: "object",
          title: "Detalhamento do encerramento da solicitação de recorrência.",
          properties: {
            rejeicao: {
              type: "object",
              title: "Informações sobre a rejeição da solicitação de recorrência",
              description: "Informações sobre a rejeição da solicitação de recorrência",
              properties: {
                motivo: {
                  type: "string",
                  title: "Motivo da rejeição",
                  description: "Motivo pelo qual a solicitação de recorrência foi rejeitada.",
                  enum: ["DADOS_BANCARIOS_INVALIDOS"],
                },
              },
              required: ["motivo"],
            },
          },
        },
      },
    },
    SolicRecSolicitada: {
      type: "object",
      title: "Solicitação de Recorrência",
      description: "Dados criados ou alterados da solicitação da recorrência",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecBase",
        },
      ],
    },
    SolicRecRevisada: {
      type: "object",
      title: "Solicitação de Recorrência",
      description: "Dados alterados da solicitação da recorrência",
      properties: {
        status: {
          type: "string",
          title: "Status do registro da solicitação de recorrência",
          enum: ["CANCELADA"],
        },
      },
      required: ["status"],
    },
    SolicRecCompleta: {
      type: "object",
      title: "Solicitação de Recorrência Completa",
      description: "Dados criados ou alterados da solicitação da recorrência",
      required: ["recPayload"],
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecId",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecBase",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecEncerramento",
        },
        {
          type: "object",
          properties: {
            recPayload: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecPayload",
            },
          },
        },
      ],
    },
    TributoCompleto: {
      type: "object",
      title: "Tributos Detalhados",
      description: "Informações completas sobre tributos.",
      properties: {
        documentoFiscal: {
          type: "object",
          title: "Documento Fiscal",
          description: "Informações detalhadas acerca da documentação fiscal.",
          properties: {
            chaveDeAcesso: {
              type: "string",
              title: "Chave de Acesso para o Documento Fiscal",
              pattern: "^[a-zA-Z0-9]{1,50}$",
            },
          },
          required: ["chaveDeAcesso"],
        },
        cbs: {
          title: "CBS",
          description:
            "CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoCompleto",
            },
          ],
        },
        ibs: {
          title: "IBS",
          description:
            "IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoCompleto",
            },
          ],
        },
      },
      required: ["cbs", "ibs"],
    },
    TributoCompletoPix: {
      type: "object",
      title: "Tributos Detalhados Pix",
      description: "Informações completas sobre tributos.",
      properties: {
        documentoFiscal: {
          type: "object",
          title: "Documento Fiscal",
          description: "Informações detalhadas acerca da documentação fiscal.",
          properties: {
            chaveDeAcesso: {
              type: "string",
              title: "Chave de Acesso para o Documento Fiscal",
              pattern: "^[a-zA-Z0-9]{1,50}$",
            },
          },
          required: ["chaveDeAcesso"],
        },
        cbs: {
          title: "CBS",
          description:
            "CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoCompletoPix",
            },
          ],
        },
        ibs: {
          title: "IBS",
          description:
            "IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoCompletoPix",
            },
          ],
        },
      },
      required: ["cbs", "ibs"],
    },
    TributoPayload: {
      type: "object",
      title: "Tributos para acesso via payload",
      description: "Informações tributárias atualizadas acessíveis via payload.",
      properties: {
        documentoFiscal: {
          type: "object",
          title: "Documento Fiscal",
          description: "Informações detalhadas acerca da documentação fiscal.",
          properties: {
            chaveDeAcesso: {
              type: "string",
              title: "Chave de Acesso para o Documento Fiscal",
              pattern: "^[a-zA-Z0-9]{1,50}$",
            },
          },
          required: ["chaveDeAcesso"],
        },
        cbs: {
          title: "CBS",
          description:
            "CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoPayload",
            },
          ],
        },
        ibs: {
          title: "IBS",
          description:
            "IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoPayload",
            },
          ],
        },
      },
      required: ["cbs", "ibs"],
    },
    TributoInformadoCompleto: {
      type: "object",
      title: "Tributos Informados completos",
      description:
        "Informações tributárias detalhadas de todas as categorias de tributos disponíveis.",
      properties: {
        documentoFiscal: {
          type: "object",
          title: "Documento Fiscal",
          description: "Informações detalhadas acerca da documentação fiscal.",
          properties: {
            chaveDeAcesso: {
              type: "string",
              title: "Chave de Acesso para o Documento Fiscal",
              pattern: "^[a-zA-Z0-9]{1,50}$",
            },
          },
          required: ["chaveDeAcesso"],
        },
        cbs: {
          title: "CBS",
          description:
            "CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoInformadoCompleto",
            },
          ],
        },
        ibs: {
          title: "IBS",
          description:
            "IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoInformadoCompleto",
            },
          ],
        },
      },
      required: ["cbs", "ibs"],
    },
    TributoInformadoSolicitado: {
      type: "object",
      title: "Tributos Informados solicitados",
      description:
        "Informações tributárias informadas pelo usuário recebedor no momento da criação ou revisão da cobrança, quando aplicável.",
      properties: {
        documentoFiscal: {
          type: "object",
          title: "Documento Fiscal",
          description: "Informações detalhadas acerca da documentação fiscal.",
          properties: {
            chaveDeAcesso: {
              type: "string",
              title: "Chave de Acesso para o Documento Fiscal",
              pattern: "^[a-zA-Z0-9]{1,50}$",
            },
          },
          required: ["chaveDeAcesso"],
        },
        cbs: {
          title: "CBS",
          description:
            "CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoInformadoSolicitado",
            },
          ],
        },
        ibs: {
          title: "IBS",
          description:
            "IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoInformadoSolicitado",
            },
          ],
        },
      },
      required: ["cbs", "ibs"],
    },
    RegistroCategoriaTributoInformadoSolicitado: {
      type: "object",
      title: "Registro de tributo informado",
      description: "Detalhamento dos valores informados do tributo, segregados por categoria.",
      properties: {
        informado: {
          title: "Tributo informado",
          description: "Categoria de tributo informado.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheSolicitado",
            },
          ],
        },
      },
      required: ["informado"],
    },
    RegistroCategoriaTributoInformadoCompleto: {
      type: "object",
      title: "Registro de tributo informado criado",
      description: "Detalhamento dos valores informados do tributo, segregados por categoria.",
      properties: {
        informado: {
          title: "Tributo informado",
          description: "Categoria de tributo informado.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
      },
      required: ["informado"],
    },
    RegistroCategoriaTributoPayload: {
      type: "object",
      title: "Registro de tributo informado e corrigido.",
      description: "Informações tributárias disponibilizadas publicamente.",
      properties: {
        informado: {
          title: "Tributo informado",
          description: "Categoria de tributo informado.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
        corrigido: {
          title: "Tributo corrigido",
          description: "Categoria de tributo corrigido.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
      },
      required: ["informado"],
    },
    RegistroCategoriaTributoCompleto: {
      type: "object",
      title: "Registro de tributo completo",
      description: "Detalhamento dos valores completos do tributo, segregados por categoria.",
      properties: {
        segregado: {
          title: "Tributo segregado",
          description:
            "Categoria cujo valor e data correspondem ao que foi efetivamente segregado na liquidação do Pix.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
        emAberto: {
          title: "Tributo em aberto",
          description:
            "Categoria cujo valor e data correspondem ao registro do último valor em aberto obtido da Plataforma Pública.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
        corrigido: {
          title: "Tributo corrigido",
          description:
            "Categoria cujo valor e data correspondem ao registro da última correção obtida da Plataforma Pública.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
        informado: {
          title: "Tributo informado",
          description:
            "Categoria cujo valor é informado pelo recebedor e a data corresponde ao momento de criação do objeto tributo.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorTributoDetalheCompleto",
            },
          ],
        },
      },
      required: ["informado"],
    },
    RegistroCategoriaTributoCompletoPix: {
      type: "object",
      title: "Registro de tributo completo Pix",
      description: "Detalhamento dos valores completos do tributo, segregados por categoria.",
      required: ["informado", "segregado"],
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RegistroCategoriaTributoCompleto",
        },
      ],
    },
    ValorTributoDetalheCompleto: {
      type: "object",
      title: "Informação completa do valor do tributo",
      properties: {
        valor: {
          type: "string",
          title: "Valor do tributo",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        data: {
          type: "string",
          format: "date-time",
          title: "Data de referência do tributo",
        },
      },
      required: ["valor", "data"],
    },
    ValorTributoDetalheSolicitado: {
      type: "object",
      title: "Informação solicitada do valor do tributo",
      properties: {
        valor: {
          type: "string",
          title: "Valor do tributo",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
      },
      required: ["valor"],
    },
    ValorLiquidoEstimado: {
      type: "object",
      title: "Valor estimado da cobrança após recolhimento de CBS e IBS.",
      properties: {
        valorLiquidoEstimado: {
          type: "string",
          title: "Valor Líquido Estimado.",
          description:
            "Valor estimado da cobrança após recolhimento de CBS e IBS.\n\n-\tSe houver tributo segregado é dado pela fórmula: `valorLiquido = valor - (tributo.cbs.segregado.valor + tributo.ibs.segregado.valor)`; senão\n-\tSe houver tributo em aberto é dado pela fórmula: `valorLiquido = valor.original - (tributo.cbs.emAberto.valor + tributo.ibs. emAberto.valor)`; senão\n-\tSe houver tributo corrigido é dado pela fórmula: `valorLiquido = valor.original - (tributo.cbs.corrigido.valor + tributo.ibs.corrigido.valor)`; senão\n-\tSe houver tributo informado é dado pela fórmula: `valorLiquido = valor.original - (tributo.cbs.informado.valor + tributo.ibs.informado.valor)`; senão\n-\tSe não houver tributo informado: `valorLiquido = valor.original`.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
      },
    },
    CobRGerada: {
      type: "object",
      title: "Cobrança Recorrente Gerada",
      description: "Dados criados ou alterados da cobrança recorrente via API Pix",
      required: ["idRec", "txid", "status", "valor", "recebedor", "calendario"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          type: "object",
          properties: {
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRBase",
        },
        {
          type: "object",
          properties: {
            calendario: {
              type: "object",
              properties: {
                criacao: {
                  type: "string",
                  format: "date",
                  title: "Data de criação da cobrança",
                  description:
                    "Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. É a data de criação da cobrança.",
                },
              },
              required: ["criacao"],
            },
          },
        },
        {
          type: "object",
          properties: {
            recebedor: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridicaRecorrencia",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosDevedorRecorrencia",
        },
        {
          type: "object",
          properties: {
            tributo: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoCompleto",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
      ],
    },
    CobRCompleta: {
      type: "object",
      title: "Cobrança Recorrente Completa",
      description: "Dados completos da cobrança recorrente via API Pix",
      required: ["idRec", "txid", "status", "valor", "recebedor", "calendario"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          type: "object",
          properties: {
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRBase",
        },
        {
          type: "object",
          properties: {
            calendario: {
              type: "object",
              properties: {
                criacao: {
                  type: "string",
                  format: "date",
                  title: "Data de criação da cobrança",
                  description:
                    "Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. É a data de criação da cobrança.",
                },
              },
              required: ["criacao"],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRConfiguracao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosDevedorRecorrencia",
        },
        {
          type: "object",
          properties: {
            pix: {
              type: "array",
              title: "Pix recebidos",
              items: {
                allOf: [
                  {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixAutomaticoConsultado",
                  },
                ],
              },
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRTentativas",
        },
        {
          type: "object",
          properties: {
            tributo: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompleto",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
      ],
    },
    CobRAtualizacao: {
      type: "object",
      title: "Histórico de Atualização da Cobrança Recorrente",
      properties: {
        atualizacao: {
          type: "array",
          title: "Histórico de Status",
          description: "Histórico das mudanças de status das cobranças recorrentes.",
          items: {
            type: "object",
            properties: {
              status: {
                type: "string",
                title: "Status da cobrança",
                description: "Status da cobrança.",
                enum: ["CRIADA", "ATIVA", "CONCLUIDA", "EXPIRADA", "REJEITADA", "CANCELADA"],
              },
              data: {
                type: "string",
                format: "date-time",
                description: "Data e hora do registro de status atualizado. Respeita RFC 3339.",
              },
            },
            required: ["status", "data"],
          },
        },
        encerramento: {
          type: "object",
          title: "Detalhamento do encerramento da cobrança.",
          oneOf: [
            {
              type: "object",
              properties: {
                cancelamento: {
                  type: "object",
                  title: "Informações sobre o cancelamento da cobrança",
                  description: "Informações sobre o cancelamento da cobrança",
                  properties: {
                    solicitante: {
                      type: "string",
                      title: "Solicitante do cancelamento",
                      enum: [
                        "PSP_PAGADOR",
                        "USUARIO_PAGADOR",
                        "PSP_RECEBEDOR",
                        "USUARIO_RECEBEDOR",
                      ],
                    },
                    codigo: {
                      type: "string",
                      title: "Código do cancelamento",
                      description:
                        "Código do cancelamento. Corresponde ao código de cancelamento presente no catálogo de mensagens.",
                      maxLength: 4,
                      enum: ["ACCT", "BLCK", "CCLD", "FAIL", "OTHR", "SLBD", "SLCR"],
                    },
                    descricao: {
                      type: "string",
                      title: "Descricao do cancelamento",
                      description: "Descricao da causa do cancelamento",
                      maxLength: 400,
                    },
                  },
                  required: ["solicitante", "codigo", "descricao"],
                },
              },
              required: ["cancelamento"],
            },
            {
              type: "object",
              properties: {
                rejeicao: {
                  type: "object",
                  title: "Informações sobre a rejeição da cobrança",
                  description: "Informações sobre a rejeição da cobrança",
                  properties: {
                    codigo: {
                      type: "string",
                      title: "Código da rejeição",
                      description:
                        "Código da rejeição. Corresponde ao código de rejeição presente no catálogo de mensagens. \n\nOs códigos: `AB10`, `AC06`, `AM02`, `DS27`, `DTNT`, `FBRD`, `IRNT`, `NIEC`, `NIPA`, `QUNT` e `RC09` estão em desuso.\n",
                      maxLength: 4,
                      enum: [
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
                    descricao: {
                      type: "string",
                      title: "Descricao da rejeição",
                      description: "Descricao da causa da rejeição",
                      maxLength: 400,
                    },
                  },
                  required: ["codigo", "descricao"],
                },
              },
              required: ["rejeicao"],
            },
          ],
        },
      },
      required: ["atualizacao"],
    },
    CobRTentativas: {
      type: "object",
      title: "Histórico de Tentativas da Cobrança Recorrente",
      properties: {
        tentativas: {
          type: "array",
          title: "Histórico de Tentativas de Cobrança",
          description: "Histórico de Tentativas de Cobrança",
          items: {
            type: "object",
            properties: {
              dataLiquidacao: {
                type: "string",
                format: "date",
                description:
                  "Data prevista para liquidação da cobrança. Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601.",
              },
              tipo: {
                type: "string",
                title: "Tipo da Tentativa",
                description: "Tipo da tentativa da cobrança.",
                enum: ["AGND", "NTAG", "RIFL"],
              },
              status: {
                type: "string",
                title: "Status da Tentativa",
                description: "Status da tentativa da cobrança.",
                enum: ["SOLICITADA", "AGENDADA", "PAGA", "CANCELADA", "REJEITADA", "EXPIRADA"],
              },
              endToEndId: {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/EndToEndId",
              },
              atualizacao: {
                type: "array",
                title: "Histórico de Status da Tentativa",
                description: "Histórico das mudanças de status da tentativa de cobrança.",
                items: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      title: "Status da Tentativa",
                      description: "Status da tentativa da cobrança.",
                      enum: [
                        "SOLICITADA",
                        "AGENDADA",
                        "PAGA",
                        "CANCELADA",
                        "REJEITADA",
                        "EXPIRADA",
                      ],
                    },
                    data: {
                      type: "string",
                      format: "date-time",
                      description:
                        "Data e hora do registro de status atualizado. Respeita RFC 3339.",
                    },
                  },
                  required: ["status", "data"],
                },
              },
              rejeicao: {
                type: "object",
                title: "Informações sobre a rejeição da tentativa da cobrança",
                description: "Informações sobre a rejeição da tentativa da cobrança",
                properties: {
                  codigo: {
                    type: "string",
                    title: "Código da rejeição da tentativa",
                    description:
                      "Código da rejeição da tentativa. Corresponde ao código de rejeição presente no catálogo de mensagens. \n\nOs códigos de rejeição da tentativa `AC05`,`AM09`,`CRNC`, `DENC`,`DTED`, `FCD2`, `GRER`, `MIDI`, `MSUC`, `NITX` e `UDEI` causam a rejeição da cobrança recorrente correspondente.\n\nOs códigos de rejeição da tentativa `DS27`, `FBRD` e `RC09` estão em desuso.\n",
                    maxLength: 4,
                    enum: [
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
                  descricao: {
                    type: "string",
                    title: "Descricao da rejeição",
                    description: "Descricao da causa da rejeição",
                    maxLength: 400,
                  },
                },
                required: ["codigo", "descricao"],
              },
            },
            required: ["dataLiquidacao", "tipo", "endToEndId", "status", "atualizacao"],
          },
        },
      },
    },
    CobRRevisada: {
      type: "object",
      title: "Cobrança Recorrente Revisada",
      description: "Dados enviados para revisão da cobrança recorrente via API Pix",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRStatusRevisada",
        },
      ],
    },
    CobRSolicitada: {
      type: "object",
      title: "Cobrança Recorrente Solicitada",
      description: "Dados enviados para criação da cobrança recorrente via API Pix",
      required: ["idRec", "calendario", "valor", "recebedor"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRBase",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosDevedorRecorrencia",
        },
        {
          type: "object",
          properties: {
            tributo: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoSolicitado",
            },
          },
        },
      ],
    },
    CobRNotification: {
      type: "object",
      title: "Cobrança Recorrente Notificada",
      description: "Dados enviados para notificação da cobrança recorrente via API Pix",
      required: ["idRec", "txid", "status", "atualizacao"],
      allOf: [
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
        {
          type: "object",
          properties: {
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRStatus",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRAtualizacao",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRTentativas",
        },
        {
          type: "object",
          properties: {
            valor: {
              type: "object",
              title: "Valor da cobrança recorrente",
              description:
                "Valor da cobrança recorrente. Deve ser preenchido quando houver informação de tributo preenchida.",
              properties: {
                original: {
                  type: "string",
                  title: "Valor",
                  description: "Valor original da cobrança.",
                  pattern: "\\d{1,10}\\.\\d{2}",
                },
              },
              required: ["original"],
            },
          },
        },
        {
          type: "object",
          properties: {
            tributo: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompleto",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
        {
          type: "object",
          properties: {
            pix: {
              type: "array",
              title: "Pix recebidos",
              items: {
                allOf: [
                  {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixAutomaticoConsultado",
                  },
                ],
              },
            },
          },
        },
      ],
    },
    CobNotification: {
      type: "object",
      title: "Cobrança Imediata Notificada",
      description: "Dados enviados para notificação da cobrança imediata via API Pix",
      required: ["txid", "status"],
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCompleta",
        },
      ],
    },
    CobVNotification: {
      type: "object",
      title: "Cobrança com Vencimento Notificada",
      description: "Dados enviados para notificação da cobrança com vencimento via API Pix",
      required: ["txid", "status"],
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVCompleta",
        },
      ],
    },
    CobRConfiguracao: {
      type: "object",
      title: "Configuração da Cobrança Recorrente",
      properties: {
        politicaRetentativa: {
          type: "string",
          title: "Política de retentativa da cobrança recorrente",
          enum: ["NAO_PERMITE", "PERMITE_3R_7D"],
        },
      },
      required: ["politicaRetentativa"],
    },
    CobRStatus: {
      type: "object",
      title: "Status da Cobrança Recorrente",
      properties: {
        status: {
          type: "string",
          title: "Status do registro da cobrança",
          enum: ["CRIADA", "ATIVA", "CONCLUIDA", "EXPIRADA", "REJEITADA", "CANCELADA"],
        },
      },
    },
    CobRStatusRevisada: {
      type: "object",
      title: "Status da Cobrança Recorrente",
      properties: {
        status: {
          type: "string",
          title: "Status do registro da cobrança",
          enum: ["CANCELADA"],
        },
      },
    },
    CobRBase: {
      type: "object",
      title: "Cobrança Recorrente Base",
      description: "Atributos de cobrança recorrente",
      properties: {
        infoAdicional: {
          type: "string",
          title: "Informações adicionais da fatura.",
          description: "Informações adicionais da fatura.",
          maxLength: 140,
        },
        calendario: {
          type: "object",
          title: "Informações sobre calendário da cobrança",
          description: "",
          properties: {
            dataDeVencimento: {
              type: "string",
              format: "date",
              title: "Data de vencimento da cobrança",
              description:
                "Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. É a data de vencimento da cobrança.",
            },
          },
          required: ["dataDeVencimento"],
        },
        valor: {
          type: "object",
          title: "Valor da cobrança recorrente",
          description: "Valor da cobrança recorrente",
          properties: {
            original: {
              type: "string",
              title: "Valor",
              description: "Valor original da cobrança.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["original"],
        },
        ajusteDiaUtil: {
          type: "boolean",
          title: "Ajuste data prevista para liquidação para próximo dia útil",
          description:
            "Campo de ativação do ajuste da data prevista para liquidação para próximo dia útil caso o vencimento corrente seja um dia não útil. O PSP Recebedor deverá considerar os feriados locais com base no código município do usuário pagador.",
          default: true,
        },
        recebedor: {
          description: "O objeto recebedor organiza as informações sobre o recebedor da cobrança.",
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosBancariosRecebedor",
            },
          ],
        },
      },
      required: ["ajusteDiaUtil"],
    },
    CobBase: {
      type: "object",
      title: "Cobrança Base",
      description: "Atributos comuns a todas entidades de Cobrança",
      properties: {
        chave: {
          type: "string",
          title: "Chave DICT do recebedor",
          description:
            '# Formato do campo chave\n\n* O campo chave determina a chave Pix registrada no DICT que será utilizada para a cobrança. Essa chave será lida pelo aplicativo do PSP do pagador para consulta ao DICT, que retornará a informação que identificará o recebedor da cobrança.\n* Os tipos de chave podem ser: telefone, e-mail, cpf/cnpj ou EVP.\n* O formato das chaves pode ser encontrado na seção "Formatação das chaves do DICT no BR Code" do [Manual de Padrões para iniciação do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).\n',
          maxLength: 77,
        },
        solicitacaoPagador: {
          type: "string",
          title: "Solicitação ao pagador",
          description:
            "O campo solicitacaoPagador, opcional, determina um texto a ser apresentado ao pagador para que ele possa digitar uma informação correlata, em formato livre, a ser enviada ao recebedor. Esse texto será preenchido, na pacs.008, pelo PSP do pagador, no campo RemittanceInformation <RmtInf>. O tamanho do campo <RmtInf> na pacs.008 está limitado a 140 caracteres.",
          maxLength: 140,
        },
        infoAdicionais: {
          type: "array",
          title: "Informações adicionais",
          description:
            "Cada respectiva informação adicional contida na lista (nome e valor) deve ser apresentada ao pagador.",
          items: {
            type: "object",
            properties: {
              nome: {
                type: "string",
                title: "Nome",
                description: "Nome do campo.",
                maxLength: 50,
              },
              valor: {
                type: "string",
                title: "Valor",
                description: "Dados do campo.",
                maxLength: 200,
              },
            },
            required: ["nome", "valor"],
          },
          maxItems: 50,
        },
      },
    },
    CobBaseCopiaCola: {
      type: "object",
      title: "Cobrança Base com Copia e Cola",
      description:
        "Atributos comuns a todas entidades de Cobrança que possuem informação de Copia e Cola",
      allOf: [
        {
          type: "object",
          properties: {
            pixCopiaECola: {
              type: "string",
              title: "Pix Copia e Cola correspondente à cobrança.",
              description:
                "Este campo retorna o valor do Pix Copia e Cola correspondente à cobrança. Trata-se da sequência de caracteres que representa o BR Code.",
              maxLength: 512,
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
      ],
    },
    CobSolicitada: {
      type: "object",
      title: "Cobrança imediata solicitada",
      description: "Dados enviados para criação ou alteração da cobrança imediata via API Pix",
      required: ["valor", "chave", "calendario"],
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobExpiracao",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            devedor: {
              description:
                "Os campos aninhados sob o objeto devedor são opcionais e identificam o devedor, ou seja, a pessoa ou a instituição a quem a cobrança está endereçada. Não identifica, necessariamente, quem irá efetivamente realizar o pagamento. Um CPF pode ser o devedor de uma cobrança, mas pode acontecer de outro CPF realizar, efetivamente, o pagamento do documento. Não é permitido que o campo `devedor.cpf` e campo `devedor.cnpj` estejam preenchidos ao mesmo tempo. Se o campo `devedor.cnpj` está preenchido, então o campo `devedor.cpf` não pode estar preenchido, e vice-versa. Se o campo `devedor.nome` está preenchido, então deve existir ou um `devedor.cpf` ou um campo `devedor.cnpj` preenchido.",
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationCob",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              allOf: [
                {
                  required: ["original"],
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobValor",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoSolicitado",
                },
              ],
            },
          },
        },
      ],
    },
    CobVSolicitada: {
      type: "object",
      title: "Cobrança com vencimento solicitada",
      description:
        "Dados enviados para criação ou alteração da cobrança com vencimento via API Pix",
      required: ["valor", "chave", "devedor", "calendario"],
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobDataDeVencimento",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosDevedor",
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationCob",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              allOf: [
                {
                  required: ["original"],
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVValor",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoSolicitado",
                },
              ],
            },
          },
        },
      ],
    },
    CobRevisada: {
      type: "object",
      title: "Cobrança imediata revisada",
      description: "Dados enviados para revisão da cobrança imediata via API Pix",
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobExpiracao",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            devedor: {
              description:
                "Os campos aninhados sob o objeto devedor são opcionais e identificam o devedor, ou seja, a pessoa ou a instituição a quem a cobrança está endereçada. Não identifica, necessariamente, quem irá efetivamente realizar o pagamento. Um CPF pode ser o devedor de uma cobrança, mas pode acontecer de outro CPF realizar, efetivamente, o pagamento do documento. Não é permitido que o campo `devedor.cpf` e campo `devedor.cnpj` estejam preenchidos ao mesmo tempo. Se o campo `devedor.cnpj` está preenchido, então o campo `devedor.cpf` não pode estar preenchido, e vice-versa. Se o campo `devedor.nome` está preenchido, então deve existir ou um `devedor.cpf` ou um campo `devedor.cnpj` preenchido.",
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationCob",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            status: {
              type: "string",
              title: "Status do registro da cobrança",
              enum: ["REMOVIDA_PELO_USUARIO_RECEBEDOR"],
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobValor",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoSolicitado",
                },
              ],
            },
          },
        },
      ],
    },
    CobVRevisada: {
      type: "object",
      title: "Cobrança com vencimento revisada",
      description: "Dados enviados para revisão da cobrança com vencimento via API Pix",
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobDataDeVencimento",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosDevedor",
        },
        {
          type: "object",
          properties: {
            loc: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationCob",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            status: {
              type: "string",
              title: "Status do registro da cobrança",
              enum: ["REMOVIDA_PELO_USUARIO_RECEBEDOR"],
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVValor",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoSolicitado",
                },
              ],
            },
          },
        },
      ],
    },
    CobGerada: {
      type: "object",
      title: "Cobrança Imediata Gerada",
      description: "Dados criados ou alterados da cobrança imediata via API Pix",
      required: ["txid", "calendario", "revisao", "status", "valor", "chave"],
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              required: ["expiracao"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCriacao",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobExpiracao",
                },
              ],
            },
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            revisao: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Revisao",
            },
          },
        },
        {
          type: "object",
          properties: {
            devedor: {
              description:
                "Os campos aninhados sob o objeto devedor são opcionais e identificam o devedor, ou seja, a pessoa ou a instituição a quem a cobrança está endereçada. Não identifica, necessariamente, quem irá efetivamente realizar o pagamento. Um CPF pode ser o devedor de uma cobrança, mas pode acontecer de outro CPF realizar, efetivamente, o pagamento do documento. Não é permitido que o campo `devedor.cpf` e campo `devedor.cnpj` estejam preenchidos ao mesmo tempo. Se o campo `devedor.cnpj` está preenchido, então o campo `devedor.cpf` não pode estar preenchido, e vice-versa. Se o campo `devedor.nome` está preenchido, então deve existir ou um `devedor.cpf` ou um campo `devedor.cnpj` preenchido.",
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            loc: {
              required: ["id", "tipoCob", "criacao"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocation",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            location: {
              type: "string",
              format: "uri",
              title: "Localização do payload",
              description: "Localização do Payload a ser informada na criação da cobrança.",
              maxLength: 77,
            },
          },
        },
        {
          type: "object",
          properties: {
            status: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobStatus",
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              required: ["original"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobValor",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBaseCopiaCola",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoCompleto",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
      ],
    },
    CobVGerada: {
      type: "object",
      title: "Cobrança com Vencimento Gerada",
      description: "Dados criados ou alterados da cobrança com vencimento via API Pix",
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
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              required: ["validadeAposVencimento"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCriacao",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobDataDeVencimento",
                },
              ],
            },
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            revisao: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Revisao",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosDevedor",
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosRecebedor",
        },
        {
          type: "object",
          properties: {
            loc: {
              required: ["id", "tipoCob", "criacao"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocation",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            status: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVStatus",
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              required: ["original"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVValor",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBaseCopiaCola",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoInformadoCompleto",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
      ],
    },
    CobStatus: {
      type: "string",
      title: "Status do registro da cobrança.",
      description:
        "Estado do registro da cobrança. Não se confunde com o estado da cobrança em si, ou seja, não guarda relação com o fato de a cobrança encontrar-se vencida ou expirada, por exemplo.\n\nOs status são assim definidos:\n- `ATIVA`: indica que o registro se refere a uma cobrança que foi gerada mas ainda não foi paga nem removida;\n- `CONCLUIDA`: indica que o registro se refere a uma cobrança que já foi paga e, por conseguinte, não pode acolher outro pagamento;\n- `REMOVIDA_PELO_USUARIO_RECEBEDOR`: indica que o usuário recebedor solicitou a remoção do registro da cobrança;\n- `REMOVIDA_PELO_PSP`: indica que o PSP Recebedor solicitou a remoção do registro da cobrança.\n",
      enum: ["ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"],
    },
    CobVStatus: {
      type: "string",
      title: "Status do registro da cobrança com vencimento.",
      description:
        "Estado do registro da cobrança com vencimento. Não se confunde com o estado da cobrança em si, ou seja, não guarda relação com o fato de a cobrança encontrar-se vencida ou expirada, por exemplo.\n\nOs status são assim definidos:\n- `ATIVA`: indica que o registro se refere a uma cobrança que foi gerada mas ainda não foi paga nem removida;\n- `CONCLUIDA`: indica que o registro se refere a uma cobrança que já foi paga e, por conseguinte, não pode acolher outro pagamento;\n- `CONCLUIDA_POR_OUTRO_ARRANJO`: indica que o registro se refere a uma cobrança que já foi paga pelo arranjo de boletos e, por conseguinte, não pode acolher outro pagamento;\n- `REMOVIDA_PELO_USUARIO_RECEBEDOR`: indica que o usuário recebedor solicitou a remoção do registro da cobrança;\n- `REMOVIDA_PELO_PSP`: indica que o PSP Recebedor solicitou a remoção do registro da cobrança; e\n- `REMOVIDA_PELO_PSP_BOLETO`: indica que o PSP Recebedor solicitou a remoção do registro de cobrança, porque o pagamento é possível apenas por boleto.\n",
      enum: [
        "ATIVA",
        "CONCLUIDA",
        "REMOVIDA_PELO_USUARIO_RECEBEDOR",
        "REMOVIDA_PELO_PSP",
        "REMOVIDA_PELO_PSP_BOLETO",
      ],
    },
    LoteCobVGerado: {
      type: "object",
      title: "Lote de cobranças com vencimento gerado",
      properties: {
        id: {
          type: "integer",
          format: "int64",
          title: "Id do lote",
        },
        descricao: {
          type: "string",
          title: "Descrição do lote",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de criação do lote",
          description:
            "Timestamp que indica o momento em que foi criado o lote. Respeita o formato definido na RFC 3339.",
        },
        cobsv: {
          type: "array",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVGerada",
          },
        },
      },
      required: ["id", "descricao", "criacao", "cobsv"],
    },
    CobVCompleta: {
      title: "Cobrança com vencimento completa",
      required: ["status"],
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVGerada",
        },
        {
          type: "object",
          properties: {
            status: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVStatus",
            },
          },
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompleto",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
        {
          type: "object",
          properties: {
            pix: {
              type: "array",
              title: "Pix recebidos",
              items: {
                allOf: [
                  {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixConsultado",
                  },
                  {
                    type: "object",
                    properties: {
                      txid: {
                        allOf: [
                          {
                            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                          },
                          {
                            pattern: "[a-zA-Z0-9]{26,35}",
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
    CobCompleta: {
      title: "Cobrança imediata completa",
      required: ["status"],
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobGerada",
        },
        {
          type: "object",
          properties: {
            status: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobStatus",
            },
          },
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompleto",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ValorLiquidoEstimado",
        },
        {
          type: "object",
          properties: {
            pix: {
              type: "array",
              title: "Pix recebidos",
              items: {
                allOf: [
                  {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixConsultado",
                  },
                  {
                    type: "object",
                    properties: {
                      txid: {
                        allOf: [
                          {
                            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                          },
                          {
                            pattern: "[a-zA-Z0-9]{26,35}",
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
    LoteCobVConsultado: {
      type: "object",
      title: "Lote de solicitações de alteração ou criação de cobranças com vencimento",
      properties: {
        id: {
          type: "integer",
          format: "int64",
          title: "Identificador do lote em formato numérico.",
        },
        descricao: {
          type: "string",
          title: "Descrição do lote",
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de criação do lote",
          description:
            "Timestamp que indica o momento em que foi criado o lote. Respeita o formato definido na RFC 3339.",
        },
        cobsv: {
          type: "array",
          items: {
            type: "object",
            properties: {
              txid: {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
              },
              status: {
                type: "string",
                title:
                  "Status da solicitação de criação/alteração da cobrança no contexto de criação via lote",
                enum: ["EM_PROCESSAMENTO", "CRIADA", "NEGADA"],
              },
              problema: {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
              },
              criacao: {
                type: "string",
                format: "date-time",
                title: "Data de Criação",
                description: "Data e hora em que a cobrança foi criada. Respeita RFC 3339.",
              },
            },
            required: ["txid", "status"],
          },
        },
      },
      required: ["id", "descricao", "criacao", "cobsv"],
    },
    LotesCobVConsultados: {
      type: "object",
      title: "Lotes de solicitações de cobranças com vencimento",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaLote",
        },
        lotes: {
          type: "array",
          title: "Lotes de solicitações de criação/alteração de cobranças com vencimento",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/LoteCobVConsultado",
              },
            ],
          },
        },
      },
      required: ["parametros", "lotes"],
    },
    CobVPayload: {
      type: "object",
      title: "Payload JSON da cobrança com vencimento",
      description: "Dados da cobrança com vencimento acessados pelo payload JSON",
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
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              required: ["criacao", "apresentacao", "validadeAposVencimento"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCriacao",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobApresentacao",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobDataDeVencimento",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            devedor: {
              description:
                "Os campos aninhados sob o objeto devedor são opcionais e identificam o devedor, ou seja, a pessoa ou a instituição a quem a cobrança está endereçada. Não identifica, necessariamente, quem irá efetivamente realizar o pagamento. Um CPF pode ser o devedor de uma cobrança, mas pode acontecer de outro CPF realizar, efetivamente, o pagamento do documento. Não é permitido que o campo `devedor.cpf` e campo `devedor.cnpj` estejam preenchidos ao mesmo tempo. Se o campo `devedor.cnpj` está preenchido, então o campo `devedor.cpf` não pode estar preenchido, e vice-versa. Se o campo `devedor.nome` está preenchido, então deve existir ou um `devedor.cpf` ou um campo `devedor.cnpj` preenchido.",
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
                },
              ],
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DadosRecebedor",
        },
        {
          type: "object",
          properties: {
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            revisao: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Revisao",
            },
          },
        },
        {
          type: "object",
          properties: {
            status: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVStatus",
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVPayloadValor",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoPayload",
                },
              ],
            },
          },
        },
      ],
    },
    CobPayload: {
      type: "object",
      title: "Payload JSON da cobrança imediata",
      description: "Dados da cobrança imediata acessados pelo payload JSON",
      required: ["txid", "calendario", "revisao", "status", "valor", "chave"],
      allOf: [
        {
          type: "object",
          properties: {
            calendario: {
              title: "Calendário",
              description:
                "Os campos aninhados sob o identificador calendário organizam informações a respeito de controle de tempo da cobrança.",
              required: ["criacao", "apresentacao", "expiracao"],
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCriacao",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobApresentacao",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobExpiracao",
                },
              ],
            },
            txid: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            revisao: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Revisao",
            },
          },
        },
        {
          type: "object",
          properties: {
            devedor: {
              description:
                "Os campos aninhados sob o objeto devedor são opcionais e identificam o devedor, ou seja, a pessoa ou a instituição a quem a cobrança está endereçada. Não identifica, necessariamente, quem irá efetivamente realizar o pagamento. Um CPF pode ser o devedor de uma cobrança, mas pode acontecer de outro CPF realizar, efetivamente, o pagamento do documento. Não é permitido que o campo `devedor.cpf` e campo `devedor.cnpj` estejam preenchidos ao mesmo tempo. Se o campo `devedor.cnpj` está preenchido, então o campo `devedor.cpf` não pode estar preenchido, e vice-versa. Se o campo `devedor.nome` está preenchido, então deve existir ou um `devedor.cpf` ou um campo `devedor.cnpj` preenchido.",
              oneOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaFisica",
                },
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PessoaJuridica",
                },
              ],
            },
          },
        },
        {
          type: "object",
          properties: {
            status: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobStatus",
            },
          },
        },
        {
          type: "object",
          properties: {
            valor: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobPayloadValor",
            },
          },
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobBase",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoPayload",
                },
              ],
            },
          },
        },
      ],
    },
    PayloadLocation: {
      type: "object",
      title: "Location do Payload",
      description: "Identificador da localização do payload.",
      properties: {
        id: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationId",
        },
        location: {
          type: "string",
          format: "uri",
          title: "Localização do payload",
          description: "Localização do Payload a ser informada na criação da cobrança.",
          maxLength: 77,
        },
        tipoCob: {
          type: "string",
          title: "Tipo da cobrança",
          enum: ["cob", "cobv"],
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que a location foi criada. Respeita RFC 3339.",
        },
      },
      required: ["id", "location", "tipoCob", "criacao"],
    },
    PayloadLocationSolicitada: {
      type: "object",
      title: "Location do Payload Solicitada",
      description: "Identificador da localização do payload solicitada.",
      properties: {
        tipoCob: {
          type: "string",
          title: "Tipo da cobrança",
          enum: ["cob", "cobv"],
        },
      },
      required: ["tipoCob"],
    },
    PayloadLocationRecSolicitada: {
      type: "object",
      title: "Location do Payload Solicitada",
      description: "Identificador da localização do payload solicitada.",
      properties: {
        tipo: {
          type: "string",
          title: "Tipo da cobrança",
          enum: ["rec"],
        },
      },
      required: ["tipo"],
    },
    PayloadLocationRecGerada: {
      type: "object",
      title: "Location do Payload Completa",
      description: "Identificador da localização do payload completo.",
      properties: {
        id: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecId",
        },
        location: {
          type: "string",
          format: "uri",
          title: "Localização do payload",
          description: "Localização do Payload a ser informada na criação da recorrência.",
          maxLength: 77,
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que a location foi criada. Respeita RFC 3339.",
        },
      },
      required: ["id", "location", "criacao"],
    },
    PayloadLocationRecCompleta: {
      type: "object",
      title: "Location do Payload Completa",
      description: "Identificador da localização do payload completo.",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecGerada",
        },
        {
          type: "object",
          properties: {
            idRec: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
            },
          },
        },
      ],
    },
    PayloadLocationCompleta: {
      type: "object",
      title: "Location do Payload Completa",
      description: "Identificador da localização do payload completo.",
      properties: {
        id: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationId",
        },
        txid: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
        },
        location: {
          type: "string",
          format: "uri",
          title: "Localização do payload",
          description: "Localização do Payload a ser informada na criação da cobrança.",
          maxLength: 77,
        },
        tipoCob: {
          type: "string",
          title: "Tipo da cobrança",
          enum: ["cob", "cobv"],
        },
        criacao: {
          type: "string",
          format: "date-time",
          title: "Data de Criação",
          description: "Data e hora em que a location foi criada. Respeita RFC 3339.",
        },
      },
      required: ["id", "location", "tipoCob", "criacao"],
    },
    PayloadLocationCob: {
      type: "object",
      title: "Location do Payload",
      description: "Identificador da localização do payload.",
      properties: {
        id: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationId",
        },
      },
      required: ["id"],
    },
    ParametrosConsultaRec: {
      type: "object",
      title: "Parâmetros de Consulta de Recorrências",
      description: "Parâmetros utilizados para a realização de uma consulta de recorrências.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        cpf: {
          type: "string",
          title: "CPF",
          description:
            "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
          pattern: "^\\d{11}$",
        },
        cnpj: {
          type: "string",
          title: "CNPJ",
          description:
            "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
          pattern: "^[0-9A-Z]{14}$",
        },
        locationPresente: {
          type: "boolean",
          description: "Filtro pela existência de location vinculada.",
        },
        status: {
          type: "string",
          title: "Status do registro da recorrência",
          description: "Filtro pelo status das recorrências.",
        },
        recebedor: {
          type: "object",
          title: "Recebedor",
          properties: {
            convenio: {
              type: "string",
              title: "Convênio",
              description: "Convênio entre usuário e participante recebedor.",
              maxLength: 60,
            },
          },
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    ParametrosConsultaCob: {
      type: "object",
      title: "Parâmetros de Consulta de Cobrança",
      description:
        "[DEPRECADO] Parâmetros utilizados para a realização de uma consulta de cobranças.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        cpf: {
          type: "string",
          title: "CPF",
          description:
            "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
          pattern: "^\\d{11}$",
        },
        cnpj: {
          type: "string",
          title: "CNPJ",
          description:
            "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
          pattern: "^[0-9A-Z]{14}$",
        },
        locationPresente: {
          type: "boolean",
          description: "Filtro pela existência de location vinculada.",
        },
        status: {
          type: "string",
          title: "Status do registro da cobrança",
          description: "Filtro pelo status das cobranças.",
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    ParametrosConsultaCobR: {
      type: "object",
      title: "Parâmetros de Consulta de Cobrança",
      description: "Parâmetros utilizados para a realização de uma consulta de cobranças.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        idRec: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecId",
        },
        cpf: {
          type: "string",
          title: "CPF",
          description:
            "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
          pattern: "^\\d{11}$",
        },
        cnpj: {
          type: "string",
          title: "CNPJ",
          description:
            "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
          pattern: "^[0-9A-Z]{14}$",
        },
        status: {
          type: "string",
          title: "Status do registro da cobrança",
          description: "Filtro pelo status das cobranças.",
        },
        recebedor: {
          type: "object",
          title: "Recebedor",
          properties: {
            convenio: {
              type: "string",
              title: "Convênio",
              description: "Convênio entre usuário e participante recebedor.",
              maxLength: 60,
            },
          },
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    ParametrosConsultaLote: {
      type: "object",
      title: "Parâmetros de consulta de lotes de cobrança com vencimento.",
      description:
        "Parâmetros utilizados para a realização de uma consulta de lote de cobranças com vencimento.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    CobsVConsultadas: {
      type: "object",
      title: "Cobranças com vencimento consultadas",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaCob",
        },
        cobs: {
          type: "array",
          title: "Lista de cobranças",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVCompleta",
              },
              {
                required: ["status", "txid"],
              },
            ],
          },
        },
      },
      required: ["parametros", "cobs"],
    },
    CobsConsultadas: {
      type: "object",
      title: "Cobranças imediatas consultadas",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaCob",
        },
        cobs: {
          type: "array",
          title: "Lista de cobranças",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCompleta",
              },
              {
                required: ["status", "txid"],
              },
            ],
          },
        },
      },
      required: ["parametros", "cobs"],
    },
    CobsRConsultadas: {
      type: "object",
      title: "Cobranças recorrentes consultadas",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaCobR",
        },
        cobsr: {
          type: "array",
          title: "Lista de cobranças",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRCompleta",
              },
            ],
          },
        },
      },
      required: ["parametros", "cobsr"],
    },
    RecsConsultadas: {
      type: "object",
      title: "Recorrencias consultadas",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaRec",
        },
        recs: {
          type: "array",
          title: "Lista de recorrências",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecCompletaPesquisada",
              },
            ],
          },
        },
      },
      required: ["parametros", "recs"],
    },
    Pix: {
      type: "object",
      title: "Pix",
      properties: {
        endToEndId: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/EndToEndId",
        },
        txid: {
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            {
              pattern: "[a-zA-Z0-9]{1,35}",
            },
          ],
        },
        valor: {
          type: "string",
          title: "Valor do Pix.",
          description: "Valor do Pix.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        componentesValor: {
          type: "object",
          title: "Informações sobre o valor do Pix",
          description:
            'O objetivo dessa estrutura é explicar os elementos de composição do valor do Pix, incluindo informações sobre as multas, juros, descontos e abatimentos quando o Pix for relativo a cobranças com vencimento.\n\nRegras da estrutura:\n- O `valor` do Pix é igual a: \n  - (`original.valor` + `saque.valor` + `troco.valor`) + `multa.valor` + `juros.valor` – `abatimento.valor` – `desconto.valor`\n  considerando-se apenas os campos que estiverem presentes para cada tipo de cobrança pago.\n- As estruturas `saque` e `troco` só serão retornadas quando o Pix for relativo a um Pix Saque ou Pix Troco, respectivamente, e \nas demais estruturas (`juros`, `multa`, `abatimento` e `desconto`) só serão pertinentes aos Pix de pagamentos das cobranças com vencimento.\n- Não pode haver simultaneamente uma subsestrutura do tipo `saque` e outra do tipo `troco`;\n- Não há restrição na ordem das subestruturas.\n\nPara o caso de um Pix Saque pode-se retornar `original` com valor=0.00 (zero) uma vez que a soma será respeitada, ou pode-se omitir a \nsubestrutura original. No caso de um Pix Troco ou de um pagamento de cobrança com vencimento a subsestrutura `original` vai sempre estar \npresente.\n\n#### Exemplos válidos:\nExemplo de preenchimentos válidos. \n\n- **Pix para pagamento de cobrança imediata (sem saque ou troco).**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "100.00"\n    } \n  }\n  ...\n  ```\n- **Pix Saque.**\n  ```\n  ...\n  "componentesValor": {\n    "saque": {\n      "valor": "100.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **Pix para pagamento de cobrança imediata com saque (pode vir original.valor=0.00).**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "0.00"\n    },\n    "saque": {\n      "valor": "100.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **Pix Troco.**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "80.00"\n    },\n    "troco": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGTEC",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **Pix para pagamento de cobrança imediata com troco (ordem não importa).**\n  ```\n  ...\n  "componentesValor": {\n    "troco": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGTEC",\n      "prestadorDeServicoDeSaque": "12345678"\n    },\n    "original": {\n      "valor": "80.00"\n    }\n  }\n  ...\n  ```\n- **Pix para pagamento de cobrança com vencimento de R$100,00 considerando-se um atraso de 2 dias a uma multa de 3% e juros de 1% ao dia. O `valor` do Pix será R$105,00.**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "100.00"\n    },\n    "multa": {\n      "valor": "3.00"\n    },\n    "juros": {\n      "valor": "2.00"\n    }\n  }\n  ...\n  ```            \n#### Exemplos inválidos:\nExemplos, não exaustivos, de preenchimentos inválidos.\n- **`original.valor` maior que 0.00 (zero) e `saque` juntos**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "80.00"\n    },\n    "saque": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **dois elementos de `saque`**\n  ```\n  ...\n  "componentesValor": [\n    "saque": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    },\n    "saque": {\n      "valor": "10.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  ]\n  ...\n  ```\n- **saque e troco simultaneamente**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "60.00"\n    },\n    "saque": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    },\n    "troco": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGTEC",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```',
          anyOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorOriginal",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorSaque",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorTroco",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorJuros",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorMulta",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorAbatimento",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorDesconto",
            },
          ],
        },
        chave: {
          type: "string",
          title: "Chave DICT do recebedor",
          description:
            '# Formato do campo chave\n\n* Campo chave do recebedor conforme atribuído na respectiva PACS008.\n* Os tipos de chave podem ser: telefone, e-mail, cpf/cnpj ou EVP.\n* O formato das chaves pode ser encontrado na seção "Formatação das chaves do DICT no BR Code" do [Manual de Padrões para iniciação do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).\n',
          maxLength: 77,
        },
        horario: {
          type: "string",
          format: "date-time",
          title: "Horário",
          description: "Horário em que o Pix foi processado no PSP.",
        },
        infoPagador: {
          type: "string",
          title: "Informação livre do pagador",
          maxLength: 140,
        },
        devolucoes: {
          type: "array",
          title: "Devoluções",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Devolucao",
          },
        },
        tributo: {
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompletoPix",
            },
          ],
        },
        valorLiquido: {
          type: "string",
          title: "Valor Líquido do Pix.",
          description:
            "Valor líquido do Pix após recolhimento de CBS e IBS.\n\n- Quando houver tributo segregado é dado pela fórmula: `valorLiquido = valor – (tributo.cbs.segregado.valor + tributo.ibs.segregado.valor)`\n- Quando não houver tributo segregado: `valorLiquido = valor`",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
      },
      required: ["endToEndId", "valor", "horario"],
    },
    PixAutomatico: {
      type: "object",
      title: "Pix Automático",
      properties: {
        endToEndId: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/EndToEndId",
        },
        txid: {
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            {
              pattern: "[a-zA-Z0-9]{1,35}",
            },
          ],
        },
        valor: {
          type: "string",
          title: "Valor do Pix.",
          description: "Valor do Pix.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        componentesValor: {
          type: "object",
          title: "Informações sobre o valor do Pix",
          description:
            'O objetivo dessa estrutura é explicar os elementos de composição do valor do Pix, incluindo informações sobre as multas, juros, descontos e abatimentos quando o Pix for relativo a cobranças com vencimento.\n\nRegras da estrutura:\n- O `valor` do Pix é igual a: \n  - (`original.valor` + `saque.valor` + `troco.valor`) + `multa.valor` + `juros.valor` – `abatimento.valor` – `desconto.valor`\n  considerando-se apenas os campos que estiverem presentes para cada tipo de cobrança pago.\n- As estruturas `saque` e `troco` só serão retornadas quando o Pix for relativo a um Pix Saque ou Pix Troco, respectivamente, e \nas demais estruturas (`juros`, `multa`, `abatimento` e `desconto`) só serão pertinentes aos Pix de pagamentos das cobranças com vencimento.\n- Não pode haver simultaneamente uma subsestrutura do tipo `saque` e outra do tipo `troco`;\n- Não há restrição na ordem das subestruturas.\n\nPara o caso de um Pix Saque pode-se retornar `original` com valor=0.00 (zero) uma vez que a soma será respeitada, ou pode-se omitir a \nsubestrutura original. No caso de um Pix Troco ou de um pagamento de cobrança com vencimento a subsestrutura `original` vai sempre estar \npresente.\n\n#### Exemplos válidos:\nExemplo de preenchimentos válidos. \n\n- **Pix para pagamento de cobrança imediata (sem saque ou troco).**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "100.00"\n    } \n  }\n  ...\n  ```\n- **Pix Saque.**\n  ```\n  ...\n  "componentesValor": {\n    "saque": {\n      "valor": "100.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **Pix para pagamento de cobrança imediata com saque (pode vir original.valor=0.00).**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "0.00"\n    },\n    "saque": {\n      "valor": "100.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **Pix Troco.**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "80.00"\n    },\n    "troco": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGTEC",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **Pix para pagamento de cobrança imediata com troco (ordem não importa).**\n  ```\n  ...\n  "componentesValor": {\n    "troco": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGTEC",\n      "prestadorDeServicoDeSaque": "12345678"\n    },\n    "original": {\n      "valor": "80.00"\n    }\n  }\n  ...\n  ```\n- **Pix para pagamento de cobrança com vencimento de R$100,00 considerando-se um atraso de 2 dias a uma multa de 3% e juros de 1% ao dia. O `valor` do Pix será R$105,00.**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "100.00"\n    },\n    "multa": {\n      "valor": "3.00"\n    },\n    "juros": {\n      "valor": "2.00"\n    }\n  }\n  ...\n  ```            \n#### Exemplos inválidos:\nExemplos, não exaustivos, de preenchimentos inválidos.\n- **`original.valor` maior que 0.00 (zero) e `saque` juntos**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "80.00"\n    },\n    "saque": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```\n- **dois elementos de `saque`**\n  ```\n  ...\n  "componentesValor": [\n    "saque": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    },\n    "saque": {\n      "valor": "10.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  ]\n  ...\n  ```\n- **saque e troco simultaneamente**\n  ```\n  ...\n  "componentesValor": {\n    "original": {\n      "valor": "60.00"\n    },\n    "saque": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGFSS",\n      "prestadorDeServicoDeSaque": "12345678"\n    },\n    "troco": {\n      "valor": "20.00",\n      "modalidadeAgente": "AGTEC",\n      "prestadorDeServicoDeSaque": "12345678"\n    } \n  }\n  ...\n  ```',
          anyOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorOriginal",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorJuros",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorMulta",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorAbatimento",
            },
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixValorDesconto",
            },
          ],
        },
        horario: {
          type: "string",
          format: "date-time",
          title: "Horário",
          description: "Horário em que o Pix foi processado no PSP.",
        },
        infoPagador: {
          type: "string",
          title: "Informação livre do pagador",
          maxLength: 140,
        },
        devolucoes: {
          type: "array",
          title: "Devoluções",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoPixAutomatico",
          },
        },
        tributo: {
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompletoPix",
            },
          ],
        },
        valorLiquido: {
          type: "string",
          title: "Valor Líquido do Pix.",
          description:
            "Valor líquido do Pix após recolhimento de CBS e IBS.\n\n- Quando houver tributo segregado é dado pela fórmula: `valorLiquido = valor – (tributo.cbs.segregado.valor + tributo.ibs.segregado.valor)`\n- Quando não houver tributo segregado: `valorLiquido = valor`",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
      },
      required: ["txid", "endToEndId", "valor", "horario"],
    },
    PixValorOriginal: {
      type: "object",
      properties: {
        original: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor original",
              description: "Valor original do Pix.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["valor"],
        },
      },
      required: ["original"],
    },
    PixValorSaque: {
      type: "object",
      properties: {
        saque: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor do Saque Pix",
              description: "Valor do Saque Pix.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
            modalidadeAgente: {
              type: "string",
              title: "Modalidade do Agente",
              description:
                "##### Modalidade do Agente\n<table><tr><th>SIGLA</th><th>Descrição</th></tr><tr><td>AGTEC</td><td>Agente Estabelecimento Comercial</td></tr><tr><td>AGTOT</td><td>Agente Outra Espécie de Pessoa Jurídica ou Correspondente no País</td></tr><tr><td>AGPSS</td><td>Em desuso. Utilizar <b>AGFSS</b>.</td></tr><tr><td>AGFSS</td><td>Agente Facilitador de Serviço de Saque</td></tr></table>\n",
              enum: ["AGTEC", "AGTOT", "AGPSS", "AGFSS"],
            },
            prestadorDoServicoDeSaque: {
              type: "string",
              title: "Facilitador de Serviço de Saque",
              description: "ISPB do Facilitador de Serviço de Saque",
              pattern: "^[0-9A-Z]{8}$",
            },
          },
          required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
        },
      },
      required: ["saque"],
    },
    PixValorTroco: {
      type: "object",
      properties: {
        troco: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor do Troco Pix",
              description: "Valor do Troco Pix.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
            modalidadeAgente: {
              type: "string",
              title: "Modalidade do Agente",
              description:
                "##### Modalidade do Agente\n<table><tr><th>SIGLA</th><th>Descrição</th></tr><tr><td>AGTEC</td><td>Agente Estabelecimento Comercial</td></tr><tr><td>AGTOT</td><td>Agente Outra Espécie de Pessoa Jurídica ou Correspondente no País</td></tr></table>\n",
              enum: ["AGTEC", "AGTOT"],
            },
            prestadorDoServicoDeSaque: {
              type: "string",
              title: "Facilitador de Serviço de Saque",
              description: "ISPB do Facilitador de Serviço de Saque",
              pattern: "^[0-9A-Z]{8}$",
            },
          },
          required: ["valor", "modalidadeAgente", "prestadorDoServicoDeSaque"],
        },
      },
      required: ["troco"],
    },
    PixValorJuros: {
      type: "object",
      properties: {
        juros: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor relativo aos juros.",
              description: "Valor dos juros.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["valor"],
        },
      },
      required: ["juros"],
    },
    PixValorMulta: {
      type: "object",
      properties: {
        multa: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor relativo a multa.",
              description: "Valor da multa.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["valor"],
        },
      },
      required: ["multa"],
    },
    PixValorDesconto: {
      type: "object",
      properties: {
        desconto: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor relativo a desconto.",
              description: "Valor do desconto.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["valor"],
        },
      },
      required: ["desconto"],
    },
    PixValorAbatimento: {
      type: "object",
      properties: {
        abatimento: {
          type: "object",
          properties: {
            valor: {
              type: "string",
              title: "Valor relativo a abatimento.",
              description: "Valor do abatimento.",
              pattern: "\\d{1,10}\\.\\d{2}",
            },
          },
          required: ["valor"],
        },
      },
      required: ["abatimento"],
    },
    Devolucao: {
      type: "object",
      title: "Devolução",
      properties: {
        id: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoId",
        },
        rtrId: {
          type: "string",
          title: "RtrId",
          description: "ReturnIdentification que transita na PACS004.",
          minLength: 32,
          maxLength: 32,
          pattern: "[a-zA-Z0-9]{32}",
        },
        valor: {
          type: "string",
          title: "Valor a devolver.",
          description: "Valor a devolver.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        natureza: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoNatureza",
        },
        descricao: {
          type: "string",
          title: "Mensagem ao pagador relativa à devolução.",
          description:
            "O campo `descricao`, opcional, determina um texto a ser apresentado ao pagador contendo informações sobre a devolução. Esse texto será preenchido, na pacs.004, pelo PSP do recebedor, no campo RemittanceInformation. O tamanho do campo na pacs.004 está limitado a 140 caracteres.",
          maxLength: 140,
        },
        horario: {
          type: "object",
          properties: {
            solicitacao: {
              type: "string",
              format: "date-time",
              title: "Horário de solicitação",
              description: "Horário no qual a devolução foi solicitada no PSP.",
            },
            liquidacao: {
              type: "string",
              format: "date-time",
              title: "Horário de liquidacao",
              description: "Horário no qual a devolução foi liquidada no PSP.",
            },
          },
        },
        status: {
          type: "string",
          title: "Status",
          description: "Status da devolução.",
          enum: ["EM_PROCESSAMENTO", "DEVOLVIDO", "NAO_REALIZADO"],
        },
        motivo: {
          type: "string",
          title: "Descrição do status.",
          description:
            "# Status da Devolução\n\nCampo opcional que pode ser utilizado pelo PSP recebedor para detalhar os motivos\nde a devolução ter atingido o status em questão.\nPode ser utilizado, por exemplo, para detalhar o motivo de a devolução não ter sido realizada.\n",
          maxLength: 140,
        },
      },
      required: ["id", "rtrId", "valor", "horario", "status"],
    },
    DevolucaoPixAutomatico: {
      type: "object",
      title: "Devolução",
      properties: {
        id: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoId",
        },
        rtrId: {
          type: "string",
          title: "RtrId",
          description: "ReturnIdentification que transita na PACS004.",
          minLength: 32,
          maxLength: 32,
          pattern: "[a-zA-Z0-9]{32}",
        },
        valor: {
          type: "string",
          title: "Valor a devolver.",
          description: "Valor a devolver.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        natureza: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoNaturezaPixAutomatico",
        },
        descricao: {
          type: "string",
          title: "Mensagem ao pagador relativa à devolução.",
          description:
            "O campo `descricao`, opcional, determina um texto a ser apresentado ao pagador contendo informações sobre a devolução. Esse texto será preenchido, na pacs.004, pelo PSP do recebedor, no campo RemittanceInformation. O tamanho do campo na pacs.004 está limitado a 140 caracteres.",
          maxLength: 140,
        },
        horario: {
          type: "object",
          properties: {
            solicitacao: {
              type: "string",
              format: "date-time",
              title: "Horário de solicitação",
              description: "Horário no qual a devolução foi solicitada no PSP.",
            },
            liquidacao: {
              type: "string",
              format: "date-time",
              title: "Horário de liquidacao",
              description: "Horário no qual a devolução foi liquidada no PSP.",
            },
          },
        },
        status: {
          type: "string",
          title: "Status",
          description: "Status da devolução.",
          enum: ["EM_PROCESSAMENTO", "DEVOLVIDO", "NAO_REALIZADO"],
        },
        motivo: {
          type: "string",
          title: "Descrição do status.",
          description:
            "# Status da Devolução\n\nCampo opcional que pode ser utilizado pelo PSP recebedor para detalhar os motivos\nde a devolução ter atingido o status em questão.\nPode ser utilizado, por exemplo, para detalhar o motivo de a devolução não ter sido realizada.\n",
          maxLength: 140,
        },
      },
      required: ["id", "rtrId", "valor", "horario", "status"],
    },
    DevolucaoSolicitada: {
      type: "object",
      properties: {
        valor: {
          type: "string",
          title: "Valor",
          description:
            "Valor solicitado para devolução. A soma dos valores de todas as devolucões não podem ultrapassar o valor total do Pix.",
          pattern: "\\d{1,10}\\.\\d{2}",
        },
        natureza: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoSolicitadaNatureza",
        },
        descricao: {
          type: "string",
          title: "Mensagem ao pagador relativa à devolução.",
          description:
            "O campo `descricao`, opcional, determina um texto a ser apresentado ao pagador contendo informações sobre a devolução. Esse texto será preenchido, na pacs.004, pelo PSP do recebedor, no campo RemittanceInformation. O tamanho do campo na pacs.004 está limitado a 140 caracteres.",
          maxLength: 140,
        },
      },
      required: ["valor"],
    },
    ParametrosConsultaPayloadLocation: {
      type: "object",
      title: "Parâmetros de consulta de locations",
      description: "Parâmetros utilizados para a realização de uma consulta de locations.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        txIdPresente: {
          type: "boolean",
          description: "Filtro pela existência de txid.",
        },
        tipoCob: {
          type: "string",
          enum: ["cob", "cobv"],
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    ParametrosConsultaPayloadLocationRec: {
      type: "object",
      title: "Parâmetros de consulta de locations",
      description: "Parâmetros utilizados para a realização de uma consulta de locations.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        idRecPresente: {
          type: "boolean",
          description: "Filtro pela existência de id da recorrência.",
        },
        recebedor: {
          type: "object",
          title: "Recebedor",
          properties: {
            convenio: {
              type: "string",
              title: "Convênio",
              description: "Convênio entre usuário e participante recebedor.",
              maxLength: 60,
            },
          },
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    PayloadLocationConsultadas: {
      type: "object",
      title: "Locations Consultadas",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaPayloadLocation",
        },
        loc: {
          type: "array",
          title: "Lista de locations cadastradas",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationCompleta",
              },
            ],
          },
        },
      },
      required: ["parametros", "loc"],
    },
    PayloadLocationRecConsultadas: {
      type: "object",
      title: "Locations Consultadas",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaPayloadLocationRec",
        },
        loc: {
          type: "array",
          title: "Lista de locations cadastradas",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecCompleta",
              },
            ],
          },
        },
      },
      required: ["parametros", "loc"],
    },
    ParametrosConsultaPix: {
      type: "object",
      title: "Parâmetros de Consulta Pix",
      description: "Parâmetros utilizados para a realização de uma consulta de Pix.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        txid: {
          allOf: [
            {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
            },
            {
              pattern: "[a-zA-Z0-9]{1,35}",
            },
          ],
        },
        txIdPresente: {
          type: "boolean",
          description: "Filtro pela existência de txid.",
        },
        devolucaoPresente: {
          type: "boolean",
          description: "Filtro pela existência do array de devoluções.",
        },
        finalidadeMED: {
          type: "boolean",
          description:
            "Filtro pela finalidade MED. Quando preenchido com `true` apenas os Pix (PACS008) cuja finalidade seja uma devolução no âmbito do MED serão retornados. Quando preenchido com `false` todos os Pix que não forem MED serão retornados. Na ausência deste filtro, qualquer Pix que atenda aos demais parâmetros de pesquisa será retornado na resposta.",
        },
        cpf: {
          type: "string",
          description: "CPF",
          pattern: "^\\d{11}$",
        },
        cnpj: {
          type: "string",
          description: "CNPJ",
          pattern: "^[0-9A-Z]{14}$",
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
      required: ["inicio", "fim", "paginacao"],
    },
    ParametrosConsultaWebhooks: {
      type: "object",
      title: "Parâmetros de Consulta de Webhooks",
      description: "Parâmetros utilizados para a realização de uma consulta de Webhooks.",
      properties: {
        inicio: {
          type: "string",
          format: "date-time",
          title: "Data de Início",
          description: "Data inicial utilizada na consulta. Respeita RFC 3339.",
        },
        fim: {
          type: "string",
          format: "date-time",
          title: "Data de Fim",
          description: "Data de fim utilizada na consulta. Respeita RFC 3339.",
        },
        paginacao: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Paginacao",
        },
      },
    },
    PixConsultado: {
      type: "object",
      title: "Pix Consultado",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Pix",
        },
        {
          type: "object",
          properties: {
            tributo: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompletoPix",
                },
              ],
            },
          },
        },
      ],
    },
    PixAutomaticoConsultado: {
      type: "object",
      title: "Pix Automático Consultado",
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixAutomatico",
        },
        {
          type: "object",
          properties: {
            tributo: {
              $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TributoCompletoPix",
            },
          },
        },
        {
          type: "object",
          properties: {
            txid: {
              allOf: [
                {
                  $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                },
                {
                  pattern: "[a-zA-Z0-9]{26,35}",
                },
              ],
            },
          },
        },
      ],
    },
    PixConsultados: {
      type: "object",
      title: "Pix Consultados",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaPix",
        },
        pix: {
          type: "array",
          title: "Lista de Pix recebidos",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixConsultado",
              },
            ],
          },
        },
      },
      required: ["parametros", "pix"],
    },
    WebhooksConsultados: {
      type: "object",
      title: "Webhooks Consultados",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaWebhooks",
        },
        webhooks: {
          type: "array",
          title: "Lista de Webhooks consultados",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCompleto",
              },
            ],
          },
        },
      },
      required: ["webhooks"],
    },
    WebhooksRecConsultados: {
      type: "object",
      title: "Webhooks de Recorrências Consultados",
      properties: {
        parametros: {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/ParametrosConsultaWebhooks",
        },
        webhooksrec: {
          type: "array",
          title: "Lista de Webhooks de Recorrências consultados",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookRecCompleto",
              },
            ],
          },
        },
      },
      required: ["webhooksrec"],
    },
    Paginacao: {
      type: "object",
      title: "Paginação",
      properties: {
        paginaAtual: {
          type: "integer",
          title: "Página atual",
          description: "Número da página recuperada.",
          minimum: 0,
        },
        itensPorPagina: {
          type: "integer",
          title: "Itens por página",
          description: "Quantidade de registros retornado na página.",
          minimum: 1,
        },
        quantidadeDePaginas: {
          type: "integer",
          title: "Quantidade de páginas",
          description: "Quantidade de páginas disponíveis para consulta.",
          minimum: 1,
        },
        quantidadeTotalDeItens: {
          type: "integer",
          title: "Quantidade total de itens",
          description:
            "Quantidade total de itens disponíveis de acordo com os parâmetros informados.",
          minimum: 0,
        },
      },
      required: ["paginaAtual", "itensPorPagina", "quantidadeDePaginas", "quantidadeTotalDeItens"],
    },
    Violacao: {
      type: "object",
      title: "Violações",
      properties: {
        razao: {
          type: "string",
          title: "Descrição do erro",
          description: "Descrição do erro",
        },
        propriedade: {
          type: "string",
          title: "Nome da propriedade",
          description: "Nome da propriedade",
        },
        valor: {
          type: "string",
          title: "Valor da propriedade",
          description: "Valor da propriedade",
        },
      },
    },
    Problema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          format: "uri",
          description:
            "URI de referência que identifica o tipo de problema. De acordo com a RFC 7807.",
        },
        title: {
          type: "string",
          description: "Descrição resumida do problema.",
        },
        status: {
          type: "integer",
          description: "Código HTTP do status retornado.",
        },
        detail: {
          type: "string",
          description: "Descrição completa do problema.",
        },
        correlationId: {
          type: "string",
          description: "Identificador de correlação do problema para fins de suporte",
        },
        violacoes: {
          type: "array",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Violacao",
          },
        },
      },
      required: ["type", "title", "status"],
    },
    Inicio: {
      type: "string",
      format: "date-time",
      title: "Data de início",
      description:
        "Filtra os registros cuja data de criação seja maior ou igual que a data de início. Respeita RFC 3339.",
    },
    Fim: {
      type: "string",
      format: "date-time",
      title: "Data de fim",
      description:
        "Filtra os registros cuja data de criação seja menor ou igual que a data de fim. Respeita RFC 3339.",
    },
    LoteCobVBody: {
      properties: {
        descricao: {
          type: "string",
          title: "Descrição do lote",
        },
        cobsv: {
          type: "array",
          items: {
            allOf: [
              {
                type: "object",
                properties: {
                  txid: {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                  },
                },
                required: ["txid"],
              },
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVSolicitada",
              },
            ],
          },
        },
      },
      required: ["descricao", "cobsv"],
    },
    LoteCobVBodyRevisado: {
      properties: {
        descricao: {
          type: "string",
          title: "Descrição do lote",
        },
        cobsv: {
          type: "array",
          items: {
            allOf: [
              {
                type: "object",
                properties: {
                  txid: {
                    $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
                  },
                },
                required: ["txid"],
              },
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVRevisada",
              },
            ],
          },
        },
      },
    },
    WebhookPixBody: {
      properties: {
        pix: {
          type: "array",
          items: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixConsultado",
              },
            ],
          },
        },
      },
    },
    WebhookRecBody: {
      properties: {
        recs: {
          type: "array",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecNotification",
          },
        },
      },
    },
    WebhookCobRBody: {
      properties: {
        cobsr: {
          type: "array",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRNotification",
          },
        },
      },
    },
    WebhookCobBody: {
      properties: {
        cobs: {
          type: "array",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobNotification",
          },
        },
      },
    },
    WebhookCobVBody: {
      properties: {
        cobsv: {
          type: "array",
          items: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVNotification",
          },
        },
      },
    },
    GetPixE2eidResponseSchema: {
      allOf: [
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixConsultado",
        },
      ],
    },
    PostCobrTxidRetentativaDataResponseSchema: {
      allOf: [
        {
          required: ["tentativas"],
        },
        {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRCompleta",
        },
      ],
    },
  },
  operations: {
    GetCobTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          revisao: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Revisao",
          },
        },
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutCobTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PatchCobTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRevisada",
      },
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetCob: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          cpf: {
            type: "string",
            title: "CPF",
            description:
              "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
            pattern: "/^\\d{11}$/",
          },
          cnpj: {
            type: "string",
            title: "CNPJ",
            description:
              "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
            pattern: "^[0-9A-Z]{14}$",
          },
          locationPresente: {
            type: "boolean",
          },
          status: {
            type: "string",
            title: "Status do registro da cobrança",
            description: "Filtro pelo status da cobrança.",
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobsConsultadas",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostCob: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetCobvTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          revisao: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Revisao",
          },
        },
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutCobvTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PatchCobvTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVRevisada",
      },
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetCobv: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          cpf: {
            type: "string",
            title: "CPF",
            description:
              "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
            pattern: "/^\\d{11}$/",
          },
          cnpj: {
            type: "string",
            title: "CNPJ",
            description:
              "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
            pattern: "^[0-9A-Z]{14}$",
          },
          locationPresente: {
            type: "boolean",
          },
          status: {
            type: "string",
            title: "Status do registro da cobrança",
            description: "Filtro pelo status da cobrança.",
          },
          loteCobVId: {
            type: "integer",
            format: "int32",
            title: "Id do lote de cobrança com vencimento",
            description: "Id do lote de cobrança com vencimento.",
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobsVConsultadas",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetLotecobvId: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Identificador do lote de cobranças com vencimento, em formato de texto.",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/LoteCobVConsultado",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutLotecobvId: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Identificador do lote de cobranças com vencimento, em formato de texto.",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/LoteCobVBody",
      },
      responses: {
        "202": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PatchLotecobvId: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Identificador do lote de cobranças com vencimento, em formato de texto.",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/LoteCobVBodyRevisado",
      },
      responses: {
        "202": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetLotecobv: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/LotesCobVConsultados",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetLocrec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          idRecPresente: {
            type: "boolean",
          },
          convenio: {
            type: "string",
            title: "Convênio",
            description: "Filtro pelo convênio associado.",
            maxLength: 60,
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecConsultadas",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostLocrec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecGerada",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetLocrecId: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Id da location cadastrada para servir um payload",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteLocrecIdIdRec: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Id da location cadastrada para servir um payload",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationRecCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetLoc: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          txIdPresente: {
            type: "boolean",
          },
          tipoCob: {
            type: "string",
            enum: ["cob", "cobv"],
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationConsultadas",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostLoc: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocation",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetLocId: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Id da location cadastrada para servir um payload",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocationCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteLocIdTxid: {
      pathParams: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "Id da location cadastrada para servir um payload",
          },
        },
        required: ["id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PayloadLocation",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetPixE2eid: {
      pathParams: {
        type: "object",
        properties: {
          e2eid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/EndToEndId",
          },
        },
        required: ["e2eid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/GetPixE2eidResponseSchema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetPix: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          txid: {
            allOf: [
              {
                $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
              },
              {
                pattern: "[a-zA-Z0-9]{1,35}",
              },
            ],
          },
          txIdPresente: {
            type: "boolean",
          },
          devolucaoPresente: {
            type: "boolean",
          },
          finalidadeMED: {
            type: "boolean",
          },
          cpf: {
            type: "string",
            title: "CPF",
            description:
              "Filtro pelo CPF do pagador. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
            pattern: "/^\\d{11}$/",
          },
          cnpj: {
            type: "string",
            title: "CNPJ",
            description:
              "Filtro pelo CNPJ do pagador. Não pode ser utilizado ao mesmo tempo que o CPF.",
            pattern: "^[0-9A-Z]{14}$",
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PixConsultados",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetPixE2eidDevolucaoId: {
      pathParams: {
        type: "object",
        properties: {
          e2eid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/EndToEndId",
          },
          id: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoId",
          },
        },
        required: ["e2eid", "id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Devolucao",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutPixE2eidDevolucaoId: {
      pathParams: {
        type: "object",
        properties: {
          e2eid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/EndToEndId",
          },
          id: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoId",
          },
        },
        required: ["e2eid", "id"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/DevolucaoSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Devolucao",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetPixUrlAccessToken: {
      pathParams: {
        type: "object",
        properties: {
          pixUrlAccessToken: {
            type: "string",
          },
        },
        required: ["pixUrlAccessToken"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobPayload",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetCobvPixUrlAccessToken: {
      pathParams: {
        type: "object",
        properties: {
          pixUrlAccessToken: {
            type: "string",
          },
        },
        required: ["pixUrlAccessToken"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          codMun: {
            type: "string",
            title: "Código do município",
            pattern: "/^\\d{7}$/",
          },
          DPP: {
            type: "string",
            format: "date",
          },
        },
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobVPayload",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetRecRecUrlAccessToken: {
      pathParams: {
        type: "object",
        properties: {
          recUrlAccessToken: {
            type: "string",
          },
        },
        required: ["recUrlAccessToken"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecPayload",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetWebhookChave: {
      pathParams: {
        type: "object",
        properties: {
          chave: {
            type: "string",
            title: "Chave DICT do recebedor",
            maxLength: 77,
          },
        },
        required: ["chave"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCompleto",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutWebhookChave: {
      pathParams: {
        type: "object",
        properties: {
          chave: {
            type: "string",
            title: "Chave DICT do recebedor",
            maxLength: 77,
          },
        },
        required: ["chave"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookSolicitado",
      },
      responses: {
        "200": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteWebhookChave: {
      pathParams: {
        type: "object",
        properties: {
          chave: {
            type: "string",
            title: "Chave DICT do recebedor",
            maxLength: 77,
          },
        },
        required: ["chave"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "204": null,
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetWebhook: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhooksConsultados",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetWebhookrec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookRecCompleto",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutWebhookrec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookRecSolicitado",
      },
      responses: {
        "200": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteWebhookrec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "204": null,
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetWebhookcobr: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCobRCompleto",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutWebhookcobr: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCobRSolicitado",
      },
      responses: {
        "200": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteWebhookcobr: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "204": null,
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetWebhookcob: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCobCompleto",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutWebhookcob: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCobSolicitado",
      },
      responses: {
        "200": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteWebhookcob: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "204": null,
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetWebhookcobv: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCobVCompleto",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutWebhookcobv: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/WebhookCobVSolicitado",
      },
      responses: {
        "200": null,
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    DeleteWebhookcobv: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "204": null,
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetRecIdRec: {
      pathParams: {
        type: "object",
        properties: {
          idRec: {
            type: "string",
            title: "Id da location cadastrada para servir um payload",
          },
        },
        required: ["idRec"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          txid: {
            type: "string",
            title: "TxId da cobrança associada a recorrência.",
            pattern: "[a-zA-Z0-9]{26,35}",
          },
        },
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PatchRecIdRec: {
      pathParams: {
        type: "object",
        properties: {
          idRec: {
            type: "string",
            title: "Id da location cadastrada para servir um payload",
          },
        },
        required: ["idRec"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecRevisada",
      },
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetRec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          cpf: {
            type: "string",
            title: "CPF",
            description:
              "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
            pattern: "/^\\d{11}$/",
          },
          cnpj: {
            type: "string",
            title: "CNPJ",
            description:
              "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
            pattern: "^[0-9A-Z]{14}$",
          },
          locationPresente: {
            type: "boolean",
          },
          status: {
            type: "string",
            title: "Status do registro da recorrência",
            description: "Filtro pelo status da recorrência.",
          },
          convenio: {
            type: "string",
            title: "Convênio",
            description: "Filtro pelo convênio associado.",
            maxLength: 60,
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecsConsultadas",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostRec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/RecGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostSolicrec: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecCompleta",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetSolicrecIdSolicRec: {
      pathParams: {
        type: "object",
        properties: {
          idSolicRec: {
            type: "string",
            title: "Id da solicitação da recorrência",
          },
        },
        required: ["idSolicRec"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PatchSolicrecIdSolicRec: {
      pathParams: {
        type: "object",
        properties: {
          idSolicRec: {
            type: "string",
            title: "Id da solicitação da recorrência",
          },
        },
        required: ["idSolicRec"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecRevisada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/SolicRecCompleta",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetCobrTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRCompleta",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PutCobrTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PatchCobrTxid: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
        },
        required: ["txid"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRRevisada",
      },
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    GetCobr: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {
          inicio: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Inicio",
          },
          fim: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Fim",
          },
          idRec: {
            type: "string",
            title: "ID Recorrência",
            description: "Filtro pelo Identificador da Recorrência.",
            minLength: 29,
            maxLength: 29,
            pattern: "[a-zA-Z0-9]{29}",
          },
          cpf: {
            type: "string",
            title: "CPF",
            description:
              "Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.",
            pattern: "/^\\d{11}$/",
          },
          cnpj: {
            type: "string",
            title: "CNPJ",
            description:
              "Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.",
            pattern: "^[0-9A-Z]{14}$",
          },
          status: {
            type: "string",
            title: "Status do registro da cobrança recorrente.",
            description: "Filtro pelo status da cobrança recorrente.",
          },
          convenio: {
            type: "string",
            title: "Convênio",
            description: "Filtro pelo convênio associado.",
            maxLength: 60,
          },
          "paginacao.paginaAtual": {
            type: "integer",
            format: "int32",
            title: "Página atual",
            description:
              "Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0.",
            minimum: 0,
            default: 0,
          },
          "paginacao.itensPorPagina": {
            type: "integer",
            format: "int32",
            title: "Itens por Página",
            description:
              "Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros.",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
        required: ["inicio", "fim"],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "200": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobsRConsultadas",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostCobr: {
      pathParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: {
        $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRSolicitada",
      },
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/CobRGerada",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
    PostCobrTxidRetentativaData: {
      pathParams: {
        type: "object",
        properties: {
          txid: {
            $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/TxId",
          },
          data: {
            type: "string",
            format: "date",
          },
        },
        required: ["txid", "data"],
        additionalProperties: true,
      },
      queryParams: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      requestBody: null,
      responses: {
        "201": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/PostCobrTxidRetentativaDataResponseSchema",
        },
        "400": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "403": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "404": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
        "503": {
          $ref: "https://pix-sdk.br/spec/openapi.json#/definitions/Problema",
        },
      },
    },
  },
};
