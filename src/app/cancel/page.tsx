import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function CancelPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-sm">
        <span className="inline-flex rounded-full bg-slate-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
          Checkout canceled
        </span>
        <h1 className="mt-5 font-mono text-4xl font-bold text-slate-950">
          Payment was not completed
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          No charge was made. You can return to the catalog, adjust the package choice or try a coupon before starting checkout again.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Return home
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
