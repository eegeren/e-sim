import Link from "next/link";
import { notFound } from "next/navigation";
import { DeviceCompatibilityChecker } from "@/components/device-compatibility-checker";
import { FaqList } from "@/components/faq-list";
import { PackageCard } from "@/components/package-card";
import { PackageComparison } from "@/components/package-comparison";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { TrustGrid } from "@/components/trust-grid";
import { commonFaqs } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEventName, UsageType } from "@/generated/prisma/enums";
import { usageLabels } from "@/lib/content";
import { getCountryBySlug } from "@/lib/queries/countries";

export const dynamic = "force-dynamic";

const countryConfig: Record<string, { flag: string; gradient: string }> = {
  france:  { flag: "🇫🇷", gradient: "from-blue-800 via-blue-700 to-indigo-700" },
  germany: { flag: "🇩🇪", gradient: "from-slate-900 via-slate-800 to-slate-700" },
  japan:   { flag: "🇯🇵", gradient: "from-rose-800 via-red-700 to-rose-700" },
  turkey:  { flag: "🇹🇷", gradient: "from-red-800 via-red-700 to-red-600" },
};

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  await trackEvent({
    eventName: AnalyticsEventName.COUNTRY_VIEW,
    countrySlug: country.slug,
    path: `/countries/${country.slug}`,
  });

  const packages = country.packages.map((item) => ({
    ...item,
    title: item.name,
    dataAmountGb: { toString: () => item.dataGb },
    salePrice: { toString: () => item.price },
    usageProfile: item.usageType,
    usageDescription: usageLabels[item.usageType as UsageType].description,
    isMostPopular: item.popular,
    isActive: item.active,
  }));

  const faqs = [...(country.faq as { question: string; answer: string }[]), ...commonFaqs];
  const cfg = countryConfig[country.slug] ?? { flag: country.flag, gradient: "from-slate-800 to-slate-900" };

  return (
    <SiteShell>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950">
        {/* Layered gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-85`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
          <div className="animate-blob absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/6 blur-3xl" />
          <div className="animate-blob delay-400 absolute bottom-0 left-0 h-48 w-48 rounded-full bg-black/20 blur-3xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/75 backdrop-blur transition-all hover:bg-white/14 hover:text-white"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 8H3M7 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to catalog
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2.5 backdrop-blur">
                <span className="text-2xl">{cfg.flag}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/70">
                  {country.name} Travel eSIM
                </span>
              </div>

              <h1 className="font-mono text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Stay connected<br />
                <span className="text-gradient">across {country.name}</span>
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/55">{country.tagline}</p>

              <div className="mt-6">
                <span className="inline-block rounded-xl border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/60 backdrop-blur">
                  <span className="mr-2 font-semibold text-white/40">Networks</span>
                  {country.supportedNetworks.join(" · ")}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30"
                >
                  View plans
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 3v10M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-6 py-3.5 text-sm font-bold text-white/90 backdrop-blur"
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Right — snapshot */}
            <aside className="rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/45">
                Coverage snapshot
              </p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-white">{country.heroTitle}</p>
              <div className="mt-5 space-y-3">
                {[
                  { label: "Networks",   value: country.supportedNetworks.join(" · ") },
                  { label: "Activation", value: country.activationPolicy },
                  { label: "Refund",     value: country.refundPolicy },
                ].map((row) => (
                  <div key={row.label} className="rounded-[1.4rem] border border-white/8 bg-white/6 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{row.label}</p>
                    <p className="mt-1.5 text-sm leading-6 text-white/70">{row.value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <TrustGrid />

      {/* ── PLANS ── */}
      <section id="plans" className="space-y-8">
        <SectionHeading
          eyebrow="Packages"
          title={`${country.name} plans for every trip`}
          description="Compare short-trip, balanced and heavy-usage plans. Instant delivery after payment."
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {packages.map((item) => (
            <PackageCard key={item.id} item={item} href={`/packages/${item.slug}`} />
          ))}
        </div>
        <PackageComparison />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-14 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0d1f35] to-[#071522]" />
        <div className="animate-blob pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-600/8 blur-3xl" />
        <div className="relative">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-400">How it works</p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Up and running in minutes
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { step: "01", gradient: "from-sky-500 to-sky-600",     shadow: "shadow-sky-500/30",     title: "Choose plan",     text: "Pick the plan that fits your trip length and data needs." },
              { step: "02", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/30", title: "Scan QR code",    text: "Pay via Stripe, get QR by email, scan in Settings → eSIM." },
              { step: "03", gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/30", title: "Go online",   text: "Land, enable data roaming, and connect instantly." },
            ].map((s, i) => (
              <div
                key={s.step}
                className="animate-fade-in-up rounded-[1.8rem] border border-white/8 bg-white/5 p-7 backdrop-blur-sm"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b ${s.gradient} text-white shadow-lg ${s.shadow}`}>
                    <span className="font-mono text-sm font-bold">{s.step}</span>
                  </div>
                  <span className="font-mono text-5xl font-bold text-white/6">{s.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/45">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVICE ── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Compatibility"
          title="Check your device"
          description={country.deviceCompatibility}
        />
        <DeviceCompatibilityChecker />
      </section>

      {/* ── FAQ ── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Travel-ready answers"
          description="Installation timing, dual SIM, hotspot use, and data expectations."
        />
        <FaqList items={faqs} />
      </section>
    </SiteShell>
  );
}
