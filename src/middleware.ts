import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth';

const PUBLIC_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = await verifySession(sessionCookie);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api/auth|login).*)'],
};
