"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";

const Row = z.object({
  fishId: z.coerce.number().int().positive(),
  price: z.coerce.number().min(0).max(100000),
  opening: z.coerce.number().min(0).max(100000),
  added: z.coerce.number().min(0).max(100000),
  closing: z.union([z.literal(""), z.coerce.number().min(0).max(100000)]),
  soldOut: z.boolean(),
});

export type SaveState = { ok?: boolean; error?: string; at?: string };

export async function saveStockAction(branchId: number, _p: SaveState, form: FormData): Promise<SaveState> {
  const s = await requireSession();
  if (!canAccessBranch(s, branchId)) return { error: "या शाखेला परवानगी नाही" };

  const ids = form.getAll("fishId").map(String);
  const rows = [];
  for (const id of ids) {
    const parsed = Row.safeParse({
      fishId: id,
      price: form.get(`price_${id}`) || 0,
      opening: form.get(`opening_${id}`) || 0,
      added: form.get(`added_${id}`) || 0,
      closing: String(form.get(`closing_${id}`) ?? ""),
      soldOut: form.get(`soldOut_${id}`) === "on",
    });
    if (!parsed.success) return { error: "कृपया योग्य आकडे टाका (० किंवा जास्त)" };
    rows.push(parsed.data);
  }

  const day = todayIST();
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    for (const r of rows) {
      await conn.query(
        `INSERT INTO stock_days (branch_id, fish_id, day, price_per_kg, opening_kg, added_kg, closing_kg, sold_out, updated_by)
         VALUES (?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE price_per_kg=VALUES(price_per_kg), opening_kg=VALUES(opening_kg),
           added_kg=VALUES(added_kg), closing_kg=VALUES(closing_kg), sold_out=VALUES(sold_out), updated_by=VALUES(updated_by)`,
        [branchId, r.fishId, day, r.price, r.opening, r.added, r.closing === "" ? null : r.closing, r.soldOut ? 1 : 0, s.uid],
      );
    }
    await conn.commit();
  } catch {
    await conn.rollback();
    return { error: "सेव्ह होऊ शकले नाही, पुन्हा प्रयत्न करा" };
  } finally {
    conn.release();
  }
  revalidatePath("/admin", "layout");
  return { ok: true, at: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }) };
}
