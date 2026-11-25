"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Delete, Loader2, Pencil, Search, ShoppingCart, Trash2, X } from "lucide-react";
import type { BillData, PosFish } from "@/lib/pos";
import { createBillAction } from "./actions";
import { ReceiptDialog } from "./ReceiptDialog";
import type { BranchSettings } from "@/lib/branchSettings";

type Line = { key: number; fishId: number; qty: number; cut: string };
const CUTS = ["अख्खा स्वच्छ", "तवा फ्राय कट", "कालवण कट", "बोनलेस फिलेट"];
const QUICK = [0.25, 0.5, 1, 1.5, 2, 5];
const CAT: Record<string, string> = { sea: "सागरी", river: "नदीतील", shellfish: "कोळंबी / खेकडा" };
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtQty = (q: number) => `${q.toFixed(3).replace(/\.?0+$/, "")} kg`;

export function PosTerminal({ fish, settings }: { fish: PosFish[]; settings: BranchSettings }) {
  const [cart, setCart] = useState<Line[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [dlg, setDlg] = useState<{ fishId: number; lineKey?: number; qtyStr: string; cut: string } | null>(null);
  const [discount, setDiscount] = useState("");
  const [mode, setMode] = useState<"cash" | "upi" | "other">("cash");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [error, setError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [receipt, setReceipt] = useState<BillData | null>(null);
  const [pending, start] = useTransition();

  const byId = useMemo(() => new Map(fish.map((f) => [f.id, f])), [fish]);
  const cats = useMemo(() => [...new Set(fish.map((f) => f.category).filter(Boolean))] as string[], [fish]);
  const shown = fish.filter((f) => (cat === "all" || f.category === cat) && (!search || f.nameMr.includes(search) || f.nameEn.toLowerCase().includes(search.toLowerCase())));

  const inCart = (fishId: number, exceptKey?: number) => cart.filter((l) => l.fishId === fishId && l.key !== exceptKey).reduce((a, l) => a + l.qty, 0);
  const amount = (l: Line) => Math.round(l.qty * (byId.get(l.fishId)?.price ?? 0));
  const subtotal = cart.reduce((a, l) => a + amount(l), 0);
  const disc = Math.min(Math.max(Number(discount) || 0, 0), subtotal);
  const total = subtotal - disc;

  // ----- weight dialog -----
  const f = dlg ? byId.get(dlg.fishId) : undefined;
  const qty = dlg ? Number(dlg.qtyStr) || 0 : 0;
  const room = f && dlg ? Math.max(0, f.left - inCart(f.id, dlg.lineKey)) : 0;
  const tooMuch = qty > room + 1e-9;
  const press = (k: string) => setDlg((d) => {
    if (!d) return d;
    let s = d.qtyStr;
    if (k === "⌫") s = s.slice(0, -1);
    else if (k === ".") { if (!s.includes(".")) s = (s || "0") + "."; }
    else if (!(s.includes(".") && s.split(".")[1].length >= 3) && s.length < 7) s = s === "0" ? k : s + k;
    return { ...d, qtyStr: s };
  });
  const confirmDlg = () => {
    if (!dlg || !f || qty <= 0 || tooMuch) return;
    setCart((c) => dlg.lineKey ? c.map((l) => (l.key === dlg.lineKey ? { ...l, qty, cut: dlg.cut } : l)) : [...c, { key: Date.now() + Math.random(), fishId: f.id, qty, cut: dlg.cut }]);
    setDlg(null);
    setError("");
  };

  const checkout = () => {
    setError("");
    start(async () => {
      const r = await createBillAction({
        lines: cart.map((l) => ({ fishId: l.fishId, qty: l.qty, cut: l.cut || undefined })),
        discount: disc, mode, customerName: custName || undefined, customerPhone: custPhone || "",
      });
      if (!r.ok) { setError(r.error); return; }
      setReceipt(r.bill);
      setCart([]); setDiscount(""); setCustName(""); setCustPhone(""); setMode("cash"); setCartOpen(false);
      if (settings.autoPrint) setTimeout(() => window.print(), 400);
    });
  };

  const chip = (on: boolean) => `!min-h-0 h-11 whitespace-nowrap rounded-full px-5 text-sm font-bold ${on ? "bg-[#071D2B] text-white" : "bg-white text-[#172B3A]/75 ring-1 ring-[#172B3A]/12"}`;

  const cartPanel = (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
      <div className="flex items-center justify-between border-b border-[#172B3A]/8 px-4 py-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold"><ShoppingCart className="size-5 text-[#0EA5A0]" /> बिल ({cart.length})</h2>
        <div className="flex items-center gap-2">
          {cart.length > 0 && <button onClick={() => setCart([])} className="!min-h-0 h-9 rounded-lg px-3 text-xs font-bold text-[#DC5252] hover:bg-[#DC5252]/10">सर्व काढा</button>}
          <button onClick={() => setCartOpen(false)} aria-label="Close" className="grid size-9 !min-h-0 place-items-center rounded-lg hover:bg-[#172B3A]/5 lg:hidden"><X className="size-5" /></button>
        </div>
      </div>

      <div className="min-h-[120px] flex-1 overflow-y-auto px-4">
        {cart.length === 0 ? (
          <p className="py-10 text-center text-[#7A8794]">डावीकडून मासा निवडा.</p>
        ) : cart.map((l) => {
          const ff = byId.get(l.fishId)!;
          return (
            <div key={l.key} className="flex items-start gap-3 border-b border-[#172B3A]/8 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{ff.nameMr}</p>
                <p className="text-sm text-[#7A8794]">{fmtQty(l.qty)} × {inr(ff.price)}{l.cut ? ` · ${l.cut}` : ""}</p>
              </div>
              <p className="shrink-0 text-lg font-extrabold tabular-nums">{inr(amount(l))}</p>
              <button onClick={() => setDlg({ fishId: l.fishId, lineKey: l.key, qtyStr: String(l.qty), cut: l.cut })} aria-label="Edit" className="grid size-10 !min-h-0 shrink-0 place-items-center rounded-lg text-[#172B3A]/60 hover:bg-[#172B3A]/6"><Pencil className="size-4" /></button>
              <button onClick={() => setCart((c) => c.filter((x) => x.key !== l.key))} aria-label="Remove" className="grid size-10 !min-h-0 shrink-0 place-items-center rounded-lg text-[#DC5252] hover:bg-[#DC5252]/10"><Trash2 className="size-4" /></button>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-[#172B3A]/10 p-4">
        <div className="flex items-center justify-between text-sm font-semibold"><span className="text-[#7A8794]">एकूण</span><span className="tabular-nums">{inr(subtotal)}</span></div>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span className="text-[#7A8794]">सूट (₹)</span>
          <input value={discount} onChange={(e) => setDiscount(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="0" className="h-11 w-28 rounded-lg border border-[#172B3A]/15 px-3 text-right text-base tabular-nums outline-none focus:border-[#0EA5A0]" />
        </label>
        <div className="flex items-center justify-between rounded-xl bg-[#071D2B] px-4 py-3 text-white">
          <span className="font-bold">देय रक्कम</span><span className="text-3xl font-extrabold tabular-nums">{inr(total)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {([["cash", "रोख"], ["upi", "UPI"], ["other", "इतर"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} className={`!min-h-0 h-12 rounded-xl text-sm font-extrabold ${mode === k ? "bg-[#0EA5A0] text-white" : "bg-[#172B3A]/6 text-[#172B3A]/75"}`}>{l}</button>
          ))}
        </div>
        <details className="rounded-xl bg-[#F5F7FA] px-3 py-2 text-sm">
          <summary className="cursor-pointer font-bold text-[#7A8794]">ग्राहकाचे नाव / मोबाईल (ऐच्छिक)</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="नाव" maxLength={120} className="h-11 rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none" />
            <input value={custPhone} onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" placeholder="मोबाईल" className="h-11 rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none" />
          </div>
        </details>
        {error && <p role="alert" className="rounded-lg bg-[#DC5252]/10 px-3 py-2 text-sm font-bold text-[#DC5252]">{error}</p>}
        <button onClick={checkout} disabled={cart.length === 0 || pending} className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#16A36A] text-xl font-extrabold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
          {pending && <Loader2 className="size-6 animate-spin" />} बिल बनवा · {inr(total)}
        </button>
      </div>
    </div>
  );

  return (
    <div className="print:hidden">
      <div className="grid gap-4 lg:grid-cols-[1fr_390px]">
        {/* Fish picker */}
        <div className="min-w-0">
          <div className="sticky top-16 z-10 -mx-4 space-y-3 bg-[#F5F7FA] px-4 pb-3 pt-1 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:px-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7A8794]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="मासा शोधा…" className="h-14 w-full rounded-2xl border border-[#172B3A]/12 bg-white pl-12 pr-4 text-lg outline-none focus:border-[#0EA5A0]" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={() => setCat("all")} className={chip(cat === "all")}>सर्व</button>
              {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{CAT[c] ?? c}</button>)}
            </div>
          </div>

          {fish.length === 0 ? (
            <p className="rounded-2xl bg-white p-10 text-center text-[#7A8794]">आज कोणत्याही माशाचा भाव / स्टॉक भरलेला नाही. शाखा अ‍ॅडमिनला आजचा स्टॉक भरायला सांगा.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {shown.map((x) => {
                const out = x.left <= 0;
                const low = !out && x.left < 3;
                return (
                  <li key={x.id}>
                    <button disabled={out} onClick={() => setDlg({ fishId: x.id, qtyStr: "", cut: "" })} className={`group w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-[#172B3A]/8 transition active:scale-[0.98] ${out ? "opacity-50" : "hover:ring-2 hover:ring-[#0EA5A0]"}`}>
                      <div className="relative aspect-[4/3] bg-[#F5F7FA]">
                        {x.image && <Image src={x.image} alt="" fill sizes="(max-width:640px) 50vw, 25vw" className={`object-contain p-2 ${out ? "grayscale" : ""}`} />}
                        <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${out ? "bg-[#071D2B] text-white" : low ? "bg-amber-400 text-[#071D2B]" : "bg-white text-[#16A36A] shadow"}`}>{out ? "संपले" : `${x.left.toFixed(1)} kg शिल्लक`}</span>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2 min-h-[2.6em] font-extrabold leading-snug">{x.nameMr}</p>
                        <p className="mt-1 text-lg font-extrabold tabular-nums text-[#0EA5A0]">{inr(x.price)}<span className="text-xs font-bold text-[#7A8794]"> / kg</span></p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Cart: side panel on desktop, slide-up sheet on phones */}
        <div className={`lg:sticky lg:top-20 lg:block lg:h-[calc(100vh-9.5rem)] ${cartOpen ? "fixed inset-x-0 bottom-0 top-16 z-40 bg-[#F5F7FA] p-3" : "hidden"}`}>{cartPanel}</div>
      </div>

      {/* phone: cart bar */}
      {!cartOpen && cart.length > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed inset-x-3 bottom-3 z-30 flex h-16 items-center justify-between rounded-2xl bg-[#071D2B] px-5 text-white shadow-2xl lg:hidden">
          <span className="flex items-center gap-2 font-bold"><ShoppingCart className="size-5" /> बिल ({cart.length})</span>
          <span className="text-2xl font-extrabold tabular-nums">{inr(total)}</span>
        </button>
      )}

      {/* Weight dialog */}
      {dlg && f && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-3" onClick={() => setDlg(null)}>
          <div className="max-h-[96vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold">{f.nameMr}</h3>
                <p className="text-sm font-bold text-[#0EA5A0]">{inr(f.price)} / kg · <span className={tooMuch ? "text-[#DC5252]" : "text-[#7A8794]"}>शिल्लक {room.toFixed(2)} kg</span></p>
              </div>
              <button onClick={() => setDlg(null)} aria-label="Close" className="grid size-10 !min-h-0 place-items-center rounded-lg hover:bg-[#172B3A]/6"><X className="size-5" /></button>
            </div>

            <div className="mt-4 rounded-2xl bg-[#F5F7FA] p-4 text-center">
              <p className={`text-5xl font-extrabold tabular-nums ${tooMuch ? "text-[#DC5252]" : ""}`}>{dlg.qtyStr || "0"}<span className="ml-1 text-xl font-bold text-[#7A8794]">kg</span></p>
              <p className="mt-1 text-sm font-semibold text-[#7A8794]">{Math.round(qty * 1000)} ग्रॅम</p>
              <p className="mt-2 text-3xl font-extrabold tabular-nums text-[#16A36A]">{inr(Math.round(qty * f.price))}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK.map((q) => <button key={q} onClick={() => setDlg({ ...dlg, qtyStr: String(q) })} className="!min-h-0 h-11 rounded-full bg-[#0EA5A0]/12 px-4 text-sm font-extrabold text-[#0B7F7B] active:bg-[#0EA5A0]/25">{q < 1 ? `${q * 1000} ग्रॅम` : `${q} kg`}</button>)}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"].map((k) => (
                <button key={k} onClick={() => press(k)} aria-label={k === "⌫" ? "Backspace" : k} className="grid !min-h-0 h-14 place-items-center rounded-xl bg-[#172B3A]/6 text-2xl font-extrabold active:bg-[#172B3A]/15">
                  {k === "⌫" ? <Delete className="size-6" /> : k}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setDlg({ ...dlg, cut: "" })} className={chip(dlg.cut === "")}>कटिंग नाही</button>
              {CUTS.map((c) => <button key={c} onClick={() => setDlg({ ...dlg, cut: c })} className={chip(dlg.cut === c)}>{c}</button>)}
            </div>

            {tooMuch && <p className="mt-3 text-sm font-bold text-[#DC5252]">शिल्लक साठ्यापेक्षा ({room.toFixed(2)} kg) जास्त वजन टाकता येणार नाही.</p>}
            <button onClick={confirmDlg} disabled={qty <= 0 || tooMuch} className="mt-4 h-16 w-full rounded-2xl bg-[#071D2B] text-xl font-extrabold text-white hover:bg-[#0EA5A0] disabled:opacity-40">
              {dlg.lineKey ? "बदल सेव्ह करा" : "बिलात जोडा"}
            </button>
          </div>
        </div>
      )}

      {receipt && <ReceiptDialog bill={receipt} settings={settings} onClose={() => setReceipt(null)} primary={{ label: "नवीन बिल", onClick: () => setReceipt(null) }} />}
    </div>
  );
}
