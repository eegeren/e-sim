import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-list";
import { PackageCard } from "@/components/package-card";
import { SiteShell } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SeoCountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await prisma.country.findUnique({
    where: { slug },
    include: {
      packages: {
        where: { active: true },
        orderBy: [{ popular: "desc" }, { price: "asc" }],
      },
    },
  });

  if (!country) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="space-y-5 rounded-[2.25rem] border border-white/80 bg-white/85 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          SEO landing
        </p>
        <h1 className="font-mono text-4xl font-bold text-slate-950">
          Best eSIM for {country.name}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Compare travel-ready plans for {country.name}, including supported networks, activation terms and refund guidance. This page is optimized for acquisition traffic and routes users directly into checkout.
        </p>
        <Link
          href={`/countries/${country.slug}`}
          className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          View all {country.name} plans
        </Link>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        {country.packages.map((item) => (
          <PackageCard
            key={item.id}
            item={{
              ...item,
              title: item.name,
              dataAmountGb: item.dataGb,
              salePrice: item.price,
              usageProfile: item.usageType,
              isMostPopular: item.popular,
              country,
            }}
            href={`/packages/${item.slug}`}
          />
        ))}
      </section>
      <section className="space-y-6">
        <h2 className="font-mono text-3xl font-bold text-slate-950">FAQ</h2>
        <FaqList items={country.faq as { question: string; answer: string }[]} />
      </section>
    </SiteShell>
  );
}
