# AirThread eSIM MVP

Next.js 16 + TypeScript + App Router + Tailwind CSS + Prisma 7 + PostgreSQL + Stripe tabanli bir eSIM satis MVP'si.

## Ozellikler

- Ulke listesi ve detay sayfasi
- Paket secimi ve Stripe Checkout akisi
- Stripe webhook ile siparis guncelleme
- Mock eSIM provider ile QR / activation code uretimi
- Siparis detay sayfasi
- Prisma 7 uyumlu adapter-pg kurulumu

## Gereken env degiskenleri

`.env` dosyasina su degerleri ekleyin:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esim_mvp?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

## Kurulum

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Webhook dinlemek icin:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
# e-sim
