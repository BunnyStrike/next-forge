'use server'

import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { headers } from 'next/headers'

export const searchUsers = async (query: string) => {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!query || query.length < 2) {
    return []
  }

  const users = await database.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
      NOT: {
        id: session.user.id,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    take: 10,
  })

  return users
}
