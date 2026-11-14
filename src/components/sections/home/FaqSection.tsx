"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FaqItem {
  qMr: string;
  qEn: string;
  aMr: string;
  aEn: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    qMr: "मासे किती ताजे असतात आणि ते कुठून आणले जातात?",
    qEn: "How fresh are the fish and where are they sourced from?",
    aMr: "आमची सर्व सागरी मासोळी दररोज पहाटे ४:०० वाजता रत्नागिरी आणि मालवणच्या बंदरात प्रत्यक्ष लिलावातून निवडली जाते. ती ०°C लिक्विड आईस स्लरीमध्ये वाहून कराडमध्ये आणली जाते, त्यामुळे माशाचा मूळ टवटवीतपणा आणि नैसर्गिक गोड चव अखंड राहते.",
    aEn: "All our sea catch is directly hand-selected at 4:00 AM coastal harbour auctions across Ratnagiri and Malvan, chilled in 0°C liquid ice slurry, and transported fresh to Karad daily.",
  },
  {
    qMr: "कटिंग आणि स्वच्छतेचे वेगळे पैसे द्यावे लागतात का?",
    qEn: "Do you charge extra for cleaning and customized slicing?",
    aMr: "नाही, अजिबात नाही! आमच्या कराड दालनात शुद्ध आरओ (RO) पाण्याने मासे स्वच्छ धुवून, खवले व घाण काढून तुमच्या आवडीनुसार (उदा. तवा फ्राय स्टेक्स, कालवण कट, बोनलेस तुकडे किंवा अखंड साफ) १००% मोफत कापून दिले जातात.",
    aEn: "No, never! Slicing and RO-water cleaning (fry steaks, curry cuts, whole cleaned, or boneless fillets) are completely complimentary.",
  },
  {
    qMr: "माशांवर कोणतेही केमिकल किंवा फॉर्मेलिन लावले जाते का?",
    qEn: "Are the fish treated with chemicals or formalin preservatives?",
    aMr: "बिलकूल नाही! ए एन फिश वर्ल्डचा सर्वात महत्त्वाचा नियम म्हणजे 'शून्य केमिकल'. आम्ही मासे टिकवण्यासाठी कोणतेही फॉर्मेलिन किंवा अमोनिया वापरत नाही. आमच्या माशांना रासायनिक वास नसतो आणि ते लहान मुले व वृद्धांच्या आरोग्यासाठी १००% सुरक्षित असतात.",
    aEn: "Strictly zero! We maintain a 100% formalin and ammonia-free guarantee. Preserved solely on food-grade natural liquid ice.",
  },
  {
    qMr: "कराडमध्ये होम डिलिव्हरी उपलब्ध आहे का? किती वेळ लागतो?",
    qEn: "Is home delivery available in Karad? What is the delivery time?",
    aMr: "होय! कराड शहर, विद्यानगर, कोल्हापूर नाका, आगाशिनगर, वारुंजी, मलकापूर आणि लगतच्या परिसरात ३० ते ४५ मिनिटांत सुरक्षित इन्सुलेटेड पॅकिंगमध्ये मासोळी घरपोच दिली जाते. आपण थेट व्हॉट्सॲप किंवा फोनवरून ऑर्डर करू शकता.",
    aEn: "Yes! Prompt doorstep delivery across Karad city, Vidyanagar, Kolhapur Naka, Malkapur and nearby 15 km in 30–45 mins.",
  },
  {
    qMr: "दालनाच्या वेळा काय आहेत आणि रविवारी लवकर बुकिंग करावे का?",
    qEn: "What are your shop operating hours? Do we need to book on Sundays?",
    aMr: "आम्ही दररोज सकाळी ७:०० ते दुपारी १:०० आणि संध्याकाळी ४:३० ते रात्री ९:०० पर्यंत खुले असतो. विशेषतः रविवारी कराडकरांची मोठी पसंती असल्याने पापलेट आणि सुरमई लवकर संपतात, म्हणूनच सकाळीच व्हॉट्सॲपवर ऑर्डर नोंदवणे फायद्याचे ठरते.",
    aEn: "We are open Monday to Sunday: 7:00 AM – 1:00 PM and 4:30 PM – 9:00 PM. Due to heavy Sunday demand, early WhatsApp booking is recommended.",
  },
];

export function FaqSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-20 lg:py-28 bg-[#FFFFFF] text-[#071A24] overflow-hidden scroll-mt-20 border-b border-[#071A24]/08"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/30 text-xs font-bold text-[#0B9DD8] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>{isMarathi ? "शंका व उत्तरे" : "Got Questions?"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "वारंवार विचारले जाणारे प्रश्न" : "Frequently Asked Questions"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "कराडकरांच्या मनातील नेहमीचे प्रश्न आणि आमची पारदर्शक उत्तरे."
              : "Clear, honest answers about our sourcing, hygiene, and delivery in Karad."}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#071A24]/10 bg-[#F8FAFC] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:text-[#0A9AD9] transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold font-marathi-display text-[#071A24]">
                    {isMarathi ? faq.qMr : faq.qEn}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white border border-[#071A24]/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#0A9AD9] text-white border-transparent" : "text-[#071A24]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed border-t border-[#071A24]/05">
                    {isMarathi ? faq.aMr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
