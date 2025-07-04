import baseConfig from '@repo/design-system/tailwind.config'

export default {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/design-system/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/admin/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} 