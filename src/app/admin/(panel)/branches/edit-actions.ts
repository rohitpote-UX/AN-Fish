"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSuper } from "@/lib/adminAuth";

export type EState = { ok?: string; error?: string };

const Schema = z.object({
  name: z.string().trim().min(3).max(160),
  address: z.string().trim().max(400).optional(),
  whatsapp: z.string().trim().regex(/^\d{10,13}$/),
  openTime: z.string().trim().max(40).optional(),
  lat: z.string().trim().optional(),
  lng: z.string().trim().optional(),
});

export async function updateBranchAction(branchId: number, _p: EState, form: FormData): Promise<EState> {
  await requireSuper();
  const p = Schema.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "नाव (किमान ३ अक्षरे) आणि WhatsApp नंबर (देशकोडासह, फक्त आकडे) तपासा" };
  const lat = p.data.lat ? Number(p.data.lat) : null, lng = p.data.lng ? Number(p.data.lng) : null;
  if ((p.data.lat && !Number.isFinite(lat)) || (p.data.lng && !Number.isFinite(lng))) return { error: "Latitude / Longitude चुकीचे आहे" };
  await db().query("UPDATE branches SET name=?, address=?, whatsapp=?, open_time=?, lat=?, lng=? WHERE id=?", [p.data.name, p.data.address || null, p.data.whatsapp, p.data.openTime || null, lat, lng, branchId]);
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout"); // public branch pages show the WhatsApp number
  return { ok: "शाखेची माहिती सेव्ह झाली" };
}
