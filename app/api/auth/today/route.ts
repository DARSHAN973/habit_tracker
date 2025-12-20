import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isActive: true,
      startDate: { lte: today },
    },
    include: {
      entries: {
        where: { date: today },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    habits.map((h) => ({
      id: h.id,
      title: h.title,
      category: h.category,
      done: h.entries.length > 0,
    }))
  );
}
