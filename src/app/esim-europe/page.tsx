import { PackageScope, RegionCode } from "@/generated/prisma/enums";
import { SeoLanding, buildRegionDescription } from "@/components/seo-landing";
import { getRegionPackages } from "@/lib/store";

export default async function EsimEuropePage() {
  const packages = (await getRegionPackages(RegionCode.EUROPE)).filter(
    (item) => item.scope === PackageScope.REGION || item.scope === PackageScope.GLOBAL,
  );

  return (
    <SeoLanding
      title="Best eSIM for Europe"
      description="Recommended regional eSIM packages for travelers moving across Europe without managing country-by-country plans."
      coverage={buildRegionDescription(RegionCode.EUROPE)}
      networks={["Multi-network EU coverage", "Orange", "Telekom DE", "Vodafone"]}
      packages={packages.map((item) => ({
        ...item,
        title: item.name,
        dataAmountGb: item.dataGb,
        salePrice: item.price,
        usageProfile: item.usageType,
        isMostPopular: item.popular,
      }))}
    />
  );
}
