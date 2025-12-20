import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { habitId } = await req.json();

  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId: user.id } });
  if (!habit) return NextResponse.json({}, { status: 404 });

  // delete entries first (cascade may not be configured)
  await prisma.habitEntry.deleteMany({ where: { habitId } });

  await prisma.habit.delete({ where: { id: habitId } });

  return NextResponse.json({ success: true });
}
