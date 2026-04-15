import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export const deliveryInclude = {
  order: {
    include: {
      package: {
        include: {
          country: true,
          region: true,
        },
      },
    },
  },
} as const;

export type DeliveryRecord = Prisma.DeliveryGetPayload<{
  include: typeof deliveryInclude;
}>;

export async function getDeliveryByOrderId(orderId: string) {
  return prisma.delivery.findFirst({
    where: { orderId },
    include: deliveryInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function upsertDeliveryForOrder(input: {
  orderId: string;
  email: string;
  channel: "EMAIL" | "DASHBOARD";
  externalOrderId?: string | null;
  qrCodeUrl?: string | null;
  activationCode?: string | null;
  manualCode?: string | null;
  iccid?: string | null;
  smdpAddress?: string | null;
  status: "PENDING" | "GENERATED" | "SENT" | "FAILED";
  instructions?: Prisma.InputJsonValue | null;
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  lastError?: string | null;
}) {
  const existing = await prisma.delivery.findFirst({
    where: { orderId: input.orderId },
    orderBy: { createdAt: "asc" },
  });

  const data = {
    email: input.email,
    channel: input.channel as never,
    externalOrderId: input.externalOrderId ?? null,
    qrCodeUrl: input.qrCodeUrl ?? null,
    activationCode: input.activationCode ?? null,
    manualCode: input.manualCode ?? null,
    iccid: input.iccid ?? null,
    smdpAddress: input.smdpAddress ?? null,
    status: input.status as never,
    instructions: input.instructions ?? Prisma.JsonNull,
    sentAt: input.sentAt ?? null,
    deliveredAt: input.deliveredAt ?? null,
    lastError: input.lastError ?? null,
  };

  if (existing) {
    return prisma.delivery.update({
      where: { id: existing.id },
      data,
      include: deliveryInclude,
    });
  }

  return prisma.delivery.create({
    data: {
      orderId: input.orderId,
      ...data,
    },
    include: deliveryInclude,
  });
}
