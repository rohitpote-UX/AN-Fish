"use client";

import { Printer, X } from "lucide-react";
import type { BillData } from "@/lib/pos";
import { PrintPageStyle, Receipt } from "./Receipt";
import type { BranchSettings } from "@/lib/branchSettings";

/** Receipt preview + print. The actual print copy lives in a print-only block so nothing else is printed. */
export function ReceiptDialog({ bill, settings, onClose, primary }: { bill: BillData; settings: BranchSettings; onClose: () => void; primary?: { label: string; onClick: () => void } }) {
  return (
    <>
      <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 print:hidden" onClick={onClose}>
        <div className="flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#172B3A]/10 px-5 py-3">
            <h2 className="text-lg font-extrabold">बिल क्र. {bill.billNo}</h2>
            <button onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-lg hover:bg-[#172B3A]/5"><X className="size-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#E9EDF0] p-4">
            <div className="mx-auto w-fit shadow-md"><Receipt bill={bill} widthMm={settings.paperMm} headerExtra={settings.headerExtra} footer={settings.footerText} /></div>
          </div>
          <div className="space-y-3 border-t border-[#172B3A]/10 p-4">
            <p className="text-xs font-semibold text-[#7A8794]">कागद: {settings.paperMm} mm · बदलायचे असल्यास «सेटिंग्ज» मध्ये जा.</p>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#071D2B] text-base font-extrabold text-white hover:bg-[#0EA5A0]"><Printer className="size-5" /> प्रिंट करा</button>
              {primary && <button onClick={primary.onClick} className="h-14 flex-1 rounded-xl bg-[#16A36A] text-base font-extrabold text-white hover:brightness-110">{primary.label}</button>}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden print:block"><PrintPageStyle widthMm={settings.paperMm} /><Receipt bill={bill} widthMm={settings.paperMm} headerExtra={settings.headerExtra} footer={settings.footerText} /></div>
    </>
  );
}
