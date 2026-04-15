import Stripe from "stripe";
import { createApiError } from "@/lib/api";

let stripeClient: Stripe | null = null;

function getSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw createApiError("STRIPE_NOT_CONFIGURED", "STRIPE_SECRET_KEY is not set.", 500);
  }

  return key;
}

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(getSecretKey(), {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw createApiError("STRIPE_NOT_CONFIGURED", "STRIPE_WEBHOOK_SECRET is not set.", 500);
  }

  return secret;
}

export function getAppUrl(origin?: string | null) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  return origin?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export async function createCheckoutSession(input: {
  appUrl: string;
  orderId: string;
  packageId: string;
  email: string;
  packageName: string;
  coverageLabel: string;
  dataGb: string;
  validityDays: number;
  currency: string;
  totalAmount: string;
  cancelPath: string;
}) {
  const stripe = getStripeClient();

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    payment_method_types: ["card"],
    success_url: `${input.appUrl}/orders/${input.orderId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.appUrl}${input.cancelPath}`,
    metadata: {
      orderId: input.orderId,
      packageId: input.packageId,
      email: input.email,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: Math.round(Number(input.totalAmount) * 100),
          product_data: {
            name: `${input.packageName} eSIM`,
            description: `${input.coverageLabel} • ${input.dataGb} GB • ${input.validityDays} days`,
          },
        },
      },
    ],
  });
}

export function verifyWebhookSignature(payload: string, signature: string) {
  return getStripeClient().webhooks.constructEvent(payload, signature, getStripeWebhookSecret());
}

export function parseSuccessfulCheckout(event: Stripe.Event) {
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    throw createApiError("INVALID_EVENT", "Unsupported Stripe event type.", 400);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  return {
    sessionId: session.id,
    orderId: session.metadata?.orderId ?? null,
    packageId: session.metadata?.packageId ?? null,
    email: session.metadata?.email ?? session.customer_details?.email ?? session.customer_email ?? null,
    paymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    session,
  };
}
