"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ShieldCheck, ThermometerSnowflake, Droplets, HeartHandshake, Phone, Store, Award } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function AboutSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  const phoneTel = PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "");

  const pillars = [
    {
      icon: ShieldCheck,
      titleMr: "०% फॉर्मेलिन व केमिकल",
      titleHi: "०% फॉर्मेलिन व केमिकल",
      titleEn: "100% Chemical & Formalin Free",
      descMr: "कोणतीही घातक रसायने किंवा शिळे मासे नाहीत. १००% नैसर्गिक ताजेपणा.",
      descHi: "कोई भी हानिकारक रसायन या बासी मछली नहीं। १००% प्राकृतिक ताजगी।",
      descEn: "Zero chemical preservatives or formalin dips. 100% organic natural freshness.",
    },
    {
      icon: ThermometerSnowflake,
      titleMr: "०°C लिक्विड आईस शीतसाखळी",
      titleHi: "०°C लिक्विड आइस शीतश्रृंखला",
      titleEn: "0°C Liquid Ice Slurry",
      descMr: "बंदर लिलावापासून थेट कराड दालनापर्यंत शून्य अंश तापमानात संरक्षण.",
      descHi: "बंदरगाह नीलामी से सीधे कराड स्टोर तक शून्य डिग्री तापमान में संरक्षण।",
      descEn: "Preserved from coastal harbour boats to Karad in continuous ice-slurry chain.",
    },
    {
      icon: Droplets,
      titleMr: "आरओ पाण्याने मोफत कटिंग",
      titleHi: "आरओ पानी से मुफ्त कटिंग",
      titleEn: "RO Water Wash & Free Cutting",
      descMr: "तुमच्या आवडीनुसार तवा फ्राय, कालवण कट किंवा बोनलेस तुकडे – चोख स्वच्छता.",
      descHi: "आपकी पसंद अनुसार तवा फ्राई, करी कट या बोनलेस पीस – पूरी स्वच्छता।",
      descEn: "Cleaned strictly with pure RO water and precision sliced to your family's cooking style.",
    },
    {
      icon: HeartHandshake,
      titleMr: "स्थानिक कराडकरांचा विश्वास",
      titleHi: "स्थानीय कराडवासियों का विश्वास",
      titleEn: "Trusted by Karad Families",
      descMr: "गेल्या अनेक वर्षांपासून कराड आणि परिसरातील खवय्यांची पहिली पसंती.",
      descHi: "विगत कई वर्षों से कराड और आसपास के स्वादमर्मियों की पहली पसंद।",
      descEn: "Beloved by seafood connoisseurs and families across Karad, Satara.",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 lg:py-28 bg-[#FFFFFF] text-[#071A24] overflow-hidden scroll-mt-20 border-b border-[#071A24]/08"
      aria-label="About AN Fish World"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-18 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/30 text-xs font-bold text-[#0B9DD8] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>
              {isMarathi
                ? "कराडची लाडकी मासोळी परंपरा"
                : isHindi
                ? "कराड की चहेती मछली परंपरा"
                : "Our Heritage & Freshness Pledge"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "आमच्याबद्दल" : isHindi ? "हमारे बारे में" : "About AN Fish World"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "केवळ व्यवसाय नाही, तर कराडकरांच्या ताटात अस्सल आणि दर्जेदार सागरी मासोळी पोहोचवण्याचा आमचा ध्यास."
              : isHindi
              ? "केवल व्यापार नहीं, बल्कि कराडवासियों की थाली में असली और उच्च गुणवत्ता वाली समुद्री मछली पहुंचाने का हमारा संकल्प।"
              : "Not just a fish store, but a dedication to bringing genuine coastal catch directly to the homes of Karad."}
          </p>
        </div>

        {/* Two Column Layout: Founder Story & Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Founder Photo & Badge */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Cyan Ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#0A9AD9]/20 to-[#6EC6F0]/20 blur-lg" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#0A9AD9]/30 bg-white">
                <Image
                  src="/media/founder-owner.jpg"
                  alt={isMarathi || isHindi ? "अमीर नदाफ — संस्थापक, ए एन फिश वर्ल्ड" : "Ameer Nadaf — Founder, AN Fish World"}
                  width={520}
                  height={580}
                  className="w-full h-auto object-cover object-top"
                />

                {/* Founder Info Overlay Card */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#071A24] via-[#071A24]/90 to-transparent p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0A9AD9] flex items-center justify-center font-bold text-white shadow-md shrink-0">
                      AN
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-marathi-display leading-tight text-white">
                        {PLACEHOLDERS.FOUNDER_NAME}
                      </h3>
                      <p className="text-xs text-[#6EC6F0] font-medium">
                        {isMarathi
                          ? PLACEHOLDERS.FOUNDER_ROLE_MR
                          : isHindi
                          ? "संस्थापक एवं संचालक"
                          : PLACEHOLDERS.FOUNDER_ROLE_EN}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-white/80 italic font-marathi-body">
                    {isMarathi
                      ? "“कराडकरांना समुद्रासारखाच ताजा आणि विषमुक्त मासा मिळावा, हाच आमचा प्रामाणिक संकल्प आहे.”"
                      : isHindi
                      ? "“कराडवासियों को समुद्र के किनारे जैसी ही ताजी और विषमुक्त मछली मिले, यही हमारा सच्चा संकल्प है।”"
                      : "“Our single promise: Karad families must eat fish as fresh as if they were on the seashore itself.”"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Story & Value Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-sm sm:text-base text-[#071A24]/80 font-marathi-body leading-relaxed">
              <p>
                {isMarathi ? (
                  <>
                    कराडमध्ये अनेक वर्षे ताजी मासोळी मिळणे हे एक आव्हान होते. लांबच्या बाजारातून येणारे मासे कित्येक दिवस बर्फात पडून राहत असत आणि त्यावर फॉर्मेलिनसारखी घातक रसायने लावली जात असत. यामुळे माशाची मूळ गोड चव तर नाहीशी व्हायचीच, पण आरोग्यालाही धोका निर्माण व्हायचा.
                  </>
                ) : isHindi ? (
                  <>
                    कराड में कई वर्षों से ताजी मछली मिलना एक चुनौती था। दूर के बाजारों से आने वाली मछलियां कई दिनों तक बर्फ में पड़ी रहती थीं और उन पर फॉर्मेलिन जैसे हानिकारक रसायन लगाए जाते थे। इससे मछली का असली स्वाद तो खत्म होता ही था, साथ ही स्वास्थ्य के लिए भी गंभीर खतरा बन जाता था।
                  </>
                ) : (
                  <>
                    For years, finding genuinely fresh fish in Karad was a challenge. Fish brought from distant markets sat on ice for days, often treated with harmful chemical preservatives like formalin. Not only did this ruin the natural taste, but it also posed health risks.
                  </>
                )}
              </p>

              <p>
                {isMarathi ? (
                  <>
                    यावर उपाय म्हणून <strong>ए एन फिश वर्ल्ड (AN Fish World)</strong> ची सुरुवात झाली. आम्ही दररोज पहाटे ४:०० वाजता रत्नागिरी आणि मालवणच्या बंदरात प्रत्यक्ष लिलावात स्वतः उभे राहून उत्कृष्ट प्रतीची मासोळी निवडतो. ती थेट ०°C लिक्विड आईस स्लरीमध्ये वाहून कराडमध्ये आणली जाते आणि आरओ पाण्याने स्वच्छ करून, तुमच्या आवडीनुसार कापून ग्राहकांना दिली जाते.
                  </>
                ) : isHindi ? (
                  <>
                    इसके समाधान के रूप में <strong>ए एन फिश वर्ल्ड (AN Fish World)</strong> की शुरुआत हुई। हम हर सुबह ४:०० बजे रत्नागिरी और मालवण के बंदरगाहों पर स्वयं नीलामी में खड़े होकर बेहतरीन गुणवत्ता की मछली चुनते हैं। वह सीधे ०°C लिक्विड आइस स्लरी में कराड लाई जाती है और आरओ पानी से धोकर, आपकी पसंद अनुसार काटकर दी जाती है।
                  </>
                ) : (
                  <>
                    To solve this, <strong>AN Fish World</strong> was founded by Ameer Nadaf. Every single morning at 4:00 AM, our team stands directly at coastal harbour auctions in Ratnagiri and Malvan, selecting the finest catch. Transported at 0°C liquid ice slurry, washed with pure RO water, and custom-sliced to perfection.
                  </>
                )}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-[#071A24]/10 hover:border-[#0A9AD9] transition-colors flex items-start gap-3.5 shadow-xs"
                  >
                    <div className="p-2 rounded-lg bg-[#0A9AD9]/10 text-[#0A9AD9] shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#071A24] font-marathi-display">
                        {isMarathi ? item.titleMr : isHindi ? item.titleHi : item.titleEn}
                      </h4>
                      <p className="text-xs text-[#071A24]/70 mt-1 leading-snug">
                        {isMarathi ? item.descMr : isHindi ? item.descHi : item.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A9AD9] hover:bg-[#071A24] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Store className="w-4 h-4" />
                <span>
                  {isMarathi
                    ? "आमच्या दालनाला भेट द्या"
                    : isHindi
                    ? "हमारे स्टोर पर पधारें"
                    : "Visit Our Karad Outlet"}
                </span>
              </a>

              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#071A24]/20 hover:border-[#0A9AD9] text-[#071A24] hover:text-[#0A9AD9] font-bold text-xs uppercase tracking-wider transition-all duration-300"
              >
                <Phone className="w-4 h-4 text-[#0A9AD9]" />
                <span>
                  {isMarathi ? "थेट फोनवर बोला" : isHindi ? "सीधे कॉल करें" : "Call Outlet Directly"}
                </span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
