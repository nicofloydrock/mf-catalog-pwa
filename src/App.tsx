import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { MetricsPanel } from "./components/MetricsPanel";
import { CatalogHeader } from "./components/catalog/CatalogHeader";
import type { HostConfig } from "./types/hostConfig";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const valid = config?.token === "NICORIVERA";

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-center text-slate-200 sm:px-8">
        Config no recibida o token inválido.
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen px-4 py-6 sm:px-8">
        <CatalogHeader config={config} />

        <main className="mx-auto mt-6 max-w-6xl">
          <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
            <MetricsPanel />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}
