module.exports = {
    rules: {
        indent: [
            2,
            2
        ],
        quotes: [
            2,
            'single'
        ],
        'linebreak-style': [
            2,
            'unix'
        ],
        semi: [
            2,
            'always'
        ],
        'react/prop-types': [0]
    },
    env: {
        es6: true,
        node: true,
        browser: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    ecmaFeatures: {
        modules: true,
        jsx: true,
        experimentalObjectRestSpread: true,
        modules: true
    },
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      }
    },
    plugins: [
        'react'
    ]
};
