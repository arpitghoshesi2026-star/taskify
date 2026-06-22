import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Appwrite session cookie format: a_session_[PROJECT_ID]
  // Fallback to checking any a_session_ cookie if the project ID is not in env during build
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '6a38bc66002775cd6f42';
  const sessionCookieName = `a_session_${projectId}`;
  const sessionCookieNameLegacy = `a_session_${projectId}_legacy`;

  const hasSession = request.cookies.has(sessionCookieName) || request.cookies.has(sessionCookieNameLegacy);
  
  const isAuthPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/oauth';
  
  if (isAuthPage) {
    // If user is logged in and tries to access login page, redirect to dashboard
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If user is NOT logged in and tries to access protected routes, redirect to login
  if (!hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect all dashboard routes
  matcher: [
    '/',
    '/dashboard/:path*',
    '/tasks/:path*',
    '/calendar/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/activity/:path*',
    '/notifications/:path*',
  ],
};
