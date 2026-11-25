import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export type Customer = { phone: string; name: string; orders: number; bills: number; spend: number; lastAt: Date; branches: number };

/**
 * Customer database built from what customers already gave us: website orders and counter bills
 * (when a mobile number was entered). One row per mobile number.
 */
export async function loadCustomers(branchId: number | null, search: string, limit: number, offset: number): Promise<{ rows: Customer[]; total: number }> {
  const bw = branchId ? " AND branch_id=?" : "";
  const ba = branchId ? [branchId] : [];
  const inner = `
    SELECT customer_phone AS phone, customer_name AS name, created_at AS ts, 'order' AS src, branch_id,
           CASE WHEN status='completed' THEN total ELSE 0 END AS spend
    FROM orders WHERE status<>'cancelled' AND customer_phone<>''${bw}
    UNION ALL
    SELECT customer_phone, COALESCE(customer_name,''), created_at, 'bill', branch_id, total
    FROM bills WHERE is_void=0 AND customer_phone IS NOT NULL AND customer_phone<>''${bw}`;
  const like = `%${search.replace(/[%_]/g, "")}%`;
  const having = search ? " HAVING phone LIKE ? OR name LIKE ?" : "";
  const sa = search ? [like, like] : [];
  const grouped = `SELECT phone,
      SUBSTRING_INDEX(GROUP_CONCAT(NULLIF(name,'') ORDER BY ts DESC SEPARATOR '||'), '||', 1) AS name,
      SUM(src='order') AS orders, SUM(src='bill') AS bills, SUM(spend) AS spend, MAX(ts) AS last_ts, COUNT(DISTINCT branch_id) AS branches
    FROM (${inner}) t GROUP BY phone${having}`;
  const args = [...ba, ...ba, ...sa];
  const [rows] = await db().query<RowDataPacket[]>(`${grouped} ORDER BY last_ts DESC LIMIT ? OFFSET ?`, [...args, limit, offset]);
  const [cnt] = await db().query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM (${grouped}) c`, args);
  return {
    total: Number(cnt[0].n),
    rows: rows.map((x) => ({ phone: x.phone, name: x.name ?? "", orders: Number(x.orders), bills: Number(x.bills), spend: Number(x.spend), lastAt: new Date(x.last_ts), branches: Number(x.branches) })),
  };
}
