import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { MetricsPanel } from "./components/MetricsPanel";
import { CatalogHeader } from "./components/catalog/CatalogHeader";

type HostConfig = {
  notify?: (message: string) => Promise<void> | void;
  user?: { id: string; name: string };
};

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const configLabel = config
    ? `Config recibido (${config.user?.name ?? "sin usuario"})`
    : "Config no recibido";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen px-4 py-6 sm:px-8">
        <CatalogHeader />
        <p className="mx-auto mt-2 max-w-5xl text-xs text-slate-300 sm:mt-3">
          {configLabel}
        </p>

        <main className="mx-auto mt-6 max-w-6xl">
          <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
            <MetricsPanel />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-200">
              {config?.user && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Sesión: {config.user.name}
                </span>
              )}
              {config?.notify && (
                <button
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] transition hover:-translate-y-0.5 hover:border-white/40"
                  onClick={() =>
                    config?.notify?.("Catálogo notificó al host: métricas listas")
                  }
                >
                  Probar alerta del host
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}
