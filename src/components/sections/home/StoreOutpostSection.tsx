"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { MapPin, Clock, MessageCircle, Navigation, ShieldCheck } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function StoreOutpostSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [isCurrentlyOpen, setIsCurrentlyOpen] = React.useState(true);

  React.useEffect(() => {
    const checkStatus = () => {
      // Current time in IST (Asia/Kolkata)
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 3600000 * 5.5);
      const hours = ist.getHours();
      const minutes = ist.getMinutes();
      const timeVal = hours + minutes / 60;
      const morningOpen = timeVal >= 7.0 && timeVal < 13.0;
      const eveningOpen = timeVal >= 16.5 && timeVal < 21.0;
      setIsCurrentlyOpen(morningOpen || eveningOpen);
    };
    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  return (
    <section
      id="karad-store"
      aria-label="Karad Store and Visiting Hours"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white text-[#071A24] relative selection:bg-[#0B9DD8] overflow-hidden border-t border-[#071A24]/08"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/25 text-xs font-mono-accent text-[#0B9DD8] uppercase tracking-wider font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>{isMarathi ? "आमचे कराड दालन • VISIT OUR COUNTER" : "VISIT OUR COUNTER • कराड दालन"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#071A24] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "कराडमध्ये थेट दालनाला भेट द्या." : "Visit Our Karad Flagship Counter."}
          </h2>

          <p
            className={`text-base sm:text-xl text-[#071A24]/75 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "मलकापूर हायवे जवळील मुख्य दालनात दररोज सकाळी ताजी मासोळी दाखल होते. स्वतः पाहून पसंत करा आणि पारदर्शक वजन अनुभवा."
              : "Experience the dawn catch directly at our Malkapur Karad store. Transparent digital weighing, clean RO water washing, and custom cuts while you watch."}
          </p>
        </div>

        {/* Store Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Authentic Store Information */}
          <div className="lg:col-span-6 rounded-3xl bg-[#F8FAFC] border border-[#071A24]/10 p-8 sm:p-10 flex flex-col justify-between shadow-xs space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono-accent text-[#0B9DD8] uppercase tracking-wider font-bold block">
                    FLAGSHIP RETAIL HUB
                  </span>
                  <h3
                    className={`text-2xl sm:text-3xl font-bold text-[#071A24] mt-1 ${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    }`}
                  >
                    {isMarathi ? "ए एन फिश वर्ल्ड — मलकापूर, कराड" : "AN Fish World — Malkapur, Karad"}
                  </h3>
                </div>

                {/* Real-time IST Live Status Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono-accent font-bold self-start sm:self-center border shadow-2xs ${
                    isCurrentlyOpen
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isCurrentlyOpen ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isCurrentlyOpen ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  </span>
                  <span>
                    {isCurrentlyOpen
                      ? isMarathi
                        ? "दालन सुरू आहे"
                        : "OPEN NOW"
                      : isMarathi
                      ? "सध्या बंद"
                      : "CLOSED"}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#071A24]/10">
                <MapPin className="w-5 h-5 text-[#0B9DD8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#071A24]">
                    {isMarathi ? "पत्ता व लोकेशन" : "Store Address & Landmark"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#071A24]/70 mt-0.5 leading-relaxed">
                    {isMarathi
                      ? "मलकापूर, कराड, सातारा जिल्हा, महाराष्ट्र — ४१५११० (पुणे-बंगलोर महामार्ग लगत)"
                      : "Malkapur, Karad, Satara District, Maharashtra 415110 (Near Pune-Bangalore Highway)"}
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#071A24]/10">
                <Clock className="w-5 h-5 text-[#0B9DD8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#071A24]">
                    {isMarathi ? "दालन उघडण्याच्या वेळा" : "Daily Counter Timings"}
                  </h4>
                  <div className="text-xs sm:text-sm text-[#071A24]/70 mt-1 space-y-1 font-mono-accent">
                    <div>{isMarathi ? "सकाळ: ७:०० AM ते १:०० PM" : "Morning Catch: 7:00 AM – 1:00 PM"}</div>
                    <div>{isMarathi ? "संध्याकाळ: ४:३० PM ते ९:०० PM" : "Evening Catch: 4:30 PM – 9:00 PM"}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                      {isMarathi ? "रविवार: विशेष पहाटेची ताजी आवक" : "Open 7 Days a Week • Early Sunday Harvest"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification & Scales Promise */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#071A24]/10">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#071A24]">
                    {isMarathi ? "पारदर्शकतेची हमी" : "The Transparency Pledge"}
                  </h4>
                  <p className="text-xs text-[#071A24]/70 mt-0.5 leading-relaxed">
                    {isMarathi
                      ? "अचूक डिजिटल वजन, शून्य बर्फ जोडणे, आणि १००% फॉर्मेलिनमुक्त ताजी मासोळी."
                      : "Certified digital scales, zero added ice weight, and 100% formalin and chemical-free assurance."}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-4 border-t border-[#071A24]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  isMarathi
                    ? "नमस्कार AN Fish World कराड, मला आजच्या आवक व स्टोअर लोकेशनबद्दल माहिती हवी आहे."
                    : "Hello AN Fish World Karad, I would like to know today's fresh catch availability and store directions."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 rounded-full bg-[#071A24] hover:bg-[#0B9DD8] text-white text-xs font-mono-accent font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#0B9DD8]" />
                <span>{isMarathi ? "व्हॉट्सॲपवर संपर्क साधा" : "Chat on WhatsApp"}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Malkapur+Karad+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-full bg-white hover:bg-[#EBF8FF] text-[#071A24] border border-[#071A24]/15 hover:border-[#0B9DD8] text-xs font-mono-accent font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Navigation className="w-4 h-4 text-[#0B9DD8]" />
                <span>{isMarathi ? "गुगल मॅप्स" : "Directions"}</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Impact Real Store Photograph */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto rounded-3xl overflow-hidden shadow-xl border border-[#071A24]/10 group bg-slate-100 min-h-[380px]">
            <Image
              src="/media/counter-landscape.jpg"
              alt="AN Fish World Karad Malkapur store counter"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Top Badge */}
            <div className="absolute top-6 left-6">
              <span className="px-3.5 py-1.5 rounded-full bg-[#071A24]/90 backdrop-blur-md text-[#6EC6F0] text-xs font-mono-accent font-bold uppercase tracking-wider border border-white/15">
                {isMarathi ? "थेट दालन दृश्य" : "Authentic Counter Photo"}
              </span>
            </div>

            {/* Bottom Floating Card */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-wider">
                  LIVE RETAIL OPERATIONS
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold">
                {isMarathi ? "स्वच्छ, बर्फाच्छादित प्रदर्शन आणि पारदर्शक कटिंग" : "Sanitized Counter, Chilled Displays & Free Custom Cuts"}
              </h4>
              <p className="text-xs text-white/70 font-mono-accent">
                {isMarathi ? "कराड व पाटण तालुक्यातील ग्राहकांचा विश्वासू थांबा" : "Serving families and hospitality partners across Karad"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
