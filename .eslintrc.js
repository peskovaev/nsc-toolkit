module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended',  'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint',  'prettier'],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
  },
  env: {
    node: true,
    es2021: true,
  },

  rules: {
    '@typescript-eslint/no-this-alias': [1],
    'function-paren-newline': 0,
    '@typescript-eslint/semi': [0],
    '@typescript-eslint/no-namespace': [0],
    '@typescript-eslint/no-non-null-asserted-optional-chain': [0],
    '@typescript-eslint/no-explicit-any': [0],
    '@typescript-eslint/no-unused-vars': [1],
    'no-unused-vars': [0],
    semi: 'off',
    'comma-dangle': [0, 'always-multiline'],
    'spaced-comment': 0,
    'no-extra-semi': [2],
    'react/prop-types': 0,
    'no-extra-boolean-cast': 0,
    'quote-props': 0,
    'object-curly-spacing': ['error', 'always'],
    camelcase: 0,
    'no-nested-ternary': 0,
    'no-constant-condition': 0,
    'no-useless-escape': 0,
    'no-async-promise-executor': [0],
    'prefer-rest-params': 0,
    'no-inner-declarations': 0,
    'react/jsx-wrap-multilines': 0,
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    'no-unused-expressions': 0,
    'global-require': 0,
    'max-len': 0,
    'import/no-cycle': 0,
    'no-underscore-dangle': 0,
    'no-return-assign': 0,
    'import/prefer-default-export': 0,
    'jsx-quotes': ['error', 'prefer-double'],
    'arrow-parens': 0,
    'eol-last': 0,
    'consistent-return': 0,
    'no-console': [0],
    'no-angle-bracket-type-assertion': [0],
    'ordered-imports': [0],
    'object-literal-sort-keys': [0],
    'no-string-literal': [0],
    eofline: [0],
    'only-arrow-functions': [0],
    forin: [0],
    'no-big-function': [0],
    'cognitive-complexity': [0],
    'member-ordering': [
      0,
      {
        order: 'fields-first',
      },
    ],
    'no-shadowed-variable': [0],
    'no-unused-expression': [0],
    'object-shorthand': [
      'error',
      'always',
      {
        avoidQuotes: true,
      },
    ],
    'no-reference': [0],
    'trailing-comma': [
      0,
      {
        multiline: {
          objects: 'always',
          arrays: 'always',
          functions: 'always',
          typeLiterals: 'ignore',
          imports: 'ignore',
          exports: 'ignore',
        },
        singleline: 'never',
        esSpecCompliant: true,
      },
    ],
    // Ширяев исправит )
    'no-prototype-builtins': [1],
    '@typescript-eslint/no-non-null-assertion': [1],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', './packages'],
      },
    },
  },
};
