import {
  AnalyticsEventName,
  CurrencyCode,
  OrderStatus,
  PackageScope,
  RegionCode,
  UsageType,
} from "@/generated/prisma/enums";

const faq = [
  {
    question: "When should I install the eSIM?",
    answer: "Install before departure and switch it on when you arrive.",
  },
  {
    question: "Can I keep my physical SIM active?",
    answer: "Yes. Most dual-SIM devices let you keep your primary line for calls.",
  },
  {
    question: "Can I use hotspot?",
    answer: "Yes. Heavier plans are the better fit if you expect tethering.",
  },
];

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const updatedAt = new Date("2026-01-01T00:00:00.000Z");

export const mockRegions = [
  {
    id: "region-europe",
    code: RegionCode.EUROPE,
    name: "Europe",
    slug: "europe",
    active: true,
    createdAt,
    updatedAt,
  },
  {
    id: "region-asia",
    code: RegionCode.ASIA,
    name: "Asia",
    slug: "asia",
    active: true,
    createdAt,
    updatedAt,
  },
  {
    id: "region-middle-east",
    code: RegionCode.MIDDLE_EAST,
    name: "Middle East",
    slug: "middle-east",
    active: true,
    createdAt,
    updatedAt,
  },
  {
    id: "region-global",
    code: RegionCode.GLOBAL,
    name: "Global",
    slug: "global",
    active: true,
    createdAt,
    updatedAt,
  },
  {
    id: "region-north-america",
    code: RegionCode.NORTH_AMERICA,
    name: "North America",
    slug: "north-america",
    active: true,
    createdAt,
    updatedAt,
  },
] as const;

type MockCountry = {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  flag: string;
  regionCode: RegionCode;
  description: string;
  heroTitle: string;
  tagline: string;
  deviceCompatibility: string;
  activationPolicy: string;
  refundPolicy: string;
  faq: typeof faq;
  supportedNetworks: string[];
};

type MockPackage = {
  id: string;
  name: string;
  slug: string;
  scope: PackageScope;
  countrySlug: string | null;
  regionCode: RegionCode;
  dataGb: string;
  validityDays: number;
  price: string;
  currency: CurrencyCode;
  usageType: UsageType;
  popular: boolean;
  description: string;
  networkSummary: string[];
  deviceCompatibility: string;
  activationPolicy: string;
  refundPolicy: string;
  installHeadline: string;
  faq: typeof faq;
};

