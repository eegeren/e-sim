import Link from "next/link";
import { DEFAULT_TAX_RATE, calculatePricePerDay, formatPrice } from "@/lib/pricing";
import { getPackageById } from "@/lib/store";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { SiteShell } from "@/components/site-shell";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{
    coupon?: string;
    affiliate?: string;
    referral?: string;
    error?: string;
  }>;
}) {
  const { packageId } = await params;
  const state = await searchParams;
  const item = await getPackageById(packageId);
  const price = Number(item.salePrice);
  const tax = price * DEFAULT_TAX_RATE;
  const total = price + tax;

  return (
    <SiteShell compact>
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* ── LEFT: Summary ── */}
        <div className="space-y-6">
          <Link
            href={`/packages/${item.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 8H3M7 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to package
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600">Checkout</p>
            <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Complete your purchase
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Processed securely by Stripe. Your eSIM QR code is delivered automatically after payment.
            </p>
          </div>

          {/* Plan summary card */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[var(--card-shadow)]">
            {/* Header */}
            <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    {item.country?.name ?? item.region?.name ?? "Global"}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">{item.title}</h2>
                </div>
                {item.isMostPopular ? (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">
                    Best seller
                  </span>
                ) : null}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 p-6">
              {[
                { label: "Coverage", value: item.country?.name ?? item.region?.name ?? "Global" },
                { label: "Data", value: `${item.dataAmountGb.toString()} GB` },
                { label: "Validity", value: `${item.validityDays} days` },
                {
                  label: "Price / day",
                  value: formatPrice(
                    calculatePricePerDay(item.salePrice.toString(), item.validityDays),
                    item.currency,
                  ),
                },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.2rem] bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                  <p className="mt-1.5 text-base font-bold text-slate-950">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div className="rounded-[1.8rem] border border-slate-200/60 bg-slate-50/80 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">What happens next</p>
            <ul className="mt-4 space-y-3">
              {[
                "You're redirected to Stripe's hosted checkout",
                "After payment, your QR code is generated instantly",
                "Delivery email sent with QR + activation instructions",
                "Scan & go online — no physical SIM needed",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <aside className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[var(--card-shadow)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                Order summary
              </p>
              <h2 className="mt-1.5 text-xl font-bold text-slate-950">{item.title}</h2>
            </div>
            {item.isMostPopular ? (
              <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">
                Best seller
              </span>
            ) : null}
          </div>

          {state.error ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-5.25v-3.5h1.5v3.5h-1.5zm0 2.75v-1.5h1.5v1.5h-1.5z" clipRule="evenodd" />
              </svg>
              {decodeURIComponent(state.error)}
            </div>
          ) : null}

          {/* Price breakdown */}
          <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-4">
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(price, item.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated tax</span>
                <span className="font-semibold">{formatPrice(tax, item.currency)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-950">
                <span>Total</span>
                <span>{formatPrice(total, item.currency)}</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-400">
              Coupon discounts are applied server-side before the Stripe session is created.
            </p>
          </div>

          <CheckoutForm
            packageId={item.id}
            couponCode={state.coupon}
            affiliateCode={state.affiliate}
            referralCode={state.referral}
          />
        </aside>
      </section>
    </SiteShell>
  );
}
