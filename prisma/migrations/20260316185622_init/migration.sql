-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RegionCode" AS ENUM ('EUROPE', 'ASIA', 'MIDDLE_EAST', 'GLOBAL', 'NORTH_AMERICA', 'SOUTH_AMERICA', 'AFRICA', 'OCEANIA');

-- CreateEnum
CREATE TYPE "PackageScope" AS ENUM ('COUNTRY', 'REGION', 'GLOBAL');

-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('LIGHT', 'STANDARD', 'HEAVY');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('USD', 'EUR', 'GBP');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROVISIONING', 'PROVISIONING_FAILED', 'DELIVERED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'GENERATED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('EMAIL', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "AnalyticsEventName" AS ENUM ('COUNTRY_VIEW', 'PACKAGE_SELECT', 'CHECKOUT_START', 'PAYMENT_SUCCESS', 'ESIM_DELIVERED');

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "code" "RegionCode" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "deviceCompatibility" TEXT NOT NULL,
    "activationPolicy" TEXT NOT NULL,
    "refundPolicy" TEXT NOT NULL,
    "faq" JSONB NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryNetwork" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "countryId" TEXT,
    "regionId" TEXT,
    "scope" "PackageScope" NOT NULL DEFAULT 'COUNTRY',
    "dataGb" DECIMAL(10,2) NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "usageType" "UsageType" NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "networkSummary" TEXT[],
    "deviceCompatibility" TEXT NOT NULL,
    "activationPolicy" TEXT NOT NULL,
    "refundPolicy" TEXT NOT NULL,
    "installHeadline" TEXT NOT NULL,
    "faq" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "apiBaseUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPlanMap" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "providerPlanCode" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderPlanMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "referralCode" TEXT,
    "referredByCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "maxUses" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "usesCount" INTEGER NOT NULL DEFAULT 0,
    "minimumOrderValue" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "couponId" TEXT,
    "referralCodeUsed" TEXT,
    "affiliateCode" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "checkoutFingerprint" TEXT,
    "subtotalAmount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "providerOrderId" TEXT,
    "qrCodeUrl" TEXT,
    "activationCode" TEXT,
    "manualCode" TEXT,
    "failureReason" TEXT,
    "metadata" JSONB,
    "abandonedEmailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "channel" "DeliveryChannel" NOT NULL,
    "qrCodeUrl" TEXT,
    "activationCode" TEXT,
    "manualCode" TEXT,
    "iccid" TEXT,
    "smdpAddress" TEXT,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "instructions" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventName" "AnalyticsEventName" NOT NULL,
    "orderId" TEXT,
    "countrySlug" TEXT,
    "packageSlug" TEXT,
    "path" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE INDEX "Region_active_name_idx" ON "Region"("active", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE INDEX "Country_regionId_active_name_idx" ON "Country"("regionId", "active", "name");

-- CreateIndex
CREATE INDEX "Country_active_slug_idx" ON "Country"("active", "slug");

-- CreateIndex
CREATE INDEX "CountryNetwork_countryId_active_idx" ON "CountryNetwork"("countryId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "CountryNetwork_countryId_name_key" ON "CountryNetwork"("countryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");

-- CreateIndex
CREATE INDEX "Package_countryId_active_popular_sortOrder_idx" ON "Package"("countryId", "active", "popular", "sortOrder");

-- CreateIndex
CREATE INDEX "Package_regionId_active_popular_sortOrder_idx" ON "Package"("regionId", "active", "popular", "sortOrder");

-- CreateIndex
CREATE INDEX "Package_scope_active_popular_sortOrder_idx" ON "Package"("scope", "active", "popular", "sortOrder");

-- CreateIndex
CREATE INDEX "Package_active_slug_idx" ON "Package"("active", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_code_key" ON "Provider"("code");

-- CreateIndex
CREATE INDEX "Provider_active_name_idx" ON "Provider"("active", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPlanMap_packageId_key" ON "ProviderPlanMap"("packageId");

-- CreateIndex
CREATE INDEX "ProviderPlanMap_providerId_active_idx" ON "ProviderPlanMap"("providerId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPlanMap_providerId_packageId_key" ON "ProviderPlanMap"("providerId", "packageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPlanMap_providerId_providerPlanCode_key" ON "ProviderPlanMap"("providerId", "providerPlanCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_active_expiryDate_idx" ON "Coupon"("active", "expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_checkoutFingerprint_key" ON "Order"("checkoutFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "Order_providerOrderId_key" ON "Order"("providerOrderId");

-- CreateIndex
CREATE INDEX "Order_packageId_createdAt_idx" ON "Order"("packageId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_email_createdAt_idx" ON "Order"("email", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Delivery_orderId_createdAt_idx" ON "Delivery"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "Delivery_status_createdAt_idx" ON "Delivery"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_createdAt_idx" ON "AnalyticsEvent"("eventName", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_countrySlug_createdAt_idx" ON "AnalyticsEvent"("countrySlug", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_packageSlug_createdAt_idx" ON "AnalyticsEvent"("packageSlug", "createdAt");

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryNetwork" ADD CONSTRAINT "CountryNetwork_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPlanMap" ADD CONSTRAINT "ProviderPlanMap_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPlanMap" ADD CONSTRAINT "ProviderPlanMap_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

