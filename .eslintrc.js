const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module', 'require']

// eslint-disable-next-line no-restricted-globals
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': [
      'error',
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: '.*', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    // most of the codebase are expected to be env agnostic
    'no-restricted-globals': ['error', ...DOMGlobals, ...NodeGlobals],
    // since we target ES2015 for baseline support, we need to forbid object
    // rest spread usage (both assign and destructure)
    'no-restricted-syntax': [
      'error',
      'ObjectExpression > SpreadElement',
      'ObjectPattern > RestElement',
    ],
    'no-var': 2,
    'camelcase': 2,
    'prefer-const': 2,
    'indent': [2, 2],
    'semi': [2, 'never'],
    'no-use-before-define': 2,
    'newline-before-return': 2,
    'eqeqeq': [2, 'allow-null'],
    'quotes': ['error', 'single'],
    'func-style': [0, 'declaration'],
    'comma-dangle': ['error', 'always-multiline'],
  },
  overrides: [
    // tests, no restrictions (runs in Node / jest with jsdom)
    {
      files: ['test/*'],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
      },
    },
    // build script
    {
      files: ['script/*'],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
}
