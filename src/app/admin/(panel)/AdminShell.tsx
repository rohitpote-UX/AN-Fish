"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight, ClipboardList, KeyRound, LayoutDashboard, LogOut, Menu, PanelLeftClose, PanelLeftOpen,
  PackageCheck, BarChart3, Banknote, Boxes, Building2, Contact, Receipt, Settings, Truck, UserCog, Users, Wallet, ShoppingCart, Store, Trash2, History, X, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard, branches: Store, stock: PackageCheck, orders: ClipboardList, accounts: KeyRound, wastage: Trash2, ledger: History, reports: BarChart3, pos: ShoppingCart, bills: Receipt, summary: PackageCheck, settings: Settings, products: Boxes, users: Users, customers: Contact, expenses: Wallet, purchases: Truck, suppliers: Building2, cash: Banknote, staff: UserCog,
};

export type NavItem = { href: string; label: string; icon: keyof typeof ICONS; badge?: number; match: string };
export type NavGroup = { title: string; items: NavItem[] };

const CRUMBS: Record<string, string> = {
  dashboard: "डॅशबोर्ड", purchases: "खरेदी", suppliers: "पुरवठादार", "cash-closing": "रोख बंद करणे", staff: "कर्मचारी", products: "उत्पादने", users: "वापरकर्ते", customers: "ग्राहक", expenses: "खर्च", "stock-summary": "शिल्लक स्टॉक", settings: "बिलिंग सेटिंग्ज",
  orders: "ऑर्डर्स", pos: "बिलिंग", bills: "बिले", reports: "रिपोर्ट्स", wastage: "वाया गेलेला माल", ledger: "स्टॉक नोंदवही", branches: "शाखा", new: "नवीन शाखा", accounts: "खाती", login: "लॉगिन",
};

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
        <Image src="/brand/an-fish-logo-badge.webp" alt="AN Fish World" width={40} height={40} className="size-full object-contain p-0.5" />
      </span>
      {!collapsed && (
        <span className="leading-tight">
          <span className="block text-[15px] font-extrabold text-white">AN FISH WORLD</span>
          <span className="block text-[11px] font-semibold text-[#5EEAD4]">व्यवस्थापन पॅनेल</span>
        </span>
      )}
    </div>
  );
}

