"use server";

import { revalidatePath } from "next/cache";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireAnySession, todayIST } from "@/lib/adminAuth";
import { loadBills, type BillData } from "@/lib/pos";

const Line = z.object({
  fishId: z.number().int().positive(),
  qty: z.number().min(0.01).max(500),
  cut: z.string().trim().max(80).optional(),
});
const Payload = z.object({
  lines: z.array(Line).min(1).max(40),
  discount: z.number().min(0).max(1_000_000).default(0),
  mode: z.enum(["cash", "upi", "other"]),
  customerName: z.string().trim().max(120).optional(),
  customerPhone: z.string().trim().regex(/^\d{10}$/).optional().or(z.literal("")),
});

export type BillResult = { ok: true; bill: BillData } | { ok: false; error: string };

/** Creates a counter bill. Prices and stock are always read from the database, never trusted from the browser. */
export async function createBillAction(input: z.input<typeof Payload>): Promise<BillResult> {
  const s = await requireAnySession();
  if (s.role !== "counter" && s.role !== "branch_admin") return { ok: false, error: "या लॉगिनला बिलिंगची परवानगी नाही" };
  const branchId = s.branchId ?? 0;
  if (!branchId) return { ok: false, error: "शाखा सापडली नाही" };
  const p = Payload.safeParse(input);
  if (!p.success) return { ok: false, error: "बिलातील माहिती तपासा (वजन आणि रक्कम)" };
  const d = p.data;
  const day = todayIST();

  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("SELECT id FROM branches WHERE id=? FOR UPDATE", [branchId]); // serialises bill numbers & stock checks per branch

    const ids = [...new Set(d.lines.map((l) => l.fishId))];
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT f.id, f.name_mr, s.price_per_kg, s.opening_kg, s.added_kg, s.closing_kg, s.sold_out,
          (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0) AS wastage,
          (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id
             WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0) AS billed
       FROM stock_days s JOIN fish_items f ON f.id=s.fish_id WHERE s.branch_id=? AND s.day=? AND s.fish_id IN (?)`,
      [branchId, day, ids],
    );
    const stock = new Map(rows.map((r) => [r.id as number, r]));

    const want = new Map<number, number>();
    for (const l of d.lines) want.set(l.fishId, (want.get(l.fishId) ?? 0) + l.qty);
    for (const [fishId, qty] of want) {
      const r = stock.get(fishId);
      if (!r || Number(r.price_per_kg) <= 0) { await conn.rollback(); return { ok: false, error: "या माशाचा आजचा भाव / स्टॉक भरलेला नाही" }; }
      if (r.closing_kg !== null) { await conn.rollback(); return { ok: false, error: `${r.name_mr}: आजचे क्लोजिंग आधीच भरले आहे` }; }
      const left = Number(r.opening_kg) + Number(r.added_kg) - Number(r.wastage) - Number(r.billed);
      if (r.sold_out || qty > left + 1e-9) { await conn.rollback(); return { ok: false, error: `${r.name_mr}: फक्त ${Math.max(0, left).toFixed(2)} kg शिल्लक आहे` }; }
    }

    const items = d.lines.map((l) => {
      const r = stock.get(l.fishId)!;
      const rate = Number(r.price_per_kg);
      return { fishId: l.fishId, name: r.name_mr as string, qty: l.qty, rate, amount: Math.round(l.qty * rate), cut: l.cut || null };
    });
    const subtotal = items.reduce((a, i) => a + i.amount, 0);
    if (d.discount > subtotal) { await conn.rollback(); return { ok: false, error: "सूट बिलाच्या रकमेपेक्षा जास्त असू शकत नाही" }; }
    const total = subtotal - d.discount;

    const [mx] = await conn.query<RowDataPacket[]>("SELECT COALESCE(MAX(bill_no),0) AS n FROM bills WHERE branch_id=? AND bill_day=?", [branchId, day]);
    const billNo = Number(mx[0].n) + 1;
    const [ins] = await conn.query<ResultSetHeader>(
      `INSERT INTO bills (branch_id, bill_day, bill_no, subtotal, discount, total, payment_mode, customer_name, customer_phone, created_by) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [branchId, day, billNo, subtotal, d.discount, total, d.mode, d.customerName || null, d.customerPhone || null, s.uid],
    );
    for (const i of items) {
      await conn.query("INSERT INTO bill_items (bill_id, fish_id, fish_name, qty_kg, price_per_kg, amount, cut) VALUES (?,?,?,?,?,?,?)", [ins.insertId, i.fishId, i.name, i.qty, i.rate, i.amount, i.cut]);
    }
    // Stock ledger: remaining kg before → after for each fish
    for (const [fishId, qty] of want) {
      const r = stock.get(fishId)!;
      const before = Number(r.opening_kg) + Number(r.added_kg) - Number(r.wastage) - Number(r.billed);
      await conn.query(
        "INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, reason, created_by) VALUES (?,?,?,'sale',?,?,?,?)",
        [branchId, fishId, day, before, before - qty, `बिल #${billNo}`, s.uid],
      );
    }
    await conn.commit();
    revalidatePath("/admin", "layout");
    const bill = (await loadBills(branchId, day)).find((b) => b.id === ins.insertId);
    return bill ? { ok: true, bill } : { ok: false, error: "बिल तयार झाले पण दाखवता आले नाही. 'आजची बिले' मध्ये पहा." };
  } catch {
    await conn.rollback();
    return { ok: false, error: "बिल तयार होऊ शकले नाही, पुन्हा प्रयत्न करा" };
  } finally {
    conn.release();
  }
}

