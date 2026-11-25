"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";
import { getCashPosition } from "@/lib/cash";

export type CState = { ok?: string; error?: string };

const Schema = z.object({ opening: z.coerce.number().min(0).max(100_000_000), counted: z.coerce.number().min(0).max(100_000_000), note: z.string().trim().max(200).optional() });

/** Closes today's cash. The sales / expense figures are re-read from the database here, never taken from the browser. */
export async function closeCashAction(branchId: number, _p: CState, form: FormData): Promise<CState> {
  const s = await requireSession();
  if (!canAccessBranch(s, branchId)) return { error: "या शाखेला परवानगी नाही" };
  const p = Schema.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "सुरुवातीची रोख आणि मोजलेली रोख (० किंवा जास्त) तपासा" };
  const day = todayIST();
  const pos = await getCashPosition(branchId, day);
  const expected = p.data.opening + pos.cashSales - pos.cashPaid;
  await db().query(
    `INSERT INTO cash_closings (branch_id, day, opening_cash, cash_sales, upi_sales, other_sales, cash_expenses, cash_purchases, expected_cash, counted_cash, difference, note, closed_by)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE opening_cash=VALUES(opening_cash), cash_sales=VALUES(cash_sales), upi_sales=VALUES(upi_sales), other_sales=VALUES(other_sales),
       cash_expenses=VALUES(cash_expenses), cash_purchases=VALUES(cash_purchases), expected_cash=VALUES(expected_cash), counted_cash=VALUES(counted_cash),
       difference=VALUES(difference), note=VALUES(note), closed_by=VALUES(closed_by)`,
    [branchId, day, p.data.opening, pos.cashSales, pos.upiSales, pos.otherSales, pos.cashExpenses, pos.cashPaid - pos.cashExpenses, expected, p.data.counted, p.data.counted - expected, p.data.note || null, s.uid],
  );
  revalidatePath("/admin", "layout");
  return { ok: "आजची रोख बंद केली" };
}
