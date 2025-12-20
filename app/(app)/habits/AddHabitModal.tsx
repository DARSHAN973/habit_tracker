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
      onClick={onClose} >
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

        <select
          className="w-full border rounded-xl p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="HEALTH">Health</option>
          <option value="FOCUS">Focus</option>
          <option value="SKILL">Skill</option>
          <option value="PERSONAL">Personal</option>
        </select>

        <select
          className="w-full border rounded-xl p-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
        </select>

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
