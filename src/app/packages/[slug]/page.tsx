import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { PackageCard } from "@/components/package-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { DeviceCompatibilityChecker } from "@/components/device-compatibility-checker";
import { TrustGrid } from "@/components/trust-grid";
import { commonFaqs, usageLabels } from "@/lib/content";
import { getPackageBySlug, getPackageCoverageLabel } from "@/lib/store";
import type { UsageType } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item   = await getPackageBySlug(slug);
  const faqs   = [...(item.faq as { question: string; answer: string }[]), ...commonFaqs];
  const usage  = usageLabels[item.usageProfile as UsageType];
  const coverage = getPackageCoverageLabel(item);

  const details = [
    { icon: "📡", label: "Networks",     value: item.supportedNetworks.join(", ") },
    { icon: "📱", label: "Devices",      value: item.deviceCompatibility },
    { icon: "⚡", label: "Activation",   value: item.activationPolicy },
    { icon: "💳", label: "Refund",       value: item.refundPolicy },
  ];

  return (
    <SiteShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">

        {/* ── LEFT: Details ── */}
        <aside className="space-y-6">
          <Link
            href={item.country ? `/countries/${item.country.slug}` : "/"}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 8H3M7 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-600">{coverage}</p>
            <h1 className="mt-2.5 font-mono text-4xl font-bold tracking-tight text-slate-950">{item.title}</h1>
            <p className="mt-3 text-base leading-7 text-slate-500">{item.description}</p>
          </div>

          {/* Usage profile card */}
          <div className="overflow-hidden rounded-[1.8rem] border border-slate-200/60 bg-white shadow-[var(--card-shadow)]">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Usage profile</p>
              <p className="mt-1 text-base font-bold text-slate-950">{usage.title}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm leading-7 text-slate-600">{usage.description}</p>
            </div>
          </div>

          {/* Detail cards */}
          <div className="space-y-3">
            {details.map((d) => (
              <div key={d.label} className="flex gap-4 rounded-[1.5rem] border border-slate-200/60 bg-white p-5 shadow-sm">
                <span className="mt-0.5 text-xl">{d.icon}</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{d.label}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-700">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── RIGHT: Card + after payment ── */}
        <div className="space-y-6">
          <PackageCard item={item} href={`/checkout/${item.id}`} />

          <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-[var(--card-shadow)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-950">What happens after payment</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                "Stripe confirms payment instantly",
                "eSIM is provisioned automatically",
                "QR code + instructions emailed to you",
                "Scan in Settings → eSIM and go online",
              ].map((s, i) => (
                <li key={s} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <TrustGrid />

      <section className="space-y-8">
        <SectionHeading eyebrow="Compatibility" title="Check your device" />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200/60 bg-white p-7 shadow-[var(--card-shadow)]">
            <p className="text-sm leading-7 text-slate-600">
              This package already lists supported networks and device notes above. The checker gives you one more pre-purchase confirmation.
            </p>
            <ul className="mt-5 space-y-3">
              {["Device must be carrier-unlocked", "eSIM must be enabled", "Install before departure"].map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="m2.5 6 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <DeviceCompatibilityChecker />
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading eyebrow="FAQ" title="Before you buy" />
        <FaqList items={faqs} />
      </section>
    </SiteShell>
  );
}
