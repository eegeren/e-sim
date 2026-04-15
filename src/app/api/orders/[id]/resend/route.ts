import { revalidatePath } from "next/cache";
import { DeliveryChannel, DeliveryStatus } from "@/generated/prisma/enums";
import { createApiError, handleApiError, jsonResponse } from "@/lib/api";
import { getDeliveryByOrderId, upsertDeliveryForOrder } from "@/lib/queries/deliveries";
import { getOrderById } from "@/lib/queries/orders";
import { sendOrderDeliveryEmail } from "@/lib/services/email";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      throw createApiError("NOT_FOUND", "Order not found.", 404);
    }

    const delivery = await getDeliveryByOrderId(id);

    if (!delivery || !delivery.qrCodeUrl) {
      throw createApiError("CONFLICT", "Delivery is not ready to resend yet.", 409);
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

    revalidatePath(`/orders/${order.id}`);

    return jsonResponse({
      data: {
        success: true,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
