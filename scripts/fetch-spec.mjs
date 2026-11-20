#!/usr/bin/env node
/**
 * Fetches the pinned BCB "API Pix" OpenAPI specification and verifies its SHA-256 checksum.
 *
 * The spec file (spec/openapi.yaml) is intentionally gitignored: the upstream
 * repository (bacen/pix-api) does not ship a license file, so we do not commit
 * its contents. Instead:
 *
 *   - `spec/spec.lock.json` pins the exact upstream commit and the expected
 *     SHA-256 of the spec file;
 *   - `npm run spec:fetch` (this script) downloads the pinned file and fails
 *     loudly if the checksum does not match, so CI can detect upstream drift;
 *   - generated code derived from the spec is committed under `src/generated/`.
 *
 * Network use is limited to the pinned raw.githubusercontent.com URL.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = resolve(repoRoot, "spec", "spec.lock.json");
const specPath = resolve(repoRoot, "spec", "openapi.yaml");

/** @param {Buffer} buffer */
function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function readLock() {
  const raw = await readFile(lockPath, "utf8");
  const lock = JSON.parse(raw);
  if (typeof lock.source !== "string" || typeof lock.sha256 !== "string") {
    throw new Error("spec/spec.lock.json must contain 'source' and 'sha256' entries.");
  }
  return lock;
}

async function readLocalSpec() {
  try {
    return await readFile(specPath);
  } catch {
    return null;
  }
}

async function fetchPinned(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Failed to fetch spec (HTTP ${response.status}): ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

const lock = await readLock();
const expected = lock.sha256.toLowerCase();
let buffer = await fetchPinned(lock.source);
let downloaded = true;

const downloadedHash = sha256(buffer);
if (downloadedHash !== expected) {
  const local = await readLocalSpec();
  if (local !== null && sha256(local) === expected) {
    // The upstream fetch drifted from the pinned checksum, but a previously
    // verified copy of the pinned file is already present locally. Keep it.
    console.warn(
      `warning: fetched spec (${downloadedHash}) does not match the pinned ` +
        `checksum; keeping the locally verified copy.`,
    );
    buffer = local;
    downloaded = false;
  } else {
    throw new Error(
      `Spec checksum mismatch.\n` +
        `  expected (pinned): ${expected}\n` +
        `  received:          ${downloadedHash}\n` +
        `The upstream file changed or the network response was tampered with. ` +
        `If the pin is being upgraded on purpose, update spec/spec.lock.json ` +
        `and regenerate with \`npm run generate\`.`,
    );
  }
}

const local = await readLocalSpec();
const unchanged = local !== null && sha256(local) === expected;

if (!unchanged) {
  await mkdir(dirname(specPath), { recursive: true });
  await writeFile(specPath, buffer);
}

const status = unchanged
  ? "spec already up to date"
  : downloaded
    ? "spec fetched and verified"
    : "restored previously verified local copy";

console.log(
  `${status}: sha256=${expected} (version ${lock.specVersion ?? "?"}, commit ${lock.pinnedCommit ?? "?"})`,
);
