import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession, todayIST } from "@/lib/adminAuth";
import { getBranchSettings } from "@/lib/branchSettings";
import type { BillData } from "@/lib/pos";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ branch?: string }> }) {
  const s = await requireSession();
  const sp = await searchParams;
  const isHead = s.role === "abnexa" || s.role === "super_admin";
  const [branches] = await db().query<RowDataPacket[]>(isHead ? "SELECT id, name, address, whatsapp FROM branches ORDER BY id" : "SELECT id, name, address, whatsapp FROM branches WHERE id=?", isHead ? [] : [s.branchId ?? 0]);
  const chosen = isHead && /^\d+$/.test(sp.branch ?? "") ? Number(sp.branch) : null;
  const b = branches.find((x) => x.id === chosen) ?? branches[0];
  if (!b) return <p className="p-10 text-center text-[#7A8794]">शाखा सापडली नाही.</p>;

  const settings = await getBranchSettings(b.id);
  const short = (n: string) => n.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "");
  const now = new Date();
  // Clearly a sample: fixed made-up numbers, only used to show how a bill will look.
  const sample: BillData = {
    id: 0, branchId: b.id, billNo: 1, day: todayIST(), time: now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }),
    branchName: short(String(b.name)), branchAddress: b.address, branchPhone: b.whatsapp,
    items: [{ name: "नमुना मासा (टेस्ट)", qty: 1.25, rate: 100, amount: 125, cut: "कालवण कट" }, { name: "नमुना मासा २ (टेस्ट)", qty: 0.5, rate: 200, amount: 100, cut: null }],
    subtotal: 225, discount: 25, total: 200, mode: "cash", customerName: null, customerPhone: null, isVoid: false, voidReason: null,
  };
  const base = await adminHref("/settings");

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">बिलिंग सेटिंग्ज</h1>
        <p className="text-sm text-[#7A8794]">{short(String(b.name))} · थर्मल प्रिंटरचा कागद, आपोआप प्रिंट आणि बिलावरचा मजकूर, सगळे एकाच ठिकाणी</p>
      </div>
      {isHead && (
        <div className="flex flex-wrap gap-2 print:hidden">
          {branches.map((x) => <Link key={x.id} href={`${base}?branch=${x.id}`} className={`rounded-full px-3.5 py-2 text-sm font-bold ${x.id === b.id ? "bg-[#071D2B] text-white" : "bg-white ring-1 ring-[#172B3A]/12"}`}>{short(String(x.name))}</Link>)}
        </div>
      )}
      <SettingsForm key={b.id} branchId={b.id} initial={settings} sample={sample} />
    </div>
  );
}
