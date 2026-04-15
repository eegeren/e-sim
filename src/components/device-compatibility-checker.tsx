"use client";

import { useState } from "react";

const deviceMap = {
  Apple: {
    icon: "🍎",
    models: [
      "iPhone XR / XS or newer",
      "iPhone 11 / 12 / 13 / 14 / 15 / 16 series",
      "iPhone SE (3rd generation)",
      "iPad Pro / Air / Mini with cellular + eSIM",
    ],
  },
  Samsung: {
    icon: "🌀",
    models: [
      "Galaxy S20 and newer (all variants)",
      "Galaxy Z Flip / Fold series",
      "Galaxy Note20 Ultra",
      "Selected Galaxy A54 / A55 regional variants",
    ],
  },
  Google: {
    icon: "🔵",
    models: [
      "Pixel 3 and all newer Pixel models",
      "Pixel Fold",
      "Pixel 8 / 8a / 9 series",
      "Pixel 7 Pro / 7a",
    ],
  },
} as const;

type Brand = keyof typeof deviceMap;

export function DeviceCompatibilityChecker() {
  const [brand, setBrand] = useState<Brand>("Apple");
  const selected = deviceMap[brand];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[var(--card-shadow)]">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          {(Object.keys(deviceMap) as Brand[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(b)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                brand === b
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
              }`}
            >
              <span>{deviceMap[b].icon}</span>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-5 p-6 lg:grid-cols-2">
        {/* Models list */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Compatible {brand} models
          </p>
          <ul className="mt-4 space-y-2.5">
            {selected.models.map((model) => (
              <li key={model} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m2.5 6 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm leading-6 text-slate-700">{model}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Info card */}
        <div className="flex flex-col gap-4 rounded-[1.6rem] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-slate-950">
              {brand} is eSIM-ready
            </p>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Most recent {brand} devices support esimQ plans when the device is unlocked and eSIM-enabled.
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <div className="rounded-[1.2rem] bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-700">Before you buy</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                Confirm your phone is carrier-unlocked and eSIM-enabled. Install the eSIM before departure for the smoothest experience.
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-amber-50/80 border border-amber-200/60 p-3">
              <p className="text-xs leading-5 text-amber-700">
                <span className="font-bold">Tip:</span> Physical SIM-only models or carrier-locked devices are not compatible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
