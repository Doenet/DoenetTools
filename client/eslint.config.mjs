// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["dist/"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs["recommended-latest"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
    },
  },
  //For now, allow explicit anys
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // eslint-plugin-unused-imports allows linter to fix unused imports
  // It works by splitting the normal "unused-imports" rule into tw
  {
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
