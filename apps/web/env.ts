import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Core configuration
    ANALYZE: z.string().optional(),
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
    
    // Email configuration
    RESEND_FROM: z.string().email(),
    RESEND_TOKEN: z.string().startsWith('re_'),
    
    // Rate limiting configuration  
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    
    // Feature flags configuration
    FLAGS_SECRET: z.string(),
    
    // Security configuration
    ARCJET_KEY: z.string().startsWith('ajkey_'),
    
    // Vercel environment variables (optional)
    VERCEL: z.string().optional(),
    CI: z.string().optional(),
    VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_WEB_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_DOCS_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
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
