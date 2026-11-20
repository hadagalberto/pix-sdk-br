# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/). The package is **not published**.

## [Unreleased]

### Fixed

- Re-verification findings: every path parameter is now checked to be a single safe URL segment before
  interpolation, so traversal values such as `1/../../x` are rejected locally instead of being sent to
  the PSP. The `/loc/{id}` and `/locrec/{id}` path params are validated as decimal int64 (erratum
  `location-path-id-int64`, backed by `PayloadLocationId`/`PayloadLocationRecId`).
- `generateBrCode` now defaults dynamic (URL) locations to Point of Initiation Method `01 = 12`
  (single use) per the BCB "Manual de Padrões para Iniciação do Pix", with an explicit caller override
  still honoured; static Pix keys remain unchanged.

## [0.1.0] - 2026-11-20

### Added

- **Milestone 1 — spec pipeline and code generation.** Checksum-verified fetch of the pinned BCB
  `bacen/pix-api` OpenAPI, fail-loud generator (types, validators, operations, examples, ajv
  contracts, scopes, provenance) with documented errata and drift detection.
- **Milestone 2 — core client.** `PixClient` with all spec resource namespaces and `listAll`
  iterators, undici transport with PFX/PEM mTLS, OAuth2 client-credentials token cache with
  single-flight refresh, idempotent retries with backoff/jitter/`Retry-After`, timeouts and
  `AbortSignal`, RFC 7807 error hierarchy, client-side validation and pluggable `fetch`.
- **Milestone 3 — stateful mock and contract tests.** Local HTTPS + mTLS mock Pix API with generated
  certificates, OAuth endpoint, in-memory state for every resource family and injectable faults;
  ajv contract tests covering every operation's requests and responses.
- **Milestone 4 — webhooks, signed payloads and BR Code.** Discriminated webhook parser, Node/Express/
  Fastify adapters with PSP path-suffix handling, JWS verification (RS256/ES256/PS256, `x5u`/`jku`/
  `x5c`, chain/validity/hostname) and BR Code generation with CRC16/CCITT-FALSE.
- **Milestone 5 — PSP presets, examples and documentation.** Evidence-backed presets for Efí and
  Inter (official documentation URLs and verification date in code), manual-configuration guidance
  for Sicoob, Banco do Brasil, Itaú, Santander and Sicredi, runnable examples under `examples/`
  type-checked in CI, complete `README.md` / `README.pt-BR.md`, this changelog and `CONTRIBUTING.md`.

### Notes

- No published npm release is planned; install from the repository or a local build.
- 665 tests pass locally with ≥ 90% line coverage enforced in CI.
