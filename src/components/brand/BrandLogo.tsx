import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "full" | "icon" | "badge" | "stacked";
  locale?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({
  className = "",
  variant = "full",
  locale = "mr",
  size = "md",
}: BrandLogoProps) {
  const isMarathi = locale === "mr";

  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  const imagePixelSizes = {
    sm: 36,
    md: 44,
    lg: 56,
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official AN Fish World Circular Logo Badge */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-white shadow-sm border border-white/20 flex items-center justify-center shrink-0 ring-2 ring-[#0A9AD9]/25 hover:ring-[#0A9AD9] transition-all`}
      >
        <Image
          src="/brand/an-fish-logo-badge.webp"
          alt="AN Fish World Official Logo"
          width={imagePixelSizes[size]}
          height={imagePixelSizes[size]}
          className="w-full h-full object-contain p-0.5"
          priority
        />
      </div>

      {variant !== "icon" && variant !== "badge" && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className="font-latin-display font-black text-lg sm:text-xl tracking-tight text-white uppercase">
              AN FISH
            </span>
            <span className="font-mono-accent text-xs tracking-wider text-[#6EC6F0] font-semibold uppercase">
              WORLD
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#6EC6F0]/80">
              {isMarathi ? "कराड • लाडकी मासोळी" : "KARAD • EST. 2024"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9] inline-block animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}

