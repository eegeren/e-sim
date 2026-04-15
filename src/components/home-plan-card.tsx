import Link from "next/link";
import { getPackageCoverageLabel, getPackagePriceMeta } from "@/lib/store";
import type { PackageScope, RegionCode } from "@/generated/prisma/enums";

type HomePlan = {
  id: string;
  slug: string;
  title: string;
  dataAmountGb: { toString(): string };
  validityDays: number;
  salePrice: { toString(): string };
  currency: string;
  isMostPopular: boolean;
  scope?: PackageScope | string;
  country?: { name: string } | null;
  region?: { code: RegionCode; name?: string } | null;
};

const themes = [
  {
    bar:    "from-sky-500 to-cyan-500",
    badge:  "bg-sky-50 text-sky-700 border-sky-200",
    btn:    "from-sky-500 to-sky-600 shadow-sky-500/25 hover:shadow-sky-500/40",
    stat:   "bg-sky-50/60 border-sky-100",
    ring:   "group-hover:ring-sky-200",
  },
  {
    bar:    "from-violet-500 to-purple-500",
    badge:  "bg-violet-50 text-violet-700 border-violet-200",
    btn:    "from-violet-500 to-violet-600 shadow-violet-500/25 hover:shadow-violet-500/40",
    stat:   "bg-violet-50/60 border-violet-100",
    ring:   "group-hover:ring-violet-200",
  },
  {
    bar:    "from-emerald-500 to-teal-500",
    badge:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    btn:    "from-emerald-500 to-emerald-600 shadow-emerald-500/25 hover:shadow-emerald-500/40",
    stat:   "bg-emerald-50/60 border-emerald-100",
    ring:   "group-hover:ring-emerald-200",
  },
] as const;

let _idx = 0;

export function HomePlanCard({ item }: { item: HomePlan }) {
  const pricing = getPackagePriceMeta(item);
  const theme = themes[_idx++ % themes.length];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[var(--card-shadow)] ring-2 ring-transparent transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--card-shadow-hover)] ${theme.ring}`}
    >
      {/* Color bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.bar}`} />

      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
              {getPackageCoverageLabel(item)}
            </p>
            <h3 className="mt-1.5 text-xl font-bold text-slate-950">{item.title}</h3>
          </div>
          {item.isMostPopular && (
            <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${theme.badge}`}>
              Best seller
            </span>
          )}
        </div>

        {/* Big price */}
        <div className="mt-6 flex items-end gap-1.5">
          <span className="font-mono text-4xl font-bold tracking-tight text-slate-950">
            {pricing.displayPrice}
          </span>
          <span className="mb-1 text-sm text-slate-400">/ plan</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">{pricing.displayPricePerDay} per day</p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {[
            { label: "Data",     value: `${item.dataAmountGb.toString()} GB` },
            { label: "Validity", value: `${item.validityDays} days` },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-[1.2rem] border px-4 py-3 transition-colors ${theme.stat}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
              <p className="mt-1.5 text-base font-bold text-slate-950">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <Link
          href={`/packages/${item.slug}`}
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b px-5 py-4 text-sm font-bold text-white shadow-lg transition-all ${theme.btn}`}
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
