import type { CountryDetail } from "@/types/api";
import { assertAdminAccess } from "@/lib/admin-auth";
import { handleApiError, jsonResponse } from "@/lib/api";
import { updateCountry } from "@/lib/services/adminCatalog";
import { countryUpdateSchema } from "@/lib/validators/country";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await assertAdminAccess(request);
    const { id } = await params;
    const payload = countryUpdateSchema.parse({
      ...(await request.json()),
      id,
    });
    const country = await updateCountry(id, payload);

    return jsonResponse<{ data: CountryDetail }>({ data: country });
  } catch (error) {
    return handleApiError(error);
  }
}
