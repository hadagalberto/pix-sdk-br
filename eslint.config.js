import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "spec/**", ".test-tmp/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // CLI tooling prints to stdout/stderr; libraries never do.
      "no-console": "error",
      // The destructure-and-rest omission pattern is used to drop keys safely.
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
      // The generator builds TypeScript source text: interpolating checked
      // numbers/booleans into template literals is its core job.
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
    },
  },
  {
    // The code generator works with fail-loud invariants (explicit length and
    // presence checks right before the assertions); non-null assertions after
    // such guards are idiomatic there. Everything else stays assertion-free.
    files: ["scripts/**/*.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    // Plain-JS/ESM tool scripts (JSDoc-typed, Node globals) and config files.
    files: ["**/*.mjs", "**/*.js"],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      // Node's fetch/Buffer/console are runtime globals in these scripts.
      "no-undef": "off",
      "no-console": "off",
    },
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      // Test scaffolding prints diagnostics on failure by design.
      "no-console": "off",
    },
  },
);
