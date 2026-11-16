"use client";

import React from "react";
import { useLocale } from "next-intl";
import { MapPin, Phone, MessageCircle, Clock, Navigation, Mail, Store } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function ContactSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  const phoneTel = PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "");
  const cleanWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आपल्या दालनाचा पत्ता व आजची ताजी आवक जाणून घ्यायची आहे."
      : isHindi
      ? "नमस्ते AN Fish World कराड, मुझे आपके स्टोर का पता व आज की ताजी आवक जाननी है।"
      : "Hello AN Fish World Karad, I would like to enquire about your store address and today's fresh catch."
  )}`;

  return (
    <section
      id="contact"
      className="relative py-12 lg:py-16 bg-[#F8FAFC] text-[#071A24] overflow-hidden scroll-mt-20"
      aria-label="Contact and Store Location"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/30 text-xs font-bold text-[#0B9DD8] uppercase tracking-wider">
            <Store className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>{isMarathi ? "कराड मुख्य दालन" : isHindi ? "कराड मुख्य स्टोर" : "Karad Retail Outpost"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "आमच्यापर्यंत कसे पोहोचाल?" : isHindi ? "हम तक कैसे पहुंचें?" : "How to Reach AN Fish World"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "कराड शहराच्या केंद्रस्थानी असलेले आमचे दालन. स्वतः भेट द्या किंवा घरपोच ताजी मासोळी मागवा."
              : isHindi
              ? "कराड शहर के केंद्र में स्थित हमारा मुख्य स्टोर। स्वयं पधारें या घरपहुंच ताजी मछली मंगाएं।"
              : "Centrally located in Karad, Satara. Visit our chilled counter or get fresh delivery right to your doorstep."}
          </p>
        </div>

        {/* 2 Column Grid: Info Cards + Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Contact Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#071A24]/08 hover:border-[#0A9AD9] shadow-xs transition-colors space-y-2">
              <div className="flex items-center gap-3 text-[#0A9AD9]">
                <div className="w-10 h-10 rounded-xl bg-[#0A9AD9]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#0A9AD9]" />
                </div>
                <h3 className="text-lg font-bold font-marathi-display text-[#071A24]">
                  {isMarathi ? "दालनाचा पत्ता" : isHindi ? "स्टोर का पता" : "Store Address"}
                </h3>
              </div>
              <p className="text-sm text-[#071A24]/80 font-marathi-body leading-relaxed pt-1">
                <strong>ए एन फिश वर्ल्ड (AN Fish World)</strong>
                <br />
                {PLACEHOLDERS.STORE_ADDRESS_KARAD}
                <br />
                <span className="text-xs text-[#071A24]/60">
                  {isMarathi
                    ? `जवळ: ${PLACEHOLDERS.STORE_LANDMARK}`
                    : isHindi
                    ? `नजदीक: ${PLACEHOLDERS.STORE_LANDMARK}`
                    : `Landmark: ${PLACEHOLDERS.STORE_LANDMARK}`}
                </span>
              </p>
            </div>

            {/* Operating Hours Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#071A24]/08 hover:border-[#0A9AD9] shadow-xs transition-colors space-y-2">
              <div className="flex items-center gap-3 text-[#0A9AD9]">
                <div className="w-10 h-10 rounded-xl bg-[#0A9AD9]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#0A9AD9]" />
                </div>
                <h3 className="text-lg font-bold font-marathi-display text-[#071A24]">
                  {isMarathi ? "दुकान उघडे असण्याच्या वेळा" : isHindi ? "स्टोर खुलने का समय" : "Store Operating Hours"}
                </h3>
              </div>
              <div className="text-sm text-[#071A24]/80 space-y-1 pt-1 font-marathi-body">
                <p className="font-semibold text-[#071A24]">
                  {isMarathi ? "सोमवार – रविवार (सर्व दिवस)" : isHindi ? "सोमवार – रविवार (सभी दिन)" : "Monday – Sunday (All Days)"}
                </p>
                <p className="text-xs sm:text-sm text-[#0A9AD9] font-bold">
                  {PLACEHOLDERS.DAILY_HOURS}
                </p>
                <p className="text-xs text-emerald-600 font-semibold pt-1">
                  {isMarathi
                    ? "रविवारी पहाटे खास ताजी आवक उपलब्ध!"
                    : isHindi
                    ? "रविवार सुबह खास ताजी आवक उपलब्ध!"
                    : "Sunday dawn special fresh harbour arrivals!"}
                </p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${phoneTel}`}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#071A24] hover:bg-[#0A9AD9] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{isMarathi ? "कॉल करा" : isHindi ? "कॉल करें" : "Call Store"}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isMarathi ? "व्हॉट्सॲप" : isHindi ? "व्हाट्सएप" : "WhatsApp"}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Embed Frame (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#071A24]/10 bg-white shadow-xl relative min-h-[380px] lg:min-h-full flex flex-col">
            <div className="p-4 bg-[#071A24] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6EC6F0]">
                <MapPin className="w-4 h-4 text-[#0A9AD9]" />
                <span>कराड, सातारा — Google Map Direction</span>
              </div>
              <a
                href="https://maps.google.com/?q=Karad+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#6EC6F0] font-semibold underline underline-offset-2"
              >
                <span>{isMarathi ? "मोठ्या नकाशावर पहा" : isHindi ? "बड़े नक्शे पर देखें" : "Open in Maps"}</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex-grow w-full min-h-[340px] relative bg-slate-100">
              <iframe
                title="AN Fish World Karad Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60980.99967923485!2d74.1485601262796!3d17.289659353177656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc18260a92d2459%3A0x6b4fb24e65d83637!2sKarad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
