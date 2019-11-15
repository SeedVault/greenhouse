module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-underscore-dangle': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 9
  },
};
