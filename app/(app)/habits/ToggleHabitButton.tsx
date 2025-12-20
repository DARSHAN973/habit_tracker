"use client";

import { useState } from "react";
import { PlayCircle, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ToggleHabitButton({
  habitId,
  isActive,
}: {
  habitId: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/habit/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      });

      if (!res.ok) throw new Error("Toggle failed");

      router.refresh();
    } catch (err) {
      console.error("Toggle habit failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
        isActive
          ? "bg-blue-50 text-blue-600 border-blue-100"
          : "bg-slate-100 text-slate-500 border-slate-200"
      } disabled:opacity-60`}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : isActive ? (
        <>
          <PlayCircle className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Active</span>
        </>
      ) : (
        <>
          <PauseCircle className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Paused</span>
        </>
      )}
    </button>
  );
}
