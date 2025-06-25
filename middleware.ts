import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/workshops',
  '/community',
  '/collaboration',
  '/auth',
  '/auth/callback',
  '/auth/seamless',
  '/api',
  '/_next',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/og-image.jpg',
  '/logo.png'
]

export function middleware(request: NextRequest) {
  // Temporarily disabled to debug window.location issue
  return NextResponse.next()
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