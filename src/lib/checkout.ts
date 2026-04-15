import type Stripe from "stripe";
import { DeliveryChannel, DeliveryStatus, OrderStatus } from "@/generated/prisma/enums";
import { createApiError } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { androidSteps, iphoneSteps } from "@/lib/content";
import { prisma } from "@/lib/db";
import { logError } from "@/lib/logger";
import { getPackageByIdRecord } from "@/lib/queries/packages";
import {
  createPendingOrder,
  getOrderById,
  getOrderByStripeSessionId,
  markOrderDelivered,
  markOrderFailed,
  markOrderPaid,
  markOrderProvisioning,
} from "@/lib/queries/orders";
import { getDeliveryByOrderId, upsertDeliveryForOrder } from "@/lib/queries/deliveries";
import { calculateDiscount, calculateTaxableSummary } from "@/lib/pricing";
import { sendOrderConfirmationEmail, sendOrderDeliveryEmail } from "@/lib/services/email";
import { createEsimOrder } from "@/lib/services/esimProvider";
import { createCheckoutSession, getStripeClient } from "@/lib/services/stripe";
import type { CheckoutSessionInput } from "@/lib/validators/checkout";

export async function validateCoupon(code: string | null | undefined, subtotal: number) {
  if (!code) {
    return null;
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) {
    throw createApiError("INVALID_COUPON", "Coupon not found.", 400);
  }

  if (!coupon.active) {
    throw createApiError("INVALID_COUPON", "Coupon is not active.", 400);
  }

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    throw createApiError("INVALID_COUPON", "Coupon has expired.", 400);
  }

  if (typeof coupon.maxUses === "number" && coupon.usesCount >= coupon.maxUses) {
    throw createApiError("INVALID_COUPON", "Coupon has reached its redemption limit.", 400);
  }

  if (coupon.minimumOrderValue && subtotal < Number(coupon.minimumOrderValue)) {
    throw createApiError("INVALID_COUPON", "Order value is below the coupon minimum.", 400);
  }

  return coupon;
}

export async function prepareCheckoutOrder(input: CheckoutSessionInput) {
  const selectedPackage = await getPackageByIdRecord(input.packageId);

  if (!selectedPackage) {
    throw createApiError("NOT_FOUND", "Package not found.", 404);
  }

  const subtotal = Number(selectedPackage.price.toString());
  const coupon = await validateCoupon(input.couponCode, subtotal);
  const discountAmount = calculateDiscount(subtotal, coupon);
  const pricing = calculateTaxableSummary(subtotal, discountAmount);

  const order = await createPendingOrder({
    email: input.email,
    packageId: selectedPackage.id,
    couponCode: coupon?.code ?? null,
    couponId: coupon?.id ?? null,
    referralCode: input.referralCode,
    affiliateCode: input.affiliateCode,
    price: selectedPackage.price.toString(),
    currency: selectedPackage.currency,
    subtotalAmount: pricing.subtotal,
    discountAmount: pricing.discount,
    taxAmount: pricing.tax,
    totalAmount: pricing.total,
    metadata: {
      couponCode: coupon?.code ?? null,
    },
  });

  return {
    order,
    package: selectedPackage,
    coupon,
    pricing,
  };
}

export async function createStripeCheckoutSessionForOrder(input: CheckoutSessionInput & {
  appUrl: string;
}) {
  const prepared = await prepareCheckoutOrder(input);

  if (prepared.order.stripeSessionId) {
    const existingSession = await getStripeClient().checkout.sessions.retrieve(
      prepared.order.stripeSessionId,
    );

    return {
      order: prepared.order,
      sessionUrl:
        existingSession.url ??
        `${input.appUrl}/orders/${prepared.order.id}?session_id=${prepared.order.stripeSessionId}`,
      existingSessionId: prepared.order.stripeSessionId,
    };
  }

  const session = await createCheckoutSession({
    appUrl: input.appUrl,
    orderId: prepared.order.id,
    packageId: prepared.package.id,
    email: prepared.order.email,
    packageName: prepared.package.name,
    coverageLabel:
      prepared.package.country?.name ?? prepared.package.region?.name ?? "Global",
    dataGb: prepared.package.dataGb.toString(),
    validityDays: prepared.package.validityDays,
    currency: prepared.package.currency,
    totalAmount: prepared.pricing.total,
    cancelPath: `/checkout/${prepared.package.id}`,
  });

  const order = await prisma.order.update({
    where: { id: prepared.order.id },
    data: {
      stripeSessionId: session.id,
    },
    include: {
      package: {
        include: {
          country: true,
          region: true,
          providerPlanMap: {
            include: { provider: true },
          },
        },
      },
      coupon: true,
      deliveries: true,
      user: true,
    },
  });

  await Promise.all([
    sendOrderConfirmationEmail(order).catch((error) => {
      logError("Failed to send order confirmation email", error, { orderId: order.id });
    }),
    trackEvent({
      eventName: "CHECKOUT_START",
      orderId: order.id,
      packageSlug: prepared.package.slug,
      countrySlug: prepared.package.country?.slug ?? undefined,
      path: "/api/checkout/session",
    }),
  ]);

  if (!session.url) {
    throw createApiError("STRIPE_SESSION_ERROR", "Stripe session URL was not returned.", 500);
  }

  return {
    order,
    sessionUrl: session.url,
    existingSessionId: session.id,
  };
}

