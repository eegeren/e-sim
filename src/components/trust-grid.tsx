const badges = [
  {
    title: "Instant delivery",
    description: "QR code and setup details sent to your inbox seconds after payment.",
    gradient: "from-sky-500 to-sky-600",
    glow: "shadow-sky-500/20",
    bg: "bg-sky-50",
    border: "border-sky-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
  },
  {
    title: "190+ countries",
    description: "Country and regional plans from a single, clean storefront.",
    gradient: "from-violet-500 to-violet-600",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-50",
    border: "border-violet-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12h16M12 4a15 15 0 0 1 0 16M12 4a15 15 0 0 0 0 16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: "Stripe secured",
    description: "Hosted Stripe checkout — your card data never touches our servers.",
    gradient: "from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 3v5c0 4.5-2.8 7.9-7 10-4.2-2.1-7-5.5-7-10V6l7-3Z" />
        <path d="m9.5 12 1.7 1.7 3.3-3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "24/7 support",
    description: "Setup guidance, troubleshooting tips, and resend delivery on demand.",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 14v-2a7 7 0 1 1 14 0v2" />
        <path d="M5 15a2 2 0 0 0 2 2h1v-5H7a2 2 0 0 0-2 2Zm14 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" />
      </svg>
    ),
  },
] as const;

export function TrustGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {badges.map((b, i) => (
        <div
          key={b.title}
          className={`animate-fade-in-up group overflow-hidden rounded-[1.8rem] border bg-white shadow-[var(--card-shadow)] card-hover ${b.border}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Top mini color bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${b.gradient}`} />

          <div className="p-6">
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b ${b.gradient} text-white shadow-lg ${b.glow}`}>
              {b.icon}
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-slate-950">{b.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{b.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
