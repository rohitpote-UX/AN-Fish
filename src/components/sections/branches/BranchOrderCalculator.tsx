"use client";

import React, { useState } from "react";
import { MessageCircle, ShoppingBag, Sparkles, Check, Phone } from "lucide-react";
import { Branch } from "@/types";

interface BranchOrderCalculatorProps {
  branch: Branch;
  locale: string;
}

const FISH_OPTIONS = [
  { id: "paplet", nameMr: "सिल्व्हर पापलेट (A-Grade)", nameEn: "Silver Pomfret", rate: "₹1,150/kg" },
  { id: "surmai", nameMr: "किंग सुरमई स्टेक्स", nameEn: "King Surmai Steaks", rate: "₹980/kg" },
  { id: "prawns", nameMr: "रॉयल टायगर कोळंबी", nameEn: "Royal Tiger Prawns", rate: "₹750/kg" },
  { id: "rawas", nameMr: "इंडियन सामन (रावस)", nameEn: "Indian Salmon (Rawas)", rate: "₹880/kg" },
  { id: "bangda", nameMr: "ताजा सागरी बांगडा", nameEn: "Fresh Bangda", rate: "₹280/kg" },
  { id: "rohu", nameMr: "कृष्णा काठ गोड रोहू", nameEn: "River Fresh Rohu", rate: "₹220/kg" },
  { id: "bombil", nameMr: "अस्सल बोंबील", nameEn: "Fresh Bombil", rate: "₹240/kg" },
  { id: "chimbori", nameMr: "गावठी कांदळवन चिंबोरी", nameEn: "Mud Crabs (Chimbori)", rate: "₹650/kg" },
];

const WEIGHT_OPTIONS = ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "5 kg (होलसेल)"];

const CUT_OPTIONS = [
  { id: "tawa", nameMr: "तवा फ्राय कट (पातळ स्लाईस)", nameEn: "Tawa Fry Cut" },
  { id: "curry", nameMr: "कालवण कट (रस्स्यासाठी मध्यम)", nameEn: "Curry Cut" },
  { id: "whole", nameMr: "अख्खा स्वच्छ (खवले व घाण साफ)", nameEn: "Whole Cleaned" },
  { id: "boneless", nameMr: "बोनलेस फिलेट (काटे नसलेले)", nameEn: "Boneless Fillet" },
];

const SPICE_OPTIONS = [
  { id: "none", nameMr: "मसाला नको", nameEn: "No Masala", extra: "₹0" },
  { id: "fry", nameMr: "+ AN फिश स्पेशल फ्राय मसाला", nameEn: "+ AN Fish Fry Masala", extra: "₹80" },
  { id: "curry", nameMr: "+ AN मालवणी कालवण मसाला", nameEn: "+ AN Malvani Curry Masala", extra: "₹90" },
];

