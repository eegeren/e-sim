import type { PackageDetail } from "@/types/api";
import { assertAdminAccess } from "@/lib/admin-auth";
import { handleApiError, jsonResponse } from "@/lib/api";
import { updatePackage } from "@/lib/services/adminCatalog";
import { packageUpdateSchema } from "@/lib/validators/package";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await assertAdminAccess(request);
    const { id } = await params;
    const payload = packageUpdateSchema.parse({
      ...(await request.json()),
      id,
    });
    const packageRecord = await updatePackage(id, payload);

    return jsonResponse<{ data: PackageDetail }>({ data: packageRecord });
  } catch (error) {
    return handleApiError(error);
  }
}
