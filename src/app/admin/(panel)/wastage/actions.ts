"use server";

import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";
import { REASONS } from "./reasons";

export type WState = { ok?: string; error?: string };


const Create = z.object({
  branchId: z.coerce.number().int().positive(),
  fishId: z.coerce.number().int().positive(),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  qty: z.coerce.number().gt(0).max(100000),
  reason: z.enum(["spoilage", "cleaning_loss", "damaged", "quality_rejection", "other"]),
  cost: z.coerce.number().min(0).max(100000).default(0),
  note: z.string().trim().max(300).optional(),
});

export async function createWastageAction(_p: WState, form: FormData): Promise<WState> {
  const s = await requireSession();
  const p = Create.safeParse({ ...Object.fromEntries(form), branchId: s.role === "branch_admin" ? s.branchId : form.get("branchId"), cost: form.get("cost") || 0 });
  if (!p.success) return { error: "शाखा, मासा, प्रमाण (kg) आणि कारण तपासा" };
  const d = p.data;
  if (!canAccessBranch(s, d.branchId)) return { error: "या शाखेला परवानगी नाही" };
  if (d.day > todayIST()) return { error: "भविष्यातील तारीख चालणार नाही" };

  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [st] = await conn.query<RowDataPacket[]>(
      "SELECT opening_kg, added_kg, closing_kg FROM stock_days WHERE branch_id=? AND fish_id=? AND day=? FOR UPDATE",
      [d.branchId, d.fishId, d.day],
    );
    if (!st[0]) { await conn.rollback(); return { error: "त्या दिवशी या माशाचा स्टॉक भरलेला नाही. आधी स्टॉक स्क्रीनवर सुरुवातीचा स्टॉक भरा." }; }
    const [w] = await conn.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(qty_kg),0) AS q FROM wastage WHERE branch_id=? AND fish_id=? AND day=? AND is_deleted=0",
      [d.branchId, d.fishId, d.day],
    );
    const before = Number(w[0].q);
    const after = before + d.qty;
    const available = Number(st[0].opening_kg) + Number(st[0].added_kg);
    // No negative stock: wastage can't exceed what the branch had, nor go below an already entered closing stock.
    if (after > available + 1e-9) { await conn.rollback(); return { error: `वाया गेलेला माल (${after.toFixed(2)} kg) उपलब्ध साठ्यापेक्षा (${available.toFixed(2)} kg) जास्त असू शकत नाही` }; }
    if (st[0].closing_kg !== null && available - after < Number(st[0].closing_kg) - 1e-9) {
      await conn.rollback();
      return { error: "क्लोजिंग स्टॉक आधीच भरला आहे. आधी स्टॉक स्क्रीनवर क्लोजिंग कमी करा." };
    }
    await conn.query(
      "INSERT INTO wastage (branch_id, fish_id, day, qty_kg, reason, cost_per_kg, note, created_by) VALUES (?,?,?,?,?,?,?,?)",
      [d.branchId, d.fishId, d.day, d.qty, d.reason, d.cost, d.note || null, s.uid],
    );
    await conn.query(
      "INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, reason, created_by) VALUES (?,?,?,'wastage',?,?,?,?)",
      [d.branchId, d.fishId, d.day, before, after, REASONS[d.reason], s.uid],
    );
    await conn.commit();
  } catch {
    await conn.rollback();
    return { error: "सेव्ह होऊ शकले नाही" };
  } finally {
    conn.release();
  }
  revalidatePath("/admin", "layout");
  return { ok: "वाया गेलेला माल नोंदवला" };
}

/** Soft delete: the record stays for audit, stock is restored. */
export async function deleteWastageAction(id: number) {
  const s = await requireSession();
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query<RowDataPacket[]>("SELECT * FROM wastage WHERE id=? AND is_deleted=0 FOR UPDATE", [id]);
    const w = r[0];
    if (!w || !canAccessBranch(s, w.branch_id)) { await conn.rollback(); return; }
    const [sum] = await conn.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(qty_kg),0) AS q FROM wastage WHERE branch_id=? AND fish_id=? AND day=? AND is_deleted=0",
      [w.branch_id, w.fish_id, w.day],
    );
    const before = Number(sum[0].q);
    await conn.query("UPDATE wastage SET is_deleted=1 WHERE id=?", [id]);
    await conn.query(
      "INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, reason, created_by) VALUES (?,?,?,'wastage_removed',?,?,?,?)",
      [w.branch_id, w.fish_id, w.day, before, before - Number(w.qty_kg), `नोंद #${id} रद्द`, s.uid],
    );
    await conn.commit();
  } catch {
    await conn.rollback();
  } finally {
    conn.release();
  }
  revalidatePath("/admin", "layout");
}
