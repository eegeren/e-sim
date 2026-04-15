import type { CountryDetail } from "@/types/api";
import { createApiError, handleApiError, jsonResponse } from "@/lib/api";
import { getCountryBySlug } from "@/lib/queries/countries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const country = await getCountryBySlug(slug);

    if (!country) {
      throw createApiError("NOT_FOUND", "Country not found.", 404);
    }

    return jsonResponse<{ data: CountryDetail }>({ data: country });
  } catch (error) {
    return handleApiError(error);
  }
}
