import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,mjs,jsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },
  {
    ...js.configs.recommended,
    files: ["src/browser/**/*.js"],
    languageOptions: { sourceType: "script" },
  },
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  skipFormatting,
]
