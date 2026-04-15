import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const hasDatabase = Boolean(process.env.DATABASE_URL);

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

function createUnavailablePrismaClient() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("DATABASE_URL is not set. Running in mock data mode requires guarded access.");
      },
    },
  ) as PrismaClient;
}

export const prisma =
  globalForPrisma.prisma ?? (hasDatabase ? createPrismaClient() : createUnavailablePrismaClient());

if (process.env.NODE_ENV !== "production" && hasDatabase) {
  globalForPrisma.prisma = prisma;
}
