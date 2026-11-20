/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * TypeScript types for every schema in the spec, with the upstream pt-BR descriptions as TSDoc.
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

/**
 * **Id da Transação**
 *
 * # Identificador da transação
 *
 * O campo `txid` determina o identificador da transação.
 * O objetivo desse campo é ser um elemento que possibilite ao PSP do recebedor apresentar ao usuário recebedor a funcionalidade de conciliação de pagamentos.
 *
 * Na pacs.008, é referenciado como `TransactionIdentification <txId>` ou `idConciliacaoRecebedor`.
 *
 * Em termos de fluxo de funcionamento, o txid é lido pelo aplicativo do PSP do pagador e,
 * depois de confirmado o pagamento, é enviado para o SPI via pacs.008.
 * Uma pacs.008 também é enviada ao PSP do recebedor, contendo, além de todas as informações usuais
 * do pagamento, o txid.
 * Ao perceber um recebimento dotado de txid, o PSP do recebedor está apto a se comunicar com o usuário recebedor,
 * informando que um pagamento específico foi liquidado.
 *
 * O txid é criado exclusivamente pelo usuário recebedor e está sob sua responsabilidade.
 * O txid, no contexto de representação de uma cobrança, é único por CPF/CNPJ do usuário recebedor. Cabe ao
 * PSP recebedor validar essa regra na API Pix.
 */
export type TxId = string;

/**
 * **Id fim a fim da transação**
 *
 * EndToEndIdentification que transita na PACS002, PACS004 e PACS008
 */
export type EndToEndId = string;

/**
 * **Id da Devolução**
 *
 * Id gerado pelo cliente para representar unicamente uma devolução.
 */
export type DevolucaoId = string;

/**
 * **Natureza da Devolução Solicitada**
 *
 * Indica qual é a natureza da devolução solicitada. Uma solicitação de devolução pelo usuário recebedor pode ser relacionada a um Pix
 *  comum (com código: `MD06` da pacs.004), ou a um Pix de Saque ou Troco (com códigos possíveis: `MD06` e `SL02` da pacs.004). Na ausência
 *  deste campo a natureza deve ser interpretada como sendo de um Pix comum (`ORIGINAL`).
 *
 * As naturezas são assim definidas:
 * - `ORIGINAL`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix comum ou ao valor da compra em um Pix Troco (`MD06`);
 * - `RETIRADA`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix Saque ou ao valor do troco em um Pix Troco (`SL02`).
 *
 * Os valores de devoluções são sempre limitados aos valores máximos a seguir:
 * - Pix comum: o valor da devolução é limitado ao valor do próprio Pix (a natureza nesse caso deve ser: ORIGINAL);
 * - Pix Saque: o valor da devolução é limitado ao valor da retirada (a natureza nesse caso deve ser: RETIRADA); e
 * - Pix Troco: o valor da devolução é limitado ao valor relativo à compra ou ao troco:
 *   - Quando a devolução for referente à compra, o valor limita-se ao valor da compra (a natureza nesse caso deve ser ORIGINAL); e
 *   - Quando a devolução for referente ao troco, o valor limita-se ao valor do troco (a natureza nesse caso deve ser RETIRADA).
 */
export type DevolucaoSolicitadaNatureza = "ORIGINAL" | "RETIRADA";

/**
 * **Natureza da Devolução**
 *
 * Indica qual é a natureza da devolução. Uma devolução pode ser relacionada a um Pix comum (com códigos possíveis: `MD06`, `BE08` e `FR01` da pacs.004 e `REFU` da pacs.008),
 * ou a um Pix de Saque ou Troco (com códigos possíveis:  `MD06` e `SL02` da pacs.004). Na ausência deste campo a natureza deve ser interpretada como
 * sendo de um Pix comum (`ORIGINAL`).
 *
 * As naturezas são assim definidas:
 *   - `ORIGINAL`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix comum ou ao valor da compra em um Pix Troco (`MD06`);
 *   - `RETIRADA`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix Saque ou ao valor do troco em um Pix Troco (`SL02`);
 *   - `MED_OPERACIONAL`: quando a devolução ocorre no âmbito do MED por motivo de falha operacional e se refere a um Pix comum (`BE08`);
 *   - `MED_FRAUDE`: quando a devolução ocorre no âmbito do MED por fundada suspeita de fraude e se refere a um Pix comum (`FR01`).
 *   - `MED_PIX_AUTOMATICO` (em desuso - será removido na próxima major release): reembolso total ou parcial ao participante do usuário pagador no âmbito do MED (Mecanismo Especial de Devolução) para o Pix Automático pela utilização de recursos próprios para ressarcimento do usuário pagador.(`REFU`);
 *
 * Os valores de devoluções são sempre limitados aos valores máximos a seguir:
 * - Pix comum: o valor da devolução é limitado ao `valor` do próprio Pix (a natureza nesse caso pode ser: ORIGINAL, MED_OPERACIONAL ou MED_FRAUDE);
 * - Pix Saque: o valor da devolução é limitado ao valor da retirada (a natureza nesse caso deve ser: RETIRADA); e
 * - Pix Troco: o valor da devolução é limitado ao valor relativo à compra ou ao troco:
 *   - Quando a devolução for referente à compra, o valor limita-se ao valor da compra (a natureza nesse caso deve ser ORIGINAL); e
 *   - Quando a devolução for referente ao troco, o valor limita-se ao valor do troco (a natureza nesse caso deve ser RETIRADA).
 */
export type DevolucaoNatureza =
  "ORIGINAL" | "RETIRADA" | "MED_OPERACIONAL" | "MED_FRAUDE" | "MED_PIX_AUTOMATICO";

/**
 * **Natureza da Devolução**
 *
 * Indica qual é a natureza da devolução. Uma devolução pode ser relacionada a um Pix comum (com códigos possíveis: `MD06` e `FR01` da pacs.004 e `REFU` da pacs.008). Na ausência deste campo a natureza deve ser interpretada como
 * sendo de um Pix comum (`ORIGINAL`).
 *
 * As naturezas são assim definidas:
 *   - `ORIGINAL`: quando a devolução é solicitada pelo usuário recebedor e se refere a um Pix comum (`MD06`);
 *   - `MED_FRAUDE`: quando a devolução ocorre no âmbito do MED (Mecanismo Especial de Devolução) por fundada suspeita de fraude e se refere a um Pix comum (`FR01`).
 *   - `MED_PIX_AUTOMATICO` (em desuso - será removido na próxima major release): reembolso total ou parcial ao participante do usuário pagador no âmbito do MED (Mecanismo Especial de Devolução) para o Pix Automático pela utilização de recursos próprios para ressarcimento do usuário pagador.(`REFU`);
 *
 * Os valores de devoluções são sempre limitados aos valores máximos a seguir:
 * - Pix comum: o valor da devolução é limitado ao `valor` do próprio Pix (a natureza nesse caso pode ser: ORIGINAL, MED_PIX_AUTOMATICO ou MED_FRAUDE);
 */
export type DevolucaoNaturezaPixAutomatico = "ORIGINAL" | "MED_PIX_AUTOMATICO" | "MED_FRAUDE";

/**
 * **Id da location**
 *
 * Identificador da location a ser informada na criação da cobrança .
 */
export type PayloadLocationId = number;

/**
 * **Id da location**
 *
 * Identificador da location a ser informada na criação de uma recorrência .
 */
export type PayloadLocationRecId = number;

/**
 * **Revisão**
 *
 * # O campo `revisao`
 *
 * Denota a revisão da cobrança.  Sempre começa em zero. Sempre varia em acréscimos de 1.
 *
 * O incremento em uma cobrança deve ocorrer sempre que um objeto da cobrança em questão for alterado.
 * O campo `loc` é uma exceção a esta regra.
 *
 * Se em uma determinada alteração em uma cobrança, o único campo alterado for o campo `loc`,
 * então esta operação não incrementa a revisão da cobrança.
 *
 * O campo `loc` não ocasiona uma alteração na cobrança em si.
 * Não é necessário armazenar histórico das alterações do campo `loc` para uma determinada cobrança.
 * Para os outros campos da cobrança, registra-se histórico.
 */
export type Revisao = number;

/** **Pessoa Física** */
export interface PessoaFisica {
  /**
   * **CPF**
   *
   * CPF do usuário.
   */
  cpf: string;
  /**
   * **Nome**
   *
   * Nome do usuário.
   */
  nome: string;
}

/** **Pessoa Jurídica** */
export interface PessoaJuridica {
  /**
   * **CNPJ**
   *
   * CNPJ do usuário.
   */
  cnpj: string;
  /**
   * **Nome**
   *
   * Nome do usuário.
   */
  nome: string;
}

/** **Pessoa Física** */
export interface PessoaFisicaRecorrencia {
  /**
   * **CPF**
   *
   * CPF do usuário.
   */
  cpf: string;
  /**
   * **Nome**
   *
   * Nome do usuário.
   */
  nome: string;
}

/** **Pessoa Jurídica** */
export interface PessoaJuridicaRecorrencia {
  /**
   * **CNPJ**
   *
   * CNPJ do usuário.
   */
  cnpj: string;
  /**
   * **Nome**
   *
   * Nome do usuário.
   */
  nome: string;
}

/** **Pessoa Física** */
export interface CPF {
  /**
   * **CPF**
   *
   * CPF do usuário.
   */
  cpf: string;
}

/** **Pessoa Jurídica** */
export interface CNPJ {
  /**
   * **CNPJ**
   *
   * CNPJ do usuário.
   */
  cnpj: string;
}

export interface DadosComplementaresPessoa {
  /**
   * **Logradouro**
   *
   * Logradouro do usuário.
   */
  logradouro?: string;
  /**
   * **Cidade**
   *
   * Cidade do usuário.
   */
  cidade?: string;
  /**
   * **UF**
   *
   * UF do usuário.
   */
  uf?: string;
  /**
   * **CEP**
   *
   * CEP do usuário.
   */
  cep?: string;
}

export interface DadosDevedor {
  /** O objeto devedor organiza as informações sobre o devedor da cobrança. */
  devedor?: {
    email?: string;
  } & DadosComplementaresPessoa &
    (PessoaFisica | PessoaJuridica);
}

export interface DadosDevedorRecorrencia {
  /** O objeto devedor organiza as informações sobre o devedor da recorrência. */
  devedor?: {
    email?: string;
  } & DadosComplementaresPessoa;
}

export interface DadosRecebedor {
  /** O objeto recebedor organiza as informações sobre o credor da cobrança. */
  recebedor?: {
    logradouro: DadosComplementaresPessoa["logradouro"];
    cidade: DadosComplementaresPessoa["cidade"];
    uf: DadosComplementaresPessoa["uf"];
    cep: DadosComplementaresPessoa["cep"];
  } & DadosComplementaresPessoa &
    (
      | PessoaFisica
      | ({
          nomeFantasia?: string;
        } & PessoaJuridica)
    );
}

export interface DadosBancarios {
  /**
   * **Conta do Usuário Pagador**
   *
   * Número da conta do usuário pagador.
   */
  conta: string;
  /**
   * **ISPB do usuário pagador.**
   *
   * ISPB do usuário pagador.
   */
  ispbParticipante: string;
  /**
   * **Agência do Usuário Pagador**
   *
   * Número da agência do usuário pagador.
   */
  agencia?: string;
}

export interface DadosBancariosRecebedor {
  /** Número da conta do usuário recebedor. */
  conta: string;
  /**
   * **Tipo da conta do usuário recebedor**
   *
   * Tipo da conta do usuário recebedor.
   */
  tipoConta: "CORRENTE" | "POUPANCA" | "PAGAMENTO";
  /** Número da agência do usuário recebedor. */
  agencia?: string;
}

/** **Dados do Pagador** */
export interface DadosPagadorRec {
  pagador?: {
    ispbParticipante: string;
    codMun?: string;
  } & (CPF | CNPJ);
}

/** **Webhook** */
export interface WebhookSolicitado {
  webhookUrl: string;
}

/** **Webhook** */
export interface WebhookCompleto {
  webhookUrl: string;
  /**
   * **CNPJ**
   *
   * Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.
   */
  cnpj: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.
   */
  criacao: string;
}

