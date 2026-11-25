import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { fmtInr } from "@/lib/dateRange";
import { OUTSTANDING_SQL } from "@/lib/suppliers";
import { NewSupplierForm, ToggleSupplier } from "./SupplierForms";

export default async function SuppliersPage() {
  const s = await requireSession();
  const [rows] = await db().query<RowDataPacket[]>(`SELECT s.id, s.name, s.phone, s.supplier_type, s.payment_terms, s.is_active, (${OUTSTANDING_SQL}) AS outstanding FROM suppliers s ORDER BY s.is_active DESC, s.name`);
  const base = await adminHref("/suppliers");
  const totalDue = rows.reduce((a, r) => a + Math.max(0, Number(r.outstanding)), 0);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">पुरवठादार (Suppliers)</h1>
        <p className="text-sm text-[#7A8794]">बंदर / शेत / व्यापारी यांची यादी आणि त्यांना द्यायची बाकी रक्कम. एकूण बाकी: <b className="text-[#DC5252]">{fmtInr(totalDue)}</b></p>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8"><h2 className="mb-4 text-lg font-extrabold">नवीन पुरवठादार</h2><NewSupplierForm /></section>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        {rows.length === 0 ? <p className="p-10 text-center text-[#7A8794]">अजून पुरवठादार नाही.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-4 py-3">नाव</th><th>प्रकार</th><th>मोबाईल</th><th>अटी</th><th className="px-3 text-right">बाकी</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={`border-t border-[#172B3A]/8 ${r.is_active ? "" : "opacity-50"}`}>
                    <td className="px-4 py-3"><Link href={`${base}/${r.id}`} className="!min-h-0 font-extrabold hover:text-[#0EA5A0] hover:underline">{r.name}</Link></td>
                    <td>{r.supplier_type ?? "—"}</td><td>{r.phone ?? "—"}</td><td>{r.payment_terms ?? "—"}</td>
                    <td className={`px-3 text-right font-extrabold tabular-nums ${Number(r.outstanding) > 0 ? "text-[#DC5252]" : ""}`}>{fmtInr(Number(r.outstanding))}</td>
                    <td className="px-3"><div className="flex justify-end gap-2"><Link href={`${base}/${r.id}`} className="inline-flex !min-h-0 h-9 items-center rounded-lg bg-[#071D2B] px-3 text-sm font-bold text-white hover:bg-[#0EA5A0]">खाते / पेमेंट</Link>{s.role !== "branch_admin" && <ToggleSupplier id={r.id} active={!!r.is_active} />}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