export const mockCountries: MockCountry[] = [
  {
    id: "country-france",
    name: "France",
    slug: "france",
    isoCode: "FR",
    flag: "FR",
    regionCode: RegionCode.EUROPE,
    description: "Travel data coverage for Paris, rail routes and major tourist areas.",
    heroTitle: "France travel eSIM",
    tagline: "Reliable data across Paris, the Riviera and major rail routes.",
    deviceCompatibility:
      "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and recent flagship devices.",
    activationPolicy: "Validity starts when the eSIM first connects in France.",
    refundPolicy: "Unused plans can be reviewed before activation.",
    faq,
    supportedNetworks: ["Orange", "SFR", "Bouygues Telecom"],
  },
  {
    id: "country-germany",
    name: "Germany",
    slug: "germany",
    isoCode: "DE",
    flag: "DE",
    regionCode: RegionCode.EUROPE,
    description: "Travel-ready data for German cities, work trips and rail-heavy itineraries.",
    heroTitle: "Germany travel eSIM",
    tagline: "Reliable data across Berlin, Munich and major rail corridors.",
    deviceCompatibility:
      "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and recent flagship devices.",
    activationPolicy: "Validity starts when the eSIM first connects in Germany.",
    refundPolicy: "Unused plans can be reviewed before activation.",
    faq,
    supportedNetworks: ["Telekom DE", "Vodafone DE", "O2"],
  },
  {
    id: "country-japan",
    name: "Japan",
    slug: "japan",
    isoCode: "JP",
    flag: "JP",
    regionCode: RegionCode.ASIA,
    description: "Fast eSIM coverage across Tokyo, Kyoto, Osaka and high-speed rail routes.",
    heroTitle: "Japan travel eSIM",
    tagline: "Reliable data across Tokyo, Kyoto and major rail routes.",
    deviceCompatibility:
      "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and recent flagship devices.",
    activationPolicy: "Validity starts when the eSIM first connects in Japan.",
    refundPolicy: "Unused plans can be reviewed before activation.",
    faq,
    supportedNetworks: ["NTT Docomo", "SoftBank", "KDDI au"],
  },
  {
    id: "country-turkey",
    name: "Turkey",
    slug: "turkey",
    isoCode: "TR",
    flag: "TR",
    regionCode: RegionCode.MIDDLE_EAST,
    description: "Travel data for Istanbul, the coast and longer leisure itineraries.",
    heroTitle: "Turkey travel eSIM",
    tagline: "Fast setup from Istanbul arrivals to longer coastal trips.",
    deviceCompatibility:
      "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and recent flagship devices.",
    activationPolicy: "Validity starts when the eSIM first connects in Turkey.",
    refundPolicy: "Unused plans can be reviewed before activation.",
    faq,
    supportedNetworks: ["Turkcell", "Vodafone TR", "Turk Telekom"],
  },
  {
    id: "country-united-states",
    name: "United States",
    slug: "united-states",
    isoCode: "US",
    flag: "US",
    regionCode: RegionCode.NORTH_AMERICA,
    description: "Premium travel data for major hubs and cross-country itineraries.",
    heroTitle: "USA travel eSIM",
    tagline: "Reliable data across major cities, airports and interstate routes.",
    deviceCompatibility:
      "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and recent flagship devices.",
    activationPolicy: "Validity starts when the eSIM first connects in the United States.",
    refundPolicy: "Unused plans can be reviewed before activation.",
    faq,
    supportedNetworks: ["AT&T", "T-Mobile", "Verizon"],
  },
];

