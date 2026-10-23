"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { PLACEHOLDERS } from "@/data/placeholders";
import { useBasketStore } from "@/store/basket";
import {
  MapPin,
  Clock,
  Phone,
  Truck,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

export function KaradStoreSection() {
  const t = useTranslations("karadStore");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const openDrawer = useBasketStore((state) => state.openDrawer);

  return (
    <section
      id="karad-store"
      aria-label="Karad Retail Stores"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Information Column */}
        <div className="lg:col-span-7 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] font-bold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>KARAD HARBOUR OUTPOST</span>
          </div>

          <h2
            className={`${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            } text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.05]`}
          >
            {t("title")}
          </h2>

          <p
            className={`mt-4 text-base sm:text-lg text-[#0F1F10]/70 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {t("subtitle")}
          </p>

          {/* Outpost Details Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address */}
            <div className="p-5 rounded-2xl bg-white border border-[#0F1F10]/08 shadow-sm">
              <div className="flex items-center gap-2 text-[#0A9AD9] mb-1.5">
                <MapPin className="w-4 h-4" />
                <span className="text-[11px] font-mono-accent font-bold uppercase tracking-wider text-[#0F1F10]">
                  {t("addressTitle")}
                </span>
              </div>
              <p className="font-mono-accent text-xs text-[#0F1F10]/80 font-medium leading-relaxed">
                {PLACEHOLDERS.STORE_ADDRESS_KARAD}
              </p>
            </div>

            {/* Operating Hours */}
            <div className="p-5 rounded-2xl bg-white border border-[#0F1F10]/08 shadow-sm">
              <div className="flex items-center gap-2 text-[#0A9AD9] mb-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-mono-accent font-bold uppercase tracking-wider text-[#0F1F10]">
                  {t("hoursTitle")}
                </span>
              </div>
              <p className="font-mono-accent text-xs text-[#0F1F10]/80 font-medium leading-relaxed">
                {PLACEHOLDERS.DAILY_HOURS}
              </p>
            </div>

            {/* Phone */}
            <div className="p-5 rounded-2xl bg-white border border-[#0F1F10]/08 shadow-sm">
              <div className="flex items-center gap-2 text-[#0A9AD9] mb-1.5">
                <Phone className="w-4 h-4" />
                <span className="text-[11px] font-mono-accent font-bold uppercase tracking-wider text-[#0F1F10]">
                  {t("phoneTitle")}
                </span>
              </div>
              <p className="font-mono-accent text-xs text-[#0F1F10]/80 font-medium leading-relaxed">
                {PLACEHOLDERS.CONTACT_PHONE}
              </p>
            </div>

            {/* Delivery Coverage */}
            <div className="p-5 rounded-2xl bg-white border border-[#0F1F10]/08 shadow-sm">
              <div className="flex items-center gap-2 text-[#0A9AD9] mb-1.5">
                <Truck className="w-4 h-4" />
                <span className="text-[11px] font-mono-accent font-bold uppercase tracking-wider text-[#0F1F10]">
                  {t("deliveryTitle")}
                </span>
              </div>
              <p className="font-mono-accent text-xs text-[#0F1F10]/80 font-medium leading-relaxed">
                {PLACEHOLDERS.DELIVERY_RADIUS}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => openDrawer()}
              className="px-6 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#063A63] text-white text-xs font-mono-accent font-bold uppercase tracking-wider shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{tCommon("whatsappOrder")}</span>
            </button>

            <a
              href={`tel:${PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}
              className="px-6 py-3.5 rounded-full bg-white border border-[#0F1F10]/15 hover:border-[#0A9AD9] text-[#0F1F10] text-xs font-mono-accent font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#0A9AD9]" />
              <span>{tCommon("callStore")}</span>
            </a>
          </div>
        </div>

        {/* Right Map & Store Visual Column */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 p-8 shadow-sm flex flex-col items-center text-center">
            {/* Visual Radar Indicator */}
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-[#0A9AD9]/40 flex items-center justify-center my-6 bg-white shadow-inner">
              <MapPin className="w-10 h-10 text-[#0A9AD9] animate-bounce" />
            </div>

            <h3
              className={`${
                isMarathi ? "font-marathi-display" : "font-latin-display"
              } text-xl font-bold text-[#0F1F10] mb-2`}
            >
              AN Fish World — Karad Flagship
            </h3>
            <p className="text-xs text-[#0F1F10]/60 max-w-xs font-mono-accent mb-6 leading-relaxed">
              भाजी मंडई रोड, रविवार पेठ, कराड • मलकापूर, विद्यानगर व ओगलेवाडी जलद घरपोच डिलिव्हरी
            </p>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#0A9AD9] hover:text-white border border-[#0F1F10]/10 hover:border-[#0A9AD9] text-[#0F1F10] font-mono-accent font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t("viewOnMaps")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
