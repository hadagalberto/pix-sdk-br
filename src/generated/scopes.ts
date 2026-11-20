/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * OAuth2 client-credentials scopes declared by the spec (securitySchemes.OAuth2).
 *
 * Source of truth: BCB "API Pix" OpenAPI 2.11.0-rc1 (commit 3ebbd6a184519cf8a032f2747b87cce2a3d05e7f).
 * Pinned upstream URL: https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml
 * Pinned file sha256: cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4
 *
 * Regenerate with `npm run spec:fetch && npm run generate`.
 * The generator fails loudly on any spec drift (unknown keywords, undeclared
 * required properties, checksum changes) — see scripts/generator/.
 */

/** Every OAuth2 scope declared by the spec. */
export const OAUTH_SCOPES = [
  "cob.write",
  "cob.read",
  "cobr.write",
  "cobr.read",
  "rec.write",
  "rec.read",
  "solicrec.write",
  "solicrec.read",
  "cobv.write",
  "cobv.read",
  "lotecobv.write",
  "lotecobv.read",
  "pix.write",
  "pix.read",
  "webhook.read",
  "webhook.write",
  "webhookrec.read",
  "webhookrec.write",
  "webhookcobr.read",
  "webhookcobr.write",
  "webhookcob.read",
  "webhookcob.write",
  "webhookcobv.read",
  "webhookcobv.write",
  "payloadlocation.write",
  "payloadlocation.read",
  "payloadlocationrec.write",
  "payloadlocationrec.read",
] as const;

export type OAuthScope = (typeof OAUTH_SCOPES)[number];

/** Upstream pt-BR descriptions per scope. */
export const OAUTH_SCOPE_DESCRIPTIONS: Readonly<Record<OAuthScope, string>> = {
  "cob.write": "Permissão para alteração de cobranças imediatas",
  "cob.read": "Permissão para consulta de cobranças imediatas",
  "cobr.write": "Permissão para alteração de cobranças recorrentes",
  "cobr.read": "Permissão para consulta de cobranças recorrentes",
  "rec.write": "Permissão para alteração de recorrências",
  "rec.read": "Permissão para consulta de recorrências",
  "solicrec.write": "Permissão para alteração de solicitações de recorrências",
  "solicrec.read": "Permissão para consulta de solicitações de recorrências",
  "cobv.write": "Permissão para alteração de cobranças com vencimento",
  "cobv.read": "Permissão para consulta de cobranças com vencimento",
  "lotecobv.write": "Permissão para alteração de lotes de cobranças com vencimento",
  "lotecobv.read": "Permissão para consulta de lotes de cobranças com vencimento",
  "pix.write": "Permissão para alteração de Pix",
  "pix.read": "Permissão para consulta de Pix",
  "webhook.read": "Permissão para consulta do webhook",
  "webhook.write": "Permissão para alteração do webhook",
  "webhookrec.read": "Permissão para consulta do webhook",
  "webhookrec.write": "Permissão para alteração do webhook",
  "webhookcobr.read": "Permissão para consulta do webhook",
  "webhookcobr.write": "Permissão para alteração do webhook",
  "webhookcob.read": "Permissão para consulta do webhook",
  "webhookcob.write": "Permissão para alteração do webhook",
  "webhookcobv.read": "Permissão para consulta do webhook",
  "webhookcobv.write": "Permissão para alteração do webhook",
  "payloadlocation.write": "Permissão para alteração de payloads",
  "payloadlocation.read": "Permissão para consulta de payloads",
  "payloadlocationrec.write": "Permissão para alteração de payloads",
  "payloadlocationrec.read": "Permissão para consulta de payloads",
};
