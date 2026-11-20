# Milestone 6 — final audit

Source of truth: `SPEC.md` and the pinned `spec/openapi.yaml` (BCB API Pix 2.11.0-rc1,
sha256 `cf191845044a5edd38c00b0e099924e8daceacfe53502abaa6a5b238bed41eb4`).
`test/audit.test.ts` enforces every claim below on each CI run; the per-operation contract
matrix is `test/contract-operations.test.ts` (one named test per operation).

## SPEC requirement matrix

| SPEC requirement                                                                  | Implementation                                                                      | Typed                                                           | Validated                                                         | Tested                                                                         |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Source of truth / pinned spec + checksum drift detection                          | `scripts/fetch-spec.mjs`, `spec/spec.lock.json`, `src/generated/meta.ts`            | ✅ `SPEC_SHA256`, `SPEC_ERRATA`                                 | ✅ generator fails on drift (`test/generator-guards.test.ts`)     | ✅ `test/fetch-spec.test.ts`, `test/generator.test.ts`                         |
| ALL 57 spec endpoints (incl. Pix Automático)                                      | `src/generated/operations.ts`, `src/client/resources.ts`                            | ✅ per-operation `*Path`, `*Query`, `*RequestBody`, `*Response` | ✅ `paramValidators`, `requestBodyValidators`, `schemaValidators` | ✅ 57 named tests in `test/contract-operations.test.ts` + `test/audit.test.ts` |
| Code generation: types, request/response pairs, enums, validators, TSDoc          | `scripts/generate.ts`, `scripts/generator/*`, 8 committed files in `src/generated/` | ✅ strict TS                                                    | ✅ `test/generator.test.ts`, `test/engine.test.ts`                | ✅ `npm run generate && git diff --exit-code src/generated`                    |
| Client: mTLS, OAuth2 cache/single-flight/refresh, retries, timeouts, signals      | `src/client/{client,http,oauth,retry,transport,signal}.ts`                          | ✅ `PixClientOptions`, per-call `CallOptions`                   | ✅ request bodies/params validated before I/O                     | ✅ `test/{client,http,oauth,retry}.test.ts`                                    |
| Errors: `PixApiError` (RFC 7807 + violacoes), network/auth/validation errors      | `src/client/errors.ts`                                                              | ✅ discriminated classes                                        | ✅ `Problema` schema in ajv contracts                             | ✅ `test/errors.test.ts`, contract error statuses                              |
| Pagination helpers (`listAll`), txid generator, money helpers                     | `src/client/client.ts`, `src/txid.ts`, `src/money.ts`                               | ✅ generics                                                     | ✅ spec regex / cent arithmetic                                   | ✅ `test/{client,txid,money}.test.ts`                                          |
| PSP presets only with evidence-backed official URLs                               | `src/presets.ts` (URL + verification date in comments)                              | ✅ `PspPreset`                                                  | ✅ README citation                                                | ✅ `test/presets.test.ts`                                                      |
| Webhooks: parser + Node/Express/Fastify adapters, path quirk                      | `src/webhooks/*`, subpath exports                                                   | ✅ discriminated results                                        | ✅ spec callback schemas                                          | ✅ `test/webhooks*.test.ts`                                                    |
| Dynamic QR payload: JWS verify (RS256/ES256/PS256), x5u/jku/x5c, SECURE key fetch | `src/payload/jws.ts`, `verified.ts`, `errors.ts`                                    | ✅ `VerifiedJws<T>`, `JwsFailureCode`                           | ✅ chain/validity/host/scheme/size/timeout/redirect checks        | ✅ `test/jws.test.ts` (hardening vectors)                                      |
| BR Code generation with CRC16/CCITT-FALSE                                         | `src/payload/brcode.ts`                                                             | ✅ `BrCodeOptions`                                              | ✅ official SPEC CRC vector                                       | ✅ `test/brcode.test.ts`                                                       |
| Mock Pix API with state, mTLS OAuth, problem+json, fault injection                | `test/mock-server/*`                                                                | ✅ `MockServer`, `RecordedExchange`                             | ✅ static fixtures validated by ajv (`test/fixtures.test.ts`)     | ✅ `test/mock-server.test.ts`                                                  |
| Contract tests: what client sends + every documented response status              | `test/contract-operations.test.ts`, `test/contract/ajv.ts`                          | ✅ ajv contracts from spec                                      | ✅ method/path/query/headers/body + 2xx and error bodies          | ✅ 57 named tests                                                              |
| Unit tests: token cache, retries, pagination, validators, webhook, JWS, BR Code   | `test/*.test.ts`                                                                    | —                                                               | ✅                                                                | ✅ full suite                                                                  |
| Example apps type-check in CI                                                     | `examples/*`, `tsconfig.examples.json`                                              | ✅                                                              | ✅ `npm run typecheck:examples`                                   | ✅ CI step                                                                     |
| ESM + CJS, Node ≥20, MIT, docs (EN + PT-BR), DO NOT publish                       | `tsup.config.ts`, `package.json`, `README*`, `LICENSE`                              | ✅ dual exports                                                 | ✅ `npm run build`                                                | ✅ `npm run ci:all`                                                            |

