"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  arrowPosition?: "right" | "left";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  pillRadius?: "full" | "tag"; // 99px full pill or 5px tag pill from spec
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      showArrow = false,
      arrowPosition = "right",
      icon,
      iconPosition = "left",
      pillRadius = "full",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "group relative inline-flex items-center justify-center font-mono-accent font-bold uppercase tracking-wider text-xs transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#0A9AD9] focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none min-h-[44px] cursor-pointer select-none active:scale-[0.97]";

    // Pattern 5: Hover displacement translateY(-2px), shadow bloom 0 4px 20px rgba(10,154,217,0.4)
    const variants: Record<ButtonVariant, string> = {
      // Primary AN Blue Pill: #0A9AD9 fill, white text, hover translateY(-2px) and shadow bloom
      primary:
        "bg-[#0A9AD9] hover:bg-[#063A63] text-white hover:-translate-y-0.5 shadow-sm hover:shadow-[0_4px_20px_rgba(10,154,217,0.40)] border border-transparent",
      // Secondary Outline: Thin 1px border, dark pine text, clean white/bone background
      secondary:
        "bg-white hover:bg-[#F5F4F2] text-[#0F1F10] border border-[#0F1F10]/15 hover:border-[#0A9AD9] hover:-translate-y-0.5 shadow-sm hover:shadow-sm",
      // Outline Dark Mode / High Contrast: For dark backgrounds
      outline:
        "bg-white/5 hover:bg-white text-white hover:text-[#0F1F10] border border-white/20 hover:border-white hover:-translate-y-0.5 backdrop-blur-sm",
      // Ghost: Minimal text button with hover highlight
      ghost:
        "text-[#0F1F10] hover:text-[#0A9AD9] hover:bg-[#F5F4F2] border border-transparent",
    };

    const radiusClasses = {
      full: "rounded-full",
      tag: "rounded-[5px]",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-[11px]",
      md: "px-6 py-3.5 text-xs",
      lg: "px-8 py-4 text-xs sm:text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variants[variant] || variants.primary,
          radiusClasses[pillRadius],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="mr-2 inline-flex items-center shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {showArrow && arrowPosition === "left" && (
          <ArrowRight
            className="w-3.5 h-3.5 mr-2 shrink-0 transition-transform duration-200 group-hover:-translate-x-1 rotate-180"
            aria-hidden="true"
          />
        )}

        <span>{children}</span>

        {icon && iconPosition === "right" && (
          <span className="ml-2 inline-flex items-center shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {showArrow && arrowPosition === "right" && (
          <ArrowRight
            className="w-3.5 h-3.5 ml-2 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

