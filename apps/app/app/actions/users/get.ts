'use server'

import { database } from '@repo/database'
import { auth } from '@repo/auth/server'
import { headers } from 'next/headers'

export const getUsers = async () => {
  try {
    const user = await getUser()

    // Get all users (you may want to add pagination and filtering)
    const users = await database.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit results
    })

    return {
      data: users,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to get users',
    }
  }
}

export const getUser = async () => {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  return session.user
}
