"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

/** Live local time in the studio's timezone. */
export default function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(fmt());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className={`tabular-nums ${className}`} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </time>
  );
}
