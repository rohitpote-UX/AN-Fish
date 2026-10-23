"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.2 (slower) or 0.2 (faster)
  className?: string;
  disabled?: boolean;
}

export function ParallaxLayer({
  children,
  speed = 0.15,
  className,
  disabled = false,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);
  const smoothY = useSpring(rawY, { stiffness: 300, damping: 30 });

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y: smoothY }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
