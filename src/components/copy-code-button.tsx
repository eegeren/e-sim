"use client";

import { useState, useTransition } from "react";

export function CopyCodeButton({
  value,
  label = "Copy code",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        })
      }
      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
      disabled={isPending}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
