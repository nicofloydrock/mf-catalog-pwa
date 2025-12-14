// Header del MF Catálogo: muestra operador, metadatos de remoto y dispara notify al host.
import type { HostConfig } from "../../types/hostConfig";

type Props = {
  config: HostConfig;
  userName: string;
  copy: {
    microfrontLabel: string;
    operatorLabel: string;
    remoteLabel: string;
    moduleLabel: string;
    notifyCta: string;
    notifyTitle: string;
    notifyBody: string;
  };
};

export function CatalogHeader({ config, userName, copy }: Props) {
  return (
    <header className="glass mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          {copy.microfrontLabel}
        </p>
        <h1 className="text-2xl font-semibold text-white">
          {copy.operatorLabel}: {userName}
        </h1>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          {copy.remoteLabel}: catalog
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          {copy.moduleLabel}: App
        </span>
        {config?.notify && (
          <button
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] transition hover:-translate-y-0.5 hover:border-white/40"
            onClick={() =>
              config.notify?.(copy.notifyBody, {
                title: copy.notifyTitle,
                target: "catalog",
              })
            }
          >
            {copy.notifyCta}
          </button>
        )}
      </div>
    </header>
  );
}
