import type { NextRequest, NextResponse } from 'next/server'

// Simplified middleware for desktop app
export function middleware(request: NextRequest): NextResponse | undefined {
  // Add any desktop-specific middleware logic here if needed
  return undefined
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
