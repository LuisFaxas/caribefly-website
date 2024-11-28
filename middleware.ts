import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const routes = {
  admin: [
    '/admin/dashboard',
    '/admin/charter-editor',
    '/admin/price-management',
    '/api/admin',
  ],
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
    if (path.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/auth/login', request.url)
    loginUrl.searchParams.set('from', path)
    return NextResponse.redirect(loginUrl)
  }

  // If has session and trying to access auth routes
  if (session && isAuthRoute) {
    const from = request.nextUrl.searchParams.get('from')
    const redirectUrl = from || '/admin/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
