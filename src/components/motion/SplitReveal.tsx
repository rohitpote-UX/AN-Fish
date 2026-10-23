"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

export interface SplitRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  isMarathi?: boolean;
  className?: string;
  delay?: number;
  stagger?: number;
  triggerOnce?: boolean;
}

export function SplitReveal({
  text,
  as: Component = "h2",
  isMarathi = false,
  className,
  delay = 0,
  stagger = 0.06,
  triggerOnce = true,
}: SplitRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: triggerOnce, margin: "-10% 0px" });

  // CRITICAL RULE: Marathi Devanagari text must ONLY split by whitespace words,
  // never by character, to preserve conjuncts (जोडाक्षरे).
  const words = text.split(" ");

  return (
    <Component
      className={cn(
        "inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]",
        isMarathi ? "font-marathi-display" : "font-latin-display",
        className
      )}
    >
      <span ref={containerRef} className="inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]">
        {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-[0.1em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "105%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: spring.textUnmask.stiffness,
              damping: spring.textUnmask.damping,
              mass: spring.textUnmask.mass,
              delay: delay + idx * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
      </span>
    </Component>
  );
}
