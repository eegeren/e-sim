import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  CurrencyCode,
  DiscountType,
  PackageScope,
  RegionCode,
  UsageType,
} from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const faq = [
  {
    question: "When should I install the eSIM?",
    answer: "Install before departure and switch it on when you arrive for the smoothest setup.",
  },
  {
    question: "Does eSIM replace my SIM card?",
    answer: "No. Most dual-SIM phones let you keep your main SIM for calls and use AirThread for travel data.",
  },
  {
    question: "Can I use hotspot?",
    answer: "Yes. Heavier plans are the best fit if you expect hotspot or laptop tethering.",
  },
];

const regions = [
  { code: RegionCode.EUROPE, name: "Europe", slug: "europe" },
  { code: RegionCode.ASIA, name: "Asia", slug: "asia" },
  { code: RegionCode.MIDDLE_EAST, name: "Middle East", slug: "middle-east" },
  { code: RegionCode.GLOBAL, name: "Global", slug: "global" },
  { code: RegionCode.NORTH_AMERICA, name: "North America", slug: "north-america" },
];

type CountrySeed = {
  name: string;
  slug: string;
  isoCode: string;
  flag: string;
  region: RegionCode;
  description: string;
  heroTitle: string;
  tagline: string;
  networks: string[];
  packages: Array<{
    name: string;
    slug: string;
    dataGb: string;
    validityDays: number;
    price: string;
    currency: CurrencyCode;
    usageType: UsageType;
    popular: boolean;
    description: string;
    installHeadline: string;
  }>;
};

