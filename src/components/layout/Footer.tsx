"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { ArrowUp, MapPin, Phone, Clock, ArrowRight, Globe } from "lucide-react";

interface FooterLink {
  href: string;
  labelEn: string;
  labelMr: string;
}

interface FooterColumn {
  id: string;
  titleEn: string;
  titleMr: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "col-an",
    titleEn: "AN Fish World",
    titleMr: "ए एन फिश वर्ल्ड",
    links: [
      { href: "/our-story", labelEn: "Our Story", labelMr: "आमची ओळख (Our Story)" },
      { href: "/contact", labelEn: "Let's Talk", labelMr: "संपर्क साधा (Let's Talk)" },
    ],
  },
  {
    id: "col-fish",
    titleEn: "Our Fish",
    titleMr: "आमची मासोळी",
    links: [
      { href: "/catch", labelEn: "For Your Family", labelMr: "घरच्या जेवणासाठी (For Your Family)" },
      { href: "/wholesale", labelEn: "For Your Business", labelMr: "हॉटेल्स व व्यवसायासाठी (For Your Business)" },
    ],
  },
  {
    id: "col-freshness",
    titleEn: "Our Freshness",
    titleMr: "आमचा ताजेपणा",
    links: [
      { href: "/our-freshness/the-fresh-chain", labelEn: "The Fresh Chain", labelMr: "अखंड शीतसाखळी (The Fresh Chain)" },
      { href: "/our-freshness/clean-and-cut", labelEn: "Clean & Cut", labelMr: "स्वच्छता व कटिंग (Clean & Cut)" },
    ],
  },
  {
    id: "col-journal",
    titleEn: "Journal",
    titleMr: "जर्नल व माहिती",
    links: [
      { href: "/journal/media", labelEn: "Videos & Media", labelMr: "व्हिडीओ व प्रसारमाध्यमे (Videos & Media)" },
      { href: "/catch", labelEn: "Fish Guide", labelMr: "मासोळी मार्गदर्शक (Fish Guide)" },
      { href: "/journal/stories", labelEn: "Customer Stories", labelMr: "ग्राहकांचे अनुभव (Customer Stories)" },
    ],
  },
  {
    id: "col-legals",
    titleEn: "Legals",
    titleMr: "कायदेशीर बाबी",
    links: [
      { href: "/privacy", labelEn: "Privacy Policy", labelMr: "गोपनीयता धोरण (Privacy Policy)" },
      { href: "/terms", labelEn: "Terms of Use", labelMr: "वापराच्या अटी (Terms of Use)" },
    ],
  },
];

interface BranchLocation {
  id: string;
  cityEn: string;
  cityMr: string;
  subtitleEn: string;
  subtitleMr: string;
  addressEn: string;
  addressMr: string;
  phone: string;
  timingEn: string;
  timingMr: string;
}

const BRANCHES: BranchLocation[] = [
  {
    id: "karad-malkapur",
    cityEn: "Karad (Malkapur)",
    cityMr: "कराड (मलकापूर)",
    subtitleEn: "Flagship Counter & Cold-Chain Hub",
    subtitleMr: "मुख्य दालन व शीतसाखळी केंद्र",
    addressEn: "NH-4 Malkapur Bypass Road, Karad, Maharashtra 415539",
    addressMr: "एनएच-४ मलकापूर बायपास रोड, कराड, महाराष्ट्र ४१५५३९",
    phone: "+91 98224 56789",
    timingEn: "6:30 AM – 1:30 PM | 4:30 PM – 9:00 PM",
    timingMr: "सकाळी ६:३० – १:३० | संध्याकाळी ४:३० – ९:००",
  },
  {
    id: "patan-mhavashi",
    cityEn: "Patan Mhavashi",
    cityMr: "पाटण (म्हावशी)",
    subtitleEn: "Daily Fresh Catch Express Counter",
    subtitleMr: "दैनिक ताजी मासोळी एक्स्प्रेस दालन",
    addressEn: "Patan-Karad Road, Mhavashi Phata, Patan, Maharashtra 415206",
    addressMr: "पाटण-कराड रोड, म्हावशी फाटा, पाटण, महाराष्ट्र ४१५२०६",
    phone: "+91 98224 56789",
    timingEn: "7:00 AM – 1:00 PM | 5:00 PM – 8:30 PM",
    timingMr: "सकाळी ७:०० – १:०० | संध्याकाळी ५:०० – ८:३०",
  },
  {
    id: "ishwarpur",
    cityEn: "Ishwarpur",
    cityMr: "ईश्वरपूर (इस्लामपूर)",
    subtitleEn: "Retail Counter & Home Deliveries",
    subtitleMr: "किरकोळ विक्री दालन व होम डिलिव्हरी",
    addressEn: "Main Market Road, Islampur / Ishwarpur, Maharashtra 415409",
    addressMr: "मुख्य बाजारपेठ रस्ता, इस्लामपूर / ईश्वरपूर, महाराष्ट्र ४१५४०९",
    phone: "+91 98224 56789",
    timingEn: "7:00 AM – 1:00 PM | 5:00 PM – 8:30 PM",
    timingMr: "सकाळी ७:०० – १:०० | संध्याकाळी ५:०० – ८:३०",
  },
];

