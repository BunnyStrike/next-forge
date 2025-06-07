'use server'

import { auth, OrganizationMembership } from '@repo/auth/server'
import { database } from '@repo/database'
import { captureException } from '@repo/observability'
import type {
  ApiResult,
  PageInfo,
  UserInfo,
  OrganizationInfo,
} from './types.js'

export async function getPages(): Promise<ApiResult<PageInfo[]>> {
  try {
    const { orgId } = await auth()

    if (!orgId) {
      return { error: 'Unauthorized' }
    }

    const pages = await database.page.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: pages.map((page: PageInfo) => ({
        id: page.id,
        name: page.name,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      })),
    }
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    return { error: 'Failed to fetch pages' }
  }
}

export async function getPage(id: string): Promise<ApiResult<PageInfo>> {
  try {
    const { orgId } = await auth()

    if (!orgId) {
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
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    }
  } catch (error) {
    captureException(error)
    return { error: 'Failed to fetch page' }
  }
}

export async function getCurrentUser(): Promise<ApiResult<UserInfo>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: 'Unauthorized' }
    }

    const user = await database.user.findUnique({
      where: { id: userId },
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
    const { userId } = await auth()

    if (!userId) {
      return { error: 'Unauthorized' }
    }

    const memberships = await database.organizationMembership.findMany({
      where: { userId },
      include: { organization: true },
    })

    return {
      data: memberships.map((membership: OrganizationMembership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      })),
    }
  } catch (error) {
    captureException(error)
    return { error: 'Failed to fetch organizations' }
  }
}
