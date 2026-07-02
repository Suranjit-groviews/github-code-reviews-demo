// ESLint v9 "flat config". These are the code-quality rules the automatic review enforces.
// Run locally with:  npm run lint
import js from '@eslint/js';

export default [
  // Start from ESLint's recommended rule set.
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // A couple of extra rules so the demo has something opinionated to catch.
      'no-unused-vars': 'error',
      'no-console': 'warn',
      eqeqeq: 'error',
    },
  },

  {
    // Jest injects these globals into test files; tell ESLint they exist.
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
  },
];
