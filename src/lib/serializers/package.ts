import type { Country, Package, Region } from "@/generated/prisma/client";
import type { PackageDetail, PackageListItem } from "@/types/api";
import { calculatePricePerDay } from "@/lib/pricing";
import { toMoneyString } from "@/lib/utils/money";

type PackageRecord = Package & {
  country?: Country | null;
  region?: Region | null;
};

export function serializePackage(item: PackageRecord): PackageListItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    scope: item.scope,
    dataGb: toMoneyString(item.dataGb),
    validityDays: item.validityDays,
    price: toMoneyString(item.price),
    currency: item.currency,
    usageType: item.usageType,
    popular: item.popular,
    active: item.active,
    description: item.description,
    pricePerDay: calculatePricePerDay(item.price.toString(), item.validityDays),
    countryName: item.country?.name ?? null,
    countrySlug: item.country?.slug ?? null,
    regionName: item.region?.name ?? item.country?.name ?? null,
    regionSlug: item.region?.slug ?? null,
    supportedNetworks: item.networkSummary,
  };
}

export function serializePackageDetail(item: PackageRecord): PackageDetail {
  return {
    ...serializePackage(item),
    deviceCompatibility: item.deviceCompatibility,
    activationPolicy: item.activationPolicy,
    refundPolicy: item.refundPolicy,
    installHeadline: item.installHeadline,
    faq: item.faq,
  };
}
