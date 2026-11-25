import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { todayIST } from "@/lib/adminAuth";
import { SPECIES_LIST } from "@/data/species";

export type LiveFish = {
  slug: string;
  nameMr: string;
  nameEn: string;
  image: string | null;
  pricePerKg: number;
  available: boolean;
};

export type LiveBranch = {
  whatsapp: string;
  isActive: boolean;
  /** Fish the admin has priced for today (price > 0). Empty until the branch admin saves today's stock. */
  fish: LiveFish[];
  updatedAt: string | null;
};

/**
 * Live data for one public branch page, or null when the branch is not in the
 * database (or the database is unreachable) so the page can use its static content.
 */
export async function getLiveBranch(slug: string): Promise<LiveBranch | null> {
  try {
    const [b] = await db().query<RowDataPacket[]>(
      "SELECT id, whatsapp, is_active FROM branches WHERE slug=? LIMIT 1",
      [slug],
    );
    if (!b[0]) return null;
    const [r] = await db().query<RowDataPacket[]>(
      `SELECT f.slug, f.name_mr, f.name_en, s.price_per_kg, s.opening_kg, s.added_kg, s.closing_kg, s.sold_out, s.updated_at,
              (SELECT COALESCE(SUM(w.qty_kg),0) FROM wastage w WHERE w.branch_id=s.branch_id AND w.fish_id=s.fish_id AND w.day=s.day AND w.is_deleted=0) AS wastage,
              (SELECT COALESCE(SUM(bi.qty_kg),0) FROM bill_items bi JOIN bills bl ON bl.id=bi.bill_id WHERE bl.branch_id=s.branch_id AND bi.fish_id=s.fish_id AND bl.bill_day=s.day AND bl.is_void=0) AS billed
       FROM stock_days s JOIN fish_items f ON f.id=s.fish_id
       WHERE s.branch_id=? AND s.day=? AND s.price_per_kg>0 AND f.is_active=1
       ORDER BY f.sort_order, f.id`,
      [b[0].id, todayIST()],
    );
    const fish: LiveFish[] = r.map((x) => {
      const left = x.closing_kg === null ? Number(x.opening_kg) + Number(x.added_kg) - Number(x.wastage) - Number(x.billed) : Number(x.closing_kg);
      return {
        slug: x.slug,
        nameMr: x.name_mr,
        nameEn: x.name_en,
        image: SPECIES_LIST.find((sp) => sp.slug === x.slug)?.image ?? null,
        pricePerKg: Number(x.price_per_kg),
        available: !x.sold_out && left > 0,
      };
    });
    const latest = r.map((x) => new Date(x.updated_at).getTime()).sort((a, c) => c - a)[0];
    return {
      whatsapp: String(b[0].whatsapp || "").replace(/[^0-9]/g, ""),
      isActive: !!b[0].is_active,
      fish,
      updatedAt: latest ? new Date(latest).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }) : null,
    };
  } catch {
    return null;
  }
}

/** slug → WhatsApp digits for every active branch that has its own number in the database. */
export async function getBranchWhatsappMap(): Promise<Record<string, string>> {
  try {
    const [r] = await db().query<RowDataPacket[]>("SELECT slug, whatsapp FROM branches WHERE is_active=1 AND whatsapp<>''");
    return Object.fromEntries(r.map((x) => [x.slug as string, String(x.whatsapp).replace(/[^0-9]/g, "")]));
  } catch {
    return {};
  }
}
