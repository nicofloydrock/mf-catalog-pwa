import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "Nuevo" | "Top" | "Backorder";
  colors: string[];
};

type MetricPoint = { t: number; value: number };
type MetricSeries = { id: string; label: string; points: MetricPoint[] };
type MetricsPayload = { refreshedAt: number; series: MetricSeries[] };

const resolveApiBase = () => {
  if (import.meta.env.VITE_API_MOCK_URL) return import.meta.env.VITE_API_MOCK_URL;
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5050`;
  }
  return "http://localhost:5050";
};

const API_BASE = resolveApiBase();
const API_METRICS_PATH = import.meta.env.VITE_API_METRICS_PATH ?? "/api/metrics";

const products: Product[] = [
  {
    id: "SKU-9821",
    name: "Sneaker Nova",
    category: "Calzado",
    price: "$109.00",
    stock: 38,
    status: "Top",
    colors: ["#22d3ee", "#a855f7", "#fbbf24"],
  },
  {
    id: "SKU-7310",
    name: "Hoodie Nebula",
    category: "Apparel",
    price: "$79.00",
    stock: 18,
    status: "Nuevo",
    colors: ["#6366f1", "#22d3ee"],
  },
  {
    id: "SKU-6623",
    name: "Backpack Vertex",
    category: "Accesorios",
    price: "$129.00",
    stock: 6,
    status: "Backorder",
    colors: ["#f472b6", "#22d3ee"],
  },
  {
    id: "SKU-2451",
    name: "Smartwatch Pulse",
    category: "Wearables",
    price: "$189.00",
    stock: 24,
    status: "Top",
    colors: ["#a855f7", "#22d3ee", "#f97316"],
  },
];

const statusStyles: Record<Product["status"], string> = {
  Nuevo: "bg-emerald-500/10 text-emerald-100 border-emerald-500/30",
  Top: "bg-sky-500/10 text-sky-100 border-sky-500/30",
  Backorder: "bg-amber-500/10 text-amber-100 border-amber-500/30",
};

const palette: Record<string, string> = {
  Tráfico: "#22d3ee",
  Conversion: "#a855f7",
  Tickets: "#f59e0b",
};

function Sparkline({ series }: { series: MetricSeries }) {
  const width = 360;
  const height = 140;
  const [min, max] = useMemo(() => {
    const values = series.points.map((p) => p.value);
    return [Math.min(...values), Math.max(...values)];
  }, [series.points]);

  const path = useMemo(() => {
    const range = max - min || 1;
    return series.points
      .map((point, idx) => {
        const x =
          series.points.length === 1
            ? width / 2
            : (idx / (series.points.length - 1)) * width;
        const y = height - ((point.value - min) / range) * height;
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [height, max, min, series.points, width]);

  const area = useMemo(() => {
    if (!series.points.length) return "";
    const range = max - min || 1;
    const top = series.points
      .map((point, idx) => {
        const x =
          series.points.length === 1
            ? width / 2
            : (idx / (series.points.length - 1)) * width;
        const y = height - ((point.value - min) / range) * height;
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
    return `${top} L ${width} ${height} L 0 ${height} Z`;
  }, [height, max, min, series.points, width]);

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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 w-full"
        role="img"
        aria-label={`Serie ${series.label}`}
      >
        <defs>
          <linearGradient id={`fill-${series.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d={area}
          fill={`url(#fill-${series.id})`}
          stroke="none"
          aria-hidden="true"
        />
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

export default function App() {
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let controller: AbortController | null = null;

    const loadMetrics = async (withSpinner = false) => {
      setMetricsError(null);
      controller?.abort();
      controller = new AbortController();
      if (withSpinner) setLoadingMetrics(true);

      try {
        const res = await fetch(`${API_BASE}${API_METRICS_PATH}?points=22`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API ${res.status}: ${res.statusText}`);
        }
        const data = (await res.json()) as MetricsPayload;
        if (!controller.signal.aborted && mounted) {
          setMetrics(data);
        }
      } catch (err) {
        if (!controller?.signal.aborted && mounted) {
          const message = err instanceof Error ? err.message : String(err);
          setMetricsError(message);
        }
      } finally {
        if (withSpinner && mounted) setLoadingMetrics(false);
      }
    };

    loadMetrics(true);
    const id = setInterval(() => loadMetrics(false), 6000);

    return () => {
      mounted = false;
      controller?.abort();
      clearInterval(id);
    };
  }, []);

  const lastRefresh = useMemo(
    () =>
      metrics?.refreshedAt
        ? new Date(metrics.refreshedAt).toLocaleTimeString()
        : null,
    [metrics?.refreshedAt],
  );

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <header className="glass mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Microfront Catálogo
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Gestión de catálogo en vivo
          </h1>
          <p className="text-sm text-slate-300">
            React 18 + Vite + Module Federation listo para el App Shell.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            remote: catalog
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            expose: App
          </span>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-5xl space-y-4">
        <section className="glass rounded-2xl border border-white/10 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Panel en vivo (API mock)
              </p>
              <h2 className="text-xl font-semibold text-white">
                Pulso de catálogo y demanda
              </h2>
              <p className="text-sm text-slate-300">
                Datos se actualizan cada 6s desde{" "}
                <code className="rounded bg-white/10 px-2 py-1">
                  {API_BASE}
                </code>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-100">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
              {lastRefresh && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
                  Actualizado: {lastRefresh}
                </span>
              )}
              {metricsError && (
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-100">
                  {metricsError}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {metrics?.series.map((serie) => (
              <Sparkline key={serie.id} series={serie} />
            ))}
            {!metrics && loadingMetrics && (
              <div className="md:col-span-3">
                <div className="grid h-36 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm text-slate-200">
                  Cargando serie en vivo...
                </div>
              </div>
            )}
            {metricsError && !metrics && (
              <div className="md:col-span-3">
                <div className="grid h-36 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-100">
                  Error al obtener métricas: {metricsError}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="glass rounded-2xl border border-white/10 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Colecciones
              </p>
              <h2 className="text-xl font-semibold text-white">
                Productos destacados
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                Crear producto
              </button>
              <button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-white/30 hover:text-white">
                Importar CSV
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="glass group rounded-xl border border-white/10 p-4 shadow-sm transition hover:-translate-y-1 hover:border-white/30 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-300">{product.id}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-200">
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {product.price}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    Paleta
                  </p>
                  <div className="flex items-center gap-1">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="h-5 w-5 rounded-full border border-white/20"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                  <button className="rounded-lg bg-white/10 px-3 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                    Editar ficha
                  </button>
                  <button className="text-slate-200 transition hover:text-white">
                    Ver analytics →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
