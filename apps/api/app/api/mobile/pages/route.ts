import { NextRequest, NextResponse } from 'next/server'
import { getPages } from '@repo/api-actions'

export async function GET(request: NextRequest) {
  try {
    const result = await getPages()

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
