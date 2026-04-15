import { createApiError } from "@/lib/api";

export async function assertAdminAccess(_request: Request) {
  void _request;

  // Placeholder for future auth middleware.
  // When admin auth is introduced, validate the request here and throw:
  // throw createApiError("UNAUTHORIZED", "Admin authentication is required.", 401);
  return true;
}

export { createApiError };
