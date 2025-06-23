'use server'

import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { captureException } from '@repo/observability'
import { headers } from 'next/headers'
import type {
  ApiResult,
  PageInfo,
  UserInfo,
  OrganizationInfo,
} from './types.js'

export async function getPages(): Promise<ApiResult<PageInfo[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    const pages = await database.page.findMany({
      orderBy: { id: 'desc' },
    })

    return {
      data: pages.map((page) => ({
        id: page.id,
        name: page.name,
      })),
    }
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    return { error: 'Failed to fetch pages' }
  }
}

export async function getPage(id: number): Promise<ApiResult<PageInfo>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    const page = await database.page.findUnique({
      where: { id },
    })

    if (!page) {
      return { error: 'Page not found' }
    }

    return {
      data: {
        id: page.id,
        name: page.name,
      },
    }
  } catch (error) {
    captureException(error)
    return { error: 'Failed to fetch page' }
  }
}

export async function getCurrentUser(): Promise<ApiResult<UserInfo>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    const user = await database.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    }
  } catch (error) {
    captureException(error)
    return { error: 'Failed to fetch user' }
  }
}

export async function getOrganizations(): Promise<
  ApiResult<OrganizationInfo[]>
> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    // For now, return empty array since organizations aren't implemented yet
    return { data: [] }
  } catch (error) {
    captureException(error)
    return { error: 'Failed to fetch organizations' }
  }
}
