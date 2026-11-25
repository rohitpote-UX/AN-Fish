import Link from "next/link";
import { ChevronRight, Plus, Store } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { loadStock } from "@/lib/stock";
import { monthIST, monthsSince } from "@/lib/billing";
import { StockEditor } from "./StockEditor";

export default async function AdminHome() {
  const s = await requireSession();

  // Branch admin: straight to their own stock screen.
  if (s.role === "branch_admin" && s.branchId) {
    const [b] = await db().query<RowDataPacket[]>("SELECT name, address FROM branches WHERE id=?", [s.branchId]);
    const { day, rows } = await loadStock(s.branchId);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold">{b[0]?.name}</h1>
          <p className="text-sm text-[#071C2C]/60">{b[0]?.address}</p>
        </div>
        <StockEditor branchId={s.branchId} rows={rows} day={day} />
      </div>
    );
  }

  // Abnexa: registered branches + monthly payment overview.
  if (s.role === "abnexa") {
    const [bs] = await db().query<RowDataPacket[]>("SELECT id, name, is_active, monthly_fee, created_at FROM branches ORDER BY id");
    const [ps] = await db().query<RowDataPacket[]>("SELECT branch_id, month, amount FROM branch_payments");
    const cur = monthIST();
    const paidSet = new Set(ps.map((p) => `${p.branch_id}|${p.month}`));
    const rows = bs.map((b) => {
      const fee = Number(b.monthly_fee);
      const unpaid = fee > 0 ? monthsSince(new Date(b.created_at)).filter((m) => !paidSet.has(`${b.id}|${m}`)) : [];
      return { id: b.id as number, name: b.name as string, is_active: !!b.is_active, fee, unpaid, paidNow: paidSet.has(`${b.id}|${cur}`) };
    });
    const active = rows.filter((r) => r.is_active);
    const expected = active.reduce((a, r) => a + r.fee, 0);
    const received = ps.filter((p) => p.month === cur).reduce((a, p) => a + Number(p.amount), 0);
    const totalDue = rows.reduce((a, r) => a + r.fee * r.unpaid.length, 0);
    const stat = (label: string, value: string, tone = "") => (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10">
        <p className="text-xs font-bold text-[#071C2C]/55">{label}</p>
        <p className={`mt-1 text-2xl font-extrabold tabular-nums ${tone}`}>{value}</p>
      </div>
    );
    const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">Abnexa डॅशबोर्ड</h1>
            <p className="text-sm text-[#071C2C]/60">नोंदणीकृत शाखा आणि मासिक पेमेंट · {cur}</p>
          </div>
          <Link href={await adminHref("/branches/new")} className="flex h-12 items-center gap-2 rounded-xl bg-[#0D9488] px-5 font-bold text-white hover:bg-[#071C2C]">
            <Plus className="size-5" /> नवीन शाखा
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {stat("एकूण शाखा", String(rows.length))}
          {stat("सुरू शाखा", String(active.length), "text-[#0D9488]")}
          {stat("या महिन्याची अपेक्षित फी", inr(expected))}
          {stat("या महिन्यात मिळाले", inr(received), "text-emerald-600")}
          {stat("एकूण बाकी (सर्व महिने)", inr(totalDue), totalDue > 0 ? "text-red-600" : "")}
        </div>
        {rows.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-[#071C2C]/60">अजून शाखा नाही. «नवीन शाखा» दाबा.</p>}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-[#071C2C]/10">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-[#F4F7F5] text-xs font-bold text-[#071C2C]/60">
              <th className="px-4 py-3">शाखा</th><th>स्थिती</th><th>मासिक फी</th><th>या महिन्याचे</th><th>बाकी महिने</th><th />
            </tr></thead>
            <tbody>
              {await Promise.all(rows.map(async (r) => (
                <tr key={r.id} className="border-t border-[#071C2C]/8">
                  <td className="px-4 py-3 font-bold">{r.name}</td>
                  <td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{r.is_active ? "सुरू" : "बंद"}</span></td>
                  <td className="tabular-nums">{r.fee > 0 ? inr(r.fee) : "—"}</td>
                  <td>{r.fee === 0 ? "—" : r.paidNow ? <span className="font-bold text-emerald-600">भरले</span> : <span className="font-bold text-red-600">बाकी</span>}</td>
                  <td className="tabular-nums">{r.unpaid.length || "—"}</td>
                  <td className="px-4 text-right"><Link href={await adminHref(`/branches/${r.id}`)} className="font-bold text-[#0D9488] hover:underline">उघडा →</Link></td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Super admin: all branches with today's summary.
  const [branches] = await db().query<RowDataPacket[]>(
    `SELECT b.id, b.name, b.address, b.is_active,
        COUNT(CASE WHEN sd.sold_out=0 AND (sd.opening_kg+sd.added_kg)>0 THEN 1 END) AS available_fish,
        COALESCE(SUM(sd.opening_kg+sd.added_kg),0) AS total_kg,
        MAX(sd.updated_at) AS updated
     FROM branches b LEFT JOIN stock_days sd ON sd.branch_id=b.id AND sd.day=?
     GROUP BY b.id ORDER BY b.id`,
    [todayIST()],
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">सर्व शाखा</h1>
          <p className="text-sm text-[#071C2C]/60">एकूण {branches.length} शाखा · आजची तारीख {todayIST()}</p>
        </div>
      </div>
      {branches.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-[#071C2C]/60">अजून शाखा नाही. Abnexa ला शाखा तयार करायला सांगा.</p>}
      <ul className="grid gap-4 md:grid-cols-2">
        {await Promise.all(
          branches.map(async (b) => (
            <li key={b.id}>
              <Link href={await adminHref(`/branches/${b.id}`)} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 transition hover:ring-[#0D9488]">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#0D9488]/12 text-[#0D9488]"><Store className="size-6" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold">{b.name}</span>
                  <span className="mt-0.5 block text-sm text-[#071C2C]/60">
                    {b.is_active ? "सुरू" : "बंद"} · आज {b.available_fish} प्रकार उपलब्ध · {Number(b.total_kg).toFixed(1)} kg
                  </span>
                </span>
                <ChevronRight className="size-5 text-[#071C2C]/35" />
              </Link>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
