import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { adminHref, requireAnySession } from "@/lib/adminAuth";
import { logoutAction } from "../login/actions";
import { AdminShell, type NavGroup } from "./AdminShell";

// Every page inside (panel) requires a valid session.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAnySession();
  const isCounter = s.role === "counter";
  const isBranch = s.role === "branch_admin";
  const [c] = isCounter ? [[{ n: 0 }] as RowDataPacket[]] : await db().query<RowDataPacket[]>(
    isBranch ? "SELECT COUNT(*) n FROM orders WHERE status='new' AND branch_id=?" : "SELECT COUNT(*) n FROM orders WHERE status='new'",
    isBranch ? [s.branchId ?? 0] : [],
  );
  const newOrders = Number(c[0]?.n ?? 0);
  const [home, orders, accounts, wastage, ledger, reports, branchesHref, pos, bills, summary] = await Promise.all([adminHref("/"), adminHref("/orders"), adminHref("/accounts"), adminHref("/wastage"), adminHref("/ledger"), adminHref("/reports"), adminHref("/branches"), adminHref("/pos"), adminHref("/bills"), adminHref("/stock-summary")]);
  const inv: NavGroup = { title: "स्टॉक", items: [
    { href: wastage, label: "वाया गेलेला माल", icon: "wastage", match: "/wastage" },
    { href: ledger, label: "स्टॉक नोंदवही", icon: "ledger", match: "/ledger" },
  ] };

  const groups: NavGroup[] = isCounter
    ? [{ title: "काउंटर", items: [
        { href: pos, label: "बिलिंग", icon: "pos", match: "/pos" },
        { href: summary, label: "शिल्लक स्टॉक", icon: "summary", match: "/stock-summary" },
        { href: bills, label: "आजची बिले", icon: "bills", match: "/bills" },
      ] }]
    : isBranch
    ? [{ title: "दैनंदिन काम", items: [
        { href: pos, label: "बिलिंग (काउंटर)", icon: "pos", match: "/pos" },
        { href: home, label: "आजचा स्टॉक", icon: "stock", match: "/" },
        { href: summary, label: "शिल्लक स्टॉक", icon: "summary", match: "/stock-summary" },
        { href: orders, label: "ऑर्डर्स", icon: "orders", badge: newOrders, match: "/orders" },
        { href: bills, label: "बिले", icon: "bills", match: "/bills" },
        { href: reports, label: "रिपोर्ट्स", icon: "reports", match: "/reports" },
      ] }, inv]
    : [
        { title: "व्यवसाय", items: [
          { href: home, label: "डॅशबोर्ड", icon: "dashboard", match: "/" },
          { href: branchesHref, label: "शाखा", icon: "branches", match: "/branches" },
          { href: orders, label: "ऑर्डर्स", icon: "orders", badge: newOrders, match: "/orders" },
          { href: summary, label: "शिल्लक स्टॉक", icon: "summary", match: "/stock-summary" },
          { href: bills, label: "बिले", icon: "bills", match: "/bills" },
          { href: reports, label: "रिपोर्ट्स", icon: "reports", match: "/reports" },
        ] },
        inv,
        ...(s.role === "abnexa" ? [{ title: "प्रणाली", items: [{ href: accounts, label: "खाती", icon: "accounts" as const, match: "/accounts" }] }] : []),
      ];

  const roleLabel = s.role === "abnexa" ? "Abnexa" : s.role === "super_admin" ? "सुपर अ‍ॅडमिन" : isCounter ? "काउंटर" : "शाखा अ‍ॅडमिन";
  return (
    <AdminShell groups={groups} roleLabel={roleLabel} userName={s.name} homeHref={home} onLogout={logoutAction}>
      {children}
    </AdminShell>
  );
}
