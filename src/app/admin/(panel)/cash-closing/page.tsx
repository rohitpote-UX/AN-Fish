import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { getCashPosition } from "@/lib/cash";
import { fmtInr } from "@/lib/dateRange";
import { CashForm } from "./CashForm";

export default async function CashClosingPage({ searchParams }: { searchParams: Promise<{ branch?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const [branches] = await db().query<RowDataPacket[]>(isHead ? "SELECT id, name FROM branches WHERE is_active=1 ORDER BY id" : "SELECT id, name FROM branches WHERE id=?", isHead ? [] : [s.branchId ?? 0]);
  const chosen = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const b = branches.find((x) => x.id === chosen) ?? branches[0];
  if (!b) return <p className="p-10 text-center text-[#7A8794]">शाखा सापडली नाही.</p>;

  const day = todayIST();
  const pos = await getCashPosition(b.id, day);
  const [cur] = await db().query<RowDataPacket[]>("SELECT opening_cash, counted_cash, note, difference FROM cash_closings WHERE branch_id=? AND day=?", [b.id, day]);
  const [hist] = await db().query<RowDataPacket[]>(
    `SELECT c.day, c.opening_cash, c.cash_sales, c.upi_sales, c.other_sales, c.expected_cash, c.counted_cash, c.difference, u.name AS by_name
     FROM cash_closings c LEFT JOIN users u ON u.id=c.closed_by WHERE c.branch_id=? ORDER BY c.day DESC LIMIT 31`, [b.id]);
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const base = await adminHref("/cash-closing");
  const row = (label: string, v: number, sign = "", tone = "") => (
    <div className="flex items-center justify-between py-2.5 text-sm"><span className="font-semibold text-[#172B3A]/75">{label}</span><span className={`font-extrabold tabular-nums ${tone}`}>{sign}{fmtInr(v)}</span></div>
  );
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">रोख बंद करणे (Cash Closing)</h1>
        <p className="text-sm text-[#7A8794]">{short(String(b.name))} · {day} · दिवसअखेर गल्ला मोजा आणि बिलांशी ताळमेळ पहा</p>
      </div>
      {isHead && branches.length > 1 && (
        <div className="flex flex-wrap gap-2">{branches.map((x) => <Link key={x.id} href={`${base}?branch=${x.id}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${x.id === b.id ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>{short(String(x.name))}</Link>)}</div>
      )}
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
          <h2 className="font-extrabold">आजचा हिशोब</h2>
          <div className="mt-2 divide-y divide-[#172B3A]/8">
            {row("रोख विक्री (बिले)", pos.cashSales, "+ ", "text-[#16A36A]")}
            {row("रोख खर्च", pos.cashExpenses, "− ", "text-[#DC5252]")}
            {row("रोख खरेदी / पुरवठादाराला दिलेले", pos.cashPaid - pos.cashExpenses, "− ", "text-[#DC5252]")}
            {row("UPI विक्री (गल्ल्यात नाही)", pos.upiSales)}
            {pos.otherSales > 0 && row("इतर पेमेंट विक्री", pos.otherSales)}
          </div>
          <p className="mt-3 rounded-xl bg-[#F5F7FA] p-3 text-xs text-[#7A8794]">असायला हवी रोख = सुरुवातीची रोख + रोख विक्री − रोख खर्च − रोख खरेदी. रद्द केलेली बिले धरली जात नाहीत.</p>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8 sm:p-6">
          {cur[0] && <p className="mb-4 rounded-xl bg-[#16A36A]/10 px-4 py-2.5 text-sm font-bold text-[#16A36A]">आजची रोख बंद केलेली आहे (तफावत {fmtInr(Number(cur[0].difference))}). गरज असल्यास पुन्हा सेव्ह करता येईल.</p>}
          <CashForm key={`${b.id}-${cur[0] ? 1 : 0}`} branchId={b.id} defaultOpening={pos.defaultOpening} cashSales={pos.cashSales} cashPaid={pos.cashPaid}
            saved={cur[0] ? { counted: Number(cur[0].counted_cash), opening: Number(cur[0].opening_cash), note: cur[0].note ?? "" } : null} />
        </section>
      </div>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="px-5 pt-4 font-extrabold">मागील दिवसांचे क्लोजिंग</h2>
        {hist.length === 0 ? <p className="p-8 text-center text-[#7A8794]">अजून एकही दिवस बंद केलेला नाही.</p> : (
          <div className="overflow-x-auto"><table className="mt-2 w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-5 py-3">तारीख</th><th className="px-3 text-right">सुरुवात</th><th className="px-3 text-right">रोख विक्री</th><th className="px-3 text-right">UPI</th><th className="px-3 text-right">असायला हवी</th><th className="px-3 text-right">मोजलेली</th><th className="px-3 text-right">तफावत</th><th className="px-3">कोणी</th></tr></thead>
            <tbody>{hist.map((h) => {
              const d = Number(h.difference);
              return (
                <tr key={String(h.day)} className="border-t border-[#172B3A]/8">
                  <td className="px-5 py-3 font-bold">{String(h.day).slice(0, 10)}</td>
                  <td className="px-3 text-right tabular-nums">{fmtInr(Number(h.opening_cash))}</td>
                  <td className="px-3 text-right tabular-nums">{fmtInr(Number(h.cash_sales))}</td>
                  <td className="px-3 text-right tabular-nums">{fmtInr(Number(h.upi_sales) + Number(h.other_sales))}</td>
                  <td className="px-3 text-right tabular-nums">{fmtInr(Number(h.expected_cash))}</td>
                  <td className="px-3 text-right font-bold tabular-nums">{fmtInr(Number(h.counted_cash))}</td>
                  <td className={`px-3 text-right font-extrabold tabular-nums ${Math.abs(d) < 0.005 ? "text-[#16A36A]" : d < 0 ? "text-[#DC5252]" : "text-amber-700"}`}>{Math.abs(d) < 0.005 ? "बरोबर" : (d < 0 ? "−" : "+") + fmtInr(Math.abs(d))}</td>
                  <td className="px-3 text-[#7A8794]">{h.by_name ?? "—"}</td>
                </tr>
              );
            })}</tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
