import type { CountryListItem } from "@/types/api";
import { handleApiError, jsonResponse } from "@/lib/api";
import { getActiveCountries } from "@/lib/queries/countries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countries = await getActiveCountries({
      region: searchParams.get("region") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });

    return jsonResponse<{ data: CountryListItem[] }>({ data: countries });
  } catch (error) {
    return handleApiError(error);
  }
}
