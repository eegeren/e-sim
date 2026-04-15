import { SeoLanding } from "@/components/seo-landing";
import { getCountryBySlug } from "@/lib/store";

export default async function EsimFrancePage() {
  const country = await getCountryBySlug("france");

  return (
    <SeoLanding
      title="Best eSIM for France"
      description="Recommended France eSIM plans with supported networks, flexible validity and clear setup guidance."
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
