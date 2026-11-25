import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { adminHref } from "@/lib/adminAuth";
import { getLowStock } from "@/lib/lowStock";

/** Shown to the branch manager: fish about to run out and fish already finished today. Renders nothing when all is well. */
export async function LowStockAlert({ branchId }: { branchId: number }) {
  const { threshold, low, out } = await getLowStock(branchId);
  if (low.length === 0 && out.length === 0) return null;
  const purchases = await adminHref("/purchases");
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-extrabold text-amber-900"><AlertTriangle className="size-5 text-amber-600" /> कमी स्टॉक सूचना</p>
        <Link href={purchases} className="!min-h-0 text-sm font-bold text-amber-900 underline">नवीन खरेदी नोंदवा →</Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {out.map((a) => <span key={a.fishId} className="rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700">{a.nameMr} · संपले</span>)}
        {low.map((a) => <span key={a.fishId} className="rounded-full bg-amber-200 px-3 py-1.5 text-sm font-bold text-amber-900">{a.nameMr} · फक्त {a.left.toFixed(1)} kg</span>)}
      </div>
      <p className="mt-2 text-xs font-semibold text-amber-800">{threshold} kg पेक्षा कमी शिल्लक असलेले मासे दाखवले आहेत. मर्यादा «बिलिंग सेटिंग्ज» मध्ये बदलता येते.</p>
    </div>
  );
}
