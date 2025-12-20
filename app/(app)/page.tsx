import { TrendingUp, AlertCircle, Award } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

async function getDashboardData() {
  const defaults = {
    level: 0,
    levelScore: 0,
    weeklyPercent: 0,
    trend: [] as number[],
    needsAttention: null,
  };

  try {
    const user = await getCurrentUser();
    if (!user) return defaults;

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
    const dailyCount = habits.filter((h) => h.type === "DAILY").length;
    const weeklyCount = habits.filter((h) => h.type === "WEEKLY").length;
    const totalExpected = dailyCount * 7 + weeklyCount;

    const completed = entries.length;
    const weeklyPercent =
      totalExpected === 0 ? 0 : Math.round((completed / totalExpected) * 100);

    // 3️⃣ LAST 5 WEEKS TREND
    const trend: number[] = [];

    for (let i = 4; i >= 0; i--) {
      const ws = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const we = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

      const count = await prisma.habitEntry.count({
        where: { userId: user.id, date: { gte: ws, lte: we } },
      });

      const percent =
        totalExpected === 0 ? 0 : Math.round((count / totalExpected) * 100);
      trend.push(percent);
    }

    // 4️⃣ NEEDS ATTENTION (least completed habit this week)

    // Map habitId -> completion count
    const completionMap: Record<string, number> = {};

    // Initialize all active habits with 0
    habits.forEach((habit) => {
      completionMap[habit.id] = 0;
    });

    // Count completions from this week's entries
    entries.forEach((entry) => {
      if (completionMap[entry.habitId] !== undefined) {
        completionMap[entry.habitId]++;
      }
    });

    // Find habit with lowest completion count
    const worstHabitEntry = Object.entries(completionMap).sort(
      (a, b) => a[1] - b[1]
    )[0]; // ascending = least completed

    const worstHabit =
      worstHabitEntry && habits.length > 0
        ? habits.find((h) => h.id === worstHabitEntry[0]) || null
        : null;

    // 5️⃣ LEVEL SYSTEM (rolling 4-week average)
    const levelScore = Math.round(
      (trend.slice(-4).reduce((a, b) => a + b, 0) || 0) / 4
    );

    const level =
      levelScore >= 90
        ? 5
        : levelScore >= 75
        ? 4
        : levelScore >= 60
        ? 3
        : levelScore >= 40
        ? 2
        : 1;

    return {
      weeklyPercent,
      level,
      levelScore,
      trend,
      needsAttention: worstHabit?.title || null,
    };
  } catch (err) {
    console.error("getDashboardData error:", err);
    return defaults;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative mb-4">
        <div className="absolute -inset-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-20" />
        <div className="relative">
          <p className="text-2xl font-black leading-tight mb-2 bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Discipline decides your future.
          </p>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span className="w-8 h-0.5 bg-linear-to-r from-indigo-500 to-transparent rounded-full" />
            Today counts.
          </p>
        </div>
      </div>

      {/* LEVEL */}
      <div className="relative rounded-3xl bg-white shadow-md p-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <Award className="text-white" />
            </div>
            <div>
              <p className="text-xs opacity-60">Current Level</p>
              <p className="font-semibold">Habit Mastery</p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <h2 className="text-5xl font-extrabold text-blue-600">
              {data.level}
            </h2>
            <div>
              <p className="text-xl font-bold">Level Score</p>
              <p className="text-xs opacity-60">{data.levelScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY */}
      <div className="rounded-2xl bg-white shadow-sm p-6 flex items-center justify-between">
        <div>
          <p className="text-sm opacity-60">This Week</p>
          <p className="text-4xl font-bold">{data.weeklyPercent}%</p>
          <p className="text-sm opacity-60">Completion</p>
        </div>
      </div>

      {/* TREND */}
      <div className="rounded-2xl bg-white shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-600" />
          <p className="text-sm opacity-60">Last 5 Weeks</p>
        </div>
        <div className="flex items-end gap-3 h-28">
          {Array.isArray(data.trend) &&
            data.trend.map((v: number, i: number) => {
              const barHeight = Math.max(0, Math.min(100, Math.round(v)));
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs mb-1">{v}%</span>
                  <div
                    style={{ height: `${barHeight}%` }}
                    className="w-4 rounded-full bg-blue-500/40"
                  />
                </div>
              );
            })}
        </div>
      </div>

      {/* NEEDS ATTENTION */}
      {data.needsAttention && (
        <div className="rounded-2xl bg-white shadow-sm p-6 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="text-red-600" />
          </div>
          <div>
            <p className="text-xs opacity-60">Needs Attention</p>
            <p className="font-semibold">{data.needsAttention}</p>
          </div>
        </div>
      )}
    </div>
  );
}
