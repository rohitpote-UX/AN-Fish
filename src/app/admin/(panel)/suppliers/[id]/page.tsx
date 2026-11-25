import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { fmtInr } from "@/lib/dateRange";
import { PaySupplierForm } from "../SupplierForms";

export default async function SupplierStatement({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [sr] = await db().query<RowDataPacket[]>("SELECT * FROM suppliers WHERE id=?", [id]);
  const sup = sr[0];
  if (!sup) notFound();
  // A manager only sees this supplier's dealings with their own branch.
  const scoped = s.role === "branch_admin";
  const [pur] = await db().query<RowDataPacket[]>(
    `SELECT p.id, p.day, p.total, p.paid, p.payment_mode, b.name AS branch FROM purchases p JOIN branches b ON b.id=p.branch_id WHERE p.supplier_id=? AND p.status='received'${scoped ? " AND p.branch_id=?" : ""} ORDER BY p.id DESC`, scoped ? [id, s.branchId ?? 0] : [id]);
  const [pay] = await db().query<RowDataPacket[]>(`SELECT id, day, amount, payment_mode, note FROM supplier_payments WHERE supplier_id=?${scoped ? " AND branch_id=?" : ""} ORDER BY id DESC`, scoped ? [id, s.branchId ?? 0] : [id]);
  const owed = Number(sup.opening_balance) + pur.reduce((a, r) => a + Number(r.total) - Number(r.paid), 0) - pay.reduce((a, r) => a + Number(r.amount), 0);
  const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", bank: "बँक", credit: "उधार", other: "इतर" };
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href={await adminHref("/suppliers")} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0EA5A0]"><ArrowLeft className="size-4" /> सर्व पुरवठादार</Link>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h1 className="text-2xl font-extrabold">{sup.name}</h1><p className="text-sm text-[#7A8794]">{[sup.supplier_type, sup.phone, sup.address].filter(Boolean).join(" · ") || "—"}</p></div>
          <div className="text-right"><p className="text-xs font-bold text-[#7A8794]">आपण देणे बाकी</p><p className={`text-3xl font-extrabold tabular-nums ${owed > 0 ? "text-[#DC5252]" : "text-[#16A36A]"}`}>{fmtInr(owed)}</p></div>
        </div>
        {Number(sup.opening_balance) > 0 && !scoped && <p className="mt-2 text-xs text-[#7A8794]">यात आधीची बाकी {fmtInr(Number(sup.opening_balance))} समाविष्ट.</p>}
        <div className="mt-5 border-t border-[#172B3A]/8 pt-5"><PaySupplierForm supplierId={id} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
          <h2 className="mb-3 font-extrabold">खरेदी</h2>
          {pur.length === 0 ? <p className="text-sm text-[#7A8794]">नाही.</p> : <ul className="divide-y divide-[#172B3A]/8">{pur.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2.5 text-sm"><span><b>#{r.id}</b> · {String(r.day).slice(0, 10)}<span className="block text-xs text-[#7A8794]">{short(r.branch)} · {MODE[r.payment_mode]}</span></span><span className="text-right"><b className="tabular-nums">{fmtInr(Number(r.total))}</b>{Number(r.total) - Number(r.paid) > 0 && <span className="block text-xs font-bold text-[#DC5252]">बाकी {fmtInr(Number(r.total) - Number(r.paid))}</span>}</span></li>
          ))}</ul>}
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
          <h2 className="mb-3 font-extrabold">दिलेले पेमेंट</h2>
          {pay.length === 0 ? <p className="text-sm text-[#7A8794]">नाही.</p> : <ul className="divide-y divide-[#172B3A]/8">{pay.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2.5 text-sm"><span>{String(r.day).slice(0, 10)} · {MODE[r.payment_mode]}<span className="block text-xs text-[#7A8794]">{r.note ?? ""}</span></span><b className="tabular-nums text-[#16A36A]">{fmtInr(Number(r.amount))}</b></li>
          ))}</ul>}
        </section>
      </div>
    </div>
  );
}
