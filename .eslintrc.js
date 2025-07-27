module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'playwright'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'playwright/missing-playwright-await': 'error',
    'playwright/no-page-pause': 'warn',
    'playwright/no-element-handle': 'warn',
    'playwright/prefer-web-first-assertions': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'test-results/',
    'playwright-report/',
    'coverage/',
  ],
};