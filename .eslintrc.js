module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  settings: {
    react: {
      version: 'detect', 
    },
  },
  rules: {
    indent: [2, 2],
    quotes: [2, 'single'],
    semi: [2, 'always'],
    'linebreak-style': [2, 'windows'],
    'react/prop-types': [0],
    'no-unused-vars': [1], 
  },
};