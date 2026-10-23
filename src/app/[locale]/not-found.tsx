import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Compass, ArrowUp, Fish } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div
      data-section="not-found"
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-32 pb-24"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[#0A9AD9]/10 border border-[#6EC6F0]/30 flex items-center justify-center shadow-[0_0_50px_rgba(10,154,217,0.3)] animate-pulse">
          <Fish className="w-12 h-12 text-[#6EC6F0]" />
        </div>
        <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#02111F] border border-[#0A9AD9] text-[11px] font-mono-accent text-[#0A9AD9]">
          999m Depth
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <span className="text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-widest block">
          // 404 Depth Alert • Lost at Sea
        </span>

        {/* Single H1 for not found route */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t("title")}
        </h1>

        <p className="text-base sm:text-lg text-[#E9F7FF]/80 max-w-md mx-auto">
          {t("desc")}
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(10,154,217,0.5)] transition-all duration-200"
          >
            <ArrowUp className="w-4 h-4" />
            <span>{t("backHome")}</span>
          </Link>

          <Link
            href="/catch"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200"
          >
            <Compass className="w-4 h-4 text-[#6EC6F0]" />
            <span>Explore Fresh Catch</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
