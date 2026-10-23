"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";

export interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
  stagger?: number;
  trigger?: "load" | "scroll";
  className?: string;
  delay?: number;
}

export function SplitHeading({
  text,
  as: Component = "h2",
  stagger = 0.05,
  trigger = "scroll",
  className = "",
  delay = 0,
}: SplitHeadingProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  // Split exclusively by whitespace to safeguard Marathi & Devanagari conjuncts (जोडाक्षरे)
  const words = text ? text.trim().split(/\s+/) : [];

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || words.length === 0) return;

      const targets = containerRef.current.querySelectorAll(".split-word-inner");
      if (!targets.length) return;

      const animationVars: gsap.TweenVars = {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        stagger,
        delay,
        ease: "power3.out",
      };

      if (trigger === "scroll") {
        animationVars.scrollTrigger = {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        };
      }

      // Initial state set
      gsap.set(targets, { y: "115%", opacity: 0 });
      gsap.to(targets, animationVars);
    },
    { scope: containerRef, dependencies: [text, trigger, stagger, delay, reducedMotion] }
  );

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      aria-label={text}
      className={`leading-[1.1] ${className}`}
    >
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-top mr-[0.25em] last:mr-0 pb-[0.08em]"
        >
          <span
            className={`split-word-inner inline-block will-change-transform ${
              reducedMotion ? "translate-y-0 opacity-100" : ""
            }`}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