/** Cancel a bill (staff only, not counter logins). Stock is restored and the change is logged. */
export async function voidBillAction(billId: number, reason: string): Promise<{ ok: boolean; error?: string }> {
  const s = await requireAnySession();
  if (s.role === "counter") return { ok: false, error: "फक्त अ‍ॅडमिन बिल रद्द करू शकतो" };
  const why = reason.trim().slice(0, 200);
  if (why.length < 3) return { ok: false, error: "रद्द करण्याचे कारण लिहा" };
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [b] = await conn.query<RowDataPacket[]>("SELECT * FROM bills WHERE id=? FOR UPDATE", [billId]);
    const bill = b[0];
    if (!bill || !canAccessBranch(s, bill.branch_id)) { await conn.rollback(); return { ok: false, error: "बिल सापडले नाही" }; }
    if (bill.is_void) { await conn.rollback(); return { ok: false, error: "हे बिल आधीच रद्द आहे" }; }
    await conn.query("UPDATE bills SET is_void=1, void_reason=?, voided_by=? WHERE id=?", [why, s.uid, billId]);
    const [items] = await conn.query<RowDataPacket[]>("SELECT fish_id, SUM(qty_kg) AS q FROM bill_items WHERE bill_id=? GROUP BY fish_id", [billId]);
    for (const i of items) {
      const [st] = await conn.query<RowDataPacket[]>(
        `SELECT s.opening_kg, s.added_kg,
            (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0) AS wastage,
            (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0) AS billed
         FROM stock_days s WHERE s.branch_id=? AND s.fish_id=? AND s.day=?`, [bill.branch_id, i.fish_id, bill.bill_day]);
      const after = st[0] ? Number(st[0].opening_kg) + Number(st[0].added_kg) - Number(st[0].wastage) - Number(st[0].billed) : Number(i.q);
      await conn.query(
        "INSERT INTO stock_movements (branch_id, fish_id, day, kind, prev_value, new_value, reason, created_by) VALUES (?,?,?,'sale_void',?,?,?,?)",
        [bill.branch_id, i.fish_id, bill.bill_day, after - Number(i.q), after, `बिल #${bill.bill_no} रद्द: ${why}`, s.uid],
      );
    }
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
