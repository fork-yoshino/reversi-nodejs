module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    // ecmaVersion: 'latest',
    // sourceType: 'module'
    project: './tsconfig.json',
  },
  rules: {
    // import文の自動整列
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    // the rest
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/dot-notation': 'off',
  },
};
