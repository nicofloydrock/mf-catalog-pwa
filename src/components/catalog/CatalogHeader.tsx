import type { HostConfig } from "../../types/hostConfig";

type Props = {
  config: HostConfig;
};

export function CatalogHeader({ config }: Props) {
  const userName = config?.user?.name ?? "sin usuario";

  return (
    <header className="glass mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Microfront Catálogo
        </p>
        <h1 className="text-2xl font-semibold text-white">
         Operador:   ({userName})
        </h1>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          remote: catalog
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          expose: App
        </span>
        {config?.notify && (
          <button
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] transition hover:-translate-y-0.5 hover:border-white/40"
            onClick={() =>
              config.notify?.(
                `Hola ${userName}, alerta enviada desde catálogo al host.`,
              )
            }
          >
            Alertar host
          </button>
        )}
      </div>
    </header>
  );
}