/** **Webhook Base** */
export interface WebhookRecBase {
  /** **URL Webhook** */
  webhookUrl: string;
}

/** **Webhook Base** */
export interface WebhookRecCompleto {
  /** **URL Webhook** */
  webhookUrl: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.
   */
  criacao?: string;
}

/** **Webhook Base** */
export interface WebhookCobRCompleto {
  /** **URL Webhook** */
  webhookUrl: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.
   */
  criacao?: string;
}

/** **Webhook Base** */
export interface WebhookCobCompleto {
  /** **URL Webhook** */
  webhookUrl: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.
   */
  criacao?: string;
}

/** **Webhook Base** */
export interface WebhookCobVSolicitado {
  /** **URL Webhook** */
  webhookUrl: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.
   */
  criacao?: string;
}

/** **Webhook Base** */
export interface WebhookCobVCompleto {
  /** **URL Webhook** */
  webhookUrl: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que o webhook foi cadastrado. Respeita RFC 3339.
   */
  criacao?: string;
}

/** **Informações de Agência e Conta** */
export interface InfoBaseAgenciaConta {
  /**
   * **Agência**
   *
   * Número da agência do usuário.
   */
  agencia: string;
  /**
   * **Conta Corrente**
   *
   * Número da conta do usuário.
   */
  conta: string;
}

/** **Informação de Chave DICT** */
export interface InfoBaseChave {
  /** **Tipo do Objeto** */
  tipo: "pix";
  /**
   * **Chave DICT do recebedor**
   *
   * # Formato do campo chave
   *
   * * O campo chave determina a chave Pix registrada no DICT que será utilizada para a cobrança. Essa chave será lida pelo aplicativo do PSP do pagador para consulta ao DICT, que retornará a informação que identificará o recebedor da cobrança.
   * * Os tipos de chave podem ser: telefone, e-mail, cpf/cnpj ou EVP.
   * * O formato das chaves pode ser encontrado na seção "Formatação das chaves do DICT no BR Code" do [Manual de Padrões para iniciação do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).
   */
  chave: string;
}

/** **Webhook Solicitado** */
export type WebhookRecSolicitado = WebhookRecBase;

/** **Webhook Base** */
export interface WebhookCobRSolicitado {
  /** **URL Webhook** */
  webhookUrl: string;
}

/** **Webhook Base** */
export interface WebhookCobSolicitado {
  /** **URL Webhook** */
  webhookUrl: string;
}

/** **Expiração** */
export interface CobExpiracao {
  /**
   * **Tempo de vida da cobrança, especificado em segundos.**
   *
   * Tempo de vida da cobrança, especificado em segundos a partir da data de criação (Calendario.criacao)
   */
  expiracao?: number;
}

/** **Data de Vencimento** */
export interface CobDataDeVencimento {
  /**
   * **Data de vencimento da cobrança**
   *
   * Trata-se de uma data, no formato `YYYY-MM-DD`, segundo ISO 8601. É a data de vencimento da cobrança. A cobrança pode ser honrada até esse dia, inclusive, em qualquer horário do dia.
   */
  dataDeVencimento: string;
  /**
   * **Validade após vencimento**
   *
   * Trata-se da quantidade de dias corridos após calendario.dataDeVencimento,
   * em que a cobrança poderá ser paga.
   *
   * Sempre que a data de vencimento cair em um fim de semana ou em um feriado para o usuário pagador,
   *  ela deve ser automaticamente prorrogada para o primeiro dia útil subsequente. Todos os campos
   *  que façam referência a esta data (`validadeAposVencimento`; `desconto`; `juros` e `multa`) devem assumir
   *  essa prorrogação, quando for o caso.
   *
   * Para ilustrar o funcionamento, seguem alguns exemplos, onde:
   * - ``(#)`` representa a data de vencimento;
   * - ``(*)`` representa a data ajustada em função de dias não úteis;
   * - os ``(<número>)`` correspondem aos dias adicionais de validade para o pagamento.
   *
   * Exemplo A:
   *
   * ```txt
   * dataDeVencimento: 2020-10-20, terça-feira.
   * validadeAposVencimento: 4
   *
   * Tenta-se pagar no dia 2020-10-20, terça: aceito. (#)(*)
   * Tenta-se pagar no dia 2020-10-21, quarta: aceito. (1)
   * Tenta-se pagar no dia 2020-10-22, quinta: aceito. (2)
   * Tenta-se pagar no dia 2020-10-23, sexta: aceito. (3)
   * Tenta-se pagar no dia 2020-10-24, sábado: aceito.
   * Tenta-se pagar no dia 2020-10-25, domingo: aceito. (Feriado)
   * Tenta-se pagar no dia 2020-10-26, segunda: aceito. (4)
   * Tenta-se pagar no dia 2020-10-27, terça: negado.
   * ```
   *
   * Exemplo B:
   *
   * ```txt
   * dataDeVencimento: 2020-12-25, sexta-feira, feriado.
   * validadeAposVencimento: 0
   *
   * Tenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)
   * Tenta-se pagar no dia 2020-12-26, sábado: aceito.
   * Tenta-se pagar no dia 2020-12-27, domingo: aceito.
   * Tenta-se pagar no dia 2020-12-28, segunda: aceito. (*)
   * Tenta-se pagar no dia 2020-12-29, terça: negado.
   * ```
   *
   * Exemplo C:
   *
   * ```txt
   * dataDeVencimento: 2020-12-25, sexta-feira, feriado.
   * validadeAposVencimento: 1
   *
   * Tenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)
   * Tenta-se pagar no dia 2020-12-26, sábado: aceito.
   * Tenta-se pagar no dia 2020-12-27, domingo: aceito.
   * Tenta-se pagar no dia 2020-12-28, segunda: aceito. (*)
   * Tenta-se pagar no dia 2020-12-29, terça: aceito. (1)
   * Tenta-se pagar no dia 2020-12-30, quarta: negado.
   * ```
   *
   * Exemplo D:
   *
   * ```txt
   * dataDeVencimento: 2020-12-25, sexta-feira, feriado.
   * validadeAposVencimento: 3
   *
   * Tenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)
   * Tenta-se pagar no dia 2020-12-26, sábado: aceito.
   * Tenta-se pagar no dia 2020-12-27, domingo: aceito.
   * Tenta-se pagar no dia 2020-12-28, segunda: aceito. (*)
   * Tenta-se pagar no dia 2020-12-29, terça: aceito. (1)
   * Tenta-se pagar no dia 2020-12-30, quarta: aceito. (2)
   * Tenta-se pagar no dia 2020-12-31, quinta: aceito. (3)
   * Tenta-se pagar no dia 2021-01-01, sexta: negado.
   * ```
   *
   * Exemplo E:
   *
   * ```txt
   * dataDeVencimento: 2020-12-25, sexta-feira, feriado.
   * validadeAposVencimento: 4
   *
   * Tenta-se pagar no dia 2020-12-25, sexta: aceito. (#)(Feriado)
   * Tenta-se pagar no dia 2020-12-26, sábado: aceito.
   * Tenta-se pagar no dia 2020-12-27, domingo: aceito.
   * Tenta-se pagar no dia 2020-12-28, segunda: aceito. (*)
   * Tenta-se pagar no dia 2020-12-29, terça: aceito. (1)
   * Tenta-se pagar no dia 2020-12-30, quarta: aceito. (2)
   * Tenta-se pagar no dia 2020-12-31, quinta: aceito. (3)
   * Tenta-se pagar no dia 2021-01-01, sexta: aceito. (Feriado)
   * Tenta-se pagar no dia 2021-01-02, sábado: aceito.
   * Tenta-se pagar no dia 2021-01-03, domingo: aceito.
   * Tenta-se pagar no dia 2021-01-04, segunda: aceito. (4)
   * Tenta-se pagar no dia 2021-01-05, terça: negado.
   * ```
   *
   * Exemplo F:
   *
   * ```txt
   * dataDeVencimento: 2021-08-27, sexta-feira.
   * validadeAposVencimento: 5
   *
   * Tenta-se pagar no dia 2021-08-27, sexta: aceito. (#)(*)
   * Tenta-se pagar no dia 2021-08-28, sábado: aceito. (1)
   * Tenta-se pagar no dia 2021-08-29, domingo: aceito. (2)
   * Tenta-se pagar no dia 2021-08-30, segunda: aceito. (3)
   * Tenta-se pagar no dia 2021-08-31, terça: aceito. (4)
   * Tenta-se pagar no dia 2021-09-01, quarta: aceito. (5)
   * Tenta-se pagar no dia 2021-09-02, quinta: negado.
   * ```
   *
   * Exemplo G:
   *
   * ```txt
   * dataDeVencimento: 2021-08-28, sábado.
   * validadeAposVencimento: 5
   *
   * Tenta-se pagar no dia 2021-08-28, sábado: aceito. (#)
   * Tenta-se pagar no dia 2021-08-29, domingo: aceito.
   * Tenta-se pagar no dia 2021-08-30, segunda: aceito. (*)
   * Tenta-se pagar no dia 2021-08-31, terça: aceito. (1)
   * Tenta-se pagar no dia 2021-09-01, quarta: aceito. (2)
   * Tenta-se pagar no dia 2021-09-02, quinta: aceito. (3)
   * Tenta-se pagar no dia 2021-09-03, sexta: aceito. (4)
   * Tenta-se pagar no dia 2021-09-04, sabado: aceito.
   * Tenta-se pagar no dia 2021-09-05, domingo: aceito.
   * Tenta-se pagar no dia 2021-09-06, segunda: aceito. (5)
   * ```
   */
  validadeAposVencimento?: number;
}

/** **Apresentação** */
export interface CobApresentacao {
  /**
   * **Timestamp de apresentação do QR Code**
   *
   * Timestamp que indica o momento em que o payload JSON que representa a cobrança foi recuperado. Ou seja, idealmente, é o momento em que o usuário realizou a captura do QR Code para verificar os dados de pagamento. Respeita o formato definido na RFC 3339.
   */
  apresentacao: string;
}

/** **Criação** */
export interface CobCriacao {
  /**
   * **Data de Criação**
   *
   * Timestamp que indica o momento em que foi criada a cobrança. Respeita o formato definido na RFC 3339.
   */
  criacao: string;
}

/**
 * **Valor da cobrança com vencimento**
 *
 * Valores monetários.
 */
export interface CobVValor {
  /**
   * **Valor**
   *
   * Valor original da cobrança.
   */
  original?: string;
  /**
   * **Multa aplicada**
   *
   * Multa aplicada à cobrança
   */
  multa?: {
    modalidade: number;
    valorPerc: string;
  };
  /**
   * **Juro aplicado**
   *
   * Juro aplicado à cobrança
   */
  juros?: {
    modalidade: number;
    valorPerc: string;
  };
  /**
   * **Abatimento aplicado**
   *
   * Abatimento aplicado à cobrança
   */
  abatimento?: {
    modalidade: number;
    valorPerc: string;
  };
  /**
   * **Descontos aplicados**
   *
   * Descontos aplicados à cobrança
   */
  desconto?: {
    modalidade: number;
  } & (
    | {
        descontoDataFixa?: {
          data: string;
          valorPerc: string;
        }[];
      }
    | {
        valorPerc: string;
      }
  );
}

/**
 * **Valor da cobrança imediata**
 *
 * valores monetários referentes à cobrança.
 */
