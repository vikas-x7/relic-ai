import { NextRequest, NextResponse } from 'next/server';

const REFRESH_COOKIE = 'relic_refresh_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has(REFRESH_COOKIE);

  const isProtected = pathname === '/chat' || pathname.startsWith('/chat/');
  const isAuthPage = pathname === '/auth' || pathname.startsWith('/auth/');
  const isLanding = pathname === '/';

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if ((isAuthPage || isLanding) && isLoggedIn) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/auth/:path*', '/'],
};
