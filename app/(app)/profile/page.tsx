import { LogOut, TrendingUp, AlertCircle } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import Link from "next/link";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
  });

  const entries = await prisma.habitEntry.findMany({
    where: { userId: user.id },
  });

  const activeHabits = habits.filter(h => h.isActive);

  /* ---------- DAY-LEVEL ANALYSIS ---------- */
  const daysSet = new Set(entries.map(e => e.date.toISOString().split("T")[0]));
  const daysTracked = daysSet.size;

  const totalPossible = daysTracked * (activeHabits.length || 1);
  const completionPercent =
    totalPossible === 0 ? 0 : Math.round((entries.length / totalPossible) * 100);

  /* ---------- THIS WEEK SUMMARY ---------- */
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const weekEntries = entries.filter(
    e => e.date >= weekStart && e.date <= weekEnd
  );

  const dailyCount = activeHabits.filter(h => h.type === "DAILY").length;
  const weeklyCount = activeHabits.filter(h => h.type === "WEEKLY").length;
  const weekPossible = dailyCount * 7 + weeklyCount;

  const weekCompletionPercent =
    weekPossible === 0
      ? 0
      : Math.round((weekEntries.length / weekPossible) * 100);

  /* ---------- DATA SUFFICIENCY CHECK ---------- */
  const datesSorted = [...daysSet].sort();
  const hasEnoughData =
    datesSorted.length >= 7 &&
    new Date(datesSorted[0]) <= subWeeks(now, 1);

  /* ---------- STRONG / WEAK HABITS ---------- */
  let strongestHabit = null;
  let weakestHabit = null;
  let strongestCount = 0;
  let weakestCount = 0;

  if (hasEnoughData && activeHabits.length > 0) {
    const completionMap: Record<string, number> = {};
    activeHabits.forEach(h => (completionMap[h.id] = 0));

    entries.forEach(e => {
      if (completionMap[e.habitId] !== undefined) {
        completionMap[e.habitId]++;
      }
    });

    const sorted = Object.entries(completionMap).sort((a, b) => b[1] - a[1]);

    strongestHabit = habits.find(h => h.id === sorted[0]?.[0]) || null;
    strongestCount = sorted[0]?.[1] ?? 0;

    weakestHabit = habits.find(h => h.id === sorted.at(-1)?.[0]) || null;
    weakestCount = sorted.at(-1)?.[1] ?? 0;
  }

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* HEADER */}
      <div className="relative mb-8">
        <div className="absolute -inset-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-20" />
        <div className="relative">
          <p className="text-2xl font-black leading-tight mb-2 bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Your Space
          </p>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span className="w-8 h-0.5 bg-linear-to-r from-indigo-500 to-transparent rounded-full" />
            Discipline reflected honestly
          </p>
        </div>
      </div>

      {/* USER CARD */}
      <div className="relative rounded-3xl bg-white shadow-md p-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black">
            {(user.name ? user.name.charAt(0).toUpperCase() : "")}
          </div>
          <div>
            <p className="font-black text-2xl text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500 font-medium">
              Building discipline daily
            </p>
          </div>
        </div>
      </div>

      {/* DISCIPLINE OVERVIEW */}
      <div className="rounded-3xl bg-white shadow-md p-6 space-y-5">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Discipline Overview
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <CircleStat label="Days Tracked" value={daysTracked} percentage={0} />
          <CircleStat
            label="Completion"
            value={`${completionPercent}%`}
            percentage={completionPercent}
          />
          <CircleStat
            label="Active Habits"
            value={activeHabits.length}
            percentage={0}
          />
        </div>
      </div>

      {/* THIS WEEK */}
      <div className="rounded-3xl bg-white shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-600 w-5 h-5" />
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            This Week
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-black">{weekEntries.length}</p>
            <p className="text-xs text-slate-500">
              {weekCompletionPercent}% completion rate
            </p>
          </div>

          <CircleProgress percent={weekCompletionPercent} />
        </div>
      </div>

      {/* INSIGHTS */}
      {hasEnoughData && strongestHabit && (
        <InsightCard
          title="You are strongest at"
          value={strongestHabit.title}
          sub={`Completed ${strongestCount} times`}
          color="green"
        />
      )}

      {hasEnoughData && weakestHabit && (
        <InsightCard
          title="Needs attention"
          value={weakestHabit.title}
          sub={`Completed ${weakestCount} times`}
          color="red"
        />
      )}

      {!hasEnoughData && (
        <div className="rounded-2xl bg-white shadow-sm p-5 flex gap-4">
          <AlertCircle className="text-blue-600" />
          <div>
            <p className="font-bold">Keep tracking</p>
            <p className="text-xs opacity-60">
              Insights unlock after 7 days
            </p>
          </div>
        </div>
      )}

      {/* ABOUT */}
      <Link
        href="/profile/about"
        className="rounded-2xl bg-white shadow-sm p-5 flex justify-between"
      >
        <p className="font-bold">About the App</p>
        <span>→</span>
      </Link>

      {/* LOGOUT */}
      <form action="/api/auth/logout" method="POST">
        <button className="w-full rounded-2xl bg-red-50 text-red-600 font-bold py-5">
          <LogOut className="inline w-5 h-5 mr-2" />
          Terminate Session
        </button>
      </form>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function CircleStat({ label, value, percentage }: { label: string; value: string | number; percentage: number }) {
  const safe = Math.max(Number(percentage) || 0, 3);
  const C = 2 * Math.PI * 32;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        {percentage > 0 ? (
          <>
            <svg className="w-20 h-20 transform -rotate-90">
              <circle cx="40" cy="40" r="32" strokeWidth="6" className="text-blue-500/20" stroke="currentColor" fill="none" />
              <circle
                cx="40"
                cy="40"
                r="32"
                strokeWidth="6"
                stroke="currentColor"
                fill="none"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - safe / 100)}
                className="text-blue-600"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-blue-600">{value}</span>
            </div>
          </>
        ) : (
          <div className="w-20 h-20 rounded-full border-[6px] border-blue-500/20 flex items-center justify-center">
            <span className="font-bold text-blue-600">{value}</span>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">{label}</p>
    </div>
  );
}

function CircleProgress({ percent }: { percent: number }) {
  const safe = Math.max(Number(percent) || 0, 3);
  const C = 2 * Math.PI * 32;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle cx="40" cy="40" r="32" strokeWidth="6" className="text-blue-500/20" stroke="currentColor" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="32"
          strokeWidth="6"
          stroke="currentColor"
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - safe / 100)}
          className="text-blue-600"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-blue-600">{percent}%</span>
      </div>
    </div>
  );
}

function InsightCard({ title, value, sub, color }: { title: string; value: string; sub: string; color: "green" | "red" }) {
  const Icon = color === "green" ? TrendingUp : AlertCircle;
  return (
    <div className="rounded-2xl bg-white shadow-sm p-5 flex gap-4">
      <Icon className={`w-5 h-5 ${color === "green" ? "text-green-600" : "text-red-600"}`} />
      <div>
        <p className="text-xs opacity-60">{title}</p>
        <p className="font-bold">{value}</p>
        <p className="text-xs opacity-60">{sub}</p>
      </div>
    </div>
  );
}
