import React from "react";

interface StepDiagramProps {
  type: "chain" | "clean";
  stepNumber: string;
}

export function StepDiagram({ type, stepNumber }: StepDiagramProps) {
  if (type === "chain") {
    switch (stepNumber) {
      case "01":
        // 01 Sourced: Coastal dock landing and dawn auction inspection
        return (
          <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
            <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
              {/* Ocean wave base */}
              <path d="M 0 90 Q 40 80, 80 90 T 160 90 T 240 90 T 320 90 L 320 120 L 0 120 Z" fill="#063A63" opacity="0.6" />
              {/* Fishing Boat Silhouette */}
              <path d="M 40 85 L 100 85 L 90 100 L 50 100 Z" fill="#0A9AD9" />
              <line x1="70" y1="85" x2="70" y2="55" stroke="#FFFFFF" strokeWidth="2" />
              <polygon points="70,58 90,68 70,78" fill="#6EC6F0" opacity="0.8" />
              {/* Pier Dock */}
              <rect x="150" y="65" width="160" height="15" rx="3" fill="#334155" />
              <line x1="170" y1="80" x2="170" y2="120" stroke="#475569" strokeWidth="4" />
              <line x1="250" y1="80" x2="250" y2="120" stroke="#475569" strokeWidth="4" />
              {/* Crate Transfer Arrow */}
              <path d="M 100 70 Q 125 45, 160 60" fill="none" stroke="#0A9AD9" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="170" cy="55" r="8" fill="#0A9AD9" />
              <text x="170" y="58" fill="#FFFFFF" fontSize="9" textAnchor="middle" fontWeight="bold">✓</text>
              <text x="230" y="50" fill="#6EC6F0" fontSize="10" fontWeight="bold">4:00 AM HARBOUR</text>
            </svg>
          </div>
        );
      case "02":
        // 02 Iced & Moved Cold: 0°C liquid slurry thermal insulation
        return (
          <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
            <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
              {/* Insulated container box */}
              <rect x="50" y="25" width="220" height="70" rx="10" fill="#063A63" stroke="#0A9AD9" strokeWidth="1.5" />
              {/* Fish in slurry */}
              <ellipse cx="160" cy="60" rx="65" ry="18" fill="#0A9AD9" opacity="0.8" />
              <circle cx="120" cy="58" r="3" fill="#FFFFFF" />
              {/* 0°C Slurry droplets */}
              {[...Array(8)].map((_, i) => (
                <circle key={i} cx={75 + i * 22} cy={40 + (i % 3) * 18} r="3" fill="#6EC6F0" opacity="0.7" className="animate-pulse" />
              ))}
              {/* Thermal gauge readout */}
              <rect x="210" y="32" width="50" height="20" rx="4" fill="#0F1F10" stroke="#6EC6F0" strokeWidth="1" />
              <text x="235" y="46" fill="#6EC6F0" fontSize="10" textAnchor="middle" fontWeight="bold">0.2°C</text>
              <text x="160" y="110" fill="#E9F7FF" fontSize="10" textAnchor="middle">SUB-ZERO LIQUID SLURRY</text>
            </svg>
          </div>
        );
      case "03":
        // 03 Checked at Counter: Digital scale & verification
        return (
          <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
            <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
              {/* Digital Scale Base */}
              <rect x="80" y="75" width="160" height="25" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              {/* Stainless Weighing Pan */}
              <rect x="95" y="55" width="130" height="15" rx="3" fill="#64748B" />
              {/* Fish on Pan */}
              <ellipse cx="160" cy="48" rx="45" ry="12" fill="#0A9AD9" />
              {/* Digital LED Screen */}
              <rect x="130" y="80" width="60" height="15" rx="3" fill="#000000" />
              <text x="160" y="92" fill="#22C55E" fontSize="11" textAnchor="middle" fontWeight="bold">1.250 kg</text>
              {/* Verified check badge */}
              <circle cx="260" cy="50" r="14" fill="#22C55E" opacity="0.2" />
              <circle cx="260" cy="50" r="10" fill="#22C55E" />
              <text x="260" y="54" fill="#FFFFFF" fontSize="11" textAnchor="middle" fontWeight="bold">✓</text>
              <text x="160" y="115" fill="#E9F7FF" fontSize="10" textAnchor="middle">CALIBRATED DIGITAL SCALE</text>
            </svg>
          </div>
        );
      case "04":
        // 04 Same care at every branch: Regional network
        return (
          <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
            <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
              {/* Central Malkapur Hub */}
              <circle cx="160" cy="45" r="18" fill="#0A9AD9" />
              <text x="160" y="49" fill="#FFFFFF" fontSize="9" textAnchor="middle" fontWeight="bold">KARAD</text>
              {/* Branch 1 Patan */}
              <circle cx="70" cy="85" r="14" fill="#063A63" stroke="#6EC6F0" strokeWidth="1.5" />
              <text x="70" y="89" fill="#FFFFFF" fontSize="8" textAnchor="middle">PATAN</text>
              {/* Branch 2 Ishwarpur */}
              <circle cx="250" cy="85" r="14" fill="#063A63" stroke="#6EC6F0" strokeWidth="1.5" />
              <text x="250" y="89" fill="#FFFFFF" fontSize="8" textAnchor="middle">ISLAMPUR</text>
              {/* Connecting cold lines */}
              <path d="M 145 52 L 80 80" stroke="#6EC6F0" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 175 52 L 240 80" stroke="#6EC6F0" strokeWidth="2" strokeDasharray="3 3" />
              <text x="160" y="112" fill="#E9F7FF" fontSize="10" textAnchor="middle">UNIFORM 0°C REGIONAL NETWORK</text>
            </svg>
          </div>
        );
      default:
        return null;
    }
  }

  // clean-and-cut diagrams
  switch (stepNumber) {
    case "01":
      // 01 Washed: RO filtration & water purity
      return (
        <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
          <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
            {/* Filter Column */}
            <rect x="70" y="25" width="40" height="70" rx="6" fill="#1E293B" stroke="#0A9AD9" strokeWidth="1.5" />
            <text x="90" y="65" fill="#6EC6F0" fontSize="9" textAnchor="middle" transform="rotate(-90, 90, 65)">RO FILTER</text>
            {/* Running water pipe */}
            <path d="M 110 40 L 160 40 L 160 60" fill="none" stroke="#6EC6F0" strokeWidth="3" />
            {/* Water spray onto fish */}
            <ellipse cx="160" cy="80" rx="45" ry="12" fill="#0A9AD9" opacity="0.8" />
            {[...Array(6)].map((_, i) => (
              <line key={i} x1={150 + i * 4} y1="60" x2={148 + i * 4} y2="72" stroke="#E9F7FF" strokeWidth="1.5" strokeDasharray="2 2" />
            ))}
            <circle cx="240" cy="55" r="14" fill="#0A9AD9" opacity="0.2" />
            <text x="240" y="58" fill="#6EC6F0" fontSize="10" textAnchor="middle" fontWeight="bold">PURIFIED</text>
            <text x="160" y="110" fill="#E9F7FF" fontSize="10" textAnchor="middle">CONTINUOUS RO PURIFIED RINSE</text>
          </svg>
        </div>
      );
    case "02":
      // 02 Cleaned: Gills & scales precision removal
      return (
        <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
          <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
            {/* Clean stainless surface */}
            <rect x="60" y="70" width="200" height="20" rx="4" fill="#334155" />
            {/* Prepared Fish */}
            <path d="M 80 70 C 120 45, 180 45, 220 70 Z" fill="#0A9AD9" />
            <circle cx="105" cy="62" r="3" fill="#FFFFFF" />
            {/* Clean inspection points */}
            <circle cx="120" cy="58" r="6" fill="#22C55E" opacity="0.3" />
            <circle cx="120" cy="58" r="3" fill="#22C55E" />
            <circle cx="170" cy="58" r="6" fill="#22C55E" opacity="0.3" />
            <circle cx="170" cy="58" r="3" fill="#22C55E" />
            <text x="250" y="45" fill="#6EC6F0" fontSize="9">DESCALED &amp; GUTTED</text>
            <text x="160" y="110" fill="#E9F7FF" fontSize="10" textAnchor="middle">100% VISCERA &amp; SCALE REMOVAL</text>
          </svg>
        </div>
      );
    case "03":
      // 03 Cut your way: Custom culinary cuts
      return (
        <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
          <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
            {/* Slice 1: Rava fry steak */}
            <ellipse cx="90" cy="60" rx="25" ry="18" fill="#0A9AD9" stroke="#FFFFFF" strokeWidth="1" />
            <ellipse cx="90" cy="60" rx="8" ry="6" fill="#063A63" />
            <text x="90" y="95" fill="#6EC6F0" fontSize="9" textAnchor="middle">RAVA FRY</text>
            {/* Slice 2: Curry cut cube */}
            <rect x="150" y="45" width="30" height="30" rx="4" fill="#0A9AD9" stroke="#FFFFFF" strokeWidth="1" />
            <text x="165" y="95" fill="#6EC6F0" fontSize="9" textAnchor="middle">CURRY CUT</text>
            {/* Slice 3: Boneless fillet */}
            <path d="M 220 50 Q 255 45, 275 60 Q 255 75, 220 70 Z" fill="#0A9AD9" stroke="#FFFFFF" strokeWidth="1" />
            <text x="245" y="95" fill="#6EC6F0" fontSize="9" textAnchor="middle">FILLET</text>
            <text x="160" y="114" fill="#E9F7FF" fontSize="10" textAnchor="middle">PORTIONED TO YOUR RECIPE</text>
          </svg>
        </div>
      );
    case "04":
      // 04 Packed for trip home: Insulated chilling pouch
      return (
        <div className="w-full h-44 rounded-2xl bg-[#0F1F10] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden text-white font-mono-accent select-none">
          <svg viewBox="0 0 320 120" className="w-full h-full" aria-hidden="true">
            {/* Insulated food-grade pouch */}
            <rect x="110" y="25" width="100" height="70" rx="8" fill="#1E293B" stroke="#0A9AD9" strokeWidth="1.5" />
            {/* Zip-lock handle */}
            <rect x="135" y="15" width="50" height="10" rx="3" fill="#0A9AD9" />
            {/* AN Fish World stamp */}
            <text x="160" y="55" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontWeight="bold">AN FISH WORLD</text>
            <text x="160" y="70" fill="#6EC6F0" fontSize="8" textAnchor="middle">FRESH PACK • 0°C</text>
            <circle cx="235" cy="50" r="10" fill="#22C55E" />
            <text x="235" y="54" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontWeight="bold">✓</text>
            <text x="160" y="110" fill="#E9F7FF" fontSize="10" textAnchor="middle">ODOURLESS INSULATED HOME TRAVEL PACK</text>
          </svg>
        </div>
      );
    default:
      return null;
  }
}
