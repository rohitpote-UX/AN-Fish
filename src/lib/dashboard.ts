import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { todayIST } from "@/lib/adminAuth";
import { eachDay, prevRange, type Range } from "@/lib/dateRange";
import { SALES, SALES_JOINS, SOLD } from "@/lib/salesSql";
import { getLowStock } from "@/lib/lowStock";

const BASE = `FROM stock_days sd JOIN fish_items f ON f.id=sd.fish_id JOIN branches b ON b.id=sd.branch_id
  LEFT JOIN (SELECT branch_id, fish_id, day, SUM(qty_kg) AS q FROM wastage WHERE is_deleted=0 GROUP BY branch_id, fish_id, day) w
  ON w.branch_id=sd.branch_id AND w.fish_id=sd.fish_id AND w.day=sd.day${SALES_JOINS}`;
const OD = "DATE(CONVERT_TZ(o.created_at, @@session.time_zone, '+05:30'))";
const n = (v: unknown) => Number(v ?? 0);
const short = (s: string) => s.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
const dayStr = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

export type Kpis = { sales: number; soldKg: number; addedKg: number; wastageKg: number; orders: number; pending: number; completed: number; cancelled: number };

async function kpis(r: Range, branchId: number | null): Promise<Kpis> {
  const bw = branchId ? " AND sd.branch_id=?" : "";
  const [s] = await db().query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(${SALES}),0) AS sales, COALESCE(SUM(${SOLD}),0) AS sold, COALESCE(SUM(sd.added_kg),0) AS added, COALESCE(SUM(w.q),0) AS wastage
     ${BASE} WHERE sd.day BETWEEN ? AND ?${bw}`, [r.from, r.to, ...(branchId ? [branchId] : [])]);
  const [o] = await db().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total, COALESCE(SUM(o.status IN ('new','confirmed','ready')),0) AS pending, COALESCE(SUM(o.status='completed'),0) AS done, COALESCE(SUM(o.status='cancelled'),0) AS cancelled
     FROM orders o WHERE ${OD} BETWEEN ? AND ?${branchId ? " AND o.branch_id=?" : ""}`, [r.from, r.to, ...(branchId ? [branchId] : [])]);
  return { sales: n(s[0].sales), soldKg: n(s[0].sold), addedKg: n(s[0].added), wastageKg: n(s[0].wastage), orders: n(o[0].total), pending: n(o[0].pending), completed: n(o[0].done), cancelled: n(o[0].cancelled) };
}

export async function getDashboard(range: Range, branchId: number | null) {
  const bw = branchId ? " AND sd.branch_id=?" : "";
  const ba = branchId ? [branchId] : [];
  const today = todayIST();
  const [cur, prev] = await Promise.all([kpis(range, branchId), kpis(prevRange(range), branchId)]);

  const [trendRows] = await db().query<RowDataPacket[]>(
    `SELECT sd.day, SUM(${SALES}) AS sales, SUM(${SOLD}) AS sold ${BASE} WHERE sd.day BETWEEN ? AND ?${bw} GROUP BY sd.day`, [range.from, range.to, ...ba]);
  const tm = new Map(trendRows.map((x) => [dayStr(x.day), n(x.sales)]));
  const trend = eachDay(range).map((d) => ({ day: d, value: tm.get(d) ?? 0 }));

  const [byBranchRows] = branchId ? [[] as RowDataPacket[]] : await db().query<RowDataPacket[]>(
    `SELECT b.name, SUM(${SALES}) AS sales ${BASE} WHERE sd.day BETWEEN ? AND ? GROUP BY b.id ORDER BY sales DESC`, [range.from, range.to]);
  const [topFishRows] = await db().query<RowDataPacket[]>(
    `SELECT f.name_mr AS fish, SUM(${SOLD}) AS sold ${BASE} WHERE sd.day BETWEEN ? AND ?${bw} GROUP BY f.id HAVING sold>0 ORDER BY sold DESC LIMIT 6`, [range.from, range.to, ...ba]);
  const [statusRows] = await db().query<RowDataPacket[]>(
    `SELECT o.status, COUNT(*) AS c FROM orders o WHERE ${OD} BETWEEN ? AND ?${branchId ? " AND o.branch_id=?" : ""} GROUP BY o.status`, [range.from, range.to, ...ba]);
  const [payRows] = await db().query<RowDataPacket[]>(
    `SELECT payment_mode AS m, COALESCE(SUM(total),0) AS amt, COUNT(*) AS c FROM bills WHERE is_void=0 AND bill_day BETWEEN ? AND ?${branchId ? " AND branch_id=?" : ""} GROUP BY payment_mode`,
    [range.from, range.to, ...ba]);
  const payments = { cash: 0, upi: 0, other: 0 } as Record<string, number>;
  for (const x of payRows) payments[x.m as string] = n(x.amt);
  const [recent] = await db().query<RowDataPacket[]>(
    `SELECT o.id, o.customer_name, o.total, o.status, o.created_at, b.name AS branch FROM orders o JOIN branches b ON b.id=o.branch_id
     ${branchId ? "WHERE o.branch_id=?" : ""} ORDER BY o.id DESC LIMIT 6`, ba);

  // Live "today" snapshot
  const [avail] = await db().query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(CASE WHEN sd.sold_out=0 THEN GREATEST(COALESCE(sd.closing_kg, sd.opening_kg+sd.added_kg-COALESCE(w.q,0)-(SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=sd.branch_id AND bi.fish_id=sd.fish_id AND bl.bill_day=sd.day AND bl.is_void=0)),0) ELSE 0 END),0) AS kg
     ${BASE} WHERE sd.day=?${bw}`, [today, ...ba]);
  let branchesToday: { id: number; name: string; entered: number; available: number; ordersToday: number; newOrders: number; lowCount: number }[] = [];
  if (!branchId) {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT b.id, b.name,
         (SELECT COUNT(*) FROM stock_days s WHERE s.branch_id=b.id AND s.day=? AND (s.opening_kg>0 OR s.added_kg>0)) AS entered,
         (SELECT COUNT(*) FROM stock_days s WHERE s.branch_id=b.id AND s.day=? AND s.sold_out=0 AND COALESCE(s.closing_kg, s.opening_kg+s.added_kg)>0) AS available,
         (SELECT COUNT(*) FROM orders o WHERE o.branch_id=b.id AND ${OD}=?) AS orders_today,
         (SELECT COUNT(*) FROM orders o WHERE o.branch_id=b.id AND o.status='new') AS new_orders
       FROM branches b WHERE b.is_active=1 ORDER BY b.id`, [today, today, today]);
    const lows = await Promise.all(rows.map((x) => getLowStock(x.id)));
    branchesToday = rows.map((x, i) => ({ id: x.id, name: short(String(x.name)), entered: n(x.entered), available: n(x.available), ordersToday: n(x.orders_today), newOrders: n(x.new_orders), lowCount: lows[i].low.length + lows[i].out.length }));
  }
  return {
    range, cur, prev, trend, payments: payments as { cash: number; upi: number; other: number },
    byBranch: byBranchRows.map((x) => ({ label: short(String(x.name)), value: n(x.sales) })),
    topFish: topFishRows.map((x) => ({ label: String(x.fish), value: n(x.sold) })),
    statuses: Object.fromEntries(statusRows.map((x) => [x.status as string, n(x.c)])) as Record<string, number>,
    recent: recent.map((x) => ({ id: n(x.id), customer: String(x.customer_name), total: n(x.total), status: String(x.status), at: new Date(x.created_at), branch: short(String(x.branch)) })),
    availableKgToday: n(avail[0].kg),
    branchesToday,
  };
}
