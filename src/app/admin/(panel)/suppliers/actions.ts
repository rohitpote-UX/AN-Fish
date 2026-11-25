"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession, todayIST } from "@/lib/adminAuth";

export type SupState = { ok?: string; error?: string };

const Supplier = z.object({
  name: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(300).optional(),
  type: z.string().trim().max(60).optional(),
  terms: z.string().trim().max(120).optional(),
  opening: z.coerce.number().min(0).max(100_000_000).default(0),
});

export async function createSupplierAction(_p: SupState, form: FormData): Promise<SupState> {
  await requireSession();
  const p = Supplier.safeParse({ ...Object.fromEntries(form), opening: form.get("opening") || 0 });
  if (!p.success) return { error: "पुरवठादाराचे नाव (किमान २ अक्षरे) आणि आकडे तपासा" };
  const d = p.data;
  await db().query("INSERT INTO suppliers (name, phone, address, supplier_type, payment_terms, opening_balance) VALUES (?,?,?,?,?,?)", [d.name, d.phone || null, d.address || null, d.type || null, d.terms || null, d.opening]);
  revalidatePath("/admin", "layout");
  return { ok: "पुरवठादार जोडला" };
}

const Pay = z.object({ amount: z.coerce.number().gt(0).max(100_000_000), mode: z.enum(["cash", "upi", "bank", "other"]), note: z.string().trim().max(200).optional() });

export async function paySupplierAction(supplierId: number, _p: SupState, form: FormData): Promise<SupState> {
  const s = await requireSession();
  const p = Pay.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "रक्कम आणि पेमेंट पद्धत तपासा" };
  const branchId = s.role === "branch_admin" ? s.branchId : null;
  if (branchId !== null && !canAccessBranch(s, branchId)) return { error: "परवानगी नाही" };
  await db().query("INSERT INTO supplier_payments (supplier_id, branch_id, day, amount, payment_mode, note, created_by) VALUES (?,?,?,?,?,?,?)", [supplierId, branchId, todayIST(), p.data.amount, p.data.mode, p.data.note || null, s.uid]);
  revalidatePath("/admin", "layout");
  return { ok: "पेमेंट नोंदवले" };
}

export async function toggleSupplierAction(id: number) {
  const s = await requireSession();
  if (s.role === "branch_admin") return; // only head office can switch a supplier off
  await db().query("UPDATE suppliers SET is_active = 1 - is_active WHERE id=?", [id]);
  revalidatePath("/admin", "layout");
}
