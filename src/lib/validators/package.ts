import { CurrencyCode, UsageType } from "@/generated/prisma/enums";
import { z } from "zod";
import {
  booleanishSchema,
  normalizedSlugSchema,
  positiveDecimalString,
  positiveIntegerSchema,
} from "@/lib/validators/common";

const nullableIdSchema = z.string().trim().optional().nullable().transform((value) => value || null);

const packageFieldsSchema = z.object({
  name: z.string().trim().min(1, "Package name is required."),
  slug: normalizedSlugSchema,
  countryId: nullableIdSchema,
  regionId: nullableIdSchema,
  dataGb: positiveDecimalString,
  validityDays: positiveIntegerSchema,
  price: positiveDecimalString,
  currency: z.nativeEnum(CurrencyCode),
  usageType: z.nativeEnum(UsageType),
  popular: booleanishSchema.default(false),
  active: booleanishSchema.default(true),
  description: z.string().trim().min(1, "Description is required."),
  providerId: nullableIdSchema,
  providerPlanCode: z.string().trim().optional().nullable().transform((value) => value || null),
});

const packageBaseSchema = packageFieldsSchema.superRefine((value, ctx) => {
  if (!value.countryId && !value.regionId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Package must belong to either a country or a region.",
      path: ["countryId"],
    });
  }
});

export const packageCreateSchema = packageBaseSchema;

export const packageUpdateSchema = packageFieldsSchema.partial().extend({
  id: z.string().trim().min(1),
}).superRefine((value, ctx) => {
  const touchedFields = [
    value.name,
    value.slug,
    value.countryId,
    value.regionId,
    value.dataGb,
    value.validityDays,
    value.price,
    value.currency,
    value.usageType,
    value.popular,
    value.active,
    value.description,
    value.providerId,
    value.providerPlanCode,
  ];

  if (touchedFields.every((entry) => typeof entry === "undefined")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one package field must be provided.",
      path: ["id"],
    });
  }

  if (typeof value.countryId !== "undefined" || typeof value.regionId !== "undefined") {
    if (!value.countryId && !value.regionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Package must belong to either a country or a region.",
        path: ["countryId"],
      });
    }
  }
});

export type PackageCreateInput = z.infer<typeof packageCreateSchema>;
export type PackageUpdateInput = z.infer<typeof packageUpdateSchema>;
