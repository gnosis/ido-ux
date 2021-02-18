module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: ['node_modules/**/*'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'sort-destructure-keys',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    semi: ['error', 'never'],
    'no-warning-comments': 'warn',
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': [
      'error',
      { optionalDependencies: false, peerDependencies: false },
    ],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        pathGroups: [
          { group: 'builtin', pattern: 'react', position: 'before' },
          {
            group: 'external',
            pattern:
              '{lodash.debounce,lodash.uniqby,react-router,lodash.clonedeep,moment,apollo-link-retry,apollo-cache-inmemory,apollo-client,apollo-link,apollo-link-http,apollo-link-logger,apollo-link-ws,apollo-utilities,lodash.orderby,react-blockies,lodash.uniqby,@realitio/realitio-lib/formatters/question,@realitio/realitio-lib/formatters/template,@gnosis.pm/conditional-tokens-contracts/utils/id-helpers,@walletconnect/web3-provide,web3modal,polished,react-modal,big-number-input,react-dom/test-utils,@apollo/react-hooks,@react-hook/debounce,react-data-table-component,@apollo/react-testing,@testing-library/dom,@testing-library/user-event,@testing-library/react,react-hook-form,styled-components,ethers/utils,react-dom,react-router-dom,logdown,ethers,ethers/providers,moment-timezone,web3-utils,graphql-tag}',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'import/prefer-default-export': 0,
    'sort-destructure-keys/sort-destructure-keys': 2,
    'react/jsx-label-has-associated-control': 0,
    'react/jsx-sort-props': 2,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
