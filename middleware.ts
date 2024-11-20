import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const routes = {
  admin: ['/admin/dashboard', '/admin/charter-editor'],
  auth: ['/admin/auth/login'],
  public: ['/'],
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('firebaseToken')?.value
  const path = request.nextUrl.pathname

  // Check route type
  const isAdminRoute = routes.admin.some((route) => path.startsWith(route))
  const isAuthRoute = routes.auth.some((route) => path.startsWith(route))

  // If no session and trying to access admin route
  if (!session && isAdminRoute) {
    return NextResponse.redirect(new URL('/admin/auth/login', request.url))
  }

  // If has session and trying to access auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
