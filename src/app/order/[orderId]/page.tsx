import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegacyOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  redirect(`/orders/${orderId}`);
}
