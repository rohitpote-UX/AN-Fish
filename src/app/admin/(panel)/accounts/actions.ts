"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizeLoginId, requireAbnexa } from "@/lib/adminAuth";

export type AccState = { error?: string; ok?: string };

const Create = z.object({
  name: z.string().trim().min(2).max(120),
  loginId: z.string().trim().min(5).max(160),
  password: z.string().min(8).max(100),
});

export async function createHeadAction(_p: AccState, form: FormData): Promise<AccState> {
  await requireAbnexa();
  const p = Create.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "नाव, लॉगिन आयडी (किमान ५ अक्षरे) आणि पासवर्ड (किमान ८ अक्षरे) तपासा" };
  try {
    await db().query("INSERT INTO users (login_id, name, password_hash, role) VALUES (?,?,?,'super_admin')", [
      normalizeLoginId(p.data.loginId), p.data.name, await bcrypt.hash(p.data.password, 12),
    ]);
  } catch (e) {
    return { error: (e as { code?: string }).code === "ER_DUP_ENTRY" ? "हा लॉगिन आयडी आधीच वापरात आहे" : "खाते तयार होऊ शकले नाही" };
  }
  revalidatePath("/admin", "layout");
  return { ok: "सुपर अ‍ॅडमिन खाते तयार झाले" };
}

export async function resetHeadPasswordAction(userId: number, _p: AccState, form: FormData): Promise<AccState> {
  await requireAbnexa();
  const pw = String(form.get("password") || "");
  if (pw.length < 8 || pw.length > 100) return { error: "पासवर्ड किमान ८ अक्षरे असावा" };
  await db().query("UPDATE users SET password_hash=? WHERE id=? AND role='super_admin'", [await bcrypt.hash(pw, 12), userId]);
  return { ok: "पासवर्ड बदलला" };
}

export async function toggleHeadAction(userId: number) {
  await requireAbnexa();
  await db().query("UPDATE users SET is_active = 1 - is_active WHERE id=? AND role='super_admin'", [userId]);
  revalidatePath("/admin", "layout");
}
