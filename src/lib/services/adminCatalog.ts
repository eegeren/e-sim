import { PackageScope } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";
import type { CountryCreateInput, CountryUpdateInput } from "@/lib/validators/country";
import type { PackageCreateInput, PackageUpdateInput } from "@/lib/validators/package";
import { createApiError } from "@/lib/api";
import { serializeCountryDetail } from "@/lib/serializers/country";
import { serializePackageDetail } from "@/lib/serializers/package";

function buildCountryDefaults(input: {
  name: string;
  description: string;
}) {
  return {
    heroTitle: `${input.name} travel eSIM`,
    tagline: input.description,
    deviceCompatibility:
      "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and most recent flagship devices.",
    activationPolicy:
      "Install anytime. Validity starts when the eSIM first connects in the destination.",
    refundPolicy:
      "Unused plans are eligible for review before activation. Activated plans are reviewed only for service issues.",
    faq: [],
  };
}

function buildPackageDefaults(input: {
  name: string;
  description: string;
}) {
  return {
    networkSummary: [],
    deviceCompatibility: "Unlocked eSIM-compatible phones and tablets.",
    activationPolicy: "Validity starts when the eSIM first connects on a supported network.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: input.name,
    faq: [],
    description: input.description,
  };
}

function derivePackageScope(input: { countryId: string | null; regionId: string | null }) {
  if (input.countryId) {
    return PackageScope.COUNTRY;
  }

  return input.regionId ? PackageScope.REGION : PackageScope.GLOBAL;
}

async function syncProviderPlanMap(input: {
  packageId: string;
  providerId?: string | null;
  providerPlanCode?: string | null;
  active: boolean;
}) {
  if (typeof input.providerId === "undefined") {
    if (typeof input.providerPlanCode !== "undefined" && input.providerPlanCode) {
      await prisma.providerPlanMap.updateMany({
        where: { packageId: input.packageId },
        data: {
          providerPlanCode: input.providerPlanCode,
          active: input.active,
        },
      });
    }
    return;
  }

  if (!input.providerId) {
    await prisma.providerPlanMap.deleteMany({
      where: { packageId: input.packageId },
    });
    return;
  }

  const provider = await prisma.provider.findUnique({
    where: { id: input.providerId },
  });

  if (!provider || !provider.active) {
    throw createApiError("NOT_FOUND", "Provider not found.", 404);
  }

  await prisma.providerPlanMap.upsert({
    where: { packageId: input.packageId },
    update: {
      providerId: input.providerId,
      providerPlanCode: input.providerPlanCode ?? `${provider.code}-${input.packageId}`,
      active: input.active,
    },
    create: {
      providerId: input.providerId,
      packageId: input.packageId,
      providerPlanCode: input.providerPlanCode ?? `${provider.code}-${input.packageId}`,
      active: input.active,
    },
  });
}

