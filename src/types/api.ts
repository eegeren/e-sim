import type {
  CurrencyCode,
  DeliveryStatus,
  OrderStatus,
  PackageScope,
  RegionCode,
  UsageType,
} from "@/generated/prisma/enums";

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type RegionListItem = {
  id: string;
  code: RegionCode;
  name: string;
  slug: string;
  active: boolean;
  countryCount: number;
  packageCount: number;
};

export type CountryRegionSummary = {
  id: string;
  code: RegionCode;
  name: string;
  slug: string;
};

export type CountryListItem = {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  flag: string;
  description: string;
  region: CountryRegionSummary;
  supportedNetworks: string[];
  active: boolean;
  packageCount: number;
};

export type PackageListItem = {
  id: string;
  name: string;
  slug: string;
  scope: PackageScope;
  dataGb: string;
  validityDays: number;
  price: string;
  currency: CurrencyCode;
  usageType: UsageType;
  popular: boolean;
  active: boolean;
  description: string;
  pricePerDay: string;
  countryName: string | null;
  countrySlug: string | null;
  regionName: string | null;
  regionSlug: string | null;
  supportedNetworks: string[];
};

export type PackageDetail = PackageListItem & {
  deviceCompatibility: string;
  activationPolicy: string;
  refundPolicy: string;
  installHeadline: string;
  faq: unknown;
};

export type CountryDetail = CountryListItem & {
  heroTitle: string;
  tagline: string;
  deviceCompatibility: string;
  activationPolicy: string;
  refundPolicy: string;
  faq: unknown;
  packages: PackageListItem[];
};

export type ApiCountrySummary = CountryListItem;
export type ApiCountryDetail = CountryDetail;
export type ApiPackageSummary = PackageListItem;
export type ApiPackageDetail = PackageDetail;
export type ApiRegionSummary = RegionListItem;

export type ApiOrderSummary = {
  id: string;
  email: string;
  status: OrderStatus;
  price: string;
  totalAmount: string;
  currency: CurrencyCode;
  packageName: string;
  createdAt: string;
};

export type ApiDeliverySummary = {
  id: string;
  status: DeliveryStatus;
  qrCodeUrl: string | null;
  activationCode: string | null;
  manualCode: string | null;
  iccid: string | null;
  smdpAddress: string | null;
  createdAt: string;
};
