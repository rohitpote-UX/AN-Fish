import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, canAccessBranch, requireSession } from "@/lib/adminAuth";
import { fmtInr } from "@/lib/dateRange";
import { DeletePayment } from "../StaffClient";

const KIND: Record<string, { t: string; cls: string }> = { salary: { t: "पगार", cls: "bg-emerald-100 text-emerald-700" }, advance: { t: "उचल", cls: "bg-amber-100 text-amber-800" }, bonus: { t: "बोनस", cls: "bg-violet-100 text-violet-800" } };
const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", bank: "बँक" };

/** One staff member's complete money statement: every salary, advance (उचल) and bonus, with dates. */
export default async function StaffStatement({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [sr] = await db().query<RowDataPacket[]>("SELECT st.*, b.name AS branch FROM staff st JOIN branches b ON b.id=st.branch_id WHERE st.id=?", [id]);
  const st = sr[0];
  if (!st || !canAccessBranch(s, st.branch_id)) notFound();

  const [pay] = await db().query<RowDataPacket[]>("SELECT id, day, kind, amount, for_month, advance_recovered, payment_mode, note FROM staff_payments WHERE staff_id=? AND is_deleted=0 ORDER BY day DESC, id DESC", [id]);
  const sum = (f: (p: RowDataPacket) => number) => pay.reduce((a, p) => a + f(p), 0);
  const salaryPaid = sum((p) => (p.kind === "salary" ? Number(p.amount) : 0));
  const advGiven = sum((p) => (p.kind === "advance" ? Number(p.amount) : 0));
  const recovered = sum((p) => Number(p.advance_recovered));
  const bonus = sum((p) => (p.kind === "bonus" ? Number(p.amount) : 0));
  const outstanding = advGiven - recovered;

  // month-wise: salary settled for that month, and advances handed out during that month
  const months = new Map<string, { salary: number; recovered: number; advance: number }>();
  const bump = (m: string, f: (x: { salary: number; recovered: number; advance: number }) => void) => { const x = months.get(m) ?? { salary: 0, recovered: 0, advance: 0 }; f(x); months.set(m, x); };
  for (const p of pay) {
    if (p.kind === "salary" && p.for_month) bump(String(p.for_month), (x) => { x.salary += Number(p.amount); x.recovered += Number(p.advance_recovered); });
    if (p.kind === "advance") bump(String(p.day).slice(0, 7), (x) => { x.advance += Number(p.amount); });
  }
  const monthRows = [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  const back = await adminHref(`/staff${s.role === "branch_admin" ? "" : `?branch=${st.branch_id}`}`);
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const card = (label: string, v: number, tone = "") => <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8"><p className="text-xs font-bold text-[#7A8794]">{label}</p><p className={`mt-1 text-2xl font-extrabold tabular-nums ${tone}`}>{fmtInr(v)}</p></div>;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href={back} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0EA5A0]"><ArrowLeft className="size-4" /> कर्मचारी</Link>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#172B3A]/8">
        <h1 className="text-2xl font-extrabold">{st.name}</h1>
        <p className="text-sm text-[#7A8794]">{[st.job_title, st.phone, short(st.branch)].filter(Boolean).join(" · ")} · मासिक पगार {fmtInr(Number(st.monthly_salary))}{!st.is_active ? " · (कामावरून काढले)" : ""}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {card("एकूण दिलेला पगार", salaryPaid, "text-[#16A36A]")}
        {card("एकूण उचल दिली", advGiven, "text-amber-700")}
        {card("पगारातून कपात झालेली उचल", recovered)}
        {card("उचल बाकी (परत यायची)", outstanding, outstanding > 0 ? "text-[#DC5252]" : "")}
        {card("बोनस", bonus, "text-violet-700")}
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="px-5 pt-4 text-lg font-extrabold">महिन्यानुसार</h2>
        {monthRows.length === 0 ? <p className="p-8 text-center text-[#7A8794]">नोंद नाही.</p> : (
          <div className="overflow-x-auto"><table className="mt-2 w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-5 py-3">महिना</th><th className="px-3 text-right">दिलेला पगार</th><th className="px-3 text-right">उचल कपात</th><th className="px-3 text-right">या महिन्यात दिलेली उचल</th></tr></thead>
            <tbody>{monthRows.map(([m, x]) => <tr key={m} className="border-t border-[#172B3A]/8"><td className="px-5 py-3 font-bold">{m}</td><td className="px-3 text-right tabular-nums">{fmtInr(x.salary)}</td><td className="px-3 text-right tabular-nums">{x.recovered > 0 ? fmtInr(x.recovered) : "—"}</td><td className="px-3 text-right tabular-nums">{x.advance > 0 ? fmtInr(x.advance) : "—"}</td></tr>)}</tbody>
          </table></div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="px-5 pt-4 text-lg font-extrabold">सर्व नोंदी — कधी किती दिले</h2>
        {pay.length === 0 ? <p className="p-8 text-center text-[#7A8794]">अजून काही दिलेले नाही.</p> : (
          <div className="overflow-x-auto"><table className="mt-2 w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-5 py-3">तारीख</th><th className="px-3">प्रकार</th><th className="px-3 text-right">दिलेली रक्कम</th><th className="px-3 text-right">उचल कपात</th><th className="px-3">महिना</th><th className="px-3">पद्धत</th><th className="px-3">टीप</th><th /></tr></thead>
            <tbody>{pay.map((p) => (
              <tr key={p.id} className="border-t border-[#172B3A]/8">
                <td className="px-5 py-3 font-bold">{String(p.day).slice(0, 10)}</td>
                <td className="px-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${KIND[p.kind].cls}`}>{KIND[p.kind].t}</span></td>
                <td className="px-3 text-right font-extrabold tabular-nums">{fmtInr(Number(p.amount))}</td>
                <td className="px-3 text-right tabular-nums">{Number(p.advance_recovered) > 0 ? fmtInr(Number(p.advance_recovered)) : "—"}</td>
                <td className="px-3">{p.for_month ?? "—"}</td><td className="px-3">{MODE[p.payment_mode]}</td><td className="max-w-[220px] truncate px-3 text-[#7A8794]">{p.note ?? ""}</td>
                <td className="px-3"><DeletePayment id={p.id} /></td>
              </tr>))}</tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
