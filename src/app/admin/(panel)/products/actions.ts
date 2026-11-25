"use server";

import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSuper } from "@/lib/adminAuth";

export type PState = { ok?: string; error?: string };

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const Img = z.string().trim().max(300).refine((v) => v === "" || v.startsWith("/") || v.startsWith("https://"), "image").optional();
const Product = z.object({
  nameMr: z.string().trim().min(2).max(160),
  nameEn: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(40),
  imageUrl: Img,
});

async function uniqueSlug(base: string) {
  let slug = base || "product";
  for (let i = 2; i < 50; i++) {
    const [r] = await db().query<RowDataPacket[]>("SELECT id FROM fish_items WHERE slug=?", [slug]);
    if (!r[0]) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function createProductAction(_p: PState, form: FormData): Promise<PState> {
  await requireSuper();
  const p = Product.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "मराठी व इंग्रजी नाव, कॅटेगरी तपासा (फोटो लिंक / किंवा https:// ने सुरू होणारी असावी)" };
  const [cat] = await db().query<RowDataPacket[]>("SELECT id FROM categories WHERE slug=?", [p.data.category]);
  if (!cat[0]) return { error: "कॅटेगरी सापडली नाही" };
  const slug = await uniqueSlug(slugify(p.data.nameEn));
  const [mx] = await db().query<RowDataPacket[]>("SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM fish_items");
  await db().query("INSERT INTO fish_items (slug, name_mr, name_en, category, image_url, sort_order) VALUES (?,?,?,?,?,?)", [slug, p.data.nameMr, p.data.nameEn, p.data.category, p.data.imageUrl || null, mx[0].n]);
  revalidatePath("/admin", "layout");
  return { ok: "नवीन उत्पादन जोडले. आता शाखांच्या स्टॉक स्क्रीनवर दिसेल." };
}

export async function updateProductAction(id: number, _p: PState, form: FormData): Promise<PState> {
  await requireSuper();
  const p = Product.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "नाव, कॅटेगरी आणि फोटो लिंक तपासा" };
  await db().query("UPDATE fish_items SET name_mr=?, name_en=?, category=?, image_url=? WHERE id=?", [p.data.nameMr, p.data.nameEn, p.data.category, p.data.imageUrl || null, id]);
  revalidatePath("/admin", "layout");
  return { ok: "सेव्ह झाले" };
}

export async function toggleProductAction(id: number) {
  await requireSuper();
  await db().query("UPDATE fish_items SET is_active = 1 - is_active WHERE id=?", [id]); // hide instead of delete: past sales keep their history
  revalidatePath("/admin", "layout");
}

export async function createCategoryAction(_p: PState, form: FormData): Promise<PState> {
  await requireSuper();
  const nameMr = String(form.get("nameMr") || "").trim(), nameEn = String(form.get("nameEn") || "").trim();
  const slug = slugify(nameEn);
  if (nameMr.length < 2 || nameEn.length < 2 || !slug) return { error: "मराठी व इंग्रजी नाव टाका" };
  try {
    await db().query("INSERT INTO categories (slug, name_mr, name_en, sort_order) SELECT ?,?,?, COALESCE(MAX(sort_order),0)+1 FROM categories", [slug, nameMr, nameEn]);
  } catch {
    return { error: "ही कॅटेगरी आधीच आहे" };
  }
  revalidatePath("/admin", "layout");
  return { ok: "कॅटेगरी जोडली" };
}
