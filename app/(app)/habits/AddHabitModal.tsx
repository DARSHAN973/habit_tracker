"use client";

import { useState } from "react";

export default function AddHabitModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("HEALTH");
  const [type, setType] = useState("DAILY");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim() || loading) return;

    setLoading(true);

    await fetch("/api/habits/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        category,
        type,
      }),
    });

    onClose();
    location.reload(); // acceptable for v1
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-3xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-lg">Add Habit</h2>

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Habit name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Category
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "HEALTH", label: "Health" },
              { key: "FOCUS", label: "Focus" },
              { key: "SKILL", label: "Skill" },
              { key: "PERSONAL", label: "Personal" },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`rounded-xl p-3 text-sm font-semibold border transition-all ${
                  category === c.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["DAILY", "WEEKLY"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-xl p-3 text-sm font-semibold border ${
                type === t
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border p-3"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-xl bg-blue-600 text-white p-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
