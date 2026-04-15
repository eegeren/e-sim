export function TrustBadge({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[1.75rem] border border-white/80 bg-white/88 px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-950 sm:text-base">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}
