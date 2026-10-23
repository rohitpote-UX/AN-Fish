import React from "react";
import { Branch } from "@/types";
import { MapPin, Clock, Phone, Navigation, ExternalLink } from "lucide-react";

interface BranchDetailCardProps {
  branch: Branch;
  locale: string;
}

export function BranchDetailCard({ branch, locale }: BranchDetailCardProps) {
  const isMarathi = locale === "mr";

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#063A63]/30 to-[#02111F]/80 border border-[#6EC6F0]/20 p-8 sm:p-10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-[#0A9AD9] transition-all duration-300 shadow-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <span className="px-3 py-1 rounded-full bg-[#0A9AD9]/20 border border-[#0A9AD9]/40 text-[#6EC6F0] text-xs font-mono-accent uppercase tracking-wider">
            {branch.id === "karad-flagship" ? "Flagship Store" : "Express Outlet"}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-accent">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open Today</span>
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white">
          {isMarathi ? branch.nameMr : branch.nameEn}
        </h3>

        <div className="space-y-4 text-sm text-[#E9F7FF]/80">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#0A9AD9] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                {isMarathi ? "पत्ता / Address:" : "Address:"}
              </p>
              <p className="text-xs sm:text-sm mt-0.5">
                {isMarathi ? branch.addressMr : branch.addressEn}
              </p>
              <p className="text-xs text-[#6EC6F0] mt-1 font-mono-accent">
                Landmark: {isMarathi ? branch.landmarkMr : branch.landmarkEn}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#6EC6F0] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                {isMarathi ? "वेळ / Hours:" : "Daily Timings:"}
              </p>
              <p className="text-xs sm:text-sm mt-0.5">
                {isMarathi ? branch.hoursMr : branch.hoursEn}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                {isMarathi ? "संपर्क / Direct Call:" : "Direct Call:"}
              </p>
              <p className="text-xs sm:text-sm font-mono-accent mt-0.5">
                {branch.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#6EC6F0]/15 flex flex-wrap gap-4">
        <a
          href={branch.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>{isMarathi ? "गुगल मॅपवर पहा" : "Get Directions"}</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>

        <a
          href={`tel:${branch.phone.replace(/[^0-9+]/g, "")}`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#6EC6F0]" />
          <span>{isMarathi ? "कॉल करा" : "Call Outlet"}</span>
        </a>
      </div>
    </div>
  );
}
