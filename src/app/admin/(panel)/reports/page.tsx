import Link from "next/link";
import { Download } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { PRESETS, fmtInr, fmtKg, parseRange } from "@/lib/dateRange";
import { REPORT_LIST, runReport, type Cell, type Kind } from "@/lib/reports";
import { PrintButton } from "./PrintButton";

const SHOW = 500;
const show = (kind: Kind, v: Cell) => (v === null || v === undefined || v === "" ? "—" : kind === "kg" ? fmtKg(Number(v)) : kind === "inr" ? fmtInr(Number(v)) : kind === "int" ? String(v) : String(v));

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role !== "branch_admin";
  const list = REPORT_LIST.filter((r) => isHead || !r.headOnly);
  const meta = list.find((r) => r.id === sp.type) ?? list[0];
  const range = parseRange(sp, "7d");
  const branchId = !isHead ? s.branchId : /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;

  const [branches] = isHead ? await db().query<RowDataPacket[]>("SELECT id, name FROM branches ORDER BY id") : [[] as RowDataPacket[]];
  const branchName = branchId ? String((branches.find((b) => b.id === branchId)?.name) ?? "") : "";
  const report = await runReport(meta.id, range, branchId);
  const base = await adminHref("/reports");
  const ordersBase = await adminHref("/orders");

  const qs = (o: Record<string, string | null>) => {
    const p = new URLSearchParams();
    p.set("type", meta.id);
    if (range.preset === "custom") { p.set("from", range.from); p.set("to", range.to); } else p.set("range", range.preset);
    if (isHead && branchId) p.set("branch", String(branchId));
    for (const [k, v] of Object.entries(o)) { if (v === null) p.delete(k); else p.set(k, v); }
    return p.toString();
  };
  const chip = (on: boolean) => `rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap ${on ? "bg-[#071D2B] text-white" : "bg-white text-[#172B3A]/75 ring-1 ring-[#172B3A]/12 hover:ring-[#0EA5A0]"}`;
  const shortB = (n: string) => n.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <style>{`@page { size: A4 landscape; margin: 10mm; } @media print { body { background: #fff !important; } }`}</style>

      <div className="print:hidden">
        <h1 className="text-2xl font-extrabold">रिपोर्ट्स</h1>
        <p className="text-sm text-[#7A8794]">दिवसानुसार, माशानुसार आणि शाखेनुसार रिपोर्ट पहा. Excel किंवा PDF मध्ये डाउनलोड करा.</p>
      </div>

      {/* Report type picker */}
      <div className="grid gap-3 print:hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {list.map((r) => (
          <Link key={r.id} href={`${base}?${qs({ type: r.id })}`} className={`rounded-2xl p-4 transition ${r.id === meta.id ? "bg-[#071D2B] text-white shadow-lg" : "bg-white ring-1 ring-[#172B3A]/8 hover:ring-[#0EA5A0]"}`}>
            <p className="font-extrabold">{r.title}</p>
            <p className={`mt-1 text-xs leading-snug ${r.id === meta.id ? "text-white/65" : "text-[#7A8794]"}`}>{r.desc}</p>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => <Link key={p.id} href={`${base}?${qs({ range: p.id, from: null, to: null })}`} className={chip(range.preset === p.id)}>{p.label}</Link>)}
          <form action={base} className="ml-auto flex flex-wrap items-center gap-2">
            <input type="hidden" name="type" value={meta.id} />
            {isHead && branchId && <input type="hidden" name="branch" value={branchId} />}
            <input type="date" name="from" defaultValue={range.from} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <span className="text-[#7A8794]">ते</span>
            <input type="date" name="to" defaultValue={range.to} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <button className="h-10 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        </div>
        {isHead && meta.id !== "branchwise" && (
          <div className="flex flex-wrap items-center gap-2 border-t border-[#172B3A]/8 pt-4">
            <span className="mr-1 text-xs font-bold text-[#7A8794]">शाखा:</span>
            <Link href={`${base}?${qs({ branch: null })}`} className={chip(!branchId)}>सर्व शाखा</Link>
            {branches.map((b) => <Link key={b.id} href={`${base}?${qs({ branch: String(b.id) })}`} className={chip(branchId === b.id)}>{shortB(String(b.name))}</Link>)}
          </div>
        )}
      </section>

      {/* Print-only heading */}
      <div className="hidden print:block">
        <p className="text-xl font-extrabold text-[#0EA5A0]">AN FISH WORLD</p>
        <p className="text-lg font-bold">{report.title}</p>
        <p className="text-sm">कालावधी: {range.from} ते {range.to} · शाखा: {branchId ? shortB(branchName) : "सर्व शाखा"} · तयार केले: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>

      {/* Summary + export */}
      <div className="flex flex-wrap items-stretch gap-3">
        {report.summary.map((x) => (
          <div key={x.label} className="min-w-[150px] flex-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8">
            <p className="text-xs font-bold text-[#7A8794]">{x.label}</p>
            <p className="mt-1 text-xl font-extrabold tabular-nums">{x.value}</p>
          </div>
        ))}
        <div className="flex items-center gap-2 print:hidden">
          <a href={`/api/reports/export?${qs({})}`} className="flex h-11 items-center gap-2 rounded-xl bg-[#16A36A] px-4 text-sm font-bold text-white hover:brightness-110"><Download className="size-4" /> Excel</a>
          <PrintButton />
        </div>
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        {report.rows.length === 0 ? (
          <p className="p-12 text-center text-[#7A8794]">या कालावधीसाठी माहिती नाही. स्टॉक भरल्यावर / ऑर्डर आल्यावर इथे दिसेल.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]">
                  {report.columns.map((c) => <th key={c.key} className={`whitespace-nowrap px-3 py-3 ${c.kind === "kg" || c.kind === "inr" || c.kind === "int" ? "text-right" : ""}`}>{c.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {report.rows.slice(0, SHOW).map((r, i) => (
                  <tr key={i} className="border-t border-[#172B3A]/8 hover:bg-[#F5F7FA]/60">
                    {report.columns.map((c) => (
                      <td key={c.key} className={`px-3 py-2.5 ${c.kind === "kg" || c.kind === "inr" || c.kind === "int" ? "text-right tabular-nums" : ""} ${c.key === "fish" || c.key === "day" || c.key === "branch" ? "font-bold" : ""}`}>
                        {meta.id === "orders" && c.key === "id" ? <Link href={`${ordersBase}/${r[c.key]}`} className="!min-h-0 font-extrabold text-[#0EA5A0] hover:underline">#{String(r[c.key])}</Link> : c.key === "status" ? <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r[c.key] === "संपले" || r[c.key] === "रद्द" ? "bg-red-100 text-red-700" : r[c.key] === "उपलब्ध" || r[c.key] === "पूर्ण" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{String(r[c.key])}</span> : show(c.kind, r[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {report.totals && (
                <tfoot>
                  <tr className="border-t-2 border-[#071D2B]/15 bg-[#E8F4F3] font-extrabold">
                    {report.columns.map((c) => <td key={c.key} className={`px-3 py-3 ${c.kind === "kg" || c.kind === "inr" || c.kind === "int" ? "text-right tabular-nums" : ""}`}>{report.totals![c.key] !== undefined ? show(c.kind, report.totals![c.key]) : ""}</td>)}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
        {(report.rows.length > SHOW || report.truncated) && (
          <p className="border-t border-[#172B3A]/8 p-3 text-center text-xs font-semibold text-[#7A8794] print:hidden">पहिल्या {SHOW} ओळी दाखवल्या आहेत. संपूर्ण यादी Excel मध्ये मिळेल.</p>
        )}
      </section>
      <p className="text-xs text-[#7A8794]">टीप: ज्या दिवशी शाखेने काउंटरवर बिले बनवली त्या दिवसाची «विक्री» बिलांवरून (सूट वजा करून, रद्द बिले वगळून) मोजली जाते. बिल न वापरलेल्या दिवसाची विक्री = सुरुवात + आवक − वाया गेले − क्लोजिंग (क्लोजिंग भरल्यावर). «तफावत» = पुस्तकानुसार शिल्लक − प्रत्यक्ष मोजलेले क्लोजिंग; पॉझिटिव्ह म्हणजे माल कमी / बिल न केलेली विक्री.</p>
    </div>
  );
}
