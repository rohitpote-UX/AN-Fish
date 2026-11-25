"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizeLoginId, requireSuper } from "@/lib/adminAuth";

export type CState = { ok?: string; error?: string };

const Create = z.object({
  loginId: z.string().trim().min(5).max(160),
  name: z.string().trim().min(2).max(120).default("Counter"),
  password: z.string().min(8).max(100),
});

export async function createCounterAction(branchId: number, _p: CState, form: FormData): Promise<CState> {
  await requireSuper();
  const p = Create.safeParse({ loginId: form.get("loginId"), name: form.get("name") || "Counter", password: form.get("password") });
  if (!p.success) return { error: "लॉगिन आयडी (किमान ५ अक्षरे) आणि पासवर्ड (किमान ८ अक्षरे) तपासा" };
  try {
    await db().query("INSERT INTO users (login_id, name, password_hash, role, branch_id) VALUES (?,?,?,'counter',?)", [
      normalizeLoginId(p.data.loginId), p.data.name, await bcrypt.hash(p.data.password, 12), branchId,
    ]);
  } catch (e) {
    return { error: (e as { code?: string }).code === "ER_DUP_ENTRY" ? "हा लॉगिन आयडी आधीच वापरात आहे" : "लॉगिन तयार होऊ शकले नाही" };
  }
  revalidatePath("/admin", "layout");
  return { ok: "काउंटर लॉगिन तयार झाले" };
}

export async function resetCounterPasswordAction(userId: number, branchId: number, _p: CState, form: FormData): Promise<CState> {
  await requireSuper();
  const pw = String(form.get("password") || "");
  if (pw.length < 8 || pw.length > 100) return { error: "पासवर्ड किमान ८ अक्षरे असावा" };
  await db().query("UPDATE users SET password_hash=? WHERE id=? AND branch_id=? AND role='counter'", [await bcrypt.hash(pw, 12), userId, branchId]);
  return { ok: "पासवर्ड बदलला" };
}

export async function toggleCounterAction(userId: number, branchId: number) {
  await requireSuper();
  await db().query("UPDATE users SET is_active = 1 - is_active WHERE id=? AND branch_id=? AND role='counter'", [userId, branchId]);
  revalidatePath("/admin", "layout");
}
