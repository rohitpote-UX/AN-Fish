import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { adminHref } from "@/lib/adminAuth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (await getSession()) redirect(await adminHref("/"));

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#071C2C] px-4 py-10 font-[Baloo_2,sans-serif]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(13,148,136,0.35),transparent_70%)]" />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          <span className="grid size-20 place-items-center overflow-hidden rounded-full bg-white shadow-[0_18px_50px_-12px_rgba(13,148,136,0.6)]">
            <Image src="/brand/an-fish-logo-badge.webp" alt="AN Fish World" width={80} height={80} priority className="size-full object-contain p-1" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold">AN FISH WORLD</h1>
          <p className="mt-1 text-sm font-medium text-[#5EEAD4]">शाखा व्यवस्थापन पॅनेल</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-8">
          <h2 className="text-xl font-extrabold text-[#071C2C]">लॉगिन</h2>
          <p className="mt-1 text-sm text-[#071C2C]/60">तुमच्या शाखेचा आयडी आणि पासवर्ड टाका.</p>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/50">Powered by Abnexa · abnexa.in</p>
      </div>
    </main>
  );
}
