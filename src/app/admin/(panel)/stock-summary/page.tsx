import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireAnySession, todayIST } from "@/lib/adminAuth";
import { loadStockSummary } from "@/lib/stockSummary";
import { fmtInr, fmtKg } from "@/lib/dateRange";
import { AutoRefresh } from "../AutoRefresh";

export default async function StockSummaryPage({ searchParams }: { searchParams: Promise<{ day?: string; branch?: string }> }) {
  const s = await requireAnySession();
  const sp = await searchParams;
  const isCounter = s.role === "counter";
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const today = todayIST();
  const day = isCounter ? today : /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") && sp.day! <= today ? sp.day! : today;
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const branchId = isHead ? branchFilter : s.branchId ?? 0; // branch & counter logins are locked to their own branch

  const rows = await loadStockSummary(branchId, day);
  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches ORDER BY id") : [[] as RowDataPacket[]];
  const base = await adminHref("/stock-summary");
  const tot = rows.reduce((a, r) => ({ total: a.total + r.total, wastage: a.wastage + r.wastage, billed: a.billed + r.billedKg, amount: a.amount + r.billedAmount, remaining: a.remaining + r.remaining }), { total: 0, wastage: 0, billed: 0, amount: 0, remaining: 0 });
  const short = (n: string) => n.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const stat = (label: string, value: string, tone = "") => (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8"><p className="text-xs font-bold text-[#7A8794]">{label}</p><p className={`mt-1 text-2xl font-extrabold tabular-nums ${tone}`}>{value}</p></div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AutoRefresh seconds={20} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">शिल्लक स्टॉक</h1>
          <p className="text-sm text-[#7A8794]">{day} · प्रत्येक माशाचा एकूण स्टॉक − काउंटर विक्री − वाया गेलेला माल = शिल्लक · दर २० सेकंदांनी आपोआप अपडेट</p>
        </div>
        {!isCounter && (
          <form action={base} className="flex items-center gap-2">
            {branchFilter && <input type="hidden" name="branch" value={branchFilter} />}
            <input type="date" name="day" defaultValue={day} max={today} className="h-11 rounded-xl border border-[#172B3A]/15 bg-white px-3 font-semibold" />
            <button className="h-11 rounded-xl bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        )}
      </div>

      {isHead && (
        <div className="flex flex-wrap gap-2">
          <Link href={`${base}?day=${day}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${!branchFilter ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>सर्व शाखा (एकत्र)</Link>
          {branches.map((b) => <Link key={b.id} href={`${base}?day=${day}&branch=${b.id}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${branchFilter === b.id ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>{short(String(b.name))}</Link>)}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stat("एकूण स्टॉक", fmtKg(tot.total))}
        {stat("काउंटर विक्री", fmtKg(tot.billed), "text-[#E9A23B]")}
        {stat("शिल्लक", fmtKg(tot.remaining), "text-[#16A36A]")}
        {stat("काउंटर विक्री रक्कम", fmtInr(tot.amount))}
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        {rows.length === 0 ? (
          <p className="p-12 text-center text-[#7A8794]">या दिवशी स्टॉकची नोंद नाही. शाखा अ‍ॅडमिनने आजचा स्टॉक भरल्यावर इथे दिसेल.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]">
                  <th className="px-4 py-3">मासा</th><th className="text-right">भाव ₹/kg</th><th className="text-right">सुरुवात</th><th className="text-right">नवीन आवक</th>
                  <th className="text-right">एकूण स्टॉक</th><th className="text-right">काउंटर विक्री (−)</th><th className="text-right">वाया (−)</th><th className="px-4 text-right">शिल्लक</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const pct = r.total > 0 ? Math.min(100, ((r.billedKg + r.wastage) / r.total) * 100) : 0;
                  const out = r.soldOut || r.remaining <= 0;
                  return (
                    <tr key={r.fishId} className="border-t border-[#172B3A]/8 align-middle">
                      <td className="px-4 py-3">
                        <p className="font-extrabold">{r.nameMr}</p>
                        <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-[#16A36A]/20"><div className="h-full rounded-full bg-[#E9A23B]" style={{ width: `${pct}%` }} /></div>
                      </td>
                      <td className="text-right tabular-nums">{r.price !== null ? fmtInr(r.price) : "—"}</td>
                      <td className="text-right tabular-nums">{fmtKg(r.opening)}</td>
                      <td className="text-right tabular-nums">{fmtKg(r.added)}</td>
                      <td className="text-right font-bold tabular-nums">{fmtKg(r.total)}</td>
                      <td className="text-right font-bold tabular-nums text-[#E9A23B]">{r.billedKg > 0 ? `− ${fmtKg(r.billedKg)}` : "—"}</td>
                      <td className="text-right tabular-nums text-[#DC5252]">{r.wastage > 0 ? `− ${fmtKg(r.wastage)}` : "—"}</td>
                      <td className="px-4 text-right">
                        <span className={`inline-block rounded-lg px-3 py-1.5 text-base font-extrabold tabular-nums ${out ? "bg-red-100 text-red-700" : r.remaining < 3 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{out ? "संपले" : fmtKg(r.remaining)}</span>
                        {r.closing !== null && <p className="mt-0.5 text-[11px] font-semibold text-[#7A8794]">क्लोजिंग (मोजणी): {fmtKg(r.closing)}</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#071D2B]/15 bg-[#E8F4F3] font-extrabold">
                  <td className="px-4 py-3">एकूण</td><td /><td /><td />
                  <td className="text-right tabular-nums">{fmtKg(tot.total)}</td>
                  <td className="text-right tabular-nums text-[#E9A23B]">{tot.billed > 0 ? `− ${fmtKg(tot.billed)}` : "—"}</td>
                  <td className="text-right tabular-nums text-[#DC5252]">{tot.wastage > 0 ? `− ${fmtKg(tot.wastage)}` : "—"}</td>
                  <td className="px-4 text-right tabular-nums text-[#16A36A]">{fmtKg(tot.remaining)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
      <p className="text-xs text-[#7A8794]">शिल्लक = सुरुवातीचा स्टॉक + नवीन आवक − वाया गेलेला माल − काउंटरवर बिल केलेला माल. रद्द केलेली बिले धरली जात नाहीत.</p>
    </div>
  );
}
