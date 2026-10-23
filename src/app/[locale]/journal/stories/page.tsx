import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { Heart, Star, Quote } from "lucide-react";

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
    path: "/journal/stories",
    titleMr: "ग्राहकांचे अनुभव (Customer Stories)",
    titleEn: "Customer Stories & Testimonials",
    descriptionMr: "कराडमधील हजारो समाधानी कुटुंबे आणि शेफ्सचे ए एन फिश वर्ल्डवरील विश्वासाचे अनुभव.",
    descriptionEn: "Stories of taste and trust from thousands of families and culinary kitchens across Karad.",
  });
}

export default async function CustomerStoriesPage({
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
          // {isMarathi ? "ग्राहकांचे अनुभव व विश्वास" : "STORIES FROM KARAD HOMES"}
        </span>
        <h1
          className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-tight ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "ग्राहकांचे अनुभव" : "Customer Stories"}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#0F1F10]/70">
          {isMarathi
            ? "कराडच्या घराघरांतून दररोज ऐकायला मिळणारे कौतुक आणि विश्वासाचे बोल."
            : "Heartfelt feedback from families across Karad who make AN Fish World a staple on their dining tables."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            quoteEn: "The surmai slices were crystal clear and utterly odorless. My grandmother said it reminded her of fresh Konkan catch from her childhood.",
            quoteMr: "सुरमईचे तुकडे इतके ताजे आणि स्वच्छ होते की आजोळी कोकणात खाल्ल्यासारखी आठवण झाली. कोणतीही दुर्गंधी नाही, केवळ अप्रतिम चव!",
            nameEn: "Dr. Aniket Patil",
            nameMr: "डॉ. अनिकेत पाटील",
            areaEn: "Malkapur, Karad",
            areaMr: "मलकापूर, कराड",
          },
          {
            quoteEn: "Ordering on WhatsApp is effortless. I sent my order at 8:00 AM and received cleaned, curry-cut pomfret by 10:30 AM in chilled packaging.",
            quoteMr: "सकाळी ८ वाजता व्हॉट्सॲपवर मेसेज केला आणि १०:३० पर्यंत आईस पॅकिंगमध्ये छान कट केलेले पापलेट घरपोच आले. अतिशय विश्वासार्ह सेवा!",
            nameEn: "Snehal Deshmukh",
            nameMr: "स्नेहल देशमुख",
            areaEn: "Mangalwar Peth, Karad",
            areaMr: "मंगळवार पेठ, कराड",
          },
          {
            quoteEn: "As a hotel owner, reliable seafood supply without chemical preservatives was my biggest headache until AN Fish World stepped in.",
            quoteMr: "हॉटेल व्यवसायात ताजी, केमिकल नसलेली मासोळी वेळेवर मिळणे फार कठीण होते. ए एन फिश वर्ल्डच्या शीतसाखळीमुळे आमची गुणवत्ता नेहमी उत्कृष्ट राहते.",
            nameEn: "Chef Rajesh Salunkhe",
            nameMr: "शेफ राजेश साळुंखे",
            areaEn: "Highway Restaurant, Karad",
            areaMr: "हायवे रेस्टॉरंट, कराड",
          },
        ].map((story, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 hover:border-[#0A9AD9] transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-[#0F1F10]/80 leading-relaxed italic">
                &ldquo;{isMarathi ? story.quoteMr : story.quoteEn}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#0F1F10]/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0F1F10]">
                  {isMarathi ? story.nameMr : story.nameEn}
                </h4>
                <p className="text-xs text-[#0F1F10]/50 font-mono-accent">
                  {isMarathi ? story.areaMr : story.areaEn}
                </p>
              </div>
              <Heart className="w-4 h-4 text-[#0A9AD9] fill-[#0A9AD9]/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
