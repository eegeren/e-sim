import { cache } from "react";
import { notFound } from "next/navigation";
import {
  AnalyticsEventName,
  OrderStatus,
  PackageScope,
  RegionCode,
  UsageType,
} from "@/generated/prisma/enums";
import { trackEvent } from "@/lib/analytics";
import { regionLabels, usageLabels } from "@/lib/content";
import {
  getMockAdminDashboardData,
  getMockCountries,
  getMockCountryBySlug,
  getMockPackageById,
  getMockPackageBySlug,
  getMockPackages,
  getMockRegionBySlugOrCode,
  mockRegions,
} from "@/lib/mock-data";
import { hasDatabase, prisma } from "@/lib/prisma";
import { calculatePricePerDay, formatPrice } from "@/lib/pricing";
import { getActiveCountries, getCountryBySlugRecord } from "@/lib/queries/countries";
import {
  getPackageByIdRecord,
  getPackageBySlugRecord,
  getPackages,
  getPopularPackages,
} from "@/lib/queries/packages";
import { getActiveRegions, getRegionBySlugOrCode } from "@/lib/queries/regions";
import { serializeCountry } from "@/lib/serializers/country";

export { formatPrice };

function createUiPackage<T extends {
  id: string;
  name: string;
  slug: string;
  dataGb: { toString(): string };
  validityDays: number;
  price: { toString(): string };
  currency: string;
  usageType: UsageType;
  popular: boolean;
  active: boolean;
  description: string;
  networkSummary: string[];
  deviceCompatibility: string;
  activationPolicy: string;
  refundPolicy: string;
  installHeadline: string;
  faq: unknown;
  country?: { name: string; slug: string; isoCode: string } | null;
  region?: { code: RegionCode; name: string; slug: string } | null;
}>(item: T) {
  return {
    ...item,
    title: item.name,
    dataAmountGb: item.dataGb,
    salePrice: item.price,
    usageProfile: item.usageType as UsageType,
    usageDescription: usageLabels[item.usageType as UsageType].description,
    isMostPopular: item.popular,
    isActive: item.active,
    supportedNetworks: item.networkSummary,
  };
}

