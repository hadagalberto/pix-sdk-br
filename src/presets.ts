/**
 * PSP presets for the standard BCB Pix API.
 *
 * This module is intentionally small and evidence-driven. An entry is added
 * **only** when the PSP's official, public developer documentation states the
 * production base URL, the sandbox base URL and the OAuth token URL for both
 * environments. Every preset carries the official source URL(s) and the date
 * they were verified. Nothing here is guessed or copied from third-party SDKs:
 * for PSPs that do not publish all three values, see `UNCONFIRMED_PSPS` and
 * configure `PixClient` manually with `baseUrl` and `oauth.tokenUrl`.
 */

import type { PixClientOptions } from "./client/types.js";

/** Environment selector shared by every preset. */
export type PspEnvironment = "sandbox" | "production";

/** Identifier of a PSP with a fully confirmed preset. */
export type PspId = "efi" | "inter";

/** Endpoints required to talk to one environment of a PSP. */
export interface PspEndpoints {
  /** Base URL of the Pix API (the SDK appends `/cob`, `/pix`, ... to it). */
  readonly baseUrl: string;
  /** OAuth2 client-credentials token endpoint (mTLS is required by the PSPs). */
  readonly tokenUrl: string;
}

/** A fully documented PSP preset. */
export interface PspPreset {
  readonly id: PspId;
  readonly name: string;
  readonly sandbox: PspEndpoints;
  readonly production: PspEndpoints;
  /** Official documentation URLs that establish *every* endpoint above. */
  readonly sources: readonly string[];
  /** ISO-8601 date (`YYYY-MM-DD`) on which the sources above were verified. */
  readonly verifiedOn: string;
  /** OAuth scopes explicitly listed by the PSP's public docs, when available. */
  readonly defaultScopes?: readonly string[];
  /** Integration notes that are also documented in the cited source. */
  readonly notes?: string;
}

/**
 * Efí (formerly Gerencianet) — verified 2026-11-20.
 *
 * Official source: https://dev.efipay.com.br/docs/api-pix/credenciais/
 *   "Rotas base" table:
 *     Produção    https://pix.api.efipay.com.br
 *     Homologação https://pix-h.api.efipay.com.br
 *   "Obter Autorização — POST /oauth/token" documents the token endpoint on
 *   both hosts; the Node/Go/curl examples use `${baseUrl}/oauth/token` for
 *   production and `https://pix-h.api.efipay.com.br/oauth/token` for sandbox.
 *   The same page lists the scopes below and requires a PFX/PEM client cert on
 *   *every* request, including token acquisition.
 */
const efi: PspPreset = {
  id: "efi",
  name: "Efí",
  sandbox: {
    baseUrl: "https://pix-h.api.efipay.com.br",
    tokenUrl: "https://pix-h.api.efipay.com.br/oauth/token",
  },
  production: {
    baseUrl: "https://pix.api.efipay.com.br",
    tokenUrl: "https://pix.api.efipay.com.br/oauth/token",
  },
  sources: ["https://dev.efipay.com.br/docs/api-pix/credenciais/"],
  verifiedOn: "2026-11-20",
  defaultScopes: [
    "cob.read",
    "cob.write",
    "pix.read",
    "pix.write",
    "webhook.read",
    "webhook.write",
    "payloadlocation.read",
    "payloadlocation.write",
  ],
  notes:
    "mTLS is mandatory on every call, including POST /oauth/token. Credentials and certificates are issued separately for production and homologação.",
};

/**
 * Banco Inter (Inter Empresas) — verified 2026-11-20.
 *
 * Official sources are the OpenAPI documents served by the Inter developer
 * portal (the reference pages at https://developers.inter.co/references/pix
 * render these files):
 *
 * Base URLs — https://developers.inter.co/redocusaurus/swagger-api-pix-automatico-yaml.yaml
 *   servers:
 *     https://cdpj.partners.bancointer.com.br/pix/v2       (Produção)
 *     https://cdpj-sandbox.partners.uatinter.co/pix/v2     (Sandbox)
 *
 * Token URLs — https://developers.inter.co/redocusaurus/swagger-token-yaml.yaml
 *   servers:
 *     https://cdpj.partners.bancointer.com.br/oauth/v2     (Produção)
 *     https://cdpj-sandbox.partners.uatinter.co/oauth/v2   (Sandbox)
 *   the token operation is POST {server}/token.
 */
const inter: PspPreset = {
  id: "inter",
  name: "Inter",
  sandbox: {
    baseUrl: "https://cdpj-sandbox.partners.uatinter.co/pix/v2",
    tokenUrl: "https://cdpj-sandbox.partners.uatinter.co/oauth/v2/token",
  },
  production: {
    baseUrl: "https://cdpj.partners.bancointer.com.br/pix/v2",
    tokenUrl: "https://cdpj.partners.bancointer.com.br/oauth/v2/token",
  },
  sources: [
    "https://developers.inter.co/redocusaurus/swagger-api-pix-automatico-yaml.yaml",
    "https://developers.inter.co/redocusaurus/swagger-token-yaml.yaml",
  ],
  verifiedOn: "2026-11-20",
  notes:
    "mTLS + OAuth2 client_credentials; the client_id/secret and certificate are created per environment in the Internet Banking integration flow. Some integrations also require an x-conta-corrente header (pass it through a custom fetch adapter).",
};

