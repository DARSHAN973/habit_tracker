import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) return null;

    return session.user;
  } catch (err) {
    console.error("getCurrentUser (current-user.ts) prisma error:", err);
    // If DB is down/unreachable, treat user as unauthenticated instead of crashing.
    return null;
  }
}
