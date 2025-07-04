import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  sourcemap: false,
  minify: false,
  dts: true,
  format: ['cjs', 'esm'],
  external: [
    'react',
    'react-dom',
    'next',
    'next/link',
    'next/navigation',
    'next/router'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"'
    }
  }
})
