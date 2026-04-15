"use client";

import { useState, useTransition } from "react";

export function CheckoutForm({
  packageId,
  couponCode,
  affiliateCode,
  referralCode,
}: {
  packageId: string;
  couponCode?: string;
  affiliateCode?: string;
  referralCode?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const response = await fetch("/api/checkout/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              packageId,
              email: String(formData.get("email") ?? ""),
              couponCode: String(formData.get("couponCode") ?? "") || null,
              affiliateCode,
              referralCode,
            }),
          });

          const payload = await response.json().catch(() => null);

          if (!response.ok) {
            setError(payload?.error?.message ?? "Unable to start checkout.");
            return;
          }

          const checkoutUrl = payload?.data?.checkoutUrl;
          if (!checkoutUrl) {
            setError("Stripe checkout URL was not returned.");
            return;
          }

          window.location.href = checkoutUrl;
        });
      }}
    >
      <input type="hidden" name="packageId" value={packageId} />
      <input type="hidden" name="affiliateCode" value={affiliateCode ?? ""} />
      <input type="hidden" name="referralCode" value={referralCode ?? ""} />

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-5.25v-3.5h1.5v3.5h-1.5zm0 2.75v-1.5h1.5v1.5h-1.5z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 6l7 5 7-5M3 6h14v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Delivery email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="input-field w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white"
        />
        <p className="text-xs text-slate-400">Your QR code will be delivered to this address.</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="couponCode" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9.5 2.5 17.5 10.5l-7 7-8-8V2.5z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
          </svg>
          Coupon code
          <span className="ml-auto text-xs font-medium text-slate-400">Optional</span>
        </label>
        <input
          id="couponCode"
          name="couponCode"
          defaultValue={couponCode ?? ""}
          placeholder="e.g. WELCOME10"
          className="input-field w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Redirecting to Stripe…
            </>
          ) : (
            <>
              Continue to Stripe
              <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </span>
      </button>

      {/* Stripe trust badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l7 3v5c0 4.5-2.8 7.9-7 10-4.2-2.1-7-5.5-7-10V6l7-3Z" />
        </svg>
        Secured by Stripe · SSL encrypted
      </div>
    </form>
  );
}
