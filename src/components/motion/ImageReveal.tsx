"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { framerEase } from "@/lib/motion";

export interface ImageRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  className?: string;
  zoom?: boolean;
}

export function ImageReveal({
  children,
  direction = "up",
  duration = 1.0,
  delay = 0.1,
  className,
  zoom = true,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });

  const clipPaths = {
    up: {
      initial: "inset(100% 0% 0% 0%)",
      animate: "inset(0% 0% 0% 0%)",
    },
    down: {
      initial: "inset(0% 0% 100% 0%)",
      animate: "inset(0% 0% 0% 0%)",
    },
    left: {
      initial: "inset(0% 100% 0% 0%)",
      animate: "inset(0% 0% 0% 0%)",
    },
    right: {
      initial: "inset(0% 0% 0% 100%)",
      animate: "inset(0% 0% 0% 0%)",
    },
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="w-full h-full will-change-[clip-path,transform]"
        initial={{
          clipPath: clipPaths[direction].initial,
          scale: zoom ? 1.08 : 1,
        }}
        animate={
          isInView
            ? {
                clipPath: clipPaths[direction].animate,
                scale: 1,
              }
            : {
                clipPath: clipPaths[direction].initial,
                scale: zoom ? 1.08 : 1,
              }
        }
        transition={{
          duration,
          delay,
          ease: framerEase.calm,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
