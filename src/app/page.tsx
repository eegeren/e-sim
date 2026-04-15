import Link from "next/link";
import { RegionCode } from "@/generated/prisma/enums";
import { DeviceCompatibilityChecker } from "@/components/device-compatibility-checker";
import { HomePlanCard } from "@/components/home-plan-card";
import { SiteShell } from "@/components/site-shell";
import { TrustGrid } from "@/components/trust-grid";
import { getHomepagePopularPackages } from "@/lib/catalog";
import { regionLabels } from "@/lib/content";
import { getCatalog } from "@/lib/store";

export const dynamic = "force-dynamic";

const countryConfig: Record<string, {
  flag: string;
  gradient: string;
  accent: string;
  textColor: string;
}> = {
  france:  { flag: "🇫🇷", gradient: "from-blue-700 via-blue-600 to-indigo-600",   accent: "bg-blue-500",   textColor: "text-blue-100" },
  germany: { flag: "🇩🇪", gradient: "from-slate-800 via-slate-700 to-slate-600",  accent: "bg-slate-400",  textColor: "text-slate-200" },
  japan:   { flag: "🇯🇵", gradient: "from-rose-700 via-red-600 to-rose-600",       accent: "bg-rose-400",   textColor: "text-rose-100" },
  turkey:  { flag: "🇹🇷", gradient: "from-red-700 via-red-600 to-orange-600",      accent: "bg-red-400",    textColor: "text-red-100" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>;
}) {
  const params = await searchParams;
  const catalog = await getCatalog({ query: params.q, region: params.region });
  const homepagePopularPlans = await getHomepagePopularPackages();

  const featuredCountries = catalog.countries.filter((c) =>
    Object.keys(countryConfig).includes(c.slug),
  );

  const popularPlans = homepagePopularPlans
    .map((item) => ({
      ...item,
      title: item.name,
      dataAmountGb: { toString: () => item.dataGb },
      salePrice: { toString: () => item.price },
      isMostPopular: item.popular,
    }))
    .filter((item) => ["Europe Flex", "Global Pro", "Asia Lite"].includes(item.title))
    .slice(0, 3);

  const plans = popularPlans.length > 0 ? popularPlans : catalog.regionPackages.slice(0, 3);

  return (
    <SiteShell>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950">
        {/* Mesh gradient layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0d1f35] to-[#071522]" />
          <div className="animate-blob absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-[100px]" />
          <div className="animate-blob delay-300 absolute -right-32 top-20 h-[400px] w-[400px] rounded-full bg-blue-500/8 blur-[80px]" />
          <div className="animate-blob delay-500 absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-500/6 blur-[80px]" />
        </div>

        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* World dots */}
        <div className="world-dots pointer-events-none absolute inset-0 opacity-70" />
        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent" />

        <div className="relative px-6 py-16 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/6 px-5 py-2.5 backdrop-blur-sm">
              <span className="dot-live relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-300">
                190+ Countries · Instant eSIM Delivery
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 font-mono text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your SIM card,{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient">reinvented.</span>
            </h1>

            <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-xl text-lg leading-8 text-white/55">
              Buy once, scan the QR code, and go online in minutes — no physical SIM, no roaming surprises.
            </p>

            {/* Stats row */}
            <div className="animate-fade-in-up delay-300 mx-auto mt-10 flex max-w-sm justify-center divide-x divide-white/10">
              {[
                { value: "190+", label: "Countries" },
                { value: "< 2min", label: "Setup" },
                { value: "24/7", label: "Support" },
              ].map((s) => (
                <div key={s.label} className="flex-1 px-6 first:pl-0 last:pr-0">
                  <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Search form */}
            <form className="animate-fade-in-up delay-400 mx-auto mt-10 grid max-w-2xl gap-2 rounded-[1.5rem] border border-white/10 bg-white/7 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search country or region…"
                className="input-focus rounded-[1.1rem] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white placeholder:text-white/35 focus:bg-white/12"
              />
              <button
                type="submit"
                className="rounded-[1.1rem] bg-gradient-to-b from-sky-500 to-sky-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-sky-600/35 hover:from-sky-400 hover:to-sky-500"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="animate-fade-in-up delay-500 mt-5 flex flex-wrap justify-center gap-2">
              {[
                { label: "🇫🇷 France", href: "/countries/france" },
                { label: "🇩🇪 Germany", href: "/countries/germany" },
                { label: "🌍 Europe", href: "/regions/EUROPE" },
                { label: "🌏 Asia", href: "/regions/ASIA" },
                { label: "🌐 Global", href: "/packages/global-pro-25gb" },
              ].map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className="rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white/75"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section className="rounded-[2rem] border border-slate-200/60 bg-white shadow-[var(--card-shadow)]">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            { value: "190+", label: "Countries covered", icon: "🌍" },
            { value: "< 2 min", label: "Average setup time", icon: "⚡" },
            { value: "100%", label: "Instant QR delivery", icon: "📲" },
            { value: "4.9 ★", label: "Customer rating", icon: "⭐" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`animate-fade-in-up flex flex-col items-center justify-center gap-2 px-8 py-8 text-center`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-3xl">{s.icon}</span>
              <p className="font-mono text-3xl font-bold text-slate-950">{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED COUNTRIES
      ════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-600">
              Popular destinations
            </p>
            <h2 className="mt-2.5 font-mono text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Top picks for your next trip
            </h2>
          </div>
          <Link href="/" className="hidden items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 sm:flex">
            View all
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCountries.map((country, i) => {
            const cfg = countryConfig[country.slug] ?? {
              flag: country.flag,
              gradient: "from-slate-700 to-slate-800",
              accent: "bg-slate-500",
              textColor: "text-slate-100",
            };
            return (
              <Link
                key={country.id}
                href={`/countries/${country.slug}`}
                className={`animate-fade-in-up group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${cfg.gradient} p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] card-hover`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Shine overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Dot pattern */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative">
                  <div className="text-5xl leading-none">{cfg.flag}</div>
                  <p className={`mt-4 text-[10px] font-bold uppercase tracking-[0.26em] ${cfg.textColor} opacity-60`}>
                    {country.code}
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold text-white">{country.name}</h3>
                  <p className={`mt-2 text-xs ${cfg.textColor} opacity-60`}>
                    {country.packages.length} plans available
                  </p>

                  <div className="mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-all group-hover:bg-white/25">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════
          POPULAR PLANS
      ════════════════════════════════════════ */}
      <section className="space-y-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-600">
            Best sellers
          </p>
          <h2 className="mt-2.5 font-mono text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Multi-country travel plans
          </h2>
          <p className="mt-3 max-w-xl text-base text-slate-500">
            One plan, multiple countries. Compare data, validity, and price per day.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          {plans.map((item, i) => (
            <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <HomePlanCard item={{ ...item, country: null }} />
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section id="how-it-works" className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-14 sm:px-12 sm:py-20">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0d1f35] to-[#071522]" />
          <div className="animate-blob absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-600/8 blur-3xl" />
          <div className="animate-blob delay-300 absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-500/6 blur-3xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-400">
              How it works
            </p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-base leading-7 text-white/50">
              No physical SIM. Buy, scan, go.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                color: "from-sky-500 to-sky-600",
                shadow: "shadow-sky-500/30",
                title: "Choose your plan",
                text: "Browse by country or region. Compare data, validity, and cost per day to find the right fit.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                step: "02",
                color: "from-violet-500 to-violet-600",
                shadow: "shadow-violet-500/30",
                title: "Scan the QR code",
                text: "Pay securely via Stripe. Your QR code arrives instantly by email. Scan in Settings → eSIM.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h.01M17 14v3h3M17 20h3" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                step: "03",
                color: "from-emerald-500 to-emerald-600",
                shadow: "shadow-emerald-500/30",
                title: "Connect instantly",
                text: "Land, switch to your travel eSIM, enable data roaming, and go online. Zero surprises.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1.5 8.5C5.5 4.5 18.5 4.5 22.5 8.5" strokeLinecap="round" />
                    <path d="M4.5 11.5C7.5 8.5 16.5 8.5 19.5 11.5" strokeLinecap="round" />
                    <path d="M7.5 14.5C9.5 12.5 14.5 12.5 16.5 14.5" strokeLinecap="round" />
                    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                ),
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="animate-fade-in-up group relative overflow-hidden rounded-[1.8rem] border border-white/8 bg-white/5 p-7 backdrop-blur-sm transition-all hover:border-white/14 hover:bg-white/8"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b ${s.color} text-white shadow-lg ${s.shadow}`}>
                    {s.icon}
                  </div>
                  <span className="font-mono text-5xl font-bold text-white/8">{s.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-white/45">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST BADGES
      ════════════════════════════════════════ */}
      <TrustGrid />

      {/* ════════════════════════════════════════
          DEVICE CHECK
      ════════════════════════════════════════ */}
      <section id="device" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-[var(--card-shadow)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-600">
            Device compatibility
          </p>
          <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Works with your device
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Most modern Apple, Samsung and Google flagships support eSIM. Confirm your model before checkout.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Device must be carrier-unlocked",
              "eSIM must be enabled in settings",
              "Install before departure for best results",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m2.5 6 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <DeviceCompatibilityChecker />
      </section>

    </SiteShell>
  );
}
