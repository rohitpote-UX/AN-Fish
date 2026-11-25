import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export type SummaryRow = {
  fishId: number; nameMr: string; nameEn: string;
  price: number | null;      // null when several branches have different prices
  opening: number; added: number; total: number;
  wastage: number; billedKg: number; billedAmount: number;
  remaining: number; closing: number | null; soldOut: boolean;
};

/**
 * Per-fish stock position for one day: total stock (opening + new) − wastage − counter sales = remaining.
 * `branchId = null` adds up every branch.
 */
export async function loadStockSummary(branchId: number | null, day: string): Promise<SummaryRow[]> {
  const bw = branchId ? " AND s.branch_id=?" : "";
  const [r] = await db().query<RowDataPacket[]>(
    `SELECT f.id, f.name_mr, f.name_en,
        COUNT(s.fish_id) AS branches, MIN(s.price_per_kg) AS pmin, MAX(s.price_per_kg) AS pmax,
        COALESCE(SUM(s.opening_kg),0) AS opening, COALESCE(SUM(s.added_kg),0) AS added,
        COALESCE(SUM(s.closing_kg),0) AS closing_sum, SUM(s.closing_kg IS NOT NULL) AS closed_n, COALESCE(SUM(s.sold_out),0) AS sold_out_n,
        COALESCE(SUM((SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0)),0) AS wastage,
        COALESCE(SUM((SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0)),0) AS billed_kg,
        COALESCE(SUM((SELECT COALESCE(SUM(bi.amount),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0)),0) AS billed_amt
     FROM fish_items f LEFT JOIN stock_days s ON s.fish_id=f.id AND s.day=?${bw}
     WHERE f.is_active=1 GROUP BY f.id ORDER BY f.sort_order, f.id`,
    branchId ? [day, branchId] : [day],
  );
  return r
    .map((x) => {
      const opening = Number(x.opening), added = Number(x.added), wastage = Number(x.wastage), billed = Number(x.billed_kg);
      const total = opening + added;
      return {
        fishId: x.id as number, nameMr: x.name_mr as string, nameEn: x.name_en as string,
        price: Number(x.branches) > 0 && x.pmin !== null && Number(x.pmin) === Number(x.pmax) ? Number(x.pmin) : null,
        opening, added, total, wastage, billedKg: billed, billedAmount: Number(x.billed_amt),
        remaining: Math.max(0, total - wastage - billed),
        closing: Number(x.closed_n) > 0 && Number(x.closed_n) === Number(x.branches) ? Number(x.closing_sum) : null,
        soldOut: Number(x.branches) > 0 && Number(x.sold_out_n) === Number(x.branches),
      };
    })
    .filter((x) => x.total > 0 || x.billedKg > 0 || x.wastage > 0);
}
