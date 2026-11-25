import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSuper, todayIST } from "@/lib/adminAuth";
import { monthIST, monthsSince } from "@/lib/billing";
import { BillingPanel, type Payment } from "./BillingPanel";
import { CounterPanel } from "./CounterPanel";
import { EditBranchPanel } from "./EditBranchPanel";
import { loadStock } from "@/lib/stock";
import { StockEditor } from "../../StockEditor";
import { BranchControls } from "./ResetPassword";

export default async function BranchDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSuper();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT b.*, (SELECT login_id FROM users WHERE branch_id=b.id AND role='branch_admin' LIMIT 1) AS login_id FROM branches b WHERE b.id=?",
    [id],
  );
  const b = rows[0];
  if (!b) notFound();
  const [cr] = await db().query<RowDataPacket[]>("SELECT id, login_id, is_active FROM users WHERE branch_id=? AND role='counter' ORDER BY id", [id]);
  const { day, rows: stock, usesBills } = await loadStock(id);

  let billing: React.ReactNode = null;
  if (session.role === "abnexa") {
    const [pr] = await db().query<RowDataPacket[]>(
      "SELECT id, month, amount, DATE_FORMAT(paid_on,'%Y-%m-%d') AS paid_on, method, note FROM branch_payments WHERE branch_id=? ORDER BY month DESC",
      [id],
    );
    const payments: Payment[] = pr.map((x) => ({ id: x.id, month: x.month, amount: Number(x.amount), paidOn: x.paid_on, method: x.method, note: x.note }));
    const fee = Number(b.monthly_fee);
    const paid = new Set(payments.map((p) => p.month));
    const unpaid = fee > 0 ? monthsSince(new Date(b.created_at)).filter((m) => !paid.has(m)) : [];
    billing = <BillingPanel branchId={id} fee={fee} payments={payments} unpaidMonths={unpaid} currentMonth={monthIST()} today={todayIST()} />;
  }

  return (
    <div className="space-y-6">
      <Link href={await adminHref("/")} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D9488]">
        <ArrowLeft className="size-4" /> सर्व शाखा
      </Link>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">{b.name}</h1>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-[#071C2C]/65"><MapPin className="mt-0.5 size-4 shrink-0" />{b.address || "—"}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#071C2C]/65"><MessageCircle className="size-4" />WhatsApp: +{b.whatsapp}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${b.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {b.is_active ? "सुरू" : "बंद"}
          </span>
        </div>
        <p className="mt-4 text-sm">लॉगिन आयडी: <b>{b.login_id}</b></p>
        <EditBranchPanel branchId={id} b={{ name: String(b.name), address: b.address ?? "", whatsapp: String(b.whatsapp ?? ""), openTime: b.open_time ?? "", lat: b.lat === null ? "" : String(b.lat), lng: b.lng === null ? "" : String(b.lng) }} />
        <div className="mt-4 border-t border-[#071C2C]/8 pt-4"><BranchControls branchId={id} active={!!b.is_active} canToggle={session.role === "abnexa"} /></div>
      </div>
      {billing}
      <CounterPanel branchId={id} counters={cr.map((c) => ({ id: c.id, login: c.login_id, active: !!c.is_active }))} />
      <StockEditor branchId={id} rows={stock} day={day} usesBills={usesBills} />
    </div>
  );
}
