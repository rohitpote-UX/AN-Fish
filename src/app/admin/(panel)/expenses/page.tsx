import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { PRESETS, fmtInr, parseRange } from "@/lib/dateRange";
import { HBars } from "@/components/admin/charts";
import { DeleteExpense, ExpenseForm } from "./ExpenseForm";
import { EXPENSE_CATEGORIES, PAY_MODES } from "./categories";

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const range = parseRange(sp, "month");
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const where = ["e.is_deleted=0", "e.day BETWEEN ? AND ?"];
  const args: (string | number)[] = [range.from, range.to];
  if (!isHead) { where.push("e.branch_id=?"); args.push(s.branchId ?? 0); } else if (branchFilter) { where.push("e.branch_id=?"); args.push(branchFilter); }

  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT e.id, e.day, e.category, e.amount, e.payment_mode, e.note, b.name AS branch, u.name AS by_name
     FROM expenses e LEFT JOIN branches b ON b.id=e.branch_id LEFT JOIN users u ON u.id=e.created_by
     WHERE ${where.join(" AND ")} ORDER BY e.day DESC, e.id DESC LIMIT 500`, args);
  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches ORDER BY id") : [[] as RowDataPacket[]];
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const total = rows.reduce((a, r) => a + Number(r.amount), 0);
  const byCat = Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => ({ label: v, value: rows.filter((r) => r.category === k).reduce((a, r) => a + Number(r.amount), 0) })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  const base = await adminHref("/expenses");
  const q = (o: Record<string, string | null>) => {
    const p = new URLSearchParams();
    if (range.preset === "custom") { p.set("from", range.from); p.set("to", range.to); } else p.set("range", range.preset);
    if (branchFilter) p.set("branch", String(branchFilter));
    for (const [k, v] of Object.entries(o)) { if (v === null) p.delete(k); else p.set(k, v); }
    return `${base}?${p}`;
  };
  const chip = (on: boolean) => `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold ${on ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12 hover:ring-[#0EA5A0]"}`;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">खर्च (Expenses)</h1>
        <p className="text-sm text-[#7A8794]">वाहतूक, बर्फ-पॅकिंग, कर्मचारी, वीज, भाडे, देखभाल. शाखेनुसार खर्च नोंदवा; मुख्य कार्यालय सामायिक खर्चही नोंदवू शकते.</p>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="mb-4 text-lg font-extrabold">नवीन खर्च</h2>
        <ExpenseForm branches={branches.map((b) => ({ id: b.id, name: short(b.name) }))} isHead={isHead} today={todayIST()} />
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => <Link key={p.id} href={q({ range: p.id, from: null, to: null })} className={chip(range.preset === p.id)}>{p.label}</Link>)}
          <form action={base} className="ml-auto flex flex-wrap items-center gap-2">
            {branchFilter && <input type="hidden" name="branch" value={branchFilter} />}
            <input type="date" name="from" defaultValue={range.from} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" /><span className="text-[#7A8794]">ते</span>
            <input type="date" name="to" defaultValue={range.to} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <button className="h-10 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        </div>
        {isHead && (
          <div className="flex flex-wrap items-center gap-2 border-t border-[#172B3A]/8 pt-3">
            <span className="mr-1 text-xs font-bold text-[#7A8794]">शाखा:</span>
            <Link href={q({ branch: null })} className={chip(!branchFilter)}>सर्व</Link>
            {branches.map((b) => <Link key={b.id} href={q({ branch: String(b.id) })} className={chip(branchFilter === b.id)}>{short(b.name)}</Link>)}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
          <p className="text-xs font-bold text-[#7A8794]">एकूण खर्च ({range.from === range.to ? range.from : `${range.from} ते ${range.to}`})</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#DC5252]">{fmtInr(total)}</p>
          <p className="mt-1 text-xs text-[#7A8794]">{rows.length} नोंदी</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8 lg:col-span-2">
          <p className="mb-3 text-sm font-extrabold">प्रकारानुसार</p>
          {byCat.length ? <HBars items={byCat} format={fmtInr} color="#DC5252" /> : <p className="py-4 text-center text-sm text-[#7A8794]">या कालावधीत खर्च नाही.</p>}
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        {rows.length === 0 ? <p className="p-10 text-center text-[#7A8794]">नोंद नाही.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-4 py-3">तारीख</th><th>शाखा</th><th>प्रकार</th><th className="px-3 text-right">रक्कम</th><th className="px-3">पेमेंट</th><th>टीप</th><th>नोंद करणारा</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-[#172B3A]/8">
                    <td className="px-4 py-2.5 font-bold">{String(r.day).slice(0, 10)}</td>
                    <td>{r.branch ? short(r.branch) : <span className="font-semibold text-[#7A8794]">कंपनी (सामायिक)</span>}</td>
                    <td>{EXPENSE_CATEGORIES[r.category as keyof typeof EXPENSE_CATEGORIES]}</td>
                    <td className="px-3 text-right font-bold tabular-nums">{fmtInr(Number(r.amount))}</td>
                    <td className="px-3">{PAY_MODES[r.payment_mode as keyof typeof PAY_MODES]}</td>
                    <td className="max-w-[220px] truncate">{r.note ?? "—"}</td>
                    <td className="text-[#7A8794]">{r.by_name ?? "—"}</td>
                    <td className="px-3"><DeleteExpense id={r.id} /></td>
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
