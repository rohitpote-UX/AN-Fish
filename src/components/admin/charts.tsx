/** Dependency-free SVG/CSS charts. Server-renderable; every number comes from real data. */

export function TrendChart({ data, format }: { data: { day: string; value: number }[]; format: (n: number) => string }) {
  const W = 640, H = 200, padL = 8, padB = 26, padT = 14;
  const max = Math.max(...data.map((d) => d.value), 1);
  const bw = (W - padL * 2) / Math.max(data.length, 1);
  const every = Math.ceil(data.length / 10);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Sales trend">
      {[0, 0.5, 1].map((g) => (
        <line key={g} x1={padL} x2={W - padL} y1={padT + (H - padB - padT) * (1 - g)} y2={padT + (H - padB - padT) * (1 - g)} stroke="#172B3A" strokeOpacity=".08" />
      ))}
      {data.map((d, i) => {
        const h = ((H - padB - padT) * d.value) / max;
        const x = padL + i * bw + bw * 0.18;
        const w = Math.max(bw * 0.64, 2);
        return (
          <g key={d.day}>
            <rect x={x} y={H - padB - h} width={w} height={Math.max(h, d.value > 0 ? 2 : 0)} rx={3} fill="#0EA5A0">
              <title>{`${d.day}: ${format(d.value)}`}</title>
            </rect>
            {i % every === 0 && <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#7A8794">{d.day.slice(8)}/{d.day.slice(5, 7)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function HBars({ items, format, color = "#0EA5A0" }: { items: { label: string; value: number }[]; format: (n: number) => string; color?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-bold">{i.label}</span>
            <span className="shrink-0 font-bold tabular-nums text-[#172B3A]/80">{format(i.value)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#172B3A]/8">
            <div className="h-full rounded-full" style={{ width: `${Math.max((i.value / max) * 100, i.value > 0 ? 2 : 0)}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Donut({ items, format = String }: { items: { label: string; value: number; color: string }[]; format?: (n: number) => string }) {
  const total = items.reduce((a, i) => a + i.value, 0);
  const centre = format(total);
  const R = 48, C = 2 * Math.PI * R;
  let off = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox="0 0 120 120" className="size-32 shrink-0 -rotate-90" role="img" aria-label="Order status">
        <circle cx="60" cy="60" r={R} fill="none" stroke="#172B3A" strokeOpacity=".08" strokeWidth="14" />
        {total > 0 && items.filter((i) => i.value > 0).map((i) => {
          const len = (i.value / total) * C;
          const el = <circle key={i.label} cx="60" cy="60" r={R} fill="none" stroke={i.color} strokeWidth="14" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off}><title>{`${i.label}: ${format(i.value)}`}</title></circle>;
          off += len;
          return el;
        })}
        <text x="60" y="64" textAnchor="middle" className="rotate-90" style={{ transformOrigin: "60px 60px" }} fontSize={centre.length > 6 ? 13 : centre.length > 4 ? 16 : 20} fontWeight="800" fill="#172B3A">{centre}</text>
      </svg>
      <ul className="space-y-1.5 text-sm">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ background: i.color }} /><span className="font-semibold">{i.label}</span><b className="ml-auto pl-4 tabular-nums">{format(i.value)}</b></li>
        ))}
      </ul>
    </div>
  );
}
