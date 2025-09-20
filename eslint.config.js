import js from '@eslint/js';
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['**/dist'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  eslintConfigPrettierFlat,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'react-hooks/exhaustive-deps': [
        'warn',
        { additionalHooks: '^useStateWithDeps$' },
      ],
    },
  },
);
