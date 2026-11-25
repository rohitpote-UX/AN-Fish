import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { fmtInr } from "@/lib/dateRange";
import { AttendanceButtons, DeletePayment, EditStaff, NewStaffForm, PayStaff } from "./StaffClient";

const ST: Record<string, { t: string; cls: string }> = { present: { t: "हजर", cls: "bg-emerald-100 text-emerald-700" }, half: { t: "अर्धा", cls: "bg-amber-100 text-amber-800" }, absent: { t: "गैरहजर", cls: "bg-red-100 text-red-700" }, leave: { t: "रजा", cls: "bg-sky-100 text-sky-800" } };

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ branch?: string; day?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const today = todayIST();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") && sp.day! <= today ? sp.day! : today;
  const [branches] = await db().query<RowDataPacket[]>(isHead ? "SELECT id, name FROM branches WHERE is_active=1 ORDER BY id" : "SELECT id, name FROM branches WHERE id=?", isHead ? [] : [s.branchId ?? 0]);
  const chosen = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const b = branches.find((x) => x.id === chosen) ?? branches[0];
  if (!b) return <p className="p-10 text-center text-[#7A8794]">शाखा सापडली नाही.</p>;

  const [staff] = await db().query<RowDataPacket[]>("SELECT id, name, phone, job_title, monthly_salary, DATE_FORMAT(joined_on,'%Y-%m-%d') AS joined, is_active FROM staff WHERE branch_id=? ORDER BY is_active DESC, name", [b.id]);
  const [att] = await db().query<RowDataPacket[]>("SELECT staff_id, status FROM staff_attendance WHERE day=? AND staff_id IN (SELECT id FROM staff WHERE branch_id=?)", [day, b.id]);
  const todayMap = new Map(att.map((a) => [a.staff_id as number, a.status as string]));
  const month = day.slice(0, 7);
  const [mon] = await db().query<RowDataPacket[]>(
    "SELECT staff_id, status, COUNT(*) AS n FROM staff_attendance WHERE day BETWEEN ? AND LAST_DAY(?) AND staff_id IN (SELECT id FROM staff WHERE branch_id=?) GROUP BY staff_id, status", [`${month}-01`, `${month}-01`, b.id]);
  const cnt = (id: number, st: string) => Number(mon.find((m) => m.staff_id === id && m.status === st)?.n ?? 0);
  const daysInMonth = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  // Money given to staff: advances (उचल) outstanding, salary settled for this month, advances given this month
  const [adv] = await db().query<RowDataPacket[]>(
    `SELECT staff_id, COALESCE(SUM(CASE WHEN kind='advance' THEN amount END),0) AS adv, COALESCE(SUM(advance_recovered),0) AS rec
     FROM staff_payments WHERE is_deleted=0 AND staff_id IN (SELECT id FROM staff WHERE branch_id=?) GROUP BY staff_id`, [b.id]);
  const [monPay] = await db().query<RowDataPacket[]>(
    `SELECT staff_id, COALESCE(SUM(CASE WHEN kind='salary' AND for_month=? THEN amount + advance_recovered END),0) AS settled,
            COALESCE(SUM(CASE WHEN kind='advance' AND day BETWEEN ? AND LAST_DAY(?) THEN amount END),0) AS adv_month
     FROM staff_payments WHERE is_deleted=0 AND staff_id IN (SELECT id FROM staff WHERE branch_id=?) GROUP BY staff_id`, [month, `${month}-01`, `${month}-01`, b.id]);
  const advOut = (id: number) => { const a = adv.find((x) => x.staff_id === id); return a ? Number(a.adv) - Number(a.rec) : 0; };
  const settled = (id: number) => Number(monPay.find((x) => x.staff_id === id)?.settled ?? 0);
  const advMonth = (id: number) => Number(monPay.find((x) => x.staff_id === id)?.adv_month ?? 0);
  const [history] = await db().query<RowDataPacket[]>(
    `SELECT p.id, p.day, p.kind, p.amount, p.for_month, p.advance_recovered, p.payment_mode, p.note, s.id AS staff_id, s.name
     FROM staff_payments p JOIN staff s ON s.id=p.staff_id WHERE p.is_deleted=0 AND p.branch_id=? ORDER BY p.day DESC, p.id DESC LIMIT 60`, [b.id]);
  const KIND: Record<string, { t: string; cls: string }> = { salary: { t: "पगार", cls: "bg-emerald-100 text-emerald-700" }, advance: { t: "उचल", cls: "bg-amber-100 text-amber-800" }, bonus: { t: "बोनस", cls: "bg-violet-100 text-violet-800" } };
  const MODE: Record<string, string> = { cash: "रोख", upi: "UPI", bank: "बँक" };
  const short = (n: string) => String(n).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const base = await adminHref("/staff");
  const active = staff.filter((x) => x.is_active);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">कर्मचारी (Staff)</h1>
        <p className="text-sm text-[#7A8794]">{short(String(b.name))} · कर्मचारी यादी, रोजची हजेरी आणि महिन्याचा सारांश</p>
      </div>
      {isHead && branches.length > 1 && <div className="flex flex-wrap gap-2">{branches.map((x) => <Link key={x.id} href={`${base}?branch=${x.id}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${x.id === b.id ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>{short(String(x.name))}</Link>)}</div>}

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">हजेरी — {day}</h2>
          <form action={base} className="flex items-center gap-2">
            {isHead && <input type="hidden" name="branch" value={b.id} />}
            <input type="date" name="day" defaultValue={day} max={today} className="h-10 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-semibold" /><button className="h-10 rounded-lg bg-[#071D2B] px-4 text-sm font-bold text-white">पहा</button>
          </form>
        </div>
        {active.length === 0 ? <p className="py-8 text-center text-[#7A8794]">आधी खाली कर्मचारी जोडा.</p> : (
          <ul className="mt-3 divide-y divide-[#172B3A]/8">
            {active.map((x) => (
              <li key={x.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div><p className="font-extrabold">{x.name}</p><p className="text-xs text-[#7A8794]">{x.job_title ?? "—"}</p></div>
                <AttendanceButtons staffId={x.id} day={day} current={todayMap.get(x.id) ?? null} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8"><h2 className="mb-4 text-lg font-extrabold">नवीन कर्मचारी</h2><NewStaffForm branchId={b.id} branches={isHead ? branches.map((x) => ({ id: x.id, name: short(String(x.name)) })) : undefined} /></section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="px-5 pt-4 text-lg font-extrabold">महिन्याचा सारांश — {month}</h2>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-5 py-3">कर्मचारी</th><th className="px-3">आज</th><th className="px-3 text-right">हजर</th><th className="px-3 text-right">अर्धा</th><th className="px-3 text-right">गैरहजर</th><th className="px-3 text-right">रजा</th><th className="px-3 text-right">पगार</th><th className="px-3 text-right">अंदाजे देय</th><th className="px-3 text-right">या महिन्यात दिलेला पगार</th><th className="px-3 text-right">या महिन्यात उचल</th><th className="px-3 text-right">उचल बाकी</th><th className="px-3" /></tr></thead>
            <tbody>
              {staff.map((x) => {
                const worked = cnt(x.id, "present") + cnt(x.id, "half") * 0.5;
                const pay = (Number(x.monthly_salary) / daysInMonth) * worked;
                const t = todayMap.get(x.id);
                return (
                  <tr key={x.id} className={`border-t border-[#172B3A]/8 align-top ${x.is_active ? "" : "opacity-50"}`}>
                    <td className="px-5 py-3"><p className="font-extrabold">{x.name}</p><p className="text-xs text-[#7A8794]">{[x.job_title, x.phone].filter(Boolean).join(" · ")}</p></td>
                    <td className="px-3 py-3">{t ? <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ST[t].cls}`}>{ST[t].t}</span> : <span className="text-[#7A8794]">—</span>}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{cnt(x.id, "present")}</td><td className="px-3 py-3 text-right tabular-nums">{cnt(x.id, "half")}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{cnt(x.id, "absent")}</td><td className="px-3 py-3 text-right tabular-nums">{cnt(x.id, "leave")}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtInr(Number(x.monthly_salary))}</td>
                    <td className="px-3 py-3 text-right font-extrabold tabular-nums">{Number(x.monthly_salary) > 0 ? fmtInr(pay) : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{settled(x.id) > 0 ? <span className="font-bold text-[#16A36A]">{fmtInr(settled(x.id))}</span> : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{advMonth(x.id) > 0 ? fmtInr(advMonth(x.id)) : "—"}</td>
                    <td className="px-3 py-3 text-right font-bold tabular-nums">{advOut(x.id) > 0 ? <span className="text-[#DC5252]">{fmtInr(advOut(x.id))}</span> : "—"}</td>
                    <td className="px-3 py-3"><div className="space-y-2"><PayStaff staffId={x.id} name={x.name} month={month} today={today} dueThisMonth={Math.max(0, pay - settled(x.id))} advanceOut={advOut(x.id)} /><Link href={`${base}/${x.id}`} className="inline-block !min-h-0 text-sm font-bold text-[#0EA5A0] hover:underline">खाते (कधी किती दिले) →</Link></div></td>
                    <td className="px-3 py-3"><EditStaff id={x.id} name={x.name} phone={x.phone ?? ""} title={x.job_title ?? ""} salary={Number(x.monthly_salary)} joined={x.joined ?? ""} active={!!x.is_active} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[#172B3A]/8 p-4 text-xs text-[#7A8794]">«अंदाजे देय» = मासिक पगार ÷ महिन्याचे दिवस ({daysInMonth}) × (हजर + अर्धा दिवस ०.५). हा फक्त अंदाज आहे; तुमच्या नियमानुसार प्रत्यक्ष पगार ठरवा आणि पगार दिल्यावर «खर्च» मध्ये «कर्मचारी» म्हणून नोंदवा.</p>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="px-5 pt-4 text-lg font-extrabold">पगार / उचल — कधी किती दिले</h2>
        {history.length === 0 ? <p className="p-8 text-center text-[#7A8794]">अजून पगार किंवा उचल नोंदवलेली नाही. वरच्या तक्त्यातून «पगार / उचल» दाबा.</p> : (
          <div className="overflow-x-auto"><table className="mt-2 w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-5 py-3">तारीख</th><th className="px-3">कर्मचारी</th><th className="px-3">प्रकार</th><th className="px-3 text-right">दिलेली रक्कम</th><th className="px-3 text-right">उचल कपात</th><th className="px-3">महिना</th><th className="px-3">पद्धत</th><th className="px-3">टीप</th><th /></tr></thead>
            <tbody>{history.map((h) => (
              <tr key={h.id} className="border-t border-[#172B3A]/8">
                <td className="px-5 py-3 font-bold">{String(h.day).slice(0, 10)}</td>
                <td className="px-3"><Link href={`${base}/${h.staff_id}`} className="!min-h-0 font-bold hover:text-[#0EA5A0] hover:underline">{h.name}</Link></td>
                <td className="px-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${KIND[h.kind].cls}`}>{KIND[h.kind].t}</span></td>
                <td className="px-3 text-right font-extrabold tabular-nums">{fmtInr(Number(h.amount))}</td>
                <td className="px-3 text-right tabular-nums">{Number(h.advance_recovered) > 0 ? fmtInr(Number(h.advance_recovered)) : "—"}</td>
                <td className="px-3">{h.for_month ?? "—"}</td><td className="px-3">{MODE[h.payment_mode]}</td>
                <td className="max-w-[200px] truncate px-3 text-[#7A8794]">{h.note ?? ""}</td>
                <td className="px-3"><DeletePayment id={h.id} /></td>
              </tr>))}</tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
