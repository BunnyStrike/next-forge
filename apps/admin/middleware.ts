import { createAuthMiddleware } from '@repo/auth/middleware'
import { createSecurityMiddleware } from '@repo/security/middleware'
import type { NextRequest } from 'next/server'

const authMiddleware = createAuthMiddleware({
  redirectTo: '/sign-in',
  publicRoutes: ['/sign-in', '/sign-up'],
})

const securityMiddleware = createSecurityMiddleware()

export default async function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = await securityMiddleware(request)
  if (securityResponse) return securityResponse

  // Then apply auth middleware
  return authMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 