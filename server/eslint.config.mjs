// @ts-check

import rootConfig from "../eslint.config.mjs";

// Override the tsconfigRootDir and project to point to this directory
export default rootConfig.map((config) => {
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
