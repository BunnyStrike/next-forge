'use server'

import { z } from 'zod'
import type { ApiResult, PageInfo } from './types.js'

const createPageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

const updatePageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
})

export async function createPage(
  input: z.infer<typeof createPageSchema>
): Promise<ApiResult<PageInfo>> {
  try {
    const validatedInput = createPageSchema.parse(input)

    // TODO: Add auth and database logic when deps are resolved
    return { error: 'Not implemented yet' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || 'Invalid input' }
    }
    return { error: 'Failed to create page' }
  }
}

export async function updatePage(
  input: z.infer<typeof updatePageSchema>
): Promise<ApiResult<PageInfo>> {
  try {
    const validatedInput = updatePageSchema.parse(input)

    // TODO: Add auth and database logic when deps are resolved
    return { error: 'Not implemented yet' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || 'Invalid input' }
    }
    return { error: 'Failed to update page' }
  }
}

export async function deletePage(
  id: string
): Promise<ApiResult<{ success: boolean }>> {
  try {
    if (!id) {
      return { error: 'ID is required' }
    }

    // TODO: Add auth and database logic when deps are resolved
    return { error: 'Not implemented yet' }
  } catch (error) {
    return { error: 'Failed to delete page' }
  }
}
