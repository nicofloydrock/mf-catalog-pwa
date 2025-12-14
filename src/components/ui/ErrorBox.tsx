// Caja simple de error para mostrar mensajes de API o fallback.
type Props = {
  message: string;
};

export function ErrorBox({ message }: Props) {
  return (
    <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
      {message}
    </div>
  );
}
