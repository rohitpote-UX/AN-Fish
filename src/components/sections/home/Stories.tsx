"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Heart, Quote, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Stories() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const stories = [
    {
      id: "family-story",
      tagEn: "Family Kitchen Story",
      tagMr: "कौटुंबिक अनुभव",
      image: "/media/family-dinner.jpg",
      titleEn: "Fresh Surmai That Brought Back Nostalgic Konkan Memories",
      titleMr: "सुरमईच्या चवीने जागवल्या आजोळच्या कोकणातील आठवणी",
      quoteEn: "The surmai slices were odorless, juicy, and fried to perfection. My family couldn't believe we got coastal harbour quality right here in Malkapur.",
      quoteMr: "माशांचा वास न येणे आणि तळल्यावर अप्रतिम कुरकुरीतपणा — कराडमध्ये इतकी दर्जेदार मासोळी मिळणे हा आमच्यासाठी सुखद धक्का होता.",
      personEn: "Mrs. Sujata Kulkarni",
      personMr: "सौ. सुजाता कुलकर्णी",
      roleEn: "Home Cook & Loyal Customer, Malkapur Karad",
      roleMr: "गृहिणी, मलकापूर, कराड",
    },
    {
      id: "restaurant-story",
      tagEn: "Commercial Kitchen Story",
      tagMr: "हॉटेल व्यवसाय अनुभव",
      image: "/media/b2b-chef.jpg",
      titleEn: "Zero Waste and Five-Star Diner Reviews Across 300 Meals a Day",
      titleMr: "दररोज ३०० ग्राहकांसाठी शून्य नासाडी आणि दर्जेदार चव",
      quoteEn: "With AN Fish World's dawn delivery and 0°C ice slurry, we eliminated seafood spoilage. Our coastal curries have never received higher praise.",
      quoteMr: "ए एन फिश वर्ल्डच्या वेळेवर पुरवठ्यामुळे आणि ०°C शीतसाखळीमुळे माशांची नासाडी शून्य झाली. आमच्या ग्राहकांचा विश्वास आणखी वाढला आहे.",
      personEn: "Chef Deepak Pawar",
      personMr: "शेफ दीपक पवार",
      roleEn: "Executive Chef, Highway Katta Restaurant, Karad",
      roleMr: "कार्यकारी शेफ, हायवे कट्टा, कराड",
    },
  ];

  return (
    <section
      id="stories"
      aria-label="Customer and Kitchen Stories"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16"
    >
      {/* Header */}
      <div className="max-w-3xl text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
          <Heart className="w-3.5 h-3.5" />
          <span>{isMarathi ? "ग्राहकांचे अनुभव • STORIES" : "STORIES • ग्राहकांचे अनुभव"}</span>
        </div>

        <h2
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi
            ? "कुटुंबे आणि हॉटेल्स ए एन फिश वर्ल्ड का निवडतात?"
            : "How Families and Kitchens Choose AN Fish World."}
        </h2>

        <p
          className={`text-base sm:text-xl text-[#0F1F10]/70 leading-relaxed ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "खऱ्या ग्राहकांचे अनुभव, स्वयंपाकघरातील आनंद आणि विश्वासाची साक्ष."
            : "Real customer voices from dining tables and culinary kitchens across Western Maharashtra."}
        </p>
      </div>

      {/* Two Case-Study Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {stories.map((s) => (
          <div
            key={s.id}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#0F1F10]/10 hover:border-[#0A9AD9] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F1F10]">
              <Image
                src={s.image}
                alt={s.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#0F1F10] text-xs font-mono-accent font-bold uppercase tracking-wider shadow-sm">
                  {isMarathi ? s.tagMr : s.tagEn}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between flex-grow space-y-6">
              <div className="space-y-3">
                <h3
                  className={`text-2xl font-bold text-[#0F1F10] group-hover:text-[#0A9AD9] transition-colors leading-snug ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? s.titleMr : s.titleEn}
                </h3>
                <p className="text-sm sm:text-base text-[#0F1F10]/75 leading-relaxed italic">
                  &ldquo;{isMarathi ? s.quoteMr : s.quoteEn}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#0F1F10]/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F1F10]">
                    {isMarathi ? s.personMr : s.personEn}
                  </h4>
                  <p className="text-xs text-[#0F1F10]/50 font-mono-accent">
                    {isMarathi ? s.roleMr : s.roleEn}
                  </p>
                </div>
                <Link
                  href="/journal/stories"
                  className="w-9 h-9 rounded-full bg-[#EBF8FF] flex items-center justify-center text-[#0A9AD9] group-hover:bg-[#0A9AD9] group-hover:text-white transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
