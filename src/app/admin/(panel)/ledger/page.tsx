import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";

const KIND: Record<string, { t: string; cls: string }> = {
  opening: { t: "सुरुवातीचा स्टॉक", cls: "bg-sky-100 text-sky-800" },
  arrival: { t: "नवीन आवक", cls: "bg-emerald-100 text-emerald-800" },
  wastage: { t: "वाया गेला", cls: "bg-red-100 text-red-700" },
  wastage_removed: { t: "वाया नोंद रद्द", cls: "bg-amber-100 text-amber-800" },
  closing: { t: "क्लोजिंग स्टॉक", cls: "bg-violet-100 text-violet-800" },
  price: { t: "भाव बदल", cls: "bg-slate-100 text-slate-700" },
  sale: { t: "काउंटर विक्री", cls: "bg-orange-100 text-orange-800" },
  sale_void: { t: "विक्री रद्द", cls: "bg-amber-100 text-amber-800" },
};
const PAGE = 25;

export default async function LedgerPage({ searchParams }: { searchParams: Promise<{ day?: string; branch?: string; page?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role !== "branch_admin";
  const today = todayIST();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") ? sp.day! : today;
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const page = Math.max(1, Number(sp.page) || 1);

  const where = ["m.day=?"];
  const args: (string | number)[] = [day];
  if (!isHead) { where.push("m.branch_id=?"); args.push(s.branchId ?? 0); }
  else if (branchFilter) { where.push("m.branch_id=?"); args.push(branchFilter); }

  const [[{ n }]] = (await db().query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM stock_movements m WHERE ${where.join(" AND ")}`, args)) as unknown as [[{ n: number }]];
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT m.id, m.kind, m.prev_value, m.new_value, m.reason, m.created_at, f.name_mr AS fish, b.name AS branch, u.name AS by_name
     FROM stock_movements m JOIN fish_items f ON f.id=m.fish_id JOIN branches b ON b.id=m.branch_id LEFT JOIN users u ON u.id=m.created_by
     WHERE ${where.join(" AND ")} ORDER BY m.id DESC LIMIT ? OFFSET ?`,
    [...args, PAGE, (page - 1) * PAGE],
  );
  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches ORDER BY id") : [[] as RowDataPacket[]];
  const base = await adminHref("/ledger");
  const pages = Math.max(1, Math.ceil(Number(n) / PAGE));
  const q = (o: Record<string, string | number>) => `${base}?${new URLSearchParams({ day, ...(branchFilter ? { branch: String(branchFilter) } : {}), ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)])) })}`;
  const fmt = (kind: string, v: unknown) => (v === null || v === undefined ? "—" : kind === "price" ? `₹${Number(v)}` : `${Number(v).toFixed(2)} kg`);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">स्टॉक नोंदवही (Stock Ledger)</h1>
        <p className="text-sm text-[#7A8794]">स्टॉक आणि भावातील प्रत्येक बदल: कधी, कोणी, किती आधी आणि किती नंतर.</p>
      </div>
      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#172B3A]/8 p-4">
          <p className="text-sm font-bold">{day} · एकूण {n} नोंदी</p>
          <form action={base} className="flex items-center gap-2">
            {branchFilter && <input type="hidden" name="branch" value={branchFilter} />}
            <input type="date" name="day" defaultValue={day} max={today} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <button className="h-10 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        </div>
        {isHead && (
          <div className="flex flex-wrap gap-2 border-b border-[#172B3A]/8 p-4">
            <Link href={q({ page: 1 }).replace(/&?branch=\d+/, "")} className={`rounded-full px-3 py-1.5 text-sm font-bold ${!branchFilter ? "bg-[#071D2B] text-white" : "ring-1 ring-[#172B3A]/15"}`}>सर्व शाखा</Link>
            {branches.map((b) => (
              <Link key={b.id} href={`${base}?day=${day}&branch=${b.id}`} className={`rounded-full px-3 py-1.5 text-sm font-bold ${branchFilter === b.id ? "bg-[#071D2B] text-white" : "ring-1 ring-[#172B3A]/15"}`}>
                {String(b.name).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")}
              </Link>
            ))}
          </div>
        )}
        {rows.length === 0 ? (
          <p className="p-10 text-center text-[#7A8794]">या दिवशी कोणताही बदल नाही.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]">
                <th className="px-4 py-2.5">वेळ</th>{isHead && <th>शाखा</th>}<th>मासा</th><th>प्रकार</th><th>आधी</th><th>नंतर</th><th>कारण</th><th>कोणी</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-[#172B3A]/8">
                    <td className="whitespace-nowrap px-4 py-2.5 text-[#7A8794]">{new Date(r.created_at).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false })}</td>
                    {isHead && <td className="max-w-[160px] truncate">{String(r.branch).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")}</td>}
                    <td className="font-bold">{r.fish}</td>
                    <td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${KIND[r.kind].cls}`}>{KIND[r.kind].t}</span></td>
                    <td className="tabular-nums text-[#7A8794]">{fmt(r.kind, r.prev_value)}</td>
                    <td className="font-bold tabular-nums">{fmt(r.kind, r.new_value)}</td>
                    <td className="max-w-[160px] truncate">{r.reason ?? "—"}</td>
                    <td className="text-[#7A8794]">{r.by_name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-[#172B3A]/8 p-4 text-sm font-bold">
            {page > 1 ? <Link href={q({ page: page - 1 })} className="text-[#0EA5A0]">← मागे</Link> : <span />}
            <span className="text-[#7A8794]">पान {page} / {pages}</span>
            {page < pages ? <Link href={q({ page: page + 1 })} className="text-[#0EA5A0]">पुढे →</Link> : <span />}
          </div>
        )}
      </section>
    </div>
  );
}
