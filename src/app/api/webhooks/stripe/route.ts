import { headers } from "next/headers";
import { createApiError, handleApiError, jsonResponse } from "@/lib/api";
import { fulfillPaidOrder } from "@/lib/checkout";
import { markOrderFailed } from "@/lib/queries/orders";
import { parseSuccessfulCheckout, verifyWebhookSignature } from "@/lib/services/stripe";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const headerStore = await headers();
    const signature = headerStore.get("stripe-signature");

    if (!signature) {
      throw createApiError("BAD_REQUEST", "Missing stripe-signature header.", 400);
    }

    let event;

    try {
      event = verifyWebhookSignature(payload, signature);
    } catch (error) {
      throw createApiError(
        "INVALID_SIGNATURE",
        error instanceof Error ? error.message : "Webhook signature verification failed.",
        400,
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const parsed = parseSuccessfulCheckout(event);
        await fulfillPaidOrder(parsed.session);
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const parsed = event.data.object as { metadata?: { orderId?: string } };
        if (parsed.metadata?.orderId) {
          await markOrderFailed({
            orderId: parsed.metadata.orderId,
            message:
              event.type === "checkout.session.expired"
                ? "Stripe session expired before payment completion."
                : "Stripe reported an asynchronous payment failure.",
          });
        }
        break;
      }
      default:
        break;
    }

    return jsonResponse({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
