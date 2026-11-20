/**
 * Integration test for `npm run spec:fetch` (scripts/fetch-spec.mjs): the CLI
 * must fetch the pinned spec and verify its sha256 end-to-end.
 *
 * The script runs as a subprocess (like CI does), so it is excluded from
 * in-process coverage instrumentation — this test is its behavioural coverage.
 */

import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { readSpecLock } from "./helpers.js";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("scripts/fetch-spec.mjs (npm run spec:fetch)", () => {
  it("verifies the pinned spec and prints the pinned checksum", async () => {
    const { stdout } = await execFileAsync(process.execPath, ["scripts/fetch-spec.mjs"], {
      cwd: repoRoot,
    });
    const lock = await readSpecLock();
    expect(stdout).toContain(lock.sha256);
    expect(stdout).toContain(lock.specVersion);
    expect(stdout).toContain(lock.pinnedCommit);
    expect(stdout).toContain("spec");
  }, 60_000);
});