## Operation matrix (57 operations)

Every row is exercised by a named `it.each` test that asserts the client's method, path,
query, headers and body against the spec contracts, then forces **every** documented response
status and checks the typed result or `PixApiError`. Static fixtures back all success schemas.

| Operation                   | Method | Path                              | Typed declarations                                                                               | Response statuses   | OAuth scopes               | Audit |
| --------------------------- | ------ | --------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------- | -------------------------- | ----- |
| GetCobTxid                  | GET    | `/cob/{txid}`                     | GetCobTxidPath, GetCobTxidQuery, GetCobTxidResponse                                              | 200/403/404/503     | `cob.read`                 | ✅    |
| PutCobTxid                  | PUT    | `/cob/{txid}`                     | PutCobTxidPath, PutCobTxidRequestBody, PutCobTxidResponse                                        | 201/400/403/404/503 | `cob.write`                | ✅    |
| PatchCobTxid                | PATCH  | `/cob/{txid}`                     | PatchCobTxidPath, PatchCobTxidRequestBody, PatchCobTxidResponse                                  | 200/400/403/404/503 | `cob.write`                | ✅    |
| GetCob                      | GET    | `/cob`                            | GetCobQuery, GetCobResponse                                                                      | 200/403/503         | `cob.read`                 | ✅    |
| PostCob                     | POST   | `/cob`                            | PostCobRequestBody, PostCobResponse                                                              | 201/400/403/503     | `cob.write`                | ✅    |
| GetCobvTxid                 | GET    | `/cobv/{txid}`                    | GetCobvTxidPath, GetCobvTxidQuery, GetCobvTxidResponse                                           | 200/403/404/503     | `cobv.read`                | ✅    |
| PutCobvTxid                 | PUT    | `/cobv/{txid}`                    | PutCobvTxidPath, PutCobvTxidRequestBody, PutCobvTxidResponse                                     | 201/400/403/404/503 | `cobv.write`               | ✅    |
| PatchCobvTxid               | PATCH  | `/cobv/{txid}`                    | PatchCobvTxidPath, PatchCobvTxidRequestBody, PatchCobvTxidResponse                               | 200/400/403/404/503 | `cobv.write`               | ✅    |
| GetCobv                     | GET    | `/cobv`                           | GetCobvQuery, GetCobvResponse                                                                    | 200/403/503         | `cobv.read`                | ✅    |
| GetLotecobvId               | GET    | `/lotecobv/{id}`                  | GetLotecobvIdPath, GetLotecobvIdResponse                                                         | 200/403/404/503     | `lotecobv.read`            | ✅    |
| PutLotecobvId               | PUT    | `/lotecobv/{id}`                  | PutLotecobvIdPath, PutLotecobvIdRequestBody, PutLotecobvIdResponse                               | 202/400/403/404/503 | `lotecobv.write`           | ✅    |
| PatchLotecobvId             | PATCH  | `/lotecobv/{id}`                  | PatchLotecobvIdPath, PatchLotecobvIdRequestBody, PatchLotecobvIdResponse                         | 202/400/403/404/503 | `lotecobv.write`           | ✅    |
| GetLotecobv                 | GET    | `/lotecobv`                       | GetLotecobvQuery, GetLotecobvResponse                                                            | 200/403/503         | `lotecobv.read`            | ✅    |
| GetLocrec                   | GET    | `/locrec`                         | GetLocrecQuery, GetLocrecResponse                                                                | 200/403/503         | `payloadlocationrec.read`  | ✅    |
| PostLocrec                  | POST   | `/locrec`                         | PostLocrecResponse                                                                               | 201/403/503         | `payloadlocationrec.write` | ✅    |
| GetLocrecId                 | GET    | `/locrec/{id}`                    | GetLocrecIdPath, GetLocrecIdResponse                                                             | 200/403/404/503     | `payloadlocationrec.read`  | ✅    |
| DeleteLocrecIdIdRec         | DELETE | `/locrec/{id}/idRec`              | DeleteLocrecIdIdRecPath, DeleteLocrecIdIdRecResponse                                             | 200/403/404/503     | `payloadlocationrec.write` | ✅    |
| GetLoc                      | GET    | `/loc`                            | GetLocQuery, GetLocResponse                                                                      | 200/403/503         | `payloadlocation.read`     | ✅    |
| PostLoc                     | POST   | `/loc`                            | PostLocRequestBody, PostLocResponse                                                              | 201/400/403/503     | `payloadlocation.write`    | ✅    |
| GetLocId                    | GET    | `/loc/{id}`                       | GetLocIdPath, GetLocIdResponse                                                                   | 200/403/404/503     | `payloadlocation.read`     | ✅    |
| DeleteLocIdTxid             | DELETE | `/loc/{id}/txid`                  | DeleteLocIdTxidPath, DeleteLocIdTxidResponse                                                     | 200/403/404/503     | `payloadlocation.write`    | ✅    |
| GetPixE2eid                 | GET    | `/pix/{e2eid}`                    | GetPixE2eidPath, GetPixE2eidResponse                                                             | 200/403/404/503     | `pix.read`                 | ✅    |
| GetPix                      | GET    | `/pix`                            | GetPixQuery, GetPixResponse                                                                      | 200/403/503         | `pix.read`                 | ✅    |
| GetPixE2eidDevolucaoId      | GET    | `/pix/{e2eid}/devolucao/{id}`     | GetPixE2eidDevolucaoIdPath, GetPixE2eidDevolucaoIdResponse                                       | 200/403/404/503     | `pix.read`                 | ✅    |
| PutPixE2eidDevolucaoId      | PUT    | `/pix/{e2eid}/devolucao/{id}`     | PutPixE2eidDevolucaoIdPath, PutPixE2eidDevolucaoIdRequestBody, PutPixE2eidDevolucaoIdResponse    | 201/400/403/404/503 | `pix.write`                | ✅    |
| GetPixUrlAccessToken        | GET    | `/{pixUrlAccessToken}`            | GetPixUrlAccessTokenPath, GetPixUrlAccessTokenResponse                                           | 200/400/404/503     | —                          | ✅    |
| GetCobvPixUrlAccessToken    | GET    | `/cobv/{pixUrlAccessToken}`       | GetCobvPixUrlAccessTokenPath, GetCobvPixUrlAccessTokenQuery, GetCobvPixUrlAccessTokenResponse    | 200/400/404/503     | —                          | ✅    |
| GetRecRecUrlAccessToken     | GET    | `/rec/{recUrlAccessToken}`        | GetRecRecUrlAccessTokenPath, GetRecRecUrlAccessTokenResponse                                     | 200/400/404/503     | —                          | ✅    |
| GetWebhookChave             | GET    | `/webhook/{chave}`                | GetWebhookChavePath, GetWebhookChaveResponse                                                     | 200/403/404/503     | `webhook.read`             | ✅    |
| PutWebhookChave             | PUT    | `/webhook/{chave}`                | PutWebhookChavePath, PutWebhookChaveRequestBody, PutWebhookChaveResponse                         | 200/400/403/404/503 | `webhook.write`            | ✅    |
| DeleteWebhookChave          | DELETE | `/webhook/{chave}`                | DeleteWebhookChavePath, DeleteWebhookChaveResponse                                               | 204/403/404/503     | `webhook.write`            | ✅    |
| GetWebhook                  | GET    | `/webhook`                        | GetWebhookQuery, GetWebhookResponse                                                              | 200/403/503         | `webhook.read`             | ✅    |
| GetWebhookrec               | GET    | `/webhookrec`                     | GetWebhookrecResponse                                                                            | 200/403/404/503     | `webhookrec.read`          | ✅    |
| PutWebhookrec               | PUT    | `/webhookrec`                     | PutWebhookrecRequestBody, PutWebhookrecResponse                                                  | 200/400/403/404/503 | `webhookrec.write`         | ✅    |
| DeleteWebhookrec            | DELETE | `/webhookrec`                     | DeleteWebhookrecResponse                                                                         | 204/403/404/503     | `webhookrec.write`         | ✅    |
| GetWebhookcobr              | GET    | `/webhookcobr`                    | GetWebhookcobrResponse                                                                           | 200/403/404/503     | `webhookcobr.read`         | ✅    |
| PutWebhookcobr              | PUT    | `/webhookcobr`                    | PutWebhookcobrRequestBody, PutWebhookcobrResponse                                                | 200/400/403/404/503 | `webhookcobr.write`        | ✅    |
| DeleteWebhookcobr           | DELETE | `/webhookcobr`                    | DeleteWebhookcobrResponse                                                                        | 204/403/404/503     | `webhookcobr.write`        | ✅    |
| GetWebhookcob               | GET    | `/webhookcob`                     | GetWebhookcobResponse                                                                            | 200/403/404/503     | `webhookcob.read`          | ✅    |
| PutWebhookcob               | PUT    | `/webhookcob`                     | PutWebhookcobRequestBody, PutWebhookcobResponse                                                  | 200/400/403/404/503 | `webhookcob.write`         | ✅    |
| DeleteWebhookcob            | DELETE | `/webhookcob`                     | DeleteWebhookcobResponse                                                                         | 204/403/404/503     | `webhookcob.write`         | ✅    |
| GetWebhookcobv              | GET    | `/webhookcobv`                    | GetWebhookcobvResponse                                                                           | 200/403/404/503     | `webhookcobv.read`         | ✅    |
| PutWebhookcobv              | PUT    | `/webhookcobv`                    | PutWebhookcobvRequestBody, PutWebhookcobvResponse                                                | 200/400/403/404/503 | `webhookcobV.write`        | ✅    |
| DeleteWebhookcobv           | DELETE | `/webhookcobv`                    | DeleteWebhookcobvResponse                                                                        | 204/403/404/503     | `webhookcobv.write`        | ✅    |
| GetRecIdRec                 | GET    | `/rec/{idRec}`                    | GetRecIdRecPath, GetRecIdRecQuery, GetRecIdRecResponse                                           | 200/403/404/503     | `rec.read`                 | ✅    |
| PatchRecIdRec               | PATCH  | `/rec/{idRec}`                    | PatchRecIdRecPath, PatchRecIdRecRequestBody, PatchRecIdRecResponse                               | 200/400/403/404/503 | `rec.write`                | ✅    |
| GetRec                      | GET    | `/rec`                            | GetRecQuery, GetRecResponse                                                                      | 200/403/503         | `rec.read`                 | ✅    |
| PostRec                     | POST   | `/rec`                            | PostRecRequestBody, PostRecResponse                                                              | 201/400/403/503     | `rec.write`                | ✅    |
| PostSolicrec                | POST   | `/solicrec`                       | PostSolicrecRequestBody, PostSolicrecResponse                                                    | 201/400/403/404/503 | `solicrec.write`           | ✅    |
| GetSolicrecIdSolicRec       | GET    | `/solicrec/{idSolicRec}`          | GetSolicrecIdSolicRecPath, GetSolicrecIdSolicRecResponse                                         | 200/403/404/503     | `solicrec.read`            | ✅    |
| PatchSolicrecIdSolicRec     | PATCH  | `/solicrec/{idSolicRec}`          | PatchSolicrecIdSolicRecPath, PatchSolicrecIdSolicRecRequestBody, PatchSolicrecIdSolicRecResponse | 201/400/403/404/503 | `solicrec.write`           | ✅    |
| GetCobrTxid                 | GET    | `/cobr/{txid}`                    | GetCobrTxidPath, GetCobrTxidResponse                                                             | 200/403/404/503     | `cobr.read`                | ✅    |
| PutCobrTxid                 | PUT    | `/cobr/{txid}`                    | PutCobrTxidPath, PutCobrTxidRequestBody, PutCobrTxidResponse                                     | 201/400/403/404/503 | `cobr.write`               | ✅    |
| PatchCobrTxid               | PATCH  | `/cobr/{txid}`                    | PatchCobrTxidPath, PatchCobrTxidRequestBody, PatchCobrTxidResponse                               | 200/400/403/404/503 | `cobr.write`               | ✅    |
| GetCobr                     | GET    | `/cobr`                           | GetCobrQuery, GetCobrResponse                                                                    | 200/403/503         | `cobr.read`                | ✅    |
| PostCobr                    | POST   | `/cobr`                           | PostCobrRequestBody, PostCobrResponse                                                            | 201/400/403/503     | `cobr.write`               | ✅    |
| PostCobrTxidRetentativaData | POST   | `/cobr/{txid}/retentativa/{data}` | PostCobrTxidRetentativaDataPath, PostCobrTxidRetentativaDataResponse                             | 201/400/403/404/503 | `cobr.write`               | ✅    |

