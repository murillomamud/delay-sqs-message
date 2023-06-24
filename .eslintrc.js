module.exports = {
  plugins: [
      "@typescript-eslint",
      "jest"
  ],
  extends: [
      "airbnb-base",
      "airbnb-typescript/base",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:jest/recommended"
  ],
  env: {
      node: true,
      browser: false,
      jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
      project: "./tsconfig.test.json",
  },
  "overrides": [
      {
          "files": ["tests/**/*.test.ts"],
          "plugins": ["jest"],
          "rules": {
              "@typescript-eslint/no-unsafe-assignment": "off",
              "@typescript-eslint/no-unsafe-argument": "off",
              "@typescript-eslint/no-unsafe-call": "off",
              "@typescript-eslint/no-unsafe-member-access": "off",
              "@typescript-eslint/unbound-method": "off",
          }
      }
  ],
  rules: {
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",
  },
};