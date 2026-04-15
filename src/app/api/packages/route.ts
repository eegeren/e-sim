import type { PackageListItem } from "@/types/api";
import { handleApiError, jsonResponse } from "@/lib/api";
import { getActivePackages } from "@/lib/queries/packages";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const popularParam = searchParams.get("popular");
    const packages = await getActivePackages({
      region: searchParams.get("region") ?? undefined,
      country: searchParams.get("country") ?? undefined,
      usageType: searchParams.get("usageType") ?? undefined,
      popular:
        popularParam === null ? undefined : ["true", "1"].includes(popularParam.toLowerCase()),
    });

    return jsonResponse<{ data: PackageListItem[] }>({ data: packages });
  } catch (error) {
    return handleApiError(error);
  }
}
