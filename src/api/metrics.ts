// Cliente API para obtener métricas mock desde el host configurado.
import type { MetricsPayload } from "../types/metrics";
import { resolveApiBase } from "../utils/env";

const API_BASE = resolveApiBase();
const API_METRICS_PATH =
  import.meta.env.VITE_API_METRICS_PATH ?? "/api/metrics";

export async function fetchMetrics(points = 22): Promise<MetricsPayload> {
  const res = await fetch(`${API_BASE}${API_METRICS_PATH}?points=${points}`);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
