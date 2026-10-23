import React from "react";
import { PLACEHOLDERS } from "@/data/placeholders";
import { Star, MessageSquare } from "lucide-react";

export function Community({ locale = "mr" }: { locale?: string }) {
  const isMarathi = locale === "mr";

  const reviews = [
    {
      authorMr: "सौ. सुप्रिया पाटील (विद्यानगर, कराड)",
      authorEn: "Mrs. Supriya Patil (Vidyanagar, Karad)",
      textMr:
        "पापलेट इतके ताजे होते की तळल्यावर अगदी लोण्यासारखे लागले. कराडमध्ये इतकी स्वच्छ मासोळी मिळणे खरोखरच कौतुकास्पद आहे.",
      textEn:
        "The Silver Pomfret was extraordinarily fresh — delicate, sweet and melted like butter when shallow fried. Truly a blessing in Karad.",
      fish: "Silver Pomfret (सिल्व्हर पापलेट)",
    },
    {
      authorMr: "श्री. आनंदराव मोहिते (मलकापूर)",
      authorEn: "Mr. Anandrao Mohite (Malkapur)",
      textMr:
        "सुरमईचे तुकडे अगदी घट्ट आणि पांढरे पडलेले नव्हते. रासायनिक वास शून्य. घरपोच डिलिव्हरी वेळेत मिळाली.",
      textEn:
        "King Seer fish steaks were thick, dense and totally free of chemical odor. Doorstep delivery was punctual within 45 mins.",
      fish: "King Seer (किंग सुरमई)",
    },
    {
      authorMr: "डॉ. सागर चव्हाण (कराड मध्यवर्ती)",
      authorEn: "Dr. Sagar Chavan (Karad Central)",
      textMr:
        "टायगर कोळंबीची साईझ अप्रतिम होती. आईने कोळंबी भात केला आणि सगळ्यांनी मनमुराद दाद दिली.",
      textEn:
        "Jumbo Tiger Prawns were crunchy and naturally sweet. Our entire family relished Sunday lunch.",
      fish: "Royal Tiger Prawns (जंबो कोळंबी)",
    },
  ];

  return (
    <section
      id="community"
      data-section="community"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="max-w-3xl mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063A63]/30 border border-[#0A9AD9]/40 text-xs font-mono-accent text-[#6EC6F0] mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>COMMUNITY • {PLACEHOLDERS.STATS.HAPPY_KARAD_FAMILIES}</span>
        </div>

        <h2
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight`}
        >
          {isMarathi ? "कराडकरांचे प्रेम आणि अनुभव" : "Loved by Karad's Families"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="p-7 rounded-2xl bg-[#02111F]/70 border border-[#6EC6F0]/20 hover:border-[#0A9AD9] backdrop-blur-md flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-1 text-[#0A9AD9] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#0A9AD9]" />
                ))}
              </div>
              <p className="text-sm text-white/85 leading-relaxed italic mb-6">
                &ldquo;{isMarathi ? r.textMr : r.textEn}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-xs font-bold text-white">
                {isMarathi ? r.authorMr : r.authorEn}
              </div>
              <div className="text-[11px] font-mono-accent text-[#6EC6F0] mt-0.5">
                {r.fish}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
