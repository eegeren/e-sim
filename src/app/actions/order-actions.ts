"use server";

import { revalidatePath } from "next/cache";
import { DeliveryChannel, DeliveryStatus, OrderStatus } from "@/generated/prisma/enums";
import { getDeliveryByOrderId, upsertDeliveryForOrder } from "@/lib/queries/deliveries";
import { getOrderById } from "@/lib/queries/orders";
import { sendOrderDeliveryEmail } from "@/lib/services/email";
import { getStripeClient } from "@/lib/services/stripe";
import { prisma } from "@/lib/prisma";

export async function resendOrderEmailAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");

  if (!orderId) {
    throw new Error("orderId is required.");
  }

  const order = await getOrderById(orderId);
  const delivery = await getDeliveryByOrderId(orderId);

  if (!order || !delivery || !delivery.qrCodeUrl) {
    throw new Error("Order not ready for email delivery.");
  }

  const result = await sendOrderDeliveryEmail({
    order,
    delivery,
  });

  await upsertDeliveryForOrder({
    orderId: order.id,
    email: order.email,
    channel: DeliveryChannel.EMAIL,
    externalOrderId: delivery.externalOrderId,
    qrCodeUrl: delivery.qrCodeUrl,
    activationCode: delivery.activationCode,
    manualCode: delivery.manualCode,
    iccid: delivery.iccid,
    smdpAddress: delivery.smdpAddress,
    status: result.delivered ? DeliveryStatus.SENT : DeliveryStatus.GENERATED,
    instructions: delivery.instructions,
    sentAt: result.delivered ? new Date() : null,
    deliveredAt: delivery.deliveredAt,
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/success`);
  revalidatePath(`/admin`);
}

export async function refundOrderAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");

  if (!orderId) {
    throw new Error("orderId is required.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (!order.stripePaymentIntentId) {
    throw new Error("No Stripe payment intent found for this order.");
  }

  const stripe = getStripeClient();
  await stripe.refunds.create({
    payment_intent: order.stripePaymentIntentId,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.REFUNDED,
    },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin");
}
