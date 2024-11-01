// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const clientRoutes = ['/dashboard']
const adminRoutes = ['/admin/dashboard']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseToken')?.value

  // Redirect to login if no token is present
  if (!token) {
    if (clientRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (adminRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard', '/admin/dashboard'],
}
