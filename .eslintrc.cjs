module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
      'airbnb',
      // 'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
   ],
   ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaFeatures: {
         jsx: true,
      },
      project: './tsconfig.json',
      ecmaVersion: 'latest',
      sourceType: 'module',
      version: 'detect',
   },
   plugins: ['react-refresh', 'react', 'import', 'jsx-a11y'],
   rules: {
      'react/jsx-no-target-blank': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
      'react/prop-types': 0,
      'prettier/prettier': 'error',
      'linebreak-style': [0, 'unix'],
      'import/order': [
         2,
         {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
         },
      ],
      'import/extensions': [
         'error',
         'ignorePackages',
         {
            ts: 'never',
            tsx: 'never',
         },
      ],

      'import/no-unresolved': ['error', { ignore: ['\\.svg\\?react$'] }],
      'react/jsx-props-no-spreading': 'off', // Правило удаляет ошибку распостранения пропсов
      'jsx-a11y/label-has-associated-control': 'off', // Потом убрать ругается что Input не привязан к label, хотя все привязано
      'no-param-reassign': 'off', // Отключить если не использую rtk (в rtk используется immer, можно мутировать state)
   },
   settings: {
      'import/resolver': {
         alias: {
            map: [
               ['components', './src/components'],
               ['img', './src/img'],
            ],
            extensions: ['.ts', '.js', '.jsx', '.tsx'],
         },
      },
   },
};
