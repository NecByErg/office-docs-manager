"use client";

// ==============================================
// Digital Clock (English) - Nepal Time
// ==============================================
// Left side ma देखिने - English day/date ra Nepal time (NPT, UTC+5:45).
// "Asia/Kathmandu" timezone use garेको le, user junसुकै देशबाट खोले पनि,
// सधैं Nepal ko सही समय देखाउँछ।

import { useState, useEffect } from "react";

export default function DigitalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    // Server ra client ko pahilo render match garna (hydration mismatch nahos)
    return <div className="text-xs text-gray-400 w-40">Loading time...</div>;
  }

  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const dayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    weekday: "long",
  }).format(now);

  const dateStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <div className="leading-tight">
      <p className="text-sm font-semibold text-gray-800 tabular-nums">{timeStr} NPT</p>
      <p className="text-xs text-gray-500">
        {dayStr}, {dateStr}
      </p>
    </div>
  );
}
