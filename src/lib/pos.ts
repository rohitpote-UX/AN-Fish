import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { todayIST } from "@/lib/adminAuth";
import { SPECIES_LIST } from "@/data/species";

export type PosFish = {
  id: number; slug: string; nameMr: string; nameEn: string; image: string | null; category: string | null;
  price: number; left: number;
};

export type BillItem = { name: string; qty: number; rate: number; amount: number; cut: string | null };
export type BillData = {
  id: number; branchId: number; billNo: number; day: string; time: string;
  branchName: string; branchAddress: string | null; branchPhone: string | null;
  items: BillItem[]; subtotal: number; discount: number; total: number;
  mode: "cash" | "upi" | "other"; customerName: string | null; customerPhone: string | null;
  isVoid: boolean; voidReason: string | null;
};

const shortBranch = (n: string) => n.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");

/** Fish the branch has priced today, with live remaining kg (after wastage and counter bills). */
export async function loadPosFish(branchId: number): Promise<PosFish[]> {
  const day = todayIST();
  const [r] = await db().query<RowDataPacket[]>(
    `SELECT f.id, f.slug, f.name_mr, f.name_en, f.category, s.price_per_kg, s.opening_kg, s.added_kg, s.closing_kg, s.sold_out,
        (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0) AS wastage,
        (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id
           WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0) AS billed
     FROM stock_days s JOIN fish_items f ON f.id=s.fish_id
     WHERE s.branch_id=? AND s.day=? AND s.price_per_kg>0 AND f.is_active=1 ORDER BY f.sort_order, f.id`,
    [branchId, day],
  );
  return r.map((x) => ({
    id: x.id, slug: x.slug, nameMr: x.name_mr, nameEn: x.name_en, category: x.category,
    image: SPECIES_LIST.find((sp) => sp.slug === x.slug)?.image ?? null,
    price: Number(x.price_per_kg),
    // After the day is closed (closing entered) nothing more can be sold.
    left: x.sold_out || x.closing_kg !== null ? 0 : Math.max(0, Number(x.opening_kg) + Number(x.added_kg) - Number(x.wastage) - Number(x.billed)),
  }));
}

/** Bills of one branch for a day (newest first), with their items. */
export async function loadBills(branchId: number | null, day: string): Promise<BillData[]> {
  const [bills] = await db().query<RowDataPacket[]>(
    `SELECT bl.*, b.name AS branch_name, b.address AS branch_address, b.whatsapp AS branch_phone
     FROM bills bl JOIN branches b ON b.id=bl.branch_id WHERE bl.bill_day=?${branchId ? " AND bl.branch_id=?" : ""} ORDER BY bl.id DESC LIMIT 500`,
    branchId ? [day, branchId] : [day],
  );
  if (!bills.length) return [];
  const [items] = await db().query<RowDataPacket[]>(
    `SELECT bill_id, fish_name, qty_kg, price_per_kg, amount, cut FROM bill_items WHERE bill_id IN (?) ORDER BY id`,
    [bills.map((b) => b.id)],
  );
  return bills.map((b) => ({
    id: Number(b.id), branchId: Number(b.branch_id), billNo: b.bill_no, day: String(b.bill_day instanceof Date ? b.bill_day.toISOString().slice(0, 10) : b.bill_day).slice(0, 10),
    time: new Date(b.created_at).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }),
    branchName: shortBranch(String(b.branch_name)), branchAddress: b.branch_address, branchPhone: b.branch_phone,
    items: items.filter((i) => Number(i.bill_id) === Number(b.id)).map((i) => ({ name: i.fish_name, qty: Number(i.qty_kg), rate: Number(i.price_per_kg), amount: Number(i.amount), cut: i.cut })),
    subtotal: Number(b.subtotal), discount: Number(b.discount), total: Number(b.total), mode: b.payment_mode,
    customerName: b.customer_name, customerPhone: b.customer_phone, isVoid: !!b.is_void, voidReason: b.void_reason,
  }));
}
