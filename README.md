# pix-sdk-br

PSP-agnostic, fully typed TypeScript SDK for the **standard Pix API published by Banco Central do Brasil**
(the BCB's official OpenAPI "API Pix" `2.11.0-rc1`, repository [`bacen/pix-api`](https://github.com/bacen/pix-api)).

Every Brazilian PSP that implements the standard Pix API — Efí, Inter, Sicoob, Banco do Brasil, Itaú,
Santander, Sicredi, … — exposes this same contract, differing only in base URL, OAuth details and mTLS
configuration. This project is **one SDK for all of them**, generated directly from the official spec.

> **Status (milestone 2 of N):** pinned-spec pipeline, full code generation **and the core client**
> are done. The client speaks mTLS (PFX or PEM) over undici, caches OAuth2 client-credentials tokens
> with single-flight refresh, retries idempotent calls with backoff/jitter/`Retry-After`, honours
> timeouts/`AbortSignal`, parses RFC 7807 errors, validates requests before sending and exposes a
> structured logger hook. An in-memory mock Pix API (real local mTLS, OAuth, fault injection) backs
> the integration tests. PSP presets, webhook adapters, JWS verification and BR Code helpers are
> the next milestones.

---

## What is in the box today

| Piece                 | Location                                    | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pinned spec pipeline  | `spec/spec.lock.json`, `npm run spec:fetch` | Downloads the spec at a pinned upstream commit and verifies its SHA-256. The YAML is intentionally **not committed** (upstream ships no license file); generated code derived from it is.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Code generator        | `scripts/generate.ts` (`npm run generate`)  | Fails-loud codegen: types for **every** schema (with the upstream pt-BR descriptions as TSDoc), per-operation request/response types, the `OPERATIONS` runtime registry, runtime validators (constraint IR) for every schema, request body and parameter set, plus the spec's official example payloads as data. Output is committed under `src/generated/` and a test regenerates byte-identical files to catch drift.                                                                                                                                                                                          |
| Validation engine     | `src/validation/engine.ts`                  | Hand-written evaluator for the generated constraint IR: types, enums, patterns, lengths, RFC 3339 `date`/`date-time`, `uri`, numeric bounds, arrays (`minItems`/`maxItems`/`uniqueItems`), `allOf`/`oneOf`/`anyOf`, required properties and nested issue paths.                                                                                                                                                                                                                                                                                                                                                  |
| Generated API surface | `src/generated/`                            | `schemas.ts` (types), `validators.ts` (one validator per schema/request body), `operations.ts` (per-operation path/query/body/response types, parameter validators, `OPERATIONS` + `paramValidators` registries), `examples.ts` (official example payloads), `contracts.ts` (OpenAPI → JSON Schema contracts for ajv), `scopes.ts` (OAuth2 scopes), `meta.ts` (provenance + errata).                                                                                                                                                                                                                             |
| Core client           | `src/client/`                               | `PixClient` with typed resource namespaces (`cob`, `cobv`, `lotecobv`, `loc`, `locrec`, `pix.devolucao`, `webhook*`, `rec`, `solicrec`, `cobr` + retentativa, `payload`) and `listAll` async iterators for every paginated list, undici transport with PFX/PEM mTLS, OAuth2 token cache (single-flight + proactive expiry), idempotent retries, timeouts/`AbortSignal`, RFC 7807 error hierarchy, client-side validation, logger hook and a pluggable `fetch` adapter.                                                                                                                                           |
| Helpers               | `src/money.ts`, `src/txid.ts`               | Safe integer-cent conversions for the API's `"10.00"` decimal strings, and spec-conformant random txid generation (`[a-zA-Z0-9]{26,35}`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Mock Pix API          | `test/mock-server/`                         | HTTPS + mTLS server with locally generated CA/server/client certs (`node-forge`), OAuth2 client-credentials endpoint, in-memory state for every resource family (cob, cobv, lotecobv, loc, locrec, pix, devolucao, rec, solicrec, cobr, retentativa, webhooks, payload tokens), spec-schema-repaired responses, RFC 7807 errors with `violacoes`, and injectable 429/503/token faults with `Retry-After`.                                                                                                                                                                                                        |
| Test suite            | `test/`                                     | 487+ tests: engine units, spec-vs-generated coverage proofs (every path/operation/schema/request body/parameter/response/scope/example), ajv contract tests validating every request and response of every operation against the OpenAPI schemas (including decoded `application/jose` payloads), constraint-type enforcement with valid + invalid vectors, errata behaviour, generator guard rails (drift fails loudly), pagination/payload/resource units, mTLS + OAuth + fault-injection integration against the mock server, and an end-to-end `spec:fetch` integration test. Coverage ≥ 90% lines enforced. |
| CI                    | `.github/workflows/ci.yml`                  | Node 20/22/24 × Ubuntu/Windows: fetch pinned spec → format → lint → typecheck → build → test with coverage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

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
src/money.ts, src/txid.ts  # money + txid helpers
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
npm run typecheck      # tsc --noEmit (strict)
npm run build          # tsup → dist/ (ESM + CJS + d.ts)
```

This package is **not published** to npm. License: MIT — Hadagalberto Junior.
