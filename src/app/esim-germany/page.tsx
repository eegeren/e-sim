import { SeoLanding } from "@/components/seo-landing";
import { getCountryBySlug } from "@/lib/store";

export default async function EsimGermanyPage() {
  const country = await getCountryBySlug("germany");

  return (
    <SeoLanding
      title="Best eSIM for Germany"
      description="Recommended Germany eSIM packages for business travel, rail itineraries and longer stays."
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
