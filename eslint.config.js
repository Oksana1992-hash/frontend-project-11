import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js: js,
      '@stylistic': stylistic,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      semi: ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
])