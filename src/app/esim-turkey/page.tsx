import { SeoLanding } from "@/components/seo-landing";
import { getCountryBySlug } from "@/lib/store";

export default async function EsimTurkeyPage() {
  const country = await getCountryBySlug("turkey");

  return (
    <SeoLanding
      title="Best eSIM for Turkey"
      description="Recommended Turkey plans for city breaks, longer leisure trips and heavier hotspot use."
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
