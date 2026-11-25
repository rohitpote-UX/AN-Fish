import Link from "next/link";
import { Phone, MessageCircle, Clock } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { AutoRefresh } from "../AutoRefresh";
import type { OrderStatus } from "./actions";
import { ORDER_LABEL, ORDER_NEXT, orderWaLink } from "@/lib/orderStatus";
import { StatusButton } from "./StatusButton";

const LABEL = ORDER_LABEL;
const NEXT = ORDER_NEXT;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ day?: string; status?: string; branch?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") ? sp.day! : todayIST();
  const status = (Object.keys(LABEL) as OrderStatus[]).includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : null;

  const where = ["DATE(CONVERT_TZ(o.created_at, @@session.time_zone, '+05:30')) = ?"];
  const args: (string | number)[] = [day];
  const isHead = s.role !== "branch_admin";
  const branchFilter = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  if (!isHead) {
    where.push("o.branch_id = ?");
    args.push(s.branchId ?? 0);
  } else if (branchFilter) {
    where.push("o.branch_id = ?");
    args.push(branchFilter);
  }
  if (status) {
    where.push("o.status = ?");
    args.push(status);
  }
  const [orders] = await db().query<RowDataPacket[]>(
    `SELECT o.id, o.customer_name, o.customer_phone, o.note, o.total, o.status, o.created_at, b.name AS branch_name,
        GROUP_CONCAT(CONCAT(i.fish_name, ' — ', i.qty_kg, ' kg', IF(i.cut IS NULL,'',CONCAT(' (', i.cut, ')'))) SEPARATOR '\n') AS items
     FROM orders o JOIN branches b ON b.id=o.branch_id LEFT JOIN order_items i ON i.order_id=o.id
     WHERE ${where.join(" AND ")} GROUP BY o.id ORDER BY o.id DESC`,
    args,
  );
  // Head office / Abnexa: per-branch order counts for the chosen day (ignores the branch & status filters).
  let branchCounts: RowDataPacket[] = [];
  if (isHead) {
    [branchCounts] = await db().query<RowDataPacket[]>(
      `SELECT b.id, b.name, COUNT(o.id) AS total, COALESCE(SUM(o.status='new'),0) AS new_count
       FROM branches b LEFT JOIN orders o ON o.branch_id=b.id AND DATE(CONVERT_TZ(o.created_at, @@session.time_zone, '+05:30')) = ?
       GROUP BY b.id ORDER BY b.id`,
      [day],
    );
  }
  const base = await adminHref("/orders");
  const q = (extra: Record<string, string | number | null>) => {
    const p = new URLSearchParams({ day });
    if (status) p.set("status", status);
    if (branchFilter) p.set("branch", String(branchFilter));
    for (const [k, v] of Object.entries(extra)) { if (v === null) p.delete(k); else p.set(k, String(v)); }
    return `${base}?${p}`;
  };
  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-[#071C2C] text-white" : "bg-white text-[#071C2C]/70 ring-1 ring-[#071C2C]/10 hover:ring-[#0D9488]"}`;

  return (
    <div className="space-y-6">
      <AutoRefresh seconds={30} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">ऑर्डर्स</h1>
          <p className="text-sm text-[#071C2C]/60">तारीख {day} · एकूण {orders.length} · दर ३० सेकंदांनी आपोआप अपडेट</p>
        </div>
        <form className="flex items-center gap-2" action={base}>
          <input type="date" name="day" defaultValue={day} max={todayIST()} className="h-11 rounded-xl border border-[#071C2C]/15 bg-white px-3 font-semibold" />
          {status && <input type="hidden" name="status" value={status} />}
          {branchFilter && <input type="hidden" name="branch" value={branchFilter} />}
          <button className="h-11 rounded-xl bg-[#071C2C] px-4 text-sm font-bold text-white">पहा</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={q({ status: null })} className={chip(!status)}>सर्व</Link>
        {(Object.keys(LABEL) as OrderStatus[]).map((k) => (
          <Link key={k} href={q({ status: k })} className={chip(status === k)}>{LABEL[k].t}</Link>
        ))}
      </div>

      {isHead && (
        <div>
          <p className="mb-2 text-xs font-bold text-[#071C2C]/55">शाखा निवडा</p>
          <div className="flex flex-wrap gap-2">
            <Link href={q({ branch: null })} className={chip(!branchFilter)}>सर्व शाखा</Link>
            {branchCounts.map((b) => (
              <Link key={b.id} href={q({ branch: b.id })} className={chip(branchFilter === b.id)}>
                {String(b.name).replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")} · {b.total}
                {Number(b.new_count) > 0 && <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[11px] font-extrabold text-[#071C2C]">{b.new_count} नवीन</span>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && <p className="rounded-2xl bg-white p-10 text-center text-[#071C2C]/60">या दिवशी ऑर्डर नाही.</p>}

      <ul className="grid gap-4 lg:grid-cols-2">
        {orders.map((o) => {
          const st = o.status as OrderStatus;
          const next = NEXT[st];
          const waFor = (status: OrderStatus) => orderWaLink({ id: o.id, phone: o.customer_phone, name: o.customer_name, branch: String(o.branch_name), items: String(o.items ?? "").split("\n"), total: Number(o.total) }, status);
          const wa = waFor(st);
          return (
            <li key={o.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`${base}/${o.id}`} className="!min-h-0 text-lg font-extrabold hover:text-[#0D9488] hover:underline">#{o.id} · {o.customer_name}</Link>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#071C2C]/55">
                    <Clock className="size-3.5" />
                    {new Date(o.created_at).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false })}
                    {s.role !== "branch_admin" && <> · {o.branch_name}</>}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${LABEL[st].cls}`}>{LABEL[st].t}</span>
              </div>
              <p className="mt-3 whitespace-pre-line rounded-xl bg-[#F4F7F5] p-3 text-[0.95rem] font-semibold">{o.items}</p>
              {o.note && <p className="mt-2 text-sm text-[#071C2C]/65">{o.note}</p>}
              <p className="mt-2 text-sm">अंदाजे रक्कम: <b>₹{Number(o.total).toLocaleString("en-IN")}</b> <span className="text-[#071C2C]/50">(पेमेंट दालनात)</span></p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`tel:+91${o.customer_phone}`} className="flex h-10 items-center gap-1.5 rounded-lg border border-[#071C2C]/15 px-3 text-sm font-bold"><Phone className="size-4" />{o.customer_phone}</a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-sm font-bold text-[#052E16]"><MessageCircle className="size-4" />WhatsApp</a>
                {next && (
                  <StatusButton
                    orderId={o.id}
                    to={next.to}
                    label={next.to === "confirmed" ? "✅ कन्फर्म करा + मेसेज" : next.to === "ready" ? "🏪 तयार + मेसेज" : next.t}
                    waHref={next.to === "completed" ? undefined : waFor(next.to)}
                    className="h-10 rounded-lg bg-[#0D9488] px-4 text-sm font-bold text-white hover:bg-[#071C2C]"
                  />
                )}
                {st !== "cancelled" && st !== "completed" && (
                  <StatusButton
                    orderId={o.id}
                    to="cancelled"
                    label="रद्द"
                    waHref={waFor("cancelled")}
                    confirmText={`ऑर्डर #${o.id} रद्द करायची? ग्राहकाला रद्द झाल्याचा मेसेज पाठवता येईल.`}
                    className="h-10 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 hover:bg-red-50"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
