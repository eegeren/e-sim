import { RegionCode, UsageType } from "@/generated/prisma/enums";
import { z } from "zod";
import { booleanishSchema } from "@/lib/validators/common";

export const packagesQuerySchema = z.object({
  region: z.string().trim().optional(),
  country: z.string().trim().optional(),
  usageType: z.nativeEnum(UsageType).optional(),
  popular: booleanishSchema.optional(),
});

export const countriesQuerySchema = z.object({
  region: z.string().trim().optional(),
  q: z.string().trim().optional(),
});

export function parseRegionCode(input?: string | null) {
  if (!input) {
    return undefined;
  }

  const normalized = input.trim().toUpperCase().replace(/-/g, "_");
  return z.nativeEnum(RegionCode).safeParse(normalized).success
    ? (normalized as RegionCode)
    : undefined;
}
