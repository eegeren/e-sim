import {
  createCountryAction,
  createCouponAction,
  createPackageAction,
  deleteCouponAction,
  deleteCountryAction,
  deletePackageAction,
  refundOrderAction,
  resendOrderEmailAction,
  updateCouponAction,
  updateCountryAction,
  updatePackageAction,
} from "@/app/admin/actions";
import { CurrencyCode, DiscountType, PackageScope, UsageType } from "@/generated/prisma/enums";
import { SiteShell } from "@/components/site-shell";
import { StatusBadge } from "@/components/status-badge";
import { formatPrice, getAdminDashboardData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <SiteShell>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total revenue", value: formatPrice(dashboard.kpis.grossRevenue, "USD") },
          { label: "Total orders", value: String(dashboard.kpis.totalOrders) },
          { label: "Average order value", value: formatPrice(dashboard.kpis.averageOrderValue, "USD") },
          { label: "Pending orders", value: String(dashboard.kpis.pendingCount) },
        ].map((item) => (
          <div key={item.label} className="card-surface rounded-[1.75rem] border border-white/80 p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Create country</h2>
          <form action={createCountryAction} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Japan" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="slug" placeholder="japan" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="isoCode" placeholder="JP" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="flag" placeholder="🇯🇵" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <select name="regionCode" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              {dashboard.regions.map((region) => (
                <option key={region.id} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <input name="networks" placeholder="NTT Docomo, SoftBank, KDDI au" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="heroTitle" placeholder="Japan travel eSIM" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="tagline" placeholder="Reliable data across Tokyo, Kyoto and major rail routes." className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <textarea name="description" placeholder="Country description" className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="deviceCompatibility" placeholder="Unlocked eSIM-compatible devices" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="activationPolicy" placeholder="Starts on first connection in destination" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="refundPolicy" placeholder="Unused plans may be reviewed before activation" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="active" defaultChecked />
              Active
            </label>
            <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Create country
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Create package</h2>
          <form action={createPackageAction} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Japan Explorer" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="slug" placeholder="japan-explorer-5gb" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <select name="scope" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              {Object.values(PackageScope).map((scope) => (
                <option key={scope} value={scope}>
                  {scope}
                </option>
              ))}
            </select>
            <select name="countryId" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <option value="">No country</option>
              {dashboard.countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            <select name="regionId" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <option value="">No region</option>
              {dashboard.regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            <select name="providerCode" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <option value="">No provider</option>
              {dashboard.providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            <input name="dataGb" placeholder="5" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="validityDays" placeholder="15" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="price" placeholder="12.50" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <select name="currency" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              {Object.values(CurrencyCode).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <select name="usageType" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              {Object.values(UsageType).map((usageType) => (
                <option key={usageType} value={usageType}>
                  {usageType}
                </option>
              ))}
            </select>
            <input name="installHeadline" placeholder="Best for most travelers" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <textarea name="description" placeholder="Package description" className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="networkSummary" placeholder="Orange, SFR, Bouygues Telecom" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="deviceCompatibility" placeholder="Unlocked eSIM-compatible phones" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="activationPolicy" placeholder="Starts on first supported network connection" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <input name="refundPolicy" placeholder="Unused plans may be reviewed before activation" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="popular" />
              Popular
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="active" defaultChecked />
              Active
            </label>
            <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Create package
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Create coupon</h2>
          <form action={createCouponAction} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input name="code" placeholder="WELCOME10" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <select name="discountType" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              {Object.values(DiscountType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input name="discountValue" placeholder="10" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="minimumOrderValue" placeholder="25" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="maxUses" placeholder="500" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="expiryDate" type="date" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            <input name="description" placeholder="10% off first order" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2" />
            <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Create coupon
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Analytics</h2>
          <div className="mt-5 grid gap-3">
            {dashboard.eventSummary.map((event) => (
              <div key={event.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-600">{event.name}</span>
                <span className="font-semibold text-slate-950">{event.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Countries</h2>
        <div className="grid gap-4">
          {dashboard.countries.map((country) => (
            <form key={country.id} action={updateCountryAction} className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-sm lg:grid-cols-2">
              <input type="hidden" name="id" value={country.id} />
              <input name="name" defaultValue={country.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="slug" defaultValue={country.slug} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="isoCode" defaultValue={country.code} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="flag" defaultValue={country.flag} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <select name="regionCode" defaultValue={country.region.code} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                {dashboard.regions.map((region) => (
                  <option key={region.id} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
              <input name="networks" defaultValue={country.supportedNetworks.join(", ")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="heroTitle" defaultValue={country.heroTitle} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="tagline" defaultValue={country.tagline} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <textarea name="description" defaultValue={country.description} className="min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="deviceCompatibility" defaultValue={country.deviceCompatibility} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="activationPolicy" defaultValue={country.activationPolicy} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="refundPolicy" defaultValue={country.refundPolicy} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="active" defaultChecked={country.active} />
                Active
              </label>
              <div className="flex gap-2">
                <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                  Save
                </button>
                <button formAction={deleteCountryAction} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Deactivate
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Packages</h2>
        <div className="grid gap-4">
          {dashboard.packages.map((item) => (
            <form key={item.id} action={updatePackageAction} className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-sm lg:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <input name="name" defaultValue={item.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="slug" defaultValue={item.slug} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <select name="scope" defaultValue={item.scope} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                {Object.values(PackageScope).map((scope) => (
                  <option key={scope} value={scope}>
                    {scope}
                  </option>
                ))}
              </select>
              <select name="countryId" defaultValue={item.countryId ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <option value="">No country</option>
                {dashboard.countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select name="regionId" defaultValue={item.regionId ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <option value="">No region</option>
                {dashboard.regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
              <select name="providerCode" defaultValue={item.providerPlanMap?.providerId ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <option value="">No provider</option>
                {dashboard.providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              <input name="dataGb" defaultValue={item.dataAmountGb.toString()} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="validityDays" defaultValue={item.validityDays} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="price" defaultValue={item.salePrice.toString()} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <select name="currency" defaultValue={item.currency} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                {Object.values(CurrencyCode).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <select name="usageType" defaultValue={item.usageProfile} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                {Object.values(UsageType).map((usageType) => (
                  <option key={usageType} value={usageType}>
                    {usageType}
                  </option>
                ))}
              </select>
              <input name="installHeadline" defaultValue={item.installHeadline} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <textarea name="description" defaultValue={item.description} className="min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="networkSummary" defaultValue={item.supportedNetworks.join(", ")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="deviceCompatibility" defaultValue={item.deviceCompatibility} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="activationPolicy" defaultValue={item.activationPolicy} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <input name="refundPolicy" defaultValue={item.refundPolicy} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="active" defaultChecked={item.isActive} />
                Active
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="popular" defaultChecked={item.isMostPopular} />
                Popular
              </label>
              <div className="flex gap-2">
                <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                  Save
                </button>
                <button formAction={deletePackageAction} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Deactivate
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Coupons</h2>
        <div className="grid gap-4">
          {dashboard.coupons.map((coupon) => (
            <form key={coupon.id} action={updateCouponAction} className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto_auto]">
              <input type="hidden" name="id" value={coupon.id} />
              <input name="description" defaultValue={coupon.description ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <select name="discountType" defaultValue={coupon.discountType} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                {Object.values(DiscountType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input name="discountValue" defaultValue={coupon.discountValue.toString()} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="maxUses" defaultValue={coupon.maxUses ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input name="expiryDate" type="date" defaultValue={coupon.expiryDate?.toISOString().slice(0, 10) ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <input type="checkbox" name="active" defaultChecked={coupon.active} />
                  Active
                </label>
                <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                  Save
                </button>
                <button formAction={deleteCouponAction} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Orders</h2>
        <div className="grid gap-4">
          {dashboard.orders.map((order) => (
            <div key={order.id} className="rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{order.email}</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-950">{order.package.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.package.country?.name ?? order.package.region?.name ?? "Global"} • {formatPrice(order.totalAmount.toString(), order.currency)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={order.status} />
                  <form action={resendOrderEmailAction}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                      Resend QR delivery
                    </button>
                  </form>
                  {order.status !== "REFUNDED" ? (
                    <form action={refundOrderAction}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <button className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                        Refund
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
