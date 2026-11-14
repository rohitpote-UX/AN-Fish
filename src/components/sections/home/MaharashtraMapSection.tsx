"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  MapPin,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  Clock,
  Compass,
  Store,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Building2,
  Waves,
  Check,
  Fish,
  Anchor,
  Search,
  Truck,
  TrendingUp,
} from "lucide-react";
import { BRANCHES_LIST } from "@/data/branches";
import { PLACEHOLDERS } from "@/data/placeholders";
import { Branch } from "@/types";

interface RegionFilter {
  id: string;
  labelMr: string;
  labelEn: string;
  count: number;
}

export function MaharashtraMapSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>("karad-hq");
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Region Filters
  const REGION_FILTERS: RegionFilter[] = [
    { id: "all", labelMr: "सर्व २५ दालने", labelEn: "All 25 Outlets", count: 25 },
    { id: "karad", labelMr: "👑 कराड मुख्य केंद्र", labelEn: "Karad HQ", count: 3 },
    { id: "satara", labelMr: "सातारा जिल्हा", labelEn: "Satara Dist.", count: 8 },
    { id: "sangli", labelMr: "सांगली जिल्हा", labelEn: "Sangli Dist.", count: 6 },
    { id: "kolhapur", labelMr: "कोल्हापूर", labelEn: "Kolhapur Dist.", count: 2 },
    { id: "pune", labelMr: "पुणे", labelEn: "Pune Dist.", count: 3 },
    { id: "solapur", labelMr: "सोलापूर", labelEn: "Solapur Dist.", count: 1 },
    { id: "coastal", labelMr: "अरबी समुद्र बंदरे", labelEn: "Coastal Ports", count: 2 },
  ];

  // Specific label orientations to keep the map clean, spacious and clutter-free
  const LABEL_POSITIONS: Record<
    string,
    {
      wrapperClass: string;
      labelClass: string;
      shortNameMr: string;
      shortNameEn: string;
      alwaysShow?: boolean;
    }
  > = {
    // 1. KARAD HQ & OUTLETS
    "karad-hq": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-14 left-1/2 -translate-x-1/2",
      shortNameMr: "कराड (मुख्य HQ)",
      shortNameEn: "Karad (Main HQ)",
      alwaysShow: true,
    },
    "karad-kolhapur-naka": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 left-1/2 -translate-x-1/2",
      shortNameMr: "कोल्हापूर नाका",
      shortNameEn: "Kolhapur Naka",
    },
    undale: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-4 -left-12",
      shortNameMr: "उंडाळे",
      shortNameEn: "Undale",
    },

    // 2. SATARA DISTRICT
    "patan-mhavashi": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 -left-16",
      shortNameMr: "पाटण (म्हावशी)",
      shortNameEn: "Patan (Mhavashi)",
      alwaysShow: true,
    },
    "satara-bombay-rest": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 left-1/2 -translate-x-1/2",
      shortNameMr: "सातारा (हायवे)",
      shortNameEn: "Satara (Highway)",
      alwaysShow: true,
    },
    "satara-guruwar-peth": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 left-1/2 -translate-x-1/2",
      shortNameMr: "सातारा शहर",
      shortNameEn: "Satara City",
    },
    vaduj: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-2.5 left-5",
      shortNameMr: "वडूज",
      shortNameEn: "Vaduj",
    },
    wai: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 -left-8",
      shortNameMr: "वाई",
      shortNameEn: "Wai",
    },
    shirwal: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 left-1/2 -translate-x-1/2",
      shortNameMr: "शिरवळ",
      shortNameEn: "Shirwal",
    },
    koregaon: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-2.5 left-5",
      shortNameMr: "कोरेगाव",
      shortNameEn: "Koregaon",
    },
    dahiwadi: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-2.5 left-5",
      shortNameMr: "दहिवडी",
      shortNameEn: "Dahiwadi",
    },

    // 3. SANGLI DISTRICT
    "ishwarpur-islampur": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 left-1/2 -translate-x-1/2",
      shortNameMr: "ईश्वरपूर (इस्लामपूर)",
      shortNameEn: "Ishwarpur (Islampur)",
      alwaysShow: true,
    },
    "sangli-vishrambag": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-2.5 left-5",
      shortNameMr: "सांगली शहर",
      shortNameEn: "Sangli City",
      alwaysShow: true,
    },
    miraj: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 left-1/2 -translate-x-1/2",
      shortNameMr: "मिरज",
      shortNameEn: "Miraj",
    },
    vita: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 left-1/2 -translate-x-1/2",
      shortNameMr: "विटा",
      shortNameEn: "Vita",
      alwaysShow: true,
    },
    palus: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 -left-8",
      shortNameMr: "पलूस",
      shortNameEn: "Palus",
    },
    tasgaon: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-2.5 left-5",
      shortNameMr: "तासगाव",
      shortNameEn: "Tasgaon",
    },

    // 4. KOLHAPUR DISTRICT
    "kolhapur-kawala-naka": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 -left-14",
      shortNameMr: "कोल्हापूर शहर",
      shortNameEn: "Kolhapur City",
      alwaysShow: true,
    },
    ichalkaranji: {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 left-1/2 -translate-x-1/2",
      shortNameMr: "इचलकरंजी",
      shortNameEn: "Ichalkaranji",
    },

    // 5. PUNE DISTRICT
    "pune-moshi": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 -left-14",
      shortNameMr: "पुणे (मोशी)",
      shortNameEn: "Pune (Moshi)",
    },
    "pune-kharadi": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-2.5 left-5",
      shortNameMr: "पुणे (खराडी)",
      shortNameEn: "Pune (Kharadi)",
    },
    "pune-hadapsar": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "top-5 left-1/2 -translate-x-1/2",
      shortNameMr: "पुणे (हडपसर)",
      shortNameEn: "Pune (Hadapsar)",
      alwaysShow: true,
    },

    // 6. SOLAPUR DISTRICT
    "solapur-employment-chowk": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 left-1/2 -translate-x-1/2",
      shortNameMr: "सोलापूर शहर",
      shortNameEn: "Solapur City",
      alwaysShow: true,
    },

    // 7. ARABIAN SEA SOURCING PORTS
    "ratnagiri-port": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 -left-16",
      shortNameMr: "रत्नागिरी बंदर",
      shortNameEn: "Ratnagiri Port",
      alwaysShow: true,
    },
    "malvan-port": {
      wrapperClass: "-translate-x-1/2 -translate-y-1/2",
      labelClass: "-top-6 -left-14",
      shortNameMr: "मालवण बंदर",
      shortNameEn: "Malvan Port",
      alwaysShow: true,
    },
  };

  // Filter branches based on selected region
  const isBranchMatched = (branch: Branch): boolean => {
    if (selectedRegion === "all") return true;
    if (selectedRegion === "karad") {
      return (
        branch.slug === "karad-hq" ||
        branch.slug === "karad-kolhapur-naka" ||
        branch.slug === "undale"
      );
    }
    if (selectedRegion === "satara") {
      return (
        branch.districtMr?.includes("सातारा") === true &&
        branch.slug !== "karad-hq" &&
        branch.slug !== "karad-kolhapur-naka" &&
        branch.slug !== "undale"
      );
    }
    if (selectedRegion === "sangli") {
      return branch.districtMr?.includes("सांगली") === true;
    }
    if (selectedRegion === "kolhapur") {
      return branch.districtMr?.includes("कोल्हापूर") === true;
    }
    if (selectedRegion === "pune") {
      return branch.districtMr?.includes("पुणे") === true;
    }
    if (selectedRegion === "solapur") {
      return branch.districtMr?.includes("सोलापूर") === true;
    }
    if (selectedRegion === "coastal") {
      return branch.type === "port";
    }
    return true;
  };

  // Active selected branch object
  const selectedBranch = useMemo(() => {
    if (!selectedStoreId) return null;
    return BRANCHES_LIST.find((b) => b.id === selectedStoreId) || null;
  }, [selectedStoreId]);

  // Filtered branches for directory list below
  const directoryBranches = useMemo(() => {
    let list = BRANCHES_LIST.filter(isBranchMatched);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.nameMr.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.villageNameMr?.toLowerCase().includes(q) ||
          b.addressMr.toLowerCase().includes(q) ||
          b.landmarkMr.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedRegion, searchQuery]);

  return (
    <section
      id="franchise-map"
      data-section="maharashtra-map"
      className="relative py-12 sm:py-20 md:py-24 pb-28 sm:pb-24 bg-[#071423] text-white overflow-x-hidden selection:bg-[#0A9AD9] selection:text-white"
    >
      {/* Background Ambient Ocean Glow & Subtle Light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,rgba(6,58,99,0.05)_50%,transparent_70%)] pointer-events-none select-none blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#0A9AD9]/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A9AD9]/15 border border-[#38BDF8]/30 text-xs sm:text-sm font-bold text-[#6EC6F0] mb-3 sm:mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(10,154,217,0.25)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FBBF24]" />
            </span>
            <span className="tracking-wide">
              {isMarathi
                ? "संपूर्ण महाराष्ट्रात २५+ अधिकृत दालने"
                : "25+ Official Seafood Stores Across Maharashtra"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-marathi-display text-white tracking-tight leading-[1.2] sm:leading-[1.15]">
            {isMarathi ? (
              <>
                महाराष्ट्राच्या कानाकोपऱ्यात{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#38BDF8]">
                  कराडची लाडकी मासोळी..!
                </span>
              </>
            ) : (
              <>
                Karad&apos;s Beloved Fish —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#38BDF8] to-[#25D366]">
                  Across Every Corner of Maharashtra
                </span>
              </>
            )}
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-white/80 font-marathi-body max-w-3xl mx-auto leading-relaxed">
            {isMarathi
              ? "कराड मुख्य केंद्रासह सातारा, सांगली, कोल्हापूर, पुणे, सोलापूर आणि थेट अरबी समुद्र बंदरांवर आमचे नेटवर्क. कोणत्याही दुकानावर (Pin) क्लिक करा आणि त्या दालनाचा आजचा उपलब्ध मासोळी साठा व माहिती पहा!"
              : "From our Karad central hub across Satara, Sangli, Kolhapur, Pune, Solapur, and Arabian Sea harbour docks. Click any store pin to open its live landing page with today's catch!"}
          </p>

          {/* REGION FILTER CHIPS (Min 40px height, wrapping grid, equal spacing, no cut-off) */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {REGION_FILTERS.map((r) => {
              const active = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.id)}
                  type="button"
                  className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    active
                      ? "bg-gradient-to-r from-[#0A9AD9] to-[#0284C7] text-white shadow-[0_0_15px_rgba(10,154,217,0.5)] border border-white/30 scale-105"
                      : "bg-[#061B2B]/90 hover:bg-[#0A2A3D] text-white/80 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{isMarathi ? r.labelMr : r.labelEn}</span>
                  <span
                    className={`text-[0.68rem] px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white font-black" : "bg-black/40 text-white/70"
                    }`}
                  >
                    {r.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ULTRA-CLEAN 4K MAP STAGE (Seamlessly blended, no heavy frame on mobile) */}
        <div className="relative rounded-3xl bg-[#071423] border-0 sm:border sm:border-cyan-500/20 p-0 sm:p-4 md:p-6 shadow-none sm:shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Instruction Bar & Legend (Min 14px readable text, neat legend layout) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-start sm:items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] animate-ping shrink-0 mt-1 sm:mt-0" />
              <p className="text-[14px] sm:text-[14px] font-medium text-white/90 leading-relaxed font-marathi-body">
                <strong className="font-bold text-[#FBBF24] font-marathi-display mr-1">
                  {isMarathi ? "दालन निवडा (Click Pin):" : "Select Location (Click Pin):"}
                </strong>
                <span>
                  {isMarathi
                    ? "नकाशावरील कोणत्याही पिनवर क्लिक करून स्वतंत्र दालन पेज व आजचा साठा उघडा."
                    : "Click any location pin to open its dedicated store portfolio & live stock."}
                </span>
              </p>
            </div>

            {/* Legend: Tidy wrapping row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] sm:text-[13px] text-white/80 shrink-0 font-marathi-display">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] ring-2 ring-[#FBBF24]/40" />
                <span>कराड HQ</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] ring-2 ring-[#38BDF8]/40" />
                <span>अधिकृत दालने</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
                <span>सागरी बंदरे</span>
              </span>
            </div>
          </div>

          {/* THE MAP CANVAS CONTAINER: Responsive aspect ratio (Aspect 4/5 or 1/1 on mobile, 3840/2143 on desktop) */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[3840/2143] max-h-[850px] mx-auto select-none rounded-2xl overflow-hidden bg-[#071423] flex items-center justify-center">
            
            {/* Inner Scalable Stage: Centered on Western Maharashtra / Karad on mobile */}
            <div className="relative w-full h-full aspect-[3840/2143] scale-[1.35] xs:scale-[1.45] sm:scale-100 origin-[33%_66%] md:origin-center transition-transform duration-300">
              
              {/* Ultra-Clean 4K Illustrated Map with Soft 3D Depth */}
              <Image
                src="/media/maharashtra-premium-clean-4k.webp"
                alt="Ultra-clean Premium Illustrated Map of Maharashtra AN Fish World 4K"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
              />

              {/* WEST COAST: ARABIAN SEA EMBLEM & WAVE GRAPHIC */}
              <div className="absolute left-2 sm:left-4 top-[64%] -translate-y-1/2 pointer-events-none z-20 hidden xs:flex flex-col items-start gap-1">
                <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-[#061524]/90 border border-[#38BDF8]/40 backdrop-blur-md shadow-2xl flex items-center gap-1.5 sm:gap-2">
                  <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38BDF8] animate-pulse" />
                  <div>
                    <div className="text-[0.65rem] sm:text-xs font-black font-marathi-display text-white">
                      🌊 अरबी समुद्र
                    </div>
                    <div className="text-[0.52rem] sm:text-[0.62rem] text-[#6EC6F0] font-semibold hidden sm:block">
                      ७२० किमी किनारपट्टी · ताजी आवक
                    </div>
                  </div>
                </div>
              </div>

              {/* SUPPLY CORRIDOR ROUTE LINES (SVG OVERLAY) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Ratnagiri Port -> Karad HQ */}
                <path
                  d="M 16.5 65.0 Q 25.0 65.5 33.4 66.3"
                  stroke="#38BDF8"
                  strokeWidth="0.55"
                  strokeDasharray="2 2"
                  strokeOpacity="0.9"
                  fill="none"
                />
                {/* Malvan Port -> Karad HQ */}
                <path
                  d="M 21.8 84.5 Q 27.5 75.0 33.4 66.3"
                  stroke="#38BDF8"
                  strokeWidth="0.55"
                  strokeDasharray="2 2"
                  strokeOpacity="0.9"
                  fill="none"
                />
                {/* Karad HQ -> Pune */}
                <path
                  d="M 33.4 66.3 Q 31.5 56.5 29.8 47.5"
                  stroke="#FBBF24"
                  strokeWidth="0.5"
                  strokeDasharray="1.5 1.5"
                  strokeOpacity="0.75"
                  fill="none"
                />
                {/* Karad HQ -> Solapur */}
                <path
                  d="M 33.4 66.3 Q 42.5 64.5 51.5 63.5"
                  stroke="#FBBF24"
                  strokeWidth="0.45"
                  strokeDasharray="1.5 1.5"
                  strokeOpacity="0.7"
                  fill="none"
                />
                {/* Karad HQ -> Sangli */}
                <path
                  d="M 33.4 66.3 L 40.2 74.2"
                  stroke="#FBBF24"
                  strokeWidth="0.45"
                  strokeDasharray="1.5 1.5"
                  strokeOpacity="0.7"
                  fill="none"
                />
                {/* Karad HQ -> Kolhapur */}
                <path
                  d="M 33.4 66.3 L 33.2 78.5"
                  stroke="#FBBF24"
                  strokeWidth="0.45"
                  strokeDasharray="1.5 1.5"
                  strokeOpacity="0.7"
                  fill="none"
                />
              </svg>

              {/* RENDER ALL 25 STORE LOCATIONS */}
              {BRANCHES_LIST.map((branch) => {
                const matched = isBranchMatched(branch);
                const isHQ = branch.id === "karad-hq";
                const isPort = branch.type === "port";
                const isSelected = selectedStoreId === branch.id;
                const isHovered = hoveredStoreId === branch.id;

                const pinX = branch.pinX ?? 50;
                const pinY = branch.pinY ?? 50;
                const posConfig = LABEL_POSITIONS[branch.id] || {
                  wrapperClass: "-translate-x-1/2 -translate-y-1/2",
                  labelClass: "-top-6 left-1/2 -translate-x-1/2",
                  shortNameMr: branch.villageNameMr || branch.nameMr,
                  shortNameEn: branch.nameEn,
                  alwaysShow: false,
                };

                // On mobile: show ONLY the selected pin's label to prevent clutter/collision.
                // On desktop: show alwaysShow hubs or filtered district hubs or hover.
                const shouldShowLabelMobile = isSelected;
                const shouldShowLabelDesktop =
                  posConfig.alwaysShow ||
                  selectedRegion !== "all" ||
                  isHovered ||
                  isSelected;

                return (
                  <div
                    key={branch.id}
                    className={`absolute ${posConfig.wrapperClass} transition-all duration-200 ${
                      matched ? "opacity-100 z-30" : "opacity-30 z-10"
                    } ${isHQ ? "z-40" : ""} ${isSelected ? "z-50" : ""}`}
                    style={{ left: `${pinX}%`, top: `${pinY}%` }}
                    onMouseEnter={() => setHoveredStoreId(branch.id)}
                    onMouseLeave={() => setHoveredStoreId(null)}
                  >
                    {/* Pin Touch Area: 44px x 44px for effortless finger tapping on mobile */}
                    <div
                      className="min-h-0 min-w-0 w-11 h-11 -ml-[22px] -mt-[22px] relative flex items-center justify-center group cursor-pointer"
                      onClick={() => setSelectedStoreId(branch.id)}
                    >
                      <Link
                        href={`/${locale}/branches/${branch.slug}`}
                        className="min-h-0 w-full h-full flex items-center justify-center"
                        title={isMarathi ? branch.nameMr : branch.nameEn}
                        aria-label={isMarathi ? branch.nameMr : branch.nameEn}
                        onClick={(e) => {
                          // On mobile (<768px), first tap selects and displays clean bottom card; second tap or card button navigates
                          if (typeof window !== "undefined" && window.innerWidth < 768) {
                            if (selectedStoreId !== branch.id) {
                              e.preventDefault();
                              setSelectedStoreId(branch.id);
                            }
                          }
                        }}
                      >
                        {/* Pin Dot & Radar Pulsing Beacon */}
                        {isHQ ? (
                          <>
                            <span className="absolute w-12 h-12 rounded-full bg-[#FBBF24]/35 animate-ping" />
                            <span className="absolute w-8 h-8 rounded-full bg-[#FBBF24]/40 animate-pulse" />
                            <span className={`relative w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#D97706] via-[#FBBF24] to-[#F59E0B] border-2 border-white shadow-[0_0_25px_rgba(251,191,36,0.95)] ring-4 ring-[#FBBF24]/50 transition-transform ${
                              isSelected ? "scale-125" : "group-hover:scale-110"
                            }`}>
                              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#071A24] fill-current" />
                            </span>
                          </>
                        ) : isPort ? (
                          <>
                            <span className="absolute w-8 h-8 rounded-full bg-emerald-400/35 animate-ping" />
                            <span className={`relative w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center bg-emerald-500 border-2 border-white shadow-[0_0_15px_rgba(16,185,129,0.85)] transition-transform ${
                              isSelected ? "scale-125 ring-4 ring-emerald-400/60" : "group-hover:scale-110"
                            }`}>
                              <Anchor className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="absolute w-7 h-7 rounded-full bg-[#38BDF8]/25 animate-ping group-hover:bg-[#FBBF24]/40" />
                            <span
                              className={`relative w-3.5 h-3.5 md:w-3.5 md:h-3.5 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all ${
                                isSelected
                                  ? "bg-[#FBBF24] scale-125 ring-4 ring-[#FBBF24]/60 shadow-[0_0_15px_#FBBF24]"
                                  : matched
                                  ? "bg-[#0284C7] group-hover:bg-[#FBBF24]"
                                  : "bg-slate-600"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            </span>
                          </>
                        )}

                        {/* SPECIAL: KARAD HQ 3D LEAPING FISH MASCOT */}
                        {isHQ && (
                          <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                            <div
                              className="relative w-9 h-9 md:w-10 md:h-10 animate-bounce flex items-center justify-center"
                              style={{ animationDuration: "2s" }}
                            >
                              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#D97706] p-1 shadow-[0_4px_20px_rgba(251,191,36,0.95)] border-2 border-white flex items-center justify-center">
                                <Fish className="w-4 h-4 md:w-5 md:h-5 text-[#071A24] fill-current" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PIN NAME LABEL (Mobile: Only selected pin shows label; Desktop: Managed clutter-free) */}
                        <div
                          className={`absolute ${posConfig.labelClass} whitespace-nowrap px-2 py-0.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-black font-marathi-display shadow-2xl transition-all duration-200 pointer-events-none z-30 ${
                            shouldShowLabelMobile ? "block" : "hidden"
                          } ${shouldShowLabelDesktop ? "md:block" : "md:hidden"} ${
                            isHQ
                              ? "bg-[#071A24]/95 border-2 border-[#FBBF24] text-[#FBBF24] shadow-[0_0_15px_rgba(251,191,36,0.7)]"
                              : isPort
                              ? "bg-[#062016]/95 border border-emerald-400 text-emerald-300"
                              : isSelected
                              ? "bg-[#071A24]/95 border-2 border-[#FBBF24] text-[#FBBF24] shadow-lg scale-110"
                              : matched
                              ? "bg-[#061824]/95 border border-[#38BDF8]/60 text-white group-hover:border-[#FBBF24] group-hover:text-[#FBBF24]"
                              : "bg-black/80 border border-white/20 text-white/60"
                          }`}
                        >
                          {isHQ ? "👑 " : isPort ? "⚓ " : "📍 "}
                          {isMarathi ? posConfig.shortNameMr : posConfig.shortNameEn}
                        </div>
                      </Link>
                    </div>

                    {/* DESKTOP HOVER PREVIEW CARD (Hidden on mobile to prevent overflow) */}
                    {isHovered && (
                      <div className="hidden md:block absolute z-50 bottom-8 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-gradient-to-b from-[#0A2637] to-[#061824] border-2 border-[#FBBF24] shadow-[0_15px_40px_rgba(0,0,0,0.9)] text-left backdrop-blur-xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            <Image
                              src={branch.image || "/media/gallery/karad-outlet-tour.webp"}
                              alt={isMarathi ? branch.nameMr : branch.nameEn}
                              fill
                              sizes="50px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-[#FBBF24] block">
                              {isHQ
                                ? "★ मुख्य केंद्र (HQ)"
                                : isPort
                                ? "सागरी बंदर केंद्र"
                                : "अधिकृत दालन"}
                            </span>
                            <h4 className="text-xs font-black font-marathi-display text-white line-clamp-1">
                              {isMarathi ? branch.nameMr : branch.nameEn}
                            </h4>
                            <span className="text-[0.62rem] text-white/70 block">
                              {isMarathi ? branch.districtMr : branch.districtEn}
                            </span>
                          </div>
                        </div>

                        <p className="text-[0.65rem] text-white/80 line-clamp-2 font-marathi-body mb-2">
                          {isMarathi ? branch.taglineMr : branch.taglineEn}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[0.65rem] font-bold text-[#38BDF8]">
                          <span className="text-emerald-400">● आज ताजी आवक</span>
                          <span className="flex items-center gap-1 text-[#FBBF24]">
                            <span>दालन पहा</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* MOBILE ONLY: SELECTED PIN POPUP CARD BELOW MAP (Full width, no horizontal overflow) */}
          {selectedBranch && (
            <div className="block md:hidden mt-3 sm:mt-4 w-full max-w-full mx-auto p-4 rounded-2xl bg-gradient-to-b from-[#0A2637] to-[#061824] border-2 border-[#FBBF24]/60 shadow-[0_10px_30px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    <Image
                      src={selectedBranch.image || "/media/gallery/karad-outlet-tour.webp"}
                      alt={isMarathi ? selectedBranch.nameMr : selectedBranch.nameEn}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#FBBF24] block">
                      {selectedBranch.type === "hq"
                        ? "★ कराड मुख्य केंद्र (HQ)"
                        : selectedBranch.type === "port"
                        ? "सागरी बंदर केंद्र"
                        : "अधिकृत दालन"}
                    </span>
                    <h4 className="text-sm font-black font-marathi-display text-white line-clamp-1">
                      {isMarathi ? selectedBranch.nameMr : selectedBranch.nameEn}
                    </h4>
                    <span className="text-xs text-white/70 block font-marathi-body">
                      {isMarathi ? selectedBranch.districtMr : selectedBranch.districtEn}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedStoreId(null)}
                  className="min-h-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  aria-label="Close"
                >
                  <span className="text-base font-bold leading-none">✕</span>
                </button>
              </div>

              <p className="text-xs text-white/80 font-marathi-body line-clamp-2 mb-3 leading-relaxed">
                {isMarathi ? selectedBranch.taglineMr : selectedBranch.taglineEn}
              </p>

              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-3 pt-2 border-t border-white/10">
                <span>● {isMarathi ? "आज ताजी आवक उपलब्ध" : "Fresh Catch Available"}</span>
                <span className="text-white/60 font-mono-accent text-[0.68rem]">
                  {selectedBranch.phone}
                </span>
              </div>

              {/* Full width button min-height 44px */}
              <Link
                href={`/${locale}/branches/${selectedBranch.slug}`}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#25D366] text-white font-black text-sm uppercase tracking-wider font-marathi-display shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{isMarathi ? "दालन व उपलब्ध साठा पहा →" : "View Store & Stock →"}</span>
              </Link>
            </div>
          )}
        </div>

        {/* 4 FEATURE CARDS: 2x2 grid on mobile, 1 col on <=340px, icon on top, equal heights, 14-16px padding */}
        <div className="mt-8 grid grid-cols-1 min-[341px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0A9AD9]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                थेट बंदरावरून आवक
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                दररोज पहाटे ४:०० ची निवड
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                ०°C नैसर्गिक गारवा
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                १००% फॉर्मेलिनमुक्त हमी
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FBBF24]/20 text-[#FBBF24] flex items-center justify-center shrink-0 mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                ३० मिनिटांत घरपोच
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                स्थानिक दालनातून एक्सप्रेस सेवा
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#A855F7]/20 text-purple-300 flex items-center justify-center shrink-0 mb-2">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                २५+ सक्रिय दालने
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                महाराष्ट्रातील सर्वात मोठे नेटवर्क
              </p>
            </div>
          </div>
        </div>

        {/* VILLAGE & STORE DIRECTORY SECTION (QUICK FINDER BELOW MAP) */}
        <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-marathi-display text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-[#FBBF24]" />
                <span>
                  {isMarathi
                    ? "सर्व अधिकृत दालनांची यादी (आपले जवळचे दालन निवडा)"
                    : "Official Outlets Directory (Select Your Nearest Branch)"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-marathi-body mt-1">
                {isMarathi
                  ? "प्रत्येक दालनाच्या लिंकवर क्लिक करून त्या दुकानातील आजचा उपलब्ध साठा, पत्ता व थेट संपर्क पहा."
                  : "Click any branch to view today's available stock, exact address, and WhatsApp."}
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isMarathi
                    ? "गाव किंवा शहर शोधा (उदा. पाटण, विटा)..."
                    : "Search village (e.g. Patan, Vita)..."
                }
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#061A26] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {directoryBranches.slice(0, 12).map((branch) => {
              const isHQ = branch.id === "karad-hq";
              const isPort = branch.type === "port";
              return (
                <Link
                  key={branch.id}
                  href={`/${locale}/branches/${branch.slug}`}
                  className="min-h-0 group p-4 rounded-2xl bg-[#061E2C]/90 hover:bg-[#0A293D] border border-white/10 hover:border-[#38BDF8]/60 transition-all duration-300 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-full ${
                          isHQ
                            ? "bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/30"
                            : isPort
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-[#0A9AD9]/20 text-[#38BDF8] border border-[#0A9AD9]/30"
                        }`}
                      >
                        {isHQ
                          ? "★ मुख्य केंद्र (HQ)"
                          : isPort
                          ? "सागरी बंदर केंद्र"
                          : "अधिकृत दालन"}
                      </span>
                      <span className="text-[0.65rem] text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>आज चालू</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black font-marathi-display text-white group-hover:text-[#FBBF24] transition-colors line-clamp-1">
                      {isMarathi ? branch.nameMr : branch.nameEn}
                    </h4>

                    <p className="text-[0.68rem] text-white/60 font-marathi-body mt-1 line-clamp-2">
                      {isMarathi ? branch.addressMr : branch.addressEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold font-marathi-display text-[#38BDF8] group-hover:text-[#FBBF24]">
                    <span>
                      {isMarathi ? "उपलब्ध साठा व दालन पहा" : "View Live Stock"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Outlets Link Button if more than 12 */}
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/branches`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#082232] hover:bg-[#0C2F45] border border-white/20 hover:border-[#38BDF8] text-white font-bold text-sm transition-all shadow-md font-marathi-display"
            >
              <Store className="w-4 h-4 text-[#FBBF24]" />
              <span>
                {isMarathi
                  ? `महाराष्ट्रातील सर्व २५ दालने पहा (View All 25 Stores) →`
                  : `View All 25 Stores Across Maharashtra →`}
              </span>
            </Link>
          </div>
        </div>

        {/* FRANCHISE BUSINESS PARTNER INVITATION BANNER */}
        <div className="mt-10 sm:mt-12 rounded-3xl bg-gradient-to-r from-[#0C2A3C] via-[#092230] to-[#071924] border-2 border-[#FBBF24]/30 p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {isMarathi ? "फ्रँचायझी संधी (Business Partnership)" : "Franchise Opportunity"}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black font-marathi-display text-white">
              {isMarathi
                ? "आपल्या गावात / शहरात AN Fish World फ्रँचायझी सुरू करा!"
                : "Start an AN Fish World Store in Your Town or Village!"}
            </h3>
            <p className="text-xs sm:text-sm text-white/75 font-marathi-body max-w-2xl">
              {isMarathi
                ? "थेट बंदरावरून दररोज पहाटे अखंड ताजी आवक, ०°C कोल्ड चेन पुरवठा आणि कराडच्या लाडक्या ब्रँडचा संपूर्ण पाठबळ. कमी गुंतवणुकीत खात्रीशीर नफा!"
                : "Direct harbor supplies, 0°C cold chain network, and end-to-end operational support. Partner with Maharashtra's fastest growing seafood brand."}
            </p>
          </div>

          <a
            href={`https://wa.me/${PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              isMarathi
                ? "नमस्कार, मला AN Fish World ची नवीन फ्रँचायझी दालन सुरू करण्याविषयी सविस्तर माहिती हवी आहे."
                : "Hello, I want details regarding opening an AN Fish World franchise store."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D97706] text-[#071A24] font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(251,191,36,0.4)] cursor-pointer font-marathi-display"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>{isMarathi ? "फ्रँचायझी चौकशी करा" : "Inquire Franchise"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
