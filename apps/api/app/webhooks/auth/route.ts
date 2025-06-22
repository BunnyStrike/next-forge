import { env } from '@/env'
import { analytics } from '@repo/analytics/posthog/server'
import { database } from '@repo/database'
import { parseError } from '@repo/observability/error'
import { log } from '@repo/observability/log'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Better Auth doesn't use webhooks in the same way as Clerk
// Authentication events are handled directly in the application
export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json()
    
    // Handle Better Auth events if needed
    // This could be custom events you want to track
    log.info('Auth event received:', body)

    // Example: Track authentication events in analytics
    if (body.type === 'user.created') {
      analytics.capture({
        event: 'User Signed Up',
        distinctId: body.user.id,
        properties: {
          email: body.user.email,
          provider: body.provider || 'email',
        },
      })
    } else if (body.type === 'user.signed_in') {
      analytics.capture({
        event: 'User Signed In',
        distinctId: body.user.id,
        properties: {
          email: body.user.email,
          provider: body.provider || 'email',
        },
      })
    }

    await analytics.shutdown()

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = parseError(error)
    log.error(message)

    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      { status: 500 }
    )
  }
}
