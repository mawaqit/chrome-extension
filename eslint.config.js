import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";

export default [
  { files: ["./src/**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        chrome: "readonly",
      },
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["dist/*"],
  },
];
