import { prisma } from "./prisma";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import type { Habit, HabitEntry } from "@prisma/client";

export type DashboardResult = {
  weeklyPercent: number;
  level: number;
  levelScore: number;
  trend: number[];
  needsAttention: string | null;
};

export async function computeDashboardForUser(userId: string): Promise<DashboardResult> {
  const defaults: DashboardResult = {
    weeklyPercent: 0,
    level: 0,
    levelScore: 0,
    trend: [],
    needsAttention: null,
  };

  try {
    const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // 1️⃣ All active habits
  const habits: Habit[] = await prisma.habit.findMany({ where: { userId, isActive: true } });

  // 2️⃣ Entries this week
  const entries: HabitEntry[] = await prisma.habitEntry.findMany({
    where: { userId, date: { gte: weekStart, lte: weekEnd } },
  });

  // WEEKLY SCORE
  const dailyCount = habits.filter((h) => (h.type as string) === "DAILY").length;
  const weeklyCount = habits.filter((h) => (h.type as string) === "WEEKLY").length;
  const totalExpected = dailyCount * 7 + weeklyCount;

  const completed = entries.length;
  const weeklyPercent = totalExpected === 0 ? 0 : Math.round((completed / totalExpected) * 100);

  // 3️⃣ LAST 5 WEEKS TREND
  const trend: number[] = [];
  for (let i = 9; i >= 0; i--) {
    const ws = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const we = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

    const count = await prisma.habitEntry.count({ where: { userId, date: { gte: ws, lte: we } } });
    const percent = totalExpected === 0 ? 0 : Math.round((count / totalExpected) * 100);
    trend.push(percent);
  }

  // 4️⃣ NEEDS ATTENTION (least completed habit this week)
  const completionMap: Record<string, number> = {};
  habits.forEach((habit) => {
    completionMap[habit.id] = 0;
  });
  entries.forEach((entry) => {
    if (completionMap[entry.habitId] !== undefined) {
      completionMap[entry.habitId]++;
    }
  });

  const worstHabitEntry = Object.entries(completionMap).sort((a, b) => a[1] - b[1])[0];
  const worstHabit = worstHabitEntry && habits.length > 0 ? habits.find((h) => h.id === worstHabitEntry[0]) || null : null;

  // 5️⃣ LEVEL SYSTEM (rolling 4-week average)
  const levelScore = Math.round(((trend.slice(-4).reduce((a, b) => a + b, 0) || 0) / 4) || 0);
  const level =
    levelScore >= 90 ? 5 : levelScore >= 75 ? 4 : levelScore >= 60 ? 3 : levelScore >= 40 ? 2 : 1;

    return {
      weeklyPercent,
      level,
      levelScore,
      trend,
      needsAttention: worstHabit?.title || null,
    };
  } catch (err) {
    // Prisma connection errors (P1001) can happen when the DB is down or the URL is wrong.
    // Return safe defaults so the dashboard doesn't crash and log instructions for the developer.
    console.error("computeDashboardForUser error:", err);
    console.error(
      "Please make sure your database is running and DATABASE_URL is correct. Prisma error code:",
      (err as any)?.code
    );
    return defaults;
  }
}