export interface CobValor {
  /**
   * **Valor**
   *
   * Valor original da cobrança.
   */
  original?: string;
  /**
   * **Modalidade de alteração**
   *
   * Trata-se de um campo que determina se o valor final do documento pode ser alterado pelo pagador. Na ausência desse campo, assume-se que não se pode alterar o valor do documento de cobrança, ou seja, assume-se o valor 0. Se o campo estiver presente e com valor 1, então está determinado que o valor final da cobrança pode ter seu valor alterado pelo pagador.
   */
  modalidadeAlteracao?: number;
  /**
   * **Informações de retirada**
   *
   * É uma estrutura opcional relacionada ao conceito de recebimento de numerário. Apenas um agrupamento por vez é permitido, quando há `saque` não há `troco` e vice-versa.
   *
   * Quando uma cobrança imediata tem uma estrutura de `retirada` ela deixa de ser considerada Pix comum e passa à categoria de Pix Saque ou Pix Troco.
   *
   * Para que o preenchimento do objeto `retirada` seja considerado válido as seguintes regras se aplicam:
   * - os campos `modalidadeAgente` e `prestadorDoServicoDeSaque` são de **preenchimento obrigatório**;
   * - quando o `saque` estiver presente a cobrança deve respeitar as seguintes condições:
   *   - O campo `valor.original` deve ser preenchido com **valor igual a 0.00 (zero)**;
   *   - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).
   * - quando o `troco` estiver presente a cobrança deve respeitar as seguintes condições:
   *   - O campo `valor.original` deve ser preenchido com **valor maior que 0.00 (zero)**;
   *   - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).
   *
   * **IMPORTANTE**:
   * - Quando usados o `saque` ou `troco` não será permitida a alteração do `valor.original` recebido. Na presença de `saque` ou `troco` o recebimento do campo `valor.modalidadeAlteracao` com valor 1 (um) é considerado erro.
   * - O campo `modalidadeAgente` é de preenchimento obrigatório tanto para o saque quanto para o troco. No mapeamento do campo da API Pix (AGPSS) para o campo 'modalidadeAgente', da pacs.008, o domínio a ser considerado é AGFSS.
   *
   * #### Exemplos válidos:
   * Considerando os campos da estrutura `valor` e o predicado 'presente' cujo resultado é verdade quando a estrutura apontada é encontrada temos:
   * - **uma cobrança com valor fixo** (condições: valor.original > 0 && valor.modalidadeAlteração = 0 && !presente(valor.retirada))
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00"
   *   },
   *   ...
   *   ```
   * - **uma cobrança com valor alterável** (condições: valor.original >= 0.00 && modalidadeAlteração = 1 && !presente(valor.retirada))
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00",
   *     "modalidadeAlteracao": 1
   *   },
   *   ```
   * - **saque com valor fixo** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor > 0 && valor.retirada.saque.modalidadeAlteracao = 0)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **saque com valor alterável** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor >= 0 && valor.retirada.saque.modalidadeAlteracao = 1)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAlteracao": 1,
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **cobrança com troco fixo** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor > 0 && valor.retirada.troco.modalidadeAlteracao = 0)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00",
   *     "retirada": {
   *       "troco": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGTEC",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **cobrança com troco alterável** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor >= 0 && valor.retirada.troco.modalidadeAlteracao = 1)
   *   ```
   *   ...
   *     "valor": {
   *       "original": "10.00",
   *       "retirada": {
   *         "troco": {
   *           "valor": "0.00",
   *           "modalidadeAlteracao": 1,
   *           "modalidadeAgente": "AGTEC",
   *           "prestadorDoServicoDeSaque": "12345678"
   *         }
   *       }
   *     },
   *   ...
   *   ```
   * #### Exemplos inválidos:
   * Abaixo alguns exemplos que **não são válidos**. Convém observar que esta listagem não tem pretensão de ser completa, sendo tão somente uma referência para alguns erros possíveis.
   * - **saque sem `modalidadeAgente` e `prestadorDoServicoDeSaque`**
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **cobrança com saque e troco juntos** (não pode ter os dois ao mesmo tempo)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "100.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "50.00",
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       },
   *       "troco": {
   *         "valor": "30.00",
   *         "modalidadeAgente": "AGTEC",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **saque com valor.original maior que 0.00 (zero)** (saque requer valor.original = 0.00)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **troco com valor.original igual a 0.00 (zero)** (para haver troco tem que haver valor.original > 0.00)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "troco": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGTEC",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **saque com valor.original alterável** (não se pode alterar o valor.original na presença do saque)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "modalidadeAlteracao": 1,
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAlteracao": 1,
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **troco com valor.original alterável** (não se pode alterar o valor.original na presença do troco)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.01",
   *     "modalidadeAlteracao": 1,
   *     "retirada": {
   *       "troco": {
   *         "valor": "5.00",
   *         "modalidadeAlteracao": 1,
   *         "modalidadeAgente": "AGTOT",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   */
  retirada?:
    | {
        saque: {
          valor: string;
          modalidadeAlteracao?: number;
          modalidadeAgente: "AGTEC" | "AGTOT" | "AGPSS" | "AGFSS";
          prestadorDoServicoDeSaque: string;
        };
      }
    | {
        troco: {
          valor: string;
          modalidadeAlteracao?: number;
          modalidadeAgente: "AGTEC" | "AGTOT";
          prestadorDoServicoDeSaque: string;
        };
      };
}

/**
 * **Valor da cobrança imediata retornada pelo payload**
 *
 * Todos os campos que indicam valores monetários obedecem ao pattern \d{1,10}\.\d{2}. O separador decimal é o caractere ponto. Não é aplicável utilizar separador de milhar. Exemplos de valores aderentes ao padrão: “1.00”, “123.99”, “123456789.23
 */
export interface CobPayloadValor {
  /**
   * **Valor**
   *
   * Valor original da cobrança.
   */
  original: string;
  /**
   * **Modalidade de alteração**
   *
   * Trata-se de um campo que determina se o valor final do documento pode ser alterado pelo pagador. Na ausência desse campo, assume-se que não se pode alterar o valor do documento de cobrança, ou seja, assume-se o valor 0. Se o campo estiver presente e com valor 1, então está determinado que o valor final da cobrança pode ter seu valor alterado pelo pagador.
   */
  modalidadeAlteracao?: number;
  /**
   * **Informações de retirada**
   *
   * É uma estrutura opcional relacionada ao conceito de recebimento de numerário. Apenas um agrupamento por vez é permitido, quando há `saque` não há `troco` e vice-versa.
   *
   * Quando uma cobrança imediata tem uma estrutura de `retirada` ela deixa de ser considerada Pix comum e passa à categoria de Pix Saque ou Pix Troco.
   *
   * Para que o preenchimento do objeto `retirada` seja considerado válido as seguintes regras se aplicam:
   * - os campos `modalidadeAgente` e `prestadorDoServicoDeSaque` são de **preenchimento obrigatório**;
   * - quando o `saque` estiver presente a cobrança deve respeitar as seguintes condições:
   *   - O campo `valor.original` deve ser preenchido com **valor igual a 0.00 (zero)**;
   *   - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).
   * - quando o `troco` estiver presente a cobrança deve respeitar as seguintes condições:
   *   - O campo `valor.original` deve ser preenchido com **valor maior que 0.00 (zero)**;
   *   - O campo `valor.modalidadeAlteracao` deve possuir o valor 0 (zero) explicitamente, ou implicitamente (pelo não preenchimento).
   *
   * **IMPORTANTE**:
   * - Quando usados o `saque` ou `troco` não será permitida a alteração do `valor.original` recebido. Na presença de `saque` ou `troco` o recebimento do campo `valor.modalidadeAlteracao` com valor 1 (um) é considerado erro.
   * - O campo `modalidadeAgente` é de preenchimento obrigatório tanto para o saque quanto para o troco. No caso do saque, o valor "AGPSS" foi substituído por "AGFSS".
   *
   * #### Exemplos válidos:
   * Considerando os campos da estrutura `valor` e o predicado 'presente' cujo resultado é verdade quando a estrutura apontada é encontrada temos:
   * - **uma cobrança com valor fixo** (condições: valor.original > 0 && valor.modalidadeAlteração = 0 && !presente(valor.retirada))
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00"
   *   },
   *   ...
   *   ```
   * - **uma cobrança com valor alterável** (condições: valor.original >= 0.00 && modalidadeAlteração = 1 && !presente(valor.retirada))
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00",
   *     "modalidadeAlteracao": 1
   *   },
   *   ```
   * - **saque com valor fixo** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor > 0 && valor.retirada.saque.modalidadeAlteracao = 0)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **saque com valor alterável** (condições: valor.original = 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.saque) && valor.retirada.saque.valor >= 0 && valor.retirada.saque.modalidadeAlteracao = 1)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAlteracao": 1,
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **cobrança com troco fixo** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor > 0 && valor.retirada.troco.modalidadeAlteracao = 0)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00",
   *     "retirada": {
   *       "troco": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGTEC",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **cobrança com troco alterável** (condições: valor.original > 0.00 && valor.modalidadeAlteração = 0 && presente(valor.retirada.troco) && valor.retirada.troco.valor >= 0 && valor.retirada.troco.modalidadeAlteracao = 1)
   *   ```
   *   ...
   *     "valor": {
   *       "original": "10.00",
   *       "retirada": {
   *         "troco": {
   *           "valor": "0.00",
   *           "modalidadeAlteracao": 1,
   *           "modalidadeAgente": "AGTEC",
   *           "prestadorDoServicoDeSaque": "12345678"
   *         }
   *       }
   *     },
   *   ...
   *   ```
   * #### Exemplos inválidos:
   * Abaixo alguns exemplos que **não são válidos**. Convém observar que esta listagem não tem pretensão de ser completa, sendo tão somente uma referência para alguns erros possíveis.
   * - **saque sem `modalidadeAgente` e `prestadorDoServicoDeSaque`**
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **cobrança com saque e troco juntos** (não pode ter os dois ao mesmo tempo)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "100.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "50.00",
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       },
   *       "troco": {
   *         "valor": "30.00",
   *         "modalidadeAgente": "AGTEC",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **saque com valor.original maior que 0.00 (zero)** (saque requer valor.original = 0.00)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "10.00",
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **troco com valor.original igual a 0.00 (zero)** (para haver troco tem que haver valor.original > 0.00)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "retirada": {
   *       "troco": {
   *         "valor": "5.00",
   *         "modalidadeAgente": "AGTEC",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **saque com valor.original alterável** (não se pode alterar o valor.original na presença do saque)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.00",
   *     "modalidadeAlteracao": 1,
   *     "retirada": {
   *       "saque": {
   *         "valor": "5.00",
   *         "modalidadeAlteracao": 1,
   *         "modalidadeAgente": "AGFSS",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   * - **troco com valor.original alterável** (não se pode alterar o valor.original na presença do troco)
   *   ```
   *   ...
   *   "valor": {
   *     "original": "0.01",
   *     "modalidadeAlteracao": 1,
   *     "retirada": {
   *       "troco": {
   *         "valor": "5.00",
   *         "modalidadeAlteracao": 1,
   *         "modalidadeAgente": "AGTOT",
   *         "prestadorDoServicoDeSaque": "12345678"
   *       }
   *     }
   *   },
   *   ...
   *   ```
   */
  retirada?:
    | {
        saque: {
          valor: string;
          modalidadeAlteracao?: number;
          modalidadeAgente: "AGTEC" | "AGTOT" | "AGPSS" | "AGFSS";
          prestadorDoServicoDeSaque: string;
        };
      }
    | {
        troco: {
          valor: string;
          modalidadeAlteracao?: number;
          modalidadeAgente: "AGTEC" | "AGTOT";
          prestadorDoServicoDeSaque: string;
        };
      };
}

/**
 * **Valor da cobrança com vencimento calculada retornada pelo payload**
 *
 * Todos os campos que indicam valores monetários obedecem ao pattern \d{1,10}\.\d{2}. O separador decimal é o caractere ponto. Não é aplicável utilizar separador de milhar. Exemplos de valores aderentes ao padrão: “1.00”, “123.99”, “123456789.23
 */
export interface CobVPayloadValor {
  /**
   * **Valor**
   *
   * Valor original da cobrança.
   */
  original?: string;
  /**
   * **Multa aplicada**
   *
   * Multa aplicada à cobrança
   */
  multa?: string;
  /**
   * **Juro aplicado**
   *
   * Juro aplicado à cobrança
   */
  juros?: string;
  /**
   * **Abatimento aplicado**
   *
   * Abatimento aplicado à cobrança
   */
  abatimento?: string;
  /**
   * **Desconto aplicado**
   *
   * Descontos aplicados à cobrança
   */
  desconto?: string;
  /**
   * **Valor final**
   *
   * Valor final da cobrança.
   */
  final: string;
}

/**
 * **Recorrência Completa**
 *
 * Atributos de Configuração de Recorrência
 */
