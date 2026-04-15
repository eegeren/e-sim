import { OrderStatus } from "@/generated/prisma/enums";
import { getStatusLabel, getStatusTone } from "@/lib/store";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
