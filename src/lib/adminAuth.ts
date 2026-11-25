import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, type Session } from "@/lib/session";

/** Link prefix: "" on admin.<domain>, "/admin" when reached via localhost/admin. */
export async function adminHref(path: string): Promise<string> {
  const host = ((await headers()).get("host") || "").toLowerCase();
  const base = host.startsWith("admin.") ? "" : "/admin";
  return (base + path) || "/";
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect(await adminHref("/login"));
  return s;
}

/** Head office (super_admin) or Abnexa: may view every branch. */
export async function requireSuper(): Promise<Session> {
  const s = await requireSession();
  if (s.role === "branch_admin") redirect(await adminHref("/"));
  return s;
}

/** Abnexa only: creates branches and manages billing. The client's head office cannot. */
export async function requireAbnexa(): Promise<Session> {
  const s = await requireSession();
  if (s.role !== "abnexa") redirect(await adminHref("/"));
  return s;
}

/** A branch admin may only touch their own branch; super admin may touch any. */
export function canAccessBranch(s: Session, branchId: number) {
  return s.role !== "branch_admin" || s.branchId === branchId;
}

/** Today's date in India, as YYYY-MM-DD. */
export function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Emails stay as typed (lower-case); phone numbers lose spaces/dashes. */
export function normalizeLoginId(raw: string): string {
  const v = raw.trim().toLowerCase();
  const digits = v.replace(/[\s-]/g, "");
  return !v.includes("@") && /^\+?\d{8,15}$/.test(digits) ? digits.replace(/^\+?91(?=\d{10}$)/, "") : v;
}
