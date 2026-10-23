"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      data-section="faq"
      aria-label="Frequently Asked Questions"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] font-bold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t("tag")}</span>
        </div>

        <h2
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.05]`}
        >
          {t("title")}
        </h2>
      </div>

      {/* Accordion List (Framer Motion) */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const buttonId = `faq-btn-${idx}`;
          const contentId = `faq-content-${idx}`;

          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                isOpen
                  ? "bg-white border-[#0A9AD9] shadow-[0_8px_30px_rgba(10,154,217,0.08)]"
                  : "bg-[#F5F4F2] border-[#0F1F10]/08 hover:border-[#0F1F10]/20"
              }`}
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleAccordion(idx)}
                className="w-full py-5 px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus-visible:outline-[#0A9AD9]"
              >
                <span
                  className={`${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  } text-base sm:text-lg font-bold transition-colors ${
                    isOpen ? "text-[#0A9AD9]" : "text-[#0F1F10]"
                  }`}
                >
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-colors ${
                      isOpen ? "text-[#0A9AD9]" : "text-[#0F1F10]/40"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-6 pb-6 pt-1 text-sm sm:text-base text-[#0F1F10]/75 leading-relaxed border-t border-[#0F1F10]/06 ${
                        isMarathi ? "font-marathi-body" : "font-sans"
                      }`}
                    >
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
