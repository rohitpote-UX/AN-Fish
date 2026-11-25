import { todayIST } from "@/lib/adminAuth";

export type Range = { from: string; to: string; preset: string };

export const PRESETS: { id: string; label: string }[] = [
  { id: "today", label: "आज" },
  { id: "yesterday", label: "काल" },
  { id: "7d", label: "७ दिवस" },
  { id: "30d", label: "३० दिवस" },
  { id: "month", label: "या महिन्याचा" },
  { id: "lastmonth", label: "मागचा महिना" },
];

const add = (iso: string, days: number) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const isDate = (v?: string) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);

export function parseRange(sp: { from?: string; to?: string; range?: string }, fallback = "7d"): Range {
  const today = todayIST();
  if (isDate(sp.from) && isDate(sp.to) && sp.from! <= sp.to!) return { from: sp.from!, to: sp.to! > today ? today : sp.to!, preset: "custom" };
  const preset = sp.range && PRESETS.some((p) => p.id === sp.range) ? sp.range : fallback;
  const [y, m] = today.split("-").map(Number);
  switch (preset) {
    case "today": return { from: today, to: today, preset };
    case "yesterday": return { from: add(today, -1), to: add(today, -1), preset };
    case "30d": return { from: add(today, -29), to: today, preset };
    case "month": return { from: `${y}-${String(m).padStart(2, "0")}-01`, to: today, preset };
    case "lastmonth": {
      const first = new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 10);
      const last = new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10);
      return { from: first, to: last, preset };
    }
    default: return { from: add(today, -6), to: today, preset: "7d" };
  }
}

/** The period of equal length immediately before `r` (for "vs previous" comparisons). */
export function prevRange(r: Range): Range {
  const days = Math.round((Date.parse(r.to) - Date.parse(r.from)) / 86400000) + 1;
  return { from: add(r.from, -days), to: add(r.from, -1), preset: "prev" };
}

export function eachDay(r: Range): string[] {
  const out: string[] = [];
  for (let d = r.from; d <= r.to && out.length < 400; d = add(d, 1)) out.push(d);
  return out;
}

export const fmtKg = (n: number) => `${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kg`;
export const fmtInr = (n: number) => `${n < 0 ? "−" : ""}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
export const shortDay = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "2-digit", month: "short", timeZone: "UTC" });
