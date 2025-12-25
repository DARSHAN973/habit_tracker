import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import TodayClient from "./TodayClient";
import DateDisplay from "../components/DateDisplay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isActive: true,
      // include habits that started up to now so habits created later today are included
      startDate: { lte: now },
    },
    include: {
      entries: {
        where: { date: today },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Filter habits: show DAILY habits and WEEKLY habits only when today matches one of the scheduled days
  const todayWeekday = new Date().getDay(); // 0 = Sunday .. 6 = Saturday
  const filtered = habits.filter((h) => {
    if (h.type === "DAILY") return true;
    if (h.type === "WEEKLY") {
      try {
  const days = (h as unknown as { days?: unknown }).days;
        if (!days) return false;
        if (Array.isArray(days)) return days.includes(todayWeekday);
        // if stored as JSON string
        if (typeof days === "string") {
          const parsed = JSON.parse(days);
          return Array.isArray(parsed) && parsed.includes(todayWeekday);
        }
        return false;
      } catch (err) {
        console.error("Error parsing habit.days for habit", h.id, err);
        return false;
      }
    }
    return false;
  });

  const data = filtered.map((h) => ({
    id: h.id,
    title: h.title,
    category: h.category,
    done: h.entries.length > 0,
  }));

  const completedCount = data.filter((h) => h.done).length;
  const totalCount = data.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative mb-4">
  <div className="absolute -inset-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-20" />

        <div className="relative">
          <p className="text-2xl font-black leading-tight mb-2 bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Today&apos;s Mission
          </p>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span className="w-8 h-0.5 bg-linear-to-r from-indigo-500 to-transparent rounded-full" />
            Focus on showing up
          </p>

          <div className="absolute top-0 right-0">
            <DateDisplay />
          </div>
        </div>
      </div>

      {/* Progress + List */}
      <TodayClient
        habits={data}
        completedCount={completedCount}
        totalCount={totalCount}
      />
    </div>
  );
}
