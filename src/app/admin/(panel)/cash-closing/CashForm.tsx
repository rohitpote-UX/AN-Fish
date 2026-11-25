"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { closeCashAction, type CState } from "./actions";

const inp = "h-12 w-full rounded-xl border border-[#172B3A]/15 bg-white px-3.5 text-lg font-bold tabular-nums outline-none focus:border-[#0EA5A0] focus:ring-4 focus:ring-[#0EA5A0]/15";
const inr = (n: number) => `${n < 0 ? "−" : ""}₹${Math.abs(Math.round(n * 100) / 100).toLocaleString("en-IN")}`;

export function CashForm({ branchId, defaultOpening, cashSales, cashPaid, saved }: { branchId: number; defaultOpening: number; cashSales: number; cashPaid: number; saved: { counted: number; opening: number; note: string } | null }) {
  const [st, action, pending] = useActionState<CState, FormData>(closeCashAction.bind(null, branchId), {});
  const [opening, setOpening] = useState(String(saved?.opening ?? defaultOpening));
  const [counted, setCounted] = useState(saved ? String(saved.counted) : "");
  const expected = (Number(opening) || 0) + cashSales - cashPaid;
  const diff = (Number(counted) || 0) - expected;
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">सुरुवातीची रोख (सकाळी गल्ल्यात)</span><input name="opening" type="number" step="0.01" min="0" value={opening} onChange={(e) => setOpening(e.target.value)} className={inp} /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">आता मोजलेली रोख (प्रत्यक्ष)</span><input name="counted" type="number" step="0.01" min="0" required value={counted} onChange={(e) => setCounted(e.target.value)} placeholder="गल्ला मोजून टाका" className={inp} /></label>
      </div>
      <label className="block"><span className="mb-1.5 block text-sm font-semibold">टीप (ऐच्छिक)</span><input name="note" defaultValue={saved?.note ?? ""} maxLength={200} className={inp + " text-base font-normal"} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#F5F7FA] p-4"><p className="text-xs font-bold text-[#7A8794]">पुस्तकानुसार रोख असायला हवी</p><p className="mt-1 text-3xl font-extrabold tabular-nums">{inr(expected)}</p></div>
        <div className={`rounded-2xl p-4 ${counted === "" ? "bg-[#F5F7FA]" : Math.abs(diff) < 0.005 ? "bg-emerald-50" : diff < 0 ? "bg-red-50" : "bg-amber-50"}`}>
          <p className="text-xs font-bold text-[#7A8794]">तफावत (मोजलेली − असायला हवी)</p>
          <p className={`mt-1 text-3xl font-extrabold tabular-nums ${counted === "" ? "text-[#7A8794]" : Math.abs(diff) < 0.005 ? "text-[#16A36A]" : diff < 0 ? "text-[#DC5252]" : "text-amber-700"}`}>{counted === "" ? "—" : Math.abs(diff) < 0.005 ? "बरोबर ✓" : inr(diff)}</p>
          {counted !== "" && Math.abs(diff) >= 0.005 && <p className="text-xs font-semibold text-[#7A8794]">{diff < 0 ? "रोख कमी आहे" : "रोख जास्त आहे"}</p>}
        </div>
      </div>
      {st.error && <p role="alert" className="rounded-xl bg-[#DC5252]/10 px-4 py-3 text-sm font-bold text-[#DC5252]">{st.error}</p>}
      {st.ok && <p className="rounded-xl bg-[#16A36A]/10 px-4 py-3 text-sm font-bold text-[#16A36A]">{st.ok}</p>}
      <button disabled={pending} className="flex h-14 items-center gap-2 rounded-2xl bg-[#071D2B] px-8 text-lg font-extrabold text-white hover:bg-[#0EA5A0] disabled:opacity-70">
        {pending && <Loader2 className="size-5 animate-spin" />} {saved ? "रोख पुन्हा सेव्ह करा" : "आजची रोख बंद करा"}
      </button>
    </form>
  );
}
