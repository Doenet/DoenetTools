// @ts-check

import tseslint from "typescript-eslint";
import { createBaseConfig, reactConfig } from "@doenet-tools/eslint-config";

export default tseslint.config(
  ...createBaseConfig(import.meta.dirname),
  ...reactConfig,
  {
    // Vendor files are copied from node_modules for runtime use, so they
    // should not be linted as part of the app source tree.
    ignores: ["public/vendor/**"],
  },
  {
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "react/no-unescaped-entities": "off", // Allow apostrophes and quotes in text
    },
  },
);
