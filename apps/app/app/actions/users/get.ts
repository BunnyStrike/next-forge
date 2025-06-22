'use server'

import { database } from '@repo/database'
import { getCurrentUser } from '@repo/auth'

export const getUsers = async () => {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: 'Unauthorized',
      }
    }

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
