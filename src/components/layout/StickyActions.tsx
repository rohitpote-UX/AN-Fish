"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useScrollStore } from "@/store/scroll";
import { PLACEHOLDERS } from "@/data/placeholders";
import { MessageCircle, Phone } from "lucide-react";

export function StickyActions() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isMenuOpen = useScrollStore((state) => state.isMenuOpen);

  const phoneTel = PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "");
  const cleanWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आजच्या ताजी आवकमधून ऑर्डर करायची आहे."
      : "Hello AN Fish World Karad, I would like to order fresh fish."
  )}`;

  return (
    <div
      aria-label="Quick Actions Floating Hub"
      className={`fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-300 sm:bottom-7 sm:right-6 ${
        isMenuOpen ? "opacity-0 pointer-events-none translate-y-6" : "opacity-100 translate-y-0"
      }`}
    >
      {/* 1. Floating WhatsApp Circular Button with Hover Scale (Hotel Atithi Style) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AN Fish on WhatsApp"
        className="grid size-12 sm:size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <MessageCircle className="size-6 sm:size-7 fill-current" />
      </a>

      {/* 2. Floating Call Now Pill with Pulsing Ripple Effect (Hotel Atithi Style with AN Fish Blue) */}
      <a
        href={`tel:${phoneTel}`}
        aria-label={`Call AN Fish World on ${PLACEHOLDERS.CONTACT_PHONE}`}
        className="relative flex items-center gap-3 rounded-full bg-[#0A9AD9] p-1.5 text-white shadow-xl transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:py-2.5 sm:pl-2.5 sm:pr-5 border border-white/20"
      >
        {/* Pulsing Ripple Circle */}
        <span
          aria-hidden="true"
          className="absolute left-1.5 sm:left-2.5 grid size-11 place-items-center"
        >
          <span className="absolute size-11 animate-ping rounded-full bg-[#0A9AD9]/60" />
        </span>

        {/* White Phone Icon Circle */}
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#0A9AD9] shadow-sm">
          <Phone className="size-5 fill-[#0A9AD9]" />
        </span>

        {/* Desktop Text Details */}
        <span className="relative hidden leading-tight sm:block text-left">
          <span className="block text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/90 font-marathi-display">
            {isMarathi ? "कॉल करा" : "Call Now"}
          </span>
          <span className="block text-sm font-extrabold tabular-nums text-white">
            {PLACEHOLDERS.CONTACT_PHONE}
          </span>
        </span>
      </a>
    </div>
  );
}
