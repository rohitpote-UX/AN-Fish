import Link from "next/link";
import { ChevronRight, Plus, Store } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSuper, todayIST } from "@/lib/adminAuth";

export default async function BranchesPage() {
  const s = await requireSuper();
  const [branches] = await db().query<RowDataPacket[]>(
    `SELECT b.id, b.name, b.address, b.is_active,
        COUNT(CASE WHEN sd.sold_out=0 AND COALESCE(sd.closing_kg, sd.opening_kg+sd.added_kg-COALESCE(w.q,0))>0 THEN 1 END) AS available_fish,
        COALESCE(SUM(COALESCE(sd.closing_kg, sd.opening_kg+sd.added_kg-COALESCE(w.q,0))),0) AS total_kg,
        MAX(sd.updated_at) AS updated,
        (SELECT COUNT(*) FROM orders o WHERE o.branch_id=b.id AND DATE(CONVERT_TZ(o.created_at, @@session.time_zone, '+05:30'))=?) AS orders_today,
        (SELECT COUNT(*) FROM orders o WHERE o.branch_id=b.id AND o.status='new') AS orders_new
     FROM branches b LEFT JOIN stock_days sd ON sd.branch_id=b.id AND sd.day=?
     LEFT JOIN (SELECT branch_id, fish_id, day, SUM(qty_kg) AS q FROM wastage WHERE is_deleted=0 GROUP BY branch_id, fish_id, day) w ON w.branch_id=sd.branch_id AND w.fish_id=sd.fish_id AND w.day=sd.day
     GROUP BY b.id ORDER BY b.id`,
    [todayIST(), todayIST()],
  );
  const ordersBase = await adminHref("/orders");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">सर्व शाखा</h1>
          <p className="text-sm text-[#071C2C]/60">एकूण {branches.length} शाखा · आजची तारीख {todayIST()}</p>
        </div>
        {s.role === "abnexa" && (
          <Link href={await adminHref("/branches/new")} className="flex h-12 items-center gap-2 rounded-xl bg-[#0D9488] px-5 font-bold text-white hover:bg-[#071C2C]">
            <Plus className="size-5" /> नवीन शाखा
          </Link>
        )}
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
            
              <div className="mt-2 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm ring-1 ring-[#071C2C]/10">
                <span className="font-semibold text-[#071C2C]/70">
                  आजचे ऑर्डर्स: <b className="text-[#071C2C]">{b.orders_today}</b>
                  {Number(b.orders_new) > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-[#071C2C]">{b.orders_new} नवीन</span>}
                </span>
                <Link href={`${ordersBase}?branch=${b.id}`} className="!min-h-0 font-bold text-[#0D9488] hover:underline">ऑर्डर्स पहा →</Link>
              </div>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
