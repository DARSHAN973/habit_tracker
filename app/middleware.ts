import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const pathname = request.nextUrl.pathname;

  // public routes
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname === "/auth";

  // user NOT logged in: redirect to /auth for any non-auth route
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(
      new URL("/auth", request.url)
    );
  }

  // user IS logged in but trying to access auth pages: redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}