export const mockPackages: MockPackage[] = [
  {
    id: "pkg-france-explorer-5gb",
    name: "France Explorer 5GB",
    slug: "france-explorer-5gb",
    scope: PackageScope.COUNTRY,
    countrySlug: "france",
    regionCode: RegionCode.EUROPE,
    dataGb: "5.00",
    validityDays: 15,
    price: "13.50",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: true,
    description: "Balanced coverage for social apps, navigation and daily browsing.",
    networkSummary: ["Orange", "SFR", "Bouygues Telecom"],
    deviceCompatibility: "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
    activationPolicy: "Starts when the line first connects inside the destination.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "Best for most France trips",
    faq,
  },
  {
    id: "pkg-germany-explorer-5gb",
    name: "Germany Explorer 5GB",
    slug: "germany-explorer-5gb",
    scope: PackageScope.COUNTRY,
    countrySlug: "germany",
    regionCode: RegionCode.EUROPE,
    dataGb: "5.00",
    validityDays: 15,
    price: "12.90",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: true,
    description: "The balanced plan for city hopping and work chats.",
    networkSummary: ["Telekom DE", "Vodafone DE", "O2"],
    deviceCompatibility: "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
    activationPolicy: "Starts when the line first connects inside the destination.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "Best for balanced travel",
    faq,
  },
  {
    id: "pkg-japan-explorer-5gb",
    name: "Japan Explorer 5GB",
    slug: "japan-explorer-5gb",
    scope: PackageScope.COUNTRY,
    countrySlug: "japan",
    regionCode: RegionCode.ASIA,
    dataGb: "5.00",
    validityDays: 15,
    price: "12.50",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: true,
    description: "Balanced data for full-day city travel and navigation.",
    networkSummary: ["NTT Docomo", "SoftBank", "KDDI au"],
    deviceCompatibility: "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
    activationPolicy: "Starts when the line first connects inside the destination.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "Best for most Japan trips",
    faq,
  },
  {
    id: "pkg-turkey-explorer-5gb",
    name: "Turkey Explorer 5GB",
    slug: "turkey-explorer-5gb",
    scope: PackageScope.COUNTRY,
    countrySlug: "turkey",
    regionCode: RegionCode.MIDDLE_EAST,
    dataGb: "5.00",
    validityDays: 15,
    price: "12.90",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: true,
    description: "Balanced data for navigation, social apps and daily browsing.",
    networkSummary: ["Turkcell", "Vodafone TR", "Turk Telekom"],
    deviceCompatibility: "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
    activationPolicy: "Starts when the line first connects inside the destination.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "Best for most Turkey trips",
    faq,
  },
  {
    id: "pkg-usa-explorer-5gb",
    name: "USA Explorer 5GB",
    slug: "usa-explorer-5gb",
    scope: PackageScope.COUNTRY,
    countrySlug: "united-states",
    regionCode: RegionCode.NORTH_AMERICA,
    dataGb: "5.00",
    validityDays: 15,
    price: "13.90",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: true,
    description: "Balanced data for travel, work apps and social media.",
    networkSummary: ["AT&T", "T-Mobile", "Verizon"],
    deviceCompatibility: "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
    activationPolicy: "Starts when the line first connects inside the destination.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "Best for balanced travel",
    faq,
  },
  {
    id: "pkg-europe-flex-20gb",
    name: "Europe Flex 20GB",
    slug: "europe-flex-20gb",
    scope: PackageScope.REGION,
    countrySlug: null,
    regionCode: RegionCode.EUROPE,
    dataGb: "20.00",
    validityDays: 30,
    price: "39.00",
    currency: CurrencyCode.USD,
    usageType: UsageType.HEAVY,
    popular: true,
    description: "One plan for multi-country travel across key European destinations.",
    networkSummary: ["Multi-network Europe coverage"],
    deviceCompatibility: "Unlocked eSIM-compatible phones and tablets.",
    activationPolicy: "Starts on first supported network connection in the covered region.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "One package for multi-country Europe trips",
    faq,
  },
  {
    id: "pkg-asia-lite-10gb",
    name: "Asia Lite 10GB",
    slug: "asia-lite-10gb",
    scope: PackageScope.REGION,
    countrySlug: null,
    regionCode: RegionCode.ASIA,
    dataGb: "10.00",
    validityDays: 30,
    price: "31.00",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: false,
    description: "Flexible coverage for shorter multi-country Asia itineraries.",
    networkSummary: ["Multi-network Asia coverage"],
    deviceCompatibility: "Unlocked eSIM-compatible phones and tablets.",
    activationPolicy: "Starts on first supported network connection in the covered region.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "A simple Asia regional travel plan",
    faq,
  },
  {
    id: "pkg-global-pro-25gb",
    name: "Global Pro 25GB",
    slug: "global-pro-25gb",
    scope: PackageScope.GLOBAL,
    countrySlug: null,
    regionCode: RegionCode.GLOBAL,
    dataGb: "25.00",
    validityDays: 45,
    price: "62.00",
    currency: CurrencyCode.USD,
    usageType: UsageType.HEAVY,
    popular: true,
    description: "A single global plan for frequent flyers moving across regions.",
    networkSummary: ["Global multi-network coverage"],
    deviceCompatibility: "Unlocked eSIM-compatible phones and tablets.",
    activationPolicy: "Starts on first supported network connection in the covered region.",
    refundPolicy: "Unused plans may be reviewed before activation.",
    installHeadline: "Global connectivity for frequent travel",
    faq,
  },
] as const;

function regionForCode(code: RegionCode) {
  return mockRegions.find((region) => region.code === code) ?? null;
}

function countryForSlug(slug: string | null) {
  if (!slug) {
    return null;
  }

  return mockCountries.find((country) => country.slug === slug) ?? null;
}