export type RecCompleta = {
  idRec?: RecId;
  recebedor: {
    convenio?: string;
  } & PessoaJuridicaRecorrencia;
  loc?: PayloadLocationRecCompleta;
  solicitacao?: SolicRecCompleta[];
  dadosQR?: {
    jornada?: "JORNADA_2" | "JORNADA_3" | "JORNADA_4";
    pixCopiaECola?: string;
  };
} & RecBase &
  DadosPagadorRec &
  RecStatus &
  RecConfiguracao &
  RecAtualizacao &
  RecEncerramento &
  RecAtivacao;

/**
 * **Recorrência Completa Pesquisada**
 *
 * Atributos de Configuração de Recorrência
 */
export type RecCompletaPesquisada = {
  idRec?: RecId;
  recebedor: {
    convenio?: string;
  } & PessoaJuridicaRecorrencia;
  loc?: PayloadLocationRecCompleta;
  solicitacao?: SolicRecCompleta[];
} & RecBase &
  DadosPagadorRec &
  RecStatus &
  RecConfiguracao &
  RecAtualizacao &
  RecEncerramento &
  RecAtivacao;

/**
 * **Recorrência Gerada**
 *
 * Atributos de Configuração de Recorrência
 */
export type RecGerada = {
  idRec?: RecId;
  recebedor: {
    convenio?: string;
  } & PessoaJuridicaRecorrencia;
  loc?: PayloadLocationRecCompleta;
} & RecBase &
  RecStatus &
  RecAtualizacao &
  RecEncerramento &
  RecAtivacao;

/**
 * **Recorrência Solicitada**
 *
 * Atributos de Configuração de Recorrência
 */
export type RecSolicitada = {
  recebedor?: {
    convenio?: string;
  };
  loc?: PayloadLocationRecId;
} & RecBase &
  RecConfiguracao &
  RecAtivacaoSolicitada;

/**
 * **Payload da Recorrência**
 *
 * Atributos de Configuração de Recorrência
 */
export type RecPayload = {
  idRec: RecId;
  recebedor: {
    ispbParticipante: string;
  } & PessoaJuridicaRecorrencia;
} & RecBase &
  RecConfiguracao &
  RecAtualizacao;

/**
 * **Recorrência Revisada**
 *
 * Atributos de Revisão da Configuração de Recorrência
 */
export type RecRevisada = {
  status?: "CANCELADA";
  vinculo?: {
    devedor?: {
      nome: string;
    };
  };
  loc?: PayloadLocationRecId;
  calendario?: {
    dataInicial?: string;
  };
} & RecAtivacaoSolicitada;

/**
 * **Recorrência Notificada**
 *
 * Atributos de Notificação de Recorrência
 */
export type RecNotification = {
  idRec: RecId;
} & RecStatus &
  RecAtualizacao &
  RecEncerramento &
  RecAtivacao;

/** **Dados relacionados à confirmação da ativação da recorrência.** */
export interface RecAtivacao {
  /**
   * **Dados relacionados à confirmação da ativação da recorrência.**
   *
   * Dados relacionados à confirmação da ativação da recorrência.
   */
  ativacao?: {
    tipoJornada: "JORNADA_1" | "JORNADA_2" | "JORNADA_3" | "JORNADA_4" | "AGUARDANDO_DEFINICAO";
    dadosJornada?: {
      txid: TxId;
    };
  };
}

/** **Dados relacionados à confirmação da ativação da recorrência.** */
export interface RecAtivacaoSolicitada {
  /**
   * **Dados relacionados à confirmação da ativação da recorrência.**
   *
   * Dados relacionados à confirmação da ativação da recorrência.
   */
  ativacao?: {
    dadosJornada?: {
      txid: TxId;
    };
  };
}

/** **Status da Recorrência** */
export interface RecStatus {
  /** **Status do registro da recorrência** */
  status: "CRIADA" | "APROVADA" | "REJEITADA" | "EXPIRADA" | "CANCELADA";
}

/** **Configuração da Recorrência** */
export interface RecConfiguracao {
  /** **Política de retentativa pós vencimento da recorrência** */
  politicaRetentativa: "NAO_PERMITE" | "PERMITE_3R_7D";
}

/** **Histórico de atualização da recorrência.** */
export interface RecAtualizacao {
  /**
   * **Histórico de Status**
   *
   * Histórico das mudanças de status da recorrência.
   */
  atualizacao: {
    status: "CRIADA" | "APROVADA" | "REJEITADA" | "EXPIRADA" | "CANCELADA";
    data: string;
  }[];
}

/** **Detalhamento do encerramento da recorrência.** */
export interface RecEncerramento {
  /** **Detalhamento do encerramento da recorrência.** */
  encerramento?:
    | {
        rejeicao: {
          codigo: "AP13" | "AP14" | "AP15";
          descricao: string;
        };
      }
    | {
        cancelamento: {
          solicitante: "PSP_PAGADOR" | "USUARIO_PAGADOR" | "PSP_RECEBEDOR" | "USUARIO_RECEBEDOR";
          codigo: "ACCL" | "CPCL" | "DCSD" | "ERSL" | "FRUD" | "PCFD" | "SLCR" | "SLDB";
          descricao: string;
        };
      };
}

/**
 * **ID Recorrência**
 *
 * # Identificador da Recorrência
 *
 * Regra de formação:
 * - RAxxxxxxxxyyyyMMddkkkkkkkkkkk (29 caracteres; "case sensitive", isso é, diferencia letras maiúsculas e minúsculas), sendo:
 *   - "R":  fixo (1 caractere). "R" para a recorrência criada dentro do Pix;
 *   - "A": identificação da possibilidade de novas tentativas, sendo possíveis os valores "R" ou "N" (1 caractere). "R" caso a recorrência permita novas tentativas de pagamento pós vencimento, ou "N" caso não permita novas tentativas.
 *   - "xxxxxxxx":  identificação do agente que presta serviço para o usuário recebedor que gerou o ID Recorrência, podendo ser: o ISPB do participante direto, o ISPB do participante indireto ou os 8 primeiros caracteres do CNPJ do prestador de serviço de iniciação (8 caracteres alfanuméricos [A-Z|0-9]);
 *   - "yyyyMMdd":  data (8 caracteres) de criação da recorrência;
 *   - "kkkkkkkkkkk": sequencial criado pelo agente que gerou o ID Recorrência (11 caracteres alfanuméricos [a-z|A-Z|0-9]). Deve ser único dentro de cada "yyyyMMdd".
 *
 * Dessa forma, o ID da recorrência deve ser formado de acordo com um dos tipos a seguir:
 * - "RRxxxxxxxxyyyyMMddkkkkkkkkkkk"; para recorrência criada dentro do Pix e que permite novas tentativas de pagamento pós vencimento; ou
 * - "RNxxxxxxxxyyyyMMddkkkkkkkkkkk"; para recorrência criada dentro do Pix e que não permite novas tentativas de pagamento pós vencimento.”
 */
export type RecId = string;

/**
 * **Recorrência Base**
 *
 * Atributos de Configuração de Recorrência
 */
export interface RecBase {
  /**
   * **Descrição do Objeto da Recorrência**
   *
   * Informações sobre o objeto da recorrência.
   */
  vinculo: {
    objeto?: string;
    devedor: PessoaFisicaRecorrencia | PessoaJuridicaRecorrencia;
    contrato: string;
  };
  /**
   * **Informações sobre calendário da recorrência**
   *
   * Informações sobre calendário da recorrência
   */
  calendario: {
    dataInicial: string;
    dataFinal?: string;
    periodicidade: "SEMANAL" | "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL";
  };
  valor?: {
    valorRec?: string;
    valorMinimoRecebedor?: string;
  };
}

/**
 * **Id da Solicitação de recorrência**
 *
 * Dados criados ou alterados da cobrança recorrente via API Pix
 */
export interface SolicRecId {
  /**
   * **ID Solicitação da Recorrência**
   *
   * # Identificador da Solicitação da Recorrência
   *
   * Regra de formação:
   * - SCxxxxxxxxyyyyMMddkkkkkkkkkkk (29 caracteres; “case sensitive”, isso é, diferencia letras maiúsculas e minúsculas), sendo:
   *   - SC - fixo (2 caracteres);
   *   - xxxxxxxx – ISPB do agente que envia a mensagem pain.009 de solicitação de confirmação da recorrência (8 caracteres alfanuméricos [A-Z|0-9]);
   *   - yyyyMMdd – data (8 caracteres) de criação da mensagem pain.009 de solicitação de confirmação da recorrência;
   *   - kkkkkkkkkkk – sequencial criado pelo agente que gerou a mensagem de solicitação de confirmação da recorrência (11 caracteres alfanuméricos [a-z|A-Z|0-9]). Deve ser único dentro de cada “yyyyMMdd”.
   */
  idSolicRec: string;
}

/**
 * **Solicitação de Recorrência Base**
 *
 * Dados criados ou alterados da cobrança recorrente via API Pix
 */
export interface SolicRecBase {
  idRec: RecId;
  /** **Informações de Calendário da Solicitação da Recorrência** */
  calendario: {
    dataExpiracaoSolicitacao: string;
  };
  destinatario: DadosBancarios & (CPF | CNPJ);
}

/** **Status da Solicitação de Recorrência** */
export interface SolicRecStatus {
  /** **Status do registro da solicitação de recorrência** */
  status: "CRIADA" | "ENVIADA" | "RECEBIDA" | "REJEITADA" | "ACEITA" | "EXPIRADA" | "CANCELADA";
}

/** **Histórico de Status da Solicitação de Recorrência** */
export interface SolicRecAtualizacao {
  /** **Histórico de Status da Solicitação de Recorrência** */
  atualizacao: {
    status: "CRIADA" | "ENVIADA" | "RECEBIDA" | "REJEITADA" | "ACEITA" | "EXPIRADA" | "CANCELADA";
    data: string;
  }[];
}

/** **Detalhamento do encerramento da solicitação de recorrência.** */
export interface SolicRecEncerramento {
  /** **Detalhamento do encerramento da solicitação de recorrência.** */
  encerramento?: {
    rejeicao?: {
      motivo: "DADOS_BANCARIOS_INVALIDOS";
    };
  };
}

/**
 * **Solicitação de Recorrência**
 *
 * Dados criados ou alterados da solicitação da recorrência
 */
export type SolicRecSolicitada = SolicRecBase;

/**
 * **Solicitação de Recorrência**
 *
 * Dados alterados da solicitação da recorrência
 */
export interface SolicRecRevisada {
  /** **Status do registro da solicitação de recorrência** */
  status: "CANCELADA";
}

/**
 * **Solicitação de Recorrência Completa**
 *
 * Dados criados ou alterados da solicitação da recorrência
 */
export type SolicRecCompleta = {
  recPayload: RecPayload;
} & SolicRecId &
  SolicRecBase &
  SolicRecStatus &
  SolicRecAtualizacao &
  SolicRecEncerramento;

/**
 * **Tributos Detalhados**
 *
 * Informações completas sobre tributos.
 */
