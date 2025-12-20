"use client";

import { CheckCircle, Clock, Flame } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TodayClient({
  habits,
  completedCount,
  totalCount,
}: {
  habits: {
    id: string;
    title: string;
    category: string;
    done: boolean;
  }[];
  completedCount: number;
  totalCount: number;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  async function toggle(habitId: string) {
    if (loadingId) return;
    setLoadingId(habitId);

    await fetch("/api/habit/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId }),
    });

    router.refresh();
    setLoadingId(null);
  }

  return (
    <>
      {/* Progress Card */}
      <div className="relative rounded-3xl bg-white shadow-md p-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                <Flame className="text-white" />
              </div>
              <div>
                <p className="text-xs opacity-60">Today&apos;s Progress</p>
                <p className="font-semibold">
                  {completedCount} of {totalCount} completed
                </p>
              </div>
            </div>

            <p className="text-3xl font-extrabold text-blue-600 leading-none">
              {totalCount === 0
                ? 0
                : Math.round((completedCount / totalCount) * 100)}
              %
            </p>
          </div>

          <div className="h-2 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{
                width: `${
                  totalCount === 0
                    ? 0
                    : (completedCount / totalCount) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Habit List: full-row toggle with loading overlay */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="relative">
            <button
              onClick={() => toggle(habit.id)}
              disabled={loadingId === habit.id}
              className={`w-full rounded-2xl bg-white shadow-sm p-4 flex items-center justify-between transition-all text-left ${
                habit.done ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    habit.done ? "bg-blue-600" : "border-2 border-blue-600"
                  }`}
                >
                  {habit.done ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-transparent" />
                  )}
                </div>

                <div>
                  <p className={`font-semibold ${habit.done ? "line-through" : ""}`}>
                    {habit.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs opacity-60">
                    <span>{habit.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Today</span>
                  </div>
                </div>
              </div>

              {/* <div className="text-right">
                <span className="text-[10px] font-black uppercase">
                  {habit.done ? "Done" : "Mark"}
                </span>
              </div> */}
            </button>

            {loadingId === habit.id && (
              <div className="absolute inset-0 rounded-2xl bg-white/60 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">Saving…</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="rounded-2xl bg-white shadow-sm p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-600 font-medium">Remember</p>
          <p className="font-semibold mt-0.5">
            Even one habit done today is progress.
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
          <span className="text-blue-600 font-semibold">✓</span>
        </div>
      </div>
    </>
  );
}
