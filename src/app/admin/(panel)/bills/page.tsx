import Link from "next/link";
import { adminHref, requireAnySession, todayIST } from "@/lib/adminAuth";
import { loadBills } from "@/lib/pos";
import { fmtInr } from "@/lib/dateRange";
import { BillsList } from "./BillsList";
import { AutoRefresh } from "../AutoRefresh";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export default async function BillsPage({ searchParams }: { searchParams: Promise<{ day?: string; branch?: string }> }) {
  const s = await requireAnySession();
  const sp = await searchParams;
  const isCounter = s.role === "counter";
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const today = todayIST();
  // A counter login only ever sees its own branch and today's bills.
  const day = isCounter ? today : /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") ? sp.day! : today;
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const branchId = isHead ? branchFilter : s.branchId ?? 0;
  const bills = await loadBills(branchId, day);

  const live = bills.filter((b) => !b.isVoid);
  const sum = (m?: string) => live.filter((b) => !m || b.mode === m).reduce((a, b) => a + b.total, 0);
  const base = await adminHref("/bills");
  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches ORDER BY id") : [[] as RowDataPacket[]];
  const stat = (label: string, value: string) => (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8"><p className="text-xs font-bold text-[#7A8794]">{label}</p><p className="mt-1 text-xl font-extrabold tabular-nums">{value}</p></div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AutoRefresh seconds={30} />
      <div className="space-y-5 print:hidden">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{isCounter ? "आजची बिले" : "बिले"}</h1>
          <p className="text-sm text-[#7A8794]">{day} · काउंटरवर बनवलेली बिले. जुने बिल पुन्हा प्रिंट करता येते.</p>
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
          <Link href={`${base}?day=${day}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${!branchFilter ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>सर्व शाखा</Link>
          {branches.map((b) => <Link key={b.id} href={`${base}?day=${day}&branch=${b.id}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${branchFilter === b.id ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>{String(b.name).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")}</Link>)}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stat("बिले", String(live.length))}
        {stat("एकूण विक्री", fmtInr(sum()))}
        {stat("रोख", fmtInr(sum("cash")))}
        {stat("UPI / इतर", fmtInr(sum("upi") + sum("other")))}
      </div>
      </div>
      <BillsList bills={bills} canVoid={!isCounter} showBranch={isHead && !branchFilter} />
    </div>
  );
}
