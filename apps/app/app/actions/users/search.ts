'use server'

import { database } from '@repo/database'
import { getCurrentUser } from '@repo/auth'

type SearchUsersInput = {
  query: string
  organizationId?: string
}

export const searchUsers = async (input: SearchUsersInput) => {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: 'Unauthorized',
      }
    }

    // Search for users by email or name
    const users = await database.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
      take: 10,
    })

    return {
      data: users,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to search users',
    }
  }
}
