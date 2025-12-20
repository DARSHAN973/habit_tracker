"use client";

import { Plus } from "lucide-react";
import { useHabitModal } from "./HabitsClient";

export default function AddHabitButton() {
  const { open } = useHabitModal();

  return (
    <button
      onClick={open}
      className="w-11 h-11 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center active:scale-90 transition-all hover:bg-blue-700"
    >
      <Plus className="w-6 h-6 stroke-[3px]" />
    </button>
  );
}
