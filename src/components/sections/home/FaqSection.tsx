"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FaqItem {
  qMr: string;
  qHi: string;
  qEn: string;
  aMr: string;
  aHi: string;
  aEn: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    qMr: "मासे किती ताजे असतात आणि ते कुठून आणले जातात?",
    qHi: "मछलियां कितनी ताजी होती हैं और उन्हें कहाँ से लाया जाता है?",
    qEn: "How fresh are the fish and where are they sourced from?",
    aMr: "आमची सर्व सागरी मासोळी दररोज पहाटे ४:०० वाजता रत्नागिरी आणि मालवणच्या बंदरात प्रत्यक्ष लिलावातून निवडली जाते. ती ०°C लिक्विड आईस स्लरीमध्ये वाहून कराडमध्ये आणली जाते, त्यामुळे माशाचा मूळ टवटवीतपणा आणि नैसर्गिक गोड चव अखंड राहते.",
    aHi: "हमारी सभी समुद्री मछलियां प्रतिदिन सुबह ४:०० बजे रत्नागिरी और मालवण बंदरगाहों पर प्रत्यक्ष नीलामी से चुनी जाती हैं। वे ०°C लिक्विड आइस स्लरी में सुरक्षित कराड लाई जाती हैं, जिससे मछली की असली ताजगी व प्राकृतिक स्वाद बना रहता है।",
    aEn: "All our sea catch is directly hand-selected at 4:00 AM coastal harbour auctions across Ratnagiri and Malvan, chilled in 0°C liquid ice slurry, and transported fresh to Karad daily.",
  },
  {
    qMr: "कटिंग आणि स्वच्छतेचे वेगळे पैसे द्यावे लागतात का?",
    qHi: "क्या कटिंग और सफाई के लिए अतिरिक्त पैसे देने होते हैं?",
    qEn: "Do you charge extra for cleaning and customized slicing?",
    aMr: "नाही, अजिबात नाही! आमच्या कराड दालनात शुद्ध आरओ (RO) पाण्याने मासे स्वच्छ धुवून, खवले व घाण काढून तुमच्या आवडीनुसार (उदा. तवा फ्राय स्टेक्स, कालवण कट, बोनलेस तुकडे किंवा अखंड साफ) १००% मोफत कापून दिले जातात.",
    aHi: "नहीं, बिल्कुल नहीं! हमारे कराड स्टोर में शुद्ध आरओ (RO) पानी से मछलियों को धोकर आपकी पसंद अनुसार (तवा फ्राई, करी कट, बोनलेस या साफ साबुत) १००% मुफ्त काटकर दिया जाता है।",
    aEn: "No, never! Slicing and RO-water cleaning (fry steaks, curry cuts, whole cleaned, or boneless fillets) are completely complimentary.",
  },
  {
    qMr: "माशांवर कोणतेही केमिकल किंवा फॉर्मेलिन लावले जाते का?",
    qHi: "क्या मछलियों पर कोई केमिकल या फॉर्मेलिन लगाया जाता है?",
    qEn: "Are the fish treated with chemicals or formalin preservatives?",
    aMr: "बिलकूल नाही! ए एन फिश वर्ल्डचा सर्वात महत्त्वाचा नियम म्हणजे 'शून्य केमिकल'. आम्ही मासे टिकवण्यासाठी कोणतेही फॉर्मेलिन किंवा अमोनिया वापरत नाही. आमच्या माशांना रासायनिक वास नसतो आणि ते लहान मुले व वृद्धांच्या आरोग्यासाठी १००% सुरक्षित असतात.",
    aHi: "बिल्कुल नहीं! ए एन फिश वर्ल्ड का सबसे अहम नियम है 'शून्य केमिकल'। हम मछली सुरक्षित रखने के लिए किसी भी फॉर्मेलिन या अमोनिया का उपयोग नहीं करते। हमारे उत्पाद बच्चों और बुजुर्गों के स्वास्थ्य के लिए १००% सुरक्षित हैं।",
    aEn: "Strictly zero! We maintain a 100% formalin and ammonia-free guarantee. Preserved solely on food-grade natural liquid ice.",
  },
  {
    qMr: "कराडमध्ये होम डिलिव्हरी उपलब्ध आहे का? किती वेळ लागतो?",
    qHi: "क्या कराड में होम डिलीवरी उपलब्ध है? कितना समय लगता है?",
    qEn: "Is home delivery available in Karad? What is the delivery time?",
    aMr: "होय! कराड शहर, विद्यानगर, कोल्हापूर नाका, आगाशिनगर, वारुंजी, मलकापूर आणि लगतच्या परिसरात ३० ते ४५ मिनिटांत सुरक्षित इन्सुलेटेड पॅकिंगमध्ये मासोळी घरपोच दिली जाते. आपण थेट व्हॉट्सॲप किंवा फोनवरून ऑर्डर करू शकता.",
    aHi: "हाँ! कराड शहर, विद्यानगर, कोल्हापुर नाका, मलकापुर व नजदीकी क्षेत्रों में ३० से ४५ मिनट में सुरक्षित इंसुलेटेड पैकिंग में ताजी मछली घर पहुंचाई जाती है। आप सीधे व्हाट्सएप या फोन से ऑर्डर कर सकते हैं।",
    aEn: "Yes! Prompt doorstep delivery across Karad city, Vidyanagar, Kolhapur Naka, Malkapur and nearby 15 km in 30–45 mins.",
  },
  {
    qMr: "दालनाच्या वेळा काय आहेत आणि रविवारी लवकर बुकिंग करावे का?",
    qHi: "स्टोर का समय क्या है और क्या रविवार को पहले बुकिंग करनी चाहिए?",
    qEn: "What are your shop operating hours? Do we need to book on Sundays?",
    aMr: "आम्ही दररोज सकाळी ७:०० ते दुपारी १:०० आणि संध्याकाळी ४:३० ते रात्री ९:०० पर्यंत खुले असतो. विशेषतः रविवारी कराडकरांची मोठी पसंती असल्याने पापलेट आणि सुरमई लवकर संपतात, म्हणूनच सकाळीच व्हॉट्सॲपवर ऑर्डर नोंदवणे फायद्याचे ठरते.",
    aHi: "हम प्रतिदिन सुबह ७:०० से दोपहर १:०० और शाम ४:३० से रात ९:०० तक खुले रहते हैं। रविवार को भारी मांग के कारण सुबह ही व्हाट्सएप पर ऑर्डर दर्ज करना बेहतर होता है।",
    aEn: "We are open Monday to Sunday: 7:00 AM – 1:00 PM and 4:30 PM – 9:00 PM. Due to heavy Sunday demand, early WhatsApp booking is recommended.",
  },
];

export function FaqSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";
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
            <span>{isMarathi ? "शंका व उत्तरे" : isHindi ? "सवाल और जवाब" : "Got Questions?"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "वारंवार विचारले जाणारे प्रश्न" : isHindi ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "कराडकरांच्या मनातील नेहमीचे प्रश्न आणि आमची पारदर्शक उत्तरे."
              : isHindi
              ? "ग्राहकों के सामान्य प्रश्न और हमारे पारदर्शी उत्तर।"
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
                    {isMarathi ? faq.qMr : isHindi ? faq.qHi : faq.qEn}
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
                    {isMarathi ? faq.aMr : isHindi ? faq.aHi : faq.aEn}
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
