import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { PackageCard } from "@/components/package-card";
import { SiteShell } from "@/components/site-shell";
import { commonFaqs } from "@/lib/content";
import { regionLabels } from "@/lib/content";
import type { RegionCode } from "@/generated/prisma/enums";

export function SeoLanding({
  title,
  description,
  coverage,
  networks,
  packages,
  country,
}: {
  title: string;
  description: string;
  coverage: string;
  networks: string[];
  packages: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    dataAmountGb: { toString(): string };
    validityDays: number;
    salePrice: { toString(): string };
    currency: string;
    usageProfile: "LIGHT" | "STANDARD" | "HEAVY";
    isMostPopular: boolean;
    country?: { name: string; slug: string } | null;
    region?: { code: RegionCode; name?: string; slug: string } | null;
  }>;
  country?: { slug: string } | null;
}) {
  return (
    <SiteShell>
      <section className="rounded-[2.25rem] border border-white/80 bg-white/85 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          SEO landing
        </p>
        <h1 className="mt-3 font-mono text-4xl font-bold text-slate-950">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Coverage</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{coverage}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Supported networks</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{networks.join(", ")}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href={country ? `/countries/${country.slug}` : "/regions/EUROPE"}
            className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            View matching plans
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {packages.map((item) => (
          <PackageCard key={item.id} item={item} href={`/packages/${item.slug}`} />
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-3xl font-bold text-slate-950">FAQ</h2>
        <FaqList items={commonFaqs} />
      </section>
    </SiteShell>
  );
}

export function buildRegionDescription(region: RegionCode) {
  return `${regionLabels[region]} coverage with multi-network access, fast installation and instant delivery for travelers moving across the region.`;
}
