import { OrderDetailShell } from "@/components/order-detail-shell";
import { getOrderById } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  return <OrderDetailShell order={order} />;
}
