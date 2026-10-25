import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { BRANCHES_LIST } from "@/data/branches";
import { PLACEHOLDERS } from "@/data/placeholders";
import { BranchDetailCard } from "@/components/sections/branches/BranchDetailCard";
import { ShieldCheck, Truck } from "lucide-react";
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
    path: "/branches",
    titleMr: "कराड व मलकापूर दालने",
    titleEn: "Our Karad Outposts & Flagship Stores",
    descriptionMr: "स्वच्छ, वातानुकूलित आणि दुर्गंधीमुक्त वातावरणात ताजी मासोळी निवडीचा अनुभव घ्या. कराड व मलकापूर.",
    descriptionEn: "Experience odor-free, climate-controlled fresh seafood retail across Karad and surrounding areas.",
  });
}

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("branchesPage");
  const isMarathi = locale === "mr";

  return (
    <div
      data-section="branches-page"
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
          <span>{isMarathi ? "कराड व पाटण दालन नेटवर्क" : "FLAGSHIP RETAIL NETWORK • KARAD & PATAN"}</span>
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

      {/* Branches Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BRANCHES_LIST.map((branch) => (
            <BranchDetailCard key={branch.id} branch={branch} locale={locale} />
          ))}
        </div>

        {/* Coverage & Assurance Bar */}
        <div className="mt-12 rounded-3xl bg-[#02111F]/60 border border-[#6EC6F0]/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#0A9AD9]/20 border border-[#0A9AD9]/40 text-[#6EC6F0]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isMarathi ? "कराड शहर व १५ किमी परिसर जलद घरपोच" : "Fast Doorstep Delivery Across Karad"}
              </h3>
              <p className="text-xs sm:text-sm text-[#E9F7FF]/70">
                {PLACEHOLDERS.DELIVERY_SLOTS}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-accent text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>100% Odor-Free & Clean-Room Butchering</span>
          </div>
        </div>
      </div>

      <FinalCta />
    </div>
  );
}
