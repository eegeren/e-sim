import { notFound } from "next/navigation";
import { affiliateLandingPages } from "@/lib/content";
import { getCatalog } from "@/lib/store";
import { PackageCard } from "@/components/package-card";
import { SiteShell } from "@/components/site-shell";

export const dynamic = "force-dynamic";

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = affiliateLandingPages[slug as keyof typeof affiliateLandingPages];

  if (!landing) {
    notFound();
  }

  const catalog = await getCatalog({});
  const picks = [
    ...catalog.regionPackages.map((item) => ({ ...item, country: null })),
    ...catalog.countries.flatMap((country) =>
      country.packages.map((item) => ({
        ...item,
        country,
      })),
    ),
  ].slice(0, 3);

  return (
    <SiteShell>
      <section className="rounded-[2.25rem] border border-white/80 bg-white/85 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          Affiliate landing
        </p>
        <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight text-slate-950">
          {landing.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {landing.subtitle} Every checkout started from this page can carry affiliate code{" "}
          <span className="font-semibold text-slate-950">{landing.affiliateCode}</span>.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {picks.map((item) => (
          <PackageCard
            key={item.id}
            item={item}
            href={`/packages/${item.slug}?affiliate=${landing.affiliateCode}`}
          />
        ))}
      </section>
    </SiteShell>
  );
}
