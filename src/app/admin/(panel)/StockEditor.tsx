"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { saveStockAction, type SaveState } from "./stock-actions";

export type StockRow = {
  fishId: number;
  nameMr: string;
  nameEn: string;
  price: number;
  opening: number;
  added: number;
  closing: number | null;
  wastage: number;
  soldOut: boolean;
};

const num = (v: string) => (v === "" ? 0 : Number(v));

function Row({ r }: { r: StockRow }) {
  const [opening, setOpening] = useState(String(r.opening || ""));
  const [added, setAdded] = useState(String(r.added || ""));
  const [closing, setClosing] = useState(r.closing === null ? "" : String(r.closing));
  const [soldOut, setSoldOut] = useState(r.soldOut);

  const total = num(opening) + num(added) - r.wastage;
  const over = closing !== "" && num(closing) > total + 1e-9;
  const sold = closing === "" || over ? null : Math.max(0, total - num(closing));
  const out = soldOut || (closing !== "" && num(closing) === 0);
  const inp =
    "h-11 w-full rounded-lg border border-[#071C2C]/15 bg-white px-2.5 text-base tabular-nums outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20";

  return (
    <tr className="border-t border-[#071C2C]/8 align-middle max-md:block max-md:py-3">
      <td className="px-3 py-2 max-md:block">
        <input type="hidden" name="fishId" value={r.fishId} />
        <p className="font-bold leading-tight">{r.nameMr}</p>
        <p className="text-xs text-[#071C2C]/55">{r.nameEn}</p>
      </td>
      <td className="px-2 py-2 max-md:inline-block max-md:w-1/2">
        <label className="text-[11px] font-semibold text-[#071C2C]/55 md:hidden">भाव ₹/किलो</label>
        <input name={`price_${r.fishId}`} type="number" step="0.01" min="0" defaultValue={r.price || ""} className={inp} />
      </td>
      <td className="px-2 py-2 max-md:inline-block max-md:w-1/2">
        <label className="text-[11px] font-semibold text-[#071C2C]/55 md:hidden">सुरुवातीचा स्टॉक (kg)</label>
        <input name={`opening_${r.fishId}`} type="number" step="0.01" min="0" value={opening} onChange={(e) => setOpening(e.target.value)} className={inp} />
      </td>
      <td className="px-2 py-2 max-md:inline-block max-md:w-1/2">
        <label className="text-[11px] font-semibold text-[#071C2C]/55 md:hidden">नवीन आवक (kg)</label>
        <input name={`added_${r.fishId}`} type="number" step="0.01" min="0" value={added} onChange={(e) => setAdded(e.target.value)} className={inp} />
      </td>
      <td className="px-2 py-2 max-md:inline-block max-md:w-1/2">
        <label className="text-[11px] font-semibold text-[#071C2C]/55 md:hidden">क्लोजिंग स्टॉक (kg)</label>
        <input name={`closing_${r.fishId}`} type="number" step="0.01" min="0" value={closing} onChange={(e) => setClosing(e.target.value)} placeholder="संध्याकाळी" className={inp} />
      </td>
      <td className="px-2 py-2 text-center text-sm font-bold tabular-nums max-md:inline-block max-md:w-1/2">
        <span className="text-[11px] font-semibold text-[#071C2C]/55 md:hidden">वाया गेले: </span>
        {r.wastage > 0 ? <span className="text-red-600">{r.wastage.toFixed(2)} kg</span> : <span className="text-[#071C2C]/35">—</span>}
      </td>
      <td className="px-3 py-2 text-center text-sm font-bold tabular-nums max-md:inline-block max-md:w-1/2">
        {over ? <span className="text-red-600">जास्त!</span> : sold === null ? <span className="text-[#071C2C]/35">—</span> : `${sold.toFixed(2)} kg`}
      </td>
      <td className="px-3 py-2 max-md:block">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
          <input type="checkbox" name={`soldOut_${r.fishId}`} checked={soldOut} onChange={(e) => setSoldOut(e.target.checked)} className="size-5 accent-[#0D9488]" />
          <span className={out ? "text-red-600" : "text-[#0D9488]"}>{out ? "संपले" : "उपलब्ध"}</span>
        </label>
      </td>
    </tr>
  );
}

export function StockEditor({ branchId, rows, day }: { branchId: number; rows: StockRow[]; day: string }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveStockAction.bind(null, branchId), {});
  return (
    <form action={action} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#071C2C]/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#071C2C]/8 px-4 py-3">
        <div>
          <h2 className="text-lg font-extrabold">आजचा स्टॉक आणि भाव</h2>
          <p className="text-xs text-[#071C2C]/55">तारीख: {day} · विक्री = सुरुवात + आवक − वाया गेले − क्लोजिंग</p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="max-md:hidden">
          <tr className="bg-[#F4F7F5] text-xs font-bold text-[#071C2C]/60">
            <th className="px-3 py-2.5">मासा</th>
            <th className="px-2 py-2.5">भाव ₹/kg</th>
            <th className="px-2 py-2.5">सुरुवात (kg)</th>
            <th className="px-2 py-2.5">नवीन आवक (kg)</th>
            <th className="px-2 py-2.5">क्लोजिंग (kg)</th>
            <th className="px-2 py-2.5 text-center">वाया गेले</th>
            <th className="px-3 py-2.5 text-center">विक्री</th>
            <th className="px-3 py-2.5">स्थिती</th>
          </tr>
        </thead>
        <tbody>{rows.map((r) => <Row key={r.fishId} r={r} />)}</tbody>
      </table>
      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-[#071C2C]/10 bg-white/95 px-4 py-3 backdrop-blur">
        <button disabled={pending} className="flex h-12 items-center gap-2 rounded-xl bg-[#071C2C] px-7 text-base font-bold text-white hover:bg-[#0D9488] disabled:opacity-70">
          {pending && <Loader2 className="size-5 animate-spin" />} सेव्ह करा
        </button>
        {state.ok && <span className="flex items-center gap-1.5 text-sm font-bold text-[#0D9488]"><CheckCircle2 className="size-5" /> सेव्ह झाले ({state.at})</span>}
        {state.error && <span role="alert" className="text-sm font-bold text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
