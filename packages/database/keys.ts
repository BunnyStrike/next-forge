import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const keys = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  Warning: DATABASE_URL is not set. Database functionality will be disabled.')
  }
  
  return createEnv({
    server: {
      DATABASE_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
  })
}
