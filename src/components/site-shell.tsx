import Link from "next/link";

export function SiteShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const footerGroups = [
    {
      title: "Products",
      links: [
        { label: "Country plans", href: "/" },
        { label: "Regional plans", href: "/regions/EUROPE" },
        { label: "Global plans", href: "/packages/global-pro-25gb" },
        { label: "How it works", href: "/#how-it-works" },
      ],
    },
    {
      title: "Destinations",
      links: [
        { label: "France", href: "/countries/france" },
        { label: "Germany", href: "/countries/germany" },
        { label: "Japan", href: "/countries/japan" },
        { label: "Turkey", href: "/countries/turkey" },
      ],
    },
    {
      title: "Regions",
      links: [
        { label: "Europe", href: "/regions/EUROPE" },
        { label: "Asia", href: "/regions/ASIA" },
        { label: "Middle East", href: "/regions/MIDDLE_EAST" },
        { label: "Global", href: "/packages/global-pro-25gb" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", href: "/#how-it-works" },
        { label: "Device check", href: "/#device" },
        { label: "Refund policy", href: "/countries/france" },
        { label: "Contact us", href: "mailto:support@esimq.test" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Announcement bar */}
      <div className="relative z-50 bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
        <span className="opacity-90">Instant delivery · 190+ countries · Secure checkout</span>
        <span className="mx-3 opacity-50">·</span>
        <Link href="/" className="underline underline-offset-2 hover:opacity-80">
          Browse plans
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">

          {/* Logo */}
          <Link href="/" className="group flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="esimQ"
              className="h-11 w-auto object-contain transition-opacity group-hover:opacity-80"
            />
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {[
              { label: "Countries", href: "/" },
              { label: "Europe", href: "/regions/EUROPE" },
              { label: "Asia", href: "/regions/ASIA" },
              { label: "How it works", href: "/#how-it-works" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/regions/EUROPE"
              className="hidden rounded-xl bg-gradient-to-b from-sky-500 to-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition-all hover:shadow-sky-500/40 sm:inline-flex"
            >
              Browse plans
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              aria-label="Account"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        className={`mx-auto flex w-full max-w-7xl flex-col px-5 pb-24 sm:px-8 ${
          compact ? "gap-10 pt-8" : "gap-20 pt-10"
        }`}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-slate-950">
        {/* Top gradient accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(2,132,199,0.08),_transparent)]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-14 pb-8 sm:px-8">
          {/* Top section */}
          <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            {/* Brand */}
            <div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="esimQ"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
                Premium travel eSIM plans with instant QR delivery, transparent pricing, and worldwide coverage.
              </p>
              <div className="mt-6 flex gap-2">
                {[
                  { label: "X", href: "#" },
                  { label: "IG", href: "#" },
                  { label: "YT", href: "#" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[11px] font-bold text-slate-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["190+ Countries", "Instant QR", "Stripe Secure"].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Link groups */}
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-slate-600 sm:flex-row">
            <p>© {new Date().getFullYear()} esimQ. All rights reserved.</p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="transition-colors hover:text-slate-400">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
