"use client";

import { useState, useTransition } from "react";

export function ResendDeliveryButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          setMessage(null);
          setIsError(false);

          startTransition(async () => {
            const response = await fetch(`/api/orders/${orderId}/resend`, {
              method: "POST",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
              setIsError(true);
              setMessage(payload?.error?.message ?? "Unable to resend delivery email.");
              return;
            }

            setMessage("Delivery email sent.");
          });
        }}
        disabled={isPending}
        className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sending..." : "Resend email"}
      </button>
      {message ? (
        <p className={`text-xs ${isError ? "text-rose-700" : "text-emerald-700"}`}>{message}</p>
      ) : null}
    </div>
  );
}
