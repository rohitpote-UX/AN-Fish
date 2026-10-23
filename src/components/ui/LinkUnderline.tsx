"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface LinkUnderlineProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  active?: boolean;
  children: React.ReactNode;
  underlineColor?: string;
}

export function LinkUnderline({
  href,
  external = false,
  active = false,
  children,
  className,
  underlineColor = "bg-[#0A9AD9]",
  ...props
}: LinkUnderlineProps) {
  const commonClasses = cn(
    "relative inline-flex items-center text-sm font-medium tracking-tight text-[#0F1F10] hover:text-[#0A9AD9] transition-colors duration-200 group py-0.5",
    active && "text-[#0A9AD9]",
    className
  );

  const underlineElement = (
    <span
      className={cn(
        "absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        underlineColor,
        active ? "w-full" : "w-0 group-hover:w-full"
      )}
      aria-hidden="true"
    />
  );

  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={commonClasses}
        {...props}
      >
        <span>{children}</span>
        {underlineElement}
      </a>
    );
  }

  return (
    <Link href={href} className={commonClasses} {...props}>
      <span>{children}</span>
      {underlineElement}
    </Link>
  );
}
