"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export function LangSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const nextLocale = locale === "mr" ? "en" : "mr";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      id="lang-switch-toggle"
      type="button"
      onClick={handleToggle}
      aria-label={`Switch language to ${locale === "mr" ? "English" : "Marathi"}`}
      className={`px-3 py-1.5 rounded-full border border-[#6EC6F0]/30 hover:border-[#6EC6F0] bg-[#02111F]/60 text-xs font-semibold tracking-wider text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${className}`}
    >
      <span className="text-[#0A9AD9] text-[10px] font-mono-accent">
        {locale.toUpperCase()}
      </span>
      <span className="text-white/40">/</span>
      <span>{locale === "mr" ? "English" : "मराठी"}</span>
    </button>
  );
}
