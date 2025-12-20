import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // 1️⃣ All active habits
  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true },
  });

  // 2️⃣ Entries this week
  const entries = await prisma.habitEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: weekStart, lte: weekEnd },
    },
  });

  // WEEKLY SCORE
  const totalExpected = habits.length * 7;
  const completed = entries.length;
  const weeklyPercent = totalExpected === 0 ? 0 : Math.round((completed / totalExpected) * 100);

  // 3️⃣ LAST 5 WEEKS TREND
  const trend = [];

  for (let i = 4; i >= 0; i--) {
    const ws = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const we = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

    const count = await prisma.habitEntry.count({
      where: { userId: user.id, date: { gte: ws, lte: we } },
    });

    const percent = totalExpected === 0 ? 0 : Math.round((count / totalExpected) * 100);
    trend.push(percent);
  }

  // 4️⃣ NEEDS ATTENTION (most missed)
  const missedMap: Record<string, number> = {};

  entries.forEach(e => {
    missedMap[e.habitId] = (missedMap[e.habitId] || 0) + 1;
  });

  const worstHabitId = Object.entries(missedMap).sort((a, b) => b[1] - a[1])[0]?.[0];

  const worstHabit = worstHabitId
    ? await prisma.habit.findUnique({ where: { id: worstHabitId } })
    : null;

  // 5️⃣ LEVEL SYSTEM (rolling 4-week average)
  const levelScore = Math.round(trend.slice(-4).reduce((a, b) => a + b, 0) / 4);

  const level =
    levelScore >= 90 ? 5 :
    levelScore >= 75 ? 4 :
    levelScore >= 60 ? 3 :
    levelScore >= 40 ? 2 : 1;

  return NextResponse.json({
    weeklyPercent,
    level,
    levelScore,
    trend,
    needsAttention: worstHabit?.title || null,
  });
}
