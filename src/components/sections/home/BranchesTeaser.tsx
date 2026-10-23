import React from "react";
import { Link } from "@/i18n/routing";
import { BRANCHES_LIST } from "@/data/branches";
import { MapPin, Clock, ArrowRight } from "lucide-react";

export function BranchesTeaser({ locale = "mr" }: { locale?: string }) {
  const isMarathi = locale === "mr";

  return (
    <section
      id="branches-teaser"
      data-section="branches-teaser"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063A63]/30 border border-[#0A9AD9]/40 text-xs font-mono-accent text-[#6EC6F0] mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>OUTPOSTS • KARAD RETAIL</span>
          </div>

          <h2
            className={`${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            } text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight`}
          >
            {isMarathi ? "आमच्या दालनांना भेट द्या" : "Visit Our Retail Outposts"}
          </h2>
        </div>

        <Link
          href="/branches"
          className="inline-flex items-center gap-2 text-xs font-mono-accent text-[#6EC6F0] hover:text-white uppercase tracking-wider"
        >
          <span>{isMarathi ? "सर्व शाखा पहा" : "View All Branches"}</span>
          <ArrowRight className="w-4 h-4 text-[#0A9AD9]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRANCHES_LIST.map((b) => (
          <div
            key={b.id}
            className="p-8 rounded-2xl bg-[#02111F]/80 border border-[#6EC6F0]/20 hover:border-[#0A9AD9] backdrop-blur-md transition-all duration-300"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              {isMarathi ? b.nameMr : b.nameEn}
            </h3>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0A9AD9] flex-shrink-0 mt-0.5" />
                <span className="font-mono-accent text-xs">
                  {isMarathi ? b.addressMr : b.addressEn}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#6EC6F0] flex-shrink-0" />
                <span className="font-mono-accent text-xs">
                  {isMarathi ? b.hoursMr : b.hoursEn}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono-accent text-[#6EC6F0]">
                {b.phone}
              </span>
              <a
                href={b.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5"
              >
                <span>{isMarathi ? "नकाशा पहा" : "Maps"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0A9AD9]" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
