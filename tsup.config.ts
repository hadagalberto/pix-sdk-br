import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node20",
  outExtension: (context) => ({ js: context.format === "cjs" ? ".cjs" : ".js" }),
});
