"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, XCircle } from "lucide-react";
import { cancelPurchaseAction, createPurchaseAction } from "./actions";

type Opt = { id: number; name: string };
type Line = { key: number; fishId: string; qty: string; rate: string };
const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0] focus:ring-2 focus:ring-[#0EA5A0]/20";
const l = "mb-1 block text-xs font-semibold text-[#7A8794]";
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
let k = 1;

export function PurchaseForm({ fish, branches, suppliers, isHead }: { fish: Opt[]; branches: Opt[]; suppliers: Opt[]; isHead: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [lines, setLines] = useState<Line[]>([{ key: k++, fishId: String(fish[0]?.id ?? ""), qty: "", rate: "" }]);
  const [branchId, setBranchId] = useState(String(branches[0]?.id ?? ""));
  const [supplierId, setSupplierId] = useState("");
  const [source, setSource] = useState("");
  const [transport, setTransport] = useState("");
  const [other, setOther] = useState("");
  const [mode, setMode] = useState<"cash" | "upi" | "bank" | "credit">("cash");
  const [paid, setPaid] = useState<string | null>(null); // null = pay in full
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});

  const num = (v: string) => Number(v) || 0;
  const itemsTotal = lines.reduce((a, x) => a + Math.round(num(x.qty) * num(x.rate) * 100) / 100, 0);
  const total = itemsTotal + num(transport) + num(other);
  const paidAmt = mode === "credit" ? 0 : paid === null ? total : num(paid);
  const set = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const submit = () => {
    setMsg({});
    start(async () => {
      const r = await createPurchaseAction({
        branchId: isHead ? Number(branchId) : undefined, supplierId: supplierId ? Number(supplierId) : null, source: source || undefined,
        lines: lines.filter((x) => num(x.qty) > 0).map((x) => ({ fishId: Number(x.fishId), qty: num(x.qty), rate: num(x.rate) })),
        transport: num(transport), other: num(other), mode, paid: paidAmt, note: note || undefined,
      });
      if (!r.ok) { setMsg({ err: r.error }); return; }
      setMsg({ ok: `खरेदी #${r.id} नोंदवली आणि आजच्या स्टॉकमध्ये जोडली.` });
      setLines([{ key: k++, fishId: String(fish[0]?.id ?? ""), qty: "", rate: "" }]); setTransport(""); setOther(""); setPaid(null); setNote(""); setSource("");
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isHead && <label className="block"><span className={l}>शाखा</span><select value={branchId} onChange={(e) => setBranchId(e.target.value)} className={inp}>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>}
        <label className="block"><span className={l}>पुरवठादार (ऐच्छिक)</span><select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={inp}><option value="">— निवडा —</option>{suppliers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
        <label className="block"><span className={l}>बंदर / स्रोत</span><input value={source} onChange={(e) => setSource(e.target.value)} maxLength={120} placeholder="उदा. रत्नागिरी बंदर" className={inp} /></label>
      </div>

      <div className="space-y-2">
        <div className="hidden grid-cols-[1fr_130px_130px_120px_44px] gap-2 px-1 text-xs font-bold text-[#7A8794] md:grid"><span>मासा</span><span>प्रमाण (kg)</span><span>खरेदी भाव ₹/kg</span><span className="text-right">रक्कम</span><span /></div>
        {lines.map((x) => (
          <div key={x.key} className="grid grid-cols-2 gap-2 rounded-xl bg-[#F5F7FA] p-2 md:grid-cols-[1fr_130px_130px_120px_44px] md:bg-transparent md:p-0">
            <select value={x.fishId} onChange={(e) => set(x.key, { fishId: e.target.value })} className={inp + " col-span-2 md:col-span-1"} aria-label="मासा">{fish.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
            <input value={x.qty} onChange={(e) => set(x.key, { qty: e.target.value })} type="number" step="0.01" min="0" placeholder="kg" className={inp} aria-label="प्रमाण" />
            <input value={x.rate} onChange={(e) => set(x.key, { rate: e.target.value })} type="number" step="0.01" min="0" placeholder="₹/kg" className={inp} aria-label="भाव" />
            <p className="flex h-11 items-center justify-end font-extrabold tabular-nums">{inr(num(x.qty) * num(x.rate))}</p>
            <button type="button" onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((y) => y.key !== x.key) : ls))} aria-label="Remove" className="grid h-11 place-items-center rounded-lg text-[#DC5252] hover:bg-[#DC5252]/10"><Trash2 className="size-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => setLines((ls) => [...ls, { key: k++, fishId: String(fish[0]?.id ?? ""), qty: "", rate: "" }])} className="flex !min-h-0 h-10 items-center gap-1.5 rounded-lg border border-dashed border-[#0EA5A0] px-4 text-sm font-bold text-[#0B7F7B] hover:bg-[#0EA5A0]/8"><Plus className="size-4" /> आणखी मासा जोडा</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block"><span className={l}>वाहतूक खर्च (₹)</span><input value={transport} onChange={(e) => setTransport(e.target.value)} type="number" min="0" step="0.01" className={inp} /></label>
        <label className="block"><span className={l}>इतर खर्च (₹)</span><input value={other} onChange={(e) => setOther(e.target.value)} type="number" min="0" step="0.01" className={inp} /></label>
        <label className="block"><span className={l}>पेमेंट पद्धत</span><select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className={inp}><option value="cash">रोख</option><option value="upi">UPI</option><option value="bank">बँक</option><option value="credit">उधार (नंतर देणार)</option></select></label>
        <label className="block"><span className={l}>आत्ता दिलेली रक्कम (₹)</span><input value={mode === "credit" ? "0" : paid ?? String(Math.round(total * 100) / 100)} disabled={mode === "credit"} onChange={(e) => setPaid(e.target.value)} type="number" min="0" step="0.01" className={inp} /></label>
        <label className="block sm:col-span-2 lg:col-span-4"><span className={l}>टीप</span><input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className={inp} /></label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#071D2B] p-4 text-white">
        <div className="text-sm"><p className="text-white/60">माल {inr(itemsTotal)} + खर्च {inr(num(transport) + num(other))}</p><p className="text-white/60">बाकी (उधार): {inr(Math.max(0, total - paidAmt))}</p></div>
        <div className="flex items-center gap-4">
          <p className="text-3xl font-extrabold tabular-nums">{inr(total)}</p>
          <button type="button" onClick={submit} disabled={pending || itemsTotal <= 0} className="flex h-12 items-center gap-2 rounded-xl bg-[#16A36A] px-6 font-extrabold hover:brightness-110 disabled:opacity-50">{pending && <Loader2 className="size-5 animate-spin" />} खरेदी नोंदवा</button>
        </div>
      </div>
      {msg.ok && <p className="rounded-xl bg-[#16A36A]/10 px-4 py-3 text-sm font-bold text-[#16A36A]">{msg.ok}</p>}
      {msg.err && <p role="alert" className="rounded-xl bg-[#DC5252]/10 px-4 py-3 text-sm font-bold text-[#DC5252]">{msg.err}</p>}
    </div>
  );
}

export function CancelPurchase({ id }: { id: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={pending}
        onClick={() => { if (!window.confirm(`खरेदी #${id} रद्द करायची? माल स्टॉकमधून परत वजा होईल.`)) return; start(async () => { const r = await cancelPurchaseAction(id); setErr(r.ok ? "" : r.error ?? ""); router.refresh(); }); }}
        className="flex !min-h-0 h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 hover:bg-red-50"
      ><XCircle className="size-4" /> रद्द</button>
      {err && <span className="max-w-[260px] text-xs font-bold text-red-600">{err}</span>}
    </div>
  );
}
