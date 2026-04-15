import { z } from "zod";
import { booleanishSchema, normalizedSlugSchema, parseDelimitedList } from "@/lib/validators/common";

const supportedNetworksSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => parseDelimitedList(value))
  .refine((value) => value.length > 0, "At least one supported network is required.");

const countryBaseSchema = z.object({
  name: z.string().trim().min(1, "Country name is required."),
  slug: normalizedSlugSchema,
  isoCode: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "ISO code must be two uppercase letters."),
  flag: z.string().trim().min(1, "Flag is required."),
  regionId: z.string().trim().min(1, "Region is required."),
  description: z.string().trim().min(1, "Description is required."),
  active: booleanishSchema.default(true),
  supportedNetworks: supportedNetworksSchema,
});

export const countryCreateSchema = countryBaseSchema;

export const countryUpdateSchema = countryBaseSchema.partial().extend({
  id: z.string().trim().min(1),
}).superRefine((value, ctx) => {
  if (
    !value.name &&
    !value.slug &&
    !value.isoCode &&
    !value.flag &&
    !value.regionId &&
    !value.description &&
    typeof value.active === "undefined" &&
    !value.supportedNetworks
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one country field must be provided.",
      path: ["id"],
    });
  }
});

export type CountryCreateInput = z.infer<typeof countryCreateSchema>;
export type CountryUpdateInput = z.infer<typeof countryUpdateSchema>;
