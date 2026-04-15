import { NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma/enums";
import { sendAbandonedCheckoutEmail } from "@/lib/email";
import { logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return false;
  }

  return authHeader === `Bearer ${expected}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 1000 * 60 * 30);

  const orders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      stripeSessionId: {
        not: null,
      },
      createdAt: {
        lte: cutoff,
      },
      abandonedEmailSentAt: null,
    },
    include: {
      package: {
        include: {
          country: true,
          region: true,
        },
      },
    },
    take: 100,
  });

  let sent = 0;

  for (const order of orders) {
    try {
      const result = await sendAbandonedCheckoutEmail(order);

      if (result.delivered) {
        sent += 1;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          abandonedEmailSentAt: new Date(),
        },
      });
    } catch (error) {
      logError("Failed to send abandoned checkout email", error, {
        orderId: order.id,
      });
    }
  }

  return NextResponse.json({
    processed: orders.length,
    sent,
  });
}
