import type { PackageDetail } from "@/types/api";
import { createApiError, handleApiError, jsonResponse } from "@/lib/api";
import { getPackageById } from "@/lib/queries/packages";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const item = await getPackageById(id);

    if (!item) {
      throw createApiError("NOT_FOUND", "Package not found.", 404);
    }

    return jsonResponse<{ data: PackageDetail }>({ data: item });
  } catch (error) {
    return handleApiError(error);
  }
}
