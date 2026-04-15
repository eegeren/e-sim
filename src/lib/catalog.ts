import { cache } from "react";
import { getActiveCountries } from "@/lib/queries/countries";
import { getPopularPackages } from "@/lib/queries/packages";
import { getActiveRegions } from "@/lib/queries/regions";

export const getSuggestedCountries = cache(async () => {
  const countries = await getActiveCountries();
  return countries.slice(0, 5);
});

export const getHomepagePopularPackages = cache(async () => getPopularPackages());

export const getHomepageRegions = cache(async () => getActiveRegions());
