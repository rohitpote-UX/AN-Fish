"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ShieldCheck, ThermometerSnowflake, Droplets, HeartHandshake, Phone, Store, Quote } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function AboutSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";
  const reduce = useReducedMotion();
  const t = (mr: string, en: string, hi: string) => (isMarathi ? mr : isHindi ? hi : en);
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

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
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white to-[#F3F8FB] py-20 text-[#071A24] lg:py-28"
      aria-label="About AN Fish World"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-14">
          {/* LEFT: founder */}
          <motion.div {...reveal()} className="lg:sticky lg:top-28 lg:col-span-5">
            <div className="relative mx-auto max-w-md pb-10">
              {/* offset frame */}
              <div aria-hidden="true" className="absolute -bottom-0 -left-4 top-6 w-[92%] rounded-[1.75rem] border-2 border-[#0A9AD9]/25" />
              <div className="relative overflow-hidden rounded-[1.75rem] bg-[#E8EEF1] shadow-[0_30px_60px_-28px_rgba(7,26,36,0.45)]">
                <Image
                  src="/media/founder-owner.jpg"
                  alt={t("अमीर नदाफ — संस्थापक, ए एन फिश वर्ल्ड", "Ameer Nadaf — Founder, AN Fish World", "अमीर नदाफ — संस्थापक, ए एन फिश वर्ल्ड")}
                  width={520}
                  height={640}
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="aspect-[4/4.6] w-full object-cover object-top"
                />
              </div>

              {/* name card (does not cover the portrait) */}
              <div className="relative z-10 -mt-8 ml-6 mr-2 flex items-center gap-3.5 rounded-2xl border border-[#071A24]/8 bg-white p-4 shadow-[0_18px_40px_-18px_rgba(7,26,36,0.35)] sm:ml-8">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#071A24] text-sm font-bold text-white">AN</span>
                <div className="min-w-0">
                  <p className="font-marathi-display text-base font-bold leading-tight text-[#071A24]">{PLACEHOLDERS.FOUNDER_NAME}</p>
                  <p className="mt-0.5 text-xs font-medium text-[#0A9AD9]">
                    {isMarathi ? PLACEHOLDERS.FOUNDER_ROLE_MR : isHindi ? "संस्थापक एवं संचालक" : PLACEHOLDERS.FOUNDER_ROLE_EN}
                  </p>
                </div>
              </div>
            </div>

            <figure className="mx-auto mt-6 max-w-md">
              <Quote className="mb-2 size-6 text-[#0A9AD9]/50" aria-hidden="true" />
              <blockquote className="font-marathi-body text-[0.95rem] italic leading-relaxed text-[#071A24]/80">
                {t(
                  "“कराडकरांना समुद्रासारखाच ताजा आणि विषमुक्त मासा मिळावा, हाच आमचा प्रामाणिक संकल्प आहे.”",
                  "“Our single promise: Karad families must eat fish as fresh as if they were on the seashore itself.”",
                  "“कराडवासियों को समुद्र के किनारे जैसी ही ताजी और विषमुक्त मछली मिले, यही हमारा सच्चा संकल्प है।”"
                )}
              </blockquote>
            </figure>
          </motion.div>

          {/* RIGHT: story */}
          <div className="lg:col-span-7">
            <motion.div {...reveal()}>
              <p className={`flex items-center gap-3 text-xs font-bold uppercase ${isMarathi || isHindi ? "tracking-normal" : "tracking-[0.2em]"} text-[#0A9AD9]`}>
                <span className="h-px w-8 bg-[#0A9AD9]" />
                {t("कराडची लाडकी मासोळी परंपरा", "Our Heritage & Freshness Pledge", "कराड की चहेती मछली परंपरा")}
              </p>
              <h2 className="mt-4 font-marathi-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-extrabold leading-[1.1] tracking-tight text-[#071A24]">
                {t("आमच्याबद्दल", "About AN Fish World", "हमारे बारे में")}
              </h2>
              <p className="mt-5 max-w-2xl font-marathi-body text-lg leading-relaxed text-[#071A24]/70">
                {t(
                  "केवळ व्यवसाय नाही, तर कराडकरांच्या ताटात अस्सल आणि दर्जेदार सागरी मासोळी पोहोचवण्याचा आमचा ध्यास.",
                  "Not just a fish store, but a dedication to bringing genuine coastal catch directly to the homes of Karad.",
                  "केवल व्यापार नहीं, बल्कि कराडवासियों की थाली में असली और उच्च गुणवत्ता वाली समुद्री मछली पहुंचाने का हमारा संकल्प।"
                )}
              </p>
            </motion.div>

            {/* challenge → answer */}
            <div className="mt-10 space-y-7">
              <motion.div {...reveal(0.05)} className="border-l-2 border-[#071A24]/15 pl-6">
                <p className={`mb-2 text-[0.7rem] font-bold uppercase ${isMarathi || isHindi ? "tracking-normal text-xs" : "tracking-[0.18em]"} text-[#071A24]/50`}>
                  {t("आव्हान", "The Challenge", "चुनौती")}
                </p>
                <p className="font-marathi-body text-[0.97rem] leading-[1.85] text-[#071A24]/80">
                  {isMarathi
                    ? "कराडमध्ये अनेक वर्षे ताजी मासोळी मिळणे हे एक आव्हान होते. लांबच्या बाजारातून येणारे मासे कित्येक दिवस बर्फात पडून राहत असत आणि त्यावर फॉर्मेलिनसारखी घातक रसायने लावली जात असत. यामुळे माशाची मूळ गोड चव तर नाहीशी व्हायचीच, पण आरोग्यालाही धोका निर्माण व्हायचा."
                    : isHindi
                    ? "कराड में कई वर्षों से ताजी मछली मिलना एक चुनौती था। दूर के बाजारों से आने वाली मछलियां कई दिनों तक बर्फ में पड़ी रहती थीं और उन पर फॉर्मेलिन जैसे हानिकारक रसायन लगाए जाते थे। इससे मछली का असली स्वाद तो खत्म होता ही था, साथ ही स्वास्थ्य के लिए भी गंभीर खतरा बन जाता था।"
                    : "For years, finding genuinely fresh fish in Karad was a challenge. Fish brought from distant markets sat on ice for days, often treated with harmful chemical preservatives like formalin. Not only did this ruin the natural taste, but it also posed health risks."}
                </p>
              </motion.div>

              <motion.div {...reveal(0.1)} className="border-l-2 border-[#0A9AD9] pl-6">
                <p className={`mb-2 text-[0.7rem] font-bold uppercase ${isMarathi || isHindi ? "tracking-normal text-xs" : "tracking-[0.18em]"} text-[#0A9AD9]`}>
                  {t("आमचा उपाय", "Our Answer", "हमारा समाधान")}
                </p>
                <p className="font-marathi-body text-[0.97rem] leading-[1.85] text-[#071A24]/80">
                  {isMarathi ? (
                    <>
                      यावर उपाय म्हणून <strong className="text-[#071A24]">ए एन फिश वर्ल्ड (AN Fish World)</strong> ची सुरुवात झाली. आम्ही दररोज पहाटे ४:०० वाजता रत्नागिरी आणि मालवणच्या बंदरात प्रत्यक्ष लिलावात स्वतः उभे राहून उत्कृष्ट प्रतीची मासोळी निवडतो. ती थेट ०°C लिक्विड आईस स्लरीमध्ये वाहून कराडमध्ये आणली जाते आणि आरओ पाण्याने स्वच्छ करून, तुमच्या आवडीनुसार कापून ग्राहकांना दिली जाते.
                    </>
                  ) : isHindi ? (
                    <>
                      इसके समाधान के रूप में <strong className="text-[#071A24]">ए एन फिश वर्ल्ड (AN Fish World)</strong> की शुरुआत हुई। हम हर सुबह ४:०० बजे रत्नागिरी और मालवण के बंदरगाहों पर स्वयं नीलामी में खड़े होकर बेहतरीन गुणवत्ता की मछली चुनते हैं। वह सीधे ०°C लिक्विड आइस स्लरी में कराड लाई जाती है और आरओ पानी से धोकर, आपकी पसंद अनुसार काटकर दी जाती है।
                    </>
                  ) : (
                    <>
                      To solve this, <strong className="text-[#071A24]">AN Fish World</strong> was founded by Ameer Nadaf. Every single morning at 4:00 AM, our team stands directly at coastal harbour auctions in Ratnagiri and Malvan, selecting the finest catch. Transported at 0°C liquid ice slurry, washed with pure RO water, and custom-sliced to perfection.
                    </>
                  )}
                </p>
              </motion.div>
            </div>

            {/* trust grid: one divided panel */}
            <motion.ul
              {...reveal(0.1)}
              className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#071A24]/10 bg-[#071A24]/10 sm:grid-cols-2"
            >
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="group flex items-start gap-4 bg-white p-5 transition-colors duration-300 hover:bg-[#F3F8FB]">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#0A9AD9]/10 text-[#0A9AD9] transition-colors duration-300 group-hover:bg-[#0A9AD9] group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h4 className="font-marathi-display text-[0.95rem] font-bold leading-snug text-[#071A24]">
                        {isMarathi ? item.titleMr : isHindi ? item.titleHi : item.titleEn}
                      </h4>
                      <p className="mt-1 font-marathi-body text-[0.8rem] leading-relaxed text-[#071A24]/65">
                        {isMarathi ? item.descMr : isHindi ? item.descHi : item.descEn}
                      </p>
                    </div>
                  </li>
                );
              })}
            </motion.ul>

            {/* actions */}
            <motion.div {...reveal(0.1)} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#071A24] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(7,26,36,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A9AD9]"
              >
                <Store className="size-4" />
                {t("आमच्या दालनाला भेट द्या", "Visit Our Karad Outlet", "हमारे स्टोर पर पधारें")}
              </a>
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#071A24]/20 px-7 py-3.5 text-sm font-bold text-[#071A24] transition-all duration-300 hover:border-[#0A9AD9] hover:text-[#0A9AD9]"
              >
                <Phone className="size-4 text-[#0A9AD9]" />
                {t("थेट फोनवर बोला", "Call Outlet Directly", "सीधे कॉल करें")}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
