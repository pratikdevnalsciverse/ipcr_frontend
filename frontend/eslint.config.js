import js from '@eslint/js';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/wailsjs/**']
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        import: 'readonly',
        Promise: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    plugins: { 
      react,
      'react-hooks': hooks,
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'no-console': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'no-unused-vars': 'off', // Turn off default unused vars as typescript handles it or typescript-eslint handles it
      '@typescript-eslint/no-unused-vars': ['warn']
    }
  }
];