// Lucide-style brand SVG components
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      data-section="footer"
      aria-label="Site Footer"
      className="relative bg-[#0F1F10] text-[#FFFFFF] border-t border-white/10 pt-12 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-12 z-10 selection:bg-[#0A9AD9]"
    >
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* SECTION 1: Branch Lines (Mirroring Alethia's 2 Offices Architecture) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-mono-accent uppercase tracking-widest text-[#0A9AD9] font-bold block">
                {isMarathi ? "आमची दालने व पत्ते" : isHindi ? "हमारी शाखाएं व पते" : "Retail Outposts & Hubs"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {isMarathi ? "कराड आणि पश्चिम महाराष्ट्रातील दालने" : isHindi ? "कराड और पश्चिम महाराष्ट्र की शाखाएं" : "Our Branch Locations"}
              </h3>
            </div>

            {/* Social Icons (Instagram, YouTube, Facebook with Lucide aesthetic) */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/an.fishworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AN Fish World on Instagram (@an.fishworld)"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#6EC6F0] hover:text-[#6EC6F0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@anfishworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to AN Fish World on YouTube (@anfishworld)"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#6EC6F0] hover:text-[#6EC6F0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with AN Fish World on Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#0A9AD9] hover:text-[#0A9AD9] flex items-center justify-center transition-colors cursor-pointer"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{isMarathi || isHindi ? branch.subtitleMr : branch.subtitleEn}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight mt-1.5">
                    {isMarathi || isHindi ? branch.cityMr : branch.cityEn}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed mt-2 font-mono-accent">
                    {isMarathi || isHindi ? branch.addressMr : branch.addressEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono-accent">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{isMarathi || isHindi ? branch.timingMr : branch.timingEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6EC6F0] font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{branch.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: 5 Columns Navigation (Alethia's Exact Structure) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 border-t border-white/10 pt-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.id} className="space-y-4">
              <span className="text-xs font-mono-accent uppercase tracking-wider text-[#0A9AD9] font-bold block">
                {isMarathi || isHindi ? col.titleMr : col.titleEn}
              </span>
              <ul className="space-y-2.5 text-sm font-medium">
                {col.links.map((link) => (
                  <li key={link.href + link.labelEn}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group/link"
                    >
                      <span>{isMarathi || isHindi ? link.labelMr : link.labelEn}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#0A9AD9]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SECTION 4: Marathi Cultural Sign-off Line */}
        <div className="text-center py-6 border-y border-white/10">
          <p className="text-2xl sm:text-3xl font-bold text-white font-marathi-display tracking-wide">
            &ldquo;खुश रहा, मासे खावा&rdquo;
          </p>
          <span className="text-[11px] font-mono-accent uppercase tracking-widest text-[#0A9AD9] mt-1.5 block font-semibold">
            — {isMarathi ? "कराडची लाडकी फिश कंपनी" : isHindi ? "कराड की चहेती फिश कंपनी" : "AN Fish World Karad"}
          </span>
        </div>

        {/* SECTION 5: Awwwards Architectural Colophon & Studio Credits */}
        <div className="space-y-6">
          {/* Website credit: Abnexa */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:flex-row sm:px-6">
            <p className="text-center text-sm text-white/70 sm:text-left">
              {isMarathi ? "वेबसाईट डिझाईन व निर्मिती:" : isHindi ? "वेबसाइट डिज़ाइन एवं निर्माण:" : "Website designed & developed by"}{" "}
              <a
                href="https://abnexa.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white transition-colors hover:text-[#38BDF8]"
              >
                Abnexa
              </a>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href="https://abnexa.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abnexa website (opens in new tab)"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#38BDF8]/60 hover:bg-white/10"
              >
                <Globe className="size-3.5 text-[#38BDF8]" />
                abnexa.in
              </a>
              <a
                href="tel:+919689030301"
                aria-label="Call Abnexa on +91 96890 30301"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#38BDF8]/60 hover:bg-white/10"
              >
                <Phone className="size-3.5 text-[#38BDF8]" />
                +91 96890 30301
              </a>
            </div>
          </div>

          {/* Bottom Meta & Back to Top Bar (With clearance for Sticky WhatsApp Action) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-accent text-white/50 pt-3 pb-8 md:pr-48">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} AN Fish World. All rights reserved.
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9]" />
              <span>17.2892° N, 74.1818° E • 0°C UNBROKEN COLD CHAIN</span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to Top"
              className="group/top flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#0A9AD9]/50 text-white transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-[0_0_20px_rgba(10,154,217,0.25)] shrink-0"
            >
              <span className="font-semibold text-xs tracking-wider">{isMarathi ? "वर जा" : isHindi ? "ऊपर जाएं" : "Back to top"}</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#0A9AD9] transition-transform duration-300 group-hover/top:-translate-y-1" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