export function AdminShell({ groups, roleLabel, userName, homeHref, onLogout, children }: {
  groups: NavGroup[]; roleLabel: string; userName: string; homeHref: string;
  onLogout: () => Promise<void>; children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const path = pathname.replace(/^\/admin(?=\/|$)/, "") || "/";
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem("anf_sidebar") === "1") setCollapsed(true); } catch { /* ignore */ }
  }, []);
  useEffect(() => { setDrawer(false); setMenu(false); }, [pathname]);

  const toggle = () => {
    setCollapsed((v) => {
      try { localStorage.setItem("anf_sidebar", v ? "0" : "1"); } catch { /* ignore */ }
      return !v;
    });
  };

  const active = (i: NavItem) => (i.match === "/" ? path === "/" : path === i.match || path.startsWith(i.match + "/"));
  const segs = path.split("/").filter(Boolean);
  const crumbs = segs.map((s, i) => ({ label: CRUMBS[s] ?? (/^\d+$/.test(s) ? "तपशील" : s), last: i === segs.length - 1 }));
  const pageTitle = groups.flatMap((g) => g.items).find(active)?.label ?? crumbs.at(-1)?.label ?? "";

  const nav = (isCollapsed: boolean) => (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {groups.map((g) => (
        <div key={g.title}>
          {!isCollapsed && <p className="mb-2 px-3 text-[11px] font-bold tracking-wide text-white/40">{g.title}</p>}
          <ul className="space-y-1">
            {g.items.map((i) => {
              const Icon = ICONS[i.icon];
              const on = active(i);
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    title={isCollapsed ? i.label : undefined}
                    className={`relative flex !min-h-0 h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition ${on ? "bg-[#0EA5A0]/20 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"} ${isCollapsed ? "justify-center" : ""}`}
                  >
                    {on && <span className="absolute left-0 top-2 h-7 w-1 rounded-r bg-[#0EA5A0]" />}
                    <Icon className="size-[19px] shrink-0" />
                    {!isCollapsed && <span className="flex-1 truncate">{i.label}</span>}
                    {!!i.badge && (
                      <span className={`grid min-w-5 place-items-center rounded-full bg-amber-400 px-1.5 text-xs font-extrabold text-[#071D2B] ${isCollapsed ? "absolute right-1 top-1" : ""}`}>{i.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-[Baloo_2,sans-serif] text-[#172B3A]">
      {/* Desktop sidebar */}
      <aside className={`print:hidden fixed inset-y-0 left-0 z-30 hidden flex-col bg-[#071D2B] transition-[width] duration-200 lg:flex ${collapsed ? "w-[76px]" : "w-[256px]"}`}>
        <div className="flex h-16 items-center border-b border-white/10 px-4"><Link href={homeHref}><Brand collapsed={collapsed} /></Link></div>
        {nav(collapsed)}
        <button onClick={toggle} className="m-3 flex !min-h-0 h-10 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white/60 hover:bg-white/8 hover:text-white" aria-label="Toggle sidebar">
          {collapsed ? <PanelLeftOpen className="size-5" /> : <><PanelLeftClose className="size-5" /> लहान करा</>}
        </button>
      </aside>

      {/* Mobile drawer */}
      {drawer && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setDrawer(false)} />}
      <aside className={`print:hidden fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#071D2B] transition-transform duration-200 lg:hidden ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Brand collapsed={false} />
          <button onClick={() => setDrawer(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-lg text-white/70 hover:bg-white/10"><X className="size-5" /></button>
        </div>
        {nav(false)}
      </aside>

      <div className={`transition-[padding] duration-200 print:!pl-0 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[256px]"}`}>
        <header className="print:hidden sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#172B3A]/8 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="grid size-10 place-items-center rounded-lg hover:bg-[#172B3A]/5 lg:hidden"><Menu className="size-5" /></button>
          <ol className="flex min-w-0 items-center gap-1.5 text-sm">
            <li><Link href={homeHref} className="font-semibold text-[#7A8794] hover:text-[#0EA5A0]">मुख्य पान</Link></li>
            {crumbs.map((c, i) => (
              <li key={i} className="flex min-w-0 items-center gap-1.5">
                <ChevronRight className="size-4 shrink-0 text-[#7A8794]/60" />
                <span className={`truncate ${c.last ? "font-bold" : "font-semibold text-[#7A8794]"}`}>{c.label}</span>
              </li>
            ))}
          </ol>
          <div className="relative ml-auto">
            <button onClick={() => setMenu((v) => !v)} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-[#172B3A]/5" aria-haspopup="menu" aria-expanded={menu}>
              <span className="grid size-9 place-items-center rounded-full bg-[#071D2B] text-sm font-extrabold text-white">{userName.trim().charAt(0).toUpperCase()}</span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-[180px] truncate text-sm font-bold">{userName}</span>
                <span className="block text-[11px] font-semibold text-[#0EA5A0]">{roleLabel}</span>
              </span>
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <div role="menu" className="absolute right-0 z-20 mt-2 w-56 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-[#172B3A]/10">
                  <div className="border-b border-[#172B3A]/8 px-3 py-2.5">
                    <p className="truncate text-sm font-bold">{userName}</p>
                    <p className="text-xs font-semibold text-[#0EA5A0]">{roleLabel}</p>
                  </div>
                  <form action={onLogout}>
                    <button role="menuitem" className="mt-1 flex !min-h-0 h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#DC5252] hover:bg-[#DC5252]/8"><LogOut className="size-4" /> लॉगआउट</button>
                  </form>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 print:p-0">
          <h1 className="sr-only">{pageTitle}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
