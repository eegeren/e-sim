import { cache } from "react";
import { prisma } from "@/lib/db";
import { getMockRegionBySlugOrCode, mockCountries, mockPackages, mockRegions } from "@/lib/mock-data";
import { hasDatabase } from "@/lib/prisma";
import { serializeRegion } from "@/lib/serializers/region";

export const getActiveRegions = cache(async () => {
  if (!hasDatabase) {
    return mockRegions.map((region) =>
      serializeRegion({
        ...region,
        _count: {
          countries: mockCountries.filter((country) => country.regionCode === region.code).length,
          packages: mockPackages.filter((pkg) => pkg.regionCode === region.code).length,
        },
      }),
    );
  }

  const regions = await prisma.region.findMany({
    where: { active: true },
    include: {
      _count: {
        select: {
          countries: {
            where: { active: true },
          },
          packages: {
            where: { active: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return regions.map(serializeRegion);
});

export const getRegionBySlug = cache(async (slug: string) => {
  if (!hasDatabase) {
    const region = getMockRegionBySlugOrCode(slug);

    if (!region) {
      return null;
    }

    return serializeRegion({
      ...region,
      _count: {
        countries: mockCountries.filter((country) => country.regionCode === region.code).length,
        packages: mockPackages.filter((pkg) => pkg.regionCode === region.code).length,
      },
    });
  }

  const region = await prisma.region.findFirst({
    where: {
      slug,
      active: true,
    },
    include: {
      _count: {
        select: {
          countries: {
            where: { active: true },
          },
          packages: {
            where: { active: true },
          },
        },
      },
    },
  });

  return region ? serializeRegion(region) : null;
});

export const getRegionBySlugOrCode = cache(async (value: string) => {
  if (!hasDatabase) {
    const region = getMockRegionBySlugOrCode(value);

    if (!region) {
      return null;
    }

    return {
      ...region,
      _count: {
        countries: mockCountries.filter((country) => country.regionCode === region.code).length,
        packages: mockPackages.filter((pkg) => pkg.regionCode === region.code).length,
      },
    };
  }

  const lowered = value.toLowerCase();

  const region = await prisma.region.findFirst({
    where: {
      active: true,
      OR: [{ slug: lowered }, { code: value as never }],
    },
    include: {
      _count: {
        select: {
          countries: {
            where: { active: true },
          },
          packages: {
            where: { active: true },
          },
        },
      },
    },
  });

  return region;
});
