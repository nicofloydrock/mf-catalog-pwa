import { useQuery } from "@tanstack/react-query";
import type { MetricsPayload, MetricSeries } from "../types/metrics";
import { fetchMetrics } from "../api/metrics";
import { Skeleton } from "./ui/Skeleton";
import { ErrorBox } from "./ui/ErrorBox";

type Props = {
  refreshMs?: number;
};

const palette: Record<string, string> = {
  Tráfico: "#22d3ee",
  Conversion: "#a855f7",
  Tickets: "#f59e0b",
};

function Sparkline({ series }: { series: MetricSeries }) {
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
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
          />
          {series.label}
        </span>
        <span className="text-xs text-slate-400">
          Último: {series.points.at(-1)?.value.toFixed(1)}
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

export function MetricsPanel({ refreshMs = 6000 }: Props) {
  const { data, isLoading, error } = useQuery<MetricsPayload>({
    queryKey: ["metrics"],
    queryFn: () => fetchMetrics(22),
    refetchInterval: refreshMs,
    staleTime: refreshMs,
  });

  if (isLoading) {
    return <Skeleton className="h-36 w-full rounded-2xl" />;
  }  

  if (error) {
    return <ErrorBox message={(error as Error).message} />;
  }

  if (!data) return null;

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Panel en vivoski (API mock)
          </p>
          <h2 className="text-xl font-semibold text-white">
            Pulso de catálogo y demanda
          </h2>
          <p className="text-sm text-slate-300">
            Datos se actualizan cada {refreshMs / 1000}s.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {data.series.map((serie) => (
          <Sparkline key={serie.id} series={serie} />
        ))}
      </div>
    </div>
  );
}
