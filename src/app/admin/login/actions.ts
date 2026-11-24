"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

export type LoginState = { error?: string };

// Same message for every failure so attackers can't learn which ids exist.
const FAIL = "लॉगिन आयडी किंवा पासवर्ड चुकीचा आहे";
// Pre-computed hash so response time doesn't reveal whether a user exists.
const DUMMY = "$2b$12$wiQUnQh6dsgjqEBieD7iEOdqVH/ccpQ9eg6zRqEBS2H/PzdBELXyq";

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const loginId = String(form.get("loginId") || "").trim().toLowerCase().replace(/[\s-]/g, "");
  const password = String(form.get("password") || "");
  if (!loginId || !password || password.length > 200) return { error: FAIL };

  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT id, name, password_hash, role, branch_id, is_active FROM users WHERE login_id = ? LIMIT 1",
    [loginId],
  );
  const u = rows[0];
  const ok = await bcrypt.compare(password, u?.password_hash ?? DUMMY);
  if (!u || !ok) return { error: FAIL };
  if (!u.is_active) return { error: "हे खाते बंद केले आहे. कृपया Abnexa शी संपर्क करा." };

  await createSession({ uid: u.id, role: u.role, branchId: u.branch_id, name: u.name });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
