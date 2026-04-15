import type { PackageDetail } from "@/types/api";
import { assertAdminAccess } from "@/lib/admin-auth";
import { handleApiError, jsonResponse } from "@/lib/api";
import { createPackage } from "@/lib/services/adminCatalog";
import { packageCreateSchema } from "@/lib/validators/package";

export async function POST(request: Request) {
  try {
    await assertAdminAccess(request);
    const payload = packageCreateSchema.parse(await request.json());
    const packageRecord = await createPackage(payload);

    return jsonResponse<{ data: PackageDetail }>({ data: packageRecord }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
