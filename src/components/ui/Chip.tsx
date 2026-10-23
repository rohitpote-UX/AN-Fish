"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: string | number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Chip({
  active = false,
  count,
  icon,
  children,
  className,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono-accent text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none border min-h-[36px]",
        active
          ? "bg-[#0A9AD9] text-white border-[#0A9AD9] shadow-sm hover:bg-[#063A63]"
          : "bg-white hover:bg-[#F5F4F2] text-[#0F1F10]/75 hover:text-[#0F1F10] border-[#0F1F10]/10 hover:border-[#0F1F10]/20",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none",
            active ? "bg-white/20 text-white" : "bg-[#0F1F10]/06 text-[#0F1F10]/60"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
