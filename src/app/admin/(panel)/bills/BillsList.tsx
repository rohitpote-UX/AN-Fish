"use client";

import { useState, useTransition } from "react";
import { Printer, Ban } from "lucide-react";
import type { BillData } from "@/lib/pos";
import { ReceiptDialog } from "../pos/ReceiptDialog";
import { voidBillAction } from "../pos/actions";

const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", other: "इतर" };
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function BillsList({ bills, canVoid, showBranch }: { bills: BillData[]; canVoid: boolean; showBranch: boolean }) {
  const [open, setOpen] = useState<BillData | null>(null);
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  const voidIt = (b: BillData) => {
    const reason = window.prompt(`बिल #${b.billNo} रद्द करण्याचे कारण लिहा:`);
    if (reason === null) return;
    start(async () => {
      const r = await voidBillAction(b.id, reason);
      setErr(r.ok ? "" : r.error ?? "रद्द करता आले नाही");
    });
  };

  if (bills.length === 0) return <p className="rounded-2xl bg-white p-12 text-center print:hidden text-[#7A8794] shadow-sm ring-1 ring-[#172B3A]/8">या दिवशी बिल नाही.</p>;
  return (
    <>
      {err && <p role="alert" className="mb-3 rounded-lg print:hidden bg-[#DC5252]/10 px-4 py-2 text-sm font-bold text-[#DC5252]">{err}</p>}
      <ul className="grid gap-3 print:hidden lg:grid-cols-2">
        {bills.map((b) => (
          <li key={b.id} className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8 ${b.isVoid ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold">बिल क्र. {b.billNo} <span className="text-sm font-semibold text-[#7A8794]">· {b.time}</span></p>
                {showBranch && <p className="text-xs font-semibold text-[#7A8794]">{b.branchName}</p>}
              </div>
              <div className="text-right">
                <p className={`text-xl font-extrabold tabular-nums ${b.isVoid ? "line-through" : ""}`}>{inr(b.total)}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${b.isVoid ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{b.isVoid ? "रद्द" : MODE[b.mode]}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#172B3A]/75">{b.items.map((i) => `${i.name} ${i.qty.toFixed(3).replace(/\.?0+$/, "")}kg`).join(", ")}</p>
            {b.isVoid && b.voidReason && <p className="mt-1 text-xs font-semibold text-red-700">कारण: {b.voidReason}</p>}
            <div className="mt-3 flex gap-2">
              <button onClick={() => setOpen(b)} className="flex !min-h-0 h-10 items-center gap-1.5 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white hover:bg-[#0EA5A0]"><Printer className="size-4" /> पाहा / प्रिंट</button>
              {canVoid && !b.isVoid && (
                <button onClick={() => voidIt(b)} disabled={pending} className="flex !min-h-0 h-10 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 hover:bg-red-50"><Ban className="size-4" /> रद्द</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {open && <ReceiptDialog bill={open} onClose={() => setOpen(null)} />}
    </>
  );
}
