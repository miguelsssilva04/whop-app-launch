"use client";
import { useEffect, useMemo, useState } from "react";
import { Text } from "@whop/react/components";

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
    <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
      {ended ? (
        <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900">Ended</span>
      ) : (
        <>
          <div className="flex flex-col p-2 rounded bg-white dark:bg-black rounded-box ">
            <span className="countdown font-mono text-2xl text-black dark:text-white">
              <span style={{ "--value": days } as React.CSSProperties} aria-live="polite" aria-label={`${days} days`}>{days}</span>
            </span>
            <Text as="span" className="text-xs">days</Text>
          </div>
          <div className="flex flex-col p-2 rounded bg-white dark:bg-black rounded-box">
            <span className="countdown font-mono text-2xl text-black dark:text-white">
              <span style={{ "--value": hours } as React.CSSProperties} aria-live="polite" aria-label={`${hours} hours`}>{hours}</span>
            </span>
            <Text as="span" className="text-xs">hours</Text>
          </div>
          <div className="flex flex-col p-2 rounded bg-white dark:bg-black rounded-box">
            <span className="countdown font-mono text-2xl text-black dark:text-white">
              <span style={{ "--value": minutes } as React.CSSProperties} aria-live="polite" aria-label={`${minutes} minutes`}>{minutes}</span>
            </span>
            <Text as="span" className="text-xs">min</Text>
          </div>
           <div className="flex flex-col p-2 bg-white dark:bg-black rounded-box">
            <span className="countdown font-mono text-2xl text-black dark:text-white">
              <span style={{ "--value": seconds } as React.CSSProperties} aria-live="polite" aria-label={`${seconds} seconds`}>{seconds}</span>
            </span>
            <Text as="span" className="text-xs">sec</Text>
          </div>
        </>
      )}
    </div>
  );
}