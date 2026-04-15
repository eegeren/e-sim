import Image from "next/image";
import { CopyCodeButton } from "@/components/copy-code-button";
import { InstructionGrid } from "@/components/instruction-grid";
import { ResendDeliveryButton } from "@/components/order/resend-delivery-button";
import { SiteShell } from "@/components/site-shell";
import { StatusBadge } from "@/components/status-badge";
import { androidSteps, iphoneSteps } from "@/lib/content";
import { formatPrice, getOrderById } from "@/lib/store";

type OrderData = Awaited<ReturnType<typeof getOrderById>>;

export function OrderDetailShell({ order }: { order: OrderData }) {
  const latestDelivery = order.deliveries[0];

  return (
    <SiteShell>
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

        {/* ── Sidebar ── */}
        <aside className="space-y-4">
          {/* Order summary card */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[var(--card-shadow)]">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">Order reference</p>
                  <p className="mt-1 break-all font-mono text-sm font-bold text-slate-950">{order.id}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: "Package",  value: order.package.title },
                { label: "Coverage", value: order.package.country?.name ?? order.package.region?.name ?? "Global" },
                { label: "Email",    value: order.email },
                { label: "Total",    value: formatPrice(order.totalAmount.toString(), order.currency) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-xs text-slate-500">{row.label}</span>
                  <span className="text-right text-sm font-semibold text-slate-950">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Help card */}
          <div className="rounded-[1.8rem] border border-slate-200/60 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Need help?</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the resend button if your email didn&apos;t arrive. Check spam if you still don&apos;t see it.
            </p>
            <div className="mt-4">
              <ResendDeliveryButton orderId={order.id} />
            </div>
          </div>
        </aside>

        {/* ── Main delivery ── */}
        <section className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[var(--card-shadow)]">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-sky-600">eSIM delivery</p>
            <h2 className="mt-1.5 font-mono text-2xl font-bold text-slate-950">
              QR code &amp; activation details
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            {order.status === "FAILED" ? (
              <div className="rounded-[1.8rem] border border-rose-200 bg-rose-50 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-4 text-base font-bold text-rose-900">Provisioning issue</p>
                <p className="mt-2 text-sm leading-7 text-rose-700">
                  Our team can still help you get online. Keep this order ID and contact support if delivery doesn&apos;t appear soon.
                </p>
              </div>
            ) : order.qrCodeUrl ? (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                {/* QR code */}
                <div className="flex flex-col items-center justify-center rounded-[1.8rem] border border-slate-100 bg-slate-50 p-5">
                  <Image
                    src={order.qrCodeUrl}
                    alt="eSIM QR code"
                    width={280}
                    height={280}
                    unoptimized
                    className="h-auto w-full max-w-[240px] rounded-[1.2rem]"
                  />
                  <p className="mt-4 text-center text-xs text-slate-400">
                    Scan in Settings → Mobile Data → Add eSIM
                  </p>
                </div>

                {/* Codes */}
                <div className="space-y-3">
                  {[
                    { label: "Manual activation code", value: order.manualCode },
                    { label: "Activation code",        value: order.activationCode },
                    { label: "ICCID",                  value: latestDelivery?.iccid },
                    { label: "SM-DP+ address",         value: latestDelivery?.smdpAddress },
                  ].map((c) => (
                    <div key={c.label} className="rounded-[1.2rem] border border-slate-100 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{c.label}</p>
                      <p className="mt-1.5 break-all font-mono text-sm font-semibold text-slate-950">
                        {c.value ?? "—"}
                      </p>
                    </div>
                  ))}
                  {order.activationCode && (
                    <CopyCodeButton value={order.activationCode} label="Copy activation code" />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-sky-600 animate-spin" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-4 text-base font-bold text-slate-900">
                  {order.status === "PAID" || order.status === "PROVISIONING"
                    ? "Preparing your eSIM…"
                    : "Waiting for payment confirmation"}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Refresh in a moment. QR code, activation code and instructions will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      <InstructionGrid iphoneSteps={iphoneSteps} androidSteps={androidSteps} />

      {/* Troubleshooting */}
      <section className="space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Troubleshooting</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: "📷",
              title: "QR not scanning",
              body: "Increase screen brightness, zoom in slightly, or use the manual activation code instead.",
            },
            {
              icon: "📶",
              title: "No signal after install",
              body: "Make sure the esimQ eSIM is selected for mobile data, then toggle airplane mode once.",
            },
            {
              icon: "🔄",
              title: "Enable data roaming",
              body: "Turn on data roaming for the esimQ eSIM line after arrival — most travel plans require it.",
            },
          ].map((t) => (
            <article
              key={t.title}
              className="rounded-[1.8rem] border border-slate-200/60 bg-white p-6 shadow-[var(--card-shadow)]"
            >
              <span className="text-2xl">{t.icon}</span>
              <h3 className="mt-3 text-[15px] font-bold text-slate-950">{t.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{t.body}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
