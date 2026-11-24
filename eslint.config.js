'use strict';
/**
 * ESLint configuration. Running ESLint is the project's "compile" check: it
 * parses every source file and fails on syntax errors and undefined names.
 *
 * @author Moria El Akaya
 * AI assistance: drafted with Claude (Anthropic); reviewed by Moria El Akaya.
 */
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: { globals: { ...globals.jest } },
  },
];
