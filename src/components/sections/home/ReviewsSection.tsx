"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";

interface Review {
  nameMr: string;
  nameEn: string;
  locationMr: string;
  locationEn: string;
  rating: number;
  reviewMr: string;
  reviewEn: string;
  favoriteMr: string;
  favoriteEn: string;
}

const REVIEWS: Review[] = [
  {
    nameMr: "सचिन चव्हाण",
    nameEn: "Sachin Chavan",
    locationMr: "विद्यानगर, कराड",
    locationEn: "Vidyanagar, Karad",
    rating: 5,
    reviewMr: "कराडमध्ये इतके ताजे पापलेट आणि सुरमई मिळणे म्हणजे पर्वणीच! माशांना अजिबात शिळा वास नसतो. कटिंगही अगदी चोख करून देतात. रविवारी आमच्या घरी ए एन फिशचेच मासे लागतात.",
    reviewEn: "Getting such fresh Pomfret and Surmai in Karad is a treat! Zero stale smell, pristine hygiene, and tailored slicing. Our Sunday fish comes only from AN Fish.",
    favoriteMr: "आवडती मासोळी: सिल्व्हर पापलेट",
    favoriteEn: "Favorite: Silver Pomfret",
  },
  {
    nameMr: "अमोल मोहिते",
    nameEn: "Amol Mohite",
    locationMr: "मंगळवार पेठ, कराड",
    locationEn: "Mangalwar Peth, Karad",
    rating: 5,
    reviewMr: "मी बऱ्याच ठिकाणाहून मासे आणले, पण ए एन फिशचे मालक अमीर भाईंचा प्रामाणिकपणा आणि दर्जेदार मासे इतर कुठेही नाहीत. टायगर कोळंबी अतिशय गोड आणि रसाळ निघाली.",
    reviewEn: "I've tried multiple fish vendors, but Ameer Nadaf's honest service and catch quality are unmatched. The Tiger Prawns were exceptionally sweet and fresh.",
    favoriteMr: "आवडती मासोळी: टायगर कोळंबी",
    favoriteEn: "Favorite: Tiger Prawns",
  },
  {
    nameMr: "डॉ. जयश्री पाटील",
    nameEn: "Dr. Jayshree Patil",
    locationMr: "कोल्हापूर नाका, कराड",
    locationEn: "Kolhapur Naka, Karad",
    rating: 5,
    reviewMr: "आरोग्याच्या दृष्टीने केमिकल व फॉर्मेलिन नसणे अत्यंत महत्त्वाचे आहे. ए एन फिशचे मासे १००% ताजे असतात हे शिजवतानाच लक्षात येते. होम डिलिव्हरीसुद्धा वेळेत मिळते.",
    reviewEn: "Chemical and formalin-free fish is essential for health. You immediately notice the natural freshness while cooking. Prompt home delivery as well.",
    favoriteMr: "आवडती मासोळी: इंडियन सामन (रावस)",
    favoriteEn: "Favorite: Indian Salmon (Rawas)",
  },
];

export function ReviewsSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  return (
    <section
      id="reviews"
      className="relative py-20 lg:py-28 bg-[#FFFFFF] text-[#071A24] overflow-hidden scroll-mt-20 border-b border-[#071A24]/08"
      aria-label="Customer Reviews"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-18 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/30 text-xs font-bold text-[#0B9DD8] uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>
              {isMarathi
                ? "कराडकरांचे प्रामाणिक मत"
                : isHindi
                ? "कराडवासियों की सच्ची राय"
                : "Karad Foodie Testimonials"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "आमचे ग्राहक काय म्हणतात?" : isHindi ? "हमारे ग्राहक क्या कहते हैं?" : "What Our Customers Say"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "कराड आणि परिसरातील शेकडो खवय्ये आणि कुटुंबांचा ए एन फिशवर अतूट विश्वास आहे."
              : isHindi
              ? "कराड और आसपास के सैकड़ों स्वादमर्मियों और परिवारों का ए एन फिश पर अटूट विश्वास है।"
              : "Trusted by hundreds of families and seafood enthusiasts across Karad, Satara."}
          </p>

          {/* Rating Summary Bar */}
          <div className="pt-2 flex items-center justify-center gap-2 text-sm font-bold text-[#071A24]">
            <div className="flex items-center text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span>
              {isMarathi
                ? "४.९ / ५.० रेटिंग • कराड ग्राहक समाधान"
                : isHindi
                ? "४.९ / ५.० रेटिंग • कराड ग्राहक संतुष्टि"
                : "4.9 / 5.0 Rating • Karad Customer Satisfaction"}
            </span>
          </div>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] border border-[#071A24]/08 hover:border-[#0A9AD9] p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl group hover:-translate-y-1"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-[#0A9AD9]/30 group-hover:text-[#0A9AD9] transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-[#071A24]/80 font-marathi-body leading-relaxed italic">
                  “{isMarathi || isHindi ? review.reviewMr : review.reviewEn}”
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="mt-6 pt-4 border-t border-[#071A24]/08">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-marathi-display text-[#071A24]">
                      {isMarathi || isHindi ? review.nameMr : review.nameEn}
                    </h3>
                    <p className="text-xs text-[#071A24]/60">
                      {isMarathi || isHindi ? review.locationMr : review.locationEn}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[0.68rem] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isMarathi ? "सत्यापित ग्राहक" : isHindi ? "सत्यापित ग्राहक" : "Verified Buyer"}</span>
                  </span>
                </div>

                <div className="mt-2 text-[0.72rem] font-bold text-[#0A9AD9]">
                  {isMarathi
                    ? review.favoriteMr
                    : isHindi
                    ? review.favoriteMr.replace("आवडती मासोळी:", "पसंदीदा मछली:")
                    : review.favoriteEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
