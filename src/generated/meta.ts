/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Machine-readable provenance of the pinned spec and the errata applied during generation.
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

export const SPEC_VERSION = "2.11.0-rc1";
export const SPEC_SOURCE =
  "https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml";
export const SPEC_PINNED_COMMIT = "3ebbd6a184519cf8a032f2747b87cce2a3d05e7f";
export const SPEC_SHA256 = "cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4";

export interface SpecErratum {
  readonly id: string;
  readonly location: string;
  readonly description: string;
}

/**
 * Documented corrections applied to the pinned upstream file before generation.
 * Every entry is evidence-backed; see scripts/generator/errata.ts and README.md.
 */
export const SPEC_ERRATA: readonly SpecErratum[] = [
  {
    id: "slash-delimited-pattern",
    location: "e.g. components.schemas.PessoaFisica.properties.cpf.pattern",
    description:
      'Patterns written as delimited regexes ("/^\\d{11}$/") are unwrapped to "^\\d{11}$". JSON Schema patterns carry no delimiters; the same constraints are written bare elsewhere in the file (e.g. CNPJ "^[0-9A-Z]{14}$") and the official example payloads (cpf "12345678909") only validate when unwrapped.',
  },
  {
    id: "recnotification-required-quote",
    location: "components.schemas.RecNotification.required",
    description:
      'Upstream: required: ["idRec","status",atualizacao"] — a stray trailing quote makes the required key literally `atualizacao"`, which no payload can ever provide. Corrected to `atualizacao`, matching the property declared via RecAtualizacao and the official webhook example recWebhookNotification1.',
  },
  {
    id: "pixconsultados-required-cobs",
    location: "components.schemas.PixConsultados.required",
    description:
      'Upstream requires a property named "cobs", but PixConsultados declares "pix" (copy-paste from CobsConsultadas). The official example getPix1 provides "pix". Renamed cobs → pix.',
  },
  {
    id: "cobbase-infoadicionais-maximum",
    location: "components.schemas.CobBase.properties.infoAdicionais",
    description:
      "Upstream applies `maximum: 50` (a numeric keyword) to an array. JSON Schema ignores it; the evident intent — confirmed by every PSP limiting additional fields — is `maxItems: 50`. Corrected to maxItems.",
  },
  {
    id: "recbase-required-retentativa",
    location: "components.schemas.RecBase.required",
    description:
      'Upstream requires a property named "retentativa", which no schema declares anywhere. The real configuration field is `politicaRetentativa` — required by RecConfiguracao, which is composed alongside RecBase in every schema that needs it (RecSolicitada, RecCompleta, RecCompletaPesquisada, RecPayload). The requirement is therefore already expressed where the property lives; the undeclared key is dropped from RecBase.required.',
  },
  {
    id: "recbase-required-idrec",
    location: "components.schemas.RecBase.required",
    description:
      'Upstream requires "idRec" from RecBase, but RecBase does not declare idRec (response schemas declare it through their own allOf members, without marking it required). The official POST /rec request examples (recBody1, recBody2) omit idRec entirely — the PSP recebedor assigns it. The undeclared key is dropped from RecBase.required.',
  },
  {
    id: "solicrecbase-required-pagador",
    location: "components.schemas.SolicRecBase.required",
    description:
      'Upstream requires a property named "pagador", which neither SolicRecBase nor any composed schema declares; the official request/response examples (solicRecBody1, solicRecResponse1-3) never send it. Dropped from required.',
  },
  {
    id: "solicrerec-completa-required-rec",
    location: "components.schemas.SolicRecCompleta.required",
    description:
      'Upstream requires a property named "rec", but the schema declares "recPayload" (the RecPayload reference). All official examples provide recPayload. Renamed rec → recPayload.',
  },
  {
    id: "payloadlocationcob-required-tipocob",
    location: "components.schemas.PayloadLocationCob.required",
    description:
      'Upstream requires "tipoCob", which PayloadLocationCob does not declare (its only property is "id"); the official cob request examples send loc: { id } and the PSP infers tipoCob from the location. Dropped from required.',
  },
  {
    id: "payloadlocationrecgerada-required-tipo",
    location: "components.schemas.PayloadLocationRecGerada.required",
    description:
      'Upstream requires "tipo", which PayloadLocationRecGerada does not declare (properties: id, location, criacao); the official examples payloadLocationRecResponse1/2 do not send it. Dropped from required.',
  },
  {
    id: "cobgerada-loc-required-txid",
    location: "components.schemas.CobGerada.properties.loc.required",
    description:
      'The inline `loc` composition requires "txid", but the referenced PayloadLocation schema does not declare txid (only PayloadLocationCompleta does). The official cobResponse1-7 examples never include loc.txid. Undeclared key dropped from required (id, tipoCob and criacao remain, as declared by PayloadLocation).',
  },
  {
    id: "cobvgerada-loc-required-txid",
    location: "components.schemas.CobVGerada.properties.loc.required",
    description:
      'Same upstream defect as cobgerada-loc-required-txid, in the CobV variant: loc requires "txid", undeclared by the referenced PayloadLocation. Dropped from required.',
  },
  {
    id: "dadosrecebedor-top-level-required",
    location: "components.schemas.DadosRecebedor.required",
    description:
      "Upstream marks logradouro/cidade/uf/cep as required at the DadosRecebedor level, i.e. as TOP-LEVEL properties of every schema that composes it (CobVGerada, CobVCompleta, CobVPayload) — those keys are not declared there, and no official example (cobResponse4-7, cobPayload2/5) provides them at top level. The intended constraint (address required inside `recebedor`) is already expressed by the recebedor composition itself (allOf member `required: [logradouro, cidade, uf, cep]` + DadosComplementaresPessoa), which is kept intact. The spurious top-level required list is dropped.",
  },
  {
    id: "retirada-oneof-required-branches",
    location:
      "components.schemas.CobValor.properties.retirada.oneOf + CobPayloadValor.properties.retirada.oneOf",
    description:
      'The retirada oneOf branches declare `saque`/`troco` as optional properties, so ANY object matches BOTH branches (an unsatisfiable constraint: nothing can ever validate). The spec\'s own prose requires exclusivity ("Apenas um agrupamento por vez é permitido, quando há `saque` não há `troco` e vice-versa"). `required: ["saque"]` / `required: ["troco"]` are added to the respective branches, making them discriminating.',
  },
  {
    id: "recrevisada-devedor-identical-oneof",
    location: "components.schemas.RecRevisada.properties.vinculo.properties.devedor.oneOf",
    description:
      "The devedor oneOf has two character-identical branches (each `{ required: [nome], properties: { nome: … } }`), so every payload matches both — an unsatisfiable constraint. The oneOf is collapsed to the single (identical) branch it contains.",
  },
  {
    id: "encerramento-oneof-required-branches",
    location:
      "components.schemas.RecEncerramento.properties.encerramento.oneOf + CobRAtualizacao.properties.encerramento.oneOf",
    description:
      'Same defect as retirada-oneof-required-branches: the encerramento oneOf branches declare `rejeicao`/`cancelamento` as optional, making the constraint unsatisfiable (any object matches both). The spec prose distinguishes encerramento "POR rejeição" vs "POR cancelamento". `required: ["rejeicao"]` / `required: ["cancelamento"]` are added to the respective branches.',
  },
  {
    id: "componentesvalor-anyof-required-branches",
    location:
      "components.schemas.Pix.properties.componentesValor.anyOf + PixAutomatico.properties.componentesValor.anyOf (branch targets PixValor*)",
    description:
      'The componentesValor anyOf branches are $refs to PixValor* schemas that declare their single field (original/saque/troco/juros/multa/abatimento/desconto) as optional, so the union is vacuous: every possible object — including {} — matches at least one branch, and the constraint can never reject anything. The spec\'s own valid examples always populate the field of one branch ("componentesValor" exists to explain composed value elements). `required` is added to each referenced PixValor* schema so the union actually discriminates.',
  },
  {
    id: "dadospagadorrec-required-ispb",
    location: "components.schemas.DadosPagadorRec.required",
    description:
      'Upstream requires "ispbParticipante" at the DadosPagadorRec top level, but the property is declared inside `pagador` (allOf member), not at the top. Every official example (recResponse3-8, getRec1) provides ispbParticipante inside `pagador`. The requirement is moved to where the property lives: pagador.allOf[0].required gains "ispbParticipante" and the spurious top-level entry is dropped.',
  },
  {
    id: "cobvgerada-required-location",
    location: "components.schemas.CobVGerada.required",
    description:
      'Upstream requires a top-level "location" property, but no allOf member of CobVGerada declares it (CobGerada has an equivalent member; it was lost in the CobV copy). The official example cobResponse4 carries `location` only inside `loc`, not at top level. The undeclared key is dropped from required.',
  },
  {
    id: "cobsconsultadas-items-required-idcob",
    location:
      "components.schemas.CobsConsultadas.properties.cobs.items + CobsVConsultadas.properties.cobs.items",
    description:
      'The per-item composition requires "idCob", a property no schema in the entire file declares (status and txid are kept — both are declared by CobCompleta/CobVCompleta). The official list examples never carry idCob. Dropped from required.',
  },
  {
    id: "location-path-id-int64",
    location:
      "paths./loc/{id}, paths./loc/{id}/txid, paths./locrec/{id}, paths./locrec/{id}/idRec (parameters[0].schema)",
    description:
      'Upstream declares these four path parameters as bare `type: string`, but the identifiers they address are int64: `components.schemas.PayloadLocationId` (`type: integer, format: int64`) and `PayloadLocationRecId` (same). A string path parameter is the textual form of that id, so it must be a decimal int64 — not arbitrary text. Upstream string typing let `client.loc.get("1/../../x")` be interpolated into `GET /loc/1%2F..%2F..%2Fx`. `format: int64` is added while keeping `type: string` (path parameters are always textual); generated path validators then reject traversal, non-numeric values and int64 overflow.',
  },
];

