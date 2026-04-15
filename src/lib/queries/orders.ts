import { createHash, randomUUID } from "node:crypto";
import { cache } from "react";
import { Prisma } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";
import { createApiError } from "@/lib/api";

export const orderInclude = {
  package: {
    include: {
      country: {
        include: {
          networks: {
            where: { active: true },
            orderBy: { name: "asc" as const },
          },
        },
      },
      region: true,
      providerPlanMap: {
        include: {
          provider: true,
        },
      },
    },
  },
  coupon: true,
  deliveries: {
    orderBy: { updatedAt: "desc" as const },
  },
  user: true,
} as const;

export type OrderRecord = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

export function createCheckoutFingerprint(input: {
  email: string;
  packageId: string;
  couponCode?: string | null;
  affiliateCode?: string | null;
  referralCode?: string | null;
}) {
  const bucket = Math.floor(Date.now() / (1000 * 60 * 15));
  return createHash("sha256")
    .update(
      [
        input.email.trim().toLowerCase(),
        input.packageId,
        input.couponCode?.trim().toUpperCase() ?? "",
        input.affiliateCode?.trim().toUpperCase() ?? "",
        input.referralCode?.trim().toUpperCase() ?? "",
        bucket.toString(),
      ].join(":"),
    )
    .digest("hex");
}

async function findOrCreateUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return existing;
  }

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      referralCode: `AT-${randomUUID().slice(0, 8).toUpperCase()}`,
    },
  });
}

export const getOrderById = cache(async (id: string) =>
  prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  }),
);

export const getOrderByStripeSessionId = cache(async (stripeSessionId: string) =>
  prisma.order.findUnique({
    where: { stripeSessionId },
    include: orderInclude,
  }),
);

export const getOrdersByEmail = cache(async (email: string) =>
  prisma.order.findMany({
    where: { email: email.trim().toLowerCase() },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  }),
);

export async function createPendingOrder(input: {
  email: string;
  packageId: string;
  couponCode?: string | null;
  couponId?: string | null;
  referralCode?: string | null;
  affiliateCode?: string | null;
  price: string;
  currency: string;
  subtotalAmount: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  metadata?: Prisma.InputJsonValue | null;
}) {
  const user = await findOrCreateUserByEmail(input.email);
  const fingerprint = createCheckoutFingerprint({
    email: input.email,
    packageId: input.packageId,
    couponCode: input.couponCode ?? null,
    affiliateCode: input.affiliateCode,
    referralCode: input.referralCode,
  });

  const existing = await prisma.order.findUnique({
    where: { checkoutFingerprint: fingerprint },
    include: orderInclude,
  });

  if (existing && existing.status === OrderStatus.PENDING) {
    return existing;
  }

  return prisma.order.create({
    data: {
      userId: user.id,
      email: user.email,
      packageId: input.packageId,
      couponId: input.couponId ?? null,
      referralCodeUsed: input.referralCode ?? null,
      affiliateCode: input.affiliateCode ?? null,
      checkoutFingerprint: fingerprint,
      status: OrderStatus.PENDING,
      price: input.price,
      currency: input.currency as never,
      subtotalAmount: input.subtotalAmount,
      discountAmount: input.discountAmount,
      taxAmount: input.taxAmount,
      totalAmount: input.totalAmount,
      metadata: input.metadata ?? Prisma.JsonNull,
    },
    include: orderInclude,
  });
}

export async function markOrderPaid(input: {
  orderId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
}) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
  });

  if (!order) {
    throw createApiError("NOT_FOUND", "Order not found.", 404);
  }

  if (
    order.status === OrderStatus.PAID ||
    order.status === OrderStatus.PROVISIONING ||
    order.status === OrderStatus.DELIVERED
  ) {
    return getOrderById(input.orderId);
  }

  await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: OrderStatus.PAID,
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId ?? null,
      paidAt: new Date(),
      failureReason: null,
    },
  });

  return getOrderById(input.orderId);
}

export async function markOrderDelivered(input: {
  orderId: string;
  externalOrderId?: string | null;
  qrCodeUrl?: string | null;
  activationCode?: string | null;
  manualCode?: string | null;
}) {
  await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: OrderStatus.DELIVERED,
      providerOrderId: input.externalOrderId ?? null,
      qrCodeUrl: input.qrCodeUrl ?? null,
      activationCode: input.activationCode ?? null,
      manualCode: input.manualCode ?? null,
      failureReason: null,
    },
  });

  return getOrderById(input.orderId);
}

export async function markOrderFailed(input: {
  orderId: string;
  message: string;
}) {
  await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: OrderStatus.FAILED,
      failureReason: input.message,
    },
  });

  return getOrderById(input.orderId);
}

export async function markOrderProvisioning(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.PROVISIONING,
      failureReason: null,
    },
  });

  return getOrderById(orderId);
}
