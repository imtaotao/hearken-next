const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module', 'require']

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
    // forbidden to use export default
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Forbidden to use export default.',
      },
    ],
    camelcase: 2,
    indent: [2, 2],
    semi: [2, 'never'],
    eqeqeq: [2, 'allow-null'],
    quotes: ['error', 'single'],
    'no-var': 2,
    'prefer-const': 2,
    'no-use-before-define': 2,
    'func-style': [0, 'declaration'],
    'comma-dangle': ['error', 'always-multiline'],
    'multiline-ternary': ['error', 'always-multiline'],
    'array-element-newline': ['error', { minItems: 4 }],
    // object line break
    'object-curly-newline': [
      'error',
      {
        ObjectPattern: { multiline: true, minProperties: 2 },
        ObjectExpression: { multiline: true, minProperties: 2 },
      },
    ],
  },
  overrides: [
    {
      files: [
        'static/*',
        'scripts/*',
        '.eslintrc.js',
        'jest.config.js',
        '**/__tests__/**',
        './babel.config.js',
      ],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['.eslintrc.js'],
      rules: {
        'array-element-newline': ['error', 'consistent'],
        'object-curly-newline': ['error', { consistent: true }],
      },
    },
  ],
}
