"use server";

import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession } from "@/lib/adminAuth";

const STATUSES = ["new", "confirmed", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof STATUSES)[number];

export async function setOrderStatusAction(orderId: number, status: OrderStatus) {
  const s = await requireSession();
  if (!STATUSES.includes(status)) return;
  const [r] = await db().query<RowDataPacket[]>("SELECT branch_id FROM orders WHERE id=?", [orderId]);
  if (!r[0] || !canAccessBranch(s, r[0].branch_id)) return; // branch admins can't touch other branches
  const [cur] = await db().query<RowDataPacket[]>("SELECT status FROM orders WHERE id=?", [orderId]);
  if (cur[0]?.status === status) return; // no duplicate history entry
  await db().query("UPDATE orders SET status=?, handled_by=? WHERE id=?", [status, s.uid, orderId]);
  await db().query("INSERT INTO order_events (order_id, status, by_user) VALUES (?,?,?)", [orderId, status, s.uid]);
  revalidatePath("/admin", "layout");
}
