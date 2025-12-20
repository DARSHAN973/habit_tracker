import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import { HabitStatus } from "@prisma/client";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { habitId } = await req.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.habitEntry.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: today,
      },
    },
  });

  if (existing) {
    await prisma.habitEntry.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ done: false });
  }

  await prisma.habitEntry.create({
    data: {
      habitId,
      userId: user.id,
      date: today,
      status: HabitStatus.DONE,
    },
  });

  return NextResponse.json({ done: true });
}
