import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireAnySession } from "@/lib/adminAuth";
import { loadPosFish } from "@/lib/pos";
import { PosTerminal } from "./PosTerminal";

export default async function PosPage() {
  const s = await requireAnySession();
  // Billing belongs to a single store: counter and branch-admin logins only.
  if ((s.role !== "counter" && s.role !== "branch_admin") || !s.branchId) redirect(await adminHref("/"));
  const [b] = await db().query<RowDataPacket[]>("SELECT name FROM branches WHERE id=?", [s.branchId]);
  const fish = await loadPosFish(s.branchId);
  return (
    <div className="mx-auto max-w-[1500px] space-y-3">
      <div className="print:hidden">
        <h1 className="text-2xl font-extrabold">बिलिंग (काउंटर)</h1>
        <p className="text-sm text-[#7A8794]">{String(b[0]?.name ?? "")} · मासा निवडा → वजन टाका → बिल बनवा → प्रिंट करा</p>
      </div>
      <PosTerminal fish={fish} />
    </div>
  );
}