const countries: CountrySeed[] = [
  {
    name: "France",
    slug: "france",
    isoCode: "FR",
    flag: "🇫🇷",
    region: RegionCode.EUROPE,
    description: "Premium travel data coverage for France across major cities, rail routes and countryside stays.",
    heroTitle: "France travel eSIM",
    tagline: "Reliable data across Paris, the Riviera and major rail routes.",
    networks: ["Orange", "SFR", "Bouygues Telecom"],
    packages: [
      {
        name: "Arrival",
        slug: "france-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "5.50",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Light data for airport transfers, maps and messaging.",
        installHeadline: "Best for short stays",
      },
      {
        name: "Explorer",
        slug: "france-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "13.50",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced coverage for social apps, navigation and daily browsing.",
        installHeadline: "Best for most France trips",
      },
      {
        name: "Power",
        slug: "france-power-12gb",
        dataGb: "12.00",
        validityDays: 30,
        price: "23.50",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Large allowance for hotspot, video and longer stays.",
        installHeadline: "Best for heavy usage",
      },
    ],
  },
  {
    name: "Germany",
    slug: "germany",
    isoCode: "DE",
    flag: "🇩🇪",
    region: RegionCode.EUROPE,
    description: "Travel-ready data designed for German cities, business trips and rail-heavy itineraries.",
    heroTitle: "Germany travel eSIM",
    tagline: "Reliable data across Berlin, Munich and major rail corridors.",
    networks: ["Telekom DE", "Vodafone DE", "O2"],
    packages: [
      {
        name: "Starter",
        slug: "germany-starter-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "5.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Essential coverage for transport, maps and messaging.",
        installHeadline: "Best for quick trips",
      },
      {
        name: "Explorer",
        slug: "germany-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "12.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "The balanced plan for city hopping and work chats.",
        installHeadline: "Best for balanced travel",
      },
      {
        name: "Power",
        slug: "germany-power-10gb",
        dataGb: "10.00",
        validityDays: 30,
        price: "21.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "High-capacity option for hotspot sessions and longer stays.",
        installHeadline: "Best for work and hotspot",
      },
    ],
  },
  {
    name: "Japan",
    slug: "japan",
    isoCode: "JP",
    flag: "🇯🇵",
    region: RegionCode.ASIA,
    description: "Fast eSIM coverage across Tokyo, Kyoto, Osaka and high-speed rail routes.",
    heroTitle: "Japan travel eSIM",
    tagline: "Reliable data across Tokyo, Kyoto and major rail routes.",
    networks: ["NTT Docomo", "SoftBank", "KDDI au"],
    packages: [
      {
        name: "Arrival",
        slug: "japan-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "4.50",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Essential data for arrival, maps and messaging.",
        installHeadline: "Best for arrivals",
      },
      {
        name: "Explorer",
        slug: "japan-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "12.50",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced data for full-day city travel and navigation.",
        installHeadline: "Best for most Japan trips",
      },
      {
        name: "Power",
        slug: "japan-power-12gb",
        dataGb: "12.00",
        validityDays: 30,
        price: "24.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Extra data for longer stays, hotspot and video.",
        installHeadline: "Best for power travelers",
      },
    ],
  },
  {
    name: "Turkey",
    slug: "turkey",
    isoCode: "TR",
    flag: "🇹🇷",
    region: RegionCode.MIDDLE_EAST,
    description: "Travel data for Istanbul, the coast and longer leisure itineraries across Turkey.",
    heroTitle: "Turkey travel eSIM",
    tagline: "Fast setup from Istanbul arrivals to longer coastal trips.",
    networks: ["Turkcell", "Vodafone TR", "Turk Telekom"],
    packages: [
      {
        name: "Arrival",
        slug: "turkey-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "4.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Low-friction data for airport transfers and messaging.",
        installHeadline: "Best for short city breaks",
      },
      {
        name: "Explorer",
        slug: "turkey-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "12.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced data for navigation, social apps and daily browsing.",
        installHeadline: "Best for most Turkey trips",
      },
      {
        name: "Power",
        slug: "turkey-power-10gb",
        dataGb: "10.00",
        validityDays: 30,
        price: "19.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Extra room for hotspot sessions and longer stays.",
        installHeadline: "Best for long stays",
      },
    ],
  },
  {
    name: "United States",
    slug: "united-states",
    isoCode: "US",
    flag: "🇺🇸",
    region: RegionCode.NORTH_AMERICA,
    description: "Premium travel data for cross-country trips, major hubs and national itineraries across the USA.",
    heroTitle: "USA travel eSIM",
    tagline: "Reliable data across major cities, airports and interstate routes.",
    networks: ["AT&T", "T-Mobile", "Verizon"],
    packages: [
      {
        name: "Starter",
        slug: "usa-starter-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "5.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Essential data for rideshare, maps and messages.",
        installHeadline: "Best for short stays",
      },
      {
        name: "Explorer",
        slug: "usa-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "13.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced data for travel, work apps and social media.",
        installHeadline: "Best for balanced travel",
      },
      {
        name: "Power",
        slug: "usa-power-12gb",
        dataGb: "12.00",
        validityDays: 30,
        price: "24.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Higher-capacity plan for road trips and hotspot use.",
        installHeadline: "Best for heavy usage",
      },
    ],
  },
  {
    name: "Italy",
    slug: "italy",
    isoCode: "IT",
    flag: "🇮🇹",
    region: RegionCode.EUROPE,
    description: "Travel coverage designed for city breaks, train routes and long leisure trips across Italy.",
    heroTitle: "Italy travel eSIM",
    tagline: "Reliable data across Rome, Milan and coast-to-coast itineraries.",
    networks: ["TIM", "Vodafone IT", "WindTre"],
    packages: [
      {
        name: "Arrival",
        slug: "italy-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "5.20",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Small plan for transfers, maps and essential messaging.",
        installHeadline: "Best for short arrivals",
      },
      {
        name: "Explorer",
        slug: "italy-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "13.20",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced data for sightseeing, navigation and social apps.",
        installHeadline: "Best for most Italy trips",
      },
      {
        name: "Power",
        slug: "italy-power-10gb",
        dataGb: "10.00",
        validityDays: 30,
        price: "22.50",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Larger allowance for hotspot use and longer travel windows.",
        installHeadline: "Best for extended travel",
      },
    ],
  },
  {
    name: "Spain",
    slug: "spain",
    isoCode: "ES",
    flag: "🇪🇸",
    region: RegionCode.EUROPE,
    description: "Travel-ready eSIM plans for Spain across cities, islands and rail-heavy itineraries.",
    heroTitle: "Spain travel eSIM",
    tagline: "Reliable data from Madrid to Barcelona and beyond.",
    networks: ["Movistar", "Orange ES", "Vodafone ES"],
    packages: [
      {
        name: "Arrival",
        slug: "spain-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "5.20",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Maps, messaging and transport for short stays.",
        installHeadline: "Best for weekend trips",
      },
      {
        name: "Explorer",
        slug: "spain-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "12.80",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced data for city travel and social apps.",
        installHeadline: "Best for balanced travel",
      },
      {
        name: "Power",
        slug: "spain-power-10gb",
        dataGb: "10.00",
        validityDays: 30,
        price: "22.20",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "A larger plan for hotspot and longer vacations.",
        installHeadline: "Best for heavy travel days",
      },
    ],
  },
  {
    name: "Thailand",
    slug: "thailand",
    isoCode: "TH",
    flag: "🇹🇭",
    region: RegionCode.ASIA,
    description: "Flexible eSIM coverage for Bangkok arrivals, island travel and longer Thailand stays.",
    heroTitle: "Thailand travel eSIM",
    tagline: "Fast data across Bangkok, Chiang Mai and beach destinations.",
    networks: ["AIS", "TrueMove H", "dtac"],
    packages: [
      {
        name: "Arrival",
        slug: "thailand-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "4.80",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Ideal for arrival, messaging and ride-hailing.",
        installHeadline: "Best for short arrivals",
      },
      {
        name: "Explorer",
        slug: "thailand-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "11.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced plan for island travel, maps and social media.",
        installHeadline: "Best for most Thailand trips",
      },
      {
        name: "Power",
        slug: "thailand-power-12gb",
        dataGb: "12.00",
        validityDays: 30,
        price: "21.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Extra data for content, hotspot and longer stays.",
        installHeadline: "Best for hotspot use",
      },
    ],
  },
  {
    name: "United Kingdom",
    slug: "united-kingdom",
    isoCode: "GB",
    flag: "🇬🇧",
    region: RegionCode.EUROPE,
    description: "Premium travel data for London, regional rail and wider UK itineraries.",
    heroTitle: "UK travel eSIM",
    tagline: "Reliable data across London, Edinburgh and major rail routes.",
    networks: ["EE", "Vodafone UK", "O2 UK"],
    packages: [
      {
        name: "Arrival",
        slug: "uk-arrival-1gb",
        dataGb: "1.00",
        validityDays: 7,
        price: "5.70",
        currency: CurrencyCode.USD,
        usageType: UsageType.LIGHT,
        popular: false,
        description: "Arrival data for maps, messaging and transport apps.",
        installHeadline: "Best for short trips",
      },
      {
        name: "Explorer",
        slug: "uk-explorer-5gb",
        dataGb: "5.00",
        validityDays: 15,
        price: "13.40",
        currency: CurrencyCode.USD,
        usageType: UsageType.STANDARD,
        popular: true,
        description: "Balanced data for city hopping and remote work basics.",
        installHeadline: "Best for balanced travel",
      },
      {
        name: "Power",
        slug: "uk-power-10gb",
        dataGb: "10.00",
        validityDays: 30,
        price: "23.90",
        currency: CurrencyCode.USD,
        usageType: UsageType.HEAVY,
        popular: false,
        description: "Higher-capacity option for hotspot and longer stays.",
        installHeadline: "Best for heavy usage",
      },
    ],
  },
];

