import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@repo/api-actions'

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentUser()

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
