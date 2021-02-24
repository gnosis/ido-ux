module.exports = {
  printWidth: 100,
  singleQuote: true,
  semi: false,
  bracketSpacing: true,
  trailingComma: "all",
  overrides: [
    {
      files: "*.sol",
      options: {
        bracketSpacing: false,
      },
    },
  ],
};
