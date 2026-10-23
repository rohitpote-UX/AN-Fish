"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface NumberedListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  number: string | number;
  title: React.ReactNode;
  description: React.ReactNode;
  active?: boolean;
  metric?: string;
  isMarathi?: boolean;
}

export function NumberedListItem({
  number,
  title,
  description,
  active = false,
  metric,
  isMarathi = false,
  className,
  ...props
}: NumberedListItemProps) {
  // Format single digit with leading zero (e.g. 1 -> "01")
  const formattedNumber =
    typeof number === "number" && number < 10 ? `0${number}` : `${number}`;

  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative p-6 sm:p-8 rounded-[24px] border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-[#0A9AD9] focus-visible:outline-offset-2",
        active
          ? "bg-white border-[#0A9AD9] shadow-[0_12px_32px_rgba(10,154,217,0.10)]"
          : "bg-white/60 hover:bg-white border-[#0F1F10]/08 hover:border-[#0F1F10]/20 hover:shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        {/* Number Badge */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-mono-accent text-xs font-bold transition-all duration-300 shrink-0 select-none",
            active
              ? "bg-[#0A9AD9] text-white shadow-sm"
              : "bg-[#F5F4F2] group-hover:bg-[#EBF8FF] text-[#0F1F10] group-hover:text-[#0A9AD9] border border-[#0F1F10]/10"
          )}
        >
          {formattedNumber}
        </div>

        {/* Optional Metric Tag */}
        {metric && (
          <span className="font-mono-accent text-[11px] uppercase tracking-wider text-[#0A9AD9] font-bold bg-[#EBF8FF] px-3 py-1 rounded-full border border-[#0A9AD9]/20 self-start">
            {metric}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h4
          className={cn(
            "text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-200",
            active ? "text-[#0F1F10]" : "text-[#0F1F10]/90 group-hover:text-[#0F1F10]",
            isMarathi ? "font-marathi-display" : "font-latin-display"
          )}
        >
          {title}
        </h4>

        <p
          className={cn(
            "text-sm sm:text-base leading-relaxed",
            active ? "text-[#0F1F10]/80" : "text-[#0F1F10]/65 group-hover:text-[#0F1F10]/80",
            isMarathi ? "font-marathi-body" : "font-sans"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
