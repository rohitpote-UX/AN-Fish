import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { todayIST } from "@/lib/adminAuth";

export type StockAlert = { fishId: number; nameMr: string; left: number };
export type LowStock = { threshold: number; low: StockAlert[]; out: StockAlert[] };

/** Fish that are about to run out (below the branch's alert level) or already finished today. */
export async function getLowStock(branchId: number): Promise<LowStock> {
  const day = todayIST();
  const [[cfg]] = (await db().query<RowDataPacket[]>("SELECT low_stock_kg FROM branch_settings WHERE branch_id=?", [branchId])) as unknown as [RowDataPacket[]];
  const threshold = cfg ? Number(cfg.low_stock_kg) : 3;
  const [r] = await db().query<RowDataPacket[]>(
    `SELECT f.id, f.name_mr, s.opening_kg, s.added_kg, s.closing_kg, s.sold_out,
        (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0) AS wastage,
        (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0) AS billed
     FROM stock_days s JOIN fish_items f ON f.id=s.fish_id
     WHERE s.branch_id=? AND s.day=? AND s.price_per_kg>0 AND f.is_active=1 AND (s.opening_kg+s.added_kg)>0 ORDER BY f.sort_order, f.id`,
    [branchId, day],
  );
  const low: StockAlert[] = [], out: StockAlert[] = [];
  for (const x of r) {
    const left = x.closing_kg !== null ? Number(x.closing_kg) : Number(x.opening_kg) + Number(x.added_kg) - Number(x.wastage) - Number(x.billed);
    const a = { fishId: x.id as number, nameMr: x.name_mr as string, left: Math.max(0, left) };
    if (x.sold_out || left <= 1e-9) out.push(a);
    else if (left < threshold) low.push(a);
  }
  return { threshold, low, out };
}
