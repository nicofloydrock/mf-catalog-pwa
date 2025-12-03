export type MetricPoint = { t: number; value: number };
export type MetricSeries = { id: string; label: string; points: MetricPoint[] };
export type MetricsPayload = { refreshedAt: number; series: MetricSeries[] };
