import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@repo/ai',
    '@repo/database',
    '@repo/uploads'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
  },
}) 