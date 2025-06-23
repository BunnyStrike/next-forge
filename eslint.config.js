import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        Liveblocks: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Disable semicolon requirement to match Prettier config
      semi: ['error', 'never'],
      // Prefer single quotes to match Prettier
      quotes: ['error', 'single'],
      // Allow unused vars with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Disable rules that conflict with Prettier
      'max-len': 'off',
      'object-curly-spacing': 'off',
      'comma-dangle': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      '.vercel/**',
      '.turbo/**',
      'packages/design-system/components/ui/**',
      'packages/design-system/lib/**',
      'packages/design-system/hooks/**',
      'packages/collaboration/config.ts',
      'apps/docs/**/*.json',
      'apps/email/.react-email/**',
    ],
  },
]
