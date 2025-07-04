import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const keys = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  Warning: STRIPE_SECRET_KEY is not set. Payment functionality will be disabled.')
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️  Warning: STRIPE_WEBHOOK_SECRET is not set. Webhook functionality will be disabled.')
  }
  
  return createEnv({
    server: {
      STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
      STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
    },
    runtimeEnv: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    },
  })
}
