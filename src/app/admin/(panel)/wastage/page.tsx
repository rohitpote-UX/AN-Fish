import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { DeleteWastage, WastageForm } from "./WastageForm";
import { REASONS } from "./reasons";

export default async function WastagePage({ searchParams }: { searchParams: Promise<{ day?: string; branch?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role !== "branch_admin";
  const today = todayIST();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") ? sp.day! : today;
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;

  const [fish] = await db().query<RowDataPacket[]>("SELECT id, name_mr FROM fish_items WHERE is_active=1 ORDER BY sort_order, id");
  const [branches] = await db().query<RowDataPacket[]>("SELECT id, name FROM branches WHERE is_active=1 ORDER BY id");
  const where = ["w.day=?", "w.is_deleted=0"];
  const args: number[] | (string | number)[] = [day];
  if (!isHead) { where.push("w.branch_id=?"); args.push(s.branchId ?? 0); }
  else if (branchFilter) { where.push("w.branch_id=?"); args.push(branchFilter); }
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT w.id, w.qty_kg, w.reason, w.cost_per_kg, w.note, w.created_at, f.name_mr AS fish, b.name AS branch, u.name AS by_name
     FROM wastage w JOIN fish_items f ON f.id=w.fish_id JOIN branches b ON b.id=w.branch_id LEFT JOIN users u ON u.id=w.created_by
     WHERE ${where.join(" AND ")} ORDER BY w.id DESC`,
    args,
  );
  const totalKg = rows.reduce((a, r) => a + Number(r.qty_kg), 0);
  const totalValue = rows.reduce((a, r) => a + Number(r.qty_kg) * Number(r.cost_per_kg), 0);
  const base = await adminHref("/wastage");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">वाया गेलेला माल (Wastage)</h1>
        <p className="text-sm text-[#7A8794]">खराब / सफाईतील घट / नुकसान नोंदवा. नोंद केलेला माल स्टॉकमधून आपोआप वजा होतो.</p>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="mb-4 text-lg font-extrabold">नवीन नोंद</h2>
        <WastageForm fish={fish.map((f) => ({ id: f.id, name: f.name_mr }))} branches={branches.map((b) => ({ id: b.id, name: b.name }))} fixedBranch={!isHead} today={today} />
      </section>

      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#172B3A]/8 p-4">
          <p className="text-sm font-bold">
            {day} · एकूण {rows.length} नोंदी · <span className="text-[#DC5252]">{totalKg.toFixed(2)} kg</span>
            {totalValue > 0 && <> · अंदाजे मूल्य ₹{totalValue.toLocaleString("en-IN")}</>}
          </p>
          <form action={base} className="flex items-center gap-2">
            {branchFilter && <input type="hidden" name="branch" value={branchFilter} />}
            <input type="date" name="day" defaultValue={day} max={today} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <button className="h-10 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        </div>
        {isHead && (
          <div className="flex flex-wrap gap-2 border-b border-[#172B3A]/8 p-4">
            <Link href={`${base}?day=${day}`} className={`rounded-full px-3 py-1.5 text-sm font-bold ${!branchFilter ? "bg-[#071D2B] text-white" : "ring-1 ring-[#172B3A]/15"}`}>सर्व शाखा</Link>
            {branches.map((b) => (
              <Link key={b.id} href={`${base}?day=${day}&branch=${b.id}`} className={`rounded-full px-3 py-1.5 text-sm font-bold ${branchFilter === b.id ? "bg-[#071D2B] text-white" : "ring-1 ring-[#172B3A]/15"}`}>
                {String(b.name).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")}
              </Link>
            ))}
          </div>
        )}
        {rows.length === 0 ? (
          <p className="p-10 text-center text-[#7A8794]">या दिवशी कोणतीही नोंद नाही.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]">
                <th className="px-4 py-2.5">मासा</th>{isHead && <th>शाखा</th>}<th>प्रमाण</th><th>कारण</th><th>मूल्य</th><th>टीप</th><th>नोंद करणारा</th><th />
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-[#172B3A]/8">
                    <td className="px-4 py-3 font-bold">{r.fish}</td>
                    {isHead && <td className="max-w-[180px] truncate">{String(r.branch).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")}</td>}
                    <td className="font-bold tabular-nums text-[#DC5252]">{Number(r.qty_kg).toFixed(2)} kg</td>
                    <td>{REASONS[r.reason as keyof typeof REASONS]}</td>
                    <td className="tabular-nums">{Number(r.cost_per_kg) > 0 ? `₹${(Number(r.qty_kg) * Number(r.cost_per_kg)).toLocaleString("en-IN")}` : "—"}</td>
                    <td className="max-w-[200px] truncate">{r.note ?? "—"}</td>
                    <td className="text-[#7A8794]">{r.by_name ?? "—"}</td>
                    <td className="px-3"><DeleteWastage id={r.id} /></td>
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
