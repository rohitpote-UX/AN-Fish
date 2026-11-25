import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { logoutAction } from "../login/actions";

// Every page inside (panel) requires a valid session.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = await requireSession();
  const home = await adminHref("/");
  const ordersHref = await adminHref("/orders");
  const accountsHref = await adminHref("/accounts");
  const [c] = await db().query<RowDataPacket[]>(
    s.role !== "branch_admin"
      ? "SELECT COUNT(*) n FROM orders WHERE status='new'"
      : "SELECT COUNT(*) n FROM orders WHERE status='new' AND branch_id=?",
    s.role !== "branch_admin" ? [] : [s.branchId ?? 0],
  );
  const newCount = Number(c[0]?.n ?? 0);
  const navCls = "flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-bold text-white/85 hover:bg-white/10";
  return (
    <div className="min-h-screen font-[Baloo_2,sans-serif]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#071C2C] text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link href={home} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-white">
              <Image src="/brand/an-fish-logo-badge.webp" alt="" width={40} height={40} className="size-full object-contain p-0.5" />
            </span>
            <span className="hidden text-lg font-extrabold sm:block">AN FISH WORLD</span>
          </Link>
          <span className="rounded-full bg-[#0D9488]/25 px-3 py-1 text-xs font-bold text-[#5EEAD4]">
            {s.role === "abnexa" ? "Abnexa" : s.role === "super_admin" ? "सुपर अ‍ॅडमिन" : "शाखा अ‍ॅडमिन"}
          </span>
          <nav className="ml-2 flex items-center gap-1">
            <Link href={home} className={navCls}>{s.role === "branch_admin" ? "स्टॉक" : s.role === "abnexa" ? "डॅशबोर्ड" : "शाखा"}</Link>
            <Link href={ordersHref} className={navCls}>
              ऑर्डर्स
              {newCount > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-amber-400 px-1.5 text-xs font-extrabold text-[#071C2C]">{newCount}</span>}
            </Link>
            {s.role === "abnexa" && <Link href={accountsHref} className={navCls}>खाती</Link>}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden max-w-[240px] truncate text-sm text-white/70 md:block">{s.name}</span>
            <form action={logoutAction}>
              <button className="flex h-10 items-center gap-2 rounded-xl border border-white/15 px-3.5 text-sm font-bold hover:bg-white/10">
                <LogOut className="size-4" /> लॉगआउट
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
