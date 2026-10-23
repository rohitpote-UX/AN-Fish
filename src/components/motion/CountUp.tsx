"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // seconds
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Power3.out ease curve: 1 - Math.pow(1 - progress, 3)
      const easeVal = 1 - Math.pow(1 - progress, 3);
      const currentVal = from + (to - from) * easeVal;

      setValue(currentVal);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setValue(to);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={cn("font-mono-accent font-bold tabular-nums", className)}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
