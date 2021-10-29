module.exports = {
  rules: {
    "linebreak-style": [2, "unix"],
    semi: [2, "always"],
    "linebreak-style": [2, "unix"],
    "react/prop-types": [0],
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  parserOptions: {},
  plugins: ["react"],
};
