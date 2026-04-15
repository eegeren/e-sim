import type { Region } from "@/generated/prisma/client";
import type { ApiRegionSummary } from "@/types/api";

type RegionRecord = Region & {
  _count?: {
    countries: number;
    packages: number;
  };
};

export function serializeRegion(item: RegionRecord): ApiRegionSummary {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    slug: item.slug,
    active: item.active,
    countryCount: item._count?.countries ?? 0,
    packageCount: item._count?.packages ?? 0,
  };
}
