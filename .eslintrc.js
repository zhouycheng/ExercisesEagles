module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  globals: {
    App: 'readonly',
    Behavior: 'readonly',
    Component: 'readonly',
    Page: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    wx: 'readonly'
  },
  extends: ['eslint:recommended'],
  rules: {
    semi: ['error', 'never'],
    'no-console': 'off'
  }
}
