import { headers } from "next/headers";
import { handleApiError, jsonResponse } from "@/lib/api";
import { createStripeCheckoutSessionForOrder } from "@/lib/checkout";
import { getAppUrl } from "@/lib/services/stripe";
import { checkoutSessionSchema } from "@/lib/validators/checkout";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const payload =
      contentType.includes("application/json")
        ? checkoutSessionSchema.parse(await request.json())
        : checkoutSessionSchema.parse(Object.fromEntries(await request.formData()));

    const headerStore = await headers();
    const appUrl = getAppUrl(headerStore.get("origin"));
    const result = await createStripeCheckoutSessionForOrder({
      ...payload,
      appUrl,
    });

    return jsonResponse({
      data: {
        orderId: result.order.id,
        checkoutUrl: result.sessionUrl,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
