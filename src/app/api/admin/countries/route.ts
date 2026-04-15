import type { CountryDetail } from "@/types/api";
import { assertAdminAccess } from "@/lib/admin-auth";
import { handleApiError, jsonResponse } from "@/lib/api";
import { createCountry } from "@/lib/services/adminCatalog";
import { countryCreateSchema } from "@/lib/validators/country";

export async function POST(request: Request) {
  try {
    await assertAdminAccess(request);
    const payload = countryCreateSchema.parse(await request.json());
    const country = await createCountry(payload);

    return jsonResponse<{ data: CountryDetail }>({ data: country }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
