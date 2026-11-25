import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, MessageCircle, Phone, User } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, canAccessBranch, requireSession } from "@/lib/adminAuth";
import { ORDER_LABEL, ORDER_NEXT, orderWaLink, type OrderStatus } from "@/lib/orderStatus";
import { fmtInr } from "@/lib/dateRange";
import { PrintButton } from "../../reports/PrintButton";
import { StatusButton } from "../StatusButton";

const IST = { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false } as const;

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [o] = await db().query<RowDataPacket[]>(
    `SELECT o.*, b.name AS branch_name, b.address AS branch_address, b.whatsapp AS branch_wa, u.name AS handled_name
     FROM orders o JOIN branches b ON b.id=o.branch_id LEFT JOIN users u ON u.id=o.handled_by WHERE o.id=?`, [id]);
  const order = o[0];
  // Same message for "not found" and "not yours" so branch admins can't probe other branches' orders.
  if (!order || !canAccessBranch(s, order.branch_id)) notFound();

  const [items] = await db().query<RowDataPacket[]>("SELECT fish_name, qty_kg, price_per_kg, cut FROM order_items WHERE order_id=? ORDER BY id", [id]);
  const [events] = await db().query<RowDataPacket[]>(
    "SELECT e.status, e.created_at, u.name AS by_name FROM order_events e LEFT JOIN users u ON u.id=e.by_user WHERE e.order_id=? ORDER BY e.id", [id]);

  const st = order.status as OrderStatus;
  const timeline = events.map((e) => ({ status: e.status as OrderStatus, at: new Date(e.created_at), by: e.by_name as string | null }));
  if (timeline.at(-1)?.status !== st) timeline.push({ status: st, at: new Date(order.updated_at), by: order.handled_name });

  const lines = items.map((i) => `${i.fish_name} — ${Number(i.qty_kg)} kg${i.cut ? ` (${i.cut})` : ""}`);
  const wa = (status: OrderStatus) => orderWaLink({ id, phone: order.customer_phone, name: order.customer_name, branch: String(order.branch_name), items: lines, total: Number(order.total) }, status);
  const next = ORDER_NEXT[st];
  const list = await adminHref("/orders");
  const subtotal = items.reduce((a, i) => a + Number(i.qty_kg) * Number(i.price_per_kg), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <style>{`@page { size: A4; margin: 14mm; } @media print { body { background: #fff !important; } }`}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={list} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0EA5A0]"><ArrowLeft className="size-4" /> सर्व ऑर्डर्स</Link>
        <PrintButton />
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#172B3A]/8 print:shadow-none print:ring-0">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#172B3A]/10 pb-4">
          <div>
            <p className="text-sm font-extrabold text-[#0EA5A0]">AN FISH WORLD</p>
            <h1 className="text-2xl font-extrabold">ऑर्डर #{id}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#7A8794]"><Clock className="size-4" />{new Date(order.created_at).toLocaleString("en-IN", IST)}</p>
          </div>
          <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${ORDER_LABEL[st].cls}`}>{ORDER_LABEL[st].t}</span>
        </div>

        <div className="grid gap-4 py-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[#7A8794]">ग्राहक</p>
            <p className="flex items-center gap-2 font-bold"><User className="size-4 text-[#7A8794]" />{order.customer_name}</p>
            <p className="flex items-center gap-2 font-semibold"><Phone className="size-4 text-[#7A8794]" />{order.customer_phone}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[#7A8794]">शाखा (पिकअप)</p>
            <p className="font-bold">{order.branch_name}</p>
            {order.branch_address && <p className="flex items-start gap-2 text-sm text-[#172B3A]/75"><MapPin className="mt-0.5 size-4 shrink-0 text-[#7A8794]" />{order.branch_address}</p>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-3 py-2.5">माल</th><th>कटिंग</th><th className="text-right">प्रमाण</th><th className="text-right">भाव / kg</th><th className="px-3 text-right">रक्कम</th></tr></thead>
            <tbody>
              {items.map((i, k) => (
                <tr key={k} className="border-t border-[#172B3A]/8">
                  <td className="px-3 py-3 font-bold">{i.fish_name}</td>
                  <td>{i.cut ?? "—"}</td>
                  <td className="text-right tabular-nums">{Number(i.qty_kg)} kg</td>
                  <td className="text-right tabular-nums">{fmtInr(Number(i.price_per_kg))}</td>
                  <td className="px-3 text-right font-bold tabular-nums">{fmtInr(Number(i.qty_kg) * Number(i.price_per_kg))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#071D2B]/15 bg-[#E8F4F3] font-extrabold"><td colSpan={4} className="px-3 py-3 text-right">अंदाजे एकूण</td><td className="px-3 text-right tabular-nums">{fmtInr(Number(order.total) || subtotal)}</td></tr>
            </tfoot>
          </table>
        </div>
        {order.note && <p className="mt-4 rounded-xl bg-[#F5F7FA] p-3 text-sm"><b>टीप:</b> {order.note}</p>}
        <p className="mt-4 text-sm text-[#7A8794]">पेमेंट: दालनात · ऑर्डर दालनातून पिकअप करायची आहे. रक्कम अंदाजे असून प्रत्यक्ष वजनानुसार बदलू शकते.</p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#172B3A]/8 print:hidden">
        <h2 className="text-base font-extrabold">स्थितीचा इतिहास</h2>
        <ol className="mt-4 space-y-4 border-l-2 border-[#172B3A]/10 pl-5">
          {timeline.map((e, k) => (
            <li key={k} className="relative">
              <span className="absolute -left-[27px] top-1 size-3 rounded-full bg-[#0EA5A0] ring-4 ring-white" />
              <p className="font-bold"><span className={`rounded-full px-2.5 py-0.5 text-xs ${ORDER_LABEL[e.status].cls}`}>{ORDER_LABEL[e.status].t}</span></p>
              <p className="mt-0.5 text-xs text-[#7A8794]">{e.at.toLocaleString("en-IN", IST)}{e.by ? ` · ${e.by}` : ""}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <a href={`tel:+91${order.customer_phone}`} className="flex h-11 items-center gap-2 rounded-xl border border-[#172B3A]/15 bg-white px-4 text-sm font-bold"><Phone className="size-4" />कॉल</a>
        <a href={wa(st)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-[#052E16]"><MessageCircle className="size-4" />WhatsApp</a>
        {next && (
          <StatusButton orderId={id} to={next.to} label={next.to === "confirmed" ? "✅ कन्फर्म करा + मेसेज" : next.to === "ready" ? "🏪 तयार + मेसेज" : next.t} waHref={next.to === "completed" ? undefined : wa(next.to)} className="h-11 rounded-xl bg-[#0D9488] px-5 text-sm font-bold text-white hover:bg-[#071C2C]" />
        )}
        {st !== "cancelled" && st !== "completed" && (
          <StatusButton orderId={id} to="cancelled" label="रद्द" waHref={wa("cancelled")} confirmText={`ऑर्डर #${id} रद्द करायची?`} className="h-11 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 hover:bg-red-50" />
        )}
      </div>
    </div>
  );
}
