"use client";

import React from "react";
import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  eyebrowDot?: boolean;
  eyebrowDotPulse?: boolean;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  isMarathi?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  eyebrowDot = false,
  eyebrowDotPulse = false,
  title,
  subtitle,
  align = "left",
  isMarathi = false,
  className,
  theme = "light",
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "text-center mx-auto max-w-3xl" : "text-left max-w-4xl",
        className
      )}
    >
      {eyebrow && (
        <div>
          <Eyebrow
            variant={isDark ? "dark" : "blue"}
            icon={eyebrowIcon}
            dot={eyebrowDot}
            dotPulse={eyebrowDotPulse}
          >
            {eyebrow}
          </Eyebrow>
        </div>
      )}

      <h2
        className={cn(
          "type-h2 font-bold tracking-[-0.05em] leading-[0.95]",
          isDark ? "text-white" : "text-[#0F1F10]",
          isMarathi ? "font-marathi-display" : "font-latin-display"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "type-subhead leading-relaxed max-w-2xl",
            isDark ? "text-white/75" : "text-[#0F1F10]/75",
            isMarathi ? "font-marathi-body" : "font-sans",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
