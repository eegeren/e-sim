import type { Country, CountryNetwork, Package, Region } from "@/generated/prisma/client";
import type { CountryDetail, CountryListItem } from "@/types/api";
import { serializePackage } from "@/lib/serializers/package";

type CountryRecord = Country & {
  region: Region;
  networks: CountryNetwork[];
  packages?: Array<
    Package & {
      country?: Country | null;
      region?: Region | null;
    }
  >;
  _count?: {
    packages: number;
  };
};

export function serializeCountryListItem(item: CountryRecord): CountryListItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    isoCode: item.isoCode,
    flag: item.flag,
    description: item.description,
    region: {
      id: item.region.id,
      code: item.region.code,
      name: item.region.name,
      slug: item.region.slug,
    },
    supportedNetworks: item.networks.filter((network) => network.active).map((network) => network.name),
    active: item.active,
    packageCount: item._count?.packages ?? item.packages?.length ?? 0,
  };
}

export function serializeCountryDetail(item: CountryRecord): CountryDetail {
  return {
    ...serializeCountryListItem(item),
    heroTitle: item.heroTitle,
    tagline: item.tagline,
    deviceCompatibility: item.deviceCompatibility,
    activationPolicy: item.activationPolicy,
    refundPolicy: item.refundPolicy,
    faq: item.faq,
    packages: (item.packages ?? []).map((pkg) =>
      serializePackage({
        ...pkg,
        country: pkg.country ?? {
          id: item.id,
          name: item.name,
          slug: item.slug,
          isoCode: item.isoCode,
          flag: item.flag,
          regionId: item.regionId,
          description: item.description,
          heroTitle: item.heroTitle,
          tagline: item.tagline,
          deviceCompatibility: item.deviceCompatibility,
          activationPolicy: item.activationPolicy,
          refundPolicy: item.refundPolicy,
          faq: item.faq,
          seoTitle: item.seoTitle,
          seoDescription: item.seoDescription,
          active: item.active,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
        region: pkg.region ?? item.region,
      }),
    ),
  };
}

export const serializeCountry = serializeCountryListItem;