const regionPackages = [
  {
    region: RegionCode.EUROPE,
    scope: PackageScope.REGION,
    name: "Europe Flex",
    slug: "europe-flex-20gb",
    dataGb: "20.00",
    validityDays: 30,
    price: "39.00",
    currency: CurrencyCode.USD,
    usageType: UsageType.HEAVY,
    popular: true,
    description: "One plan for multi-country travel across key European destinations.",
    networkSummary: ["Multi-network Europe coverage"],
    installHeadline: "One package for multi-country Europe trips",
  },
  {
    region: RegionCode.ASIA,
    scope: PackageScope.REGION,
    name: "Asia Lite",
    slug: "asia-lite-10gb",
    dataGb: "10.00",
    validityDays: 30,
    price: "31.00",
    currency: CurrencyCode.USD,
    usageType: UsageType.STANDARD,
    popular: false,
    description: "Flexible coverage for shorter multi-country Asia itineraries.",
    networkSummary: ["Multi-network Asia coverage"],
    installHeadline: "A simple Asia regional travel plan",
  },
  {
    region: RegionCode.GLOBAL,
    scope: PackageScope.GLOBAL,
    name: "Global Pro",
    slug: "global-pro-25gb",
    dataGb: "25.00",
    validityDays: 45,
    price: "62.00",
    currency: CurrencyCode.USD,
    usageType: UsageType.HEAVY,
    popular: true,
    description: "A single global plan for frequent flyers moving across regions.",
    networkSummary: ["Global multi-network coverage"],
    installHeadline: "Global connectivity for frequent travel",
  },
];

