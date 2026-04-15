export function InstructionGrid({
  iphoneSteps,
  androidSteps,
}: {
  iphoneSteps: string[];
  androidSteps: string[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6">
        <h3 className="text-xl font-semibold text-slate-950">Install on iPhone</h3>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          {iphoneSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </article>
      <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6">
        <h3 className="text-xl font-semibold text-slate-950">Install on Android</h3>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          {androidSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
