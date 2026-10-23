import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "fresh-today"
  | "sold-out"
  | "brand"
  | "depth"
  | "outline"
  | "accent";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "brand",
  className = "",
}: BadgeProps) {
  const variants: Record<BadgeVariant, { container: string; dot?: string; defaultText?: string }> = {
    // "Fresh today" status badge with animated ocean green/lagoon pulse dot
    "fresh-today": {
      container:
        "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
      dot: "bg-emerald-400 animate-pulse",
      defaultText: "Fresh Today",
    },
    // "Sold out" status badge with muted alert styling
    "sold-out": {
      container:
        "bg-red-950/30 border border-red-500/30 text-red-300",
      dot: "bg-red-400",
      defaultText: "Sold Out",
    },
    // Oceanic Brand Accent
    brand: {
      container:
        "bg-[#0A9AD9]/15 border border-[#0A9AD9]/40 text-[#6EC6F0] shadow-[0_0_12px_rgba(10,154,217,0.25)]",
    },
    // Depth Telemetry Badge
    depth: {
      container:
        "bg-[#05080C] border border-[#6EC6F0]/30 text-[#E9F7FF]",
      dot: "bg-[#0A9AD9]",
    },
    // Thin 1px Outline White
    outline: {
      container:
        "bg-white/5 border border-white/15 text-white/90 hover:border-white/30",
    },
    // High-contrast Lagoon Accent
    accent: {
      container:
        "bg-[#6EC6F0]/15 border border-[#6EC6F0]/40 text-[#E9F7FF]",
    },
  };

  const selected = variants[variant] || variants.brand;
  const content = children || selected.defaultText;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.08em] font-bold select-none",
        selected.container,
        className
      )}
    >
      {selected.dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", selected.dot)}
          aria-hidden="true"
        />
      )}
      <span>{content}</span>
    </span>
  );
}
