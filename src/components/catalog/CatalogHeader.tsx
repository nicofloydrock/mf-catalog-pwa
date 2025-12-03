export function CatalogHeader() {
  return (
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
  );
}
