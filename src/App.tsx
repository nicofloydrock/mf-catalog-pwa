// Entrada del MF Catálogo: valida config y renderiza header + métricas en vivo.
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MetricsPanel } from "./components/MetricsPanel";
import { CatalogHeader } from "./components/catalog/CatalogHeader";
import { ConfigTester } from "./components/catalog/ConfigTester";
import copy from "./content/catalog.json";
import { queryClient } from "./providers/queryClient";
import type { HostConfig } from "./types/hostConfig";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const [localConfig, setLocalConfig] = useState<HostConfig | undefined>(config);
  const effectiveConfig = localConfig ?? config;
  const valid = effectiveConfig?.token === "NICORIVERA";

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-200 sm:px-8">
        <ConfigTester copy={copy.tester} onApply={(cfg) => setLocalConfig(cfg)} />
      </div>
    );
  }

  const userName =
    effectiveConfig?.auth?.user?.name ??
    effectiveConfig?.user?.name ??
    copy.app.anonymousUser;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen px-4 py-6 sm:px-8">
        <CatalogHeader config={effectiveConfig} userName={userName} copy={copy.header} />

        <main className="mx-auto mt-6 max-w-6xl">
          <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
            <MetricsPanel copy={copy.metrics} />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}
