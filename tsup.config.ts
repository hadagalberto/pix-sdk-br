import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "webhooks/node": "src/webhooks/node.ts",
    "webhooks/express": "src/webhooks/express.ts",
    "webhooks/fastify": "src/webhooks/fastify.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node20",
  outExtension: (context) => ({ js: context.format === "cjs" ? ".cjs" : ".js" }),
});
