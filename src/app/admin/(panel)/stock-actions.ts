"use server";

import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
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

  const rows = [];
  for (const id of form.getAll("fishId").map(String)) {
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
    const [prevRows] = await conn.query<RowDataPacket[]>(
      "SELECT fish_id, price_per_kg, opening_kg, added_kg, closing_kg FROM stock_days WHERE branch_id=? AND day=? FOR UPDATE",
      [branchId, day],
    );
    const prev = new Map(prevRows.map((r) => [r.fish_id as number, r]));
    const [wRows] = await conn.query<RowDataPacket[]>(
      "SELECT fish_id, SUM(qty_kg) AS q FROM wastage WHERE branch_id=? AND day=? AND is_deleted=0 GROUP BY fish_id",
      [branchId, day],
    );
    const waste = new Map(wRows.map((r) => [r.fish_id as number, Number(r.q)]));
    const [names] = await conn.query<RowDataPacket[]>("SELECT id, name_mr FROM fish_items");
    const nameOf = new Map(names.map((n) => [n.id as number, n.name_mr as string]));

    // Never allow negative stock: closing can't exceed opening + arrivals − wastage.
    for (const r of rows) {
      if (r.closing !== "" && r.closing > r.opening + r.added - (waste.get(r.fishId) ?? 0) + 1e-9) {
        await conn.rollback();
        return { error: `${nameOf.get(r.fishId)}: क्लोजिंग स्टॉक (${r.closing} kg) सुरुवात + आवक − वाया गेलेला माल (${(r.opening + r.added - (waste.get(r.fishId) ?? 0)).toFixed(2)} kg) पेक्षा जास्त असू शकत नाही` };
      }
    }

    const log = async (fishId: number, kind: string, from: number | null, to: number | null) => {
      if ((from ?? null) === (to ?? null)) return;
      await conn.query(
        "INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, created_by) VALUES (?,?,?,?,?,?,?)",
        [branchId, fishId, day, kind, from, to, s.uid],
      );
    };

    for (const r of rows) {
      const p = prev.get(r.fishId);
      const closing = r.closing === "" ? null : r.closing;
      await log(r.fishId, "price", p ? Number(p.price_per_kg) : 0, r.price);
      await log(r.fishId, "opening", p ? Number(p.opening_kg) : 0, r.opening);
      await log(r.fishId, "arrival", p ? Number(p.added_kg) : 0, r.added);
      await log(r.fishId, "closing", p && p.closing_kg !== null ? Number(p.closing_kg) : null, closing);
      await conn.query(
        `INSERT INTO stock_days (branch_id, fish_id, day, price_per_kg, opening_kg, added_kg, closing_kg, sold_out, updated_by)
         VALUES (?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE price_per_kg=VALUES(price_per_kg), opening_kg=VALUES(opening_kg),
           added_kg=VALUES(added_kg), closing_kg=VALUES(closing_kg), sold_out=VALUES(sold_out), updated_by=VALUES(updated_by)`,
        [branchId, r.fishId, day, r.price, r.opening, r.added, closing, r.soldOut ? 1 : 0, s.uid],
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
  return { ok: true, at: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }) };
}