async function main() {
  const regionRecords = new Map<RegionCode, { id: string; name: string }>();

  for (const regionInput of regions) {
    const region = await prisma.region.upsert({
      where: { code: regionInput.code },
      update: {
        name: regionInput.name,
        slug: regionInput.slug,
        active: true,
      },
      create: {
        ...regionInput,
        active: true,
      },
    });

    regionRecords.set(regionInput.code, { id: region.id, name: region.name });
  }

  for (const countryInput of countries) {
    const region = regionRecords.get(countryInput.region);

    if (!region) {
      throw new Error(`Region missing for ${countryInput.name}`);
    }

    const country = await prisma.country.upsert({
      where: { slug: countryInput.slug },
      update: {
        name: countryInput.name,
        isoCode: countryInput.isoCode,
        flag: countryInput.flag,
        regionId: region.id,
        description: countryInput.description,
        heroTitle: countryInput.heroTitle,
        tagline: countryInput.tagline,
        deviceCompatibility:
          "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and most recent flagship devices.",
        activationPolicy:
          "Install anytime. Validity starts when the eSIM first connects in the destination.",
        refundPolicy:
          "Unused plans are eligible for review within 14 days. Activated plans are non-refundable unless service fails.",
        faq,
        seoTitle: `Best eSIM for ${countryInput.name} | AirThread`,
        seoDescription: countryInput.description,
        active: true,
      },
      create: {
        name: countryInput.name,
        slug: countryInput.slug,
        isoCode: countryInput.isoCode,
        flag: countryInput.flag,
        regionId: region.id,
        description: countryInput.description,
        heroTitle: countryInput.heroTitle,
        tagline: countryInput.tagline,
        deviceCompatibility:
          "Works with unlocked eSIM-compatible iPhone, Pixel, Galaxy and most recent flagship devices.",
        activationPolicy:
          "Install anytime. Validity starts when the eSIM first connects in the destination.",
        refundPolicy:
          "Unused plans are eligible for review within 14 days. Activated plans are non-refundable unless service fails.",
        faq,
        seoTitle: `Best eSIM for ${countryInput.name} | AirThread`,
        seoDescription: countryInput.description,
        active: true,
      },
    });

    await prisma.countryNetwork.deleteMany({
      where: { countryId: country.id },
    });

    await prisma.countryNetwork.createMany({
      data: countryInput.networks.map((name) => ({
        countryId: country.id,
        name,
        active: true,
      })),
    });

    for (const packageInput of countryInput.packages) {
      await prisma.package.upsert({
        where: { slug: packageInput.slug },
        update: {
          name: packageInput.name,
          countryId: country.id,
          regionId: region.id,
          scope: PackageScope.COUNTRY,
          dataGb: packageInput.dataGb,
          validityDays: packageInput.validityDays,
          price: packageInput.price,
          currency: packageInput.currency,
          usageType: packageInput.usageType,
          popular: packageInput.popular,
          active: true,
          description: packageInput.description,
          networkSummary: countryInput.networks,
          deviceCompatibility:
            "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
          activationPolicy:
            "Starts when the line first connects inside the destination.",
          refundPolicy:
            "Unused plans may be reviewed before activation.",
          installHeadline: packageInput.installHeadline,
          faq,
        },
        create: {
          name: packageInput.name,
          slug: packageInput.slug,
          countryId: country.id,
          regionId: region.id,
          scope: PackageScope.COUNTRY,
          dataGb: packageInput.dataGb,
          validityDays: packageInput.validityDays,
          price: packageInput.price,
          currency: packageInput.currency,
          usageType: packageInput.usageType,
          popular: packageInput.popular,
          active: true,
          description: packageInput.description,
          networkSummary: countryInput.networks,
          deviceCompatibility:
            "Unlocked eSIM-compatible iPhone, Pixel, Galaxy and modern flagship devices.",
          activationPolicy:
            "Starts when the line first connects inside the destination.",
          refundPolicy:
            "Unused plans may be reviewed before activation.",
          installHeadline: packageInput.installHeadline,
          faq,
        },
      });
    }
  }

  for (const regionPackage of regionPackages) {
    const region = regionRecords.get(regionPackage.region);

    if (!region) {
      throw new Error(`Region missing for ${regionPackage.name}`);
    }

    await prisma.package.upsert({
      where: { slug: regionPackage.slug },
      update: {
        name: regionPackage.name,
        countryId: null,
        regionId: region.id,
        scope: regionPackage.scope,
        dataGb: regionPackage.dataGb,
        validityDays: regionPackage.validityDays,
        price: regionPackage.price,
        currency: regionPackage.currency,
        usageType: regionPackage.usageType,
        popular: regionPackage.popular,
        active: true,
        description: regionPackage.description,
        networkSummary: regionPackage.networkSummary,
        deviceCompatibility: "Unlocked eSIM-compatible phones and tablets.",
        activationPolicy: "Starts on first supported network connection in the covered region.",
        refundPolicy: "Unused plans may be reviewed before activation.",
        installHeadline: regionPackage.installHeadline,
        faq,
      },
      create: {
        name: regionPackage.name,
        slug: regionPackage.slug,
        countryId: null,
        regionId: region.id,
        scope: regionPackage.scope,
        dataGb: regionPackage.dataGb,
        validityDays: regionPackage.validityDays,
        price: regionPackage.price,
        currency: regionPackage.currency,
        usageType: regionPackage.usageType,
        popular: regionPackage.popular,
        active: true,
        description: regionPackage.description,
        networkSummary: regionPackage.networkSummary,
        deviceCompatibility: "Unlocked eSIM-compatible phones and tablets.",
        activationPolicy: "Starts on first supported network connection in the covered region.",
        refundPolicy: "Unused plans may be reviewed before activation.",
        installHeadline: regionPackage.installHeadline,
        faq,
      },
    });
  }

  const provider = await prisma.provider.upsert({
    where: { code: "MOCKTEL" },
    update: {
      name: "MockTel Provider",
      apiBaseUrl: "https://api.mocktel.example/v1",
      active: true,
    },
    create: {
      code: "MOCKTEL",
      name: "MockTel Provider",
      apiBaseUrl: "https://api.mocktel.example/v1",
      active: true,
    },
  });

  const packages = await prisma.package.findMany({
    select: { id: true, slug: true },
  });

  for (const packageRecord of packages) {
    await prisma.providerPlanMap.upsert({
      where: { packageId: packageRecord.id },
      update: {
        providerId: provider.id,
        providerPlanCode: `MT-${packageRecord.slug.toUpperCase().replace(/-/g, "_")}`,
        active: true,
      },
      create: {
        providerId: provider.id,
        packageId: packageRecord.id,
        providerPlanCode: `MT-${packageRecord.slug.toUpperCase().replace(/-/g, "_")}`,
        active: true,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {
      description: "10% off for first-time travelers",
      discountType: DiscountType.PERCENTAGE,
      discountValue: "10.00",
      active: true,
      maxUses: 500,
    },
    create: {
      code: "WELCOME10",
      description: "10% off for first-time travelers",
      discountType: DiscountType.PERCENTAGE,
      discountValue: "10.00",
      active: true,
      maxUses: 500,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SPRING5" },
    update: {
      description: "$5 off selected plans",
      discountType: DiscountType.FIXED,
      discountValue: "5.00",
      active: true,
      maxUses: 300,
    },
    create: {
      code: "SPRING5",
      description: "$5 off selected plans",
      discountType: DiscountType.FIXED,
      discountValue: "5.00",
      active: true,
      maxUses: 300,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
