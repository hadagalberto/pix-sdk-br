/** Typed resource namespaces mirroring the BCB OpenAPI tags. */

import type { PixClient, CallOptions, RequestArgs } from "./client.js";
import { generateTxid } from "../txid.js";
import { paginate } from "./client.js";
import type {
  CobBody,
  CobRevisada,
  CobRBody,
  CobRBodyRevisada,
  CobVBody,
  CobVRevisada,
  Devolucao,
  DevolucaoBody,
  PayloadLocation,
  PayloadLocationCompleta,
  PayloadLocationConsultadas,
  PayloadLocationRecCompleta,
  PayloadLocationRecGerada,
  PayloadLocationRecConsultadas,
  RecBody,
  RecBodyRevisada,
  SolicRecBody,
  SolicRecBodyRevisada,
  WebhookCobConfigBody,
  WebhookCobRConfigBody,
  WebhookConfigBody,
  WebhookCobVConfigBody,
  WebhookRecConfigBody,
} from "../generated/schemas.js";
import type {
  GetCobQuery,
  GetCobrQuery,
  GetCobvQuery,
  GetLotecobvQuery,
  GetLocQuery,
  GetLocrecQuery,
  GetPixQuery,
  GetRecQuery,
} from "../generated/operations.js";
import type {
  CobCompleta,
  CobGerada,
  CobsConsultadas,
  CobRCompleta,
  CobRGerada,
  CobsRConsultadas,
  CobVCompleta,
  CobVGerada,
  CobsVConsultadas,
  LoteCobVBody,
  LoteCobVConsultado,
  LotesCobVConsultados,
  PixConsultado,
  PixConsultados,
  RecCompleta,
  RecGerada,
  RecsConsultadas,
  SolicRecCompleta,
  WebhookCompleto,
  WebhooksConsultados,
} from "../generated/schemas.js";

/** Shared base for every resource namespace. */
export class ResourceBase {
  constructor(protected readonly client: PixClient) {}

  protected call<T>(operation: string, args: RequestArgs = {}): Promise<T> {
    return this.client.request<T>(operation, args);
  }
}

export class CobResource extends ResourceBase {
  /** Creates a charge with a freshly generated, spec-conformant txid. */
  create<T = CobGerada>(body: CobBody, options?: CallOptions): Promise<T> {
    return this.createWithTxid<T>(generateTxid(), body, options);
  }

  createWithTxid<T = CobGerada>(txid: string, body: CobBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PutCobTxid", { ...options, path: { txid }, body });
  }

  get<T = CobCompleta>(txid: string, options?: CallOptions & { revisao?: number }): Promise<T> {
    return this.call<T>("GetCobTxid", {
      ...options,
      path: { txid },
      ...(options?.revisao === undefined ? {} : { query: { revisao: options.revisao } }),
    });
  }

  update<T = CobGerada>(txid: string, body: CobRevisada, options?: CallOptions): Promise<T> {
    return this.call<T>("PatchCobTxid", { ...options, path: { txid }, body });
  }

  list<T = CobsConsultadas>(query: GetCobQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetCob", { ...options, query: { ...query } });
  }

  listAll(query: GetCobQuery, options?: CallOptions): AsyncGenerator<CobCompleta> {
    return paginate<CobCompleta, CobsConsultadas>(
      (page) =>
        this.call<CobsConsultadas>("GetCob", {
          ...options,
          query: { ...query, "paginacao.paginaAtual": page },
        }),
      (result) => result.cobs,
      (result) => result.parametros.paginacao,
    );
  }
}

export class CobVResource extends ResourceBase {
  create<T = CobVGerada>(body: CobVBody, options?: CallOptions): Promise<T> {
    return this.createWithTxid<T>(generateTxid(), body, options);
  }

  createWithTxid<T = CobVGerada>(txid: string, body: CobVBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PutCobvTxid", { ...options, path: { txid }, body });
  }

  get<T = CobVCompleta>(txid: string, options?: CallOptions & { revisao?: number }): Promise<T> {
    return this.call<T>("GetCobvTxid", {
      ...options,
      path: { txid },
      ...(options?.revisao === undefined ? {} : { query: { revisao: options.revisao } }),
    });
  }

  update<T = CobVGerada>(txid: string, body: CobVRevisada, options?: CallOptions): Promise<T> {
    return this.call<T>("PatchCobvTxid", { ...options, path: { txid }, body });
  }

  list<T = CobsVConsultadas>(query: GetCobvQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetCobv", { ...options, query: { ...query } });
  }