export async function fulfillPaidOrder(session: Stripe.Checkout.Session) {
  const order =
    (session.metadata?.orderId ? await getOrderById(session.metadata.orderId) : null) ??
    (await getOrderByStripeSessionId(session.id));

  if (!order) {
    throw createApiError("NOT_FOUND", "Order not found during fulfillment.", 404);
  }

  const existingDelivery = await getDeliveryByOrderId(order.id);

  if (order.status === OrderStatus.DELIVERED && existingDelivery) {
    return order;
  }

  const paidOrder = await markOrderPaid({
    orderId: order.id,
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
  });

  if (!paidOrder) {
    throw createApiError("NOT_FOUND", "Order not found after payment update.", 404);
  }

  const deliveryAfterPaid = await getDeliveryByOrderId(order.id);

  if (deliveryAfterPaid?.status === DeliveryStatus.SENT || deliveryAfterPaid?.status === DeliveryStatus.GENERATED) {
    await markOrderDelivered({
      orderId: order.id,
      externalOrderId: deliveryAfterPaid.externalOrderId,
      qrCodeUrl: deliveryAfterPaid.qrCodeUrl,
      activationCode: deliveryAfterPaid.activationCode,
      manualCode: deliveryAfterPaid.manualCode,
    });
    return getOrderById(order.id);
  }

  await markOrderProvisioning(order.id);

  try {
    const provisioned = await createEsimOrder({
      orderId: paidOrder.id,
      packageId: paidOrder.package.providerPlanMap?.providerPlanCode ?? paidOrder.package.slug,
      packageTitle: paidOrder.package.name,
      coverageLabel: paidOrder.package.country?.name ?? paidOrder.package.region?.name ?? "Global",
      customerEmail: paidOrder.email,
    });

    const delivery = await upsertDeliveryForOrder({
      orderId: paidOrder.id,
      email: paidOrder.email,
      channel: DeliveryChannel.DASHBOARD,
      externalOrderId: provisioned.externalOrderId,
      qrCodeUrl: provisioned.qrCodeUrl,
      activationCode: provisioned.activationCode,
      manualCode: provisioned.manualCode,
      iccid: provisioned.iccid,
      smdpAddress: provisioned.smdpAddress,
      status: provisioned.status === "failed" ? DeliveryStatus.FAILED : DeliveryStatus.GENERATED,
      instructions: {
        iphone: iphoneSteps,
        android: androidSteps,
      },
      deliveredAt: provisioned.status === "failed" ? null : new Date(),
      lastError: provisioned.status === "failed" ? "Provider reported a failed status." : null,
    });

    if (provisioned.status === "failed") {
      await markOrderFailed({
        orderId: paidOrder.id,
        message: "Provider reported a failed provisioning status.",
      });
      return getOrderById(paidOrder.id);
    }

    const deliveredOrder = await markOrderDelivered({
      orderId: paidOrder.id,
      externalOrderId: provisioned.externalOrderId,
      qrCodeUrl: provisioned.qrCodeUrl,
      activationCode: provisioned.activationCode,
      manualCode: provisioned.manualCode,
    });

    if (!deliveredOrder) {
      throw createApiError("NOT_FOUND", "Delivered order could not be loaded.", 404);
    }

    const emailResult = await sendOrderDeliveryEmail({
      order: deliveredOrder,
      delivery,
    }).catch(async (error) => {
      logError("Failed to send delivery email", error, { orderId: deliveredOrder.id });
      await upsertDeliveryForOrder({
        orderId: deliveredOrder.id,
        email: deliveredOrder.email,
        channel: DeliveryChannel.EMAIL,
        externalOrderId: delivery.externalOrderId,
        qrCodeUrl: delivery.qrCodeUrl,
        activationCode: delivery.activationCode,
        manualCode: delivery.manualCode,
        iccid: delivery.iccid,
        smdpAddress: delivery.smdpAddress,
        status: DeliveryStatus.FAILED,
        instructions: delivery.instructions,
        deliveredAt: delivery.deliveredAt,
        lastError: error instanceof Error ? error.message : "Email delivery failed.",
      });

      return null;
    });

    if (emailResult) {
      await upsertDeliveryForOrder({
        orderId: deliveredOrder.id,
        email: deliveredOrder.email,
        channel: DeliveryChannel.EMAIL,
        externalOrderId: delivery.externalOrderId,
        qrCodeUrl: delivery.qrCodeUrl,
        activationCode: delivery.activationCode,
        manualCode: delivery.manualCode,
        iccid: delivery.iccid,
        smdpAddress: delivery.smdpAddress,
        status: emailResult.delivered ? DeliveryStatus.SENT : DeliveryStatus.GENERATED,
        instructions: delivery.instructions,
        sentAt: emailResult.delivered ? new Date() : null,
        deliveredAt: delivery.deliveredAt,
      });
    }

    if (deliveredOrder.couponId) {
      await prisma.coupon.update({
        where: { id: deliveredOrder.couponId },
        data: {
          usesCount: {
            increment: 1,
          },
        },
      });
    }

    await Promise.all([
      trackEvent({
        eventName: "PAYMENT_SUCCESS",
        orderId: deliveredOrder.id,
        packageSlug: deliveredOrder.package.slug,
        countrySlug: deliveredOrder.package.country?.slug ?? undefined,
        path: "/api/webhooks/stripe",
      }),
      trackEvent({
        eventName: "ESIM_DELIVERED",
        orderId: deliveredOrder.id,
        packageSlug: deliveredOrder.package.slug,
        countrySlug: deliveredOrder.package.country?.slug ?? undefined,
        path: "/api/webhooks/stripe",
      }),
    ]);

    return deliveredOrder;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delivery generation failed.";

    await upsertDeliveryForOrder({
      orderId: paidOrder.id,
      email: paidOrder.email,
      channel: DeliveryChannel.DASHBOARD,
      status: DeliveryStatus.FAILED,
      lastError: message,
    });
    await markOrderFailed({
      orderId: paidOrder.id,
      message,
    });

    throw error;
  }
}
