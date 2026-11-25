import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { todayIST } from "@/lib/adminAuth";

const schema = z.object({
  branchSlug: z.string().min(2).max(80),
  fishSlug: z.string().min(2).max(80),
  weightKg: z.number().min(0.25).max(500),
  cut: z.string().max(80).optional(),
  masala: z.string().max(80).optional(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().regex(/^[0-9]{10}$/),
  // Honeypot: real users never fill this.
  website: z.string().max(0).optional(),
});

const hits = new Map<string, { n: number; t: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const h = hits.get(ip);
  if (h && now - h.t < 60_000) {
    if (h.n >= 6) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    h.n++;
  } else hits.set(ip, { n: 1, t: now });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid details" }, { status: 400 });
  const d = parsed.data;

  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT b.id AS branch_id, f.id AS fish_id, f.name_mr, s.price_per_kg, s.opening_kg, s.added_kg, s.closing_kg, s.sold_out
     FROM branches b
     JOIN fish_items f ON f.slug=?
     JOIN stock_days s ON s.branch_id=b.id AND s.fish_id=f.id AND s.day=?
     WHERE b.slug=? AND b.is_active=1 LIMIT 1`,
    [d.fishSlug, todayIST(), d.branchSlug],
  );
  const r = rows[0];
  if (!r || Number(r.price_per_kg) <= 0) return NextResponse.json({ error: "Not available" }, { status: 409 });
  const left = r.closing_kg === null ? Number(r.opening_kg) + Number(r.added_kg) : Number(r.closing_kg);
  if (r.sold_out || left <= 0) return NextResponse.json({ error: "Sold out" }, { status: 409 });

  // Price always comes from the database, never from the browser.
  const total = Number(r.price_per_kg) * d.weightKg;
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [o] = await conn.query<ResultSetHeader>(
      "INSERT INTO orders (branch_id, customer_name, customer_phone, note, total) VALUES (?,?,?,?,?)",
      [r.branch_id, d.name, d.phone, d.masala && d.masala !== "none" ? `मसाला: ${d.masala}` : null, total],
    );
    await conn.query(
      "INSERT INTO order_items (order_id, fish_id, fish_name, qty_kg, price_per_kg, cut) VALUES (?,?,?,?,?,?)",
      [o.insertId, r.fish_id, r.name_mr, d.weightKg, r.price_per_kg, d.cut ?? null],
    );
    await conn.commit();
    return NextResponse.json({ id: o.insertId });
  } catch {
    await conn.rollback();
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  } finally {
    conn.release();
  }
}
