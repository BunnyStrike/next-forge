import { config, withConfig } from '@repo/next-config'
import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = withConfig({
  ...config,
  output: 'export',
  trailingSlash: true,
  images: {
    ...config.images,
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
})

export default nextConfig
