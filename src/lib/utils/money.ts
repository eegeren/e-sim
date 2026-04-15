export function toMoneyString(value: { toString(): string } | string | number) {
  const raw = typeof value === "number" ? value : Number(value.toString());

  if (!Number.isFinite(raw)) {
    return "0.00";
  }

  return raw.toFixed(2);
}