export async function createCountry(input: CountryCreateInput) {
  const region = await prisma.region.findFirst({
    where: { id: input.regionId, active: true },
  });

  if (!region) {
    throw createApiError("NOT_FOUND", "Region not found.", 404);
  }

  const defaults = buildCountryDefaults(input);

  const country = await prisma.country.create({
    data: {
      name: input.name,
      slug: input.slug,
      isoCode: input.isoCode,
      flag: input.flag,
      regionId: input.regionId,
      description: input.description,
      active: input.active,
      ...defaults,
      networks: {
        create: input.supportedNetworks.map((name) => ({
          name,
          active: true,
        })),
      },
    },
    include: {
      region: true,
      networks: {
        where: { active: true },
        orderBy: { name: "asc" },
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

  return serializeCountryDetail({
    ...country,
    packages: [],
  });
}

export async function updateCountry(id: string, input: CountryUpdateInput) {
  const existing = await prisma.country.findUnique({
    where: { id },
    include: {
      networks: true,
    },
  });

  if (!existing) {
    throw createApiError("NOT_FOUND", "Country not found.", 404);
  }

  if (input.regionId) {
    const region = await prisma.region.findFirst({
      where: { id: input.regionId, active: true },
    });

    if (!region) {
      throw createApiError("NOT_FOUND", "Region not found.", 404);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.country.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.slug ? { slug: input.slug } : {}),
        ...(input.isoCode ? { isoCode: input.isoCode } : {}),
        ...(input.flag ? { flag: input.flag } : {}),
        ...(input.regionId ? { regionId: input.regionId } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(typeof input.active === "boolean" ? { active: input.active } : {}),
        ...(input.name ? { heroTitle: `${input.name} travel eSIM` } : {}),
        ...(input.description ? { tagline: input.description } : {}),
      },
    });

    if (input.supportedNetworks) {
      await tx.countryNetwork.deleteMany({
        where: { countryId: id },
      });

      await tx.countryNetwork.createMany({
        data: input.supportedNetworks.map((name) => ({
          countryId: id,
          name,
          active: true,
        })),
      });
    }
  });

  const country = await prisma.country.findUnique({
    where: { id },
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

  if (!country) {
    throw createApiError("NOT_FOUND", "Country not found.", 404);
  }

  return serializeCountryDetail(country);
}

export async function createPackage(input: PackageCreateInput) {
  if (input.countryId) {
    const country = await prisma.country.findFirst({
      where: { id: input.countryId, active: true },
    });

    if (!country) {
      throw createApiError("NOT_FOUND", "Country not found.", 404);
    }
  }

  if (input.regionId) {
    const region = await prisma.region.findFirst({
      where: { id: input.regionId, active: true },
    });

    if (!region) {
      throw createApiError("NOT_FOUND", "Region not found.", 404);
    }
  }

  const defaults = buildPackageDefaults(input);

  const packageRecord = await prisma.package.create({
    data: {
      name: input.name,
      slug: input.slug,
      countryId: input.countryId,
      regionId: input.regionId,
      scope: derivePackageScope(input),
      dataGb: input.dataGb,
      validityDays: input.validityDays,
      price: input.price,
      currency: input.currency,
      usageType: input.usageType,
      popular: input.popular,
      active: input.active,
      ...defaults,
    },
    include: {
      country: true,
      region: true,
    },
  });

  await syncProviderPlanMap({
    packageId: packageRecord.id,
    providerId: input.providerId,
    providerPlanCode: input.providerPlanCode,
    active: packageRecord.active,
  });

  const hydrated = await prisma.package.findUnique({
    where: { id: packageRecord.id },
    include: {
      country: true,
      region: true,
    },
  });

  if (!hydrated) {
    throw createApiError("NOT_FOUND", "Package not found.", 404);
  }

  return serializePackageDetail(hydrated);
}

export async function updatePackage(id: string, input: PackageUpdateInput) {
  const existing = await prisma.package.findUnique({
    where: { id },
  });

  if (!existing) {
    throw createApiError("NOT_FOUND", "Package not found.", 404);
  }

  const countryId = typeof input.countryId === "undefined" ? existing.countryId : input.countryId;
  const regionId = typeof input.regionId === "undefined" ? existing.regionId : input.regionId;

  if (!countryId && !regionId) {
    throw createApiError("VALIDATION_ERROR", "Package must belong to either a country or a region.", 400);
  }

  if (countryId) {
    const country = await prisma.country.findFirst({
      where: { id: countryId, active: true },
    });

    if (!country) {
      throw createApiError("NOT_FOUND", "Country not found.", 404);
    }
  }

  if (regionId) {
    const region = await prisma.region.findFirst({
      where: { id: regionId, active: true },
    });

    if (!region) {
      throw createApiError("NOT_FOUND", "Region not found.", 404);
    }
  }

  await prisma.package.update({
    where: { id },
    data: {
      ...(typeof input.name === "string" ? { name: input.name, installHeadline: input.name } : {}),
      ...(input.slug ? { slug: input.slug } : {}),
      ...(typeof input.countryId !== "undefined" ? { countryId: input.countryId } : {}),
      ...(typeof input.regionId !== "undefined" ? { regionId: input.regionId } : {}),
      scope: derivePackageScope({ countryId, regionId }),
      ...(input.dataGb ? { dataGb: input.dataGb } : {}),
      ...(typeof input.validityDays === "number" ? { validityDays: input.validityDays } : {}),
      ...(input.price ? { price: input.price } : {}),
      ...(input.currency ? { currency: input.currency } : {}),
      ...(input.usageType ? { usageType: input.usageType } : {}),
      ...(typeof input.popular === "boolean" ? { popular: input.popular } : {}),
      ...(typeof input.active === "boolean" ? { active: input.active } : {}),
      ...(input.description ? { description: input.description } : {}),
    },
  });

  await syncProviderPlanMap({
    packageId: id,
    providerId: input.providerId,
    providerPlanCode: input.providerPlanCode,
    active: typeof input.active === "boolean" ? input.active : existing.active,
  });

  const hydrated = await prisma.package.findUnique({
    where: { id },
    include: {
      country: true,
      region: true,
    },
  });

  if (!hydrated) {
    throw createApiError("NOT_FOUND", "Package not found.", 404);
  }

  return serializePackageDetail(hydrated);
}
