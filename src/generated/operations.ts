/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Per-operation request/response types, the runtime OPERATIONS registry, and parameter validators for every path in the spec.
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

import { validate, type ValidationResult } from "../validation/index.js";
import { constraintRegistry } from "./validators.js";
import type {
  CobBody,
  CobBodyRevisada,
  CobCompleta,
  CobGerada,
  CobPayload,
  CobRBody,
  CobRBodyRevisada,
  CobRCompleta,
  CobRGerada,
  CobVBody,
  CobVBodyRevisada,
  CobVCompleta,
  CobVGerada,
  CobVPayload,
  CobsConsultadas,
  CobsRConsultadas,
  CobsVConsultadas,
  Devolucao,
  DevolucaoBody,
  DevolucaoId,
  EndToEndId,
  Fim,
  GetPixE2eidResponseSchema,
  Inicio,
  LoteCobVBody,
  LoteCobVBodyRevisado,
  LoteCobVConsultado,
  LotesCobVConsultados,
  PayloadLocation,
  PayloadLocationBody,
  PayloadLocationCompleta,
  PayloadLocationConsultadas,
  PayloadLocationRecCompleta,
  PayloadLocationRecConsultadas,
  PayloadLocationRecGerada,
  PixConsultados,
  PostCobrTxidRetentativaDataResponseSchema,
  Problema,
  RecBody,
  RecBodyRevisada,
  RecCompleta,
  RecGerada,
  RecPayload,
  RecsConsultadas,
  Revisao,
  SolicRecBody,
  SolicRecBodyRevisada,
  SolicRecCompleta,
  TxId,
  WebhookCobCompleto,
  WebhookCobConfigBody,
  WebhookCobRCompleto,
  WebhookCobRConfigBody,
  WebhookCobVCompleto,
  WebhookCobVConfigBody,
  WebhookCompleto,
  WebhookConfigBody,
  WebhookRecCompleto,
  WebhookRecConfigBody,
  WebhooksConsultados,
} from "./schemas.js";

/**
 * HTTP methods available in the spec.
 */
export type HttpMethod = "get" | "put" | "post" | "patch" | "delete";

export interface ParamInfo {
  readonly name: string;
  readonly required: boolean;
}

export interface RequestBodyInfo {
  readonly name: string;
  readonly required: boolean;
  readonly schema: string;
}

export interface ResponseInfo {
  readonly code: number;
  readonly description: string;
  readonly contentType?: string;
  readonly schema?: string;
}

export interface OperationInfo {
  readonly name: string;
  readonly method: HttpMethod;
  readonly path: string;
  readonly tag: string;
  readonly summary: string;
  readonly scopes: readonly string[];
  readonly pathParams: readonly ParamInfo[];
  readonly queryParams: readonly ParamInfo[];
  readonly requestBody?: RequestBodyInfo;
  readonly responses: readonly ResponseInfo[];
  readonly hasResponseBody: boolean;
  readonly errorSchema: string;
}

/**
 * GET /cob/{txid} — Consultar cobrança imediata.
 *
 * Tag: Cob. Scopes: cob.read.
 */
export interface GetCobTxidPath {
  txid: TxId;
}

export interface GetCobTxidQuery {
  revisao?: Revisao;
}

export type GetCobTxidResponse = CobCompleta;
export type GetCobTxidError = Problema;

