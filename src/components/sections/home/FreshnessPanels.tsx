"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { ThermometerSnowflake, ShieldCheck, Clock, Check, ArrowRight, Radio } from "lucide-react";

export function FreshnessPanels() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [activeTab, setActiveTab] = useState<"chain" | "clean" | "board">("chain");

  return (
    <section
      id="freshness"
      aria-label="Our Freshness Technology Panels"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white text-[#071A24] relative selection:bg-[#0B9DD8] border-t border-[#071A24]/08"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Block */}
        <div className="max-w-3xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/25 text-xs font-mono-accent text-[#0B9DD8] uppercase tracking-wider font-bold">
            <ThermometerSnowflake className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>{isMarathi ? "आमचा ताजेपणा • OUR FRESHNESS" : "OUR FRESHNESS • आमचा ताजेपणा"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#071A24] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "ताजे. स्वच्छ. विश्वासार्ह." : "Fresh. Clean. Trusted."}
          </h2>

          <p
            className={`text-base sm:text-xl text-[#071A24]/75 font-normal leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "पहाटे ४:०० बंदरावरील लिलावापासून ते तुमच्या हातातील कटिंगपर्यंत, आम्ही पाळतो एकही तडजोड नसलेली अखंड शीतसाखळी."
              : "From 4:00 AM coastal harbour auctions to sanitized counter displays, our sub-zero protocol guarantees pure natural flavour."}
          </p>
        </div>

        {/* Panel Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-[#071A24]/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("chain")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono-accent uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "chain"
                ? "bg-[#071A24] text-white shadow-md"
                : "bg-[#F5F4EF] hover:bg-[#EBF8FF] text-[#071A24]/75 border border-[#071A24]/08"
            }`}
          >
            <span>{isMarathi ? "अखंड शीतसाखळी (The Fresh Chain)" : "Panel A: The Fresh Chain"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clean")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono-accent uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "clean"
                ? "bg-[#071A24] text-white shadow-md"
                : "bg-[#F5F4EF] hover:bg-[#EBF8FF] text-[#071A24]/75 border border-[#071A24]/08"
            }`}
          >
            <span>{isMarathi ? "स्वच्छता व कटिंग (Clean & Cut)" : "Panel B: Clean & Cut"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("board")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono-accent uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "board"
                ? "bg-[#071A24] text-white shadow-md"
                : "bg-[#F5F4EF] hover:bg-[#EBF8FF] text-[#071A24]/75 border border-[#071A24]/08"
            }`}
          >
            <span>{isMarathi ? "थेट आवक बोर्ड (Counter Board)" : "Panel C: Today's Counter Board"}</span>
          </button>
        </div>

        {/* Content Panels */}
        <div className="min-h-[460px]">
          {/* PANEL A: The Fresh Chain */}
          {activeTab === "chain" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn">
              <div className="lg:col-span-6 space-y-6 text-left">
                <span className="text-xs font-mono-accent text-[#0B9DD8] uppercase font-bold tracking-widest block">
                  // PROTOCOL 01: HARBOUR TO COUNTER
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#071A24] tracking-tight leading-tight">
                  {isMarathi ? "समुद्र ते कराड: ६ तासांत सुरक्षित प्रवास" : "The Fresh Chain: From Catch to Counter"}
                </h3>
                <p className="text-base text-[#071A24]/75 leading-relaxed">
                  {isMarathi
                    ? "रत्नागिरी आणि मालवणच्या बंदरांवर पहाटे ४:०० वाजता बोटी लागल्यापासून प्रत्येक मासा ०°C सब-झिरो लिक्विड आईस स्लरीमध्ये सुरक्षित केला जातो. कोरड्या बर्फासारखा पेशींना धक्का न लावता नैसर्गिक रस शाबूत राहतो."
                    : "Immediately upon dock landing, wild catches are enveloped in calibrated 0°C liquid ice slurry. Unlike coarse flake ice that bruises tissue, micro-slurry maintains thermal equilibrium across the entire ghat transit."}
                </p>

                <div className="space-y-3 text-sm text-[#071A24]/85 font-mono-accent">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#0B9DD8]" />
                    <span>{isMarathi ? "४:०० AM थेट बोटीवरून खरेदी" : "4:00 AM Direct Pier Auction Sourcing"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#0B9DD8]" />
                    <span>{isMarathi ? "०°C - २°C सतत नियंत्रित तापमान" : "0°C - 2°C Slurry Temperature Lock"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{isMarathi ? "१००% फॉर्मेलिन व अमोनियामुक्त" : "0.0% Formalin & Chemical Preservatives"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/catch"
                    className="inline-flex items-center gap-2 text-xs font-mono-accent text-[#0B9DD8] font-bold uppercase tracking-wider hover:text-[#071A24] transition-colors"
                  >
                    <span>{isMarathi ? "शीतसाखळी तपशील जाणून घ्या" : "Explore Fresh Chain Protocol"}</span>
                    <ArrowRight className="w-4 h-4 text-[#0B9DD8]" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#071A24]/10 shadow-xl group">
                <Image
                  src="/media/harbour-catch.jpg"
                  alt="4:00 AM harbor auction catch"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono-accent">
                  <span className="text-white font-bold">MALVAN PIER • 4:15 AM</span>
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#071A24] font-bold">0°C ICE SLURRY</span>
                </div>
              </div>
            </div>
          )}

          {/* PANEL B: Clean & Cut */}
          {activeTab === "clean" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn">
              <div className="lg:col-span-6 space-y-6 text-left">
                <span className="text-xs font-mono-accent text-[#0B9DD8] uppercase font-bold tracking-widest block">
                  // PROTOCOL 02: HYGIENE & CUTTING
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#071A24] tracking-tight leading-tight">
                  {isMarathi ? "स्वच्छता व कटिंग: तुमच्या पसंतीप्रमाणे" : "Clean & Cut: Hygiene and Master Slicing"}
                </h3>
                <p className="text-base text-[#071A24]/75 leading-relaxed">
                  {isMarathi
                    ? "सर्व मासे शुद्ध आरओ (RO) पाण्याने स्वच्छ धुतले जातात. स्टेनलेस स्टीलच्या निर्जंतुक टेबलावर तुमच्या आवडीनुसार — पातळ रवा फ्राय चकत्या, रस्सा कट, किंवा बोनलेस फिलेट — समोर कट करून मोफत दिले जातात."
                    : "Prepared on food-grade stainless steel surfaces washed continuously with purified RO water. Handled with sterile gloves and sliced precisely to your recipe: thin frying cuts, curry cubes, or bone-out steaks."}
                </p>

                <div className="space-y-3 text-sm text-[#071A24]/85 font-mono-accent">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#0B9DD8]" />
                    <span>{isMarathi ? "फक्त फिल्टर आरओ पाण्याचा वापर" : "Purified RO Water Washes Only"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#0B9DD8]" />
                    <span>{isMarathi ? "स्वच्छ ग्लोव्ह्ज व निर्जंतुक चाकू" : "Sterile Food-Grade Gloves & Knives"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{isMarathi ? "रवा फ्राय / करी कट मोफत साफसफाई" : "Customized Cleaning Free of Charge"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-xs font-mono-accent text-[#0B9DD8] font-bold uppercase tracking-wider hover:text-[#071A24] transition-colors"
                  >
                    <span>{isMarathi ? "आमच्या कटिंग सेवा पहा" : "Learn About Cutting Standards"}</span>
                    <ArrowRight className="w-4 h-4 text-[#0B9DD8]" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#071A24]/10 shadow-xl group">
                <Image
                  src="/media/cutting-hygiene.jpg"
                  alt="Precision hygienic cutting on stainless counter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono-accent">
                  <span className="text-white font-bold">RO CLEAN CUTTING STATION</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    FSSAI HYGIENE COMPLIANT
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PANEL C: Today's Counter Board */}
          {activeTab === "board" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-6 text-left">
                <span className="text-xs font-mono-accent text-[#0B9DD8] uppercase font-bold tracking-widest block">
                  // PROTOCOL 03: LIVE BOARD TELEMETRY
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#071A24] tracking-tight leading-tight">
                  {isMarathi ? "कोणतीही शंका नाही. फक्त अस्सल ताजी मासोळी." : "No Guesswork. Just Fresh Fish."}
                </h3>
                <p className="text-base text-[#071A24]/75 leading-relaxed">
                  {isMarathi
                    ? "प्रत्येक सकाळी दालनात उपलब्ध असलेल्या माशांची प्रजाती, वजन, लिलाव बंदर आणि ताजेपणाचे थेट अपडेट्स."
                    : "Full traceability on display: see exactly which coastal harbour each batch originated from, verified arrival times, and sub-zero slurry readings."}
                </p>

                {/* Floating telemetry chip */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#071A24]/10 flex items-center gap-3">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <div className="text-xs font-mono-accent">
                    <span className="text-[#071A24] font-bold block">
                      {isMarathi ? "ताजी आवक आज अद्ययावत केली • सकाळी ७:३०" : "Fresh stock updated today • 7:30 AM"}
                    </span>
                    <span className="text-[#071A24]/60">Karad Malkapur & Patan Counters Active</span>
                  </div>
                </div>
              </div>

              {/* Counter Board Table Card */}
              <div className="lg:col-span-7 rounded-3xl bg-[#F8FAFC] border border-[#071A24]/10 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#071A24]/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono-accent text-[#071A24] uppercase font-bold tracking-wider">
                      LIVE COUNTER HARVEST BOARD
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-accent text-[#0B9DD8] font-bold">
                    STATION: KARAD FLAGSHIP
                  </span>
                </div>

                {/* Counter Board Rows */}
                <div className="space-y-3 font-mono-accent text-xs">
                  {[
                    { name: "King Surmai (किंग सुरमई)", port: "Malvan Pier", temp: "0.4°C", status: "Available", formalin: "0.0% NEG" },
                    { name: "Silver Pomfret (पापलेट)", port: "Ratnagiri", temp: "0.2°C", status: "Available", formalin: "0.0% NEG" },
                    { name: "Tiger Prawns (मोठी कोळंबी)", port: "Devgad Dock", temp: "0.6°C", status: "Available", formalin: "0.0% NEG" },
                    { name: "Rawas / Salmon (रावस)", port: "Alibaug Pier", temp: "0.3°C", status: "Fast Selling", formalin: "0.0% NEG" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-[#071A24]/08 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#0B9DD8]/30 transition-colors shadow-2xs"
                    >
                      <div>
                        <span className="text-sm font-bold text-[#071A24] block">{row.name}</span>
                        <span className="text-[10px] text-[#071A24]/60">{row.port} • Slurry Temp: {row.temp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          {row.formalin}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#EBF8FF] text-[#0B9DD8] text-[10px] font-bold">
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
