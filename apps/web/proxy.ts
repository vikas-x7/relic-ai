import { NextRequest, NextResponse } from 'next/server';

const ACCESS_COOKIE = 'relic_access_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessCookie = request.cookies.has(ACCESS_COOKIE);

  if ((pathname === '/' || pathname.startsWith('/auth')) && hasAccessCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/chat';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/auth/:path*', '/'],
};
