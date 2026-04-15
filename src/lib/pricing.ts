import { DiscountType } from "@/generated/prisma/enums";

export const DEFAULT_TAX_RATE = Number(process.env.DEFAULT_TAX_RATE ?? "0.2");

export function formatPrice(value: string | number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(typeof value === "number" ? value : Number(value));
}

export function toMinorUnits(value: string | number) {
  return Math.round(Number(value) * 100);
}

export function fromMinorUnits(value: number) {
  return (value / 100).toFixed(2);
}

export function calculateDiscount(
  subtotal: number,
  coupon:
    | {
        discountType: DiscountType;
        discountValue: string | number | { toString(): string };
      }
    | null
    | undefined,
) {
  if (!coupon) {
    return 0;
  }

  if (coupon.discountType === DiscountType.PERCENTAGE) {
    return Math.min(subtotal, subtotal * (Number(coupon.discountValue.toString()) / 100));
  }

  return Math.min(subtotal, Number(coupon.discountValue.toString()));
}

export function calculateTaxableSummary(subtotal: number, discount: number, taxRate = DEFAULT_TAX_RATE) {
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    discount: discount.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    pricePerDay: 0,
  };
}

export function calculatePricePerDay(total: string | number, validityDays: number) {
  if (validityDays <= 0) {
    return "0.00";
  }

  return (Number(total) / validityDays).toFixed(2);
}
