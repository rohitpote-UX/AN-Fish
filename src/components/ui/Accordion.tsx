"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useScrollStore } from "@/store/scroll";
import { framerTransitions } from "@/lib/motion";

export interface AccordionItemData {
  id: string;
  title: string;
  content: string | React.ReactNode;
  category?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenIndex?: number | null;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  className = "",
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== null && defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  const toggle = (idx: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(idx) ? [] : [idx]));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const btnId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <motion.div
            key={item.id}
            layout={!reducedMotion}
            transition={reducedMotion ? { duration: 0 } : framerTransitions.waterFast}
            className={`rounded-3xl border transition-colors overflow-hidden backdrop-blur-md ${
              isOpen
                ? "bg-[#063A63]/30 border-[#0A9AD9]/60 shadow-[0_4px_24px_rgba(10,154,217,0.15)]"
                : "bg-[#02111F]/70 border-white/10 hover:border-white/20"
            }`}
          >
            {/* Header Trigger Button */}
            <button
              id={btnId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(idx)}
              className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0A9AD9] focus-visible:outline-offset-[-2px] select-none"
            >
              <div className="space-y-1">
                {item.category && (
                  <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#6EC6F0] block">
                    // {item.category}
                  </span>
                )}
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {item.title}
                </span>
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.25 }}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#6EC6F0]"
              >
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </motion.div>
            </button>

            {/* Expandable Region with Framer Layout Animation */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  layout={!reducedMotion}
                  initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reducedMotion ? { duration: 0 } : framerTransitions.waterFast}
                  className="overflow-hidden"
                >
                  <div className="px-6 sm:px-8 pb-6 pt-2 text-sm sm:text-base text-[#E9F7FF]/80 leading-relaxed border-t border-white/5">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
