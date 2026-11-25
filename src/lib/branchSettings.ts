import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export type BranchSettings = { paperMm: 58 | 80; autoPrint: boolean; headerExtra: string; footerText: string; lowStockKg: number };

export const DEFAULT_SETTINGS: BranchSettings = { paperMm: 80, autoPrint: false, headerExtra: "", footerText: "धन्यवाद! पुन्हा भेट द्या.", lowStockKg: 3 };

/** Billing / printer settings of one branch (defaults until the owner saves something). */
export async function getBranchSettings(branchId: number): Promise<BranchSettings> {
  const [r] = await db().query<RowDataPacket[]>("SELECT paper_mm, auto_print, header_extra, footer_text, low_stock_kg FROM branch_settings WHERE branch_id=?", [branchId]);
  const x = r[0];
  if (!x) return DEFAULT_SETTINGS;
  return { paperMm: Number(x.paper_mm) === 58 ? 58 : 80, autoPrint: !!x.auto_print, headerExtra: x.header_extra ?? "", footerText: x.footer_text ?? DEFAULT_SETTINGS.footerText, lowStockKg: Number(x.low_stock_kg ?? 3) };
}
