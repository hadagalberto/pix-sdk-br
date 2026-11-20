# Contributing

Obrigado por contribuir. This project mirrors the official BCB Pix API contract, so correctness is
verified against generated artifacts and a local mock — never against a real PSP in tests.

## Setup

Requirements: Node.js ≥ 20 and npm.

```bash
git clone https://github.com/hadagalberto-junior/pix-sdk-br.git
cd pix-sdk-br
npm install
npm run spec:fetch       # downloads the pinned spec and verifies its SHA-256
npm run generate         # regenerates src/generated (fails loudly on spec drift)
```

## Before opening a pull request

Run the full local gate; CI runs the same steps on Node 20/22/24 across Ubuntu and Windows:

```bash
npm run format           # prettier
npm run lint             # eslint strict, zero warnings
npm run typecheck        # src, scripts, tests, examples
npm run typecheck:examples
npm run build            # tsup → ESM + CJS + d.ts
npm run test:coverage    # all tests, ≥ 90% line coverage
npm run ci:all           # everything above, including spec:fetch
```

`spec/openapi.yaml` is intentionally gitignored. Commit generated code under `src/generated/`; a
test checks it is byte-identical to a fresh generation. If generation fails an errata assertion,
the upstream spec drifted — update `scripts/generator/errata.ts` with evidence, do not silence it.

## Ground rules

- **No stubs, TODOs, `NotImplementedException`, or skipped/placeholder tests.** Tests must assert
  real behaviour with known-valid and known-invalid vectors. If a test fails, fix the root cause;
  never weaken or delete a test to make it pass.
- Implement exactly what the pinned spec defines. Do not add invented endpoints, fields, or
  validations beyond it; document errata instead.
- Keep runtime dependencies minimal. New peers must be optional and documented.
- Never call real PSP production endpoints. Network use is limited to the pinned spec and PSP
  official documentation. Never run `git push`, `gh`, `npm publish`, or any publishing command.

## Adding a PSP preset

A preset is allowed **only** when the PSP's official public developer documentation states:

1. the production base URL,
2. the sandbox/homologação base URL, and
3. the OAuth token URL for **both** environments.

Then, in `src/presets.ts`:

- add the `PspId` member and a fully documented preset with `baseUrl`/`tokenUrl` per environment;
- cite the exact official source URL(s) in the preset's TSDoc and `sources` field, and set
  `verifiedOn` to `YYYY-MM-DD` (the day you checked);
- include only scopes explicitly listed by that documentation;
- add known-valid vectors to `test/presets.test.ts`, and remove the PSP from `UNCONFIRMED_PSPS`;
- update the presets table in `README.md` and `README.pt-BR.md`.

If any of the three values cannot be confirmed publicly, do **not** add a preset. Document the
official portal and the exact missing information in `UNCONFIRMED_PSPS` and show manual
configuration with `baseUrl` + `oauth.tokenUrl` instead. Never copy endpoints from another SDK,
a forum, or a package registry.

## Adding examples

Place standalone programs in `examples/`. They are type-checked by `npm run typecheck:examples` and
in CI; keep them free of network calls during CI (no top-level side effects beyond parsing env vars
and defining the client). Use relative imports from `../src/index.js` so type-checking works before
`npm run build`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`,
`chore:`, `refactor:`, etc. Keep each milestone's work atomic and commit locally — the project does
not publish or push from automation.

## Code of conduct

Be respectful and technical. Report bugs with a minimal reproduction, the PSP/preset involved (if
any), the pinned spec version and the failing test or contract.
