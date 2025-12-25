import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = cookies(); // ❗ NOT async
  const token = (await cookieStore).get("session")?.value;

  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) return null;

    return session.user;
  } catch (err) {
    console.error("getCurrentUser prisma error:", err);
    return null;
  }
}
