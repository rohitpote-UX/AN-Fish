"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminHref, normalizeLoginId, requireAbnexa, requireSuper } from "@/lib/adminAuth";

export type FormState = { error?: string; ok?: string };

const Create = z.object({
  name: z.string().trim().min(3).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,80}$/, "slug"),
  address: z.string().trim().max(400).optional(),
  lat: z.string().trim().optional(),
  lng: z.string().trim().optional(),
  whatsapp: z.string().trim().regex(/^\d{10,13}$/, "whatsapp"),
  openTime: z.string().trim().max(40).optional(),
  loginId: z.string().trim().toLowerCase().min(5).max(160),
  password: z.string().min(8).max(100),
  monthlyFee: z.coerce.number().min(0).max(10000000).default(0),
});

export async function createBranchAction(_p: FormState, form: FormData): Promise<FormState> {
  await requireAbnexa();
  const p = Create.safeParse(Object.fromEntries(form));
  if (!p.success) {
    const f = p.error.issues[0]?.path[0];
    const msg: Record<string, string> = {
      name: "शाखेचे नाव किमान ३ अक्षरे असावे",
      slug: "स्लग फक्त इंग्रजी लहान अक्षरे, आकडे आणि '-' (उदा. karad-hq)",
      whatsapp: "WhatsApp नंबर देशकोडासह, फक्त आकडे (उदा. 919876543210)",
      loginId: "लॉगिन आयडी (मोबाईल/ईमेल) किमान ५ अक्षरे",
      password: "पासवर्ड किमान ८ अक्षरे असावा",
    };
    return { error: msg[String(f)] ?? "कृपया माहिती तपासा" };
  }
  const d = p.data;
  const lat = d.lat ? Number(d.lat) : null;
  const lng = d.lng ? Number(d.lng) : null;
  if ((d.lat && Number.isNaN(lat)) || (d.lng && Number.isNaN(lng))) return { error: "Latitude/Longitude चुकीचे आहे" };

  const conn = await db().getConnection();
  let branchId = 0;
  try {
    await conn.beginTransaction();
    const [res] = await conn.query(
      "INSERT INTO branches (slug, name, address, lat, lng, whatsapp, open_time, monthly_fee) VALUES (?,?,?,?,?,?,?,?)",
      [d.slug, d.name, d.address || null, lat, lng, d.whatsapp, d.openTime || null, d.monthlyFee],
    );
    branchId = (res as { insertId: number }).insertId;
    await conn.query(
      "INSERT INTO users (login_id, name, password_hash, role, branch_id) VALUES (?,?,?,'branch_admin',?)",
      [normalizeLoginId(d.loginId), d.name, await bcrypt.hash(d.password, 12), branchId],
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    const code = (e as { code?: string }).code;
    return { error: code === "ER_DUP_ENTRY" ? "हा स्लग किंवा लॉगिन आयडी आधीच वापरात आहे" : "शाखा तयार होऊ शकली नाही" };
  } finally {
    conn.release();
  }
  revalidatePath("/admin", "layout");
  redirect(await adminHref(`/branches/${branchId}`));
}

export async function resetPasswordAction(branchId: number, _p: FormState, form: FormData): Promise<FormState> {
  await requireSuper();
  const pw = String(form.get("password") || "");
  if (pw.length < 8 || pw.length > 100) return { error: "पासवर्ड किमान ८ अक्षरे असावा" };
  await db().query("UPDATE users SET password_hash=? WHERE branch_id=? AND role='branch_admin'", [await bcrypt.hash(pw, 12), branchId]);
  return { ok: "नवीन पासवर्ड सेव्ह झाला" };
}

export async function toggleBranchAction(branchId: number) {
  await requireAbnexa();
  await db().query("UPDATE branches SET is_active = 1 - is_active WHERE id=?", [branchId]);
  await db().query("UPDATE users u JOIN branches b ON b.id=u.branch_id SET u.is_active=b.is_active WHERE b.id=?", [branchId]);
  revalidatePath("/admin", "layout");
}

const Pay = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().min(0).max(10000000),
  paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  method: z.string().trim().max(40).optional(),
  note: z.string().trim().max(200).optional(),
});

export async function recordPaymentAction(branchId: number, _p: FormState, form: FormData): Promise<FormState> {
  const s = await requireAbnexa();
  const p = Pay.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "महिना, रक्कम आणि तारीख तपासा" };
  const d = p.data;
  await db().query(
    `INSERT INTO branch_payments (branch_id, month, amount, paid_on, method, note, created_by) VALUES (?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE amount=VALUES(amount), paid_on=VALUES(paid_on), method=VALUES(method), note=VALUES(note), created_by=VALUES(created_by)`,
    [branchId, d.month, d.amount, d.paidOn, d.method || null, d.note || null, s.uid],
  );
  revalidatePath("/admin", "layout");
  return { ok: `${d.month} चे पेमेंट नोंदवले` };
}

export async function deletePaymentAction(paymentId: number) {
  await requireAbnexa();
  await db().query("DELETE FROM branch_payments WHERE id=?", [paymentId]);
  revalidatePath("/admin", "layout");
}

export async function setFeeAction(branchId: number, _p: FormState, form: FormData): Promise<FormState> {
  await requireAbnexa();
  const fee = Number(form.get("fee"));
  if (!Number.isFinite(fee) || fee < 0 || fee > 10000000) return { error: "रक्कम चुकीची आहे" };
  await db().query("UPDATE branches SET monthly_fee=? WHERE id=?", [fee, branchId]);
  revalidatePath("/admin", "layout");
  return { ok: "मासिक फी सेव्ह झाली" };
}
