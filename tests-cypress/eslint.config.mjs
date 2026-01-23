// @ts-check

import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import mocha from "eslint-plugin-mocha";

import rootConfig from "../eslint.config.mjs";

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
      "mocha/no-exclusive-tests": "error", // Prevent .only/.skip in specs
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
