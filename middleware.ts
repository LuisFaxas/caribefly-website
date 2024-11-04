import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const routes = {
  admin: ['/admin/dashboard'],
  client: ['/dashboard'],
  auth: ['/login', '/signup'],
  public: ['/'],
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseToken')?.value
  const path = request.nextUrl.pathname

  // Check route type
  const isAdminRoute = routes.admin.some((route) => path.startsWith(route))
  const isClientRoute = routes.client.some((route) => path.startsWith(route))
  const isAuthRoute = routes.auth.some((route) => path.startsWith(route))

  // If no token and trying to access protected route
  if (!token && (isAdminRoute || isClientRoute)) {
    const loginPath = isAdminRoute ? '/admin/login' : '/login'
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  // If has token and trying to access auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
}
