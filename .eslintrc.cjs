module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  ignorePatterns: ['dist', '.next', 'node_modules'],
  extends: [],
  rules: {}
};
