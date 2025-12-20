"use client";

import { useEffect, useState } from "react";

function formatDate(d: Date) {
  const weekday = d.toLocaleDateString(undefined, { weekday: "long" });
  const monthDay = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const year = d.getFullYear();
  return { weekday, monthDay, year };
}

export default function DateDisplay() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Update every minute so the date updates at midnight without a full reload
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const { weekday, monthDay, year } = formatDate(now);

  return (
    <div className="text-right">
      <p className="text-sm font-semibold text-slate-800">{weekday}</p>
      <p className="text-xs text-slate-500">{monthDay}, {year}</p>
    </div>
  );
}