export const getCatalog = cache(
  async ({
    query,
    region,
    data,
    duration,
  }: {
    query?: string;
    region?: string;
    data?: string;
    duration?: string;
  }) => {
    if (!hasDatabase) {
      const countries = getMockCountries({ region, q: query });
      const regionPackages = getMockPackages({ region }).filter((item) => item.countrySlug === null);

      const filteredRegionPackages = regionPackages
        .filter((item) => !data || Number(item.dataGb) >= Number(data))
        .filter((item) => !duration || item.validityDays >= Number(duration))
        .filter((item) => !query || item.name.toLowerCase().includes(query.toLowerCase()));

      return {
        countries: countries.map((country) => {
          const packages = getMockPackages({ country: country.slug })
            .filter((item) => !data || Number(item.dataGb) >= Number(data))
            .filter((item) => !duration || item.validityDays >= Number(duration))
            .map((item) =>
              createUiPackage({
                ...item,
                dataGb: { toString: () => item.dataGb },
                price: { toString: () => item.price },
                active: true,
                country: {
                  name: country.name,
                  slug: country.slug,
                  isoCode: country.isoCode,
                },
                region: mockRegions.find((regionItem) => regionItem.code === country.regionCode) ?? null,
              }),
            );

          return {
            ...country,
            code: country.isoCode,
            packages,
          };
        }),
        regionPackages: filteredRegionPackages.map((item) => ({
          ...item,
          title: item.name,
          dataAmountGb: { toString: () => item.dataGb },
          salePrice: { toString: () => item.price },
          isMostPopular: item.popular,
        })),
      };
    }

    const regionPackages = await getPackages({ region });

    const filteredRegionPackages = regionPackages
      .filter((item) => !data || Number(item.dataGb) >= Number(data))
      .filter((item) => !duration || item.validityDays >= Number(duration))
      .filter((item) => !query || item.name.toLowerCase().includes(query.toLowerCase()) || (item.countryName ?? "").toLowerCase().includes(query.toLowerCase()))
      .filter((item) => item.countryName === null);

    const countryRecords = await prisma.country.findMany({
      where: {
        active: true,
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { isoCode: { contains: query.toUpperCase() } },
              ],
            }
          : {}),
      },
      include: {
        region: true,
        networks: {
          where: { active: true },
          orderBy: { name: "asc" },
        },
        packages: {
          where: {
            active: true,
            ...(data ? { dataGb: { gte: data } } : {}),
            ...(duration ? { validityDays: { gte: Number(duration) } } : {}),
          },
          include: {
            country: true,
            region: true,
          },
          orderBy: [{ popular: "desc" }, { sortOrder: "asc" }, { price: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    });

    return {
      countries: countryRecords.map((country) => ({
        ...serializeCountry({
          ...country,
          _count: { packages: country.packages.length },
        }),
        code: country.isoCode,
        tagline: country.tagline,
        packages: country.packages.map((item) => createUiPackage(item)),
      })),
      regionPackages: filteredRegionPackages.map((item) => ({
        ...item,
        title: item.name,
        dataAmountGb: { toString: () => item.dataGb },
        salePrice: { toString: () => item.price },
        isMostPopular: item.popular,
      })),
    };
  },
);

export const getCountryBySlug = cache(async (slug: string) => {
  if (!hasDatabase) {
    const country = getMockCountryBySlug(slug);

    if (!country) {
      notFound();
    }

    return {
      ...country,
      code: country.isoCode,
      supportedNetworks: country.networks.map((network) => network.name),
      packages: country.packages.map((item) =>
        createUiPackage({
          ...item,
          dataGb: { toString: () => item.dataGb },
          price: { toString: () => item.price },
          active: true,
        }),
      ),
    };
  }

  const country = await getCountryBySlugRecord(slug);

  if (!country) {
    notFound();
  }

  await trackEvent({
    eventName: AnalyticsEventName.COUNTRY_VIEW,
    countrySlug: country.slug,
    path: `/countries/${country.slug}`,
  });

  return {
    ...country,
    code: country.isoCode,
    supportedNetworks: country.networks.map((network) => network.name),
    packages: country.packages.map((item) => createUiPackage(item)),
  };
});

export const getPackageById = cache(async (packageId: string) => {
  if (!hasDatabase) {
    const selectedPackage = getMockPackageById(packageId);

    if (!selectedPackage) {
      notFound();
    }

    return {
      ...createUiPackage({
        ...selectedPackage,
        dataGb: { toString: () => selectedPackage.dataGb },
        price: { toString: () => selectedPackage.price },
        active: true,
      }),
      country: selectedPackage.country
        ? {
            ...selectedPackage.country,
            code: selectedPackage.country.isoCode,
            supportedNetworks: selectedPackage.country.networks.map((network) => network.name),
          }
        : null,
    };
  }

  const selectedPackage = await getPackageByIdRecord(packageId);

  if (!selectedPackage) {
    notFound();
  }

  await trackEvent({
    eventName: AnalyticsEventName.PACKAGE_SELECT,
    countrySlug: selectedPackage.country?.slug ?? undefined,
    packageSlug: selectedPackage.slug,
    path: `/checkout/${selectedPackage.id}`,
  });

  return {
    ...createUiPackage(selectedPackage),
    country: selectedPackage.country
      ? {
          ...selectedPackage.country,
          code: selectedPackage.country.isoCode,
          supportedNetworks: selectedPackage.country.networks.map((network) => network.name),
        }
      : null,
  };
});

export const getPackageBySlug = cache(async (slug: string) => {
  if (!hasDatabase) {
    const item = getMockPackageBySlug(slug);

    if (!item) {
      notFound();
    }

    return {
      ...createUiPackage({
        ...item,
        dataGb: { toString: () => item.dataGb },
        price: { toString: () => item.price },
        active: true,
      }),
      country: item.country
        ? {
            ...item.country,
            code: item.country.isoCode,
            supportedNetworks: item.country.networks.map((network) => network.name),
          }
        : null,
    };
  }

  const item = await getPackageBySlugRecord(slug);

  if (!item) {
    notFound();
  }

  await trackEvent({
    eventName: AnalyticsEventName.PACKAGE_SELECT,
    countrySlug: item.country?.slug ?? undefined,
    packageSlug: item.slug,
    path: `/packages/${item.slug}`,
  });

  return {
    ...createUiPackage(item),
    country: item.country
      ? {
          ...item.country,
          code: item.country.isoCode,
          supportedNetworks: item.country.networks.map((network) => network.name),
        }
      : null,
  };
});

export const getRegionPackages = cache(async (region: RegionCode) => {
  if (!hasDatabase) {
    const regionRecord = getMockRegionBySlugOrCode(region);

    if (!regionRecord) {
      return [];
    }

    return getMockPackages({ region: regionRecord.code })
      .filter((item) => item.countrySlug === null || item.scope === PackageScope.GLOBAL)
      .map((item) =>
        createUiPackage({
          ...item,
          dataGb: { toString: () => item.dataGb },
          price: { toString: () => item.price },
          active: true,
          country: null,
          region: regionRecord,
        }),
      );
  }

  const regionRecord = await getRegionBySlugOrCode(region);

  if (!regionRecord) {
    return [];
  }

  const items = await prisma.package.findMany({
    where: {
      active: true,
      OR: [{ regionId: regionRecord.id }, { scope: PackageScope.GLOBAL }],
    },
    include: {
      country: true,
      region: true,
    },
    orderBy: [{ popular: "desc" }, { price: "asc" }],
  });

  return items.map((item) => createUiPackage(item));
});

export const getOrderById = cache(async (orderId: string) => {
  if (!hasDatabase) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      package: {
        include: {
          country: {
            include: {
              networks: true,
            },
          },
          region: true,
        },
      },
      coupon: true,
      deliveries: {
        orderBy: { createdAt: "desc" },
      },
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return {
    ...order,
    package: {
      ...createUiPackage(order.package),
      country: order.package.country
        ? {
            ...order.package.country,
            code: order.package.country.isoCode,
            supportedNetworks: order.package.country.networks.map((network) => network.name),
          }
        : null,
    },
  };
});

export async function getOrderByStripeSessionId(sessionId: string) {
  if (!hasDatabase) {
    return null;
  }

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      package: {
        include: {
          country: {
            include: {
              networks: true,
            },
          },
          region: true,
        },
      },
      deliveries: {
        orderBy: { createdAt: "desc" },
      },
      user: true,
    },
  });

  if (!order) {
    return null;
  }

  return {
    ...order,
    package: {
      ...createUiPackage(order.package),
      country: order.package.country
        ? {
            ...order.package.country,
            code: order.package.country.isoCode,
            supportedNetworks: order.package.country.networks.map((network) => network.name),
          }
        : null,
    },
  };
}

