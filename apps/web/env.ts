import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Show warnings for missing environment variables
if (!process.env.RESEND_FROM) console.warn('⚠️  Warning: RESEND_FROM not set. Email sending may be disabled.')
if (!process.env.RESEND_TOKEN) console.warn('⚠️  Warning: RESEND_TOKEN not set. Email functionality may be disabled.')
if (!process.env.UPSTASH_REDIS_REST_URL) console.warn('⚠️  Warning: UPSTASH_REDIS_REST_URL not set. Rate limiting may not work.')
if (!process.env.UPSTASH_REDIS_REST_TOKEN) console.warn('⚠️  Warning: UPSTASH_REDIS_REST_TOKEN not set. Rate limiting may not work.')
if (!process.env.FLAGS_SECRET) console.warn('⚠️  Warning: FLAGS_SECRET not set. Feature flags may not work.')
if (!process.env.ARCJET_KEY) console.warn('⚠️  Warning: ARCJET_KEY not set. Security may be compromised.')
if (!process.env.NEXT_PUBLIC_APP_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_APP_URL not set. App may not function as expected.')
if (!process.env.NEXT_PUBLIC_WEB_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_WEB_URL not set. Web may not work properly.')
if (!process.env.NEXT_PUBLIC_API_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_API_URL not set. API access may be limited.')
if (!process.env.NEXT_PUBLIC_DOCS_URL) console.warn('⚠️  Warning: NEXT_PUBLIC_DOCS_URL not set. Documentation links may be broken.')
if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) console.warn('⚠️  Warning: NEXT_PUBLIC_POSTHOG_KEY not set. Analytics tracking may be disabled.')
if (!process.env.NEXT_PUBLIC_POSTHOG_HOST) console.warn('⚠️  Warning: NEXT_PUBLIC_POSTHOG_HOST not set. Analytics may not function.')

export const env = createEnv({
  server: {
    // Core configuration
    ANALYZE: z.string().optional(),
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
    
    // Email configuration
    RESEND_FROM: z.string().email().optional(),
    RESEND_TOKEN: z.string().startsWith('re_').optional(),
    
    // Rate limiting configuration  
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    
    // Feature flags configuration
    FLAGS_SECRET: z.string().optional(),
    
    // Security configuration
    ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
    
    // Vercel environment variables (optional)
    VERCEL: z.string().optional(),
    CI: z.string().optional(),
    VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_WEB_URL: z.string().url().optional(),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
    NEXT_PUBLIC_DOCS_URL: z.string().url().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  },
  runtimeEnv: {
    // Core
    ANALYZE: process.env.ANALYZE,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    
    // Email
    RESEND_FROM: process.env.RESEND_FROM,
    RESEND_TOKEN: process.env.RESEND_TOKEN,
    
    // Rate limiting
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    
    // Feature flags
    FLAGS_SECRET: process.env.FLAGS_SECRET,
    
    // Security
    ARCJET_KEY: process.env.ARCJET_KEY,
    
    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    
    // Vercel (optional)
    VERCEL: process.env.VERCEL,
    CI: process.env.CI,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  },
})
