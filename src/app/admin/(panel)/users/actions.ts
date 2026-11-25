"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizeLoginId, requireSuper } from "@/lib/adminAuth";

export type UState = { ok?: string; error?: string };

const Create = z.object({
  role: z.enum(["branch_admin", "counter"]),
  branchId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(120),
  loginId: z.string().trim().min(5).max(160),
  password: z.string().min(8).max(100),
});

export async function createUserAction(_p: UState, form: FormData): Promise<UState> {
  await requireSuper();
  const p = Create.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "भूमिका, शाखा, नाव, लॉगिन आयडी (किमान ५ अक्षरे) आणि पासवर्ड (किमान ८ अक्षरे) तपासा" };
  try {
    await db().query("INSERT INTO users (login_id, name, password_hash, role, branch_id) VALUES (?,?,?,?,?)", [normalizeLoginId(p.data.loginId), p.data.name, await bcrypt.hash(p.data.password, 12), p.data.role, p.data.branchId]);
  } catch (e) {
    return { error: (e as { code?: string }).code === "ER_DUP_ENTRY" ? "हा लॉगिन आयडी आधीच वापरात आहे" : "वापरकर्ता तयार होऊ शकला नाही" };
  }
  revalidatePath("/admin", "layout");
  return { ok: "वापरकर्ता तयार झाला" };
}

// Only branch-level accounts (manager / cashier) can be touched here; head-office and Abnexa accounts never.
export async function resetUserPasswordAction(userId: number, _p: UState, form: FormData): Promise<UState> {
  await requireSuper();
  const pw = String(form.get("password") || "");
  if (pw.length < 8 || pw.length > 100) return { error: "पासवर्ड किमान ८ अक्षरे असावा" };
  await db().query("UPDATE users SET password_hash=? WHERE id=? AND role IN ('branch_admin','counter')", [await bcrypt.hash(pw, 12), userId]);
  return { ok: "पासवर्ड बदलला" };
}

export async function toggleUserAction(userId: number) {
  await requireSuper();
  await db().query("UPDATE users SET is_active = 1 - is_active WHERE id=? AND role IN ('branch_admin','counter')", [userId]);
  revalidatePath("/admin", "layout");
}