export async function getAdminDashboardData() {
  if (!hasDatabase) {
    return {
      countries: getMockCountries().map((country) => ({
        ...country,
        code: country.isoCode,
        active: true,
        region: mockRegions.find((region) => region.code === country.regionCode)!,
        supportedNetworks: country.supportedNetworks,
      })),
      packages: getMockPackages().map((item) => {
        const country = item.countrySlug
          ? getMockCountries().find((countryRecord) => countryRecord.slug === item.countrySlug) ?? null
          : null;
        const region = mockRegions.find((region) => region.code === item.regionCode) ?? null;

        return {
          ...createUiPackage({
            ...item,
            dataGb: { toString: () => item.dataGb },
            price: { toString: () => item.price },
            active: true,
            country: country
              ? {
                  name: country.name,
                  slug: country.slug,
                  isoCode: country.isoCode,
                }
              : null,
            region,
          }),
          countryId: country?.id ?? null,
          regionId: region?.id ?? null,
          providerPlanMap: {
            providerId: "provider-mocktel",
          },
        };
      }),
      coupons: [],
      orders: [],
      regions: mockRegions.map((region) => ({
        ...region,
        countryCount: getMockCountries().filter((country) => country.regionCode === region.code).length,
        packageCount: getMockPackages().filter((item) => item.regionCode === region.code).length,
      })),
      providers: [
        {
          id: "provider-mocktel",
          name: "MockTel Provider",
          code: "MOCKTEL",
        },
      ],
      eventSummary: getMockAdminDashboardData().eventSummary,
      kpis: getMockAdminDashboardData().kpis,
    };
  }

  const [countries, packages, coupons, orders, events, orderCount, deliveredAggregate, regions, providers] =
    await Promise.all([
      prisma.country.findMany({
        include: {
          region: true,
          networks: {
            orderBy: { name: "asc" },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.package.findMany({
        include: {
          country: true,
          region: true,
          providerPlanMap: {
            include: { provider: true },
          },
        },
        orderBy: [{ active: "desc" }, { createdAt: "desc" }],
      }),
      prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        include: {
          package: {
            include: {
              country: true,
              region: true,
            },
          },
          coupon: true,
          deliveries: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["eventName"],
        _count: {
          _all: true,
        },
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          totalAmount: true,
        },
        _avg: {
          totalAmount: true,
        },
      }),
      getActiveRegions(),
      prisma.provider.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      }),
    ]);

  const grossRevenue = Number(deliveredAggregate._sum.totalAmount ?? 0);
  const averageOrderValue = Number(deliveredAggregate._avg.totalAmount ?? 0);

  return {
    countries: countries.map((country) => ({
      ...country,
      code: country.isoCode,
      supportedNetworks: country.networks.map((network) => network.name),
    })),
    packages: packages.map((item) => ({
      ...createUiPackage(item),
      providerCode: item.providerPlanMap?.providerPlanCode ?? "",
    })),
    coupons,
    orders: orders.map((order) => ({
      ...order,
      package: createUiPackage(order.package),
    })),
    regions,
    providers,
    eventSummary: events.map((event) => ({
      name: event.eventName,
      count: event._count._all,
    })),
    kpis: {
      grossRevenue,
      totalOrders: orderCount,
      averageOrderValue,
      pendingCount: orders.filter((order) => order.status === OrderStatus.PENDING).length,
    },
  };
}

