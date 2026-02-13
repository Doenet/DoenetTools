// @ts-check

import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import rootConfig from "../eslint.config.mjs";
import mocha from "eslint-plugin-mocha";

// Override the tsconfigRootDir and project to point to this directory
const configWithClientPaths = rootConfig.map((config) => {
  if (config.languageOptions?.parserOptions?.tsconfigRootDir) {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          ...config.languageOptions.parserOptions,
          tsconfigRootDir: import.meta.dirname,
          project: "./tsconfig.json",
        },
      },
    };
  }
  return config;
});

export default tseslint.config(
  ...configWithClientPaths,
  react.configs.flat.recommended,
  reactHooks.configs["recommended-latest"],
  {
    plugins: {
      mocha,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "@typescript-eslint/triple-slash-reference": "off",
      "mocha/no-exclusive-tests": "error", // Prevent .only in specs
      "react/no-unescaped-entities": "off", // Allow apostrophes and quotes in text
    },
  },

  // For now allow explicit anys
  // TODO: clean up explict anys and remove this exception
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
