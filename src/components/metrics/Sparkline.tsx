// Sparkline minimal para series de métricas en catálogo.
import type { MetricSeries } from "../../types/metrics";

type Props = {
  series: MetricSeries;
  lastLabel: string;
};

const palette: Record<string, string> = {
  Tráfico: "#22d3ee",
  Conversion: "#a855f7",
  Tickets: "#f59e0b",
};

export function Sparkline({ series, lastLabel }: Props) {
  const width = 360;
  const height = 140;
  const values = series.points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const path = series.points
    .map((point, idx) => {
      const x =
        series.points.length === 1
          ? width / 2
          : (idx / (series.points.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  const color = palette[series.label] ?? "#22c55e";

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between text-sm text-slate-200">
        <span className="flex items-center gap-2 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          {series.label}
        </span>
        <span className="text-xs text-slate-400">
          {lastLabel}: {series.points.at(-1)?.value.toFixed(1)}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 w-full" role="img">
        <defs>
          <linearGradient id={`fill-${series.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#fill-${series.id})`} aria-hidden="true" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
