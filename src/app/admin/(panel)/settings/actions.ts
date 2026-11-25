"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { canAccessBranch, requireSession } from "@/lib/adminAuth";

export type SettingsState = { ok?: string; error?: string };

const Schema = z.object({
  paper: z.enum(["58", "80"]),
  headerExtra: z.string().trim().max(120).optional(),
  footerText: z.string().trim().min(1).max(120),
  lowStock: z.coerce.number().min(0).max(1000),
});

export async function saveSettingsAction(branchId: number, _p: SettingsState, form: FormData): Promise<SettingsState> {
  const s = await requireSession();
  if (!canAccessBranch(s, branchId)) return { error: "या शाखेला परवानगी नाही" };
  const p = Schema.safeParse({ paper: form.get("paper"), headerExtra: form.get("headerExtra") ?? "", footerText: form.get("footerText"), lowStock: form.get("lowStock") || 3 });
  if (!p.success) return { error: "कागदाची रुंदी आणि शेवटची ओळ तपासा (जास्तीत जास्त १२० अक्षरे)" };
  await db().query(
    `INSERT INTO branch_settings (branch_id, paper_mm, auto_print, header_extra, footer_text, low_stock_kg, updated_by) VALUES (?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE paper_mm=VALUES(paper_mm), auto_print=VALUES(auto_print), header_extra=VALUES(header_extra), footer_text=VALUES(footer_text), low_stock_kg=VALUES(low_stock_kg), updated_by=VALUES(updated_by)`,
    [branchId, Number(p.data.paper), form.get("autoPrint") === "on" ? 1 : 0, p.data.headerExtra || null, p.data.footerText, p.data.lowStock, s.uid],
  );
  revalidatePath("/admin", "layout");
  return { ok: "सेटिंग्ज सेव्ह झाल्या. सर्व काउंटरवर लगेच लागू." };
}
