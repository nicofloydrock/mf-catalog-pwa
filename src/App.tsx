import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { MetricsPanel } from "./components/MetricsPanel";
import { CatalogHeader } from "./components/catalog/CatalogHeader";

export default function App() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen px-4 py-6 sm:px-8">
        <CatalogHeader />

        <main className="mx-auto mt-6 max-w-6xl">
          <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
            <MetricsPanel />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}
