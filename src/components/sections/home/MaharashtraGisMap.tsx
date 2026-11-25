"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Anchor,
  ChevronDown,
  Crown,
  Expand,
  Layers,
  LocateFixed,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  PanelLeftClose,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Shrink,
  Store,
  Tag,
  Waypoints,
  X,
} from "lucide-react";
import { BRANCHES_LIST } from "@/data/branches";
import { BRANCH_GEO } from "@/data/branchGeo";
import { DISTRICTS, MAP_BOUNDS, projectLonLat } from "@/data/maharashtraMap";
import type { Branch } from "@/types";

/* -------------------------------------------------------------------------- */
/*  Static geometry helpers (computed once)                                    */
/* -------------------------------------------------------------------------- */

const W = MAP_BOUNDS.width;
const H = MAP_BOUNDS.height;
const CX = W / 2;
const CY = H / 2;
const MIN_K = 1;
const MAX_K = 14;

type Kind = "hq" | "store" | "port";
interface Loc {
  b: Branch;
  kind: Kind;
  x: number;
  y: number;
  districtId: string;
}

const LOCS: Loc[] = BRANCHES_LIST.filter((b) => BRANCH_GEO[b.slug]).map((b) => {
  const g = BRANCH_GEO[b.slug];
  const { x, y } = projectLonLat(g.lng, g.lat);
  const first = (b.districtEn || "").split(/[\s.]/)[0].toLowerCase();
  return { b, kind: (b.type as Kind) || "store", x, y, districtId: first };
});

const DISTRICT_BBOX: Record<string, [number, number, number, number]> = {};
for (const d of DISTRICTS) {
  const nums = d.d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]);
    maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]);
    maxY = Math.max(maxY, nums[i + 1]);
  }
  DISTRICT_BBOX[d.id] = [minX, minY, maxX, maxY];
}

const COLORS = {
  bg: "#061525",
  panel: "#0B1D30",
  card: "#10263B",
  gold: "#F5B82E",
  cyan: "#22B8E6",
  green: "#10B981",
  border: "rgba(255,255,255,0.08)",
  text: "#F8FAFC",
  muted: "#94A3B8",
};

type LayerId = "sand" | "dusk" | "mono";
const LAYERS: Record<LayerId, { from: string; to: string; stroke: string; labelEn: string; labelMr: string }> = {
  sand: { from: "#E9C88B", to: "#D98A68", stroke: "rgba(255,246,228,0.6)", labelEn: "Terrain", labelMr: "भूप्रदेश" },
  dusk: { from: "#5F7FA3", to: "#35537A", stroke: "rgba(214,228,245,0.45)", labelEn: "Dusk", labelMr: "संधिप्रकाश" },
  mono: { from: "#C9D2DC", to: "#9AA7B6", stroke: "rgba(6,21,37,0.35)", labelEn: "Mono", labelMr: "मोनो" },
};

