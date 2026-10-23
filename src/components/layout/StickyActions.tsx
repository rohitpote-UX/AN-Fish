"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useScrollStore } from "@/store/scroll";
import { PLACEHOLDERS } from "@/data/placeholders";
import { MessageCircle, Phone } from "lucide-react";

export function StickyActions() {
  const locale = useLocale();
  const isMenuOpen = useScrollStore((state) => state.isMenuOpen);

  const phoneTel = PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    locale === "mr"
      ? "नमस्कार ए एन फिश वर्ल्ड कराड, मला ताजी मासोळी ऑर्डर करायची आहे."
      : "Hello AN Fish World Karad, I would like to order fresh fish."
  )}`;

  return (
    <aside
      aria-label="Quick Order and Support Contacts"
      className={`fixed z-40 flex items-center gap-3 transition-all duration-300 ${
        isMenuOpen ? "opacity-0 pointer-events-none translate-y-6" : "opacity-100 translate-y-0"
      }`}
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
        right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
      }}
    >
      {/* Mobile Only: Direct Phone Call Button */}
      <a
        href={`tel:${phoneTel}`}
        aria-label="Call AN Fish World Karad Outlet"
        className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-[#02111F]/90 border border-white/20 text-white shadow-xl backdrop-blur-md transition-transform active:scale-95 hover:border-[#6EC6F0]"
      >
        <Phone className="w-5 h-5 text-emerald-400" />
      </a>

      {/* WhatsApp Action Pill (Mobile + Desktop) */}
      <a
        id="sticky-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order fresh fish on WhatsApp"
        className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-xs uppercase tracking-[0.08em] shadow-[0_0_24px_rgba(10,154,217,0.5)] transition-all duration-200 cursor-pointer active:scale-95"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span className="hidden sm:inline">
          {locale === "mr" ? "व्हॉट्सॲप ऑर्डर" : "WhatsApp Order"}
        </span>
      </a>
    </aside>
  );
}
