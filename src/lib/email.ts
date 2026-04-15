import type { OrderRecord } from "@/lib/queries/orders";
import type { DeliveryRecord } from "@/lib/queries/deliveries";
import {
  sendOrderConfirmationEmail,
  sendOrderDeliveryEmail,
} from "@/lib/services/email";

export { sendOrderConfirmationEmail, sendOrderDeliveryEmail };

export async function sendOrderEmail(order: OrderRecord) {
  return sendOrderConfirmationEmail(order);
}

export async function sendAbandonedCheckoutEmail(order: unknown) {
  return sendOrderConfirmationEmail(order as OrderRecord);
}

export async function sendOrderEmailWithDelivery(
  order: OrderRecord,
  delivery?: {
    iccid?: string | null;
    smdpAddress?: string | null;
    qrCodeUrl?: string | null;
    activationCode?: string | null;
    manualCode?: string | null;
  },
) {
  const hydratedDelivery = {
    id: "compat",
    orderId: order.id,
    email: order.email,
    channel: "EMAIL",
    qrCodeUrl: delivery?.qrCodeUrl ?? order.qrCodeUrl,
    activationCode: delivery?.activationCode ?? order.activationCode,
    manualCode: delivery?.manualCode ?? order.manualCode,
    iccid: delivery?.iccid ?? null,
    smdpAddress: delivery?.smdpAddress ?? null,
    status: "SENT",
    instructions: null,
    externalOrderId: order.providerOrderId,
    lastError: null,
    deliveredAt: new Date(),
    sentAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    order,
  } as unknown as DeliveryRecord;

  return sendOrderDeliveryEmail({
    order,
    delivery: hydratedDelivery,
  });
}
