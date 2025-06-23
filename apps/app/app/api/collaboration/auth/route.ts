import { auth } from '@repo/auth/server'
import { env } from '@/env'
import { headers } from 'next/headers'

const COLORS = [
  'var(--color-red-500)',
  'var(--color-orange-500)',
  'var(--color-amber-500)',
  'var(--color-yellow-500)',
  'var(--color-lime-500)',
  'var(--color-green-500)',
  'var(--color-emerald-500)',
  'var(--color-teal-500)',
  'var(--color-cyan-500)',
  'var(--color-sky-500)',
  'var(--color-blue-500)',
  'var(--color-indigo-500)',
  'var(--color-violet-500)',
  'var(--color-purple-500)',
  'var(--color-fuchsia-500)',
  'var(--color-pink-500)',
  'var(--color-rose-500)',
]

export async function POST() {
  if (!env.LIVEBLOCKS_SECRET) {
    return new Response('Liveblocks secret key not configured', {
      status: 500,
    })
  }

  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const response = await fetch('https://liveblocks.io/api/v1/authorize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.LIVEBLOCKS_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: session.user.id,
      groupIds: [], // Add appropriate group IDs if needed
    }),
  })

  return new Response(await response.text(), {
    status: response.status,
  })
}
