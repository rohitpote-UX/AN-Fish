"use client";

import React, { useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDERS } from "@/data/placeholders";
import { X, Phone, Clock, Compass } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Esc key & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Trap focus
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    // GSAP Stagger Entrance for Menu Links
    if (linksContainerRef.current) {
      const items = linksContainerRef.current.querySelectorAll(".menu-link-wrapper");
      gsap.fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    {
      href: "/",
      en: "Home",
      mr: "मुखपृष्ठ (The Dive)",
      subMr: "कराडची लाडकी मासोळी • ० ते १०० मी. प्रवास",
    },
    {
      href: "/catch",
      en: "Today's Catch",
      mr: "आजची ताजी आवक",
      subMr: "सिल्व्हर पापलेट, सुरमई, रावस, टायगर कोळंबी",
    },
    {
      href: "/about",
      en: "About",
      mr: "आपली लाडकी परंपरा",
      subMr: "कुटुंबासारखी निवड • प्रीतीसंगम, कराड",
    },
    {
      href: "/branches",
      en: "Branches",
      mr: "कराड व मलकापूर दालने",
      subMr: "मुख्य दालन व एक्सप्रेस काऊंटर",
    },
    {
      href: "/wholesale",
      en: "Wholesale",
      mr: "हॉटेल्स व ठोक पुरवठा",
      subMr: "०°C लिक्विड आईस अखंड शीतसाखळी (B2B)",
    },
    {
      href: "/contact",
      en: "Contact",
      mr: "संपर्क व थेट ऑर्डर",
      subMr: "घरपोच डिलिव्हरी व केटरिंग आरक्षण",
    },
  ];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-[70] bg-[#02111F] text-[#E9F7FF] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto selection:bg-[#0A9AD9]"
    >
      {/* Top Header inside Overlay */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5 text-[#0A9AD9] animate-spin-slow" />
          <span className="text-xs font-mono uppercase tracking-[0.08em] text-[#6EC6F0]">
            AN FISH WORLD • KARAD
          </span>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close Navigation Menu"
          className="p-3 rounded-full bg-white/5 border border-white/15 text-white hover:bg-[#0A9AD9]/20 hover:border-[#0A9AD9] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0A9AD9]"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Links (Huge Type + Vertical Roll Hover) */}
      <div ref={linksContainerRef} className="max-w-5xl w-full mx-auto my-auto py-10 space-y-4 sm:space-y-6">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href;
          const primaryText = locale === "mr" ? link.mr : link.en;
          const alternateText = locale === "mr" ? link.en : link.mr;

          return (
            <div key={link.href} className="menu-link-wrapper group">
              <Link
                href={link.href}
                onClick={onClose}
                className="block focus-visible:outline-2 focus-visible:outline-[#0A9AD9] rounded-2xl py-1"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="text-xs sm:text-sm font-mono text-white/30 group-hover:text-[#0A9AD9] transition-colors">
                      0{idx + 1}
                    </span>

                    {/* Vertical Roll on Hover */}
                    <div className="overflow-hidden h-[1.18em] relative select-none">
                      <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                        <div
                          className={`h-[1.18em] flex items-center text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight ${
                            isActive ? "text-[#0A9AD9]" : "text-white"
                          }`}
                        >
                          {primaryText}
                        </div>
                        <div className="h-[1.18em] flex items-center text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#6EC6F0]">
                          {alternateText}
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="hidden md:inline-block text-xs font-mono uppercase tracking-[0.08em] text-[#6EC6F0]/70 group-hover:text-white transition-colors">
                    {link.subMr}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Details */}
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs font-mono text-white/70">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0A9AD9]" />
            <span>{PLACEHOLDERS.DAILY_HOURS}</span>
          </div>
          <a
            href={`tel:${PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{PLACEHOLDERS.CONTACT_PHONE}</span>
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-[0.08em] text-white/40">Follow:</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#6EC6F0] hover:text-[#6EC6F0] transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#6EC6F0] hover:text-[#6EC6F0] transition-colors"
          >
            <YoutubeIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
