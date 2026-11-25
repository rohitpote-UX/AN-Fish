import Link from "next/link";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ClipboardList, IndianRupee, PackageCheck, Scale, Trash2, Truck, CheckCircle2, Hourglass } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, todayIST } from "@/lib/adminAuth";
import { getDashboard } from "@/lib/dashboard";
import { PRESETS, fmtInr, fmtKg, parseRange } from "@/lib/dateRange";
import { Donut, HBars, TrendChart } from "@/components/admin/charts";

const ST: Record<string, { t: string; color: string; cls: string }> = {
  new: { t: "नवीन", color: "#E9A23B", cls: "bg-amber-100 text-amber-800" },
  confirmed: { t: "कन्फर्म", color: "#3B82C4", cls: "bg-sky-100 text-sky-800" },
  ready: { t: "तयार", color: "#0EA5A0", cls: "bg-teal-100 text-teal-800" },
  completed: { t: "पूर्ण", color: "#16A36A", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { t: "रद्द", color: "#DC5252", cls: "bg-red-100 text-red-700" },
};

function Delta({ cur, prev, goodWhenUp = true }: { cur: number; prev: number; goodWhenUp?: boolean }) {
  if (prev === 0 && cur === 0) return <span className="text-xs font-semibold text-[#7A8794]">— मागील कालावधीशी तुलना नाही</span>;
  if (prev === 0) return <span className="text-xs font-bold text-[#16A36A]">नवीन</span>;
  const pct = ((cur - prev) / prev) * 100;
  const up = pct >= 0;
  const good = up === goodWhenUp;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${good ? "text-[#16A36A]" : "text-[#DC5252]"}`}>
      <Icon className="size-3.5" />{Math.abs(pct).toFixed(0)}% <span className="font-semibold text-[#7A8794]">मागील कालावधीपेक्षा</span>
    </span>
  );
}

function Kpi({ href, icon: Icon, label, value, tone, children }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: string; children?: React.ReactNode }) {
  return (
    <Link href={href} className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#0EA5A0]/50">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#7A8794]">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl" style={{ background: `${tone}1F`, color: tone }}><Icon className="size-[18px]" /></span>
      </div>
      <p className="mt-2 text-[26px] font-extrabold leading-none tabular-nums">{value}</p>
      <div className="mt-2 min-h-4">{children}</div>
    </Link>
  );
}

function Card({ title, sub, children, className = "" }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8 ${className}`}>
      <h2 className="text-base font-extrabold">{title}</h2>
      {sub && <p className="text-xs text-[#7A8794]">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * Executive dashboard. Head office / Abnexa see every branch; a branch admin gets the same screen
 * locked to their own branch (`fixedBranchId`), served from `basePath`.
 */
export async function HeadDashboard({ sp, fixedBranchId, basePath = "/" }: { sp: Record<string, string | undefined>; fixedBranchId?: number; basePath?: string }) {
  const range = parseRange(sp, "7d");
  const branchId = fixedBranchId ?? (/^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null);
  const [d, [branches], hrefs] = await Promise.all([
    getDashboard(range, branchId),
    db().query<RowDataPacket[]>("SELECT id, name FROM branches WHERE is_active=1 ORDER BY id"),
    Promise.all([basePath, "/reports", "/orders", "/wastage", "/branches"].map((p) => adminHref(p))),
  ]);
  const [home, reports, orders, wastage, branchesHref] = hrefs;
  const ordersHref = orders;
  const { cur, prev } = d;
  const q = (o: Record<string, string | null>) => {
    const p = new URLSearchParams();
    if (range.preset === "custom") { p.set("from", range.from); p.set("to", range.to); } else p.set("range", range.preset);
    if (branchId) p.set("branch", String(branchId));
    for (const [k, v] of Object.entries(o)) { if (v === null) p.delete(k); else p.set(k, v); }
    return `${home}?${p}`;
  };
  const chip = (on: boolean) => `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold ${on ? "bg-[#071D2B] text-white" : "bg-white text-[#172B3A]/75 ring-1 ring-[#172B3A]/12 hover:ring-[#0EA5A0]"}`;
  const short = (n: string) => n.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const wastePct = cur.addedKg > 0 ? (cur.wastageKg / cur.addedKg) * 100 : 0;
  const missing = d.branchesToday.filter((b) => b.entered === 0);
  const rq = `${reports}?type=daywise&from=${range.from}&to=${range.to}${branchId ? `&branch=${branchId}` : ""}`;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">डॅशबोर्ड</h1>
          <p className="text-sm text-[#7A8794]">{range.from === range.to ? range.from : `${range.from} ते ${range.to}`} · {branchId ? short(String(branches.find((b) => b.id === branchId)?.name ?? "")) : "सर्व शाखा"}</p>
        </div>
        <Link href={`${reports}?type=daywise`} className="flex h-11 items-center gap-2 rounded-xl bg-[#071D2B] px-4 text-sm font-bold text-white hover:bg-[#0EA5A0]">सर्व रिपोर्ट्स पहा →</Link>
      </div>

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => <Link key={p.id} href={q({ range: p.id, from: null, to: null })} className={chip(range.preset === p.id)}>{p.label}</Link>)}
          <form action={home} className="ml-auto flex flex-wrap items-center gap-2">
            {branchId && !fixedBranchId && <input type="hidden" name="branch" value={branchId} />}
            <input type="date" name="from" defaultValue={range.from} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <span className="text-[#7A8794]">ते</span>
            <input type="date" name="to" defaultValue={range.to} max={todayIST()} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" />
            <button className="h-10 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        </div>
        {!fixedBranchId && (
          <div className="flex flex-wrap items-center gap-2 border-t border-[#172B3A]/8 pt-3">
            <span className="mr-1 text-xs font-bold text-[#7A8794]">शाखा:</span>
            <Link href={q({ branch: null })} className={chip(!branchId)}>सर्व शाखा</Link>
            {branches.map((b) => <Link key={b.id} href={q({ branch: String(b.id) })} className={chip(branchId === b.id)}>{short(String(b.name))}</Link>)}
          </div>
        )}
      </section>

      {missing.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-extrabold text-amber-900">आज स्टॉक न भरलेल्या शाखा</p>
            <p className="mt-0.5 font-semibold text-amber-800">{missing.map((b) => b.name).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi href={rq} icon={IndianRupee} label="विक्री रक्कम" value={fmtInr(cur.sales)} tone="#0EA5A0"><Delta cur={cur.sales} prev={prev.sales} /></Kpi>
        <Kpi href={`${reports}?type=fishwise&from=${range.from}&to=${range.to}`} icon={Scale} label="विक्री (kg)" value={fmtKg(cur.soldKg)} tone="#3B82C4"><Delta cur={cur.soldKg} prev={prev.soldKg} /></Kpi>
        <Kpi href={orders} icon={ClipboardList} label="ऑर्डर्स" value={String(cur.orders)} tone="#7C5CD6"><Delta cur={cur.orders} prev={prev.orders} /></Kpi>
        <Kpi href={orders} icon={Hourglass} label="प्रलंबित ऑर्डर्स" value={String(cur.pending)} tone="#E9A23B"><span className="text-xs font-semibold text-[#7A8794]">नवीन + कन्फर्म + तयार</span></Kpi>
        <Kpi href={orders} icon={CheckCircle2} label="पूर्ण ऑर्डर्स" value={String(cur.completed)} tone="#16A36A"><span className="text-xs font-semibold text-[#7A8794]">रद्द: {cur.cancelled}</span></Kpi>
        <Kpi href={`${reports}?type=stockday&from=${range.from}&to=${range.to}`} icon={Truck} label="नवीन आवक" value={fmtKg(cur.addedKg)} tone="#0EA5A0"><Delta cur={cur.addedKg} prev={prev.addedKg} /></Kpi>
        <Kpi href={wastage} icon={Trash2} label="वाया गेलेला माल" value={fmtKg(cur.wastageKg)} tone="#DC5252">
          <span className="text-xs font-semibold text-[#7A8794]">आवकेच्या {wastePct.toFixed(1)}%</span>
        </Kpi>
        <Kpi href={`${reports}?type=stockday&range=today`} icon={PackageCheck} label="आज उपलब्ध स्टॉक" value={fmtKg(d.availableKgToday)} tone="#16A36A"><span className="text-xs font-semibold text-[#7A8794]">आत्ता, निवडलेल्या कालावधीपासून स्वतंत्र</span></Kpi>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="विक्रीचा कल (रोज)" sub="बिलांवरून (किंवा क्लोजिंगवरून) रोजची विक्री रक्कम" className="lg:col-span-2"><TrendChart data={d.trend} format={fmtInr} /></Card>
        <Card title="ऑर्डर्सची स्थिती" sub="निवडलेल्या कालावधीतील">
          <Donut items={Object.entries(ST).map(([k, v]) => ({ label: v.t, value: d.statuses[k] ?? 0, color: v.color }))} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {!branchId && (
          <Card title="शाखानुसार विक्री" sub="कोणती शाखा पुढे आहे">
            {d.byBranch.some((b) => b.value > 0) ? <HBars items={d.byBranch} format={fmtInr} /> : <p className="py-6 text-center text-sm text-[#7A8794]">या कालावधीत विक्रीची नोंद नाही.</p>}
          </Card>
        )}
        <Card title="सर्वाधिक विकला जाणारा मासा" sub="किलोनुसार">
          {d.topFish.length ? <HBars items={d.topFish} format={fmtKg} color="#3B82C4" /> : <p className="py-6 text-center text-sm text-[#7A8794]">या कालावधीत विक्रीची नोंद नाही.</p>}
        </Card>
        <Card title="रोख / UPI विभागणी" sub="काउंटर बिलांवरून, आपोआप">
          {d.payments.cash + d.payments.upi + d.payments.other > 0 ? (
            <div className="space-y-4">
              <Donut items={[{ label: "रोख", value: Math.round(d.payments.cash), color: "#16A36A" }, { label: "UPI", value: Math.round(d.payments.upi), color: "#3B82C4" }, { label: "इतर", value: Math.round(d.payments.other), color: "#E9A23B" }].filter((x) => x.value > 0)} format={fmtInr} />
            </div>
          ) : <p className="py-6 text-center text-sm text-[#7A8794]">या कालावधीत काउंटर बिल नाही.</p>}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {!branchId && (
          <Card title="आजची स्थिती (शाखानुसार)" sub="स्टॉक भरला का, किती प्रकार उपलब्ध, ऑर्डर्स" className="lg:col-span-3">
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="text-xs font-bold text-[#7A8794]"><th className="px-2 py-2">शाखा</th><th>स्टॉक</th><th>उपलब्ध</th><th>आजचे ऑर्डर्स</th></tr></thead>
                <tbody>
                  {d.branchesToday.map((b) => (
                    <tr key={b.id} className="border-t border-[#172B3A]/8">
                      <td className="px-2 py-2.5 font-bold"><Link href={`${branchesHref}/${b.id}`} className="hover:text-[#0EA5A0]">{b.name}</Link></td>
                      <td>{b.entered > 0 ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">भरला</span> : <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">बाकी</span>}</td>
                      <td className="tabular-nums">{b.available} प्रकार</td>
                      <td className="tabular-nums">{b.ordersToday}{b.newOrders > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-extrabold">{b.newOrders} नवीन</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        <Card title="अलीकडील ऑर्डर्स" className={branchId ? "lg:col-span-5" : "lg:col-span-2"}>
          {d.recent.length === 0 ? <p className="py-6 text-center text-sm text-[#7A8794]">अजून ऑर्डर नाही.</p> : (
            <ul className="divide-y divide-[#172B3A]/8">
              {d.recent.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link href={`${ordersHref}/${o.id}`} className="!min-h-0 block truncate text-sm font-bold hover:text-[#0EA5A0]">#{o.id} · {o.customer}</Link>
                    <p className="truncate text-xs text-[#7A8794]">{o.branch} · {o.at.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false })}</p>
                  </div>
                  <div className="text-right"><p className="text-sm font-extrabold tabular-nums">{fmtInr(o.total)}</p><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ST[o.status]?.cls}`}>{ST[o.status]?.t}</span></div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <p className="text-xs text-[#7A8794]">टीप: काउंटर बिलिंग वापरणाऱ्या दिवसाची विक्री बिलांवरून (सूट वजा, रद्द बिले वगळून); बाकी दिवसांची सुरुवात + आवक − वाया गेले − क्लोजिंग वरून. सर्व आकडे प्रत्यक्ष नोंदींवरून.</p>
    </div>
  );
}

/** Compact "today" summary for a branch admin, shown above the stock sheet. */
export async function BranchStrip({ branchId }: { branchId: number }) {
  const t = todayIST();
  const d = await getDashboard({ from: t, to: t, preset: "today" }, branchId);
  const [orders, reports, wastage] = await Promise.all([adminHref("/orders"), adminHref("/reports"), adminHref("/wastage")]);
  const items = [
    { href: `${reports}?type=daywise&range=today`, label: "आजची विक्री", value: fmtInr(d.cur.sales), tone: "#0EA5A0", Icon: IndianRupee },
    { href: `${reports}?type=daywise&range=today`, label: "रोख", value: fmtInr(d.payments.cash), tone: "#16A36A", Icon: IndianRupee },
    { href: `${reports}?type=daywise&range=today`, label: "UPI / इतर", value: fmtInr(d.payments.upi + d.payments.other), tone: "#3B82C4", Icon: IndianRupee },
    { href: orders, label: "नवीन ऑर्डर्स", value: String(d.cur.pending), tone: "#E9A23B", Icon: ClipboardList },
    { href: wastage, label: "वाया गेले", value: fmtKg(d.cur.wastageKg), tone: "#DC5252", Icon: Trash2 },
    { href: `${reports}?type=stockday&range=today`, label: "उपलब्ध स्टॉक", value: fmtKg(d.availableKgToday), tone: "#16A36A", Icon: PackageCheck },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      {items.map((i) => (
        <Link key={i.label} href={i.href} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#172B3A]/8 transition hover:ring-[#0EA5A0]/50">
          <div className="flex items-center justify-between"><p className="text-xs font-bold text-[#7A8794]">{i.label}</p><i.Icon className="size-4" style={{ color: i.tone }} /></div>
          <p className="mt-1.5 text-xl font-extrabold tabular-nums">{i.value}</p>
        </Link>
      ))}
    </div>
  );
}
