import { NextRequest, NextResponse } from "next/server"
import { auth } from "@repo/auth/server"
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from '@repo/security/middleware'
import type { NextMiddleware } from 'next/server'
import { env } from './env'

export const runtime = "nodejs" // Required for Better Auth

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions)

// Cookie-based approach for edge compatibility
function getSessionCookie(request: NextRequest) {
  return request.cookies.get("better-auth.session_token")?.value
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply security headers first
  const securityResponse = securityHeaders()(request)
  if (securityResponse instanceof Response) {
    return securityResponse
  }

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/auth"]
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  try {
    // Use Better Auth session API with headers
    const session = await auth.api.getSession({
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Fallback to cookie check for edge compatibility
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
