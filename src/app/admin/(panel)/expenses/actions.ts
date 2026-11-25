"use server";

import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";

export type XState = { ok?: string; error?: string };

const Schema = z.object({
  branch: z.string(), // "" / "all" = company-wide (head office only)
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(["transport", "ice_packaging", "staff", "electricity", "rent", "maintenance", "other"]),
  amount: z.coerce.number().gt(0).max(10_000_000),
  mode: z.enum(["cash", "upi", "bank", "other"]),
  note: z.string().trim().max(200).optional(),
});

export async function createExpenseAction(_p: XState, form: FormData): Promise<XState> {
  const s = await requireSession();
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const p = Schema.safeParse({ ...Object.fromEntries(form), branch: isHead ? String(form.get("branch") ?? "") : String(s.branchId ?? "") });
  if (!p.success) return { error: "तारीख, प्रकार आणि रक्कम (० पेक्षा जास्त) तपासा" };
  const d = p.data;
  if (d.day > todayIST()) return { error: "भविष्यातील तारीख चालणार नाही" };
  const branchId = /^\d+$/.test(d.branch) ? Number(d.branch) : null;
  if (branchId === null && !isHead) return { error: "शाखा निवडा" };
  if (branchId !== null && !canAccessBranch(s, branchId)) return { error: "या शाखेला परवानगी नाही" };
  await db().query("INSERT INTO expenses (branch_id, day, category, amount, payment_mode, note, created_by) VALUES (?,?,?,?,?,?,?)", [branchId, d.day, d.category, d.amount, d.mode, d.note || null, s.uid]);
  revalidatePath("/admin", "layout");
  return { ok: "खर्च नोंदवला" };
}

/** Soft delete: the row stays in the database for audit. */
export async function deleteExpenseAction(id: number) {
  const s = await requireSession();
  const [r] = await db().query<RowDataPacket[]>("SELECT branch_id FROM expenses WHERE id=? AND is_deleted=0", [id]);
  const e = r[0];
  if (!e) return;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  if (e.branch_id === null ? !isHead : !canAccessBranch(s, e.branch_id)) return; // a manager can't touch other branches' or company-wide entries
  await db().query("UPDATE expenses SET is_deleted=1 WHERE id=?", [id]);
  revalidatePath("/admin", "layout");
}
