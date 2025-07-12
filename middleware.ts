import { type NextRequest, NextResponse } from 'next/server';
import { isbot } from 'isbot';
import { getAuthAppUrl } from '@/lib/auth/auth-app-url';

if (!process.env.AUTH_COOKIE_NAME) {
  throw new Error('AUTH_COOKIE_NAME environment variable is not defined');
}

const authAppUrl = getAuthAppUrl();

export async function middleware(request: NextRequest) {
  // Skip auth cookie check if disable auth is set to true
  if (process.env.DISABLE_AUTH === 'true') {
    return NextResponse.next();
  }

  // Check if auth cookie exists before processing request
  // Fetch session in RSC/APIs to further protect a route
  const authCookieName = process.env.AUTH_COOKIE_NAME;
  const cookie = authCookieName
    ? request.cookies.get(authCookieName)
    : undefined;
  const response = NextResponse.next();
  const userAgent = request.headers.get('user-agent');

  // If the request is from a bot, let it pass through
  // This is to prevent bots from being redirected to the auth app
  if (isbot(userAgent)) {
    return NextResponse.next();
  }

  const signInUrl = `${authAppUrl}/sign-in`;
  const appUrl = request.nextUrl.origin;
  const redirectTo = `${appUrl}${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (!cookie) {
    const newUrl = new URL(`${signInUrl}${request.nextUrl.search}`);
    newUrl.searchParams.set('redirectTo', redirectTo);
    return NextResponse.redirect(newUrl);
  }

  // Setting a custom header so that RSCs can handle redirection if session not found
  response.headers.set('x-redirect-to', redirectTo);

  return response;
}

// skipping static and api routes
// Api routes are protected by fetch session request
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
