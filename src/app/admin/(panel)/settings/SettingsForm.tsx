"use client";

import { useActionState, useState } from "react";
import { Loader2, Printer } from "lucide-react";
import type { BillData } from "@/lib/pos";
import type { BranchSettings } from "@/lib/branchSettings";
import { PrintPageStyle, Receipt } from "../pos/Receipt";
import { saveSettingsAction, type SettingsState } from "./actions";

const inp = "h-12 w-full rounded-xl border border-[#172B3A]/15 bg-white px-3.5 text-base outline-none focus:border-[#0EA5A0] focus:ring-4 focus:ring-[#0EA5A0]/15";

export function SettingsForm({ branchId, initial, sample }: { branchId: number; initial: BranchSettings; sample: BillData }) {
  const [st, action, pending] = useActionState<SettingsState, FormData>(saveSettingsAction.bind(null, branchId), {});
  const [paper, setPaper] = useState<58 | 80>(initial.paperMm);
  const [auto, setAuto] = useState(initial.autoPrint);
  const [header, setHeader] = useState(initial.headerExtra);
  const [footer, setFooter] = useState(initial.footerText);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px] print:hidden">
        <form action={action} className="space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8 sm:p-6">
          <section>
            <h2 className="text-lg font-extrabold">थर्मल प्रिंटर</h2>
            <p className="mb-3 text-sm text-[#7A8794]">तुमच्या प्रिंटरच्या कागदाची रुंदी निवडा. ही सेटिंग या शाखेच्या सर्व काउंटरवर लागू होते.</p>
            <input type="hidden" name="paper" value={paper} />
            <div className="grid grid-cols-2 gap-3">
              {([58, 80] as const).map((w) => (
                <button key={w} type="button" onClick={() => setPaper(w)} className={`rounded-2xl border-2 p-4 text-left transition ${paper === w ? "border-[#0EA5A0] bg-[#0EA5A0]/8" : "border-[#172B3A]/12 hover:border-[#0EA5A0]/50"}`}>
                  <p className="text-2xl font-extrabold">{w} mm</p>
                  <p className="text-xs font-semibold text-[#7A8794]">{w === 58 ? "छोटा प्रिंटर (२ इंच)" : "मानक काउंटर प्रिंटर (३ इंच)"}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[#F5F7FA] p-4">
              <span>
                <span className="block font-bold">बिल बनताच आपोआप प्रिंट डायलॉग उघडा</span>
                <span className="block text-xs text-[#7A8794]">बंद असल्यास काउंटरवरचा माणूस «प्रिंट करा» दाबतो.</span>
              </span>
              <input type="checkbox" name="autoPrint" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="size-6 shrink-0 accent-[#0EA5A0]" />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-extrabold">बिलावरचा मजकूर</h2>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">पत्त्याखालची अतिरिक्त ओळ (ऐच्छिक)</span>
              <input name="headerExtra" value={header} onChange={(e) => setHeader(e.target.value)} maxLength={120} className={inp} placeholder="उदा. परवाना क्र. / GST क्र. (तुमचा खरा नंबर टाका)" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">बिलाच्या शेवटची ओळ</span>
              <input name="footerText" value={footer} onChange={(e) => setFooter(e.target.value)} required maxLength={120} className={inp} />
            </label>
          </section>

          {st.error && <p role="alert" className="rounded-xl bg-[#DC5252]/10 px-4 py-3 text-sm font-bold text-[#DC5252]">{st.error}</p>}
          {st.ok && <p className="rounded-xl bg-[#16A36A]/10 px-4 py-3 text-sm font-bold text-[#16A36A]">{st.ok}</p>}
          <button disabled={pending} className="flex h-12 items-center gap-2 rounded-xl bg-[#071D2B] px-8 text-base font-bold text-white hover:bg-[#0EA5A0] disabled:opacity-70">
            {pending && <Loader2 className="size-5 animate-spin" />} सेटिंग्ज सेव्ह करा
          </button>
        </form>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8">
            <p className="mb-3 text-sm font-extrabold">बिलाचा नमुना ({paper} mm)</p>
            <div className="overflow-x-auto rounded-xl bg-[#E9EDF0] p-3"><div className="mx-auto w-fit shadow-md"><Receipt bill={sample} widthMm={paper} headerExtra={header} footer={footer} /></div></div>
            <button type="button" onClick={() => window.print()} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#071D2B] text-sm font-extrabold hover:bg-[#071D2B] hover:text-white">
              <Printer className="size-4" /> टेस्ट प्रिंट (नमुना बिल)
            </button>
            <p className="mt-2 text-xs text-[#7A8794]">प्रिंट डायलॉगमध्ये प्रिंटरचा कागद {paper} mm निवडा आणि «Headers and footers» बंद ठेवा. हे नमुना बिल आहे, खरे बिल नाही.</p>
          </div>
        </aside>
      </div>
      <div className="hidden print:block"><PrintPageStyle widthMm={paper} /><Receipt bill={sample} widthMm={paper} headerExtra={header} footer={footer} /></div>
    </>
  );
}
