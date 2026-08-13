// ==============================================
// Middleware - Route Protection
// ==============================================
// KINA YO CHAHINXA:
// Yo file le harek page load huna aghi nai check garxa "login vayeko xa ki nai".
// Login navako user le /dashboard, /company/xyz jasto kunai page kholna khoje pani,
// automatically /login page ma pathaidinxa.
//
// Yesले garda link direct paste garera pani kohi bina-login pasna sakdaina.

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "erdocs_session";

// Login page ra static assets lai chai auth check nagarikan pass dine
const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public path (login page) lai check nagarikan pass dine
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Next.js internal files (_next, favicon, etc.) lai skip garne
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Token invalid/expired vaye login ma pathaune
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that need their own auth handling (upload, merge, etc. still check separately)
     * - _next/static, _next/image, favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
