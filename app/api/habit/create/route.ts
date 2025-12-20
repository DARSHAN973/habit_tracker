import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import { HabitCategory, HabitType } from "@prisma/client";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { title, category, type } = await req.json();

  const habit = await prisma.habit.create({
    data: {
      title,
      category: category as HabitCategory,
      type: type as HabitType,
      startDate: new Date(),
      userId: user.id,
    },
  });

  return NextResponse.json(habit);
}
