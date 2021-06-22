module.exports = {
  printWidth: 100,
  singleQuote: true,
  semi: false,
  bracketSpacing: true,
  trailingComma: "all",
  endOfLine: "auto",
  overrides: [
    {
      files: "*.sol",
      options: {
        bracketSpacing: false,
      },
    },
  ],
};