/** All PSPs with a preset whose endpoints were confirmed in official docs. */
export const PSP_PRESETS = {
  efi,
  inter,
} as const satisfies Readonly<Record<PspId, PspPreset>>;

/** PSPs from the milestone brief that are deliberately *not* preset. */
export interface UnconfirmedPsp {
  readonly name: string;
  /** Official public developer portal consulted during verification. */
  readonly docsUrl: string;
  /** Why no preset can be shipped without inventing endpoints. */
  readonly reason: string;
}

/**
 * These PSPs were researched on 2026-11-20 but cannot have a preset yet:
 * at least one of production base URL, sandbox base URL or token URL is not
 * published in their official public docs. Configure them manually.
 */
export const UNCONFIRMED_PSPS: readonly UnconfirmedPsp[] = [
  {
    name: "Sicoob",
    docsUrl: "https://developers.sicoob.com.br/portal/",
    reason:
      "The public portal does not publish the Pix API production/sandbox hosts and token URL without login; the sandbox uses a static portal token rather than a documented OAuth token endpoint.",
  },
  {
    name: "Banco do Brasil",
    docsUrl: "https://www.bb.com.br/site/developers/api-pix/",
    reason:
      "The public API Pix page describes the product but does not state the concrete Pix API and OAuth hostnames for production and homologação; those live in login-gated guides.",
  },
  {
    name: "Itaú",
    docsUrl: "https://devportal.itau.com.br/autenticacao-documentacao",
    reason:
      "The public auth guide publishes the STS token host but states that each API's production base URL must be looked up in the login-gated catalog; the sandbox is explicitly non-OAuth and non-mTLS.",
  },
  {
    name: "Santander",
    docsUrl: "https://developer.santander.com.br/api/documentacao/pix",
    reason:
      "The official Pix API reference is not publicly retrievable without portal authentication, so the production/sandbox hosts cannot be confirmed from official public docs.",
  },
  {
    name: "Sicredi",
    docsUrl: "https://developers.sicredi.com.br/public/docs/getting-started-pix",
    reason:
      "Production URLs are public (https://api-pix.sicredi.com.br/api/v2, /oauth/token), but the official docs explicitly say the homologação base and token URLs are provided by the Sicredi team when access is granted — not published.",
  },
];

/** Type guard for environment variables and other untyped inputs. */
export function isPspId(value: string): value is PspId {
  return Object.prototype.hasOwnProperty.call(PSP_PRESETS, value);
}

/** Type guard for environment selectors coming from configuration. */
export function isPspEnvironment(value: string): value is PspEnvironment {
  return value === "sandbox" || value === "production";
}

/** Parses a preset id, failing loudly with the list of supported ids. */
export function parsePspId(value: string): PspId {
  if (!isPspId(value)) {
    throw new RangeError(
      `unknown PSP preset ${JSON.stringify(value)}; supported: ${listPspPresets()
        .map((preset) => preset.id)
        .join(", ")}`,
    );
  }
  return value;
}

/** Parses an environment selector, failing loudly on typos. */
export function parsePspEnvironment(value: string): PspEnvironment {
  if (!isPspEnvironment(value)) {
    throw new RangeError(
      `unknown environment ${JSON.stringify(value)}; expected sandbox or production`,
    );
  }
  return value;
}

/** Returns a preset by id. */
export function getPspPreset(id: PspId): PspPreset {
  return PSP_PRESETS[id];
}

/** Returns every available preset (ordered as declared in `PSP_PRESETS`). */
export function listPspPresets(): readonly PspPreset[] {
  return Object.values(PSP_PRESETS);
}

/** Selects one environment's confirmed endpoints from a preset. */
export function endpointsFor(preset: PspPreset, environment: PspEnvironment): PspEndpoints {
  return environment === "sandbox" ? preset.sandbox : preset.production;
}

/** Credentials needed in addition to a preset's endpoints. */
export interface PspCredentials {
  readonly clientId: string;
  readonly clientSecret: string;
}

/**
 * Builds ready-to-spread `PixClient` options for a PSP and environment.
 * Callers still supply mTLS material (`certificate`) — presets cover endpoints
 * and documented scopes only, never secrets or certificates.
 */
export function presetClientOptions(
  id: PspId,
  environment: PspEnvironment,
  credentials: PspCredentials,
): PixClientOptions {
  const preset = getPspPreset(id);
  const endpoints = endpointsFor(preset, environment);
  return {
    baseUrl: endpoints.baseUrl,
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
    oauth: { tokenUrl: endpoints.tokenUrl },
    ...(preset.defaultScopes === undefined ? {} : { scopes: preset.defaultScopes }),
  };
}
