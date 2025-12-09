import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['src/env.d.ts'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React rules
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,

            // Accessibility rules
            ...jsxA11y.configs.recommended.rules,

            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/triple-slash-reference': 'off',

            // General rules
            'no-console': ['warn', { allow: ['error', 'warn'] }],
            'prefer-const': 'error',

            // Allow click-to-dismiss pattern on modal backdrops and content
            // (common UX pattern for modal overlays)
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/no-noninteractive-element-interactions': 'warn',

            // Disable prop-types since we use TypeScript for type checking
            'react/prop-types': 'off',
        },
    },
    {
        ignores: ['node_modules/', 'dist/', '.astro/', '*.config.*', 'src/env.d.ts'],
    }
);