  listAll(query: GetCobvQuery, options?: CallOptions): AsyncGenerator<CobVCompleta> {
    return paginate<CobVCompleta, CobsVConsultadas>(
      (page) =>
        this.call<CobsVConsultadas>("GetCobv", {
          ...options,
          query: { ...query, "paginacao.paginaAtual": page },
        }),
      (result) => result.cobs,
      (result) => result.parametros.paginacao,
    );
  }
}

export class LoteCobVResource extends ResourceBase {
  get<T = LoteCobVConsultado>(id: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetLotecobvId", { ...options, path: { id } });
  }

  create<T = LoteCobVConsultado>(body: LoteCobVBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PutLotecobvId", { ...options, path: { id: generateTxid() }, body });
  }

  update<T = LoteCobVConsultado>(
    id: string,
    body: LoteCobVBody,
    options?: CallOptions,
  ): Promise<T> {
    return this.call<T>("PatchLotecobvId", { ...options, path: { id }, body });
  }

  list<T = LotesCobVConsultados>(query: GetLotecobvQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetLotecobv", { ...options, query: { ...query } });
  }
}

export class LocResource extends ResourceBase {
  create<T = PayloadLocation>(body: unknown, options?: CallOptions): Promise<T> {
    return this.call<T>("PostLoc", { ...options, body });
  }

  get<T = PayloadLocationCompleta>(id: string | number, options?: CallOptions): Promise<T> {
    return this.call<T>("GetLocId", { ...options, path: { id: String(id) } });
  }

  /** Detaches a charge from a location. */
  deleteTxid<T = void>(id: string | number, options?: CallOptions): Promise<T> {
    return this.call<T>("DeleteLocIdTxid", { ...options, path: { id: String(id) } });
  }

  list<T = PayloadLocationConsultadas>(query: GetLocQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetLoc", { ...options, query: { ...query } });
  }
}

export class LocRecResource extends ResourceBase {
  create<T = PayloadLocationRecGerada>(body: unknown, options?: CallOptions): Promise<T> {
    return this.call<T>("PostLocrec", { ...options, body });
  }

  get<T = PayloadLocationRecCompleta>(id: string | number, options?: CallOptions): Promise<T> {
    return this.call<T>("GetLocrecId", { ...options, path: { id: String(id) } });
  }

  deleteIdRec<T = void>(id: string | number, options?: CallOptions): Promise<T> {
    return this.call<T>("DeleteLocrecIdIdRec", { ...options, path: { id: String(id) } });
  }

  list<T = PayloadLocationRecConsultadas>(
    query: GetLocrecQuery,
    options?: CallOptions,
  ): Promise<T> {
    return this.call<T>("GetLocrec", { ...options, query: { ...query } });
  }
}

export class PixResource extends ResourceBase {
  readonly devolucao = new DevolucaoResource(this.client);

  get<T = PixConsultado>(e2eid: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetPixE2eid", { ...options, path: { e2eid } });
  }

  list<T = PixConsultados>(query: GetPixQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetPix", { ...options, query: { ...query } });
  }

  listAll(query: GetPixQuery, options?: CallOptions): AsyncGenerator<PixConsultado> {
    return paginate<PixConsultado, PixConsultados>(
      (page) =>
        this.call<PixConsultados>("GetPix", {
          ...options,
          query: { ...query, "paginacao.paginaAtual": page },
        }),
      (result) => result.pix,
      (result) => result.parametros.paginacao,
    );
  }
}

export class DevolucaoResource extends ResourceBase {
  get<T = Devolucao>(e2eid: string, id: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetPixE2eidDevolucaoId", { ...options, path: { e2eid, id } });
  }

  create<T = Devolucao>(
    e2eid: string,
    id: string,
    body: DevolucaoBody,
    options?: CallOptions,
  ): Promise<T> {
    return this.call<T>("PutPixE2eidDevolucaoId", { ...options, path: { e2eid, id }, body });
  }
}

export interface WebhookOperations {
  readonly list: string;
  /** Present only for the `/webhook/{chave}` family. */
  readonly byChave?: { readonly get: string; readonly put: string; readonly delete: string };
  readonly configure: string;
  readonly delete: string;
}

type WebhookBody =
  | WebhookConfigBody
  | WebhookCobConfigBody
  | WebhookCobVConfigBody
  | WebhookCobRConfigBody
  | WebhookRecConfigBody;

export class WebhookResource extends ResourceBase {
  constructor(
    client: PixClient,
    private readonly operations: WebhookOperations,
  ) {
    super(client);
  }

  list<T = WebhooksConsultados>(options?: CallOptions): Promise<T> {
    return this.call<T>(this.operations.list, { ...options });
  }

