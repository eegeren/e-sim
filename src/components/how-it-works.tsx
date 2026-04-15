const steps = [
  {
    title: "Choose destination",
    description: "Pick a country or region plan that matches your trip length and data needs.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Scan QR code",
    description: "Complete checkout and install the eSIM in minutes using the QR or manual code.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" strokeLinecap="round" />
        <rect x="8" y="8" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    title: "Connect instantly",
    description: "Enable data roaming on arrival and go online across supported networks.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0M11.5 18.5a1 1 0 1 1 1 0" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Travel-ready setup in three clear steps
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/88 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="absolute right-5 top-5 text-5xl font-semibold tracking-tight text-slate-200">
              {index + 1}
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
              {step.icon}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
