"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createBranchAction, type FormState } from "../actions";

const inp = "h-12 w-full rounded-xl border border-[#071C2C]/15 bg-white px-3.5 text-base outline-none focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/15";

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#071C2C]/50">{hint}</span>}
    </label>
  );
}

export function NewBranchForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createBranchAction, {});
  return (
    <form action={action} className="space-y-8">
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 sm:p-6">
        <h2 className="mb-4 text-lg font-extrabold">शाखेची माहिती</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="शाखेचे नाव"><input name="name" required className={inp} placeholder="ए एन फिश वर्ल्ड — कराड" /></F>
          <F label="स्लग (URL)" hint="फक्त इंग्रजी लहान अक्षरे आणि '-'"><input name="slug" required className={inp} placeholder="karad-hq" /></F>
          <div className="sm:col-span-2"><F label="पत्ता"><input name="address" className={inp} /></F></div>
          <F label="WhatsApp नंबर" hint="देशकोडासह, फक्त आकडे (उदा. 919876543210)"><input name="whatsapp" required inputMode="numeric" className={inp} /></F>
          <F label="वेळ"><input name="openTime" className={inp} placeholder="सकाळी ७ ते रात्री ९" /></F>
          <F label="मासिक फी (₹)" hint="या शाखेकडून दरमहा मिळणारी रक्कम"><input name="monthlyFee" inputMode="decimal" className={inp} placeholder="0" /></F>
          <F label="Latitude (ऐच्छिक)"><input name="lat" inputMode="decimal" className={inp} placeholder="17.2894" /></F>
          <F label="Longitude (ऐच्छिक)"><input name="lng" inputMode="decimal" className={inp} placeholder="74.1829" /></F>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 sm:p-6">
        <h2 className="mb-1 text-lg font-extrabold">शाखा अ‍ॅडमिन लॉगिन</h2>
        <p className="mb-4 text-sm text-[#071C2C]/55">हा लॉगिन फक्त याच शाखेचा स्टॉक, भाव आणि ऑर्डर्स पाहू शकेल.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="लॉगिन आयडी (मोबाईल / ईमेल)"><input name="loginId" required autoComplete="off" className={inp} /></F>
          <F label="पासवर्ड" hint="किमान ८ अक्षरे"><input name="password" type="text" required minLength={8} autoComplete="off" className={inp} /></F>
        </div>
      </section>

      {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p>}
      <button disabled={pending} className="flex h-12 items-center gap-2 rounded-xl bg-[#071C2C] px-8 text-base font-bold text-white hover:bg-[#0D9488] disabled:opacity-70">
        {pending && <Loader2 className="size-5 animate-spin" />} शाखा तयार करा
      </button>
    </form>
  );
}