export function getPackageCoverageLabel(item: {
  country?: { name: string } | null;
  region?: { code: RegionCode; name?: string } | null;
  scope?: PackageScope | string;
}) {
  if (item.country?.name) {
    return item.country.name;
  }

  if (item.region?.name) {
    return item.region.name;
  }

  if (item.region?.code) {
    return regionLabels[item.region.code];
  }

  if (item.scope === PackageScope.GLOBAL) {
    return "Global";
  }

  return "Regional coverage";
}

export function getPackagePriceMeta(item: {
  price?: { toString(): string };
  salePrice?: { toString(): string };
  currency: string;
  validityDays: number;
}) {
  const amount = item.price?.toString() ?? item.salePrice?.toString() ?? "0";
  return {
    displayPrice: formatPrice(amount, item.currency),
    displayPricePerDay: formatPrice(calculatePricePerDay(amount, item.validityDays), item.currency),
  };
}

export function getStatusLabel(status: OrderStatus) {
  return status.replace(/_/g, " ").toLowerCase();
}

export function getStatusTone(status: OrderStatus) {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case OrderStatus.FAILED:
    case OrderStatus.PROVISIONING_FAILED:
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case OrderStatus.REFUNDED:
      return "bg-amber-50 text-amber-700 ring-amber-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

export async function getSuggestedCountries() {
  if (!hasDatabase) {
    return getMockCountries().map((country) => ({
      ...country,
      region: mockRegions.find((region) => region.code === country.regionCode)!,
      packageCount: getMockPackages({ country: country.slug }).length,
    }));
  }

  return getActiveCountries();
}

export async function getHomepagePopularPackages() {
  if (!hasDatabase) {
    return getMockPackages({ popular: true })
      .filter((item) => item.countrySlug === null)
      .map((item) => ({
        ...item,
        countryName: null,
        countrySlug: null,
        regionName: regionLabels[item.regionCode],
        regionSlug: mockRegions.find((region) => region.code === item.regionCode)?.slug ?? null,
        supportedNetworks: item.networkSummary,
        pricePerDay: calculatePricePerDay(item.price, item.validityDays),
      }));
  }

  return getPopularPackages();
}
