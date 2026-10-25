"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Users, Award, ShieldCheck, Heart } from "lucide-react";

interface TeamMember {
  id: string;
  nameEn: string;
  nameMr: string;
  roleEn: string;
  roleMr: string;
  image: string;
  bioEn: string;
  bioMr: string;
  badgeEn: string;
  badgeMr: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "founder",
    nameEn: "Ameer Nadaf",
    nameMr: "अमीर नदाफ",
    roleEn: "Owner of AN Fish • Founder / CEO",
    roleMr: "ए एन फिशचे मालक • संस्थापक / CEO",
    image: "/media/founder-owner.jpg",
    bioEn: "Visionary Owner of AN Fish, Founder & CEO. Pioneered direct Ratnagiri harbour dawn procurement and established Karad's first dedicated 0°C liquid slurry retail hub and strict chemical-free standards.",
    bioMr: "ए एन फिशचे आदरणीय मालक, संस्थापक व मुख्य कार्यकारी अधिकारी (CEO). पहाटेच्या थेट सागरी लिलाव खरेदीचे प्रणेते आणि कराडमध्ये अखंड ०°C शीतसाखळी दालनाची यशस्वी उभारणी.",
    badgeEn: "Owner • Founder & CEO",
    badgeMr: "मालक • संस्थापक व CEO",
  },
  {
    id: "operations",
    nameEn: "Nitin Pawar",
    nameMr: "नितीन पवार",
    roleEn: "Head of Cold-Chain & Dock Logistics",
    roleMr: "प्रमुख, शीतसाखळी व बंदर वाहतूक",
    image: "/media/harbour-catch.jpg",
    bioEn: "Oversees 4:00 AM auction selections and manages continuous temperature-controlled transit across the Western Ghats.",
    bioMr: "पहाटे ४:०० च्या लिलावातून मासे निवडणे आणि घाटातून कराडपर्यंत सुरक्षित तापमान नियंत्रण सांभाळणे.",
    badgeEn: "Logistics Lead",
    badgeMr: "वाहतूक प्रमुख",
  },
  {
    id: "master-cutter",
    nameEn: "Santosh Kadam",
    nameMr: "संतोष कदम",
    roleEn: "Master Fishmonger & Kitchen Cut Specialist",
    roleMr: "मास्टर कटिंग कारागीर व स्वच्छता प्रमुख",
    image: "/media/cutting-hygiene.jpg",
    bioEn: "Over 18 years of traditional cutting mastery; trains all counter personnel in RO water washing and chef-grade portioning.",
    bioMr: "१८ वर्षांहून अधिक कटिंगचा अनुभव; सर्व कर्मचाऱ्यांना आरओ पाण्यातील स्वच्छता व चोख कटिंगचे प्रशिक्षण.",
    badgeEn: "Master Artisan",
    badgeMr: "कटिंग तज्ज्ञ",
  },
  {
    id: "b2b-relations",
    nameEn: "Chef Deepak Salunkhe",
    nameMr: "शेफ दीपक साळुंखे",
    roleEn: "Hospitality & Wholesale Supply Lead",
    roleMr: "हॉटेल्स व घाऊक पुरवठा प्रमुख",
    image: "/media/b2b-chef.jpg",
    bioEn: "Partners directly with executive chefs and wedding caterers across Satara district for guaranteed zero-waste seafood fulfillment.",
    bioMr: "सातारा व कराडमधील नामांकित हॉटेल्स आणि केटरर्ससाठी वेळेवर घाऊक मासोळी पुरवठ्याची हमी.",
    badgeEn: "Culinary Lead",
    badgeMr: "हॉस्पिटॅलिटी प्रमुख",
  },
];

export function TeamSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  return (
    <section
      id="team"
      aria-label="Our Leadership Team"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16"
    >
      {/* Header */}
      <div className="max-w-3xl text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>{isMarathi ? "आमची माणसे • LEADERSHIP & TEAM" : "LEADERSHIP & CRAFT • आमची माणसे"}</span>
        </div>

        <h2
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "ताजेपणाच्या पाठीशी उभी असलेली विश्वासू माणसे." : "The People Who Guard Your Freshness."}
        </h2>

        <p
          className={`text-base sm:text-xl text-[#0F1F10]/70 leading-relaxed ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "पहाटेच्या बंदरावर उभे राहणाऱ्या खरेदीदारांपासून ते दालनातील कुशल कटिंग तज्ज्ञांपर्यंत — एका ध्येयाने काम करणारी टीम."
            : "From dawn dock selectors bidding before sunrise to counter artisans slicing with surgical precision."}
        </p>
      </div>

      {/* Team Cards Grid (Alethia Reference Style with Hover Expansion) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {TEAM_MEMBERS.map((m) => (
          <div
            key={m.id}
            className="group rounded-3xl overflow-hidden bg-white border border-[#0F1F10]/10 hover:border-[#0A9AD9] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Portrait Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0F1F10]">
              <Image
                src={m.image}
                alt={m.nameEn}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0F1F10] text-[11px] font-mono-accent font-bold uppercase tracking-wider shadow-xs">
                  {isMarathi ? m.badgeMr : m.badgeEn}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3
                  className={`text-xl font-bold leading-tight ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? m.nameMr : m.nameEn}
                </h3>
                <p className="text-xs text-[#6EC6F0] font-mono-accent font-medium mt-0.5">
                  {isMarathi ? m.roleMr : m.roleEn}
                </p>
              </div>
            </div>

            {/* Bio on Card Bottom */}
            <div className="p-5 flex-grow flex flex-col justify-between bg-[#F5F4F2] group-hover:bg-white transition-colors border-t border-[#0F1F10]/08">
              <p
                className={`text-xs text-[#0F1F10]/75 leading-relaxed ${
                  isMarathi ? "font-marathi-body" : "font-sans"
                }`}
              >
                {isMarathi ? m.bioMr : m.bioEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