export function BranchOrderCalculator({ branch, locale }: BranchOrderCalculatorProps) {
  const isMarathi = locale === "mr";

  const [selectedFish, setSelectedFish] = useState(FISH_OPTIONS[0]);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[1]);
  const [selectedCut, setSelectedCut] = useState(CUT_OPTIONS[0]);
  const [selectedSpice, setSelectedSpice] = useState(SPICE_OPTIONS[0]);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  const buildWhatsappLink = () => {
    const text = isMarathi
      ? `नमस्कार AN Fish World (${branch.nameMr})!\n\nमला थेट आजच्या ताजी आवकमधून ऑर्डर करायची आहे:\n` +
        `🐟 मासा: ${selectedFish.nameMr} (${selectedFish.rate})\n` +
        `⚖️ वजन: ${selectedWeight}\n` +
        `🔪 मोफत कटिंग: ${selectedCut.nameMr}\n` +
        `🌶️ मसाला: ${selectedSpice.nameMr} (${selectedSpice.extra})\n` +
        `🚚 प्रकार: ${orderType === "delivery" ? "३० मिनिटांत घरपोच डिलिव्हरी" : "दालनातून स्वतः पिकअप"}\n\n` +
        `कृपया आजची उपलब्धता व एकूण बिल पाठवा. धन्यवाद!`
      : `Hello AN Fish World (${branch.nameEn})!\n\nI want to place an order from today's catch:\n` +
        `🐟 Fish: ${selectedFish.nameEn} (${selectedFish.rate})\n` +
        `⚖️ Weight: ${selectedWeight}\n` +
        `🔪 Free Cut: ${selectedCut.nameEn}\n` +
        `🌶️ Masala: ${selectedSpice.nameEn}\n` +
        `🚚 Type: ${orderType === "delivery" ? "Home Delivery" : "Store Pickup"}\n\n` +
        `Please confirm stock availability and send total bill. Thank you!`;

    const cleanPhone = branch.phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0B2535] via-[#091F2C] to-[#061824] border-2 border-[#FBBF24]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isMarathi ? "त्वरित ऑर्डर कॅल्क्युलेटर" : "Instant Order Builder"}
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-marathi-display text-white mt-1">
            {isMarathi ? "मासोळी निवडा व थेट व्हॉट्सॲपवर मागवा" : "Select Catch & Order via WhatsApp"}
          </h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          ● {isMarathi ? "थेट दालन संपर्क" : "Direct Branch"}
        </span>
      </div>

      <div className="space-y-5">
        {/* 1. Fish Choice */}
        <div>
          <label className="block text-xs font-bold font-marathi-display text-white/90 mb-2">
            १. मासोळीचा प्रकार निवडा (Select Fish):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FISH_OPTIONS.map((f) => {
              const active = selectedFish.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFish(f)}
                  className={`min-h-0 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    active
                      ? "bg-[#0A9AD9]/25 border-[#38BDF8] text-white shadow-md ring-1 ring-[#38BDF8]"
                      : "bg-[#04151F] border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <span className="block text-xs font-bold font-marathi-display truncate text-white">
                    {isMarathi ? f.nameMr : f.nameEn}
                  </span>
                  <span className="block text-[0.68rem] font-black text-[#FBBF24] mt-0.5">
                    {f.rate}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Weight */}
        <div>
          <label className="block text-xs font-bold font-marathi-display text-white/90 mb-2">
            २. हवे असलेले वजन निवडा (Weight):
          </label>
          <div className="flex flex-wrap gap-2">
            {WEIGHT_OPTIONS.map((w) => {
              const active = selectedWeight === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWeight(w)}
                  className={`min-h-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    active
                      ? "bg-[#FBBF24] text-[#071A24] border-[#FBBF24] shadow-md font-black"
                      : "bg-[#04151F] border-white/10 text-white/80 hover:border-white/30"
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Free Cutting Option */}
        <div>
          <label className="block text-xs font-bold font-marathi-display text-white/90 mb-2">
            ३. मोफत चोख कटिंग प्रकार (Free Cutting Style):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CUT_OPTIONS.map((c) => {
              const active = selectedCut.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCut(c)}
                  className={`min-h-0 p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? "bg-[#0284C7]/25 border-[#38BDF8] text-white shadow-md"
                      : "bg-[#04151F] border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <span className="text-xs font-bold font-marathi-display text-white">
                    {isMarathi ? c.nameMr : c.nameEn}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Masala Add-on */}
        <div>
          <label className="block text-xs font-bold font-marathi-display text-white/90 mb-2">
            ४. सोबत ए एन स्पेशल मसाला हवा आहे का? (Spice Add-on):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SPICE_OPTIONS.map((s) => {
              const active = selectedSpice.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSpice(s)}
                  className={`min-h-0 p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500/20 border-[#FBBF24] text-white shadow-md"
                      : "bg-[#04151F] border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <span className="text-xs font-semibold font-marathi-display text-white truncate">
                    {isMarathi ? s.nameMr : s.nameEn}
                  </span>
                  <span className="text-[0.68rem] text-[#FBBF24] font-bold shrink-0 ml-1">
                    {s.extra}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Delivery vs Store Pickup */}
        <div className="pt-2">
          <label className="block text-xs font-bold font-marathi-display text-white/90 mb-2">
            ५. पुरवठा पद्धत (Delivery Mode):
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrderType("delivery")}
              className={`min-h-0 p-3 rounded-xl border text-center transition-all cursor-pointer font-marathi-display ${
                orderType === "delivery"
                  ? "bg-emerald-500/20 border-emerald-400 text-white shadow-lg"
                  : "bg-[#04151F] border-white/10 text-white/70"
              }`}
            >
              <span className="block text-xs font-bold text-white">⚡ ३० मिनिटांत घरपोच</span>
              <span className="text-[0.65rem] text-emerald-400 font-semibold block mt-0.5">
                स्थानिक १५ किमी परिसर
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOrderType("pickup")}
              className={`min-h-0 p-3 rounded-xl border text-center transition-all cursor-pointer font-marathi-display ${
                orderType === "pickup"
                  ? "bg-[#0A9AD9]/20 border-[#38BDF8] text-white shadow-lg"
                  : "bg-[#04151F] border-white/10 text-white/70"
              }`}
            >
              <span className="block text-xs font-bold text-white">🏪 दालनातून स्वतः पिकअप</span>
              <span className="text-[0.65rem] text-[#38BDF8] font-semibold block mt-0.5">
                तयार करून ठेवले जाईल
              </span>
            </button>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-3">
          <a
            href={buildWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#25D366] hover:from-[#38BDF8] hover:to-[#25D366] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] cursor-pointer font-marathi-display"
          >
            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
            <span>
              {isMarathi
                ? `व्हॉट्सॲपवर ही ऑर्डर पाठवा (${selectedFish.nameMr.split(" ")[0]} - ${selectedWeight})`
                : `Send Order via WhatsApp (${selectedFish.nameEn} - ${selectedWeight})`}
            </span>
          </a>

          <p className="text-center text-[0.68rem] text-white/60 font-marathi-body mt-2">
            💡 एका क्लिकवर थेट {isMarathi ? branch.villageNameMr || branch.nameMr : branch.nameEn} दालनाच्या व्यवस्थापकाशी चॅट सुरू होईल.
          </p>
        </div>
      </div>
    </div>
  );
}
