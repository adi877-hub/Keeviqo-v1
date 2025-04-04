
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from "eslint/config";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
    }
  },
  { 
    files: ["**/*.{ts,tsx,jsx}"], 
    languageOptions: { 
      globals: {
        ...globals.browser, 
        ...globals.node,
        ...globals.jest
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'jest.config.js', 'jest.setup.js', 'babel.config.js', 'babel.config.cjs', 'postcss.config.js'],
  }
]);
