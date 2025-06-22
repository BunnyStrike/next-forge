import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Custom CMS environment variables placeholder
// Add your own CMS environment variables here
export const keys = () =>
  createEnv({
    server: {
      // Add your custom CMS environment variables here
      // Example: CUSTOM_CMS_API_KEY: z.string().optional(),
    },
    client: {
      // Add your custom CMS client environment variables here
      // Example: NEXT_PUBLIC_CUSTOM_CMS_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      // Add your runtime environment variables here
      // Example: CUSTOM_CMS_API_KEY: process.env.CUSTOM_CMS_API_KEY,
    },
  })