export const SCHEMA_NAMES = [
  "TxId",
  "EndToEndId",
  "DevolucaoId",
  "DevolucaoSolicitadaNatureza",
  "DevolucaoNatureza",
  "DevolucaoNaturezaPixAutomatico",
  "PayloadLocationId",
  "PayloadLocationRecId",
  "Revisao",
  "PessoaFisica",
  "PessoaJuridica",
  "PessoaFisicaRecorrencia",
  "PessoaJuridicaRecorrencia",
  "CPF",
  "CNPJ",
  "DadosComplementaresPessoa",
  "DadosDevedor",
  "DadosDevedorRecorrencia",
  "DadosRecebedor",
  "DadosBancarios",
  "DadosBancariosRecebedor",
  "DadosPagadorRec",
  "WebhookSolicitado",
  "WebhookCompleto",
  "WebhookRecBase",
  "WebhookRecCompleto",
  "WebhookCobRCompleto",
  "WebhookCobCompleto",
  "WebhookCobVSolicitado",
  "WebhookCobVCompleto",
  "InfoBaseAgenciaConta",
  "InfoBaseChave",
  "WebhookRecSolicitado",
  "WebhookCobRSolicitado",
  "WebhookCobSolicitado",
  "CobExpiracao",
  "CobDataDeVencimento",
  "CobApresentacao",
  "CobCriacao",
  "CobVValor",
  "CobValor",
  "CobPayloadValor",
  "CobVPayloadValor",
  "RecCompleta",
  "RecCompletaPesquisada",
  "RecGerada",
  "RecSolicitada",
  "RecPayload",
  "RecRevisada",
  "RecNotification",
  "RecAtivacao",
  "RecAtivacaoSolicitada",
  "RecStatus",
  "RecConfiguracao",
  "RecAtualizacao",
  "RecEncerramento",
  "RecId",
  "RecBase",
  "SolicRecId",
  "SolicRecBase",
  "SolicRecStatus",
  "SolicRecAtualizacao",
  "SolicRecEncerramento",
  "SolicRecSolicitada",
  "SolicRecRevisada",
  "SolicRecCompleta",
  "TributoCompleto",
  "TributoCompletoPix",
  "TributoPayload",
  "TributoInformadoCompleto",
  "TributoInformadoSolicitado",
  "RegistroCategoriaTributoInformadoSolicitado",
  "RegistroCategoriaTributoInformadoCompleto",
  "RegistroCategoriaTributoPayload",
  "RegistroCategoriaTributoCompleto",
  "RegistroCategoriaTributoCompletoPix",
  "ValorTributoDetalheCompleto",
  "ValorTributoDetalheSolicitado",
  "ValorLiquidoEstimado",
  "CobRGerada",
  "CobRCompleta",
  "CobRAtualizacao",
  "CobRTentativas",
  "CobRRevisada",
  "CobRSolicitada",
  "CobRNotification",
  "CobNotification",
  "CobVNotification",
  "CobRConfiguracao",
  "CobRStatus",
  "CobRStatusRevisada",
  "CobRBase",
  "CobBase",
  "CobBaseCopiaCola",
  "CobSolicitada",
  "CobVSolicitada",
  "CobRevisada",
  "CobVRevisada",
  "CobGerada",
  "CobVGerada",
  "CobStatus",
  "CobVStatus",
  "LoteCobVGerado",
  "CobVCompleta",
  "CobCompleta",
  "LoteCobVConsultado",
  "LotesCobVConsultados",
  "CobVPayload",
  "CobPayload",
  "PayloadLocation",
  "PayloadLocationSolicitada",
  "PayloadLocationRecSolicitada",
  "PayloadLocationRecGerada",
  "PayloadLocationRecCompleta",
  "PayloadLocationCompleta",
  "PayloadLocationCob",
  "ParametrosConsultaRec",
  "ParametrosConsultaCob",
  "ParametrosConsultaCobR",
  "ParametrosConsultaLote",
  "CobsVConsultadas",
  "CobsConsultadas",
  "CobsRConsultadas",
  "RecsConsultadas",
  "Pix",
  "PixAutomatico",
  "PixValorOriginal",
  "PixValorSaque",
  "PixValorTroco",
  "PixValorJuros",
  "PixValorMulta",
  "PixValorDesconto",
  "PixValorAbatimento",
  "Devolucao",
  "DevolucaoPixAutomatico",
  "DevolucaoSolicitada",
  "ParametrosConsultaPayloadLocation",
  "ParametrosConsultaPayloadLocationRec",
  "PayloadLocationConsultadas",
  "PayloadLocationRecConsultadas",
  "ParametrosConsultaPix",
  "ParametrosConsultaWebhooks",
  "PixConsultado",
  "PixAutomaticoConsultado",
  "PixConsultados",
  "WebhooksConsultados",
  "WebhooksRecConsultados",
  "Paginacao",
  "Violacao",
  "Problema",
  "Inicio",
  "Fim",
] as const;
export const REQUEST_BODY_NAMES = [
  "CobBody",
  "CobRBody",
  "CobVBody",
  "LoteCobVBody",
  "LoteCobVBodyRevisado",
  "CobBodyRevisada",
  "CobRBodyRevisada",
  "CobVBodyRevisada",
  "PayloadLocationBody",
  "PayloadLocationRecBody",
  "DevolucaoBody",
  "WebhookConfigBody",
  "WebhookRecConfigBody",
  "WebhookCobRConfigBody",
  "WebhookCobConfigBody",
  "WebhookCobVConfigBody",
  "SolicRecBody",
  "SolicRecBodyRevisada",
  "RecBody",
  "RecBodyRevisada",
  "WebhookPixBody",
  "WebhookRecBody",
  "WebhookCobRBody",
  "WebhookCobBody",
  "WebhookCobVBody",
] as const;
export const OPERATION_NAMES = [
  "GetCobTxid",
  "PutCobTxid",
  "PatchCobTxid",
  "GetCob",
  "PostCob",
  "GetCobvTxid",
  "PutCobvTxid",
  "PatchCobvTxid",
  "GetCobv",
  "GetLotecobvId",
  "PutLotecobvId",
  "PatchLotecobvId",
  "GetLotecobv",
  "GetLocrec",
  "PostLocrec",
  "GetLocrecId",
  "DeleteLocrecIdIdRec",
  "GetLoc",
  "PostLoc",
  "GetLocId",
  "DeleteLocIdTxid",
  "GetPixE2eid",
  "GetPix",
  "GetPixE2eidDevolucaoId",
  "PutPixE2eidDevolucaoId",
  "GetPixUrlAccessToken",
  "GetCobvPixUrlAccessToken",
  "GetRecRecUrlAccessToken",
  "GetWebhookChave",
  "PutWebhookChave",
  "DeleteWebhookChave",
  "GetWebhook",
  "GetWebhookrec",
  "PutWebhookrec",
  "DeleteWebhookrec",
  "GetWebhookcobr",
  "PutWebhookcobr",
  "DeleteWebhookcobr",
  "GetWebhookcob",
  "PutWebhookcob",
  "DeleteWebhookcob",
  "GetWebhookcobv",
  "PutWebhookcobv",
  "DeleteWebhookcobv",
  "GetRecIdRec",
  "PatchRecIdRec",
  "GetRec",
  "PostRec",
  "PostSolicrec",
  "GetSolicrecIdSolicRec",
  "PatchSolicrecIdSolicRec",
  "GetCobrTxid",
  "PutCobrTxid",
  "PatchCobrTxid",
  "GetCobr",
  "PostCobr",
  "PostCobrTxidRetentativaData",
] as const;