interface View {
  k: number;
  x: number;
  y: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
function clampView(v: View): View {
  const k = clamp(v.k, MIN_K, MAX_K);
  return {
    k,
    x: clamp(v.x, -W * k + W * 0.25, W * 0.75),
    y: clamp(v.y, -H * k + H * 0.25, H * 0.75),
  };
}

function IconBtn({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className={`grid size-10 place-items-center rounded-xl border transition-colors cursor-pointer ${
      active
        ? "border-[#F5B82E]/50 bg-[#F5B82E]/15 text-[#F5B82E]"
        : "border-white/10 bg-[#0B1D30]/90 text-[#CBD5E1] hover:bg-[#10263B] hover:text-white"
    }`}
  >
    {children}
  </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function MaharashtraGisMap({ whatsappBySlug = {} }: { whatsappBySlug?: Record<string, string> }) {
  const locale = useLocale();
  const reduce = useReducedMotion();
  const isMr = locale === "mr" || locale === "hi";
  const t = (mr: string, en: string, hi?: string) => (locale === "mr" ? mr : locale === "hi" ? hi ?? mr : en);
  const nameOf = (b: Branch) => (isMr ? b.nameMr : b.nameEn);
  const distOf = (b: Branch) => (isMr ? b.districtMr : b.districtEn);
  // Display name without the brand prefix, keeping the locality in brackets, e.g. "Satara (Guruwar Peth)"
  const shortName = (b: Branch) => {
    const n = isMr ? b.villageNameMr || b.nameMr : b.nameEn.replace(/^AN Fish World\s*[—-]\s*/i, "");
    return n.length > 26 ? `${n.slice(0, 25)}…` : n;
  };

  // ---- state
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [view, setViewState] = useState<View>({ k: 1, x: 0, y: 0 });
  const viewRef = useRef<View>(view);
  const rafRef = useRef<number | null>(null);
  const [size, setSize] = useState({ w: 800, h: 640, s: 0.8 });
  const sizeRef = useRef(size);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hoverDistrict, setHoverDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [category, setCategory] = useState<"all" | Kind>("all");
  const [sidebarPref, setSidebarPref] = useState<boolean | null>(null); // null = responsive default (open on desktop, closed on mobile)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ hq: true, port: true, satara: true });
  const [showDistricts, setShowDistricts] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [layer, setLayer] = useState<LayerId>("sand");
  const [layerMenu, setLayerMenu] = useState(false);
  const [legendPref, setLegendPref] = useState<boolean | null>(null);
  const [isFs, setIsFs] = useState(false);
  const [hint, setHint] = useState(false);

  const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
  const sidebarVisibleClass =
    sidebarPref === null
      ? "-translate-x-full lg:translate-x-0 lg:w-[310px]"
      : sidebarPref
      ? "translate-x-0 lg:w-[310px]"
      : "-translate-x-full lg:w-0 lg:translate-x-0 lg:border-r-0";

  // ---- view control (rAF tween so markers & map stay in lock-step)
  const commit = useCallback((v: View) => {
    viewRef.current = v;
    setViewState(v);
  }, []);

  const animateTo = useCallback(
    (target: View) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const to = clampView(target);
      if (reduce) return commit(to);
      const from = viewRef.current;
      const t0 = performance.now();
      const dur = 560;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        commit({ k: from.k + (to.k - from.k) * e, x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
        if (p < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [commit, reduce]
  );

  useEffect(() => () => void (rafRef.current && cancelAnimationFrame(rafRef.current)), []);

  // When the details panel will open, shift the focus point into the part of the map that stays visible
  // (left of the 360px drawer on desktop, above the bottom sheet on mobile).
  const panelOffset = useCallback((withPanel: boolean) => {
    if (!withPanel) return { ox: 0, oy: 0 };
    const { s, h } = sizeRef.current;
    return window.matchMedia("(min-width: 1024px)").matches
      ? { ox: 188 / s, oy: 0 }
      : { ox: 0, oy: (h * 0.3) / s };
  }, []);

  const focusBox = useCallback(
    (minX: number, minY: number, maxX: number, maxY: number, maxK = 9, withPanel = true) => {
      const vw = Math.max(maxX - minX, 24);
      const vh = Math.max(maxY - minY, 24);
      const { ox, oy } = panelOffset(withPanel);
      const k = clamp(Math.min((W - ox * 2) / (vw * 1.7), (H - oy * 2) / (vh * 1.7)), MIN_K, maxK);
      animateTo({ k, x: CX - ((minX + maxX) / 2) * k - ox, y: CY - ((minY + maxY) / 2) * k - oy });
    },
    [animateTo, panelOffset]
  );

  const focusPoint = useCallback(
    (x: number, y: number, k = 7) => {
      const { ox, oy } = panelOffset(true);
      animateTo({ k, x: CX - x * k - ox, y: CY - y * k - oy });
    },
    [animateTo, panelOffset]
  );

  const zoomBy = (f: number) => {
    const v = viewRef.current;
    const k = clamp(v.k * f, MIN_K, MAX_K);
    animateTo({ k, x: CX - ((CX - v.x) * k) / v.k, y: CY - ((CY - v.y) * k) / v.k });
  };
  const resetView = () => {
    setSelectedDistrict(null);
    animateTo({ k: 1, x: 0, y: 0 });
  };

  // ---- measure stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const next = { w: r.width, h: r.height, s: Math.min(r.width / W, r.height / H) };
      sizeRef.current = next;
      setSize(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void shellRef.current?.requestFullscreen?.();
  };

  // ---- pointer interaction: drag to pan, pinch to zoom, ctrl/⌘ + wheel to zoom
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ moved: number; startView: View; sx: number; sy: number } | null>(null);
  const pinchRef = useRef<{ d: number; k: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (pointers.current.size === 1) {
      dragRef.current = { moved: 0, startView: viewRef.current, sx: e.clientX, sy: e.clientY };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: viewRef.current.k };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // floating district tooltip follows the cursor without re-rendering
    if (tipRef.current && stageRef.current) {
      const r = stageRef.current.getBoundingClientRect();
      tipRef.current.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`;
    }
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const v = viewRef.current;
      const k = clamp((pinchRef.current.k * d) / pinchRef.current.d, MIN_K, MAX_K);
      commit(clampView({ k, x: CX - ((CX - v.x) * k) / v.k, y: CY - ((CY - v.y) * k) / v.k }));
      if (dragRef.current) dragRef.current.moved = 99;
      return;
    }
    const d = dragRef.current;
    if (!d || pointers.current.size !== 1) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    if (d.moved > 4 && (viewRef.current.k > 1.02 || e.pointerType === "mouse")) {
      commit(clampView({ k: d.startView.k, x: d.startView.x + dx / size.s, y: d.startView.y + dy / size.s }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) setTimeout(() => (dragRef.current = null), 0);
  };

  const wasDrag = () => (dragRef.current?.moved ?? 0) > 5;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) {
        setHint(true);
        window.clearTimeout((onWheel as unknown as { t?: number }).t);
        (onWheel as unknown as { t?: number }).t = window.setTimeout(() => setHint(false), 1400);
        return; // let the page scroll normally
      }
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const cu = (e.clientX - r.left - r.width / 2) / size.s + CX;
      const cv = (e.clientY - r.top - r.height / 2) / size.s + CY;
      const v = viewRef.current;
      const k = clamp(v.k * Math.exp(-e.deltaY * 0.0022), MIN_K, MAX_K);
      commit(clampView({ k, x: cu - ((cu - v.x) * k) / v.k, y: cv - ((cv - v.y) * k) / v.k }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [commit, size.s]);

  // ---- selection helpers
  const selectLoc = useCallback(
    (id: string, zoom = true) => {
      const l = LOCS.find((x) => x.b.id === id);
      if (!l) return;
      setSelectedId(id);
      setSelectedDistrict(null);
      if (zoom) focusPoint(l.x, l.y, l.kind === "port" ? 4 : 4.6);
    },
    [focusPoint]
  );

  const selectDistrict = (id: string) => {
    setSelectedDistrict(id);
    setSelectedId(null);
    const [a, b, c, d] = DISTRICT_BBOX[id];
    focusBox(a, b, c, d, 6);
  };

  const closePanel = () => {
    setSelectedId(null);
    setSelectedDistrict(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (selectedId || selectedDistrict)) closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, selectedDistrict]);

  // ---- derived data
  const q = query.trim().toLowerCase();
  const matches = (l: Loc) =>
    !q ||
    [l.b.nameEn, l.b.nameMr, l.b.districtEn, l.b.districtMr, l.b.villageNameMr, l.b.slug]
      .filter(Boolean)
      .some((s) => String(s).toLowerCase().includes(q));

  const visibleLocs = useMemo(
    () => LOCS.filter((l) => (category === "all" || l.kind === category) && matches(l)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, q]
  );

  const counts = useMemo(
    () => ({
      all: LOCS.length,
      hq: LOCS.filter((l) => l.kind === "hq").length,
      store: LOCS.filter((l) => l.kind === "store").length,
      port: LOCS.filter((l) => l.kind === "port").length,
    }),
    []
  );

  const suggestions = useMemo(() => (q ? LOCS.filter(matches).slice(0, 6) : []), // eslint-disable-next-line react-hooks/exhaustive-deps
    [q]);

  const groups = useMemo(() => {
    const out: { key: string; title: string; items: Loc[] }[] = [];
    const hq = visibleLocs.filter((l) => l.kind === "hq");
    if (hq.length) out.push({ key: "hq", title: t("मुख्य केंद्र (HQ)", "Headquarters", "मुख्य केंद्र (HQ)"), items: hq });
    const byDistrict = new Map<string, Loc[]>();
    for (const l of visibleLocs.filter((x) => x.kind === "store")) {
      byDistrict.set(l.districtId, [...(byDistrict.get(l.districtId) ?? []), l]);
    }
    const order = ["satara", "sangli", "kolhapur", "pune", "solapur"];
    [...byDistrict.entries()]
      .sort((a, b) => (order.indexOf(a[0]) + 99) % 99 - (order.indexOf(b[0]) + 99) % 99)
      .forEach(([id, items]) => {
        const d = DISTRICTS.find((x) => x.id === id);
        out.push({ key: id, title: d ? (isMr ? d.mr : d.en) : id, items });
      });
    const ports = visibleLocs.filter((l) => l.kind === "port");
    if (ports.length) out.push({ key: "port", title: t("सागरी बंदरे", "Ports", "सागरी बंदरगाह"), items: ports });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLocs, locale]);

  const selected = selectedId ? LOCS.find((l) => l.b.id === selectedId) ?? null : null;
  const activeDistrict = selectedDistrict ? DISTRICTS.find((d) => d.id === selectedDistrict) ?? null : null;
  const districtLocs = activeDistrict ? LOCS.filter((l) => l.districtId === activeDistrict.id) : [];
  const panelOpen = !!(selected || activeDistrict);

  // ---- screen-space layout: clusters + collision-free labels
  const px = (l: { x: number; y: number }) => ({
    X: view.x + l.x * view.k,
    Y: view.y + l.y * view.k,
  });
  const toScreen = (X: number, Y: number) => ({
    sx: (X - CX) * size.s + size.w / 2,
    sy: (Y - CY) * size.s + size.h / 2,
  });

  const layout = useMemo(() => {
    type Item = { id: string; kind: Kind | "cluster"; x: number; y: number; members: Loc[]; label: string; dim: boolean };
    const singles: Item[] = [];
    const stores: Loc[] = [];
    for (const l of visibleLocs) {
      if (l.kind === "store" && l.b.id !== selectedId) stores.push(l);
      else singles.push({ id: l.b.id, kind: l.kind, x: l.x, y: l.y, members: [l], label: shortName(l.b), dim: false });
    }
    // greedy clustering of stores in screen space
    const R = 17 / (view.k * size.s); // 17 px in map units
    const used = new Set<string>();
    const items: Item[] = [...singles];
    for (const s of stores) {
      if (used.has(s.b.id)) continue;
      const group = stores.filter((o) => !used.has(o.b.id) && Math.hypot(o.x - s.x, o.y - s.y) < R);
      group.forEach((g) => used.add(g.b.id));
      if (group.length === 1) {
        items.push({ id: s.b.id, kind: "store", x: s.x, y: s.y, members: group, label: shortName(s.b), dim: false });
      } else {
        const mx = group.reduce((a, g) => a + g.x, 0) / group.length;
        const my = group.reduce((a, g) => a + g.y, 0) / group.length;
        items.push({ id: `c-${s.b.id}`, kind: "cluster", x: mx, y: my, members: group, label: "", dim: false });
      }
    }
    if (activeDistrict) items.forEach((i) => (i.dim = !i.members.some((m) => m.districtId === activeDistrict.id)));

    // label placement (greedy, priority ordered, 4 candidate sides, collision vs. markers + labels)
    const prio = (i: Item) =>
      i.id === selectedId ? 0 : i.id === hoverId ? 1 : i.kind === "hq" ? 2 : i.kind === "port" ? 3 : 4;
    const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const pts = items.map((i) => {
      const X = view.x + i.x * view.k;
      const Y = view.y + i.y * view.k;
      return { i, sx: (X - CX) * size.s + size.w / 2, sy: (Y - CY) * size.s + size.h / 2 };
    });
    pts.forEach(({ sx, sy }) => placed.push({ x0: sx - 13, y0: sy - 13, x1: sx + 13, y1: sy + 13 }));
    const labels: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle"; w: number }> = {};
    if (showLabels) {
      [...pts]
        .filter(({ i }) => i.kind !== "cluster")
        .sort((a, b) => prio(a.i) - prio(b.i))
        .forEach(({ i, sx, sy }) => {
          const must = prio(i) <= 3;
          if (!must && view.k < 2.4) return;
          const w = i.label.length * (isMr ? 7.4 : 6.6) + 14;
          const h = 20;
          const cands = [
            { dx: 15, dy: 0, a: "start" as const, r: [sx + 13, sy - h / 2, sx + 13 + w, sy + h / 2] },
            { dx: -15, dy: 0, a: "end" as const, r: [sx - 13 - w, sy - h / 2, sx - 13, sy + h / 2] },
            { dx: 0, dy: -24, a: "middle" as const, r: [sx - w / 2, sy - 24 - h / 2, sx + w / 2, sy - 24 + h / 2] },
            { dx: 0, dy: 26, a: "middle" as const, r: [sx - w / 2, sy + 26 - h / 2, sx + w / 2, sy + 26 + h / 2] },
          ];
          for (const c of cands) {
            const [x0, y0, x1, y1] = c.r;
            const hit = placed.some((p) => x0 < p.x1 && x1 > p.x0 && y0 < p.y1 && y1 > p.y0);
            const inside = x0 > 4 && x1 < size.w - 4 && y0 > 4 && y1 < size.h - 4;
            if (!hit && inside) {
              labels[i.id] = { dx: c.dx, dy: c.dy, anchor: c.a, w };
              placed.push({ x0, y0, x1, y1 });
              return;
            }
          }
        });
    }
    return { items, labels };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLocs, view, size, selectedId, hoverId, showLabels, activeDistrict, locale]);

  const fill = LAYERS[layer];
  const hovered = hoverId ? LOCS.find((l) => l.b.id === hoverId) : null;
  const hoveredDist = hoverDistrict ? DISTRICTS.find((d) => d.id === hoverDistrict) : null;
  const hq = LOCS.find((l) => l.kind === "hq");

  const kindMeta = (k: Kind) =>
    k === "hq"
      ? { c: COLORS.gold, label: t("मुख्य केंद्र (HQ)", "Headquarters", "मुख्य केंद्र (HQ)"), Icon: Crown }
      : k === "port"
      ? { c: COLORS.green, label: t("सागरी बंदर", "Sea Port", "सागरी बंदरगाह"), Icon: Anchor }
      : { c: COLORS.cyan, label: t("अधिकृत दालन", "Authorized Store", "अधिकृत शाखा"), Icon: Store };

  const waLink = (b: Branch) =>
    `https://wa.me/${(whatsappBySlug[b.slug] || b.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      t(
        `नमस्कार, मला ${b.nameMr} येथील आजच्या ताज्या आवकची माहिती हवी आहे.`,
        `Hello, I would like to know today's fresh catch at ${b.nameEn}.`,
        `नमस्ते, मुझे ${b.nameMr} की आज की ताजी आवक की जानकारी चाहिए।`
      )
    )}`;

  /* ------------------------------------------------------------------------ */
  /*  Render                                                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      ref={shellRef}
      className={`relative flex flex-col overflow-hidden rounded-[1.25rem] border border-white/10 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] ${
        isFs ? "h-screen rounded-none" : ""
      }`}
      style={{ background: COLORS.bg, color: COLORS.text }}
    >
      {/* ------------------------------ TOP BAR ------------------------------ */}
      <div
        className="relative z-30 flex flex-wrap items-center gap-3 border-b px-3 py-2.5 sm:px-4"
        style={{ background: COLORS.panel, borderColor: COLORS.border }}
      >
        <button
          type="button"
          onClick={() => setSidebarPref(!(sidebarPref ?? isDesktop()))}
          aria-label={t("स्थान यादी", "Toggle location list", "स्थान सूची")}
          aria-expanded={sidebarPref ?? undefined}
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-[#10263B] text-[#CBD5E1] hover:text-white cursor-pointer"
        >
          <PanelLeftClose className="size-5" />
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-0.5">
            <Image src="/brand/an-fish-logo-badge.webp" alt="AN Fish World" width={36} height={36} className="size-full object-contain" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-marathi-display text-sm font-bold sm:text-base">
              {t("महाराष्ट्र दालन नेटवर्क नकाशा", "Maharashtra Store Network Map", "महाराष्ट्र शाखा नेटवर्क नकशा")}
            </p>
            <p className="truncate text-[0.7rem] sm:text-xs" style={{ color: COLORS.muted }}>
              {t("GIS स्थान नकाशा", "GIS Location Dashboard", "GIS लोकेशन नकशा")} · {counts.all}{" "}
              {t("स्थाने", "locations", "स्थान")}
            </p>
          </div>
        </div>

        {/* search with autocomplete */}
        <div className="relative ml-auto w-full sm:w-72 lg:w-80 order-last sm:order-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions[0]) {
                selectLoc(suggestions[0].b.id);
                setSearchFocus(false);
              }
            }}
            placeholder={t("दालन / गाव / जिल्हा शोधा…", "Search store, town or district…", "शाखा / शहर / जिला खोजें…")}
            aria-label={t("स्थान शोधा", "Search locations", "स्थान खोजें")}
            role="combobox"
            aria-expanded={searchFocus && suggestions.length > 0}
            aria-controls="gis-suggestions"
            aria-autocomplete="list"
            className="h-10 w-full rounded-xl border border-white/10 bg-[#10263B] pl-9 pr-9 text-sm text-white placeholder:text-[#64748B] focus:border-[#22B8E6]/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-[#94A3B8] hover:text-white cursor-pointer"
              style={{ minHeight: 0 }}
            >
              <X className="size-4" />
            </button>
          )}
          <AnimatePresence>
            {searchFocus && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 top-12 z-40 overflow-hidden rounded-xl border border-white/10 bg-[#0B1D30] shadow-2xl"
                role="listbox"
                id="gis-suggestions"
              >
                {suggestions.map((l) => {
                  const m = kindMeta(l.kind);
                  return (
                    <li key={l.b.id} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onMouseDown={() => {
                          selectLoc(l.b.id);
                          setSearchFocus(false);
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-[#10263B] cursor-pointer"
                      >
                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: m.c }} />
                        <span className="min-w-0 flex-1 truncate">{shortName(l.b)}</span>
                        <span className="shrink-0 text-xs" style={{ color: COLORS.muted }}>
                          {distOf(l.b)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ------------------------------ BODY ------------------------------ */}
      <div className={`relative flex min-h-0 ${isFs ? "flex-1" : "h-[72vh] min-h-[480px] flex-none lg:h-[720px]"}`}>
        {/* ---------------------------- SIDEBAR ---------------------------- */}
        <aside
          aria-label={t("स्थान एक्सप्लोरर", "Location explorer", "लोकेशन एक्सप्लोरर")}
          className={`absolute inset-y-0 left-0 z-20 flex w-[86%] max-w-[340px] flex-col border-r transition-[transform,width] duration-300 lg:static lg:max-w-none ${
            sidebarVisibleClass
          }`}
          style={{ background: COLORS.panel, borderColor: COLORS.border, overflow: "hidden" }}
        >
          <div className="flex min-w-[260px] flex-1 flex-col lg:min-w-[310px]">
            {/* overview */}
            <div className="grid grid-cols-3 gap-2 p-3">
              {[
                { k: "all" as const, label: t("सर्व", "All", "सभी"), n: counts.all, c: COLORS.text },
                { k: "store" as const, label: t("दालने", "Stores", "शाखाएं"), n: counts.store + counts.hq, c: COLORS.cyan },
                { k: "port" as const, label: t("बंदरे", "Ports", "बंदरगाह"), n: counts.port, c: COLORS.green },
              ].map((c) => {
                const active = category === c.k || (c.k === "store" && category === "hq");
                return (
                  <button
                    key={c.k}
                    type="button"
                    onClick={() => setCategory(c.k === "store" ? "all" : c.k)}
                    aria-pressed={category === c.k}
                    className={`rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer ${
                      category === c.k ? "border-white/25 bg-[#10263B]" : "border-white/5 bg-[#0D2236] hover:bg-[#10263B]"
                    }`}
                    style={{ minHeight: 0 }}
                  >
                    <span className="block text-lg font-extrabold leading-none" style={{ color: c.c }}>
                      {c.n}
                    </span>
                    <span className="mt-1 block text-[0.68rem] font-medium" style={{ color: active ? COLORS.text : COLORS.muted }}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* groups */}
            <div className="flex-1 overflow-y-auto px-2 pb-3 [scrollbar-width:thin]">
              {groups.length === 0 && (
                <p className="px-3 py-8 text-center text-sm" style={{ color: COLORS.muted }}>
                  {t("कोणतेही स्थान सापडले नाही.", "No locations found.", "कोई स्थान नहीं मिला।")}
                </p>
              )}
              {groups.map((g) => {
                const open = q ? true : openGroups[g.key] ?? false;
                return (
                  <div key={g.key} className="mb-1">
                    <button
                      type="button"
                      onClick={() => setOpenGroups((s) => ({ ...s, [g.key]: !open }))}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white/5 cursor-pointer"
                      style={{ color: COLORS.muted, minHeight: 0 }}
                    >
                      <span>{g.title}</span>
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-white">{g.items.length}</span>
                        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          {g.items.map((l) => {
                            const m = kindMeta(l.kind);
                            const active = l.b.id === selectedId;
                            return (
                              <li key={l.b.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    selectLoc(l.b.id);
                                    if (!isDesktop()) setSidebarPref(false);
                                  }}
                                  onMouseEnter={() => setHoverId(l.b.id)}
                                  onMouseLeave={() => setHoverId(null)}
                                  aria-current={active}
                                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                                    active ? "bg-[#F5B82E]/12 ring-1 ring-[#F5B82E]/40" : "hover:bg-white/5"
                                  }`}
                                  style={{ minHeight: 0 }}
                                >
                                  <span
                                    className="grid size-7 shrink-0 place-items-center rounded-full"
                                    style={{ background: `${m.c}22`, color: m.c }}
                                  >
                                    <m.Icon className="size-3.5" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold">{shortName(l.b)}</span>
                                    <span className="block truncate text-xs" style={{ color: COLORS.muted }}>
                                      {distOf(l.b)}
                                    </span>
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ----------------------------- MAP STAGE ----------------------------- */}
        <div
          ref={stageRef}
          className="relative min-w-0 flex-1 cursor-grab select-none overflow-hidden active:cursor-grabbing"
          style={{
            background: `radial-gradient(80% 70% at 62% 45%, #0C2238 0%, ${COLORS.bg} 70%)`,
            touchAction: view.k > 1.02 ? "none" : "pan-y",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => setHoverDistrict(null)}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 size-full"
            role="img"
            aria-label={t("महाराष्ट्र जिल्हा नकाशा", "Maharashtra district map", "महाराष्ट्र जिला नकशा")}
          >
            <defs>
              <linearGradient id="gis-fill" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor={fill.from} />
                <stop offset="100%" stopColor={fill.to} />
              </linearGradient>
            </defs>

            <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
              {/* Arabian Sea caption */}
              <text
                x={40}
                y={H * 0.74}
                fill="#5A7A9A"
                fontSize={15}
                letterSpacing={locale === "en" ? 6 : 0}
                opacity={0.55}
                transform={`rotate(-90 40 ${H * 0.74})`}
                style={{ pointerEvents: "none" }}
              >
                {t("अरबी समुद्र", "ARABIAN SEA", "अरब सागर")}
              </text>

              {/* districts */}
              {DISTRICTS.map((d) => {
                const isHover = hoverDistrict === d.id;
                const isSel = selectedDistrict === d.id;
                return (
                  <path
                    key={d.id}
                    d={d.d}
                    fill={isSel ? "#F5B82E" : isHover ? "#F2B24A" : "url(#gis-fill)"}
                    fillOpacity={isSel ? 0.85 : isHover ? 0.92 : 0.9}
                    stroke={showDistricts ? fill.stroke : "transparent"}
                    strokeWidth={showDistricts ? 1 : 0}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    style={{ transition: "fill 160ms, fill-opacity 160ms", cursor: "pointer" }}
                    onPointerEnter={() => setHoverDistrict(d.id)}
                    onPointerLeave={() => setHoverDistrict((h) => (h === d.id ? null : h))}
                    onClick={() => {
                      if (!wasDrag()) selectDistrict(d.id);
                    }}
                  />
                );
              })}
            </g>

            {/* markers (constant on-screen size, positioned from map coords) */}
            {layout.items.map((it) => {
              const { X, Y } = { X: view.x + it.x * view.k, Y: view.y + it.y * view.k };
              const lab = layout.labels[it.id];
              const sel = it.id === selectedId;
              const hov = it.id === hoverId;
              const k = it.kind;
              const meta = k === "cluster" ? null : kindMeta(k);
              const r = k === "hq" ? 13 : k === "port" ? 11 : k === "cluster" ? 14 : 8;
              const groupLabel =
                k === "cluster"
                  ? t(`${it.members.length} दालने — मोठे करा`, `${it.members.length} stores — zoom in`, `${it.members.length} शाखाएं — ज़ूम करें`)
                  : nameOf(it.members[0].b);
              const activate = () => {
                if (wasDrag()) return;
                if (k === "cluster") {
                  const xs = it.members.map((m) => m.x);
                  const ys = it.members.map((m) => m.y);
                  focusBox(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 10, false);
                } else selectLoc(it.id);
              };
              return (
                <g
                  key={it.id}
                  transform={`translate(${X} ${Y}) scale(${1 / size.s})`}
                  opacity={it.dim ? 0.3 : 1}
                  role="button"
                  tabIndex={0}
                  aria-label={groupLabel}
                  onPointerEnter={() => k !== "cluster" && setHoverId(it.id)}
                  onPointerLeave={() => setHoverId((h) => (h === it.id ? null : h))}
                  onFocus={() => k !== "cluster" && setHoverId(it.id)}
                  onBlur={() => setHoverId((h) => (h === it.id ? null : h))}
                  onClick={activate}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activate();
                    }
                  }}
                  style={{ cursor: "pointer", outline: "none", transition: "opacity 200ms" }}
                >
                  {/* scale(1/s) maps viewBox units to screen pixels: markers keep a constant on-screen size */}
                  <g>
                    {k === "hq" && !reduce && (
                      <circle r={r} fill="none" stroke={COLORS.gold} strokeWidth={2} opacity={0.7}>
                        <animate attributeName="r" values={`${r};${r + 14}`} dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {sel && <circle r={r + 7} fill="none" stroke="#fff" strokeOpacity={0.9} strokeWidth={1.5} strokeDasharray="3 3" />}
                    <circle r={hov || sel ? r + 2 : r} fill={k === "cluster" ? "#0B1D30" : meta!.c} stroke={k === "cluster" ? COLORS.cyan : "#fff"} strokeWidth={k === "cluster" ? 2 : 2.2} style={{ transition: "r 150ms" }} />
                    {k === "cluster" && (
                      <text textAnchor="middle" dy="0.35em" fontSize={12} fontWeight={800} fill="#fff" style={{ pointerEvents: "none" }}>
                        {it.members.length}
                      </text>
                    )}
                    {k === "hq" && (
                      <g transform="translate(-7 -7) scale(0.58)" fill="#061525" stroke="none" style={{ pointerEvents: "none" }}>
                        <polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.2 21 12 17.5 5.8 21 7.2 14 2 9.3 8.9 8.6" />
                      </g>
                    )}
                    {k === "port" && (
                      <g transform="translate(-6 -6) scale(0.5)" stroke="#fff" fill="none" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
                        <path d="M12 22V8" />
                        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
                        <circle cx="12" cy="5" r="3" />
                      </g>
                    )}
                    {k === "hq" && (
                      <g style={{ pointerEvents: "none" }} transform="translate(0 -26)">
                        <rect x={-15} y={-9} width={30} height={16} rx={8} fill={COLORS.gold} />
                        <text textAnchor="middle" y={3} fontSize={9.5} fontWeight={800} fill="#061525">HQ</text>
                      </g>
                    )}
                    {lab && k !== "cluster" && (
                      <g style={{ pointerEvents: "none" }}>
                        <rect
                          x={lab.anchor === "start" ? lab.dx - 4 : lab.anchor === "end" ? lab.dx - lab.w + 4 : lab.dx - lab.w / 2}
                          y={lab.dy - 10}
                          width={lab.w}
                          height={20}
                          rx={10}
                          fill="#061525"
                          fillOpacity={0.82}
                          stroke="rgba(255,255,255,0.12)"
                        />
                        <text
                          x={lab.anchor === "start" ? lab.dx + 4 : lab.anchor === "end" ? lab.dx - 4 : lab.dx}
                          y={lab.dy}
                          dy="0.35em"
                          textAnchor={lab.anchor}
                          fontSize={11}
                          fontWeight={600}
                          fill="#F8FAFC"
                        >
                          {it.members[0] ? shortName(it.members[0].b) : ""}
                        </text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>

          {/* district hover tooltip (follows cursor) */}
          <div
            ref={tipRef}
            className="pointer-events-none absolute left-0 top-0 z-20"
            style={{ transform: "translate(-999px,-999px)" }}
          >
            <AnimatePresence>
              {hoveredDist && !hovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="rounded-xl border border-white/10 bg-[#0B1D30]/95 px-3 py-2 shadow-xl backdrop-blur"
                >
                  <p className="text-sm font-bold leading-tight">{hoveredDist.mr}</p>
                  <p className="text-xs" style={{ color: COLORS.muted }}>
                    {hoveredDist.en} · {LOCS.filter((l) => l.districtId === hoveredDist.id).length}{" "}
                    {t("स्थाने", "locations", "स्थान")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* marker hover tooltip */}
          <AnimatePresence>
            {hovered && !(hovered.b.id === selectedId && panelOpen) && (() => {
              const { X, Y } = px(hovered);
              const { sx, sy } = toScreen(X, Y);
              const m = kindMeta(hovered.kind);
              return (
                <motion.div
                  key={hovered.b.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                  className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0B1D30]/95 px-3 py-2 shadow-xl backdrop-blur"
                  style={{ left: clamp(sx, 90, size.w - 90), top: clamp(sy - 62, 8, size.h - 70) }}
                >
                  <p className="max-w-[200px] truncate text-sm font-bold leading-tight">{nameOf(hovered.b)}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: COLORS.muted }}>
                    <span className="size-2 rounded-full" style={{ background: m.c }} />
                    {m.label}
                  </p>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* ctrl+scroll hint */}
          <AnimatePresence>
            {hint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 top-4 z-20 mx-auto w-fit rounded-full border border-white/10 bg-[#0B1D30]/90 px-4 py-2 text-xs"
              >
                {t("झूम करण्यासाठी Ctrl / ⌘ + स्क्रोल करा", "Use Ctrl / ⌘ + scroll to zoom", "ज़ूम के लिए Ctrl / ⌘ + स्क्रोल करें")}
              </motion.div>
            )}
          </AnimatePresence>

          {/* floating map controls */}
          <div
            className={`absolute top-4 z-20 flex flex-col gap-2 transition-[right] duration-300 ${
              panelOpen ? "right-4 lg:right-[calc(360px+1.5rem)]" : "right-4"
            }`}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconBtn label={t("मोठे करा", "Zoom in", "ज़ूम इन")} onClick={() => zoomBy(1.6)}>
              <Plus className="size-5" />
            </IconBtn>
            <IconBtn label={t("लहान करा", "Zoom out", "ज़ूम आउट")} onClick={() => zoomBy(1 / 1.6)}>
              <Minus className="size-5" />
            </IconBtn>
            <IconBtn label={t("नकाशा रीसेट", "Reset map", "नकशा रीसेट")} onClick={resetView}>
              <RotateCcw className="size-4" />
            </IconBtn>
            <div className="hidden sm:block">
              <IconBtn label={isFs ? t("पूर्ण स्क्रीन बंद", "Exit fullscreen", "फुलस्क्रीन बंद") : t("पूर्ण स्क्रीन", "Fullscreen", "फुलस्क्रीन")} onClick={toggleFs}>
                {isFs ? <Shrink className="size-4" /> : <Expand className="size-4" />}
              </IconBtn>
            </div>
            <IconBtn
              label={t("कराड HQ वर जा", "Locate HQ", "कराड HQ पर जाएं")}
              onClick={() => hq && selectLoc(hq.b.id)}
            >
              <LocateFixed className="size-5" />
            </IconBtn>
            <div className="my-0.5 hidden h-px bg-white/10 sm:block" />
            <div className="hidden sm:block">
              <IconBtn label={t("जिल्हा सीमा", "District boundaries", "जिला सीमाएं")} active={showDistricts} onClick={() => setShowDistricts((s) => !s)}>
                <Waypoints className="size-4" />
              </IconBtn>
            </div>
            <div className="hidden sm:block">
              <IconBtn label={t("नावे दाखवा", "Location labels", "नाम दिखाएं")} active={showLabels} onClick={() => setShowLabels((s) => !s)}>
                <Tag className="size-4" />
              </IconBtn>
            </div>
            <div className="relative hidden sm:block">
              <IconBtn label={t("नकाशा स्तर", "Map layer", "नकशा लेयर")} active={layerMenu} onClick={() => setLayerMenu((s) => !s)}>
                <Layers className="size-4" />
              </IconBtn>
              <AnimatePresence>
                {layerMenu && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-12 top-0 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#0B1D30] p-1 shadow-2xl"
                  >
                    {(Object.keys(LAYERS) as LayerId[]).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setLayer(id);
                          setLayerMenu(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm cursor-pointer ${
                          layer === id ? "bg-white/10 text-white" : "text-[#CBD5E1] hover:bg-white/5"
                        }`}
                        style={{ minHeight: 0 }}
                      >
                        <span
                          className="size-4 rounded"
                          style={{ background: `linear-gradient(135deg, ${LAYERS[id].from}, ${LAYERS[id].to})` }}
                        />
                        {isMr ? LAYERS[id].labelMr : LAYERS[id].labelEn}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* legend */}
          <div
            className="absolute bottom-4 left-4 z-20 rounded-2xl border border-white/10 bg-[#0B1D30]/90 shadow-xl backdrop-blur"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLegendPref(!(legendPref ?? isDesktop()))}
              aria-expanded={legendPref ?? undefined}
              className="flex w-full items-center justify-between gap-6 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              style={{ color: COLORS.muted, minHeight: 0 }}
            >
              {t("संकेत", "Legend", "संकेत")}
              <ChevronDown className="size-4" />
            </button>
            {(() => {
              const open = legendPref ?? null;
              return (
                <ul
                  className={`space-y-2 px-3.5 pb-3 text-sm ${
                    open === null ? "hidden lg:block" : open ? "block" : "hidden"
                  }`}
                >
                  {(["hq", "store", "port"] as Kind[]).map((k) => {
                    const m = kindMeta(k);
                    return (
                      <li key={k} className="flex items-center gap-2.5">
                        <span className="size-3 rounded-full ring-2 ring-white/80" style={{ background: m.c }} />
                        <span>{m.label}</span>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>

          {/* ------------------- DETAILS PANEL (drawer / bottom sheet) ------------------- */}
          <AnimatePresence>
            {panelOpen && (
              <motion.aside
                key={selected?.b.id ?? activeDistrict?.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={t("स्थान तपशील", "Location details", "स्थान विवरण")}
                className="absolute inset-x-2 bottom-2 z-30 max-h-[62%] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1D30]/97 shadow-2xl backdrop-blur-xl lg:inset-x-auto lg:bottom-4 lg:right-4 lg:top-4 lg:max-h-none lg:w-[360px]"
              >
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label={t("बंद करा", "Close", "बंद करें")}
                  className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-[#061525]/80 text-white hover:bg-[#061525] cursor-pointer"
                  style={{ minHeight: 0 }}
                >
                  <X className="size-4" />
                </button>

                {selected && (() => {
                  const b = selected.b;
                  const m = kindMeta(selected.kind);
                  return (
                    <div>
                      <div className="relative h-36 w-full overflow-hidden rounded-t-2xl">
                        <Image
                          src={b.image || "/media/gallery/karad-outlet-tour.webp"}
                          alt={nameOf(b)}
                          fill
                          sizes="360px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D30] via-[#0B1D30]/30 to-transparent" />
                        <span
                          className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold"
                          style={{ background: m.c, color: "#061525" }}
                        >
                          <m.Icon className="size-3.5" />
                          {m.label}
                        </span>
                      </div>
                      <div className="space-y-4 p-4">
                        <div>
                          <h4 className="font-marathi-display text-lg font-extrabold leading-snug">{nameOf(b)}</h4>
                          <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: COLORS.muted }}>
                            <MapPin className="size-3.5" /> {distOf(b)}
                          </p>
                        </div>
                        {(isMr ? b.taglineMr : b.taglineEn) && (
                          <p className="text-sm leading-relaxed text-[#CBD5E1]">{isMr ? b.taglineMr : b.taglineEn}</p>
                        )}
                        <dl className="space-y-2.5 rounded-xl border border-white/8 bg-[#10263B] p-3 text-sm">
                          <div>
                            <dt className="text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                              {t("पत्ता", "Address", "पता")}
                            </dt>
                            <dd className="mt-0.5 leading-snug">{isMr ? b.addressMr : b.addressEn}</dd>
                          </div>
                          <div>
                            <dt className="text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                              {t("वेळ", "Hours", "समय")}
                            </dt>
                            <dd className="mt-0.5 leading-snug">{isMr ? b.hoursMr : b.hoursEn}</dd>
                          </div>
                          <div>
                            <dt className="text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                              {t("फोन", "Phone", "फ़ोन")}
                            </dt>
                            <dd className="mt-0.5">
                              <a href={`tel:${b.phone.replace(/[^0-9+]/g, "")}`} className="font-semibold text-[#22B8E6] hover:underline">
                                {b.phone}
                              </a>
                            </dd>
                          </div>
                        </dl>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={b.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22B8E6] px-3 py-2.5 text-sm font-bold text-[#061525] hover:brightness-110"
                          >
                            <Navigation className="size-4" />
                            {t("दिशा", "Directions", "दिशा")}
                          </a>
                          <a
                            href={waLink(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-bold text-[#061525] hover:brightness-110"
                          >
                            <MessageCircle className="size-4" />
                            WhatsApp
                          </a>
                          <Link
                            href={`/${locale}/branches/${b.slug}`}
                            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-3 py-2.5 text-sm font-extrabold text-[#061525] hover:brightness-110"
                          >
                            <Store className="size-4" />
                            {t("दालन पहा", "View Store Page", "शाखा देखें")}
                          </Link>
                          <a
                            href={`tel:${b.phone.replace(/[^0-9+]/g, "")}`}
                            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold hover:bg-white/5"
                          >
                            <Phone className="size-4" />
                            {t("कॉल करा", "Call", "कॉल करें")}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {activeDistrict && !selected && (
                  <div className="p-4">
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: COLORS.gold }}>
                      {t("जिल्हा", "District", "जिला")}
                    </p>
                    <h4 className="font-marathi-display text-xl font-extrabold leading-tight">{activeDistrict.mr}</h4>
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      {activeDistrict.en}
                    </p>
                    <p className="mt-4 text-sm font-semibold">
                      {districtLocs.length > 0
                        ? t(`${districtLocs.length} स्थाने`, `${districtLocs.length} location${districtLocs.length > 1 ? "s" : ""}`, `${districtLocs.length} स्थान`)
                        : t("या जिल्ह्यात अद्याप दालन नाही.", "No AN Fish World locations in this district yet.", "इस जिले में अभी कोई शाखा नहीं है।")}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {districtLocs.map((l) => {
                        const m = kindMeta(l.kind);
                        return (
                          <li key={l.b.id}>
                            <button
                              type="button"
                              onClick={() => selectLoc(l.b.id)}
                              className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-[#10263B] px-3 py-2.5 text-left hover:bg-[#143049] cursor-pointer"
                              style={{ minHeight: 0 }}
                            >
                              <span className="size-2.5 rounded-full" style={{ background: m.c }} />
                              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{shortName(l.b)}</span>
                              <span className="text-xs" style={{ color: COLORS.muted }}>
                                {m.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
