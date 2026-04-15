import { z } from "zod";
import { slugify } from "@/lib/utils/slug";

export const normalizedSlugSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => slugify(value));

export const positiveDecimalString = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value) && value > 0, "Must be positive")
  .transform((value) => value.toFixed(2));

export const positiveIntegerSchema = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine((value) => Number.isInteger(value) && value > 0, "Must be a positive integer");

export const booleanishSchema = z
  .union([z.boolean(), z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => value === true || value === "true" || value === "on" || value === 1 || value === "1");

export function parseDelimitedList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
