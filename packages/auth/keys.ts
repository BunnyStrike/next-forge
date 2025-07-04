import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const keys = () => {
  if (!process.env.BETTER_AUTH_SECRET) {
    console.warn('⚠️  Warning: BETTER_AUTH_SECRET is not set. This is required for authentication.')
  }
  
  return createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string().min(32).optional(),
      BETTER_AUTH_URL: z.string().url().optional(),
      GOOGLE_CLIENT_ID: z.string().optional(),
      GOOGLE_CLIENT_SECRET: z.string().optional(),
      GITHUB_CLIENT_ID: z.string().optional(),
      GITHUB_CLIENT_SECRET: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    },
  })
}