## Maintainer findings — resolved

1. **Circular mock repair (removed).** `test/mock-server/repair.ts` deleted. Responses now come
   from static hand-curated literals (`test/mock-server/fixtures.ts`) built from the spec examples;
   `test/fixtures.test.ts` validates every one with ajv and fails on an invalid fixture. The
   contract suite primarily asserts what the CLIENT sends and how it parses every status.
2. **Security (fixed first).** `x5u`/`jku` require `https:` (opt-in `insecureAllowHttpKeyUrlForTesting`
   is documented as test-only), the key host must match `locationUrl`/`expectedHostname`/
   `allowedKeyHosts` (fails closed), redirects are refused, documents are size-capped and fetched
   with a hard timeout. See README security sections and `test/jws.test.ts` hardening vectors.

## Cross-platform CI checklist

- [x] `.gitattributes`: `* text=auto eol=lf`, binary marker for `.pfx/.pem/.crt/.key/.png`;
      `.prettierrc` sets `endOfLine: "lf"` — format/diff checks behave on Windows CRLF checkouts.
- [x] No test resolves `npm`, `dotnet` or `cargo` through a runtime binary path. The only
      subprocess uses `process.execPath` to run the repository's own `scripts/fetch-spec.mjs`.
- [x] No test depends on OS/ICU locale, timezone, path separators or line endings; dates are
      fixed ISO-8601 strings, mocks bind to `127.0.0.1` and compare structured data.
- [x] CI workflow steps are plain cross-platform npm scripts (no shell-only syntax); on every
      OS in the matrix it runs install, spec fetch, formatting, lint, typechecks, generated-code
      diff, build and tests with coverage.

## Clean-checkout gate

```
npm ci
npm run spec:fetch
npm run generate
git diff --exit-code src/generated
npm run format:check
npm run lint
npm run typecheck
npm run typecheck:examples
npm run build
npm test
npm run test:coverage   # lines/statements >= 90%
```
