import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIES.some((cookie) =>
    request.cookies.has(cookie),
  );

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
