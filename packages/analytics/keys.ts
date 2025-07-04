import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const keys = () => {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn('⚠️  Warning: NEXT_PUBLIC_POSTHOG_KEY is not set. Analytics tracking will be disabled.')
  }
  if (!process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    console.warn('⚠️  Warning: NEXT_PUBLIC_POSTHOG_HOST is not set. Analytics tracking will be disabled.')
  }
  
  return createEnv({
    client: {
      NEXT_PUBLIC_POSTHOG_KEY: z.string().startsWith('phc_').optional(),
      NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
      NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith('G-').optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
  })
}
