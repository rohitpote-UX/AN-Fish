import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { Video, Camera, Compass } from "lucide-react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/journal/media",
    titleMr: "व्हिडीओ व प्रसारमाध्यमे (Videos & Media)",
    titleEn: "Videos & Media Journal",
    descriptionMr: "रत्नागिरी व मालवण बंदर लिलाव, अखंड शीतसाखळी प्रवास आणि कराड दालनाची दृकश्राव्य माहिती.",
    descriptionEn: "Live harbour auction footage, cold-chain transport reels, and behind-the-scenes at our Karad fish counters.",
  });
}

export default async function JournalMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const isMarathi = locale === "mr";

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase mb-2 block font-bold">
          // {isMarathi ? "जर्नल व दृकश्राव्य दालन" : "JOURNAL & MEDIA DISPATCHES"}
        </span>
        <h1
          className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-tight ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "व्हिडीओ व प्रसारमाध्यमे" : "Videos & Visual Dispatches"}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#0F1F10]/70">
          {isMarathi
            ? "पहाटे ४:०० बंदरावरील लिलावापासून ते कराडच्या दालनात येईपर्यंतचा संपूर्ण प्रवास पहा."
            : "Explore real visual dispatches from 4:00 AM coastal harbour auctions to our Karad cutting tables."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            titleEn: "Dawn Auctions at Malvan Harbour",
            titleMr: "मालवण बंदरावरील पहाटेचा लिलाव",
            descEn: "How our sourcing masters select the freshest wild catch before sunrise.",
            descMr: "सूर्य उगवण्यापूर्वी आमचे तज्ज्ञ सर्वोत्तम सागरी मासे कसे निवडतात.",
            tagEn: "Sourcing",
            tagMr: "खरेदी",
          },
          {
            titleEn: "0°C Liquid Ice Slurry Protocol",
            titleMr: "०°C लिक्विड आईस सुरक्षित वाहतूक",
            descEn: "Zero chemical preservatives — only deep thermal control preserving cell integrity.",
            descMr: "कोणत्याही रसायनांशिवाय केवळ नियंत्रित तापमानाने नैसर्गिक ताजेपणा टिकवणे.",
            tagEn: "Cold Chain",
            tagMr: "शीतसाखळी",
          },
          {
            titleEn: "Precision Kitchen Cuts at Malkapur",
            titleMr: "मलकापूर दालनातील चोख कटिंग",
            descEn: "Custom clean cuts, rava fry slices, and curry cubes prepared with RO water.",
            descMr: "आरओ पाण्याने स्वच्छता आणि आपल्या आवडीनुसार मोफत कटिंग.",
            tagEn: "Hygiene",
            tagMr: "स्वच्छता",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 hover:border-[#0A9AD9] transition-all space-y-4"
          >
            <div className="aspect-video w-full rounded-2xl bg-[#0F1F10] flex items-center justify-center text-white/40">
              <Video className="w-8 h-8 text-[#0A9AD9]" />
            </div>
            <div className="flex items-center justify-between text-xs font-mono-accent text-[#0A9AD9] font-bold">
              <span>{isMarathi ? item.tagMr : item.tagEn}</span>
              <span className="text-[#0F1F10]/40">DISPATCH #{idx + 1}</span>
            </div>
            <h3 className="text-lg font-bold text-[#0F1F10]">
              {isMarathi ? item.titleMr : item.titleEn}
            </h3>
            <p className="text-xs text-[#0F1F10]/70 leading-relaxed">
              {isMarathi ? item.descMr : item.descEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
