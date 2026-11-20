import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**", "scripts/**"],
      // CLI entry points run as subprocesses in CI (and via the integration
      // test in test/fetch-spec.test.ts); they are not importable
      // instrumentation targets.
      exclude: ["scripts/fetch-spec.mjs"],
      thresholds: {
        lines: 90,
        statements: 90,
      },
    },
  },
});
