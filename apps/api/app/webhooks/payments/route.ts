import { env } from '@/env'
import { analytics } from '@repo/analytics/posthog/server'
import { database } from '@repo/database'
import { parseError } from '@repo/observability/error'
import { log } from '@repo/observability/log'
import { stripe } from '@repo/payments'
import type { Stripe } from '@repo/payments'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const getUserFromCustomerId = async (customerId: string) => {
  // Find user by stripe customer ID in the database
  const customer = await database.customer.findUnique({
    where: { 
      id: customerId 
    },
    include: {
      user: true
    }
  })

  return customer?.user || null
}

const handleCheckoutSessionCompleted = async (
  data: Stripe.Checkout.Session
) => {
  if (!data.customer) {
    return
  }

  const customerId =
    typeof data.customer === 'string' ? data.customer : data.customer.id
  const user = await getUserFromCustomerId(customerId)

  if (!user) {
    return
  }

  analytics.capture({
    event: 'User Subscribed',
    distinctId: user.id,
  })
}

const handleSubscriptionScheduleCanceled = async (
  data: Stripe.SubscriptionSchedule
) => {
  if (!data.customer) {
    return
  }

  const customerId =
    typeof data.customer === 'string' ? data.customer : data.customer.id
  const user = await getUserFromCustomerId(customerId)

  if (!user) {
    return
  }

  analytics.capture({
    event: 'User Unsubscribed',
    distinctId: user.id,
  })
}

export const POST = async (request: NextRequest) => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Not configured', ok: false })
  }

  try {
    const body = await request.json()
    
    const users = await database.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
      take: 10,
    })

    console.log('Payment webhook received:', body)
    console.log('Available users:', users.length)

    const headerPayload = await headers()
    const signature = headerPayload.get('stripe-signature')

    if (!signature) {
      throw new Error('missing stripe-signature header')
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(event.data.object)
        break
      }
      case 'subscription_schedule.canceled': {
        await handleSubscriptionScheduleCanceled(event.data.object)
        break
      }
      default: {
        log.warn(`Unhandled event type ${event.type}`)
      }
    }

    await analytics.shutdown()

    return NextResponse.json({ result: event, ok: true })
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
