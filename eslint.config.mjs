// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  // Global ignores
  { ignores: ["dist/"] },

  // Base ESLint rules for all files
  eslint.configs.recommended,

  // Config for .mjs files (like this one) - no project needed
  {
    files: ["*.config.mjs", "*.config.js"],
    languageOptions: {
      parserOptions: {
        // Don't use project for config files to avoid circular dependency
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // TypeScript configuration for source files
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",

      // Allow unused vars that start with underscore
      // See https://typescript-eslint.io/rules/no-unused-vars/
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
