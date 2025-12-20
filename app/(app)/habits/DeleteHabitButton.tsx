"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteHabitButton({ habitId }: { habitId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function remove() {
    if (loading) return;
    if (!confirm("Delete this habit? This cannot be undone.")) return;
    setLoading(true);

    try {
      const res = await fetch("/api/habit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      });

      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={remove}
      disabled={loading}
      className="ml-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-red-50 text-red-600 border-red-100/50 hover:bg-red-100 disabled:opacity-60"
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      <span className="text-xs font-black uppercase">Delete</span>
    </button>
  );
}
