// eslint.config.js
import js from "@eslint/js";

export default [
  {
    ignores: [
      "**/*.config.*",
      "node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "client/**",
      "keeviqo/**",
      "deployment/**",
      "coverage/**",
      "build/**",
      "public/**",
      "test/**",
      "jest.setup.js",
      "preview-server.js",
      "shared/**",
      "src/**",
      "server/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    rules: {}
  }
];

