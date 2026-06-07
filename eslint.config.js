import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['**/dist'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'react-hooks/exhaustive-deps': [
        'warn',
        { additionalHooks: '^useStateWithDeps|useIsomorphicLayoutEffect$' },
      ],
    },
  },
);
