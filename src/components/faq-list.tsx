type FaqItem = { question: string; answer: string };

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[var(--card-shadow)]">
      {items.map((item, i) => (
        <details key={`${i}-${item.question}`} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/80 sm:px-8">
            <div className="flex items-center gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-slate-950 sm:text-base">{item.question}</h3>
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all group-open:rotate-45 group-open:border-sky-200 group-open:bg-sky-50 group-open:text-sky-600">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 3v10M3 8h10" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 pb-5 pt-4 sm:px-8">
            <div className="pl-11">
              <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
