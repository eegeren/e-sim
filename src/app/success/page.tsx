import { redirect } from "next/navigation";
import { getOrderByStripeSessionId } from "@/lib/queries/orders";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/");
  }

  const order = await getOrderByStripeSessionId(sessionId);

  if (!order) {
    redirect("/");
  }

  redirect(`/orders/${order.id}?session_id=${encodeURIComponent(sessionId)}`);
}
