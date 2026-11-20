# pix-sdk-br

PSP-agnostic, fully typed TypeScript SDK for the **standard Pix API published by Banco Central do Brasil**
(the BCB's official OpenAPI "API Pix" `2.11.0-rc1`, repository [`bacen/pix-api`](https://github.com/bacen/pix-api)).

Every Brazilian PSP that implements the standard Pix API — Efí, Inter, Sicoob, Banco do Brasil, Itaú,
Santander, Sicredi, … — exposes this same contract, differing only in base URL, OAuth details and mTLS
configuration. This project is **one SDK for all of them**, generated directly from the official spec.

> **Status (milestone 5 complete):** pinned-spec pipeline, full code generation, the core client,
> webhook parsing/adapters, JWS payload verification, BR Code generation **and evidence-backed PSP
> presets** are done. The client speaks mTLS (PFX or PEM) over undici, caches OAuth2
> client-credentials tokens with single-flight refresh, retries idempotent calls with
> backoff/jitter/`Retry-After`, honours timeouts/`AbortSignal`, parses RFC 7807 errors and validates
> requests before sending. Examples under `examples/` are type-checked in CI.

---

## Installation

Node.js **20 or newer** is required. This package is **not published** to npm, so install it from
the repository or from a local clone:

```bash
npm install github:hadagalberto-junior/pix-sdk-br
# or, from a checkout of this repository:
npm install ../pix-sdk-br
```

The SDK is ESM + CJS with bundled type declarations:

```ts
import { PixClient, generateBrCode } from "pix-sdk-br";
const { PixClient } = require("pix-sdk-br");
```

`express` and `fastify` are **optional peers** — install one only if you use the matching webhook
adapter (`npm i express` or `npm i fastify`). Runtime dependencies are limited to `undici`.

---

## What is in the box today

| Piece                 | Location                                    | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pinned spec pipeline  | `spec/spec.lock.json`, `npm run spec:fetch` | Downloads the spec at a pinned upstream commit and verifies its SHA-256. The YAML is intentionally **not committed** (upstream ships no license file); generated code derived from it is.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Code generator        | `scripts/generate.ts` (`npm run generate`)  | Fails-loud codegen: types for **every** schema (with the upstream pt-BR descriptions as TSDoc), per-operation request/response types, the `OPERATIONS` runtime registry, runtime validators (constraint IR) for every schema, request body and parameter set, plus the spec's official example payloads as data. Output is committed under `src/generated/` and a test regenerates byte-identical files to catch drift.                                                                                                                                                                                                                                              |
| Validation engine     | `src/validation/engine.ts`                  | Hand-written evaluator for the generated constraint IR: types, enums, patterns, lengths, RFC 3339 `date`/`date-time`, `uri`, numeric bounds, arrays (`minItems`/`maxItems`/`uniqueItems`), `allOf`/`oneOf`/`anyOf`, required properties and nested issue paths.                                                                                                                                                                                                                                                                                                                                                                                                      |
| Generated API surface | `src/generated/`                            | `schemas.ts` (types), `validators.ts` (one validator per schema/request body), `operations.ts` (per-operation path/query/body/response types, parameter validators, `OPERATIONS` + `paramValidators` registries), `examples.ts` (official example payloads), `contracts.ts` (OpenAPI → JSON Schema contracts for ajv), `scopes.ts` (OAuth2 scopes), `meta.ts` (provenance + errata).                                                                                                                                                                                                                                                                                 |
| Core client           | `src/client/`                               | `PixClient` with typed resource namespaces (`cob`, `cobv`, `lotecobv`, `loc`, `locrec`, `pix.devolucao`, `webhook*`, `rec`, `solicrec`, `cobr` + retentativa, `payload`) and `listAll` async iterators for every paginated list, undici transport with PFX/PEM mTLS, OAuth2 token cache (single-flight + proactive expiry), idempotent retries, timeouts/`AbortSignal`, RFC 7807 error hierarchy, client-side validation, logger hook and a pluggable `fetch` adapter.                                                                                                                                                                                               |
| Webhooks              | `src/webhooks/`, `pix-sdk-br/webhooks/*`    | `parseWebhook(body)` with discriminated, schema-validated results for `pix`, `rec`, `cobr`, `cob` and `cobv` callbacks; Node `http`, Express and Fastify adapters (optional peers) with configurable PSP path-suffix handling.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Signed payload / QR   | `src/payload/`                              | `client.payload.fetchVerified(location)` fetches a location JWS and verifies RS256/ES256/PS256 with `x5u`/`jku`/`x5c` keys using Node `crypto` (chain, validity and hostname checks) before validating the typed payload. `generateBrCode(location, options)` produces the copy-paste/QR string with CRC16/CCITT-FALSE (official SPEC vector covered).                                                                                                                                                                                                                                                                                                               |
| Helpers               | `src/money.ts`, `src/txid.ts`               | Safe integer-cent conversions for the API's `"10.00"` decimal strings, and spec-conformant random txid generation (`[a-zA-Z0-9]{26,35}`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Mock Pix API          | `test/mock-server/`                         | HTTPS + mTLS server with locally generated CA/server/client certs (`node-forge`), OAuth2 client-credentials endpoint, in-memory state for every resource family (cob, cobv, lotecobv, loc, locrec, pix, devolucao, rec, solicrec, cobr, retentativa, webhooks, payload tokens), spec-schema-repaired responses, RFC 7807 errors with `violacoes`, and injectable 429/503/token faults with `Retry-After`.                                                                                                                                                                                                                                                            |
| PSP presets           | `src/presets.ts`                            | Endpoint presets only for PSPs whose production + sandbox base URLs and token URLs are confirmed in official public developer docs (source URLs and verification date in code). Currently Efí and Inter; the other five PSPs are documented with manual-configuration guidance instead of invented URLs.                                                                                                                                                                                                                                                                                                                                                             |
| Examples              | `examples/`                                 | Runnable create-cob + BR Code and Fastify webhook receiver examples, type-checked in CI (`npm run typecheck:examples`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Test suite            | `test/`                                     | 665+ tests: engine units, spec-vs-generated coverage proofs (every path/operation/schema/request body/parameter/response/scope/example), ajv contract tests validating every request and response of every operation against the OpenAPI schemas (including decoded `application/jose` payloads), constraint-type enforcement with valid + invalid vectors, errata behaviour, generator guard rails (drift fails loudly), pagination/payload/resource units, PSP preset vectors (known-valid and known-invalid), mTLS + OAuth + fault-injection integration against the mock server, and an end-to-end `spec:fetch` integration test. Coverage ≥ 90% lines enforced. |
| CI                    | `.github/workflows/ci.yml`                  | Node 20/22/24 × Ubuntu/Windows: fetch pinned spec → format → lint → typecheck → typecheck examples → build → test with coverage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Quick tour

```ts
import {
  validateCobSolicitada,
  validatePutCobTxidPath,
  requestBodyExamples,
  type CobSolicitada,
  type PutCobTxidResponse,
} from "pix-sdk-br";

// Validate a request body before it ever leaves your process.
const result = validateCobSolicitada({
  calendario: { expiracao: 3600 },
  devedor: { cpf: "12345678909", nome: "Francisco da Silva" },
  valor: { original: "37.00" },
  chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
});
if (!result.ok) {
  for (const issue of result.issues) console.error(`${issue.path}: ${issue.message}`);
}

// Validate path/query parameters per operation.
const params = validatePutCobTxidPath({ txid: "7978c0c97ea847e78e8849634473c1f1" });

// The spec's official payloads are shipped as data — handy for your own mocks/tests.
const exampleBodies = requestBodyExamples.CobBody;
```

Every validator is total on arbitrary input: malformed data produces `{ ok: false, issues: [...] }`
with precise paths (`valor.retirada.saque.valor`, `pix[0].devolucoes[1].status`), never exceptions.

### Using the client

```ts
import { PixClient, PixApiError, PixValidationError, generateTxid, toCents } from "pix-sdk-br";
import { readFileSync } from "node:fs";

const client = new PixClient({
  baseUrl: "https://pix.psp.example.com",
  clientId: process.env.PIX_CLIENT_ID!,
  clientSecret: process.env.PIX_CLIENT_SECRET!,
  certificate: {
    pfx: readFileSync("certificate.pfx"),
    passphrase: process.env.PIX_CERT_PASSPHRASE!,
  },
  scopes: ["cob.read", "cob.write"],
  timeoutMs: 15_000,
  retry: { maxAttempts: 3 }, // idempotent calls only
  logger: {
    warn: (message, context) => console.warn(message, context),
  },
});

// A generated txid makes PUT /cob/{txid} safely idempotent.
const txid = generateTxid();
const cob = await client.cob.createWithTxid(txid, {
  calendario: { expiracao: 3600 },
  valor: { original: "37.00" },
  chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
});

try {
  await client.cob.get(txid);
} catch (error) {
  if (error instanceof PixValidationError) console.error(error.fieldPaths);
  else if (error instanceof PixApiError) console.error(error.status, error.violations);
  throw error;
} finally {
  await client.close();
}
```

`certificate` also accepts `{ cert, key, ca? }` PEM material. Pass `fetch` (and an optional
undici `dispatcher`) to run the client on Bun/Deno or to supply your own transport. Every resource
method accepts `{ signal, timeoutMs }` for per-call cancellation.

### PSP presets

A preset exists **only** for a PSP whose official, public developer documentation states all three
of: production base URL, sandbox base URL, and OAuth token URL (for both environments). Each entry
in `src/presets.ts` carries its source URL(s) and the date it was verified — no URL is inferred from
another SDK or forum post.

| PSP   | Environment | Base URL                                           | Token URL                                                  | Official source                                                                                                                                                                            | Verified   |
| ----- | ----------- | -------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Efí   | sandbox     | `https://pix-h.api.efipay.com.br`                  | `https://pix-h.api.efipay.com.br/oauth/token`              | [Credenciais, Certificado e Autorização](https://dev.efipay.com.br/docs/api-pix/credenciais/) — "Rotas base" + `POST /oauth/token`                                                         | 2026-11-20 |
| Efí   | production  | `https://pix.api.efipay.com.br`                    | `https://pix.api.efipay.com.br/oauth/token`                | [Credenciais, Certificado e Autorização](https://dev.efipay.com.br/docs/api-pix/credenciais/) — "Rotas base" + `POST /oauth/token`                                                         | 2026-11-20 |
| Inter | sandbox     | `https://cdpj-sandbox.partners.uatinter.co/pix/v2` | `https://cdpj-sandbox.partners.uatinter.co/oauth/v2/token` | [Pix OpenAPI](https://developers.inter.co/redocusaurus/swagger-api-pix-automatico-yaml.yaml) + [OAuth OpenAPI](https://developers.inter.co/redocusaurus/swagger-token-yaml.yaml) `servers` | 2026-11-20 |
| Inter | production  | `https://cdpj.partners.bancointer.com.br/pix/v2`   | `https://cdpj.partners.bancointer.com.br/oauth/v2/token`   | [Pix OpenAPI](https://developers.inter.co/redocusaurus/swagger-api-pix-automatico-yaml.yaml) + [OAuth OpenAPI](https://developers.inter.co/redocusaurus/swagger-token-yaml.yaml) `servers` | 2026-11-20 |

```ts
import { isPspId, presetClientOptions, parsePspEnvironment, type PspId } from "pix-sdk-br";

const psp = process.env["PIX_PSP"] ?? "efi";
if (!isPspId(psp)) throw new Error(`unsupported PSP: ${psp}`);
const environment = parsePspEnvironment(process.env["PIX_ENV"] ?? "sandbox");

const client = new PixClient({
  ...presetClientOptions(psp, environment, {
    clientId: process.env["PIX_CLIENT_ID"]!,
    clientSecret: process.env["PIX_CLIENT_SECRET"]!,
  }),
  certificate: { pfx: readFileSync("certificate.p12"), passphrase: "" },
});
```

`presetClientOptions` fills `baseUrl`, `oauth.tokenUrl` and (where officially documented) the
default scopes. Credentials and certificates are never part of a preset. Note that Inter requires
the `pix/v2` path in `baseUrl` and uses a different OAuth host family (`oauth/v2`) from its Pix host.

The other PSPs from the brief were researched but cannot be preset without publishing invented
endpoints. Configure them manually with the values from your developer portal:

| PSP             | Official portal consulted                                                                  | Why no preset                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Sicoob          | [Portal Developers](https://developers.sicoob.com.br/portal/)                              | Public docs require login for the Pix API hosts/token URL; the sandbox uses a static portal token, not a documented OAuth token endpoint.    |
| Banco do Brasil | [API Pix](https://www.bb.com.br/site/developers/api-pix/)                                  | The public page describes the product but not the concrete production/homologação API and OAuth hostnames (login-gated guides).              |
| Itaú            | [Autenticação mTLS](https://devportal.itau.com.br/autenticacao-documentacao)               | The public auth guide gives the STS token host but says each API's production base URL is in the login-gated catalog; sandbox is non-OAuth.  |
| Santander       | [API Pix reference](https://developer.santander.com.br/api/documentacao/pix)               | The Pix reference is not publicly retrievable without portal authentication, so the production/sandbox hosts cannot be confirmed.            |
| Sicredi         | [Getting started — Pix](https://developers.sicredi.com.br/public/docs/getting-started-pix) | Production URLs are public, but the docs explicitly state that homologação base/token URLs are supplied by the Sicredi team on access grant. |

```ts
// Manual configuration for a PSP without a preset.
const client = new PixClient({
  baseUrl: process.env["PIX_BASE_URL"]!,
  clientId: process.env["PIX_CLIENT_ID"]!,
  clientSecret: process.env["PIX_CLIENT_SECRET"]!,
  oauth: { tokenUrl: process.env["PIX_TOKEN_URL"]! },
  certificate: { cert: pemCert, key: pemKey, ca: pspCa },
});
```

### Webhooks

`parseWebhook` validates callback payloads against the generated spec schemas and returns a
discriminated result:

```ts
import { parseWebhook, parseWebhookOrThrow } from "pix-sdk-br";

const result = parseWebhook(requestBody);
if (!result.ok) {
  console.error(result.issues); // { code, path, message }[]
} else if (result.kind === "pix") {
  for (const pix of result.data.pix ?? []) console.log(pix.endToEndId);
}
// parseWebhookOrThrow(body) throws PixWebhookError instead.
```

Adapters live on optional peer subpath exports (`express` and `fastify` are **not** required to
install the SDK):

```ts
// Node http (or https):
import { createNodeWebhookHandler } from "pix-sdk-br/webhooks/node";
createServer(
  createNodeWebhookHandler({
    path: { basePath: "/webhook", pathSuffix: "strip" },
    onWebhook: (event) => console.log(event.kind, event.data),
  }),
).listen(3000);

// Express: app.use(express.json()); app.post("/webhook", expressWebhook({ onWebhook }));
// Fastify: app.post("/webhook", fastifyWebhook({ onWebhook }));
```

**PSP path-suffix quirk.** The BCB callbacks are registered as `{webhookUrl}/pix`, so a PSP often
calls `/webhook/pix` even though you registered `/webhook`. `path.pathSuffix` controls this:
`"strip"` (default) removes a trailing `pix`/`rec`/`cob`/`cobv`/`cobr` before matching, `"reject"`
returns 404/`next()` for suffixed paths, and `"ignore"` keeps them. Use `path.suffixes` for custom
vocabularies and `path.basePath` to restrict which paths are accepted. Node returns 405 for
non-POST, 422 for invalid payloads and 413 for oversized bodies.

#### mTLS-protected webhook endpoints

Pix webhooks are normally called over mutual TLS: the PSP presents its client certificate and your
endpoint validates it against the PSP CA. Verification belongs at the transport layer — the SDK never
touches the TLS handshake, so pass the authenticated request/response through unchanged and the body
arrives intact:

```ts
import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import { createNodeWebhookHandler } from "pix-sdk-br/webhooks/node";

createServer(
  {
    pfx: readFileSync("webhook.p12"),
    passphrase: process.env["WEBHOOK_CERT_PASSPHRASE"],
    ca: readFileSync("psp-ca.pem"),
    requestCert: true,
    rejectUnauthorized: true,
  },
  createNodeWebhookHandler({ onWebhook: (event) => console.log(event.kind) }),
).listen(443);
```

Behind nginx/Envoy/ALB, terminate mTLS there and forward to the plain handler; configure the proxy
to **reject** missing/invalid client certificates (passing an `X-Client-Cert` header without
validating it is not mTLS). Do not accept callback bodies from unauthenticated clients, and keep the
PSP CA bundle updated. `examples/fastify-webhook.ts` shows the same setup using Fastify's `https`
option (set `PIX_WEBHOOK_PFX` and `PIX_WEBHOOK_CA`).

### Signed payloads and BR Code

```ts
import { generateBrCode, verifyJws } from "pix-sdk-br";

const location = (await client.cob.createWithTxid(txid, body)).loc?.location!;
const copyPaste = generateBrCode(location, {
  merchantName: "Minha Loja",
  merchantCity: "Sao Paulo",
  transactionId: txid,
});
console.log(copyPaste); // ends with the 6304 CRC16 field

// Fetch the location JWS, verify its RS256/ES256/PS256 signature and schema:
const verified = await client.payload.fetchVerified(location, {
  trustedCa: caPem, // or allowSelfSignedRoot for local test PKI
});
console.log(verified.payloadKind, verified.payload);
```

`verifyJws(jws, options)` is also exported for standalone verification. It rejects forged
signatures, wrong/unsupported algorithms, untrusted or expired certificates, hostname mismatches
and malformed payloads with a `PixJwsError` carrying a stable `code`.

## Error handling

Every SDK error extends `PixError`, so `catch (error) { if (error instanceof PixError) ... }` is a
reliable first split:

| Class                | When                                                                   | Useful fields                                                                                                               |
| -------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `PixValidationError` | A request body or parameter fails local, spec-derived validation       | `operation`, `issues` (`{ code, path, message }[]`), `fieldPaths`                                                           |
| `PixApiError`        | Non-2xx from the PSP, parsed as RFC 7807 `problem+json`                | `status`, `type`, `title`, `detail`, `correlationId`, `violations` / `violationPaths`, `problem`, `context`, `retryAfterMs` |
| `PixAuthError`       | Token acquisition/refresh failed (bad credentials, scope, TLS, status) | `tokenUrl`, `status`, `cause`                                                                                               |
| `PixNetworkError`    | Connection/TLS/DNS/timeout failure after retries                       | `code`, `timeout`, `context`, `cause`                                                                                       |
| `PixAbortError`      | Caller aborted via `AbortSignal` (distinct from an SDK timeout)        | `cause`                                                                                                                     |
| `PixWebhookError`    | `parseWebhookOrThrow` rejected a callback payload                      | `issues`                                                                                                                    |
| `PixJwsError`        | Location JWS fetch/verify failed (bad signature, alg, chain, hostname) | `code`                                                                                                                      |

```ts
import {
  PixApiError,
  PixAuthError,
  PixNetworkError,
  PixValidationError,
  PixError,
} from "pix-sdk-br";

try {
  await client.cob.createWithTxid(txid, body);
} catch (error) {
  if (error instanceof PixValidationError) {
    // Nothing was sent. Map these to your form fields.
    console.error(error.operation, error.fieldPaths, error.issues);
  } else if (error instanceof PixApiError) {
    // PSP rejected the request. `violations` uses the spec's razao/propriedade/valor names.
    console.error(error.status, error.detail, error.correlationId, error.violations);
  } else if (error instanceof PixAuthError || error instanceof PixNetworkError) {
    console.error(error.message, error instanceof PixAuthError ? error.tokenUrl : error.code);
  } else if (error instanceof PixError) {
    console.error(error.name, error.message);
  } else {
    throw error;
  }
}
```

Retries happen automatically **only for idempotent requests** (GET, PUT with a txid, DELETE) on
429/5xx/network failures, honour `Retry-After` and use exponential backoff with jitter. Turn them
off with `retry: false`. Timeouts default to 15 s and can be set globally (`timeoutMs`) or per call
(`{ timeoutMs, signal }`).

## The spec, the errata, and the known-invalid official examples

The pinned upstream file contains a handful of **objectively broken constructs** — required keys that no
schema declares anywhere, a stray quote inside a YAML flow sequence, numeric keywords applied to arrays,
slash-delimited regexes, and `oneOf`/`anyOf` unions whose branches cannot discriminate (making the
constraint unsatisfiable or vacuous). Left as-is they would produce validators that reject every payload.

The generator therefore applies a **documented errata list** — each entry evidence-backed, assert-guarded
(failing generation loudly if the upstream file drifts), and re-exported at runtime in
`SPEC_ERRATA` (`src/generated/meta.ts`). The 20 entries are, in brief:

| Erratum                                                                                                                  | Upstream defect                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slash-delimited-pattern`                                                                                                | `pattern: "/^\d{11}$/"` (slash-delimited regexes) unwrapped to JSON-Schema form.                                                                                                  |
| `recnotification-required-quote`                                                                                         | `required: ["idRec","status",atualizacao"]` — stray quote; corrected to `atualizacao`.                                                                                            |
| `pixconsultados-required-cobs`                                                                                           | Requires `cobs` where the schema declares `pix`; renamed.                                                                                                                         |
| `cobbase-infoadicionais-maximum`                                                                                         | `maximum: 50` (numeric keyword) on an array → `maxItems: 50`.                                                                                                                     |
| `recbase-required-retentativa` / `recbase-required-idrec`                                                                | `RecBase` requires `retentativa`/`idRec` — keys no schema declares; dropped (the real constraints live in `RecConfiguracao` and the response schemas).                            |
| `solicrecbase-required-pagador` / `solicrerec-completa-required-rec`                                                     | Undeclared required keys; `pagador` dropped, `rec` renamed to the declared `recPayload`.                                                                                          |
| `payloadlocationcob-required-tipocob` / `payloadlocationrecgerada-required-tipo`                                         | Required keys undeclared by those schemas; dropped.                                                                                                                               |
| `cobgerada-loc-required-txid` / `cobvgerada-loc-required-txid` / `cobvgerada-required-location`                          | `loc.txid`/top-level `location` required but undeclared in the composition; dropped.                                                                                              |
| `dadosrecebedor-top-level-required`                                                                                      | Address fields required at the top level of every composing schema; the intended constraint (inside `recebedor`) is already expressed there. Dropped the spurious top-level list. |
| `cobsconsultadas-items-required-idcob`                                                                                   | Per-item `idCob` — no schema in the file declares it; dropped.                                                                                                                    |
| `dadospagadorrec-required-ispb`                                                                                          | `ispbParticipante` required at the top level instead of inside `pagador`; moved to where the property lives.                                                                      |
| `retirada-oneof-required-branches` / `encerramento-oneof-required-branches` / `componentesvalor-anyof-required-branches` | Union branches without `required` — unsatisfiable `oneOf` (nothing can ever pass) / vacuous `anyOf` (nothing can ever fail). Branches gained their distinguishing `required`.     |
| `recrevisada-devedor-identical-oneof`                                                                                    | Two character-identical `oneOf` branches (unsatisfiable); collapsed.                                                                                                              |

Separately, the spec ships **official examples that contradict its own schemas** — missing required
fields (`loc.criacao`, `cnpj`, `atualizacao.status`), string values for integer fields, `"POUPANÇA"`
(cedilla) against the ASCII enum, 34-character `endToEndId`s against the fixed 32. The validators
implement the schema faithfully, and the test suite pins every one of those examples as a
**documented known-invalid fixture** with the exact failing path (`test/examples.test.ts`) — proving the
constraints are enforced on the spec's own data, not weakened to make examples pass.

Two semantics notes, faithful to JSON Schema (and to ajv):

- `pattern` is an **unanchored search** (`[a-zA-Z0-9]{26,35}` accepts a longer alphanumeric run);
  the spec declares no `minLength`/`maxLength` for `TxId`.
- `format: uri` accepts absolute URLs and relative references without control characters — the spec
  itself uses relative `location` values like `pix.example.com/qr/v2/9d36…`.

## Project layout

```
spec/spec.lock.json        # pinned upstream URL + commit + sha256 (committed)
scripts/fetch-spec.mjs     # npm run spec:fetch — download + checksum-verify
scripts/generate.ts        # npm run generate — the generator entry point
scripts/generator/         #   openapi types, errata, IR compiler, type emitter, operations walk, example resolution, file emitter
src/validation/            # hand-written validation engine (unit-tested to ~99%)
src/generated/             # committed generator output (drift-checked in CI)
src/client/                # HTTP/OAuth/retry/error/validation/logger layers + PixClient resources
src/webhooks/              # discriminated parser + node/express/fastify adapters
src/payload/               # JWS verification + BR Code generation
src/money.ts, src/txid.ts  # money + txid helpers
src/presets.ts             # evidence-backed PSP presets + manual-config guidance
examples/                  # create-cob + BR Code and Fastify webhook receiver (type-checked in CI)
test/mock-server/          # local mTLS mock Pix API (CA/server/client certs, OAuth, faults)
test/                      # vitest suites; coverage ≥ 90% lines enforced
```

## Development

Requirements: Node.js ≥ 20 and npm.

```bash
npm install
npm run spec:fetch     # download the pinned spec (checksum-verified)
npm run generate       # regenerate src/generated (fails loudly on spec drift)
npm test               # run the suite
npm run test:coverage  # ...with coverage thresholds
npm run lint           # eslint (strict, type-checked) — zero warnings policy
npm run format         # prettier
npm run typecheck      # tsc --noEmit (strict; src, scripts, tests and examples)
npm run typecheck:examples # examples only (also enforced by CI)
npm run build          # tsup → dist/ (ESM + CJS + d.ts)
```

## FAQ

**Which PSPs have a preset, and why not all seven?** Only Efí and Inter publish all three required
endpoints in official public docs. Sicoob, Banco do Brasil, Itaú, Santander and Sicredi are listed
with their official portal and the exact reason above; use manual configuration for them. A preset
is never added from a forum post or another SDK's constants.

**Does the test suite call real banks?** No. It runs against a local HTTPS + mTLS mock Pix API with
locally generated certificates and injectable faults. Network access is limited to fetching the
pinned spec and PSP documentation during development.

**Why are monetary values strings like `"10.00"`?** Because that is what the BCB spec requires.
Use `fromReais`/`fromCents`/`toCents` to convert safely via integer cents.

**The PSP calls `/webhook/pix` although I registered `/webhook`. Is that a bug?** No — BCB callbacks
are registered as `{webhookUrl}/pix`. The adapters default to `path.pathSuffix: "strip"`; switch to
`"reject"` or `"ignore"` if needed. See the webhook section.

**Do I need mTLS for receiving webhooks?** Usually yes for Pix. Terminate it in your TLS server or
reverse proxy and validate the PSP client certificate against its CA. The SDK's adapters only
process already-authenticated HTTP requests.

**Can I run this on Bun/Deno?** The core HTTP layer is pluggable: pass a `fetch` adapter (and your own
dispatcher). JWS verification uses Node `crypto`, so that specific feature remains Node-oriented.

**Is this published to npm?** No. Install from the repository or a local build. License: MIT —
Hadagalberto Junior.
