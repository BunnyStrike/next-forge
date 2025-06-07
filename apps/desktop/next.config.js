const { createConfig } = require('@repo/next-config')

/** @type {import('next').NextConfig} */
const nextConfig = createConfig({
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
})

module.exports = nextConfig
