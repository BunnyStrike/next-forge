import withBundleAnalyzer from '@next/bundle-analyzer'
import { keys } from './keys'

// @ts-expect-error No declaration file
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import type { NextConfig } from 'next'

const otelRegex = /@opentelemetry\/instrumentation/

const env = keys()

export const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
    ],
  },

  // biome-ignore lint/suspicious/useAwait: rewrites is async
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ]
  },

  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins = config.plugins || []
      config.plugins.push(new PrismaPlugin())
    }

    config.ignoreWarnings = [{ module: otelRegex }]

    return config
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig)

export const withConfig = (config: import('next').NextConfig) => ({
  ...config,
  images: {
    ...config.images,
    ...config.images,
  },
})
