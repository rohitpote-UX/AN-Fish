import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { PRESETS, fmtInr, parseRange } from "@/lib/dateRange";
import { CancelPurchase, PurchaseForm } from "./PurchaseForm";

const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", bank: "बँक", credit: "उधार" };

export default async function PurchasesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const range = parseRange(sp, "7d");
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const where = ["p.day BETWEEN ? AND ?"];
  const args: (string | number)[] = [range.from, range.to];
  if (!isHead) { where.push("p.branch_id=?"); args.push(s.branchId ?? 0); } else if (branchFilter) { where.push("p.branch_id=?"); args.push(branchFilter); }

  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT p.id, p.day, p.source, p.items_total, p.transport, p.other_charges, p.total, p.payment_mode, p.paid, p.status, b.name AS branch, sp.name AS supplier,
       (SELECT GROUP_CONCAT(CONCAT(f.name_mr, ' ', pi.qty_kg, 'kg @₹', pi.rate_per_kg) SEPARATOR ', ') FROM purchase_items pi JOIN fish_items f ON f.id=pi.fish_id WHERE pi.purchase_id=p.id) AS items
     FROM purchases p JOIN branches b ON b.id=p.branch_id LEFT JOIN suppliers sp ON sp.id=p.supplier_id
     WHERE ${where.join(" AND ")} ORDER BY p.id DESC LIMIT 300`, args);
  const [fish] = await db().query<RowDataPacket[]>("SELECT id, name_mr FROM fish_items WHERE is_active=1 ORDER BY sort_order, id");
  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches WHERE is_active=1 ORDER BY id") : [[] as RowDataPacket[]];
  const [suppliers] = await db().query<RowDataPacket[]>("SELECT id, name FROM suppliers WHERE is_active=1 ORDER BY name");
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const live = rows.filter((r) => r.status === "received");
  const total = live.reduce((a, r) => a + Number(r.total), 0);
  const due = live.reduce((a, r) => a + (Number(r.total) - Number(r.paid)), 0);
  const base = await adminHref("/purchases");
  const supHref = await adminHref("/suppliers");
  const q = (o: Record<string, string | null>) => {
    const p = new URLSearchParams();
    if (range.preset === "custom") { p.set("from", range.from); p.set("to", range.to); } else p.set("range", range.preset);
    if (branchFilter) p.set("branch", String(branchFilter));
    for (const [k, v] of Object.entries(o)) { if (v === null) p.delete(k); else p.set(k, v); }
    return `${base}?${p}`;
  };
  const chip = (on: boolean) => `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold ${on ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12 hover:ring-[#0EA5A0]"}`;
  const today = todayIST();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">खरेदी (Purchases)</h1>
          <p className="text-sm text-[#7A8794]">बंदर / पुरवठादाराकडून आलेला माल इथे नोंदवा. नोंद करताच माल आजच्या स्टॉकमध्ये «नवीन आवक» म्हणून जोडला जातो.</p>
        </div>
        <Link href={supHref} className="flex h-11 items-center rounded-xl border border-[#071D2B] px-5 text-sm font-bold hover:bg-[#071D2B] hover:text-white">पुरवठादार →</Link>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="mb-4 text-lg font-extrabold">नवीन खरेदी <span className="text-sm font-semibold text-[#7A8794]">· {today}</span></h2>
        {fish.length === 0 ? <p className="text-[#7A8794]">आधी «उत्पादने» मध्ये मासे जोडा.</p> : (
          <PurchaseForm fish={fish.map((f) => ({ id: f.id, name: f.name_mr }))} branches={branches.map((b) => ({ id: b.id, name: short(b.name) }))} suppliers={suppliers.map((x) => ({ id: x.id, name: x.name }))} isHead={isHead} />
        )}
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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["खरेदी", String(live.length)], ["एकूण खरेदी रक्कम", fmtInr(total)], ["दिलेले", fmtInr(total - due)], ["बाकी (उधार)", fmtInr(due)]].map(([a, b]) => (
          <div key={a} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8"><p className="text-xs font-bold text-[#7A8794]">{a}</p><p className={`mt-1 text-2xl font-extrabold tabular-nums ${a === "बाकी (उधार)" && due > 0 ? "text-[#DC5252]" : ""}`}>{b}</p></div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        {rows.length === 0 ? <p className="p-10 text-center text-[#7A8794]">या कालावधीत खरेदी नाही.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-4 py-3">#</th><th>तारीख</th>{isHead && <th>शाखा</th>}<th>पुरवठादार / स्रोत</th><th>माल</th><th className="px-3 text-right">एकूण</th><th className="px-3">पेमेंट</th><th className="px-3 text-right">बाकी</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={`border-t border-[#172B3A]/8 align-top ${r.status === "cancelled" ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-extrabold">#{r.id}</td>
                    <td className="py-3">{String(r.day).slice(0, 10)}</td>
                    {isHead && <td className="py-3">{short(r.branch)}</td>}
                    <td className="py-3">{r.supplier ?? "—"}<span className="block text-xs text-[#7A8794]">{r.source ?? ""}</span></td>
                    <td className="max-w-[300px] py-3 text-[#172B3A]/80">{r.items}{(Number(r.transport) + Number(r.other_charges)) > 0 && <span className="block text-xs text-[#7A8794]">+ खर्च {fmtInr(Number(r.transport) + Number(r.other_charges))}</span>}</td>
                    <td className="px-3 py-3 text-right font-extrabold tabular-nums">{r.status === "cancelled" ? <span className="line-through">{fmtInr(Number(r.total))}</span> : fmtInr(Number(r.total))}</td>
                    <td className="px-3 py-3">{MODE[r.payment_mode]}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{r.status === "cancelled" ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">रद्द</span> : Number(r.total) - Number(r.paid) > 0 ? <span className="font-bold text-[#DC5252]">{fmtInr(Number(r.total) - Number(r.paid))}</span> : "—"}</td>
                    <td className="px-3 py-3">{r.status === "received" && String(r.day).slice(0, 10) === today && <CancelPurchase id={r.id} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="text-xs text-[#7A8794]">खरेदी रद्द फक्त त्याच दिवशी, आणि माल अजून विकला गेला नसेल तरच करता येते.</p>
    </div>
  );
}
