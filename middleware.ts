// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/dashboard']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseToken')?.value

  // If the user is not logged in and tries to access a protected route, redirect to login
  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Apply middleware to routes
export const config = {
  matcher: ['/dashboard'],
}
