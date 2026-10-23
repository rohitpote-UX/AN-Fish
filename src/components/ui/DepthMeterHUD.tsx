"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDepthStore } from "@/store/useDepthStore";
import { Compass, Thermometer, Gauge } from "lucide-react";

export function DepthMeterHUD() {
  const t = useTranslations("common");
  const tZones = useTranslations("depthZones");
  const depth = useDepthStore((state) => state.depth);
  const currentZone = useDepthStore((state) => state.currentZone);
  const temperature = useDepthStore((state) => state.temperature);
  const pressure = useDepthStore((state) => state.pressure);

  const zoneName = tZones(`${currentZone}.name`);

  return (
    <aside
      aria-label="Ocean Depth Telemetry"
      className="fixed bottom-6 left-6 z-40 hidden md:flex flex-col gap-2.5 p-4 rounded-2xl bg-[#02111F]/80 backdrop-blur-md border border-[#6EC6F0]/20 shadow-[0_8px_32px_rgba(2,17,31,0.6)] select-none"
    >
      {/* Depth Indicator Header */}
      <div className="flex items-center justify-between gap-6 border-b border-[#6EC6F0]/15 pb-2.5">
        <div className="flex items-center gap-2 text-[#6EC6F0]">
          <Compass className="w-4 h-4 animate-spin-slow" aria-hidden="true" />
          <span className="font-mono-accent text-[11px] uppercase tracking-wider text-white/70">
            {t("depthUnit")}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono-accent text-2xl font-bold text-white tracking-tight">
            {Math.round(depth).toString().padStart(3, "0")}
          </span>
          <span className="font-mono-accent text-xs text-[#0A9AD9] font-semibold">
            M
          </span>
        </div>
      </div>

      {/* Depth Zone Pill */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#0A9AD9] animate-pulse" />
        <span className="text-xs font-semibold text-[#E9F7FF] tracking-wide truncate max-w-[190px]">
          {zoneName}
        </span>
      </div>

      {/* Telemetry Metrics: Temp & Pressure */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#6EC6F0]/15 text-[11px]">
        <div className="flex items-center gap-1.5 text-white/75">
          <Thermometer className="w-3.5 h-3.5 text-[#6EC6F0]" aria-hidden="true" />
          <span className="font-mono-accent">{temperature}°C</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/75 justify-end">
          <Gauge className="w-3.5 h-3.5 text-[#0A9AD9]" aria-hidden="true" />
          <span className="font-mono-accent">{pressure} ATM</span>
        </div>
      </div>

      {/* Vertical Depth Gauge Track */}
      <div className="w-full bg-[#05080C]/80 h-1.5 rounded-full overflow-hidden mt-0.5">
        <div
          className="h-full bg-gradient-to-r from-[#0A9AD9] to-[#6EC6F0] transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, (depth / 115) * 100)}%` }}
        />
      </div>
    </aside>
  );
}
