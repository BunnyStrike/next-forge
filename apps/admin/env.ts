import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Show warnings for missing environment variables
if (!process.env.NEXT_PUBLIC_WEB_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_WEB_URL not set. Web functionality may not work.')
if (!process.env.NEXT_PUBLIC_API_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_API_URL not set. API access may be limited.')
if (!process.env.NEXT_PUBLIC_DOCS_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_DOCS_URL not set. Documentation links may be broken.')

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    VERCEL: z.string().optional(),
    ANALYZE: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_WEB_URL: z.string().url().optional(),
    NEXT_PUBLIC_DOCS_URL: z.string().url().optional(),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    ANALYZE: process.env.ANALYZE,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
}) 