export function validateGetCobTxidPath(value: unknown): ValidationResult<GetCobTxidPath> {
  return validate<GetCobTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

export function validateGetCobTxidQuery(value: unknown): ValidationResult<GetCobTxidQuery> {
  return validate<GetCobTxidQuery>(
    {
      kind: "object",
      properties: {
        revisao: { kind: "ref", name: "Revisao" },
      },
      required: [],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PUT /cob/{txid} — Criar cobrança imediata.
 *
 * Tag: Cob. Scopes: cob.write.
 */
export interface PutCobTxidPath {
  txid: TxId;
}

export type PutCobTxidRequestBody = CobBody;
export type PutCobTxidResponse = CobGerada;
export type PutCobTxidError = Problema;

export function validatePutCobTxidPath(value: unknown): ValidationResult<PutCobTxidPath> {
  return validate<PutCobTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PATCH /cob/{txid} — Revisar cobrança imediata.
 *
 * Tag: Cob. Scopes: cob.write.
 */
export interface PatchCobTxidPath {
  txid: TxId;
}

export type PatchCobTxidRequestBody = CobBodyRevisada;
export type PatchCobTxidResponse = CobGerada;
export type PatchCobTxidError = Problema;

export function validatePatchCobTxidPath(value: unknown): ValidationResult<PatchCobTxidPath> {
  return validate<PatchCobTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /cob — Consultar lista de cobranças imediatas.
 *
 * Tag: Cob. Scopes: cob.read.
 */
export interface GetCobQuery {
  inicio: Inicio;
  fim: Fim;
  /** Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ. */
  cpf?: string;
  /** Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF. */
  cnpj?: string;
  locationPresente?: boolean;
  /** Filtro pelo status da cobrança. */
  status?: string;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetCobResponse = CobsConsultadas;
export type GetCobError = Problema;

export function validateGetCobQuery(value: unknown): ValidationResult<GetCobQuery> {
  return validate<GetCobQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        cpf: { kind: "string", pattern: /^\d{11}$/ },
        cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
        locationPresente: { kind: "boolean" },
        status: { kind: "string" },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * POST /cob — Criar cobrança imediata.
 *
 * Tag: Cob. Scopes: cob.write.
 */
export type PostCobRequestBody = CobBody;
export type PostCobResponse = CobGerada;
export type PostCobError = Problema;

/**
 * GET /cobv/{txid} — Consultar cobrança com vencimento.
 *
 * Tag: CobV. Scopes: cobv.read.
 */
export interface GetCobvTxidPath {
  txid: TxId;
}

export interface GetCobvTxidQuery {
  revisao?: Revisao;
}

export type GetCobvTxidResponse = CobVCompleta;
export type GetCobvTxidError = Problema;

export function validateGetCobvTxidPath(value: unknown): ValidationResult<GetCobvTxidPath> {
  return validate<GetCobvTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

export function validateGetCobvTxidQuery(value: unknown): ValidationResult<GetCobvTxidQuery> {
  return validate<GetCobvTxidQuery>(
    {
      kind: "object",
      properties: {
        revisao: { kind: "ref", name: "Revisao" },
      },
      required: [],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PUT /cobv/{txid} — Criar cobrança com vencimento.
 *
 * Tag: CobV. Scopes: cobv.write.
 */
export interface PutCobvTxidPath {
  txid: TxId;
}

export type PutCobvTxidRequestBody = CobVBody;
export type PutCobvTxidResponse = CobVGerada;
export type PutCobvTxidError = Problema;

export function validatePutCobvTxidPath(value: unknown): ValidationResult<PutCobvTxidPath> {
  return validate<PutCobvTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PATCH /cobv/{txid} — Revisar cobrança com vencimento.
 *
 * Tag: CobV. Scopes: cobv.write.
 */
export interface PatchCobvTxidPath {
  txid: TxId;
}

export type PatchCobvTxidRequestBody = CobVBodyRevisada;
export type PatchCobvTxidResponse = CobVGerada;
export type PatchCobvTxidError = Problema;

export function validatePatchCobvTxidPath(value: unknown): ValidationResult<PatchCobvTxidPath> {
  return validate<PatchCobvTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /cobv — Consultar lista de cobranças com vencimento.
 *
 * Tag: CobV. Scopes: cobv.read.
 */
export interface GetCobvQuery {
  inicio: Inicio;
  fim: Fim;
  /** Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ. */
  cpf?: string;
  /** Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF. */
  cnpj?: string;
  locationPresente?: boolean;
  /** Filtro pelo status da cobrança. */
  status?: string;
  /** Id do lote de cobrança com vencimento. */
  loteCobVId?: number;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetCobvResponse = CobsVConsultadas;
export type GetCobvError = Problema;

export function validateGetCobvQuery(value: unknown): ValidationResult<GetCobvQuery> {
  return validate<GetCobvQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        cpf: { kind: "string", pattern: /^\d{11}$/ },
        cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
        locationPresente: { kind: "boolean" },
        status: { kind: "string" },
        loteCobVId: { kind: "number", integer: true },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /lotecobv/{id} — Consultar um lote específico de cobranças com vencimento.
 *
 * Tag: LoteCobV. Scopes: lotecobv.read.
 */
export interface GetLotecobvIdPath {
  id: string;
}

export type GetLotecobvIdResponse = LoteCobVConsultado;
export type GetLotecobvIdError = Problema;

export function validateGetLotecobvIdPath(value: unknown): ValidationResult<GetLotecobvIdPath> {
  return validate<GetLotecobvIdPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1 },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PUT /lotecobv/{id} — Criar/Alterar lote de cobranças com vencimento.
 *
 * Tag: LoteCobV. Scopes: lotecobv.write.
 */
export interface PutLotecobvIdPath {
  id: string;
}

export type PutLotecobvIdRequestBody = LoteCobVBody;
export type PutLotecobvIdResponse = undefined;
export type PutLotecobvIdError = Problema;

export function validatePutLotecobvIdPath(value: unknown): ValidationResult<PutLotecobvIdPath> {
  return validate<PutLotecobvIdPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1 },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PATCH /lotecobv/{id} — Utilizado para revisar cobranças específicas dentro de um lote de cobranças com vencimento.
 *
 * Tag: LoteCobV. Scopes: lotecobv.write.
 */
export interface PatchLotecobvIdPath {
  id: string;
}

export type PatchLotecobvIdRequestBody = LoteCobVBodyRevisado;
export type PatchLotecobvIdResponse = undefined;
export type PatchLotecobvIdError = Problema;

export function validatePatchLotecobvIdPath(value: unknown): ValidationResult<PatchLotecobvIdPath> {
  return validate<PatchLotecobvIdPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1 },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /lotecobv — Consultar lotes de cobranças com vencimento.
 *
 * Tag: LoteCobV. Scopes: lotecobv.read.
 */
export interface GetLotecobvQuery {
  inicio: Inicio;
  fim: Fim;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetLotecobvResponse = LotesCobVConsultados;
export type GetLotecobvError = Problema;

export function validateGetLotecobvQuery(value: unknown): ValidationResult<GetLotecobvQuery> {
  return validate<GetLotecobvQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /locrec — Consultar locations cadastradas.
 *
 * Tag: PayloadLocationRec. Scopes: payloadlocationrec.read.
 */
export interface GetLocrecQuery {
  inicio: Inicio;
  fim: Fim;
  idRecPresente?: boolean;
  /** Filtro pelo convênio associado. */
  convenio?: string;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetLocrecResponse = PayloadLocationRecConsultadas;
export type GetLocrecError = Problema;

export function validateGetLocrecQuery(value: unknown): ValidationResult<GetLocrecQuery> {
  return validate<GetLocrecQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        idRecPresente: { kind: "boolean" },
        convenio: { kind: "string", maxLength: 60 },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * POST /locrec — Criar location do payload.
 *
 * Tag: PayloadLocationRec. Scopes: payloadlocationrec.write.
 */
export type PostLocrecResponse = PayloadLocationRecGerada;
export type PostLocrecError = Problema;

/**
 * GET /locrec/{id} — Recuperar location do payload.
 *
 * Tag: PayloadLocationRec. Scopes: payloadlocationrec.read.
 */
export interface GetLocrecIdPath {
  id: string;
}

export type GetLocrecIdResponse = PayloadLocationRecCompleta;
export type GetLocrecIdError = Problema;

export function validateGetLocrecIdPath(value: unknown): ValidationResult<GetLocrecIdPath> {
  return validate<GetLocrecIdPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1, format: "int64" },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * DELETE /locrec/{id}/idRec — Desvincular uma recorrência de uma location.
 *
 * Tag: PayloadLocationRec. Scopes: payloadlocationrec.write.
 */
export interface DeleteLocrecIdIdRecPath {
  id: string;
}

export type DeleteLocrecIdIdRecResponse = PayloadLocationRecCompleta;
export type DeleteLocrecIdIdRecError = Problema;

export function validateDeleteLocrecIdIdRecPath(
  value: unknown,
): ValidationResult<DeleteLocrecIdIdRecPath> {
  return validate<DeleteLocrecIdIdRecPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1, format: "int64" },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /loc — Consultar locations cadastradas.
 *
 * Tag: PayloadLocation. Scopes: payloadlocation.read.
 */
export interface GetLocQuery {
  inicio: Inicio;
  fim: Fim;
  txIdPresente?: boolean;
  tipoCob?: "cob" | "cobv";
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetLocResponse = PayloadLocationConsultadas;
export type GetLocError = Problema;

export function validateGetLocQuery(value: unknown): ValidationResult<GetLocQuery> {
  return validate<GetLocQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        txIdPresente: { kind: "boolean" },
        tipoCob: { kind: "string", enumValues: ["cob", "cobv"] },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * POST /loc — Criar location do payload.
 *
 * Tag: PayloadLocation. Scopes: payloadlocation.write.
 */
export type PostLocRequestBody = PayloadLocationBody;
export type PostLocResponse = PayloadLocation;
export type PostLocError = Problema;

/**
 * GET /loc/{id} — Recuperar location do payload.
 *
 * Tag: PayloadLocation. Scopes: payloadlocation.read.
 */
export interface GetLocIdPath {
  id: string;
}

export type GetLocIdResponse = PayloadLocationCompleta;
export type GetLocIdError = Problema;

export function validateGetLocIdPath(value: unknown): ValidationResult<GetLocIdPath> {
  return validate<GetLocIdPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1, format: "int64" },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * DELETE /loc/{id}/txid — Desvincular uma cobrança de uma location.
 *
 * Tag: PayloadLocation. Scopes: payloadlocation.write.
 */
export interface DeleteLocIdTxidPath {
  id: string;
}

export type DeleteLocIdTxidResponse = PayloadLocation;
export type DeleteLocIdTxidError = Problema;

export function validateDeleteLocIdTxidPath(value: unknown): ValidationResult<DeleteLocIdTxidPath> {
  return validate<DeleteLocIdTxidPath>(
    {
      kind: "object",
      properties: {
        id: { kind: "string", minLength: 1, format: "int64" },
      },
      required: ["id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /pix/{e2eid} — Consultar Pix.
 *
 * Tag: Pix. Scopes: pix.read.
 */
export interface GetPixE2eidPath {
  e2eid: EndToEndId;
}

export type GetPixE2eidResponse = GetPixE2eidResponseSchema;
export type GetPixE2eidError = Problema;

export function validateGetPixE2eidPath(value: unknown): ValidationResult<GetPixE2eidPath> {
  return validate<GetPixE2eidPath>(
    {
      kind: "object",
      properties: {
        e2eid: { kind: "ref", name: "EndToEndId" },
      },
      required: ["e2eid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /pix — Consultar Pix recebidos.
 *
 * Tag: Pix. Scopes: pix.read.
 */
export interface GetPixQuery {
  inicio: Inicio;
  fim: Fim;
  txid?: TxId;
  txIdPresente?: boolean;
  devolucaoPresente?: boolean;
  finalidadeMED?: boolean;
  /** Filtro pelo CPF do pagador. Não pode ser utilizado ao mesmo tempo que o CNPJ. */
  cpf?: string;
  /** Filtro pelo CNPJ do pagador. Não pode ser utilizado ao mesmo tempo que o CPF. */
  cnpj?: string;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetPixResponse = PixConsultados;
export type GetPixError = Problema;

export function validateGetPixQuery(value: unknown): ValidationResult<GetPixQuery> {
  return validate<GetPixQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
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
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /pix/{e2eid}/devolucao/{id} — Consultar devolução.
 *
 * Tag: Pix. Scopes: pix.read.
 */
export interface GetPixE2eidDevolucaoIdPath {
  e2eid: EndToEndId;
  id: DevolucaoId;
}

export type GetPixE2eidDevolucaoIdResponse = Devolucao;
export type GetPixE2eidDevolucaoIdError = Problema;

export function validateGetPixE2eidDevolucaoIdPath(
  value: unknown,
): ValidationResult<GetPixE2eidDevolucaoIdPath> {
  return validate<GetPixE2eidDevolucaoIdPath>(
    {
      kind: "object",
      properties: {
        e2eid: { kind: "ref", name: "EndToEndId" },
        id: { kind: "ref", name: "DevolucaoId" },
      },
      required: ["e2eid", "id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PUT /pix/{e2eid}/devolucao/{id} — Solicitar devolução.
 *
 * Tag: Pix. Scopes: pix.write.
 */
export interface PutPixE2eidDevolucaoIdPath {
  e2eid: EndToEndId;
  id: DevolucaoId;
}

export type PutPixE2eidDevolucaoIdRequestBody = DevolucaoBody;
export type PutPixE2eidDevolucaoIdResponse = Devolucao;
export type PutPixE2eidDevolucaoIdError = Problema;

export function validatePutPixE2eidDevolucaoIdPath(
  value: unknown,
): ValidationResult<PutPixE2eidDevolucaoIdPath> {
  return validate<PutPixE2eidDevolucaoIdPath>(
    {
      kind: "object",
      properties: {
        e2eid: { kind: "ref", name: "EndToEndId" },
        id: { kind: "ref", name: "DevolucaoId" },
      },
      required: ["e2eid", "id"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /{pixUrlAccessToken} — Recuperar o payload JSON que representa a cobrança imediata.
 *
 * Tag: CobPayload. Scopes: (unauthenticated).
 */
export interface GetPixUrlAccessTokenPath {
  pixUrlAccessToken: string;
}

export type GetPixUrlAccessTokenResponse = CobPayload;
export type GetPixUrlAccessTokenError = Problema;

export function validateGetPixUrlAccessTokenPath(
  value: unknown,
): ValidationResult<GetPixUrlAccessTokenPath> {
  return validate<GetPixUrlAccessTokenPath>(
    {
      kind: "object",
      properties: {
        pixUrlAccessToken: { kind: "string", minLength: 1 },
      },
      required: ["pixUrlAccessToken"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /cobv/{pixUrlAccessToken} — Recuperar o payload JSON que representa a cobrança com vencimento.
 *
 * Tag: CobPayload. Scopes: (unauthenticated).
 */
export interface GetCobvPixUrlAccessTokenPath {
  pixUrlAccessToken: string;
}

export interface GetCobvPixUrlAccessTokenQuery {
  codMun?: string;
  DPP?: string;
}

export type GetCobvPixUrlAccessTokenResponse = CobVPayload;
export type GetCobvPixUrlAccessTokenError = Problema;

export function validateGetCobvPixUrlAccessTokenPath(
  value: unknown,
): ValidationResult<GetCobvPixUrlAccessTokenPath> {
  return validate<GetCobvPixUrlAccessTokenPath>(
    {
      kind: "object",
      properties: {
        pixUrlAccessToken: { kind: "string", minLength: 1 },
      },
      required: ["pixUrlAccessToken"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

export function validateGetCobvPixUrlAccessTokenQuery(
  value: unknown,
): ValidationResult<GetCobvPixUrlAccessTokenQuery> {
  return validate<GetCobvPixUrlAccessTokenQuery>(
    {
      kind: "object",
      properties: {
        codMun: { kind: "string", pattern: /^\d{7}$/ },
        DPP: { kind: "string", format: "date" },
      },
      required: [],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /rec/{recUrlAccessToken} — Recuperar o payload JSON que representa a configuração da recorrência.
 *
 * Tag: RecPayload. Scopes: (unauthenticated).
 */
export interface GetRecRecUrlAccessTokenPath {
  recUrlAccessToken: string;
}

export type GetRecRecUrlAccessTokenResponse = RecPayload;
export type GetRecRecUrlAccessTokenError = Problema;

export function validateGetRecRecUrlAccessTokenPath(
  value: unknown,
): ValidationResult<GetRecRecUrlAccessTokenPath> {
  return validate<GetRecRecUrlAccessTokenPath>(
    {
      kind: "object",
      properties: {
        recUrlAccessToken: { kind: "string", minLength: 1 },
      },
      required: ["recUrlAccessToken"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /webhook/{chave} — Exibir informações acerca do Webhook Pix.
 *
 * Tag: Webhook. Scopes: webhook.read.
 */
export interface GetWebhookChavePath {
  chave: string;
}

export type GetWebhookChaveResponse = WebhookCompleto;
export type GetWebhookChaveError = Problema;

export function validateGetWebhookChavePath(value: unknown): ValidationResult<GetWebhookChavePath> {
  return validate<GetWebhookChavePath>(
    {
      kind: "object",
      properties: {
        chave: { kind: "string", minLength: 1, maxLength: 77 },
      },
      required: ["chave"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PUT /webhook/{chave} — Configurar o Webhook Pix.
 *
 * Tag: Webhook. Scopes: webhook.write.
 */
export interface PutWebhookChavePath {
  chave: string;
}

export type PutWebhookChaveRequestBody = WebhookConfigBody;
export type PutWebhookChaveResponse = undefined;
export type PutWebhookChaveError = Problema;

export function validatePutWebhookChavePath(value: unknown): ValidationResult<PutWebhookChavePath> {
  return validate<PutWebhookChavePath>(
    {
      kind: "object",
      properties: {
        chave: { kind: "string", minLength: 1, maxLength: 77 },
      },
      required: ["chave"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * DELETE /webhook/{chave} — Cancelar o webhook Pix.
 *
 * Tag: Webhook. Scopes: webhook.write.
 */
export interface DeleteWebhookChavePath {
  chave: string;
}

export type DeleteWebhookChaveResponse = undefined;
export type DeleteWebhookChaveError = Problema;

export function validateDeleteWebhookChavePath(
  value: unknown,
): ValidationResult<DeleteWebhookChavePath> {
  return validate<DeleteWebhookChavePath>(
    {
      kind: "object",
      properties: {
        chave: { kind: "string", minLength: 1, maxLength: 77 },
      },
      required: ["chave"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /webhook — Consultar webhooks cadastrados.
 *
 * Tag: Webhook. Scopes: webhook.read.
 */
export interface GetWebhookQuery {
  inicio?: Inicio;
  fim?: Fim;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetWebhookResponse = WebhooksConsultados;
export type GetWebhookError = Problema;

export function validateGetWebhookQuery(value: unknown): ValidationResult<GetWebhookQuery> {
  return validate<GetWebhookQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: [],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /webhookrec — Exibir informações acerca do Webhook.
 *
 * Tag: WebhookRec. Scopes: webhookrec.read.
 */
export type GetWebhookrecResponse = WebhookRecCompleto;
export type GetWebhookrecError = Problema;

/**
 * PUT /webhookrec — Configurar Webhook.
 *
 * Tag: WebhookRec. Scopes: webhookrec.write.
 */
export type PutWebhookrecRequestBody = WebhookRecConfigBody;
export type PutWebhookrecResponse = undefined;
export type PutWebhookrecError = Problema;

/**
 * DELETE /webhookrec — Cancelar o Webhook.
 *
 * Tag: WebhookRec. Scopes: webhookrec.write.
 */
export type DeleteWebhookrecResponse = undefined;
export type DeleteWebhookrecError = Problema;

/**
 * GET /webhookcobr — Exibir informações acerca do Webhook.
 *
 * Tag: WebhookCobR. Scopes: webhookcobr.read.
 */
export type GetWebhookcobrResponse = WebhookCobRCompleto;
export type GetWebhookcobrError = Problema;

/**
 * PUT /webhookcobr — Configurar Webhook.
 *
 * Tag: WebhookCobR. Scopes: webhookcobr.write.
 */
export type PutWebhookcobrRequestBody = WebhookCobRConfigBody;
export type PutWebhookcobrResponse = undefined;
export type PutWebhookcobrError = Problema;

/**
 * DELETE /webhookcobr — Cancelar o Webhook.
 *
 * Tag: WebhookCobR. Scopes: webhookcobr.write.
 */
export type DeleteWebhookcobrResponse = undefined;
export type DeleteWebhookcobrError = Problema;

/**
 * GET /webhookcob — Exibir informações acerca do Webhook.
 *
 * Tag: WebhookCob. Scopes: webhookcob.read.
 */
export type GetWebhookcobResponse = WebhookCobCompleto;
export type GetWebhookcobError = Problema;

/**
 * PUT /webhookcob — Configurar Webhook.
 *
 * Tag: WebhookCob. Scopes: webhookcob.write.
 */
export type PutWebhookcobRequestBody = WebhookCobConfigBody;
export type PutWebhookcobResponse = undefined;
export type PutWebhookcobError = Problema;

/**
 * DELETE /webhookcob — Cancelar o Webhook.
 *
 * Tag: WebhookCob. Scopes: webhookcob.write.
 */
export type DeleteWebhookcobResponse = undefined;
export type DeleteWebhookcobError = Problema;

/**
 * GET /webhookcobv — Exibir informações acerca do Webhook.
 *
 * Tag: WebhookCobV. Scopes: webhookcobv.read.
 */
export type GetWebhookcobvResponse = WebhookCobVCompleto;
export type GetWebhookcobvError = Problema;

/**
 * PUT /webhookcobv — Configurar Webhook.
 *
 * Tag: WebhookCobV. Scopes: webhookcobV.write.
 */
export type PutWebhookcobvRequestBody = WebhookCobVConfigBody;
export type PutWebhookcobvResponse = undefined;
export type PutWebhookcobvError = Problema;

/**
 * DELETE /webhookcobv — Cancelar o Webhook.
 *
 * Tag: WebhookCobV. Scopes: webhookcobv.write.
 */
export type DeleteWebhookcobvResponse = undefined;
export type DeleteWebhookcobvError = Problema;

/**
 * GET /rec/{idRec} — Consultar recorrência.
 *
 * Tag: Rec. Scopes: rec.read.
 */
export interface GetRecIdRecPath {
  idRec: string;
}

export interface GetRecIdRecQuery {
  txid?: string;
}

export type GetRecIdRecResponse = RecCompleta;
export type GetRecIdRecError = Problema;

export function validateGetRecIdRecPath(value: unknown): ValidationResult<GetRecIdRecPath> {
  return validate<GetRecIdRecPath>(
    {
      kind: "object",
      properties: {
        idRec: { kind: "string", minLength: 1 },
      },
      required: ["idRec"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

export function validateGetRecIdRecQuery(value: unknown): ValidationResult<GetRecIdRecQuery> {
  return validate<GetRecIdRecQuery>(
    {
      kind: "object",
      properties: {
        txid: { kind: "string", pattern: /[a-zA-Z0-9]{26,35}/ },
      },
      required: [],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PATCH /rec/{idRec} — Revisar recorrência.
 *
 * Tag: Rec. Scopes: rec.write.
 */
export interface PatchRecIdRecPath {
  idRec: string;
}

export type PatchRecIdRecRequestBody = RecBodyRevisada;
export type PatchRecIdRecResponse = RecGerada;
export type PatchRecIdRecError = Problema;

export function validatePatchRecIdRecPath(value: unknown): ValidationResult<PatchRecIdRecPath> {
  return validate<PatchRecIdRecPath>(
    {
      kind: "object",
      properties: {
        idRec: { kind: "string", minLength: 1 },
      },
      required: ["idRec"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /rec — Consultar lista de recorrências.
 *
 * Tag: Rec. Scopes: rec.read.
 */
export interface GetRecQuery {
  inicio: Inicio;
  fim: Fim;
  /** Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ. */
  cpf?: string;
  /** Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF. */
  cnpj?: string;
  locationPresente?: boolean;
  /** Filtro pelo status da recorrência. */
  status?: string;
  /** Filtro pelo convênio associado. */
  convenio?: string;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetRecResponse = RecsConsultadas;
export type GetRecError = Problema;

export function validateGetRecQuery(value: unknown): ValidationResult<GetRecQuery> {
  return validate<GetRecQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        cpf: { kind: "string", pattern: /^\d{11}$/ },
        cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
        locationPresente: { kind: "boolean" },
        status: { kind: "string" },
        convenio: { kind: "string", maxLength: 60 },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * POST /rec — Criar recorrência.
 *
 * Tag: Rec. Scopes: rec.write.
 */
export type PostRecRequestBody = RecBody;
export type PostRecResponse = RecGerada;
export type PostRecError = Problema;

/**
 * POST /solicrec — Criar solicitação de confirmação de recorrência.
 *
 * Tag: SolicRec. Scopes: solicrec.write.
 */
export type PostSolicrecRequestBody = SolicRecBody;
export type PostSolicrecResponse = SolicRecCompleta;
export type PostSolicrecError = Problema;

/**
 * GET /solicrec/{idSolicRec} — Consultar solicitação de confirmação de recorrência.
 *
 * Tag: SolicRec. Scopes: solicrec.read.
 */
export interface GetSolicrecIdSolicRecPath {
  idSolicRec: string;
}

export type GetSolicrecIdSolicRecResponse = SolicRecCompleta;
export type GetSolicrecIdSolicRecError = Problema;

export function validateGetSolicrecIdSolicRecPath(
  value: unknown,
): ValidationResult<GetSolicrecIdSolicRecPath> {
  return validate<GetSolicrecIdSolicRecPath>(
    {
      kind: "object",
      properties: {
        idSolicRec: { kind: "string", minLength: 1 },
      },
      required: ["idSolicRec"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PATCH /solicrec/{idSolicRec} — Revisar solicitação de confirmação de recorrência.
 *
 * Tag: SolicRec. Scopes: solicrec.write.
 */
export interface PatchSolicrecIdSolicRecPath {
  idSolicRec: string;
}

export type PatchSolicrecIdSolicRecRequestBody = SolicRecBodyRevisada;
export type PatchSolicrecIdSolicRecResponse = SolicRecCompleta;
export type PatchSolicrecIdSolicRecError = Problema;

export function validatePatchSolicrecIdSolicRecPath(
  value: unknown,
): ValidationResult<PatchSolicrecIdSolicRecPath> {
  return validate<PatchSolicrecIdSolicRecPath>(
    {
      kind: "object",
      properties: {
        idSolicRec: { kind: "string", minLength: 1 },
      },
      required: ["idSolicRec"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /cobr/{txid} — Consultar cobrança recorrente.
 *
 * Tag: CobR. Scopes: cobr.read.
 */
export interface GetCobrTxidPath {
  txid: TxId;
}

export type GetCobrTxidResponse = CobRCompleta;
export type GetCobrTxidError = Problema;

export function validateGetCobrTxidPath(value: unknown): ValidationResult<GetCobrTxidPath> {
  return validate<GetCobrTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PUT /cobr/{txid} — Criar cobrança recorrente.
 *
 * Tag: CobR. Scopes: cobr.write.
 */
export interface PutCobrTxidPath {
  txid: TxId;
}

export type PutCobrTxidRequestBody = CobRBody;
export type PutCobrTxidResponse = CobRGerada;
export type PutCobrTxidError = Problema;

export function validatePutCobrTxidPath(value: unknown): ValidationResult<PutCobrTxidPath> {
  return validate<PutCobrTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * PATCH /cobr/{txid} — Revisar cobrança recorrente.
 *
 * Tag: CobR. Scopes: cobr.write.
 */
export interface PatchCobrTxidPath {
  txid: TxId;
}

export type PatchCobrTxidRequestBody = CobRBodyRevisada;
export type PatchCobrTxidResponse = CobRGerada;
export type PatchCobrTxidError = Problema;

export function validatePatchCobrTxidPath(value: unknown): ValidationResult<PatchCobrTxidPath> {
  return validate<PatchCobrTxidPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
      },
      required: ["txid"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * GET /cobr — Consultar lista de cobranças recorrentes.
 *
 * Tag: CobR. Scopes: cobr.read.
 */
export interface GetCobrQuery {
  inicio: Inicio;
  fim: Fim;
  /** Filtro pelo Identificador da Recorrência. */
  idRec?: string;
  /** Filtro pelo CPF do devedor. Não pode ser utilizado ao mesmo tempo que o CNPJ. */
  cpf?: string;
  /** Filtro pelo CNPJ do devedor. Não pode ser utilizado ao mesmo tempo que o CPF. */
  cnpj?: string;
  /** Filtro pelo status da cobrança recorrente. */
  status?: string;
  /** Filtro pelo convênio associado. */
  convenio?: string;
  /** Página a ser retornada pela consulta. Se não for informada, o PSP assumirá que será 0. */
  "paginacao.paginaAtual"?: number;
  /** Quantidade máxima de registros retornados em cada página. Apenas a última página pode conter uma quantidade menor de registros. */
  "paginacao.itensPorPagina"?: number;
}

export type GetCobrResponse = CobsRConsultadas;
export type GetCobrError = Problema;

export function validateGetCobrQuery(value: unknown): ValidationResult<GetCobrQuery> {
  return validate<GetCobrQuery>(
    {
      kind: "object",
      properties: {
        inicio: { kind: "ref", name: "Inicio" },
        fim: { kind: "ref", name: "Fim" },
        idRec: { kind: "string", minLength: 29, maxLength: 29, pattern: /[a-zA-Z0-9]{29}/ },
        cpf: { kind: "string", pattern: /^\d{11}$/ },
        cnpj: { kind: "string", pattern: /^[0-9A-Z]{14}$/ },
        status: { kind: "string" },
        convenio: { kind: "string", maxLength: 60 },
        "paginacao.paginaAtual": { kind: "number", integer: true, minimum: 0 },
        "paginacao.itensPorPagina": { kind: "number", integer: true, minimum: 1, maximum: 1000 },
      },
      required: ["inicio", "fim"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * POST /cobr — Criar cobrança recorrente.
 *
 * Tag: CobR. Scopes: cobr.write.
 */
export type PostCobrRequestBody = CobRBody;
export type PostCobrResponse = CobRGerada;
export type PostCobrError = Problema;

/**
 * POST /cobr/{txid}/retentativa/{data} — Solicitar retentativa de cobrança.
 *
 * Tag: CobR. Scopes: cobr.write.
 */
export interface PostCobrTxidRetentativaDataPath {
  txid: TxId;
  data: string;
}

export type PostCobrTxidRetentativaDataResponse = PostCobrTxidRetentativaDataResponseSchema;
export type PostCobrTxidRetentativaDataError = Problema;

export function validatePostCobrTxidRetentativaDataPath(
  value: unknown,
): ValidationResult<PostCobrTxidRetentativaDataPath> {
  return validate<PostCobrTxidRetentativaDataPath>(
    {
      kind: "object",
      properties: {
        txid: { kind: "ref", name: "TxId" },
        data: { kind: "string", minLength: 1, format: "date" },
      },
      required: ["txid", "data"],
      additionalProperties: true,
    },
    value,
    constraintRegistry,
  );
}

/**
 * Parameter validators by operation name — the SDK client validates path and
 * query parameters with these before sending a request.
 */
export interface ParamValidators {
  readonly path?: (value: unknown) => ValidationResult<unknown>;
  readonly query?: (value: unknown) => ValidationResult<unknown>;
}

export const paramValidators: Readonly<Record<string, ParamValidators>> = {
  GetCobTxid: { path: validateGetCobTxidPath, query: validateGetCobTxidQuery },
  PutCobTxid: { path: validatePutCobTxidPath },
  PatchCobTxid: { path: validatePatchCobTxidPath },
  GetCob: { query: validateGetCobQuery },
  GetCobvTxid: { path: validateGetCobvTxidPath, query: validateGetCobvTxidQuery },
  PutCobvTxid: { path: validatePutCobvTxidPath },
  PatchCobvTxid: { path: validatePatchCobvTxidPath },
  GetCobv: { query: validateGetCobvQuery },
  GetLotecobvId: { path: validateGetLotecobvIdPath },
  PutLotecobvId: { path: validatePutLotecobvIdPath },
  PatchLotecobvId: { path: validatePatchLotecobvIdPath },
  GetLotecobv: { query: validateGetLotecobvQuery },
  GetLocrec: { query: validateGetLocrecQuery },
  GetLocrecId: { path: validateGetLocrecIdPath },
  DeleteLocrecIdIdRec: { path: validateDeleteLocrecIdIdRecPath },
  GetLoc: { query: validateGetLocQuery },
  GetLocId: { path: validateGetLocIdPath },
  DeleteLocIdTxid: { path: validateDeleteLocIdTxidPath },
  GetPixE2eid: { path: validateGetPixE2eidPath },
  GetPix: { query: validateGetPixQuery },
  GetPixE2eidDevolucaoId: { path: validateGetPixE2eidDevolucaoIdPath },
  PutPixE2eidDevolucaoId: { path: validatePutPixE2eidDevolucaoIdPath },
  GetPixUrlAccessToken: { path: validateGetPixUrlAccessTokenPath },
  GetCobvPixUrlAccessToken: {
    path: validateGetCobvPixUrlAccessTokenPath,
    query: validateGetCobvPixUrlAccessTokenQuery,
  },
  GetRecRecUrlAccessToken: { path: validateGetRecRecUrlAccessTokenPath },
  GetWebhookChave: { path: validateGetWebhookChavePath },
  PutWebhookChave: { path: validatePutWebhookChavePath },
  DeleteWebhookChave: { path: validateDeleteWebhookChavePath },
  GetWebhook: { query: validateGetWebhookQuery },
  GetRecIdRec: { path: validateGetRecIdRecPath, query: validateGetRecIdRecQuery },
  PatchRecIdRec: { path: validatePatchRecIdRecPath },
  GetRec: { query: validateGetRecQuery },
  GetSolicrecIdSolicRec: { path: validateGetSolicrecIdSolicRecPath },
  PatchSolicrecIdSolicRec: { path: validatePatchSolicrecIdSolicRecPath },
  GetCobrTxid: { path: validateGetCobrTxidPath },
  PutCobrTxid: { path: validatePutCobrTxidPath },
  PatchCobrTxid: { path: validatePatchCobrTxidPath },
  GetCobr: { query: validateGetCobrQuery },
  PostCobrTxidRetentativaData: { path: validatePostCobrTxidRetentativaDataPath },
};

/**
 * Every operation in the spec, keyed by generated operation name.
 */
export const OPERATIONS: Readonly<Record<string, OperationInfo>> = {
  GetCobTxid: {
    name: "GetCobTxid",
    method: "get",
    path: "/cob/{txid}",
    tag: "Cob",
    summary: "Consultar cobrança imediata.",
    scopes: ["cob.read"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [{ name: "revisao", required: false }],
    responses: [
      {
        code: 200,
        description: "Dados da cobrança imediata.",
        contentType: "application/json",
        schema: "CobCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutCobTxid: {
    name: "PutCobTxid",
    method: "put",
    path: "/cob/{txid}",
    tag: "Cob",
    summary: "Criar cobrança imediata.",
    scopes: ["cob.write"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    requestBody: { name: "CobBody", required: true, schema: "CobSolicitada" },
    responses: [
      {
        code: 201,
        description: "Cobrança imediata criada",
        contentType: "application/json",
        schema: "CobGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PatchCobTxid: {
    name: "PatchCobTxid",
    method: "patch",
    path: "/cob/{txid}",
    tag: "Cob",
    summary: "Revisar cobrança imediata.",
    scopes: ["cob.write"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    requestBody: { name: "CobBodyRevisada", required: true, schema: "CobRevisada" },
    responses: [
      {
        code: 200,
        description: "Cobrança imediata revisada. A revisão deve ser incrementada em 1.",
        contentType: "application/json",
        schema: "CobGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetCob: {
    name: "GetCob",
    method: "get",
    path: "/cob",
    tag: "Cob",
    summary: "Consultar lista de cobranças imediatas.",
    scopes: ["cob.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "cpf", required: false },
      { name: "cnpj", required: false },
      { name: "locationPresente", required: false },
      { name: "status", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "Lista de cobranças imediatas.",
        contentType: "application/json",
        schema: "CobsConsultadas",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostCob: {
    name: "PostCob",
    method: "post",
    path: "/cob",
    tag: "Cob",
    summary: "Criar cobrança imediata.",
    scopes: ["cob.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "CobBody", required: true, schema: "CobSolicitada" },
    responses: [
      {
        code: 201,
        description: "Cobrança imediata criada",
        contentType: "application/json",
        schema: "CobGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetCobvTxid: {
    name: "GetCobvTxid",
    method: "get",
    path: "/cobv/{txid}",
    tag: "CobV",
    summary: "Consultar cobrança com vencimento.",
    scopes: ["cobv.read"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [{ name: "revisao", required: false }],
    responses: [
      {
        code: 200,
        description: "Dados da cobrança com vencimento.",
        contentType: "application/json",
        schema: "CobVCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutCobvTxid: {
    name: "PutCobvTxid",
    method: "put",
    path: "/cobv/{txid}",
    tag: "CobV",
    summary: "Criar cobrança com vencimento.",
    scopes: ["cobv.write"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    requestBody: { name: "CobVBody", required: true, schema: "CobVSolicitada" },
    responses: [
      {
        code: 201,
        description: "Cobrança com vencimento criada",
        contentType: "application/json",
        schema: "CobVGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PatchCobvTxid: {
    name: "PatchCobvTxid",
    method: "patch",
    path: "/cobv/{txid}",
    tag: "CobV",
    summary: "Revisar cobrança com vencimento.",
    scopes: ["cobv.write"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    requestBody: { name: "CobVBodyRevisada", required: true, schema: "CobVRevisada" },
    responses: [
      {
        code: 200,
        description: "Cobrança com vencimento revisada. A revisão deve ser incrementada em 1.",
        contentType: "application/json",
        schema: "CobVGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetCobv: {
    name: "GetCobv",
    method: "get",
    path: "/cobv",
    tag: "CobV",
    summary: "Consultar lista de cobranças com vencimento.",
    scopes: ["cobv.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "cpf", required: false },
      { name: "cnpj", required: false },
      { name: "locationPresente", required: false },
      { name: "status", required: false },
      { name: "loteCobVId", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "Lista de cobranças com vencimento.",
        contentType: "application/json",
        schema: "CobsVConsultadas",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetLotecobvId: {
    name: "GetLotecobvId",
    method: "get",
    path: "/lotecobv/{id}",
    tag: "LoteCobV",
    summary: "Consultar um lote específico de cobranças com vencimento.",
    scopes: ["lotecobv.read"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Lote de cobranças com vencimento.",
        contentType: "application/json",
        schema: "LoteCobVConsultado",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutLotecobvId: {
    name: "PutLotecobvId",
    method: "put",
    path: "/lotecobv/{id}",
    tag: "LoteCobV",
    summary: "Criar/Alterar lote de cobranças com vencimento.",
    scopes: ["lotecobv.write"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    requestBody: { name: "LoteCobVBody", required: true, schema: "LoteCobVBody" },
    responses: [
      { code: 202, description: "Lote de cobranças com vencimento solicitado para criação." },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  PatchLotecobvId: {
    name: "PatchLotecobvId",
    method: "patch",
    path: "/lotecobv/{id}",
    tag: "LoteCobV",
    summary:
      "Utilizado para revisar cobranças específicas dentro de um lote de cobranças com vencimento.",
    scopes: ["lotecobv.write"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    requestBody: { name: "LoteCobVBodyRevisado", required: true, schema: "LoteCobVBodyRevisado" },
    responses: [
      {
        code: 202,
        description: "Solicitação de revisão do Lote de cobranças encaminhada para processamento.",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  GetLotecobv: {
    name: "GetLotecobv",
    method: "get",
    path: "/lotecobv",
    tag: "LoteCobV",
    summary: "Consultar lotes de cobranças com vencimento.",
    scopes: ["lotecobv.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "Lotes de cobranças com vencimento.",
        contentType: "application/json",
        schema: "LotesCobVConsultados",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetLocrec: {
    name: "GetLocrec",
    method: "get",
    path: "/locrec",
    tag: "PayloadLocationRec",
    summary: "Consultar locations cadastradas.",
    scopes: ["payloadlocationrec.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "idRecPresente", required: false },
      { name: "convenio", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "lista dos locations cadastrados de acordo com o critério de busca.",
        contentType: "application/json",
        schema: "PayloadLocationRecConsultadas",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostLocrec: {
    name: "PostLocrec",
    method: "post",
    path: "/locrec",
    tag: "PayloadLocationRec",
    summary: "Criar location do payload.",
    scopes: ["payloadlocationrec.write"],
    pathParams: [],
    queryParams: [],
    responses: [
      {
        code: 201,
        description: "Dados da location do Payload.",
        contentType: "application/json",
        schema: "PayloadLocationRecGerada",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetLocrecId: {
    name: "GetLocrecId",
    method: "get",
    path: "/locrec/{id}",
    tag: "PayloadLocationRec",
    summary: "Recuperar location do payload.",
    scopes: ["payloadlocationrec.read"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados da location do Payload.",
        contentType: "application/json",
        schema: "PayloadLocationRecCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  DeleteLocrecIdIdRec: {
    name: "DeleteLocrecIdIdRec",
    method: "delete",
    path: "/locrec/{id}/idRec",
    tag: "PayloadLocationRec",
    summary: "Desvincular uma recorrência de uma location.",
    scopes: ["payloadlocationrec.write"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Entidade representada pelo recurso informado desvinculada com sucesso.",
        contentType: "application/json",
        schema: "PayloadLocationRecCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetLoc: {
    name: "GetLoc",
    method: "get",
    path: "/loc",
    tag: "PayloadLocation",
    summary: "Consultar locations cadastradas.",
    scopes: ["payloadlocation.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "txIdPresente", required: false },
      { name: "tipoCob", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "lista dos locations cadastrados de acordo com o critério de busca.",
        contentType: "application/json",
        schema: "PayloadLocationConsultadas",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostLoc: {
    name: "PostLoc",
    method: "post",
    path: "/loc",
    tag: "PayloadLocation",
    summary: "Criar location do payload.",
    scopes: ["payloadlocation.write"],
    pathParams: [],
    queryParams: [],
    requestBody: {
      name: "PayloadLocationBody",
      required: true,
      schema: "PayloadLocationSolicitada",
    },
    responses: [
      {
        code: 201,
        description: "Dados da location do Payload.",
        contentType: "application/json",
        schema: "PayloadLocation",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetLocId: {
    name: "GetLocId",
    method: "get",
    path: "/loc/{id}",
    tag: "PayloadLocation",
    summary: "Recuperar location do payload.",
    scopes: ["payloadlocation.read"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados da location do Payload.",
        contentType: "application/json",
        schema: "PayloadLocationCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  DeleteLocIdTxid: {
    name: "DeleteLocIdTxid",
    method: "delete",
    path: "/loc/{id}/txid",
    tag: "PayloadLocation",
    summary: "Desvincular uma cobrança de uma location.",
    scopes: ["payloadlocation.write"],
    pathParams: [{ name: "id", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "cobrança representada pelo txid informado desvinculada com sucesso.",
        contentType: "application/json",
        schema: "PayloadLocation",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetPixE2eid: {
    name: "GetPixE2eid",
    method: "get",
    path: "/pix/{e2eid}",
    tag: "Pix",
    summary: "Consultar Pix.",
    scopes: ["pix.read"],
    pathParams: [{ name: "e2eid", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados do Pix efetuado.",
        contentType: "application/json",
        schema: "GetPixE2eidResponseSchema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetPix: {
    name: "GetPix",
    method: "get",
    path: "/pix",
    tag: "Pix",
    summary: "Consultar Pix recebidos.",
    scopes: ["pix.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "txid", required: false },
      { name: "txIdPresente", required: false },
      { name: "devolucaoPresente", required: false },
      { name: "finalidadeMED", required: false },
      { name: "cpf", required: false },
      { name: "cnpj", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "lista dos Pix recebidos de acordo com o critério de busca.",
        contentType: "application/json",
        schema: "PixConsultados",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetPixE2eidDevolucaoId: {
    name: "GetPixE2eidDevolucaoId",
    method: "get",
    path: "/pix/{e2eid}/devolucao/{id}",
    tag: "Pix",
    summary: "Consultar devolução.",
    scopes: ["pix.read"],
    pathParams: [
      { name: "e2eid", required: true },
      { name: "id", required: true },
    ],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados da devolução.",
        contentType: "application/json",
        schema: "Devolucao",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutPixE2eidDevolucaoId: {
    name: "PutPixE2eidDevolucaoId",
    method: "put",
    path: "/pix/{e2eid}/devolucao/{id}",
    tag: "Pix",
    summary: "Solicitar devolução.",
    scopes: ["pix.write"],
    pathParams: [
      { name: "e2eid", required: true },
      { name: "id", required: true },
    ],
    queryParams: [],
    requestBody: { name: "DevolucaoBody", required: true, schema: "DevolucaoSolicitada" },
    responses: [
      {
        code: 201,
        description: "Dados da devolução.",
        contentType: "application/json",
        schema: "Devolucao",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetPixUrlAccessToken: {
    name: "GetPixUrlAccessToken",
    method: "get",
    path: "/{pixUrlAccessToken}",
    tag: "CobPayload",
    summary: "Recuperar o payload JSON que representa a cobrança imediata.",
    scopes: [],
    pathParams: [{ name: "pixUrlAccessToken", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description:
          "# Descrição do Retorno\nO retorno desse endpoint é um objeto que apresenta estrutura JWS, conforme especificado no manual de segurança. Segue um exemplo:\n\n```jws\neyJhbGciOiJSUzI1NiIsInR5cCI6IkpXUyIsImtpZCI6IjIwMTEtMDQtMjkiLCJqa3UiOiJodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzUxNyIsIng1dCI6IkFwcGVuZGl4QUV4YW1wbGVBMUpXS1NSc2FLZXkifQ.eyJjYWxlbmRhcmlvIjp7ImNyaWFjYW8iOiIyMDIwLTA5LTE1VDE5OjM5OjU0LjAxM1oiLCJhcHJlc2VudGFjYW8iOiIyMDIwLTA0LTAxVDE4OjAwOjAwWiIsImV4cGlyYWNhbyI6IjM2MDAifSwidHhpZCI6ImZjOWE0MzY2ZmYzZDQ5NjRiNWRiYzZjOTFhODcyMmQzIiwicmV2aXNhbyI6IjMiLCJzdGF0dXMiOiJBVElWQSIsInZhbG9yIjp7Im9yaWdpbmFsIjoiNTAwLjAwIn0sImNoYXZlIjoiNzQwN2M5YzgtZjc4Yi0xMWVhLWFkYzEtMDI0MmFjMTIwMDAyIiwic29saWNpdGFjYW9QYWdhZG9yIjoiSW5mb3JtYXIgY2FydGFvIGZpZGVsaWRhZGUiLCJpbmZvQWRpY2lvbmFpcyI6W3sibm9tZSI6InF1YW50aWRhZGUiLCJ2YWxvciI6IjIifV19.qI7NUrYkwcgXmyoyOjt2YLQyhxH-lPdr3xQ7RId9TDXZ-MlWmPJkUScjuo1Nz_EvlSotbWDGOxErBXHeTLHOQM-9T7lBmG5iw6uEX7L5U72XiganIm80EZCFD1vBPq9j89i4cP2U2Yv21TTt8JLhjA57KHLOSlj-KB5UAKCH-MX3AORFcrXFrYL2rrSQDe-lFNtdyPRwLQHIrhkQ6RR2FPhynzUG0401LScS9mWLLYbYzhzwtP5lk07Ryf4MZq86ihmOLFZXkIiW7pbSd8QfD5Dvj28XebLQi_bam9wInqKB--57_N741BskCN_TXf0EHbQ1qjNTgiT8Y1GIrA4pFA\n```\n\nEste objeto JWS assinado deve ser validado pelo devedor. Maiores detalhes técnicos a respeito da especificação\nde segurança encontram-se no __[Manual de Segurança do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix)__.\n\nConforme pode-se verificar no exemplo acima, o objeto JWS apresenta três fragmentos separados pelo caractere `.` (ponto). São eles: `header`, `payload` e `signature`.\n\nEm termos de funcionalidade, o fragmento que interessa ao devedor é o `payload`, que apresenta estrutura conforme especificada pelo `schema` do presente endpoint, contendo detalhes concernentes à cobrança.\n",
        contentType: "application/jose",
        schema: "CobPayload",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetCobvPixUrlAccessToken: {
    name: "GetCobvPixUrlAccessToken",
    method: "get",
    path: "/cobv/{pixUrlAccessToken}",
    tag: "CobPayload",
    summary: "Recuperar o payload JSON que representa a cobrança com vencimento.",
    scopes: [],
    pathParams: [{ name: "pixUrlAccessToken", required: true }],
    queryParams: [
      { name: "codMun", required: false },
      { name: "DPP", required: false },
    ],
    responses: [
      {
        code: 200,
        description:
          "# Descrição do Retorno\nO retorno desse endpoint é um objeto que apresenta estrutura JWS, conforme especificado no manual de segurança. Segue um exemplo:\n\n```jws\neyJhbGciOiJSUzI1NiIsInR5cCI6IkpXUyIsImtpZCI6IjIwMTEtMDQtMjkiLCJqa3UiOiJodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzUxNyIsIng1dCI6IkFwcGVuZGl4QUV4YW1wbGVBMUpXS1NSc2FLZXkifQ.eyJjYWxlbmRhcmlvIjp7ImNyaWFjYW8iOiIyMDIwLTA5LTE1VDE5OjM5OjU0LjAxM1oiLCJhcHJlc2VudGFjYW8iOiIyMDIwLTA0LTAxVDE4OjAwOjAwWiIsImRhdGFEZVZlbmNpbWVudG8iOiIyMDIwLTEyLTMxIiwidmFsaWRhZGVBcG9zVmVuY2ltZW50byI6MzB9LCJkZXZlZG9yIjp7ImxvZ3JhZG91cm8iOiJBbGFtZWRhIFNhbnRvcywgTnVtZXJvIDEwLCBCYWlycm8gQnJheiIsImNpZGFkZSI6IkRpYWRlbWEiLCJ1ZiI6IlNQIiwiY2VwIjoiNzA4MDAxMDAiLCJjbnBqIjoiNTY5ODkwMDAwMTk1MzMiLCJub21lIjoiRW1wcmVzYSBkZSBBbGltZW50b3MgU0EifSwicmVjZWJlZG9yIjp7ImxvZ3JhZG91cm8iOiJSdWEgMjAgTnVtZXJvIDcwLCBCYWlycm8gTHV6IiwiY2lkYWRlIjoiQmVsbyBIb3Jpem9udGUiLCJ1ZiI6Ik1HIiwiY2VwIjoiNTUxMjA3NTAiLCJjbnBqIjoiNTg5MDA2MzMxMjA3MTEiLCJub21lIjoiRW1wcmVzYSBkZSBBYmFzdGVjaW1lbnRvIFNBIn0sInR4aWQiOiJmYzlhNDM2NmZmM2Q0OTY0YjVkYmM2YzkxYTg3MjJkMyIsInJldmlzYW8iOiIzIiwic3RhdHVzIjoiQVRJVkEiLCJ2YWxvciI6eyJvcmlnaW5hbCI6IjEyMy40NSIsIm11bHRhIjoiMTUuMDAiLCJqdXJvcyI6IjIuMDAiLCJmaW5hbCI6IjE0MCw0NSJ9LCJjaGF2ZSI6Ijc0MDdjOWM4LWY3OGItMTFlYS1hZGMxLTAyNDJhYzEyMDAwMiIsInNvbGljaXRhY2FvUGFnYWRvciI6IkluZm9ybWFyIGNhcnRhbyBmaWRlbGlkYWRlIiwiaW5mb0FkaWNpb25haXMiOlt7Im5vbWUiOiJxdWFudGlkYWRlIiwidmFsb3IiOiIyIn1dfQ.BYibf_oK38IubbnnfThe4gaXuJgfoGQzFIezxHS76jGLQ4re2BwSdsiIzBW1t0JOtL094jLtJMVttdIdF9YJukrdzbknbf1jzfHghgBfNqXfZm7jxWuV8IO0jimoSoo7oMrG3MYytRFpdk2Q_ZhTL5UgZqVbfJkMwcp8o0FYmzrmiGPll-kgBulTgGgvGjzl-mC5dtl56351ix1-If1D7KAohHzcYTHzEFkvYZlNCcxyHJX94-8IqpYaTQ1rJlnPExPIgys-ioZ3U_QzcPz4d3tGvRAfHEU7VoIeZHeXR1jqKuqvz70ayc8mAbL7RXzJat1Ru_glS3krkSdXdZxK-w\n```\n\nEste objeto JWS assinado deve ser validado pelo devedor. Maiores detalhes técnicos a respeito da especificação\nde segurança encontram-se no __[Manual de Segurança do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix)__.\n\nConforme pode-se verificar no exemplo acima, o objeto JWS apresenta três fragmentos separados pelo caractere `.` (ponto). São eles: `header`, `payload` e `signature`.\n\nEm termos de funcionalidade, o fragmento que interessa ao devedor é o `payload`, que apresenta estrutura conforme especificada pelo `schema` do presente endpoint, contendo detalhes concernentes à cobrança.\n",
        contentType: "application/jose",
        schema: "CobVPayload",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetRecRecUrlAccessToken: {
    name: "GetRecRecUrlAccessToken",
    method: "get",
    path: "/rec/{recUrlAccessToken}",
    tag: "RecPayload",
    summary: "Recuperar o payload JSON que representa a configuração da recorrência.",
    scopes: [],
    pathParams: [{ name: "recUrlAccessToken", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description:
          "# Descrição do Retorno\nO retorno desse endpoint é um objeto que apresenta estrutura JWS, conforme especificado no manual de segurança. Segue um exemplo:\n\n```jws\neyJ4NXQjUzI1NiI6IkJOVkdUamZsRTVBaUplWGhHbTZSaGtGUXkwQ25pejJXSlF5cTZhQ0pnTFkiLCJqa3UiOiJodHRwczpcL1wvcXItaC5zYW5kYm94LnBpeC5iY2IuZ292LmJyXC9yZXN0XC9qd2tzLmpzb24iLCJraWQiOiJOMjROSVg5R3Z3bm4ycGktV09IOG9RQ2JkSGlaSFdpbnJvWllxZGhxMlYwUENJIiwiYWxnIjoiUlMyNTYifQ.eyJpZFJlYyI6IlJOMTIzNDU2NzgyMDI0MDExNTc3ODI1NDQ1NjEyIiwidmluY3VsbyI6eyJjb250cmF0byI6IjU1ODI2MTAiLCJkZXZlZG9yIjp7ImNwZiI6IjQ1MTY0NjMyNDgxIiwibm9tZSI6IkZ1bGFubyBkZSBUYWwifSwib2JqZXRvIjoiU2VydmnDp28gZGUgU3RyZWFtbWluZyBkZSBNw7pzaWNhLiJ9LCJjYWxlbmRhcmlvIjp7ImRhdGFGaW5hbCI6IjIwMjUtMDQtMDEiLCJkYXRhSW5pY2lhbCI6IjIwMjQtMDQtMDEiLCJwZXJpZGlvY2lkYWRlIjoiTUVOU0FMIn0sInBvbGl0aWNhUmV0ZW50YXRpdmEiOiJOQU9fUEVSTUlURSIsInZhbG9yIjp7InZhbG9yUmVjIjoiMzUuMDAifSwicmVjZWJlZG9yIjp7ImNucGoiOiIyODc2NTAwNzgwMjM3MSIsIm5vbWUiOiJTdGFydHVwIE11c2ljYWwiLCJpc3BiUGFydGljaXBhbnRlIjoiMTIzNDU2NzgifSwiYXR1YWxpemFjYW8iOlt7InN0YXR1cyI6IkNSSUFEQSIsImRhdGEiOiIyMDI0LTAzLTIwVDEwOjEyOjA3LjU2N1oifV19.JQ3nwpN75M7ADuFQD1lAYRU_3QIkU34OCGXcqmn0dmmvl_JYQggZDY-2cN9waqZtf0duJkDs9EcRu-pNZQZlNMjI7DCYCNfXOgiiofdQqMikDh-D6Zq82EkiUqS7cuTg1-GWylCTF9gH6-p_D-dhYPvf-s4FinbjZNwhkX8Sn-OhlLMS8roIWSMjo_J1hN4DdL-Q5zgZBb7Hbt4OZ3CnD1GNbnsdUUyPyy2GfmIUWZEnQ2rY7gVuI7chUAksYeZVaJiH34saBw4Ou8RjHbSGmeWFLmjiTSQYisyQEyotStu6GnHLS36ElNDVlZWOUnb87N3H5FAccWaIQhit3C4wmA\n```\n\nEste objeto JWS assinado deve ser validado pelo pagador. Maiores detalhes técnicos a respeito da especificação\nde segurança encontram-se no __[Manual de Segurança do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix)__.\n\nConforme pode-se verificar no exemplo acima, o objeto JWS apresenta três fragmentos separados pelo caractere `.` (ponto). São eles: `header`, `payload` e `signature`.\n\nEm termos de funcionalidade, o fragmento que interessa ao pagador é o `payload`, que apresenta estrutura conforme especificada pelo `schema` do presente endpoint, contendo detalhes concernentes à recorrência.\n",
        contentType: "application/jose",
        schema: "RecPayload",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetWebhookChave: {
    name: "GetWebhookChave",
    method: "get",
    path: "/webhook/{chave}",
    tag: "Webhook",
    summary: "Exibir informações acerca do Webhook Pix.",
    scopes: ["webhook.read"],
    pathParams: [{ name: "chave", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados do webhook.",
        contentType: "application/json",
        schema: "WebhookCompleto",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutWebhookChave: {
    name: "PutWebhookChave",
    method: "put",
    path: "/webhook/{chave}",
    tag: "Webhook",
    summary: "Configurar o Webhook Pix.",
    scopes: ["webhook.write"],
    pathParams: [{ name: "chave", required: true }],
    queryParams: [],
    requestBody: { name: "WebhookConfigBody", required: true, schema: "WebhookSolicitado" },
    responses: [
      {
        code: 200,
        description: "Webhook para notificações acerca de Pix recebidos associados a um txid.",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  DeleteWebhookChave: {
    name: "DeleteWebhookChave",
    method: "delete",
    path: "/webhook/{chave}",
    tag: "Webhook",
    summary: "Cancelar o webhook Pix.",
    scopes: ["webhook.write"],
    pathParams: [{ name: "chave", required: true }],
    queryParams: [],
    responses: [
      { code: 204, description: "Webhook para notificações Pix foi cancelado." },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  GetWebhook: {
    name: "GetWebhook",
    method: "get",
    path: "/webhook",
    tag: "Webhook",
    summary: "Consultar webhooks cadastrados.",
    scopes: ["webhook.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: false },
      { name: "fim", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "lista dos locations cadastrados de acordo com o critério de busca.",
        contentType: "application/json",
        schema: "WebhooksConsultados",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetWebhookrec: {
    name: "GetWebhookrec",
    method: "get",
    path: "/webhookrec",
    tag: "WebhookRec",
    summary: "Exibir informações acerca do Webhook.",
    scopes: ["webhookrec.read"],
    pathParams: [],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados do webhook.",
        contentType: "application/json",
        schema: "WebhookRecCompleto",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutWebhookrec: {
    name: "PutWebhookrec",
    method: "put",
    path: "/webhookrec",
    tag: "WebhookRec",
    summary: "Configurar Webhook.",
    scopes: ["webhookrec.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "WebhookRecConfigBody", required: true, schema: "WebhookRecSolicitado" },
    responses: [
      { code: 200, description: "Webhook para notificações." },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  DeleteWebhookrec: {
    name: "DeleteWebhookrec",
    method: "delete",
    path: "/webhookrec",
    tag: "WebhookRec",
    summary: "Cancelar o Webhook.",
    scopes: ["webhookrec.write"],
    pathParams: [],
    queryParams: [],
    responses: [
      { code: 204, description: "Webhook para notificações foi cancelado." },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  GetWebhookcobr: {
    name: "GetWebhookcobr",
    method: "get",
    path: "/webhookcobr",
    tag: "WebhookCobR",
    summary: "Exibir informações acerca do Webhook.",
    scopes: ["webhookcobr.read"],
    pathParams: [],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados do webhook.",
        contentType: "application/json",
        schema: "WebhookCobRCompleto",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutWebhookcobr: {
    name: "PutWebhookcobr",
    method: "put",
    path: "/webhookcobr",
    tag: "WebhookCobR",
    summary: "Configurar Webhook.",
    scopes: ["webhookcobr.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "WebhookCobRConfigBody", required: true, schema: "WebhookCobRSolicitado" },
    responses: [
      { code: 200, description: "Webhook para notificações." },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  DeleteWebhookcobr: {
    name: "DeleteWebhookcobr",
    method: "delete",
    path: "/webhookcobr",
    tag: "WebhookCobR",
    summary: "Cancelar o Webhook.",
    scopes: ["webhookcobr.write"],
    pathParams: [],
    queryParams: [],
    responses: [
      { code: 204, description: "Webhook para notificações foi cancelado." },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  GetWebhookcob: {
    name: "GetWebhookcob",
    method: "get",
    path: "/webhookcob",
    tag: "WebhookCob",
    summary: "Exibir informações acerca do Webhook.",
    scopes: ["webhookcob.read"],
    pathParams: [],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados do webhook.",
        contentType: "application/json",
        schema: "WebhookCobCompleto",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutWebhookcob: {
    name: "PutWebhookcob",
    method: "put",
    path: "/webhookcob",
    tag: "WebhookCob",
    summary: "Configurar Webhook.",
    scopes: ["webhookcob.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "WebhookCobConfigBody", required: true, schema: "WebhookCobSolicitado" },
    responses: [
      { code: 200, description: "Webhook para notificações." },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  DeleteWebhookcob: {
    name: "DeleteWebhookcob",
    method: "delete",
    path: "/webhookcob",
    tag: "WebhookCob",
    summary: "Cancelar o Webhook.",
    scopes: ["webhookcob.write"],
    pathParams: [],
    queryParams: [],
    responses: [
      { code: 204, description: "Webhook para notificações foi cancelado." },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  GetWebhookcobv: {
    name: "GetWebhookcobv",
    method: "get",
    path: "/webhookcobv",
    tag: "WebhookCobV",
    summary: "Exibir informações acerca do Webhook.",
    scopes: ["webhookcobv.read"],
    pathParams: [],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados do webhook.",
        contentType: "application/json",
        schema: "WebhookCobVCompleto",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutWebhookcobv: {
    name: "PutWebhookcobv",
    method: "put",
    path: "/webhookcobv",
    tag: "WebhookCobV",
    summary: "Configurar Webhook.",
    scopes: ["webhookcobV.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "WebhookCobVConfigBody", required: true, schema: "WebhookCobVSolicitado" },
    responses: [
      { code: 200, description: "Webhook para notificações." },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  DeleteWebhookcobv: {
    name: "DeleteWebhookcobv",
    method: "delete",
    path: "/webhookcobv",
    tag: "WebhookCobV",
    summary: "Cancelar o Webhook.",
    scopes: ["webhookcobv.write"],
    pathParams: [],
    queryParams: [],
    responses: [
      { code: 204, description: "Webhook para notificações foi cancelado." },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: false,
    errorSchema: "Problema",
  },
  GetRecIdRec: {
    name: "GetRecIdRec",
    method: "get",
    path: "/rec/{idRec}",
    tag: "Rec",
    summary: "Consultar recorrência.",
    scopes: ["rec.read"],
    pathParams: [{ name: "idRec", required: true }],
    queryParams: [{ name: "txid", required: false }],
    responses: [
      {
        code: 200,
        description: "Dados da recorrência.",
        contentType: "application/json",
        schema: "RecCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PatchRecIdRec: {
    name: "PatchRecIdRec",
    method: "patch",
    path: "/rec/{idRec}",
    tag: "Rec",
    summary: "Revisar recorrência.",
    scopes: ["rec.write"],
    pathParams: [{ name: "idRec", required: true }],
    queryParams: [],
    requestBody: { name: "RecBodyRevisada", required: false, schema: "RecRevisada" },
    responses: [
      {
        code: 200,
        description: "Recorrência revisada.",
        contentType: "application/json",
        schema: "RecGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetRec: {
    name: "GetRec",
    method: "get",
    path: "/rec",
    tag: "Rec",
    summary: "Consultar lista de recorrências.",
    scopes: ["rec.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "cpf", required: false },
      { name: "cnpj", required: false },
      { name: "locationPresente", required: false },
      { name: "status", required: false },
      { name: "convenio", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      { code: 200, description: "OK", contentType: "application/json", schema: "RecsConsultadas" },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostRec: {
    name: "PostRec",
    method: "post",
    path: "/rec",
    tag: "Rec",
    summary: "Criar recorrência.",
    scopes: ["rec.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "RecBody", required: false, schema: "RecSolicitada" },
    responses: [
      {
        code: 201,
        description: "Recorrência criada",
        contentType: "application/json",
        schema: "RecGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostSolicrec: {
    name: "PostSolicrec",
    method: "post",
    path: "/solicrec",
    tag: "SolicRec",
    summary: "Criar solicitação de confirmação de recorrência.",
    scopes: ["solicrec.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "SolicRecBody", required: false, schema: "SolicRecSolicitada" },
    responses: [
      {
        code: 201,
        description: "Solicitação de recorrência criada",
        contentType: "application/json",
        schema: "SolicRecCompleta",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetSolicrecIdSolicRec: {
    name: "GetSolicrecIdSolicRec",
    method: "get",
    path: "/solicrec/{idSolicRec}",
    tag: "SolicRec",
    summary: "Consultar solicitação de confirmação de recorrência.",
    scopes: ["solicrec.read"],
    pathParams: [{ name: "idSolicRec", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados da solicitação da recorrência.",
        contentType: "application/json",
        schema: "SolicRecCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PatchSolicrecIdSolicRec: {
    name: "PatchSolicrecIdSolicRec",
    method: "patch",
    path: "/solicrec/{idSolicRec}",
    tag: "SolicRec",
    summary: "Revisar solicitação de confirmação de recorrência.",
    scopes: ["solicrec.write"],
    pathParams: [{ name: "idSolicRec", required: true }],
    queryParams: [],
    requestBody: { name: "SolicRecBodyRevisada", required: false, schema: "SolicRecRevisada" },
    responses: [
      {
        code: 201,
        description: "Solicitação de recorrência atualizada",
        contentType: "application/json",
        schema: "SolicRecCompleta",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetCobrTxid: {
    name: "GetCobrTxid",
    method: "get",
    path: "/cobr/{txid}",
    tag: "CobR",
    summary: "Consultar cobrança recorrente.",
    scopes: ["cobr.read"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    responses: [
      {
        code: 200,
        description: "Dados da cobrança recorrente.",
        contentType: "application/json",
        schema: "CobRCompleta",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PutCobrTxid: {
    name: "PutCobrTxid",
    method: "put",
    path: "/cobr/{txid}",
    tag: "CobR",
    summary: "Criar cobrança recorrente.",
    scopes: ["cobr.write"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    requestBody: { name: "CobRBody", required: true, schema: "CobRSolicitada" },
    responses: [
      {
        code: 201,
        description: "Cobrança imediata recorrente.",
        contentType: "application/json",
        schema: "CobRGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PatchCobrTxid: {
    name: "PatchCobrTxid",
    method: "patch",
    path: "/cobr/{txid}",
    tag: "CobR",
    summary: "Revisar cobrança recorrente.",
    scopes: ["cobr.write"],
    pathParams: [{ name: "txid", required: true }],
    queryParams: [],
    requestBody: { name: "CobRBodyRevisada", required: true, schema: "CobRRevisada" },
    responses: [
      {
        code: 200,
        description: "Cobrança recorrente revisada.",
        contentType: "application/json",
        schema: "CobRGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  GetCobr: {
    name: "GetCobr",
    method: "get",
    path: "/cobr",
    tag: "CobR",
    summary: "Consultar lista de cobranças recorrentes.",
    scopes: ["cobr.read"],
    pathParams: [],
    queryParams: [
      { name: "inicio", required: true },
      { name: "fim", required: true },
      { name: "idRec", required: false },
      { name: "cpf", required: false },
      { name: "cnpj", required: false },
      { name: "status", required: false },
      { name: "convenio", required: false },
      { name: "paginacao.paginaAtual", required: false },
      { name: "paginacao.itensPorPagina", required: false },
    ],
    responses: [
      {
        code: 200,
        description: "Lista de cobranças recorrentes.",
        contentType: "application/json",
        schema: "CobsRConsultadas",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostCobr: {
    name: "PostCobr",
    method: "post",
    path: "/cobr",
    tag: "CobR",
    summary: "Criar cobrança recorrente.",
    scopes: ["cobr.write"],
    pathParams: [],
    queryParams: [],
    requestBody: { name: "CobRBody", required: true, schema: "CobRSolicitada" },
    responses: [
      {
        code: 201,
        description: "Cobrança recorrente criada.",
        contentType: "application/json",
        schema: "CobRGerada",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
  PostCobrTxidRetentativaData: {
    name: "PostCobrTxidRetentativaData",
    method: "post",
    path: "/cobr/{txid}/retentativa/{data}",
    tag: "CobR",
    summary: "Solicitar retentativa de cobrança.",
    scopes: ["cobr.write"],
    pathParams: [
      { name: "txid", required: true },
      { name: "data", required: true },
    ],
    queryParams: [],
    responses: [
      {
        code: 201,
        description: "Cobrança recorrente.",
        contentType: "application/json",
        schema: "PostCobrTxidRetentativaDataResponseSchema",
      },
      {
        code: 400,
        description: "Requisição com formato inválido.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 403,
        description:
          "Requisição de participante autenticado que viola alguma regra de autorização.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 404,
        description: "Recurso solicitado não foi encontrado.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
      {
        code: 503,
        description:
          "Serviço não está disponível no momento. Serviço solicitado pode estar em manutenção ou fora da janela de funcionamento.",
        contentType: "application/problem+json",
        schema: "Problema",
      },
    ],
    hasResponseBody: true,
    errorSchema: "Problema",
  },
};
