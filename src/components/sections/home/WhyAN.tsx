import React from "react";
import { PLACEHOLDERS } from "@/data/placeholders";
import { ShieldAlert, Sparkles, Clock, CheckCircle } from "lucide-react";

export function WhyAN({ locale = "mr" }: { locale?: string }) {
  const isMarathi = locale === "mr";

  const perks = [
    {
      icon: ShieldAlert,
      title: isMarathi ? "१००% केमिकल व फॉर्मेलिनमुक्त" : "100% Formalin & Chemical Free",
      desc: isMarathi
        ? "आम्ही कोणत्याही रासायनिक संरक्षकांचा वापर करत नाही. केवळ वैज्ञानिक ०°C शीतसाखळी."
        : "Zero chemical preservatives or formalin dips. Pure thermal preservation physics.",
    },
    {
      icon: Sparkles,
      title: isMarathi ? "स्वच्छ आरओ पाण्याने कटिंग" : "Purified RO Clean Room Cuts",
      desc: isMarathi
        ? "स्टेनलेस स्टील टेबल, आरओ पाणी आणि घाण न ठेवता संपूर्ण स्वच्छ किचन-रेडी कटिंग."
        : "Sanitized surgical-grade benches, RO wash, completely gutted and kitchen-ready.",
    },
    {
      icon: Clock,
      title: isMarathi ? "कराडमध्ये जलद होम डिलिव्हरी" : "Fast Doorstep Delivery in Karad",
      desc: isMarathi
        ? `ऑर्डर नोंदवल्यानंतर ${PLACEHOLDERS.STATS.DELIVERY_TIME_MINS} मध्ये घरपोच.`
        : `Delivered to your doorstep within ${PLACEHOLDERS.STATS.DELIVERY_TIME_MINS}.`,
    },
  ];

  return (
    <section
      id="why-an"
      data-section="why-an"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-3xl sm:text-5xl font-black text-white tracking-tight`}
        >
          {isMarathi ? "कराडकरांचा अढळ विश्वास का?" : "Why Karad Trusts AN Fish World"}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-white/70">
          {isMarathi
            ? "बाजारपेठेतील गर्दी आणि संशयास्पद मासोळीला पूर्णविराम. शुद्ध, ताजी आणि सुरक्षित मासोळी."
            : "No more gambling at crowded wet markets. Pure, authentic, wild-caught seafood."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {perks.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#02111F]/80 border border-[#6EC6F0]/20 hover:border-[#0A9AD9] backdrop-blur-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A9AD9]/20 border border-[#0A9AD9]/30 flex items-center justify-center text-[#6EC6F0] mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span>{p.title}</span>
                <CheckCircle className="w-4 h-4 text-[#0A9AD9]" />
              </h3>
              <p className="text-sm text-white/75 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
