import Link from "next/link";
import { usageLabels } from "@/lib/content";
import { getPackageCoverageLabel, getPackagePriceMeta } from "@/lib/store";
import type { PackageScope, RegionCode, UsageType } from "@/generated/prisma/enums";

type PackageWithCountry = {
  id: string;
  title: string;
  description: string;
  dataAmountGb: { toString(): string };
  validityDays: number;
  salePrice: { toString(): string };
  currency: string;
  usageProfile?: UsageType | string;
  isMostPopular: boolean;
  scope?: PackageScope | string;
  country?: { name: string } | null;
  region?: { code: RegionCode; name?: string } | null;
};

export function PackageCard({ item, href }: { item: PackageWithCountry; href: string }) {
  const usage   = usageLabels[(item.usageProfile as UsageType | undefined) ?? "STANDARD"];
  const pricing = getPackagePriceMeta(item);

  const badge = item.isMostPopular
    ? "Most popular"
    : item.validityDays <= 7
      ? "Short trip"
      : Number(item.dataAmountGb) >= 10
        ? "Best value"
        : null;

  const popular = item.isMostPopular;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 ${
        popular
          ? "border border-sky-200/80 bg-white shadow-[0_4px_20px_rgba(2,132,199,0.1),0_24px_60px_rgba(2,132,199,0.08)] hover:shadow-[0_8px_32px_rgba(2,132,199,0.16),0_40px_80px_rgba(2,132,199,0.1)]"
          : "border border-slate-200/60 bg-white shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)]"
      }`}
    >
      {/* Top bar */}
      {popular
        ? <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-cyan-400" />
        : <div className="h-1.5 w-full bg-gradient-to-r from-slate-200 to-slate-300" />
      }

      <div className="flex flex-1 flex-col p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
              {getPackageCoverageLabel(item)}
            </p>
            <h3 className="mt-1.5 text-xl font-bold text-slate-950">{item.title}</h3>
          </div>
          {badge && (
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                popular
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {popular && (
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700">
              Fastest seller
            </span>
          )}
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {usage.title}
          </span>
        </div>

        {/* Data + price */}
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-end gap-1">
              <span className="font-mono text-5xl font-bold tracking-tight text-slate-950">
                {item.dataAmountGb.toString()}
              </span>
              <span className="mb-1 font-mono text-xl font-semibold text-slate-400">GB</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p>
          </div>

          <div
            className={`shrink-0 rounded-[1.4rem] px-4 py-3.5 text-right text-white shadow-lg ${
              popular
                ? "bg-gradient-to-b from-sky-500 to-sky-600 shadow-sky-500/25"
                : "bg-gradient-to-b from-slate-800 to-slate-950 shadow-slate-900/20"
            }`}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] opacity-65">From</p>
            <p className="mt-0.5 font-mono text-2xl font-bold leading-none">{pricing.displayPrice}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[
            { label: "Validity", value: `${item.validityDays} days` },
            { label: "Per day",  value: pricing.displayPricePerDay },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-[1.2rem] border px-4 py-3 ${
                popular ? "border-sky-100 bg-sky-50/40" : "border-slate-100 bg-slate-50"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
              <p className="mt-1.5 text-base font-bold text-slate-950">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Usage description */}
        <div className={`mt-4 rounded-[1.3rem] border p-4 ${popular ? "border-sky-100 bg-sky-50/30" : "border-slate-100 bg-slate-50"}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{usage.title}</p>
          <p className="mt-1.5 text-xs leading-6 text-slate-500">{usage.description}</p>
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <Link
          href={href}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold text-white shadow-lg transition-all ${
            popular
              ? "bg-gradient-to-b from-sky-500 to-sky-600 shadow-sky-500/25 hover:shadow-sky-500/40"
              : "bg-gradient-to-b from-slate-800 to-slate-950 shadow-slate-900/20 hover:shadow-slate-900/35"
          }`}
        >
          Buy eSIM
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
