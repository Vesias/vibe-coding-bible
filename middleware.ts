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
  '/logo.png'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // For all other routes, continue normally (they can handle auth internally)
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