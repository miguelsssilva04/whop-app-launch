"use client";
import { useEffect, useMemo, useState } from "react";

type Props = { endDate: string };

export default function Countdown({ endDate }: Props) {
  const target = useMemo(() => new Date(endDate).getTime(), [endDate]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = Math.max(target - now, 0);
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const ended = ms <= 0;

  return (
    <div className="inline-flex items-center rounded bg-gray-100 text-gray-900 px-2 py-1 text-xs font-medium">
      {ended ? (
        <span>Ended</span>
      ) : (
        <span>
          {days}d {hours}h {minutes}m {String(seconds).padStart(2, "0")}s
        </span>
      )}
    </div>
  );
}