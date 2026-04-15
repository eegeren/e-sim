import { SeoLanding } from "@/components/seo-landing";
import { getCountryBySlug } from "@/lib/store";

export default async function EsimJapanPage() {
  const country = await getCountryBySlug("japan");

  return (
    <SeoLanding
      title="Best eSIM for Japan"
      description="Recommended Japan eSIM plans for arrivals, city-hopping and longer stays with hotspot use."
      coverage={country.heroTitle}
      networks={country.networks.map((network) => network.name)}
      packages={country.packages.map((item) => ({
        ...item,
        title: item.name,
        dataAmountGb: item.dataGb,
        salePrice: item.price,
        usageProfile: item.usageType,
        isMostPopular: item.popular,
        country,
      }))}
      country={country}
    />
  );
}
