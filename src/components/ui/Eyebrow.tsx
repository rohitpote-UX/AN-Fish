"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  dotPulse?: boolean;
  variant?: "blue" | "neutral" | "dark";
  radius?: "tag" | "pill"; // 5px tag or full pill
}

export function Eyebrow({
  children,
  icon,
  dot = false,
  dotPulse = false,
  variant = "blue",
  radius = "tag",
  className,
  ...props
}: EyebrowProps) {
  const variantStyles = {
    blue: "bg-[#EBF8FF] text-[#0A9AD9] border-[#0A9AD9]/20",
    neutral: "bg-[#F5F4F2] text-[#0F1F10] border-[#0F1F10]/10",
    dark: "bg-white/10 text-white border-white/15",
  };

  const radiusStyles = {
    tag: "rounded-[5px]",
    pill: "rounded-full",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 border font-mono-accent text-[11px] sm:text-xs uppercase tracking-wider font-bold select-none",
        variantStyles[variant],
        radiusStyles[radius],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {dotPulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                variant === "blue" ? "bg-[#0A9AD9]" : "bg-emerald-500"
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "blue" ? "bg-[#0A9AD9]" : "bg-emerald-500"
            )}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
