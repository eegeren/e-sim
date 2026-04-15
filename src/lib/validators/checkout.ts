import { z } from "zod";

export const checkoutSessionSchema = z.object({
  packageId: z.string().trim().min(1, "Package ID is required."),
  email: z.email("A valid email address is required.").transform((value) => value.trim().toLowerCase()),
  couponCode: z.string().trim().optional().nullable().transform((value) => value || null),
  affiliateCode: z.string().trim().optional().nullable().transform((value) => value || null),
  referralCode: z.string().trim().optional().nullable().transform((value) => value || null),
});

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;