export interface TributoCompleto {
  /**
   * **Documento Fiscal**
   *
   * Informações detalhadas acerca da documentação fiscal.
   */
  documentoFiscal?: {
    chaveDeAcesso: string;
  };
  /**
   * **CBS**
   *
   * CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  cbs: RegistroCategoriaTributoCompleto;
  /**
   * **IBS**
   *
   * IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  ibs: RegistroCategoriaTributoCompleto;
}

/**
 * **Tributos Detalhados Pix**
 *
 * Informações completas sobre tributos.
 */
export interface TributoCompletoPix {
  /**
   * **Documento Fiscal**
   *
   * Informações detalhadas acerca da documentação fiscal.
   */
  documentoFiscal?: {
    chaveDeAcesso: string;
  };
  /**
   * **CBS**
   *
   * CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  cbs: RegistroCategoriaTributoCompletoPix;
  /**
   * **IBS**
   *
   * IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  ibs: RegistroCategoriaTributoCompletoPix;
}

/**
 * **Tributos para acesso via payload**
 *
 * Informações tributárias atualizadas acessíveis via payload.
 */
export interface TributoPayload {
  /**
   * **Documento Fiscal**
   *
   * Informações detalhadas acerca da documentação fiscal.
   */
  documentoFiscal?: {
    chaveDeAcesso: string;
  };
  /**
   * **CBS**
   *
   * CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  cbs: RegistroCategoriaTributoPayload;
  /**
   * **IBS**
   *
   * IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  ibs: RegistroCategoriaTributoPayload;
}

/**
 * **Tributos Informados completos**
 *
 * Informações tributárias detalhadas de todas as categorias de tributos disponíveis.
 */
export interface TributoInformadoCompleto {
  /**
   * **Documento Fiscal**
   *
   * Informações detalhadas acerca da documentação fiscal.
   */
  documentoFiscal?: {
    chaveDeAcesso: string;
  };
  /**
   * **CBS**
   *
   * CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  cbs: RegistroCategoriaTributoInformadoCompleto;
  /**
   * **IBS**
   *
   * IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  ibs: RegistroCategoriaTributoInformadoCompleto;
}

/**
 * **Tributos Informados solicitados**
 *
 * Informações tributárias informadas pelo usuário recebedor no momento da criação ou revisão da cobrança, quando aplicável.
 */
export interface TributoInformadoSolicitado {
  /**
   * **Documento Fiscal**
   *
   * Informações detalhadas acerca da documentação fiscal.
   */
  documentoFiscal?: {
    chaveDeAcesso: string;
  };
  /**
   * **CBS**
   *
   * CBS (Contribuição sobre Bens e Serviços): Tributo federal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  cbs: RegistroCategoriaTributoInformadoSolicitado;
  /**
   * **IBS**
   *
   * IBS (Imposto sobre Bens e Serviços): Tributo estadual/municipal incidente sobre operações de bens e serviços, cujo valor absoluto será informado para fins de split tributário.
   */
  ibs: RegistroCategoriaTributoInformadoSolicitado;
}

/**
 * **Registro de tributo informado**
 *
 * Detalhamento dos valores informados do tributo, segregados por categoria.
 */
export interface RegistroCategoriaTributoInformadoSolicitado {
  /**
   * **Tributo informado**
   *
   * Categoria de tributo informado.
   */
  informado: ValorTributoDetalheSolicitado;
}

/**
 * **Registro de tributo informado criado**
 *
 * Detalhamento dos valores informados do tributo, segregados por categoria.
 */
export interface RegistroCategoriaTributoInformadoCompleto {
  /**
   * **Tributo informado**
   *
   * Categoria de tributo informado.
   */
  informado: ValorTributoDetalheCompleto;
}

/**
 * **Registro de tributo informado e corrigido.**
 *
 * Informações tributárias disponibilizadas publicamente.
 */
export interface RegistroCategoriaTributoPayload {
  /**
   * **Tributo informado**
   *
   * Categoria de tributo informado.
   */
  informado: ValorTributoDetalheCompleto;
  /**
   * **Tributo corrigido**
   *
   * Categoria de tributo corrigido.
   */
  corrigido?: ValorTributoDetalheCompleto;
}

/**
 * **Registro de tributo completo**
 *
 * Detalhamento dos valores completos do tributo, segregados por categoria.
 */
export interface RegistroCategoriaTributoCompleto {
  /**
   * **Tributo segregado**
   *
   * Categoria cujo valor e data correspondem ao que foi efetivamente segregado na liquidação do Pix.
   */
  segregado?: ValorTributoDetalheCompleto;
  /**
   * **Tributo em aberto**
   *
   * Categoria cujo valor e data correspondem ao registro do último valor em aberto obtido da Plataforma Pública.
   */
  emAberto?: ValorTributoDetalheCompleto;
  /**
   * **Tributo corrigido**
   *
   * Categoria cujo valor e data correspondem ao registro da última correção obtida da Plataforma Pública.
   */
  corrigido?: ValorTributoDetalheCompleto;
  /**
   * **Tributo informado**
   *
   * Categoria cujo valor é informado pelo recebedor e a data corresponde ao momento de criação do objeto tributo.
   */
  informado: ValorTributoDetalheCompleto;
}

/**
 * **Registro de tributo completo Pix**
 *
 * Detalhamento dos valores completos do tributo, segregados por categoria.
 */
export type RegistroCategoriaTributoCompletoPix = {
  segregado: RegistroCategoriaTributoCompleto["segregado"];
} & RegistroCategoriaTributoCompleto;

/** **Informação completa do valor do tributo** */
export interface ValorTributoDetalheCompleto {
  /** **Valor do tributo** */
  valor: string;
  /** **Data de referência do tributo** */
  data: string;
}

/** **Informação solicitada do valor do tributo** */
export interface ValorTributoDetalheSolicitado {
  /** **Valor do tributo** */
  valor: string;
}

/** **Valor estimado da cobrança após recolhimento de CBS e IBS.** */
export interface ValorLiquidoEstimado {
  /**
   * **Valor Líquido Estimado.**
   *
   * Valor estimado da cobrança após recolhimento de CBS e IBS.
   *
   * -	Se houver tributo segregado é dado pela fórmula: `valorLiquido = valor - (tributo.cbs.segregado.valor + tributo.ibs.segregado.valor)`; senão
   * -	Se houver tributo em aberto é dado pela fórmula: `valorLiquido = valor.original - (tributo.cbs.emAberto.valor + tributo.ibs. emAberto.valor)`; senão
   * -	Se houver tributo corrigido é dado pela fórmula: `valorLiquido = valor.original - (tributo.cbs.corrigido.valor + tributo.ibs.corrigido.valor)`; senão
   * -	Se houver tributo informado é dado pela fórmula: `valorLiquido = valor.original - (tributo.cbs.informado.valor + tributo.ibs.informado.valor)`; senão
   * -	Se não houver tributo informado: `valorLiquido = valor.original`.
   */
  valorLiquidoEstimado?: string;
}

/**
 * **Cobrança Recorrente Gerada**
 *
 * Dados criados ou alterados da cobrança recorrente via API Pix
 */
export type CobRGerada = {
  idRec: RecId;
  txid: TxId;
  calendario: {
    criacao: string;
  };
  recebedor: PessoaJuridicaRecorrencia;
  tributo?: TributoInformadoCompleto;
  status: CobRStatus["status"];
  valor: CobRBase["valor"];
} & CobRBase &
  CobRStatus &
  DadosDevedorRecorrencia &
  ValorLiquidoEstimado;

/**
 * **Cobrança Recorrente Completa**
 *
 * Dados completos da cobrança recorrente via API Pix
 */
export type CobRCompleta = {
  idRec: RecId;
  txid: TxId;
  calendario: {
    criacao: string;
  };
  pix?: PixAutomaticoConsultado[];
  tributo?: TributoCompleto;
  status: CobRStatus["status"];
  valor: CobRBase["valor"];
  recebedor: CobRBase["recebedor"];
} & CobRBase &
  CobRStatus &
  CobRConfiguracao &
  DadosDevedorRecorrencia &
  CobRAtualizacao &
  CobRTentativas &
  ValorLiquidoEstimado;

/** **Histórico de Atualização da Cobrança Recorrente** */
export interface CobRAtualizacao {
  /**
   * **Histórico de Status**
   *
   * Histórico das mudanças de status das cobranças recorrentes.
   */
  atualizacao: {
    status: "CRIADA" | "ATIVA" | "CONCLUIDA" | "EXPIRADA" | "REJEITADA" | "CANCELADA";
    data: string;
  }[];
  /** **Detalhamento do encerramento da cobrança.** */
  encerramento?:
    | {
        cancelamento: {
          solicitante: "PSP_PAGADOR" | "USUARIO_PAGADOR" | "PSP_RECEBEDOR" | "USUARIO_RECEBEDOR";
          codigo: "ACCT" | "BLCK" | "CCLD" | "FAIL" | "OTHR" | "SLBD" | "SLCR";
          descricao: string;
        };
      }
    | {
        rejeicao: {
          codigo:
            | "AB10"
            | "AC05"
            | "AC06"
            | "AM02"
            | "AM09"
            | "CRNC"
            | "DENC"
            | "DS27"
            | "DTED"
            | "DTNT"
            | "FBRD"
            | "FCD2"
            | "GRER"
            | "IRNT"
            | "MIDI"
            | "MSUC"
            | "NIEC"
            | "NIPA"
            | "NITX"
            | "QUNT"
            | "RC09"
            | "UDEI";
          descricao: string;
        };
      };
}

/** **Histórico de Tentativas da Cobrança Recorrente** */
export interface CobRTentativas {
  /**
   * **Histórico de Tentativas de Cobrança**
   *
   * Histórico de Tentativas de Cobrança
   */
  tentativas?: {
    dataLiquidacao: string;
    tipo: "AGND" | "NTAG" | "RIFL";
    status: "SOLICITADA" | "AGENDADA" | "PAGA" | "CANCELADA" | "REJEITADA" | "EXPIRADA";
    endToEndId: EndToEndId;
    atualizacao: {
      status: "SOLICITADA" | "AGENDADA" | "PAGA" | "CANCELADA" | "REJEITADA" | "EXPIRADA";
      data: string;
    }[];
    rejeicao?: {
      codigo:
        | "AB10"
        | "AC05"
        | "AC06"
        | "AM02"
        | "AM09"
        | "CRNC"
        | "DENC"
        | "DS27"
        | "DTED"
        | "DTNT"
        | "FBRD"
        | "FCD1"
        | "FCD2"
        | "GRER"
        | "IRNT"
        | "MIDI"
        | "MSUC"
        | "NIEC"
        | "NIPA"
        | "NITX"
        | "QUNT"
        | "RC09"
        | "UDEI";
      descricao: string;
    };
  }[];
}

/**
 * **Cobrança Recorrente Revisada**
 *
 * Dados enviados para revisão da cobrança recorrente via API Pix
 */
export type CobRRevisada = CobRStatusRevisada;

/**
 * **Cobrança Recorrente Solicitada**
 *
 * Dados enviados para criação da cobrança recorrente via API Pix
 */
export type CobRSolicitada = {
  idRec: RecId;
  tributo?: TributoInformadoSolicitado;
  calendario: CobRBase["calendario"];
  valor: CobRBase["valor"];
  recebedor: CobRBase["recebedor"];
} & CobRBase &
  DadosDevedorRecorrencia;

/**
 * **Cobrança Recorrente Notificada**
 *
 * Dados enviados para notificação da cobrança recorrente via API Pix
 */
export type CobRNotification = {
  idRec: RecId;
  txid: TxId;
  valor?: {
    original: string;
  };
  tributo?: TributoCompleto;
  pix?: PixAutomaticoConsultado[];
  status: CobRStatus["status"];
} & CobRStatus &
  CobRAtualizacao &
  CobRTentativas &
  ValorLiquidoEstimado;

/**
 * **Cobrança Imediata Notificada**
 *
 * Dados enviados para notificação da cobrança imediata via API Pix
 */
export type CobNotification = CobCompleta;

/**
 * **Cobrança com Vencimento Notificada**
 *
 * Dados enviados para notificação da cobrança com vencimento via API Pix
 */
export type CobVNotification = CobVCompleta;

/** **Configuração da Cobrança Recorrente** */
export interface CobRConfiguracao {
  /** **Política de retentativa da cobrança recorrente** */
  politicaRetentativa: "NAO_PERMITE" | "PERMITE_3R_7D";
}

/** **Status da Cobrança Recorrente** */
export interface CobRStatus {
  /** **Status do registro da cobrança** */
  status?: "CRIADA" | "ATIVA" | "CONCLUIDA" | "EXPIRADA" | "REJEITADA" | "CANCELADA";
}

/** **Status da Cobrança Recorrente** */
export interface CobRStatusRevisada {
  /** **Status do registro da cobrança** */
  status?: "CANCELADA";
}

/**
 * **Cobrança Recorrente Base**
 *
 * Atributos de cobrança recorrente
 */
export interface CobRBase {
  /**
   * **Informações adicionais da fatura.**
   *
   * Informações adicionais da fatura.
   */
  infoAdicional?: string;
  /** **Informações sobre calendário da cobrança** */
  calendario?: {
    dataDeVencimento: string;
  };
  /**
   * **Valor da cobrança recorrente**
   *
   * Valor da cobrança recorrente
   */
  valor?: {
    original: string;
  };
  /**
   * **Ajuste data prevista para liquidação para próximo dia útil**
   *
   * Campo de ativação do ajuste da data prevista para liquidação para próximo dia útil caso o vencimento corrente seja um dia não útil. O PSP Recebedor deverá considerar os feriados locais com base no código município do usuário pagador.
   */
  ajusteDiaUtil: boolean;
  /** O objeto recebedor organiza as informações sobre o recebedor da cobrança. */
  recebedor?: DadosBancariosRecebedor;
}

/**
 * **Cobrança Base**
 *
 * Atributos comuns a todas entidades de Cobrança
 */
export interface CobBase {
  /**
   * **Chave DICT do recebedor**
   *
   * # Formato do campo chave
   *
   * * O campo chave determina a chave Pix registrada no DICT que será utilizada para a cobrança. Essa chave será lida pelo aplicativo do PSP do pagador para consulta ao DICT, que retornará a informação que identificará o recebedor da cobrança.
   * * Os tipos de chave podem ser: telefone, e-mail, cpf/cnpj ou EVP.
   * * O formato das chaves pode ser encontrado na seção "Formatação das chaves do DICT no BR Code" do [Manual de Padrões para iniciação do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).
   */
  chave?: string;
  /**
   * **Solicitação ao pagador**
   *
   * O campo solicitacaoPagador, opcional, determina um texto a ser apresentado ao pagador para que ele possa digitar uma informação correlata, em formato livre, a ser enviada ao recebedor. Esse texto será preenchido, na pacs.008, pelo PSP do pagador, no campo RemittanceInformation <RmtInf>. O tamanho do campo <RmtInf> na pacs.008 está limitado a 140 caracteres.
   */
  solicitacaoPagador?: string;
  /**
   * **Informações adicionais**
   *
   * Cada respectiva informação adicional contida na lista (nome e valor) deve ser apresentada ao pagador.
   */
  infoAdicionais?: {
    nome: string;
    valor: string;
  }[];
}

/**
 * **Cobrança Base com Copia e Cola**
 *
 * Atributos comuns a todas entidades de Cobrança que possuem informação de Copia e Cola
 */
export type CobBaseCopiaCola = {
  pixCopiaECola?: string;
} & CobBase;

/**
 * **Cobrança imediata solicitada**
 *
 * Dados enviados para criação ou alteração da cobrança imediata via API Pix
 */
export type CobSolicitada = {
  calendario: CobExpiracao;
  devedor?: PessoaFisica | PessoaJuridica;
  loc?: PayloadLocationCob;
  valor: {
    original: CobValor["original"];
  } & CobValor;
  tributo?: TributoInformadoSolicitado;
  chave: CobBase["chave"];
} & CobBase;

/**
 * **Cobrança com vencimento solicitada**
 *
 * Dados enviados para criação ou alteração da cobrança com vencimento via API Pix
 */
export type CobVSolicitada = {
  calendario: CobDataDeVencimento;
  loc?: PayloadLocationCob;
  valor: {
    original: CobVValor["original"];
  } & CobVValor;
  tributo?: TributoInformadoSolicitado;
  chave: CobBase["chave"];
  devedor: DadosDevedor["devedor"];
} & DadosDevedor &
  CobBase;

/**
 * **Cobrança imediata revisada**
 *
 * Dados enviados para revisão da cobrança imediata via API Pix
 */
export type CobRevisada = {
  calendario?: CobExpiracao;
  devedor?: PessoaFisica | PessoaJuridica;
  loc?: PayloadLocationCob;
  status?: "REMOVIDA_PELO_USUARIO_RECEBEDOR";
  valor?: CobValor;
  tributo?: TributoInformadoSolicitado;
} & CobBase;

/**
 * **Cobrança com vencimento revisada**
 *
 * Dados enviados para revisão da cobrança com vencimento via API Pix
 */
export type CobVRevisada = {
  calendario?: CobDataDeVencimento;
  loc?: PayloadLocationCob;
  status?: "REMOVIDA_PELO_USUARIO_RECEBEDOR";
  valor?: CobVValor;
  tributo?: TributoInformadoSolicitado;
} & DadosDevedor &
  CobBase;

/**
 * **Cobrança Imediata Gerada**
 *
 * Dados criados ou alterados da cobrança imediata via API Pix
 */
export type CobGerada = {
  calendario: {
    expiracao: CobExpiracao["expiracao"];
  } & CobCriacao &
    CobExpiracao;
  txid: TxId;
  revisao: Revisao;
  devedor?: PessoaFisica | PessoaJuridica;
  loc?: PayloadLocation;
  location?: string;
  status: CobStatus;
  valor: {
    original: CobValor["original"];
  } & CobValor;
  tributo?: TributoInformadoCompleto;
  chave: CobBaseCopiaCola["chave"];
} & CobBaseCopiaCola &
  ValorLiquidoEstimado;

/**
 * **Cobrança com Vencimento Gerada**
 *
 * Dados criados ou alterados da cobrança com vencimento via API Pix
 */
export type CobVGerada = {
  calendario: {
    validadeAposVencimento: CobDataDeVencimento["validadeAposVencimento"];
  } & CobCriacao &
    CobDataDeVencimento;
  txid: TxId;
  revisao: Revisao;
  loc?: PayloadLocation;
  status: CobVStatus;
  valor: {
    original: CobVValor["original"];
  } & CobVValor;
  tributo?: TributoInformadoCompleto;
  devedor: DadosDevedor["devedor"];
  chave: CobBaseCopiaCola["chave"];
  recebedor: DadosRecebedor["recebedor"];
} & DadosDevedor &
  DadosRecebedor &
  CobBaseCopiaCola &
  ValorLiquidoEstimado;

/**
 * **Status do registro da cobrança.**
 *
 * Estado do registro da cobrança. Não se confunde com o estado da cobrança em si, ou seja, não guarda relação com o fato de a cobrança encontrar-se vencida ou expirada, por exemplo.
 *
 * Os status são assim definidos:
 * - `ATIVA`: indica que o registro se refere a uma cobrança que foi gerada mas ainda não foi paga nem removida;
 * - `CONCLUIDA`: indica que o registro se refere a uma cobrança que já foi paga e, por conseguinte, não pode acolher outro pagamento;
 * - `REMOVIDA_PELO_USUARIO_RECEBEDOR`: indica que o usuário recebedor solicitou a remoção do registro da cobrança;
 * - `REMOVIDA_PELO_PSP`: indica que o PSP Recebedor solicitou a remoção do registro da cobrança.
 */
export type CobStatus =
  "ATIVA" | "CONCLUIDA" | "REMOVIDA_PELO_USUARIO_RECEBEDOR" | "REMOVIDA_PELO_PSP";

/**
 * **Status do registro da cobrança com vencimento.**
 *
 * Estado do registro da cobrança com vencimento. Não se confunde com o estado da cobrança em si, ou seja, não guarda relação com o fato de a cobrança encontrar-se vencida ou expirada, por exemplo.
 *
 * Os status são assim definidos:
 * - `ATIVA`: indica que o registro se refere a uma cobrança que foi gerada mas ainda não foi paga nem removida;
 * - `CONCLUIDA`: indica que o registro se refere a uma cobrança que já foi paga e, por conseguinte, não pode acolher outro pagamento;
 * - `CONCLUIDA_POR_OUTRO_ARRANJO`: indica que o registro se refere a uma cobrança que já foi paga pelo arranjo de boletos e, por conseguinte, não pode acolher outro pagamento;
 * - `REMOVIDA_PELO_USUARIO_RECEBEDOR`: indica que o usuário recebedor solicitou a remoção do registro da cobrança;
 * - `REMOVIDA_PELO_PSP`: indica que o PSP Recebedor solicitou a remoção do registro da cobrança; e
 * - `REMOVIDA_PELO_PSP_BOLETO`: indica que o PSP Recebedor solicitou a remoção do registro de cobrança, porque o pagamento é possível apenas por boleto.
 */
export type CobVStatus =
  | "ATIVA"
  | "CONCLUIDA"
  | "REMOVIDA_PELO_USUARIO_RECEBEDOR"
  | "REMOVIDA_PELO_PSP"
  | "REMOVIDA_PELO_PSP_BOLETO";

/** **Lote de cobranças com vencimento gerado** */
export interface LoteCobVGerado {
  /** **Id do lote** */
  id: number;
  /** **Descrição do lote** */
  descricao: string;
  /**
   * **Data de criação do lote**
   *
   * Timestamp que indica o momento em que foi criado o lote. Respeita o formato definido na RFC 3339.
   */
  criacao: string;
  cobsv: CobVGerada[];
}

/** **Cobrança com vencimento completa** */
export type CobVCompleta = {
  status: CobVStatus;
  tributo?: TributoCompleto;
  pix?: ({
    txid?: TxId;
  } & PixConsultado)[];
} & CobVGerada &
  ValorLiquidoEstimado;

/** **Cobrança imediata completa** */
export type CobCompleta = {
  status: CobStatus;
  tributo?: TributoCompleto;
  pix?: ({
    txid?: TxId;
  } & PixConsultado)[];
} & CobGerada &
  ValorLiquidoEstimado;

/** **Lote de solicitações de alteração ou criação de cobranças com vencimento** */
export interface LoteCobVConsultado {
  /** **Identificador do lote em formato numérico.** */
  id: number;
  /** **Descrição do lote** */
  descricao: string;
  /**
   * **Data de criação do lote**
   *
   * Timestamp que indica o momento em que foi criado o lote. Respeita o formato definido na RFC 3339.
   */
  criacao: string;
  cobsv: {
    txid: TxId;
    status: "EM_PROCESSAMENTO" | "CRIADA" | "NEGADA";
    problema?: Problema;
    criacao?: string;
  }[];
}

/** **Lotes de solicitações de cobranças com vencimento** */
export interface LotesCobVConsultados {
  parametros: ParametrosConsultaLote;
  /** **Lotes de solicitações de criação/alteração de cobranças com vencimento** */
  lotes: LoteCobVConsultado[];
}

/**
 * **Payload JSON da cobrança com vencimento**
 *
 * Dados da cobrança com vencimento acessados pelo payload JSON
 */
export type CobVPayload = {
  calendario: {
    validadeAposVencimento: CobDataDeVencimento["validadeAposVencimento"];
  } & CobCriacao &
    CobApresentacao &
    CobDataDeVencimento;
  devedor: PessoaFisica | PessoaJuridica;
  txid: TxId;
  revisao: Revisao;
  status: CobVStatus;
  valor: CobVPayloadValor;
  tributo?: TributoPayload;
  chave: CobBase["chave"];
  recebedor: DadosRecebedor["recebedor"];
} & DadosRecebedor &
  CobBase;

/**
 * **Payload JSON da cobrança imediata**
 *
 * Dados da cobrança imediata acessados pelo payload JSON
 */
export type CobPayload = {
  calendario: {
    expiracao: CobExpiracao["expiracao"];
  } & CobCriacao &
    CobApresentacao &
    CobExpiracao;
  txid: TxId;
  revisao: Revisao;
  devedor?: PessoaFisica | PessoaJuridica;
  status: CobStatus;
  valor: CobPayloadValor;
  tributo?: TributoPayload;
  chave: CobBase["chave"];
} & CobBase;

/**
 * **Location do Payload**
 *
 * Identificador da localização do payload.
 */
export interface PayloadLocation {
  id: PayloadLocationId;
  /**
   * **Localização do payload**
   *
   * Localização do Payload a ser informada na criação da cobrança.
   */
  location: string;
  /** **Tipo da cobrança** */
  tipoCob: "cob" | "cobv";
  /**
   * **Data de Criação**
   *
   * Data e hora em que a location foi criada. Respeita RFC 3339.
   */
  criacao: string;
}

/**
 * **Location do Payload Solicitada**
 *
 * Identificador da localização do payload solicitada.
 */
export interface PayloadLocationSolicitada {
  /** **Tipo da cobrança** */
  tipoCob: "cob" | "cobv";
}

/**
 * **Location do Payload Solicitada**
 *
 * Identificador da localização do payload solicitada.
 */
export interface PayloadLocationRecSolicitada {
  /** **Tipo da cobrança** */
  tipo: "rec";
}

/**
 * **Location do Payload Completa**
 *
 * Identificador da localização do payload completo.
 */
export interface PayloadLocationRecGerada {
  id: PayloadLocationRecId;
  /**
   * **Localização do payload**
   *
   * Localização do Payload a ser informada na criação da recorrência.
   */
  location: string;
  /**
   * **Data de Criação**
   *
   * Data e hora em que a location foi criada. Respeita RFC 3339.
   */
  criacao: string;
}

/**
 * **Location do Payload Completa**
 *
 * Identificador da localização do payload completo.
 */
export type PayloadLocationRecCompleta = {
  idRec?: RecId;
} & PayloadLocationRecGerada;

/**
 * **Location do Payload Completa**
 *
 * Identificador da localização do payload completo.
 */
export interface PayloadLocationCompleta {
  id: PayloadLocationId;
  txid?: TxId;
  /**
   * **Localização do payload**
   *
   * Localização do Payload a ser informada na criação da cobrança.
   */
  location: string;
  /** **Tipo da cobrança** */
  tipoCob: "cob" | "cobv";
  /**
   * **Data de Criação**
   *
   * Data e hora em que a location foi criada. Respeita RFC 3339.
   */
  criacao: string;
}

/**
 * **Location do Payload**
 *
 * Identificador da localização do payload.
 */
export interface PayloadLocationCob {
  id: PayloadLocationId;
}

/**
 * **Parâmetros de Consulta de Recorrências**
 *
 * Parâmetros utilizados para a realização de uma consulta de recorrências.
 */
export interface ParametrosConsultaRec {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  /**
   * **CPF**
   *
   * Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.
   */
  cpf?: string;
  /**
   * **CNPJ**
   *
   * Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.
   */
  cnpj?: string;
  /** Filtro pela existência de location vinculada. */
  locationPresente?: boolean;
  /**
   * **Status do registro da recorrência**
   *
   * Filtro pelo status das recorrências.
   */
  status?: string;
  /** **Recebedor** */
  recebedor?: {
    convenio?: string;
  };
  paginacao: Paginacao;
}

/**
 * **Parâmetros de Consulta de Cobrança**
 *
 * [DEPRECADO] Parâmetros utilizados para a realização de uma consulta de cobranças.
 */
export interface ParametrosConsultaCob {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  /**
   * **CPF**
   *
   * Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.
   */
  cpf?: string;
  /**
   * **CNPJ**
   *
   * Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.
   */
  cnpj?: string;
  /** Filtro pela existência de location vinculada. */
  locationPresente?: boolean;
  /**
   * **Status do registro da cobrança**
   *
   * Filtro pelo status das cobranças.
   */
  status?: string;
  paginacao: Paginacao;
}

/**
 * **Parâmetros de Consulta de Cobrança**
 *
 * Parâmetros utilizados para a realização de uma consulta de cobranças.
 */
export interface ParametrosConsultaCobR {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  idRec?: RecId;
  /**
   * **CPF**
   *
   * Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ.
   */
  cpf?: string;
  /**
   * **CNPJ**
   *
   * Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF.
   */
  cnpj?: string;
  /**
   * **Status do registro da cobrança**
   *
   * Filtro pelo status das cobranças.
   */
  status?: string;
  /** **Recebedor** */
  recebedor?: {
    convenio?: string;
  };
  paginacao: Paginacao;
}

/**
 * **Parâmetros de consulta de lotes de cobrança com vencimento.**
 *
 * Parâmetros utilizados para a realização de uma consulta de lote de cobranças com vencimento.
 */
export interface ParametrosConsultaLote {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  paginacao: Paginacao;
}

/** **Cobranças com vencimento consultadas** */
export interface CobsVConsultadas {
  parametros: ParametrosConsultaCob;
  /** **Lista de cobranças** */
  cobs: CobVCompleta[];
}

/** **Cobranças imediatas consultadas** */
export interface CobsConsultadas {
  parametros: ParametrosConsultaCob;
  /** **Lista de cobranças** */
  cobs: CobCompleta[];
}

/** **Cobranças recorrentes consultadas** */
export interface CobsRConsultadas {
  parametros: ParametrosConsultaCobR;
  /** **Lista de cobranças** */
  cobsr: CobRCompleta[];
}

/** **Recorrencias consultadas** */
export interface RecsConsultadas {
  parametros: ParametrosConsultaRec;
  /** **Lista de recorrências** */
  recs: RecCompletaPesquisada[];
}

/** **Pix** */
export interface Pix {
  endToEndId: EndToEndId;
  txid?: TxId;
  /**
   * **Valor do Pix.**
   *
   * Valor do Pix.
   */
  valor: string;
  /**
   * **Informações sobre o valor do Pix**
   *
   * O objetivo dessa estrutura é explicar os elementos de composição do valor do Pix, incluindo informações sobre as multas, juros, descontos e abatimentos quando o Pix for relativo a cobranças com vencimento.
   *
   * Regras da estrutura:
   * - O `valor` do Pix é igual a:
   *   - (`original.valor` + `saque.valor` + `troco.valor`) + `multa.valor` + `juros.valor` – `abatimento.valor` – `desconto.valor`
   *   considerando-se apenas os campos que estiverem presentes para cada tipo de cobrança pago.
   * - As estruturas `saque` e `troco` só serão retornadas quando o Pix for relativo a um Pix Saque ou Pix Troco, respectivamente, e
   * as demais estruturas (`juros`, `multa`, `abatimento` e `desconto`) só serão pertinentes aos Pix de pagamentos das cobranças com vencimento.
   * - Não pode haver simultaneamente uma subsestrutura do tipo `saque` e outra do tipo `troco`;
   * - Não há restrição na ordem das subestruturas.
   *
   * Para o caso de um Pix Saque pode-se retornar `original` com valor=0.00 (zero) uma vez que a soma será respeitada, ou pode-se omitir a
   * subestrutura original. No caso de um Pix Troco ou de um pagamento de cobrança com vencimento a subsestrutura `original` vai sempre estar
   * presente.
   *
   * #### Exemplos válidos:
   * Exemplo de preenchimentos válidos.
   *
   * - **Pix para pagamento de cobrança imediata (sem saque ou troco).**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "100.00"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix Saque.**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "saque": {
   *       "valor": "100.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix para pagamento de cobrança imediata com saque (pode vir original.valor=0.00).**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "0.00"
   *     },
   *     "saque": {
   *       "valor": "100.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix Troco.**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "80.00"
   *     },
   *     "troco": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGTEC",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix para pagamento de cobrança imediata com troco (ordem não importa).**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "troco": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGTEC",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     },
   *     "original": {
   *       "valor": "80.00"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix para pagamento de cobrança com vencimento de R$100,00 considerando-se um atraso de 2 dias a uma multa de 3% e juros de 1% ao dia. O `valor` do Pix será R$105,00.**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "100.00"
   *     },
   *     "multa": {
   *       "valor": "3.00"
   *     },
   *     "juros": {
   *       "valor": "2.00"
   *     }
   *   }
   *   ...
   *   ```
   * #### Exemplos inválidos:
   * Exemplos, não exaustivos, de preenchimentos inválidos.
   * - **`original.valor` maior que 0.00 (zero) e `saque` juntos**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "80.00"
   *     },
   *     "saque": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **dois elementos de `saque`**
   *   ```
   *   ...
   *   "componentesValor": [
   *     "saque": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     },
   *     "saque": {
   *       "valor": "10.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   ]
   *   ...
   *   ```
   * - **saque e troco simultaneamente**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "60.00"
   *     },
   *     "saque": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     },
   *     "troco": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGTEC",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   */
  componentesValor?:
    | PixValorOriginal
    | PixValorSaque
    | PixValorTroco
    | PixValorJuros
    | PixValorMulta
    | PixValorAbatimento
    | PixValorDesconto;
  /**
   * **Chave DICT do recebedor**
   *
   * # Formato do campo chave
   *
   * * Campo chave do recebedor conforme atribuído na respectiva PACS008.
   * * Os tipos de chave podem ser: telefone, e-mail, cpf/cnpj ou EVP.
   * * O formato das chaves pode ser encontrado na seção "Formatação das chaves do DICT no BR Code" do [Manual de Padrões para iniciação do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).
   */
  chave?: string;
  /**
   * **Horário**
   *
   * Horário em que o Pix foi processado no PSP.
   */
  horario: string;
  /** **Informação livre do pagador** */
  infoPagador?: string;
  /** **Devoluções** */
  devolucoes?: Devolucao[];
  tributo?: TributoCompletoPix;
  /**
   * **Valor Líquido do Pix.**
   *
   * Valor líquido do Pix após recolhimento de CBS e IBS.
   *
   * - Quando houver tributo segregado é dado pela fórmula: `valorLiquido = valor – (tributo.cbs.segregado.valor + tributo.ibs.segregado.valor)`
   * - Quando não houver tributo segregado: `valorLiquido = valor`
   */
  valorLiquido?: string;
}

/** **Pix Automático** */
export interface PixAutomatico {
  endToEndId: EndToEndId;
  txid: TxId;
  /**
   * **Valor do Pix.**
   *
   * Valor do Pix.
   */
  valor: string;
  /**
   * **Informações sobre o valor do Pix**
   *
   * O objetivo dessa estrutura é explicar os elementos de composição do valor do Pix, incluindo informações sobre as multas, juros, descontos e abatimentos quando o Pix for relativo a cobranças com vencimento.
   *
   * Regras da estrutura:
   * - O `valor` do Pix é igual a:
   *   - (`original.valor` + `saque.valor` + `troco.valor`) + `multa.valor` + `juros.valor` – `abatimento.valor` – `desconto.valor`
   *   considerando-se apenas os campos que estiverem presentes para cada tipo de cobrança pago.
   * - As estruturas `saque` e `troco` só serão retornadas quando o Pix for relativo a um Pix Saque ou Pix Troco, respectivamente, e
   * as demais estruturas (`juros`, `multa`, `abatimento` e `desconto`) só serão pertinentes aos Pix de pagamentos das cobranças com vencimento.
   * - Não pode haver simultaneamente uma subsestrutura do tipo `saque` e outra do tipo `troco`;
   * - Não há restrição na ordem das subestruturas.
   *
   * Para o caso de um Pix Saque pode-se retornar `original` com valor=0.00 (zero) uma vez que a soma será respeitada, ou pode-se omitir a
   * subestrutura original. No caso de um Pix Troco ou de um pagamento de cobrança com vencimento a subsestrutura `original` vai sempre estar
   * presente.
   *
   * #### Exemplos válidos:
   * Exemplo de preenchimentos válidos.
   *
   * - **Pix para pagamento de cobrança imediata (sem saque ou troco).**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "100.00"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix Saque.**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "saque": {
   *       "valor": "100.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix para pagamento de cobrança imediata com saque (pode vir original.valor=0.00).**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "0.00"
   *     },
   *     "saque": {
   *       "valor": "100.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix Troco.**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "80.00"
   *     },
   *     "troco": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGTEC",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix para pagamento de cobrança imediata com troco (ordem não importa).**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "troco": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGTEC",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     },
   *     "original": {
   *       "valor": "80.00"
   *     }
   *   }
   *   ...
   *   ```
   * - **Pix para pagamento de cobrança com vencimento de R$100,00 considerando-se um atraso de 2 dias a uma multa de 3% e juros de 1% ao dia. O `valor` do Pix será R$105,00.**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "100.00"
   *     },
   *     "multa": {
   *       "valor": "3.00"
   *     },
   *     "juros": {
   *       "valor": "2.00"
   *     }
   *   }
   *   ...
   *   ```
   * #### Exemplos inválidos:
   * Exemplos, não exaustivos, de preenchimentos inválidos.
   * - **`original.valor` maior que 0.00 (zero) e `saque` juntos**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "80.00"
   *     },
   *     "saque": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   * - **dois elementos de `saque`**
   *   ```
   *   ...
   *   "componentesValor": [
   *     "saque": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     },
   *     "saque": {
   *       "valor": "10.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   ]
   *   ...
   *   ```
   * - **saque e troco simultaneamente**
   *   ```
   *   ...
   *   "componentesValor": {
   *     "original": {
   *       "valor": "60.00"
   *     },
   *     "saque": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGFSS",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     },
   *     "troco": {
   *       "valor": "20.00",
   *       "modalidadeAgente": "AGTEC",
   *       "prestadorDeServicoDeSaque": "12345678"
   *     }
   *   }
   *   ...
   *   ```
   */
  componentesValor?:
    PixValorOriginal | PixValorJuros | PixValorMulta | PixValorAbatimento | PixValorDesconto;
  /**
   * **Horário**
   *
   * Horário em que o Pix foi processado no PSP.
   */
  horario: string;
  /** **Informação livre do pagador** */
  infoPagador?: string;
  /** **Devoluções** */
  devolucoes?: DevolucaoPixAutomatico[];
  tributo?: TributoCompletoPix;
  /**
   * **Valor Líquido do Pix.**
   *
   * Valor líquido do Pix após recolhimento de CBS e IBS.
   *
   * - Quando houver tributo segregado é dado pela fórmula: `valorLiquido = valor – (tributo.cbs.segregado.valor + tributo.ibs.segregado.valor)`
   * - Quando não houver tributo segregado: `valorLiquido = valor`
   */
  valorLiquido?: string;
}

export interface PixValorOriginal {
  original: {
    valor: string;
  };
}

export interface PixValorSaque {
  saque: {
    valor: string;
    modalidadeAgente: "AGTEC" | "AGTOT" | "AGPSS" | "AGFSS";
    prestadorDoServicoDeSaque: string;
  };
}

export interface PixValorTroco {
  troco: {
    valor: string;
    modalidadeAgente: "AGTEC" | "AGTOT";
    prestadorDoServicoDeSaque: string;
  };
}

export interface PixValorJuros {
  juros: {
    valor: string;
  };
}

export interface PixValorMulta {
  multa: {
    valor: string;
  };
}

export interface PixValorDesconto {
  desconto: {
    valor: string;
  };
}

export interface PixValorAbatimento {
  abatimento: {
    valor: string;
  };
}

/** **Devolução** */
export interface Devolucao {
  id: DevolucaoId;
  /**
   * **RtrId**
   *
   * ReturnIdentification que transita na PACS004.
   */
  rtrId: string;
  /**
   * **Valor a devolver.**
   *
   * Valor a devolver.
   */
  valor: string;
  natureza?: DevolucaoNatureza;
  /**
   * **Mensagem ao pagador relativa à devolução.**
   *
   * O campo `descricao`, opcional, determina um texto a ser apresentado ao pagador contendo informações sobre a devolução. Esse texto será preenchido, na pacs.004, pelo PSP do recebedor, no campo RemittanceInformation. O tamanho do campo na pacs.004 está limitado a 140 caracteres.
   */
  descricao?: string;
  horario: {
    solicitacao?: string;
    liquidacao?: string;
  };
  /**
   * **Status**
   *
   * Status da devolução.
   */
  status: "EM_PROCESSAMENTO" | "DEVOLVIDO" | "NAO_REALIZADO";
  /**
   * **Descrição do status.**
   *
   * # Status da Devolução
   *
   * Campo opcional que pode ser utilizado pelo PSP recebedor para detalhar os motivos
   * de a devolução ter atingido o status em questão.
   * Pode ser utilizado, por exemplo, para detalhar o motivo de a devolução não ter sido realizada.
   */
  motivo?: string;
}

/** **Devolução** */
export interface DevolucaoPixAutomatico {
  id: DevolucaoId;
  /**
   * **RtrId**
   *
   * ReturnIdentification que transita na PACS004.
   */
  rtrId: string;
  /**
   * **Valor a devolver.**
   *
   * Valor a devolver.
   */
  valor: string;
  natureza?: DevolucaoNaturezaPixAutomatico;
  /**
   * **Mensagem ao pagador relativa à devolução.**
   *
   * O campo `descricao`, opcional, determina um texto a ser apresentado ao pagador contendo informações sobre a devolução. Esse texto será preenchido, na pacs.004, pelo PSP do recebedor, no campo RemittanceInformation. O tamanho do campo na pacs.004 está limitado a 140 caracteres.
   */
  descricao?: string;
  horario: {
    solicitacao?: string;
    liquidacao?: string;
  };
  /**
   * **Status**
   *
   * Status da devolução.
   */
  status: "EM_PROCESSAMENTO" | "DEVOLVIDO" | "NAO_REALIZADO";
  /**
   * **Descrição do status.**
   *
   * # Status da Devolução
   *
   * Campo opcional que pode ser utilizado pelo PSP recebedor para detalhar os motivos
   * de a devolução ter atingido o status em questão.
   * Pode ser utilizado, por exemplo, para detalhar o motivo de a devolução não ter sido realizada.
   */
  motivo?: string;
}

export interface DevolucaoSolicitada {
  /**
   * **Valor**
   *
   * Valor solicitado para devolução. A soma dos valores de todas as devolucões não podem ultrapassar o valor total do Pix.
   */
  valor: string;
  natureza?: DevolucaoSolicitadaNatureza;
  /**
   * **Mensagem ao pagador relativa à devolução.**
   *
   * O campo `descricao`, opcional, determina um texto a ser apresentado ao pagador contendo informações sobre a devolução. Esse texto será preenchido, na pacs.004, pelo PSP do recebedor, no campo RemittanceInformation. O tamanho do campo na pacs.004 está limitado a 140 caracteres.
   */
  descricao?: string;
}

/**
 * **Parâmetros de consulta de locations**
 *
 * Parâmetros utilizados para a realização de uma consulta de locations.
 */
export interface ParametrosConsultaPayloadLocation {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  /** Filtro pela existência de txid. */
  txIdPresente?: boolean;
  tipoCob?: "cob" | "cobv";
  paginacao: Paginacao;
}

/**
 * **Parâmetros de consulta de locations**
 *
 * Parâmetros utilizados para a realização de uma consulta de locations.
 */
export interface ParametrosConsultaPayloadLocationRec {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  /** Filtro pela existência de id da recorrência. */
  idRecPresente?: boolean;
  /** **Recebedor** */
  recebedor?: {
    convenio?: string;
  };
  paginacao: Paginacao;
}

/** **Locations Consultadas** */
export interface PayloadLocationConsultadas {
  parametros: ParametrosConsultaPayloadLocation;
  /** **Lista de locations cadastradas** */
  loc: PayloadLocationCompleta[];
}

/** **Locations Consultadas** */
export interface PayloadLocationRecConsultadas {
  parametros: ParametrosConsultaPayloadLocationRec;
  /** **Lista de locations cadastradas** */
  loc: PayloadLocationRecCompleta[];
}

/**
 * **Parâmetros de Consulta Pix**
 *
 * Parâmetros utilizados para a realização de uma consulta de Pix.
 */
export interface ParametrosConsultaPix {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim: string;
  txid?: TxId;
  /** Filtro pela existência de txid. */
  txIdPresente?: boolean;
  /** Filtro pela existência do array de devoluções. */
  devolucaoPresente?: boolean;
  /** Filtro pela finalidade MED. Quando preenchido com `true` apenas os Pix (PACS008) cuja finalidade seja uma devolução no âmbito do MED serão retornados. Quando preenchido com `false` todos os Pix que não forem MED serão retornados. Na ausência deste filtro, qualquer Pix que atenda aos demais parâmetros de pesquisa será retornado na resposta. */
  finalidadeMED?: boolean;
  /** CPF */
  cpf?: string;
  /** CNPJ */
  cnpj?: string;
  paginacao: Paginacao;
}

/**
 * **Parâmetros de Consulta de Webhooks**
 *
 * Parâmetros utilizados para a realização de uma consulta de Webhooks.
 */
export interface ParametrosConsultaWebhooks {
  /**
   * **Data de Início**
   *
   * Data inicial utilizada na consulta. Respeita RFC 3339.
   */
  inicio?: string;
  /**
   * **Data de Fim**
   *
   * Data de fim utilizada na consulta. Respeita RFC 3339.
   */
  fim?: string;
  paginacao?: Paginacao;
}

/** **Pix Consultado** */
export type PixConsultado = {
  tributo?: TributoCompletoPix;
} & Pix;

/** **Pix Automático Consultado** */
export type PixAutomaticoConsultado = {
  tributo?: TributoCompletoPix;
  txid?: TxId;
} & PixAutomatico;

/** **Pix Consultados** */
export interface PixConsultados {
  parametros: ParametrosConsultaPix;
  /** **Lista de Pix recebidos** */
  pix: PixConsultado[];
}

/** **Webhooks Consultados** */
export interface WebhooksConsultados {
  parametros?: ParametrosConsultaWebhooks;
  /** **Lista de Webhooks consultados** */
  webhooks: WebhookCompleto[];
}

/** **Webhooks de Recorrências Consultados** */
export interface WebhooksRecConsultados {
  parametros?: ParametrosConsultaWebhooks;
  /** **Lista de Webhooks de Recorrências consultados** */
  webhooksrec: WebhookRecCompleto[];
}

/** **Paginação** */
export interface Paginacao {
  /**
   * **Página atual**
   *
   * Número da página recuperada.
   */
  paginaAtual: number;
  /**
   * **Itens por página**
   *
   * Quantidade de registros retornado na página.
   */
  itensPorPagina: number;
  /**
   * **Quantidade de páginas**
   *
   * Quantidade de páginas disponíveis para consulta.
   */
  quantidadeDePaginas: number;
  /**
   * **Quantidade total de itens**
   *
   * Quantidade total de itens disponíveis de acordo com os parâmetros informados.
   */
  quantidadeTotalDeItens: number;
}

/** **Violações** */
export interface Violacao {
  /**
   * **Descrição do erro**
   *
   * Descrição do erro
   */
  razao?: string;
  /**
   * **Nome da propriedade**
   *
   * Nome da propriedade
   */
  propriedade?: string;
  /**
   * **Valor da propriedade**
   *
   * Valor da propriedade
   */
  valor?: string;
}

export interface Problema {
  /** URI de referência que identifica o tipo de problema. De acordo com a RFC 7807. */
  type: string;
  /** Descrição resumida do problema. */
  title: string;
  /** Código HTTP do status retornado. */
  status: number;
  /** Descrição completa do problema. */
  detail?: string;
  /** Identificador de correlação do problema para fins de suporte */
  correlationId?: string;
  violacoes?: Violacao[];
}

/**
 * **Data de início**
 *
 * Filtra os registros cuja data de criação seja maior ou igual que a data de início. Respeita RFC 3339.
 */
export type Inicio = string;

/**
 * **Data de fim**
 *
 * Filtra os registros cuja data de criação seja menor ou igual que a data de fim. Respeita RFC 3339.
 */
export type Fim = string;

export type CobBody = CobSolicitada;

export type CobRBody = CobRSolicitada;

export type CobVBody = CobVSolicitada;

export interface LoteCobVBody {
  /** **Descrição do lote** */
  descricao: string;
  cobsv: ({
    txid: TxId;
  } & CobVSolicitada)[];
}

export interface LoteCobVBodyRevisado {
  /** **Descrição do lote** */
  descricao?: string;
  cobsv?: ({
    txid: TxId;
  } & CobVRevisada)[];
}

export type CobBodyRevisada = CobRevisada;

export type CobRBodyRevisada = CobRRevisada;

export type CobVBodyRevisada = CobVRevisada;

export type PayloadLocationBody = PayloadLocationSolicitada;

export type PayloadLocationRecBody = PayloadLocationRecSolicitada;

export type DevolucaoBody = DevolucaoSolicitada;

export type WebhookConfigBody = WebhookSolicitado;

export type WebhookRecConfigBody = WebhookRecSolicitado;

export type WebhookCobRConfigBody = WebhookCobRSolicitado;

export type WebhookCobConfigBody = WebhookCobSolicitado;

export type WebhookCobVConfigBody = WebhookCobVSolicitado;

export type SolicRecBody = SolicRecSolicitada;

export type SolicRecBodyRevisada = SolicRecRevisada;

export type RecBody = RecSolicitada;

export type RecBodyRevisada = RecRevisada;

export interface WebhookPixBody {
  pix?: PixConsultado[];
}

export interface WebhookRecBody {
  recs?: RecNotification[];
}

export interface WebhookCobRBody {
  cobsr?: CobRNotification[];
}

export interface WebhookCobBody {
  cobs?: CobNotification[];
}

export interface WebhookCobVBody {
  cobsv?: CobVNotification[];
}

export type GetPixE2eidResponseSchema = PixConsultado;

export type PostCobrTxidRetentativaDataResponseSchema = {
  tentativas: CobRCompleta["tentativas"];
} & CobRCompleta;
