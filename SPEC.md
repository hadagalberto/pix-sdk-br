# pix-sdk-br — SPEC

PSP-agnostic, fully typed TypeScript SDK for the **standard Pix API published by Banco Central do Brasil**
(`bacen/pix-api`, OpenAPI "API Pix" 2.11.0-rc1). Every Brazilian PSP (Efí, Inter, Sicoob, Banco do Brasil, Itaú, Santander, Sicredi, ...)
implements this same API, differing only in base URL, OAuth details and mTLS. Today each PSP ships its own SDK; this project is one SDK for all.
Open source, MIT, "Hadagalberto Junior". NOT a toy: no stubs, no TODO, no placeholder or skipped tests, no "simplified" endpoints.

## Source of truth

- `spec/openapi.yaml` is the official BCB OpenAPI, downloaded by `npm run spec:fetch` from
  `https://raw.githubusercontent.com/bacen/pix-api/3ebbd6a184519cf8a032f2747b87cce2a3d05e7f/openapi.yaml` (pinned SHA).
  The YAML file itself is **gitignored** (upstream repo has no license file) — generated code derived from it is committed,
  and a checksum of the pinned file is stored so CI can detect drift. Implement exactly what the spec defines: paths, params,
  request/response schemas, enums, validations (regex/length on txid, chave, valores as strings "0.00", ISO dates), error responses.
- Endpoints in scope (ALL of them): `/cob`, `/cob/{txid}`, `/cobv`, `/cobv/{txid}`, `/lotecobv`, `/lotecobv/{id}`, `/loc`, `/loc/{id}`, `/loc/{id}/txid`,
  `/locrec`, `/locrec/{id}`, `/locrec/{id}/idRec`, `/pix`, `/pix/{e2eid}`, `/pix/{e2eid}/devolucao/{id}`, `/{pixUrlAccessToken}`, `/cobv/{pixUrlAccessToken}`,
  `/rec/{recUrlAccessToken}`, `/webhook`, `/webhook/{chave}`, `/webhookrec`, `/webhookcobr`, `/webhookcob`, `/webhookcobv`,
  `/rec`, `/rec/{idRec}`, `/solicrec`, `/solicrec/{idSolicRec}`, `/cobr`, `/cobr/{txid}`, `/cobr/{txid}/retentativa/{data}` (Pix Automático included).

## Stack

TypeScript 5 strict, ESM + CJS (tsup), Node ≥ 20 (uses `undici` for mTLS dispatcher; core HTTP layer pluggable so it can run on Bun/Deno with an adapter).
Runtime deps kept minimal (undici; zod optional? — prefer hand-written validators generated from the spec, no zod). Vitest (coverage ≥ 90% lines),
ESLint strict + Prettier, GitHub Actions CI (node 20/22/24, ubuntu+windows). README.md (English) + README.pt-BR.md, CHANGELOG, CONTRIBUTING, LICENSE. DO NOT publish.

## Features

1. **Code generation** (`scripts/generate.ts`, committed output under `src/generated/`): TypeScript types for every schema, request/response pairs per
   operation, enum unions, and runtime validators for request bodies & params (regex, lengths, required, formats). Generated code is readable and documented
   with the spec descriptions (pt-BR) as TSDoc.
2. **Client**: `new PixClient({ baseUrl, clientId, clientSecret, certificate: { pfx, passphrase } | { cert, key, ca? }, scopes?, oauth?: {...}, fetch?, retry?, timeoutMs?, logger? })`.
   Resource namespaces mirroring the spec: `client.cob.create/createWithTxid/get/update/list`, `cobv`, `lotecobv`, `loc`, `locrec`, `pix` (`get/list/devolucao.create/get`),
   `webhook`, `webhookCob`, `webhookCobv`, `webhookRec`, `webhookCobr`, `rec`, `solicrec`, `cobr`, `payload.get(location)` etc.
   - OAuth2 client-credentials with token cache, proactive refresh before expiry, single-flight refresh under concurrency, scope handling.
   - mTLS via undici `Agent` with PFX or PEM.
   - Retries with exponential backoff + jitter on 429/5xx/network errors for idempotent requests only (GET, PUT with txid, DELETE); honours `Retry-After`.
   - Timeouts and `AbortSignal` support on every call.
   - Errors: `PixApiError` parsed from RFC 7807 problem+json (`type`, `title`, `status`, `detail`, `violacoes[]`) per spec, plus `PixNetworkError`, `PixAuthError`, `PixValidationError` (client-side validation before sending, with field paths).
   - Pagination helpers: async iterators `client.cob.listAll({inicio, fim, ...})` walking `parametros.paginacao`.
   - txid generator conforming to spec regex (`[a-zA-Z0-9]{26,35}` for cob), idempotent `createWithTxid`.
   - Money helpers: values are strings in the API ("10.00"); helpers convert from/to integer cents safely.
3. **PSP presets** (`presets.ts`): only include a PSP preset when its production and sandbox base URLs and OAuth token URL are confirmed from the PSP's
   **official public developer documentation** (fetch it during work, cite the URL in a comment and in README). Mark each with the date verified.
   If a PSP cannot be confirmed, do not include it — document how to configure it manually instead. Never invent URLs.
4. **Webhooks**: framework-agnostic `parseWebhook(body)` with full validation of the spec callback payloads (pix[], rec, cobr, ...), typed discriminated results;
   adapters for Node `http`, Express and Fastify (as optional peer deps, subpath exports); README section on mTLS-protected webhook endpoints and the
   common "PSP calls `/pix` suffix" quirk with a configurable path handling.
5. **Dynamic QR payload**: `client.payload.fetch(locationUrl)` retrieves the JWS from the location URL, verifies the JWS signature (RS256/ES256/PS256) using the
   `x5u`/`jku` key from the header, validates the certificate chain/hostname rules described in the BCB manual, and returns the typed payload.
   Implement with Node `crypto` (no jose dependency) and test with locally generated keys/certs.
6. **BR Code**: generate the copy-paste/QR payload for a created cob from its `location` (dynamic Pix: GUI + url, merchant name/city, CRC16/CCITT-FALSE).
   CRC test vector: `00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D`.

## Testing

- A **mock Pix API server** (`test/mock-server/`) implemented from the spec: in-memory state for cob/cobv/loc/pix/devolucao/rec/cobr/webhooks, OAuth token endpoint,
  mTLS with locally generated CA + client/server certs (generated in test setup with Node crypto/`selfsigned`-like code in-house or `node-forge` as devDependency),
  realistic error responses (problem+json with violacoes), configurable fault injection (429 with Retry-After, 503, timeouts, token expiry).
- Contract tests: every response the mock emits AND every request the client sends is validated against the OpenAPI schemas with ajv (devDependency) — run for every operation.
- Unit tests for token cache concurrency, retries/backoff (fake timers), pagination, validators (valid + invalid for each constraint), webhook parsing, JWS verification (valid, bad signature, wrong alg, expired cert), BR Code.
- Example apps in `examples/` (create cob and print BR Code; webhook receiver with Fastify) that type-check in CI.

## Hard constraints

- Never run `git push`, `gh`, `npm publish`, or anything that publishes. Commit locally after each milestone (conventional commits). Stay inside this repository.
- Network use allowed only to fetch the pinned spec and PSP official documentation. Never send requests to real PSP production endpoints.
