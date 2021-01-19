module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "prettier/react",
  ],
  rules: {
    "linebreak-style": ["error", "unix"],
    "react/prop-types": "off",
    "no-console": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      { additionalHooks: "useRecoilCallback" },
    ],
  },
  plugins: ["react", "import", "jsx-a11y", "react-hooks"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
