import "server-only";

/** "YYYY-MM" for a date as seen in India. */
export function monthIST(d: Date = new Date()): string {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).slice(0, 7);
}

/** All months from the branch's start month up to the current month, oldest first (max 24). */
export function monthsSince(start: Date): string[] {
  const out: string[] = [];
  const cur = monthIST();
  let [y, m] = monthIST(start).split("-").map(Number);
  while (`${y}-${String(m).padStart(2, "0")}` <= cur && out.length < 24) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    if (++m > 12) { m = 1; y++; }
  }
  return out;
}
