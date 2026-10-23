"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { JOURNAL_ARTICLES } from "@/data/journal";
import { BookOpen, ArrowUpRight, ArrowRight } from "lucide-react";

export function JournalSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  // Take top 3 articles
  const articles = JOURNAL_ARTICLES.slice(0, 3);

  return (
    <section
      id="journal-home"
      aria-label="Fish Talk Journal"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16"
    >
      {/* Header with Title and "See all" link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#0F1F10]/10 pb-8">
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isMarathi ? "जर्नल व माहिती • JOURNAL" : "JOURNAL • जर्नल व माहिती"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "मासोळीची चर्चा, साध्या सोप्या भाषेत." : "Fish Talk, Made Simple."}
          </h2>

          <p
            className={`text-base sm:text-lg text-[#0F1F10]/70 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "ताजी मासोळी कशी ओळखावी, स्वयंपाकासाठी चोख कटिंग आणि बंदरावरील थेट लिलावाचे रील्स."
              : "Practical fish buying guides, kitchen cooking secrets, and dock-side auction dispatches."}
          </p>
        </div>

        <Link
          href="/journal/media"
          className="inline-flex items-center gap-2 text-xs font-mono-accent font-bold uppercase tracking-wider text-[#0A9AD9] hover:text-[#063A63] transition-colors self-start sm:self-end pb-1 group"
        >
          <span>{isMarathi ? "सर्व लेख व व्हिडीओ पहा" : "See all"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 3 Journal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="group rounded-3xl overflow-hidden bg-[#F5F4F2] border border-[#0F1F10]/08 hover:border-[#0A9AD9] hover:bg-white transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F1F10]">
              <Image
                src={art.image}
                alt={art.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0F1F10] text-[11px] font-mono-accent font-bold uppercase tracking-wider shadow-xs">
                  {isMarathi ? art.categoryMr : art.categoryEn}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono-accent text-[#0F1F10]/50">
                  <span>{isMarathi ? art.dateMr : art.dateEn}</span>
                  <span>{isMarathi ? art.readTimeMr : art.readTimeEn}</span>
                </div>

                <h3
                  className={`text-xl font-bold text-[#0F1F10] group-hover:text-[#0A9AD9] transition-colors leading-snug ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? art.titleMr : art.titleEn}
                </h3>

                <p
                  className={`text-xs sm:text-sm text-[#0F1F10]/70 line-clamp-3 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {isMarathi ? art.excerptMr : art.excerptEn}
                </p>
              </div>

              <div className="pt-4 border-t border-[#0F1F10]/08 flex items-center justify-between text-xs font-mono-accent font-bold text-[#0A9AD9]">
                <Link
                  href="/journal/media"
                  className="flex items-center gap-1.5 hover:underline uppercase tracking-wider"
                >
                  <span>{isMarathi ? "संपूर्ण कथा वाचा" : "Full story"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
