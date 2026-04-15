import { cache } from "react";
import { prisma } from "@/lib/db";
import { getMockCountries, getMockCountryBySlug, getMockPackages, getMockRegionBySlugOrCode } from "@/lib/mock-data";
import { hasDatabase } from "@/lib/prisma";
import { serializeCountryDetail, serializeCountryListItem } from "@/lib/serializers/country";

const activeCountryInclude = {
  region: true,
  networks: {
    where: { active: true },
    orderBy: { name: "asc" as const },
  },
  _count: {
    select: {
      packages: {
        where: { active: true },
      },
    },
  },
} as const;

export const getActiveCountries = cache(async (input?: { region?: string; q?: string }) => {
  const query = input?.q?.trim();
  const regionSlug = input?.region?.trim().toLowerCase();

  if (!hasDatabase) {
    return getMockCountries({ region: regionSlug, q: query }).map((country) => {
      const region = getMockRegionBySlugOrCode(country.regionCode)!;

      return {
        id: country.id,
        name: country.name,
        slug: country.slug,
        isoCode: country.isoCode,
        flag: country.flag,
        description: country.description,
        region: {
          id: region.id,
          code: region.code,
          name: region.name,
          slug: region.slug,
        },
        supportedNetworks: country.supportedNetworks,
        active: true,
        packageCount: getMockPackages({ country: country.slug }).length,
      };
    });
  }

  const countries = await prisma.country.findMany({
    where: {
      active: true,
      ...(regionSlug ? { region: { slug: regionSlug, active: true } } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { isoCode: { contains: query.toUpperCase() } },
            ],
          }
        : {}),
    },
    include: activeCountryInclude,
    orderBy: { name: "asc" },
  });

  return countries.map(serializeCountryListItem);
});

export const getCountryBySlug = cache(async (slug: string) => {
  if (!hasDatabase) {
    const country = getMockCountryBySlug(slug);

    if (!country || !country.region) {
      return null;
    }

    return {
      id: country.id,
      name: country.name,
      slug: country.slug,
      isoCode: country.isoCode,
      flag: country.flag,
      description: country.description,
      region: {
        id: country.region.id,
        code: country.region.code,
        name: country.region.name,
        slug: country.region.slug,
      },
      supportedNetworks: country.supportedNetworks,
      active: true,
      packageCount: country.packages.length,
      heroTitle: country.heroTitle,
      tagline: country.tagline,
      deviceCompatibility: country.deviceCompatibility,
      activationPolicy: country.activationPolicy,
      refundPolicy: country.refundPolicy,
      faq: country.faq,
      packages: country.packages.map((item) => ({
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
        countryName: country.name,
        countrySlug: country.slug,
        regionName: country.region?.name ?? null,
        regionSlug: country.region?.slug ?? null,
        supportedNetworks: item.networkSummary,
      })),
    };
  }

  const country = await prisma.country.findFirst({
    where: {
      slug,
      active: true,
      region: {
        active: true,
      },
    },
    include: {
      region: true,
      networks: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
      packages: {
        where: { active: true },
        include: {
          country: true,
          region: true,
        },
        orderBy: [{ popular: "desc" }, { sortOrder: "asc" }, { price: "asc" }],
      },
      _count: {
        select: {
          packages: {
            where: { active: true },
          },
        },
      },
    },
  });

  return country ? serializeCountryDetail(country) : null;
});

export const getCountriesByRegion = cache(async (regionSlug: string) => {
  if (!hasDatabase) {
    return getActiveCountries({ region: regionSlug });
  }

  const countries = await prisma.country.findMany({
    where: {
      active: true,
      region: {
        slug: regionSlug,
        active: true,
      },
    },
    include: activeCountryInclude,
    orderBy: { name: "asc" },
  });

  return countries.map(serializeCountryListItem);
});

export const getCountryBySlugRecord = cache(async (slug: string) =>
  !hasDatabase
    ? Promise.resolve(
        (() => {
          const country = getMockCountryBySlug(slug);

          if (!country) {
            return null;
          }

          return {
            ...country,
            active: true,
            packages: country.packages.map((item) => ({
              ...item,
              active: true,
            })),
          };
        })(),
      )
    : prisma.country.findFirst({
        where: {
          slug,
          active: true,
          region: {
            active: true,
          },
        },
        include: {
          region: true,
          networks: {
            where: { active: true },
            orderBy: { name: "asc" },
          },
          packages: {
            where: { active: true },
            include: {
              country: true,
              region: true,
            },
            orderBy: [{ popular: "desc" }, { sortOrder: "asc" }, { price: "asc" }],
          },
          _count: {
            select: {
              packages: {
                where: { active: true },
              },
            },
          },
        },
      }),
);