export function getMockRegionBySlugOrCode(value: string) {
  const normalized = value.toLowerCase();

  return (
    mockRegions.find(
      (region) => region.slug === normalized || region.code === (value as RegionCode),
    ) ?? null
  );
}

export function getMockPackages(input?: {
  region?: string;
  country?: string;
  usageType?: string;
  popular?: boolean;
}) {
  return mockPackages.filter((item) => {
    if (input?.region) {
      const region = getMockRegionBySlugOrCode(input.region);

      if (region && item.regionCode !== region.code && item.scope !== PackageScope.GLOBAL) {
        return false;
      }
    }

    if (input?.country && item.countrySlug !== input.country) {
      return false;
    }

    if (input?.usageType && item.usageType !== input.usageType) {
      return false;
    }

    if (typeof input?.popular === "boolean" && item.popular !== input.popular) {
      return false;
    }

    return true;
  });
}

export function getMockCountryBySlug(slug: string) {
  const country = mockCountries.find((item) => item.slug === slug);

  if (!country) {
    return null;
  }

  const region = regionForCode(country.regionCode);
  const packages = getMockPackages({ country: slug });

  return {
    ...country,
    region,
    networks: country.supportedNetworks.map((name) => ({ name, active: true })),
    packages: packages.map((item) => ({
      ...item,
      country,
      region,
      providerPlanMap: {
        providerPlanCode: `MOCK-${item.slug.toUpperCase().replace(/-/g, "_")}`,
        provider: {
          id: "provider-mocktel",
          name: "MockTel Provider",
          code: "MOCKTEL",
        },
      },
    })),
  };
}

export function getMockPackageById(packageId: string) {
  return getMockPackageBy((item) => item.id === packageId);
}

export function getMockPackageBySlug(slug: string) {
  return getMockPackageBy((item) => item.slug === slug);
}

function getMockPackageBy(predicate: (item: (typeof mockPackages)[number]) => boolean) {
  const item = mockPackages.find(predicate);

  if (!item) {
    return null;
  }

  const country = countryForSlug(item.countrySlug);
  const region = regionForCode(item.regionCode);

  return {
    ...item,
    country: country
      ? {
          ...country,
          networks: country.supportedNetworks.map((name) => ({ name, active: true })),
        }
      : null,
    region,
    providerPlanMap: {
      providerPlanCode: `MOCK-${item.slug.toUpperCase().replace(/-/g, "_")}`,
      provider: {
        id: "provider-mocktel",
        name: "MockTel Provider",
        code: "MOCKTEL",
      },
    },
  };
}

export function getMockCountries(input?: { region?: string; q?: string }) {
  const query = input?.q?.trim().toLowerCase();
  const region = input?.region ? getMockRegionBySlugOrCode(input.region) : null;

  return mockCountries.filter((country) => {
    if (region && country.regionCode !== region.code) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      country.name.toLowerCase().includes(query) ||
      country.isoCode.toLowerCase().includes(query)
    );
  });
}

export function getMockAnalyticsSummary() {
  return [
    { name: AnalyticsEventName.COUNTRY_VIEW, count: 128 },
    { name: AnalyticsEventName.PACKAGE_SELECT, count: 76 },
    { name: AnalyticsEventName.CHECKOUT_START, count: 21 },
  ];
}

export function getMockAdminDashboardData() {
  return {
    countries: mockCountries.map((country) => ({
      ...country,
      code: country.isoCode,
      supportedNetworks: country.supportedNetworks,
    })),
    packages: mockPackages,
    coupons: [],
    orders: [],
    regions: mockRegions.map((region) => ({
      ...region,
      countryCount: mockCountries.filter((country) => country.regionCode === region.code).length,
      packageCount: mockPackages.filter((item) => item.regionCode === region.code).length,
    })),
    providers: [
      {
        id: "provider-mocktel",
        name: "MockTel Provider",
        code: "MOCKTEL",
      },
    ],
    eventSummary: getMockAnalyticsSummary(),
    kpis: {
      grossRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      pendingCount: 0,
    },
  };
}
