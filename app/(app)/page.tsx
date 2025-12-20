import { TrendingUp, AlertCircle, Award } from "lucide-react";

async function getDashboardData() {
  // Build a safe absolute URL for server environments. Relative `fetch('/api/...')` can
  // sometimes be treated as an invalid URL in certain Node runtimes (Turbopack), so
  // construct an absolute URL using available env variables with sensible fallbacks.
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);

  const url = new URL(`/api/dashboard`, base).toString();
  const res = await fetch(url, {
    cache: "no-store",
  });

  return res.json();
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
              <p className="text-xs opacity-60">
                {data.levelScore}%
              </p>
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
          {data.trend.map((v: number, i: number) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs mb-1">{v}%</span>
              <div style={{ height: `${v}%` }} className="w-4 rounded-full bg-blue-500/40" />
            </div>
          ))}
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
