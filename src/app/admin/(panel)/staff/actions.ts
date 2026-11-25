"use server";

import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";

export type StState = { ok?: string; error?: string };

const Schema = z.object({
  branchId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(20).optional(),
  title: z.string().trim().max(60).optional(),
  salary: z.coerce.number().min(0).max(10_000_000).default(0),
  joined: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
});

export async function createStaffAction(_p: StState, form: FormData): Promise<StState> {
  const s = await requireSession();
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const p = Schema.safeParse({ ...Object.fromEntries(form), branchId: isHead ? form.get("branchId") : s.branchId, salary: form.get("salary") || 0 });
  if (!p.success) return { error: "नाव (किमान २ अक्षरे), पगार आणि तारीख तपासा" };
  if (!canAccessBranch(s, p.data.branchId)) return { error: "या शाखेला परवानगी नाही" };
  await db().query("INSERT INTO staff (branch_id, name, phone, job_title, monthly_salary, joined_on) VALUES (?,?,?,?,?,?)", [p.data.branchId, p.data.name, p.data.phone || null, p.data.title || null, p.data.salary, p.data.joined || null]);
  revalidatePath("/admin", "layout");
  return { ok: "कर्मचारी जोडला" };
}

async function ownStaff(staffId: number) {
  const s = await requireSession();
  const [r] = await db().query<RowDataPacket[]>("SELECT branch_id FROM staff WHERE id=?", [staffId]);
  return r[0] && canAccessBranch(s, r[0].branch_id) ? s : null;
}

export async function updateStaffAction(staffId: number, _p: StState, form: FormData): Promise<StState> {
  const s = await ownStaff(staffId);
  if (!s) return { error: "परवानगी नाही" };
  const p = Schema.omit({ branchId: true }).safeParse({ ...Object.fromEntries(form), salary: form.get("salary") || 0 });
  if (!p.success) return { error: "नाव, पगार आणि तारीख तपासा" };
  await db().query("UPDATE staff SET name=?, phone=?, job_title=?, monthly_salary=?, joined_on=? WHERE id=?", [p.data.name, p.data.phone || null, p.data.title || null, p.data.salary, p.data.joined || null, staffId]);
  revalidatePath("/admin", "layout");
  return { ok: "सेव्ह झाले" };
}

export async function toggleStaffAction(staffId: number) {
  if (!(await ownStaff(staffId))) return;
  await db().query("UPDATE staff SET is_active = 1 - is_active WHERE id=?", [staffId]);
  revalidatePath("/admin", "layout");
}

export async function markAttendanceAction(staffId: number, day: string, status: "present" | "half" | "absent" | "leave"): Promise<{ ok: boolean }> {
  const s = await ownStaff(staffId);
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(day) || day > todayIST() || !["present", "half", "absent", "leave"].includes(status)) return { ok: false };
  await db().query("INSERT INTO staff_attendance (staff_id, day, status, marked_by) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status), marked_by=VALUES(marked_by)", [staffId, day, status, s.uid]);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// ---------------------------------------------------------------------------------------------
// Salary / advance (उचल) / bonus payments
// ---------------------------------------------------------------------------------------------

const PaySchema = z.object({
  kind: z.enum(["salary", "advance", "bonus"]),
  amount: z.coerce.number().min(0).max(10_000_000),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  forMonth: z.string().regex(/^\d{4}-\d{2}$/).optional().or(z.literal("")),
  recovered: z.coerce.number().min(0).max(10_000_000).default(0),
  mode: z.enum(["cash", "upi", "bank"]),
  note: z.string().trim().max(200).optional(),
});

const KIND_MR = { salary: "पगार", advance: "उचल", bonus: "बोनस" } as const;

/** Money still owed back to us by a staff member: advances given − advances already deducted from salaries. */
async function advanceOutstanding(staffId: number): Promise<number> {
  const [r] = await db().query<RowDataPacket[]>(
    "SELECT COALESCE(SUM(CASE WHEN kind='advance' THEN amount END),0) AS adv, COALESCE(SUM(advance_recovered),0) AS rec FROM staff_payments WHERE staff_id=? AND is_deleted=0", [staffId]);
  return Number(r[0].adv) - Number(r[0].rec);
}

export async function payStaffAction(staffId: number, _p: StState, form: FormData): Promise<StState> {
  const s = await ownStaff(staffId);
  if (!s) return { error: "परवानगी नाही" };
  const p = PaySchema.safeParse({ ...Object.fromEntries(form), recovered: form.get("recovered") || 0, amount: form.get("amount") || 0 });
  if (!p.success) return { error: "प्रकार, रक्कम, तारीख आणि पद्धत तपासा" };
  const d = p.data;
  if (d.day > todayIST()) return { error: "भविष्यातील तारीख चालणार नाही" };
  if (d.kind === "salary" && !d.forMonth) return { error: "कोणत्या महिन्याचा पगार ते निवडा" };
  if (d.kind !== "salary" && d.recovered > 0) return { error: "उचल कपात फक्त पगारात करता येते" };
  if (d.amount + d.recovered <= 0) return { error: "रक्कम ० पेक्षा जास्त असावी" };
  if (d.kind !== "salary" && d.amount <= 0) return { error: "रक्कम ० पेक्षा जास्त असावी" };

  const [st] = await db().query<RowDataPacket[]>("SELECT branch_id, name FROM staff WHERE id=?", [staffId]);
  if (d.recovered > 0) {
    const out = await advanceOutstanding(staffId);
    if (d.recovered > out + 0.001) return { error: `उचल बाकी फक्त ₹${out.toLocaleString("en-IN")} आहे; त्यापेक्षा जास्त कपात करता येणार नाही` };
  }

  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    let expenseId: number | null = null;
    if (d.amount > 0) {
      // Cash actually handed over is a staff expense: it shows in expenses and in the day's cash closing.
      const [e] = await conn.query<import("mysql2").ResultSetHeader>(
        "INSERT INTO expenses (branch_id, day, category, amount, payment_mode, note, created_by) VALUES (?,?,'staff',?,?,?,?)",
        [st[0].branch_id, d.day, d.amount, d.mode, `${KIND_MR[d.kind]}: ${st[0].name}${d.forMonth ? ` (${d.forMonth})` : ""}`, s.uid]);
      expenseId = e.insertId;
    }
    await conn.query(
      "INSERT INTO staff_payments (staff_id, branch_id, day, kind, amount, for_month, advance_recovered, payment_mode, note, expense_id, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [staffId, st[0].branch_id, d.day, d.kind, d.amount, d.kind === "salary" ? d.forMonth : null, d.recovered, d.mode, d.note || null, expenseId, s.uid]);
    await conn.commit();
  } catch {
    await conn.rollback();
    return { error: "सेव्ह होऊ शकले नाही" };
  } finally {
    conn.release();
  }
  revalidatePath("/admin", "layout");
  return { ok: `${KIND_MR[d.kind]} नोंदवला` };
}

/** Soft delete: the payment and its linked expense are hidden, nothing is erased. */
export async function deleteStaffPaymentAction(paymentId: number) {
  const s = await requireSession();
  const [r] = await db().query<RowDataPacket[]>("SELECT branch_id, expense_id FROM staff_payments WHERE id=? AND is_deleted=0", [paymentId]);
  if (!r[0] || !canAccessBranch(s, r[0].branch_id)) return;
  await db().query("UPDATE staff_payments SET is_deleted=1 WHERE id=?", [paymentId]);
  if (r[0].expense_id) await db().query("UPDATE expenses SET is_deleted=1 WHERE id=?", [r[0].expense_id]);
  revalidatePath("/admin", "layout");
}
