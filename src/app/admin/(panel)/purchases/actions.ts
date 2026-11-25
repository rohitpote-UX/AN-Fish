"use server";

import { revalidatePath } from "next/cache";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";

export type PurchaseResult = { ok: true; id: number } | { ok: false; error: string };

const Payload = z.object({
  branchId: z.number().int().positive().optional(),
  supplierId: z.number().int().positive().nullable().optional(),
  source: z.string().trim().max(120).optional(),
  lines: z.array(z.object({ fishId: z.number().int().positive(), qty: z.number().gt(0).max(100000), rate: z.number().gt(0).max(100000) })).min(1).max(40),
  transport: z.number().min(0).max(1_000_000).default(0),
  other: z.number().min(0).max(1_000_000).default(0),
  mode: z.enum(["cash", "upi", "bank", "credit"]),
  paid: z.number().min(0).max(100_000_000),
  note: z.string().trim().max(200).optional(),
});

/**
 * A purchase is entered when the fish arrives: it is saved AND added to today's stock of that branch
 * (new arrivals), and every change is written to the stock ledger.
 */
export async function createPurchaseAction(input: z.input<typeof Payload>): Promise<PurchaseResult> {
  const s = await requireSession();
  const p = Payload.safeParse(input);
  if (!p.success) return { ok: false, error: "माशाचे प्रमाण (kg) आणि खरेदी भाव तपासा" };
  const d = p.data;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const branchId = isHead ? d.branchId ?? 0 : s.branchId ?? 0;
  if (!branchId || !canAccessBranch(s, branchId)) return { ok: false, error: "शाखा निवडा" };

  const day = todayIST();
  const itemsTotal = d.lines.reduce((a, l) => a + Math.round(l.qty * l.rate * 100) / 100, 0);
  const total = itemsTotal + d.transport + d.other;
  if (d.paid > total + 0.001) return { ok: false, error: "दिलेली रक्कम एकूण रकमेपेक्षा जास्त असू शकत नाही" };

  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [ins] = await conn.query<ResultSetHeader>(
      `INSERT INTO purchases (branch_id, supplier_id, day, source, items_total, transport, other_charges, total, payment_mode, paid, note, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [branchId, d.supplierId ?? null, day, d.source || null, itemsTotal, d.transport, d.other, total, d.mode, d.paid, d.note || null, s.uid]);
    const perFish = new Map<number, number>();
    for (const l of d.lines) {
      await conn.query("INSERT INTO purchase_items (purchase_id, fish_id, qty_kg, rate_per_kg, amount) VALUES (?,?,?,?,?)", [ins.insertId, l.fishId, l.qty, l.rate, Math.round(l.qty * l.rate * 100) / 100]);
      perFish.set(l.fishId, (perFish.get(l.fishId) ?? 0) + l.qty);
    }
    for (const [fishId, qty] of perFish) {
      const [st] = await conn.query<RowDataPacket[]>("SELECT added_kg, closing_kg FROM stock_days WHERE branch_id=? AND fish_id=? AND day=? FOR UPDATE", [branchId, fishId, day]);
      if (st[0]?.closing_kg !== undefined && st[0]?.closing_kg !== null) { await conn.rollback(); return { ok: false, error: "या माशाचे आजचे क्लोजिंग आधीच भरले आहे. आवक आता जोडता येणार नाही." }; }
      const before = st[0] ? Number(st[0].added_kg) : 0;
      if (st[0]) await conn.query("UPDATE stock_days SET added_kg=added_kg+?, updated_by=? WHERE branch_id=? AND fish_id=? AND day=?", [qty, s.uid, branchId, fishId, day]);
      else {
        const [pp] = await conn.query<RowDataPacket[]>("SELECT price_per_kg FROM stock_days WHERE branch_id=? AND fish_id=? AND day<? ORDER BY day DESC LIMIT 1", [branchId, fishId, day]);
        await conn.query("INSERT INTO stock_days (branch_id, fish_id, day, price_per_kg, added_kg, updated_by) VALUES (?,?,?,?,?,?)", [branchId, fishId, day, pp[0] ? Number(pp[0].price_per_kg) : 0, qty, s.uid]);
      }
      await conn.query("INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, reason, created_by) VALUES (?,?,?,'arrival',?,?,?,?)", [branchId, fishId, day, before, before + qty, `खरेदी #${ins.insertId}`, s.uid]);
    }
    await conn.commit();
    revalidatePath("/admin", "layout");
    return { ok: true, id: ins.insertId };
  } catch {
    await conn.rollback();
    return { ok: false, error: "खरेदी सेव्ह होऊ शकली नाही" };
  } finally {
    conn.release();
  }
}

/** Cancel a purchase made today. The kg are taken back out of stock, but never below what is already sold or wasted. */
export async function cancelPurchaseAction(id: number): Promise<{ ok: boolean; error?: string }> {
  const s = await requireSession();
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [pr] = await conn.query<RowDataPacket[]>("SELECT * FROM purchases WHERE id=? FOR UPDATE", [id]);
    const pu = pr[0];
    if (!pu || !canAccessBranch(s, pu.branch_id)) { await conn.rollback(); return { ok: false, error: "खरेदी सापडली नाही" }; }
    if (pu.status !== "received") { await conn.rollback(); return { ok: false, error: "ही खरेदी आधीच रद्द आहे" }; }
    const day = todayIST();
    if (String(pu.day).slice(0, 10) !== day) { await conn.rollback(); return { ok: false, error: "फक्त आजची खरेदी रद्द करता येते" }; }
    const [items] = await conn.query<RowDataPacket[]>("SELECT fish_id, SUM(qty_kg) AS q FROM purchase_items WHERE purchase_id=? GROUP BY fish_id", [id]);
    for (const it of items) {
      const [st] = await conn.query<RowDataPacket[]>(
        `SELECT s.opening_kg, s.added_kg, s.closing_kg,
            (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0) AS wastage,
            (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0) AS billed
         FROM stock_days s WHERE s.branch_id=? AND s.fish_id=? AND s.day=? FOR UPDATE`, [pu.branch_id, it.fish_id, day]);
      const row = st[0];
      const q = Number(it.q);
      const left = row ? Number(row.opening_kg) + Number(row.added_kg) - Number(row.wastage) - Number(row.billed) : 0;
      if (!row || row.closing_kg !== null || left < q - 1e-9) { await conn.rollback(); return { ok: false, error: "यातला माल आधीच विकला गेला आहे (किंवा क्लोजिंग भरले आहे), म्हणून खरेदी रद्द करता येत नाही." }; }
      await conn.query("UPDATE stock_days SET added_kg=added_kg-?, updated_by=? WHERE branch_id=? AND fish_id=? AND day=?", [q, s.uid, pu.branch_id, it.fish_id, day]);
      await conn.query("INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, reason, created_by) VALUES (?,?,?,'arrival',?,?,?,?)", [pu.branch_id, it.fish_id, day, Number(row.added_kg), Number(row.added_kg) - q, `खरेदी #${id} रद्द`, s.uid]);
    }
    await conn.query("UPDATE purchases SET status='cancelled' WHERE id=?", [id]);
    await conn.commit();
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch {
    await conn.rollback();
    return { ok: false, error: "रद्द करता आले नाही" };
  } finally {
    conn.release();
  }
}
