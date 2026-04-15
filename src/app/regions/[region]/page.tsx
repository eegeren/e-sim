import Link from "next/link";
import { PackageCard } from "@/components/package-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { TrustGrid } from "@/components/trust-grid";
import { regionLabels } from "@/lib/content";
import { getRegionPackages } from "@/lib/store";
import { getRegionBySlugOrCode } from "@/lib/queries/regions";
import { notFound } from "next/navigation";
import type { RegionCode } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const regionConfig: Record<string, { gradient: string; emoji: string; description: string }> = {
  EUROPE:        { gradient: "from-blue-700 via-blue-600 to-indigo-600",   emoji: "🌍", description: "One plan across 40+ European countries. Ideal for multi-city trips and extended stays." },
  ASIA:          { gradient: "from-rose-700 via-red-600 to-orange-600",    emoji: "🌏", description: "Stay connected across Southeast Asia, East Asia, and South Asia with a single eSIM." },
  MIDDLE_EAST:   { gradient: "from-amber-700 via-amber-600 to-yellow-600", emoji: "🕌", description: "Coverage across the Gulf, Levant, and wider Middle East region." },
  GLOBAL:        { gradient: "from-violet-700 via-violet-600 to-purple-600", emoji: "🌐", description: "True worldwide coverage — the single plan that goes everywhere." },
  NORTH_AMERICA: { gradient: "from-sky-700 via-sky-600 to-cyan-600",      emoji: "🌎", description: "USA, Canada and Mexico on one easy plan." },
  SOUTH_AMERICA: { gradient: "from-emerald-700 via-green-600 to-teal-600", emoji: "🌿", description: "Coverage across South American countries for seamless travel." },
  AFRICA:        { gradient: "from-orange-700 via-orange-600 to-amber-600", emoji: "🦁", description: "Pan-African eSIM plans for business and leisure travelers." },
  OCEANIA:       { gradient: "from-teal-700 via-teal-600 to-cyan-600",    emoji: "🐚", description: "Australia, New Zealand, and Pacific islands on one plan." },
};

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionRecord = await getRegionBySlugOrCode(region);

  if (!regionRecord) notFound();

  const packages = await getRegionPackages(regionRecord.code);
  const cfg = regionConfig[regionRecord.code] ?? {
    gradient: "from-slate-700 to-slate-800",
    emoji: "🌍",
    description: "Regional eSIM plans for multi-country travel.",
  };
  const label = regionLabels[regionRecord.code as RegionCode];

  return (
    <SiteShell>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br opacity-90 ${cfg.gradient}`} style={{ mixBlendMode: "multiply" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-transparent" />
          <div className="animate-blob absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
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
            Back
          </Link>

          <div className="mt-8 flex items-end gap-6">
            <div>
              <span className="text-6xl">{cfg.emoji}</span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">
                Regional plans
              </p>
              <h1 className="mt-2 font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {label} eSIM
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/55">{cfg.description}</p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="8" />
                  </svg>
                </div>
                <p className="text-sm text-white/55">Instant delivery after payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustGrid />

      {/* ── Plans ── */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Available plans"
          title={`${label} eSIM packages`}
          description="All plans include instant QR delivery. Compare data, validity, and price per day."
        />
        {packages.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {packages.map((item) => (
              <PackageCard key={item.id} item={item} href={`/packages/${item.slug}`} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-4 text-lg font-semibold text-slate-700">No plans available yet</p>
            <p className="mt-2 text-sm text-slate-500">Check back soon or browse other regions.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse all destinations
            </Link>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
