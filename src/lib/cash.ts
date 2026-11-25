import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export type CashPosition = {
  cashSales: number; upiSales: number; otherSales: number;
  cashExpenses: number; cashPaid: number;   // cash paid out: expenses + purchases + supplier payments
  defaultOpening: number;                    // yesterday's counted cash
};

/** All the numbers behind a day's cash: what came in by cash, what went out, and where the drawer started. */
export async function getCashPosition(branchId: number, day: string): Promise<CashPosition> {
  const n = (v: unknown) => Number(v ?? 0);
  const [bills] = await db().query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(CASE WHEN payment_mode='cash' THEN total END),0) AS cash, COALESCE(SUM(CASE WHEN payment_mode='upi' THEN total END),0) AS upi,
            COALESCE(SUM(CASE WHEN payment_mode='other' THEN total END),0) AS other FROM bills WHERE branch_id=? AND bill_day=? AND is_void=0`, [branchId, day]);
  const [exp] = await db().query<RowDataPacket[]>("SELECT COALESCE(SUM(amount),0) AS a FROM expenses WHERE branch_id=? AND day=? AND payment_mode='cash' AND is_deleted=0", [branchId, day]);
  const [pur] = await db().query<RowDataPacket[]>("SELECT COALESCE(SUM(paid),0) AS a FROM purchases WHERE branch_id=? AND day=? AND payment_mode='cash' AND status='received'", [branchId, day]);
  const [sup] = await db().query<RowDataPacket[]>("SELECT COALESCE(SUM(amount),0) AS a FROM supplier_payments WHERE branch_id=? AND day=? AND payment_mode='cash'", [branchId, day]);
  const [prev] = await db().query<RowDataPacket[]>("SELECT counted_cash FROM cash_closings WHERE branch_id=? AND day<? ORDER BY day DESC LIMIT 1", [branchId, day]);
  return {
    cashSales: n(bills[0].cash), upiSales: n(bills[0].upi), otherSales: n(bills[0].other),
    cashExpenses: n(exp[0].a), cashPaid: n(exp[0].a) + n(pur[0].a) + n(sup[0].a),
    defaultOpening: prev[0] ? n(prev[0].counted_cash) : 0,
  };
}
