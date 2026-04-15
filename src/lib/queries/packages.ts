import { cache } from "react";
import { PackageScope, UsageType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";
import { getMockPackageById, getMockPackageBySlug, getMockPackages } from "@/lib/mock-data";
import { hasDatabase } from "@/lib/prisma";
import { serializePackage, serializePackageDetail } from "@/lib/serializers/package";

export type ActivePackageFilters = {
  country?: string;
  region?: string;
  usageType?: string;
  popular?: boolean;
};

const packageInclude = {
  country: true,
  region: true,
} as const;

function normalizeUsageType(value?: string) {
  if (!value) {
    return undefined;
  }

  const upper = value.toUpperCase();
  return Object.values(UsageType).includes(upper as UsageType) ? (upper as UsageType) : undefined;
}

export const getActivePackages = cache(async (filters?: ActivePackageFilters) => {
  const usageType = normalizeUsageType(filters?.usageType);

  if (!hasDatabase) {
    return getMockPackages({
      region: filters?.region,
      country: filters?.country,
      usageType,
      popular: filters?.popular,
    }).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      scope: item.scope,
      dataGb: item.dataGb,
      validityDays: item.validityDays,
      price: item.price,
      currency: item.currency,
      usageType: item.usageType,
      popular: item.popular,
      active: true,
      description: item.description,
      pricePerDay: (Number(item.price) / item.validityDays).toFixed(2),
      countryName: item.countrySlug ? getMockPackageBySlug(item.slug)?.country?.name ?? null : null,
      countrySlug: item.countrySlug,
      regionName: getMockPackageBySlug(item.slug)?.region?.name ?? null,
      regionSlug: getMockPackageBySlug(item.slug)?.region?.slug ?? null,
      supportedNetworks: item.networkSummary,
    }));
  }

  const packages = await prisma.package.findMany({
    where: {
      active: true,
      ...(filters?.country
        ? {
            country: {
              slug: filters.country,
              active: true,
            },
          }
        : {}),
      ...(filters?.region
        ? {
            OR: [
              {
                region: {
                  slug: filters.region,
                  active: true,
                },
              },
              {
                country: {
                  region: {
                    slug: filters.region,
                    active: true,
                  },
                  active: true,
                },
              },
              ...(filters.region === "global" ? [{ scope: PackageScope.GLOBAL }] : []),
            ],
          }
        : {}),
      ...(usageType ? { usageType } : {}),
      ...(typeof filters?.popular === "boolean" ? { popular: filters.popular } : {}),
    },
    include: packageInclude,
    orderBy: [{ popular: "desc" }, { sortOrder: "asc" }, { price: "asc" }],
  });

  return packages.map(serializePackage);
});

export const getPackageById = cache(async (id: string) => {
  if (!hasDatabase) {
    const pkg = getMockPackageById(id);

    if (!pkg) {
      return null;
    }

    return {
      id: pkg.id,
      name: pkg.name,
      slug: pkg.slug,
      scope: pkg.scope,
      dataGb: pkg.dataGb,
      validityDays: pkg.validityDays,
      price: pkg.price,
      currency: pkg.currency,
      usageType: pkg.usageType,
      popular: pkg.popular,
      active: true,
      description: pkg.description,
      pricePerDay: (Number(pkg.price) / pkg.validityDays).toFixed(2),
      countryName: pkg.country?.name ?? null,
      countrySlug: pkg.country?.slug ?? null,
      regionName: pkg.region?.name ?? null,
      regionSlug: pkg.region?.slug ?? null,
      supportedNetworks: pkg.networkSummary,
      deviceCompatibility: pkg.deviceCompatibility,
      activationPolicy: pkg.activationPolicy,
      refundPolicy: pkg.refundPolicy,
      installHeadline: pkg.installHeadline,
      faq: pkg.faq,
    };
  }

  const pkg = await prisma.package.findFirst({
    where: {
      id,
      active: true,
    },
    include: packageInclude,
  });

  return pkg ? serializePackageDetail(pkg) : null;
});

export const getPackagesForCountry = cache(async (countrySlug: string) =>
  getActivePackages({ country: countrySlug }),
);

export const getPopularPackages = cache(async () => {
  if (!hasDatabase) {
    return getActivePackages({ popular: true }).then((items) =>
      items.filter((item) => item.countryName === null).slice(0, 4),
    );
  }

  const packages = await prisma.package.findMany({
    where: {
      active: true,
      popular: true,
      scope: {
        in: [PackageScope.REGION, PackageScope.GLOBAL],
      },
    },
    include: packageInclude,
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
    take: 4,
  });

  return packages.map(serializePackage);
});

export const getPackages = getActivePackages;

export const getPackageByIdRecord = cache(async (packageId: string) =>
  !hasDatabase
    ? Promise.resolve(
        (() => {
          const item = getMockPackageById(packageId);
          return item ? { ...item, active: true } : null;
        })(),
      )
    : prisma.package.findFirst({
        where: { id: packageId, active: true },
        include: {
          country: {
            include: {
              networks: {
                where: { active: true },
                orderBy: { name: "asc" },
              },
            },
          },
          region: true,
          providerPlanMap: {
            include: { provider: true },
          },
        },
      }),
);

export const getPackageBySlugRecord = cache(async (slug: string) =>
  !hasDatabase
    ? Promise.resolve(
        (() => {
          const item = getMockPackageBySlug(slug);
          return item ? { ...item, active: true } : null;
        })(),
      )
    : prisma.package.findFirst({
        where: { slug, active: true },
        include: {
          country: {
            include: {
              networks: {
                where: { active: true },
                orderBy: { name: "asc" },
              },
            },
          },
          region: true,
          providerPlanMap: {
            include: { provider: true },
          },
        },
      }),
);
