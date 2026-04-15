import type { Prisma } from "@/generated/prisma/client";
import { AnalyticsEventName } from "@/generated/prisma/enums";
import { hasDatabase, prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

export async function trackEvent(input: {
  eventName: AnalyticsEventName;
  orderId?: string;
  countrySlug?: string;
  packageSlug?: string;
  path?: string;
  properties?: Record<string, unknown>;
}) {
  if (!hasDatabase) {
    return;
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        eventName: input.eventName,
        orderId: input.orderId,
        countrySlug: input.countrySlug,
        packageSlug: input.packageSlug,
        path: input.path,
        payload: (input.properties as Prisma.InputJsonValue | undefined) ?? undefined,
      },
    });
  } catch (error) {
    logError("Failed to track analytics event", error, {
      name: input.eventName,
      path: input.path,
    });
  }
}
