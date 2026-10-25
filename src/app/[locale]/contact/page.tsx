import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { PLACEHOLDERS } from "@/data/placeholders";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { MapPin, Phone, Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { FinalCta } from "@/components/sections/home/FinalCta";

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
    path: "/contact",
    titleMr: "आमच्याशी संपर्क साधा",
    titleEn: "Contact Our Karad Team",
    descriptionMr: "ताजी मासोळी ऑर्डर, विशेष समारंभासाठी आरक्षण किंवा कोणत्याही मदतीसाठी आम्ही सदैव तत्पर आहोत.",
    descriptionEn: "We are available 7 days a week for seafood inquiries, event catering orders, and home delivery support.",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const isMarathi = locale === "mr";

  return (
    <div
      data-section="contact-page"
      className="relative min-h-screen bg-[#071A24] text-white pt-28 sm:pt-36 pb-24 overflow-hidden selection:bg-[#0A9AD9] selection:text-white"
    >
      {/* Ocean Caustics Backdrops */}
      <div
        className="absolute top-0 right-0 w-full h-[650px] bg-[radial-gradient(circle_at_85%_20%,rgba(11,157,216,0.14)_0%,transparent_60%)] pointer-events-none select-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_15%_90%,rgba(110,198,240,0.08)_0%,transparent_50%)] pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* Route Header with single proper H1 */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#6EC6F0]/30 text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider font-bold mb-4 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{isMarathi ? "कराड ग्राहक सहाय्य व थेट संपर्क" : "KARAD CUSTOMER SUPPORT & ORDER DESK"}</span>
        </div>
        <h1
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]`}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-base sm:text-xl text-[#E9F7FF]/85 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Main Grid: Form + Outpost Details */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#02111F]/80 border border-[#6EC6F0]/20 p-8 backdrop-blur-md space-y-6">
              <h2 className="text-2xl font-black text-white">
                {isMarathi ? "कराड मुख्यालय व दालन" : "Karad Outpost & Office"}
              </h2>

              <div className="space-y-4 text-sm text-[#E9F7FF]/85">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#0A9AD9] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Address
                    </span>
                    <p className="mt-0.5">{PLACEHOLDERS.STORE_ADDRESS_KARAD}</p>
                    <p className="text-xs text-white/50 mt-1 font-mono-accent">
                      Landmark: {PLACEHOLDERS.STORE_LANDMARK}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#6EC6F0] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Operating Hours
                    </span>
                    <p className="mt-0.5">{PLACEHOLDERS.DAILY_HOURS}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Direct Telephone
                    </span>
                    <p className="mt-0.5 font-mono-accent text-white font-bold">
                      {PLACEHOLDERS.CONTACT_PHONE}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#0A9AD9] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Email
                    </span>
                    <p className="mt-0.5 font-mono-accent">{PLACEHOLDERS.STORE_EMAIL}</p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Button */}
              <div className="pt-4 border-t border-[#6EC6F0]/15">
                <a
                  href={`https://wa.me/${PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=Hello%20AN%20Fish%20World%20Karad,%20I%20have%20an%20inquiry`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isMarathi ? "व्हॉट्सॲपवर चॅट करा" : "WhatsApp Quick Chat"}</span>
                </a>
              </div>
            </div>

            {/* Quality / Compliance Badge */}
            <div className="rounded-2xl bg-[#063A63]/30 border border-[#6EC6F0]/20 p-5 flex items-center gap-3.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs text-[#E9F7FF]/80">
                <span className="font-bold text-white block">Government Compliant & Licensed</span>
                <span>FSSAI License No. {PLACEHOLDERS.FSSAI_LICENSE}</span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#02111F]/80 border border-[#6EC6F0]/20 p-8 sm:p-10 backdrop-blur-md">
              <h2 className="text-2xl font-black text-white mb-2">
                {t("formTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-[#E9F7FF]/70 mb-8">
                {t("formDesc")}
              </p>

              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </div>

      <FinalCta />
    </div>
  );
}
