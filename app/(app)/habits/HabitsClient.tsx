"use client";

import { useState, createContext, useContext } from "react";
import AddHabitModal from "./AddHabitModal";

const HabitModalContext = createContext<{ open: () => void } | null>(null);

export function useHabitModal() {
  const ctx = useContext(HabitModalContext);
  if (!ctx) throw new Error("useHabitModal must be used inside HabitsClient");
  return ctx;
}

export default function HabitsClient({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <HabitModalContext.Provider value={{ open: () => setOpen(true) }}>
      {children}

      {open && <AddHabitModal onClose={() => setOpen(false)} />}
    </HabitModalContext.Provider>
  );
}
