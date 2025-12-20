import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import { NextResponse } from "next/server";
import { HabitStatus } from "@prisma/client";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completed = await prisma.habitEntry.count({
    where: {
      userId: user.id,
      date: today,
      status: HabitStatus.DONE,
    },
  });

  const total = await prisma.habit.count({
    where: {
      userId: user.id,
      isActive: true,
    },
  });

  return NextResponse.json({ completed, total });
}
