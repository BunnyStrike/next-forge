import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const keys = () => {
  if (!process.env.RESEND_FROM) {
    console.warn('⚠️  Warning: RESEND_FROM is not set. Email functionality will be disabled.')
  }
  if (!process.env.RESEND_TOKEN) {
    console.warn('⚠️  Warning: RESEND_TOKEN is not set. Email functionality will be disabled.')
  }
  
  return createEnv({
    server: {
      RESEND_FROM: z.string().email().optional(),
      RESEND_TOKEN: z.string().startsWith('re_').optional(),
    },
    runtimeEnv: {
      RESEND_FROM: process.env.RESEND_FROM,
      RESEND_TOKEN: process.env.RESEND_TOKEN,
    },
  })
}
