import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { todayIST } from "@/lib/adminAuth";
import type { StockRow } from "@/app/admin/(panel)/StockEditor";

/** Today's rows for a branch; price defaults to the latest earlier price so admins don't retype it. */
export async function loadStock(branchId: number): Promise<{ day: string; rows: StockRow[]; usesBills: boolean }> {
  const day = todayIST();
  const [r] = await db().query<RowDataPacket[]>(
    `SELECT f.id, f.name_mr, f.name_en,
        t.price_per_kg AS t_price, t.opening_kg, t.added_kg, t.closing_kg, t.sold_out,
        (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=? AND w.fish_id=f.id AND w.day=? AND w.is_deleted=0) AS wastage,
        (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=? AND bi.fish_id=f.id AND bl.bill_day=? AND bl.is_void=0) AS billed,
        (SELECT p.price_per_kg FROM stock_days p WHERE p.branch_id=? AND p.fish_id=f.id AND p.day<? ORDER BY p.day DESC LIMIT 1) AS prev_price
     FROM fish_items f
     LEFT JOIN stock_days t ON t.fish_id=f.id AND t.branch_id=? AND t.day=?
     WHERE f.is_active=1 ORDER BY f.sort_order, f.id`,
    [branchId, day, branchId, day, branchId, day, branchId, day],
  );
  const [bc] = await db().query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM bills WHERE branch_id=? AND bill_day=? AND is_void=0", [branchId, day]);
  return {
    day,
    usesBills: Number(bc[0].n) > 0,
    rows: r.map((x) => ({
      fishId: x.id,
      nameMr: x.name_mr,
      nameEn: x.name_en,
      price: Number(x.t_price ?? x.prev_price ?? 0),
      opening: Number(x.opening_kg ?? 0),
      added: Number(x.added_kg ?? 0),
      closing: x.closing_kg === null || x.closing_kg === undefined ? null : Number(x.closing_kg),
      wastage: Number(x.wastage ?? 0),
      billed: Number(x.billed ?? 0),
      soldOut: !!x.sold_out,
    })),
  };
}
