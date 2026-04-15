"use server";

import { revalidatePath } from "next/cache";
import { CurrencyCode, DiscountType, UsageType } from "@/generated/prisma/enums";
import { refundOrderAction, resendOrderEmailAction } from "@/app/actions/order-actions";
import { prisma } from "@/lib/prisma";
import { createCountry, createPackage, updateCountry, updatePackage } from "@/lib/services/adminCatalog";
import { countryCreateSchema, countryUpdateSchema } from "@/lib/validators/country";
import { packageCreateSchema, packageUpdateSchema } from "@/lib/validators/package";
import { slugify } from "@/lib/utils/slug";

async function getRegionIdFromForm(formData: FormData) {
  const regionCode = String(formData.get("regionCode") ?? "");
  const region = await prisma.region.findUnique({
    where: { code: regionCode as never },
  });

  if (!region) {
    throw new Error("Region not found.");
  }

  return region.id;
}

export async function createCountryAction(formData: FormData) {
  const payload = countryCreateSchema.parse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
    isoCode: String(formData.get("isoCode") ?? ""),
    flag: String(formData.get("flag") ?? "🌍"),
    regionId: await getRegionIdFromForm(formData),
    description: String(formData.get("description") ?? ""),
    supportedNetworks: String(formData.get("networks") ?? ""),
    active: formData.get("active"),
  });

  await createCountry(payload);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateCountryAction(formData: FormData) {
  const payload = countryUpdateSchema.parse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
    isoCode: String(formData.get("isoCode") ?? ""),
    flag: String(formData.get("flag") ?? "🌍"),
    regionId: await getRegionIdFromForm(formData),
    description: String(formData.get("description") ?? ""),
    supportedNetworks: String(formData.get("networks") ?? ""),
    active: formData.get("active"),
  });

  await updateCountry(payload.id, payload);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCountryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.country.update({
    where: { id },
    data: { active: false },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createPackageAction(formData: FormData) {
  const payload = packageCreateSchema.parse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
    countryId: String(formData.get("countryId") ?? "") || null,
    regionId: String(formData.get("regionId") ?? "") || null,
    dataGb: String(formData.get("dataGb") ?? ""),
    validityDays: String(formData.get("validityDays") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency: String(formData.get("currency") ?? CurrencyCode.USD),
    usageType: String(formData.get("usageType") ?? UsageType.STANDARD),
    popular: formData.get("popular"),
    active: formData.get("active") ?? "on",
    description: String(formData.get("description") ?? ""),
    providerId: String(formData.get("providerCode") ?? "") || null,
    providerPlanCode: null,
  });

  await createPackage(payload);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updatePackageAction(formData: FormData) {
  const payload = packageUpdateSchema.parse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
    countryId: String(formData.get("countryId") ?? "") || null,
    regionId: String(formData.get("regionId") ?? "") || null,
    dataGb: String(formData.get("dataGb") ?? ""),
    validityDays: String(formData.get("validityDays") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency: String(formData.get("currency") ?? CurrencyCode.USD),
    usageType: String(formData.get("usageType") ?? UsageType.STANDARD),
    popular: formData.get("popular"),
    active: formData.get("active"),
    description: String(formData.get("description") ?? ""),
    providerId: String(formData.get("providerCode") ?? "") || null,
    providerPlanCode: null,
  });

  await updatePackage(payload.id, payload);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePackageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.package.update({
    where: { id },
    data: { active: false },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createCouponAction(formData: FormData) {
  await prisma.coupon.create({
    data: {
      code: String(formData.get("code") ?? "").trim().toUpperCase(),
      description: String(formData.get("description") ?? "").trim(),
      discountType: String(formData.get("discountType") ?? DiscountType.PERCENTAGE) as DiscountType,
      discountValue: String(formData.get("discountValue") ?? "0"),
      minimumOrderValue: String(formData.get("minimumOrderValue") ?? "").trim() || null,
      maxUses: Number(formData.get("maxUses") ?? 0) || null,
      expiryDate: String(formData.get("expiryDate") ?? "").trim()
        ? new Date(String(formData.get("expiryDate")))
        : null,
      active: true,
    },
  });

  revalidatePath("/admin");
}

export async function updateCouponAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.coupon.update({
    where: { id },
    data: {
      description: String(formData.get("description") ?? "").trim(),
      discountType: String(formData.get("discountType") ?? DiscountType.PERCENTAGE) as DiscountType,
      discountValue: String(formData.get("discountValue") ?? "0"),
      maxUses: Number(formData.get("maxUses") ?? 0) || null,
      active: formData.get("active") === "on",
      expiryDate: String(formData.get("expiryDate") ?? "").trim()
        ? new Date(String(formData.get("expiryDate")))
        : null,
    },
  });

  revalidatePath("/admin");
}

export async function deleteCouponAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.coupon.delete({
    where: { id },
  });

  revalidatePath("/admin");
}

export { resendOrderEmailAction, refundOrderAction };
