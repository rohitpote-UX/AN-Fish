import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { loadCustomers } from "@/lib/customers";
import { fmtInr } from "@/lib/dateRange";

const PAGE = 25;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; branch?: string; page?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const q = (sp.q ?? "").trim().slice(0, 60);
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const branchId = isHead ? branchFilter : s.branchId ?? 0; // a manager only ever sees their own branch's customers
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total } = await loadCustomers(branchId, q, PAGE, (page - 1) * PAGE);
  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches ORDER BY id") : [[] as RowDataPacket[]];
  const base = await adminHref("/customers");
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const link = (o: Record<string, string>) => { const p = new URLSearchParams({ ...(q ? { q } : {}), ...(branchFilter ? { branch: String(branchFilter) } : {}), ...o }); return `${base}?${p}`; };
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">ग्राहक (Customers)</h1>
        <p className="text-sm text-[#7A8794]">वेबसाईट ऑर्डर्स आणि काउंटर बिलांवर ज्यांनी मोबाईल नंबर दिला त्या ग्राहकांची यादी, आपोआप तयार होते. एकूण {total} ग्राहक.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <form action={base} className="flex gap-2">
          {branchFilter && <input type="hidden" name="branch" value={branchFilter} />}
          <input name="q" defaultValue={q} placeholder="नाव किंवा मोबाईल शोधा…" className="h-11 w-72 rounded-xl border border-[#172B3A]/15 bg-white px-4 outline-none focus:border-[#0EA5A0]" />
          <button className="h-11 rounded-xl bg-[#071D2B] px-5 text-sm font-bold text-white">शोधा</button>
        </form>
        {isHead && (
          <div className="flex flex-wrap gap-2">
            <Link href={link({ page: "1" }).replace(/&?branch=\d+/, "")} className={`rounded-full px-3.5 py-2 text-sm font-bold ${!branchFilter ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>सर्व शाखा</Link>
            {branches.map((b) => <Link key={b.id} href={`${base}?${new URLSearchParams({ ...(q ? { q } : {}), branch: String(b.id) })}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${branchFilter === b.id ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>{short(b.name)}</Link>)}
          </div>
        )}
      </div>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        {rows.length === 0 ? <p className="p-12 text-center text-[#7A8794]">ग्राहक सापडले नाहीत. ऑर्डर आल्यावर किंवा बिलावर मोबाईल टाकल्यावर इथे दिसतील.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-4 py-3">ग्राहक</th><th>मोबाईल</th><th className="text-right">ऑर्डर्स</th><th className="text-right">काउंटर बिले</th><th className="text-right">एकूण खरेदी</th><th>शेवटची खरेदी</th>{isHead && <th className="text-right">शाखा</th>}<th /></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.phone} className="border-t border-[#172B3A]/8">
                    <td className="px-4 py-3 font-bold">{c.name || "—"}</td>
                    <td className="tabular-nums">{c.phone}</td>
                    <td className="text-right tabular-nums">{c.orders}</td>
                    <td className="text-right tabular-nums">{c.bills}</td>
                    <td className="text-right font-bold tabular-nums">{fmtInr(c.spend)}</td>
                    <td className="text-[#7A8794]">{c.lastAt.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" })}</td>
                    {isHead && <td className="text-right tabular-nums">{c.branches}</td>}
                    <td className="px-3 text-right"><a href={`https://wa.me/91${c.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex !min-h-0 h-9 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-sm font-bold text-[#052E16]"><MessageCircle className="size-4" /> WhatsApp</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-[#172B3A]/8 p-4 text-sm font-bold">
            {page > 1 ? <Link href={link({ page: String(page - 1) })} className="text-[#0EA5A0]">← मागे</Link> : <span />}
            <span className="text-[#7A8794]">पान {page} / {pages}</span>
            {page < pages ? <Link href={link({ page: String(page + 1) })} className="text-[#0EA5A0]">पुढे →</Link> : <span />}
          </div>
        )}
      </section>
      <p className="text-xs text-[#7A8794]">«एकूण खरेदी» = पूर्ण झालेल्या ऑर्डर्स + काउंटर बिले (रद्द वगळून).</p>
    </div>
  );
}
