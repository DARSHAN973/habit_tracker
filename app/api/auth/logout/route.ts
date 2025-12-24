import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("session")?.value;

  if (sessionToken) {
    try {
      await prisma.session.deleteMany({ where: { token: sessionToken } });
    } catch (err) {
      // non-fatal: log and continue to ensure user is logged out client-side
      console.error("Failed to delete session on logout:", err);
    }
  }

  // Redirect to the login page after logout and clear the cookie on the response
  // Use 303 See Other so browsers follow with GET (avoids re-POSTing to /auth)
  const res = NextResponse.redirect(new URL("/auth", request.url), 303);
  // ensure the cookie is removed in the response
  res.cookies.delete("session");

  return res;
}
