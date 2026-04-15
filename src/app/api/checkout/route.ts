import { NextResponse } from "next/server";
import { createStripeCheckoutSessionForOrder } from "@/lib/checkout";
import { getAppUrl } from "@/lib/services/stripe";
import { checkoutSessionSchema } from "@/lib/validators/checkout";
import { headers } from "next/headers";

export async function POST(request: Request) {
  let packageId = "";

  try {
    const payload = checkoutSessionSchema.parse(Object.fromEntries(await request.formData()));
    packageId = payload.packageId;
    const headerStore = await headers();
    const appUrl = getAppUrl(headerStore.get("origin"));
    const { sessionUrl } = await createStripeCheckoutSessionForOrder({
      ...payload,
      appUrl,
    });

    return NextResponse.redirect(sessionUrl, 303);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start checkout.";

    return NextResponse.redirect(
      new URL(`/checkout/${packageId}?error=${encodeURIComponent(message)}`, request.url),
      303,
    );
  }
}
