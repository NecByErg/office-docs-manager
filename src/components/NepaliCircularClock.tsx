"use client";

// ==============================================
// Circular Clock (Nepali) - Nepal Time in Nepali language
// ==============================================
// Right side ma देखिने - गोलाकार (analog) घडी, Nepali अंकहरूमा (०,१,२...),
// तल Nepali बार (आइतबार, सोमबार...) ra Nepali अंकमा समय देखिने।

import { useState, useEffect } from "react";

const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const NEPALI_DAYS = [
  "आइतबार", // Sunday
  "सोमबार", // Monday
  "मंगलबार", // Tuesday
  "बुधबार", // Wednesday
  "बिहीबार", // Thursday
  "शुक्रबार", // Friday
  "शनिबार", // Saturday
];

function toNepaliDigits(num: number): string {
  return num
    .toString()
    .split("")
    .map((d) => NEPALI_DIGITS[parseInt(d, 10)] ?? d)
    .join("");
}

export default function NepaliCircularClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return <div className="w-14 h-14" />;
  }

  // Nepal time ko exact hour/minute/second nikalne (timezone-safe tarikale)
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);

  const hour24 = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const second = parseInt(parts.find((p) => p.type === "second")?.value ?? "0", 10);
  const weekdayShort = parts.find((p) => p.type === "weekday")?.value ?? "Sun";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dayIndex = weekdayMap[weekdayShort] ?? 0;
  const nepaliDay = NEPALI_DAYS[dayIndex];

  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  // Clock hand angles (degree, 12 baje = 0deg, clockwise)
  const secondAngle = second * 6;
  const minuteAngle = minute * 6 + second * 0.1;
  const hourAngle = (hour24 % 12) * 30 + minute * 0.5;

  const nepaliTimeStr = `${toNepaliDigits(hour12)}:${toNepaliDigits(minute).padStart(2, "०")}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#1f2937" strokeWidth="2" />
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30 * (Math.PI / 180);
          const x1 = 50 + 40 * Math.sin(angle);
          const y1 = 50 - 40 * Math.cos(angle);
          const x2 = 50 + 44 * Math.sin(angle);
          const y2 = 50 - 44 * Math.cos(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#374151"
              strokeWidth="1.5"
            />
          );
        })}
        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 22 * Math.sin((hourAngle * Math.PI) / 180)}
          y2={50 - 22 * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="#111827"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 32 * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={50 - 32 * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 36 * Math.sin((secondAngle * Math.PI) / 180)}
          y2={50 - 36 * Math.cos((secondAngle * Math.PI) / 180)}
          stroke="#dc2626"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="2.5" fill="#111827" />
      </svg>
      <div className="text-center leading-tight">
        <p className="text-xs font-semibold text-gray-800">{nepaliTimeStr}</p>
        <p className="text-[10px] text-gray-500">{nepaliDay}</p>
      </div>
    </div>
  );
}
