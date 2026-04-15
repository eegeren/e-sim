import type { RegionListItem } from "@/types/api";
import { handleApiError, jsonResponse } from "@/lib/api";
import { getActiveRegions } from "@/lib/queries/regions";

export async function GET() {
  try {
    const regions = await getActiveRegions();
    return jsonResponse<{ data: RegionListItem[] }>({ data: regions });
  } catch (error) {
    return handleApiError(error);
  }
}