  /** For the `/webhook/{chave}` family pass `chave`; for the others it is ignored. */
  get<T = WebhookCompleto>(chave?: string, options?: CallOptions): Promise<T> {
    if (this.operations.byChave === undefined) {
      return this.call<T>(this.operations.list, { ...options });
    }
    return this.call<T>(this.operations.byChave.get, {
      ...options,
      path: { chave: chave ?? "" },
    });
  }

  /** Base webhook takes `(chave, body)`; the other families take `(body)`. */
  configure<T = WebhookCompleto>(
    chaveOrBody: string | WebhookBody,
    bodyOrOptions?: WebhookBody | CallOptions,
    options?: CallOptions,
  ): Promise<T> {
    if (typeof chaveOrBody === "string") {
      return this.call<T>(this.operations.configure, {
        ...(options ?? {}),
        path: { chave: chaveOrBody },
        body: bodyOrOptions as WebhookBody,
      });
    }
    return this.call<T>(this.operations.configure, {
      ...((bodyOrOptions ?? {}) as CallOptions),
      body: chaveOrBody,
    });
  }

  delete<T = void>(chave?: string, options?: CallOptions): Promise<T> {
    return this.call<T>(this.operations.byChave?.delete ?? this.operations.delete, {
      ...options,
      ...(this.operations.byChave === undefined || chave === undefined ? {} : { path: { chave } }),
    });
  }
}

export class RecResource extends ResourceBase {
  create<T = RecGerada>(body: RecBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PostRec", { ...options, body });
  }

  get<T = RecCompleta>(idRec: string, options?: CallOptions & { txid?: string }): Promise<T> {
    return this.call<T>("GetRecIdRec", {
      ...options,
      path: { idRec },
      ...(options?.txid === undefined ? {} : { query: { txid: options.txid } }),
    });
  }

  update<T = RecGerada>(idRec: string, body: RecBodyRevisada, options?: CallOptions): Promise<T> {
    return this.call<T>("PatchRecIdRec", { ...options, path: { idRec }, body });
  }

  list<T = RecsConsultadas>(query: GetRecQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetRec", { ...options, query: { ...query } });
  }
}

export class SolicRecResource extends ResourceBase {
  create<T = SolicRecCompleta>(body: SolicRecBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PostSolicrec", { ...options, body });
  }

  get<T = SolicRecCompleta>(idSolicRec: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetSolicrecIdSolicRec", { ...options, path: { idSolicRec } });
  }

  update<T = SolicRecCompleta>(
    idSolicRec: string,
    body: SolicRecBodyRevisada,
    options?: CallOptions,
  ): Promise<T> {
    return this.call<T>("PatchSolicrecIdSolicRec", { ...options, path: { idSolicRec }, body });
  }
}

export class CobRResource extends ResourceBase {
  create<T = CobRGerada>(body: CobRBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PutCobrTxid", { ...options, path: { txid: generateTxid() }, body });
  }

  createWithTxid<T = CobRGerada>(txid: string, body: CobRBody, options?: CallOptions): Promise<T> {
    return this.call<T>("PutCobrTxid", { ...options, path: { txid }, body });
  }

  get<T = CobRCompleta>(txid: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetCobrTxid", { ...options, path: { txid } });
  }

  update<T = CobRGerada>(txid: string, body: CobRBodyRevisada, options?: CallOptions): Promise<T> {
    return this.call<T>("PatchCobrTxid", { ...options, path: { txid }, body });
  }

  list<T = CobsRConsultadas>(query: GetCobrQuery, options?: CallOptions): Promise<T> {
    return this.call<T>("GetCobr", { ...options, query: { ...query } });
  }

  retry<T = void>(txid: string, data: string, options?: CallOptions): Promise<T> {
    return this.call<T>("PostCobrTxidRetentativaData", {
      ...options,
      path: { txid, data },
    });
  }
}

/** Retrieves the JWS payload behind a location token (no OAuth required). */
export class PayloadResource extends ResourceBase {
  cob<T = string>(token: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetPixUrlAccessToken", {
      ...options,
      path: { pixUrlAccessToken: token },
      skipAuth: true,
      responseType: "text",
    });
  }

  cobv<T = string>(token: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetCobvPixUrlAccessToken", {
      ...options,
      path: { pixUrlAccessToken: token },
      skipAuth: true,
      responseType: "text",
    });
  }

  rec<T = string>(token: string, options?: CallOptions): Promise<T> {
    return this.call<T>("GetRecRecUrlAccessToken", {
      ...options,
      path: { recUrlAccessToken: token },
      skipAuth: true,
      responseType: "text",
    });
  }
}
