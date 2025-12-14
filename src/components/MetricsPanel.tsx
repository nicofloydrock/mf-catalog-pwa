// Panel de métricas en vivo: consulta API mock y muestra sparklines.
import { useQuery } from "@tanstack/react-query";
import type { MetricsPayload } from "../types/metrics";
import { fetchMetrics } from "../api/metrics";
import { Skeleton } from "./ui/Skeleton";
import { ErrorBox } from "./ui/ErrorBox";
import { Sparkline } from "./metrics/Sparkline";

type Props = {
  refreshMs?: number;
  copy: {
    subtitle: string;
    title: string;
    descriptionPrefix: string;
    seriesMissing: string;
    sparkline: { lastLabel: string };
  };
};

export function MetricsPanel({ refreshMs = 6000, copy }: Props) {
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

  if (!data) return <ErrorBox message={copy.seriesMissing} />;

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            {copy.subtitle}
          </p>
          <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
          <p className="text-sm text-slate-300">
            {copy.descriptionPrefix} {refreshMs / 1000}s.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {data.series.map((serie) => (
          <Sparkline key={serie.id} series={serie} lastLabel={copy.sparkline.lastLabel} />
        ))}
      </div>
    </div>
  );
}
