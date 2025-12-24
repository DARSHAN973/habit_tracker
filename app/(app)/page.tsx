import { TrendingUp, AlertCircle, Award } from "lucide-react";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { computeDashboardForUser } from "@/app/lib/dashboard";

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

    return await computeDashboardForUser(user.id);
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
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent" />

        <div className="relative flex items-center justify-between gap-6">
          {/* LEFT — Level Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Award className="text-white" />
              </div>
              <div>
                <p className="text-xs opacity-60">Current Level</p>
                <p className="font-semibold">Habit Mastery</p>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-extrabold text-blue-600 leading-none">
                {data.level}
              </h2>
              <div className="pb-1">
                <p className="text-xl font-bold">Level Score</p>
                <p className="text-xs opacity-60">{data.levelScore}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs opacity-60 mb-1">
                <span>Progress to Level {data.level + 1}</span>
                <span>{data.levelScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${data.levelScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Visual Focus */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Background ring */}
            <svg width="96" height="96" className="absolute">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="rgba(59,130,246,0.2)"
                strokeWidth="6"
                fill="none"
              />
            </svg>

            {/* Progress ring */}
            <svg width="96" height="96" className="absolute -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="rgb(37,99,235)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={
                  2 * Math.PI * 38 * (1 - data.levelScore / 100)
                }
              />
            </svg>

            {/* Center text */}
            <div className="text-center">
              <p className="text-sm font-bold text-blue-600">
                {data.levelScore}%
              </p>
              <p className="text-[10px] opacity-60">Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY */}
      <div className="relative rounded-2xl bg-white shadow-sm p-6 overflow-hidden">
        {/* subtle background */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent" />

        <div className="relative flex items-center justify-between gap-6">
          {/* LEFT — Text */}
          <div className="flex-1">
            <p className="text-sm opacity-60">This Week</p>
            <p className="text-4xl font-bold leading-tight">
              {data.weeklyPercent}%
            </p>
            <p className="text-sm opacity-60 mb-3">Completion</p>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${data.weeklyPercent}%` }}
              />
            </div>
          </div>

          {/* RIGHT — Compact Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg width="64" height="64" className="absolute">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgba(59,130,246,0.2)"
                strokeWidth="5"
                fill="none"
              />
            </svg>

            <svg width="64" height="64" className="absolute -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgb(37,99,235)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={
                  2 * Math.PI * 26 * (1 - data.weeklyPercent / 100)
                }
              />
            </svg>

            <span className="text-xs font-bold text-blue-600">
              {data.weeklyPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* TREND — Last 10 Weeks */}
      <div className="relative rounded-2xl bg-white shadow-sm p-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" />
            <p className="text-sm font-semibold text-slate-700">
              Last 10 Weeks
            </p>
          </div>

          {/* Chart: fixed-width columns left-aligned so W1 is at the left edge */}
          <div className="flex items-end justify-start gap-3 h-40 overflow-x-auto">
            {(() => {
              if (!Array.isArray(data.trend)) return null;
              // show only non-zero weeks and place the most recent first (W1)
              const displayTrend = data.trend.filter((v) => v > 0).reverse();
              return displayTrend.map((value: number, index: number) => {
                // newest -> oldest so left-to-right is W1..Wn
                const barHeight = value > 0 ? Math.round((value / 100) * 120) : 2; // small placeholder for zero

                return (
                  <div
                    key={index}
                    className="w-8 shrink-0 flex flex-col items-center justify-end"
                  >
                    {/* Value (hide when 0 but keep spacing) */}
                    {value > 0 ? (
                      <span className="text-[10px] font-semibold text-slate-500 mb-1">
                        {value}%
                      </span>
                    ) : (
                      <span className="h-4 mb-1" aria-hidden />
                    )}

                    {/* Bar */}
                    <div className="w-full flex justify-center">
                      <div
                        className="w-3 rounded-full bg-linear-to-t from-blue-600 to-indigo-400 transition-all duration-500"
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>

                    {/* Week label: left-to-right starting at W1 */}
                    <span className="text-[10px] text-slate-400 mt-1">W{index + 1}</span>
                  </div>
                );
              });
            })()}
          </div>

          {/* Footer */}
          <p className="mt-4 text-xs text-slate-500">
            Showing active weeks only.
          </p>
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
