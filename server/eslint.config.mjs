import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["dist/"] },
  { languageOptions: { globals: { ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
