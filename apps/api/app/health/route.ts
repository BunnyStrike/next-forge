import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const GET = () => NextResponse.json({ status: 'OK' }, { status: 200 })
