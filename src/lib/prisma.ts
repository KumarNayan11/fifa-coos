import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// WORKAROUND: Prisma 7.8.0 / Next.js Turbopack build crash
// Eagerly instantiating `new PrismaClient()` at module level causes Next.js
// static generation to fail with `PrismaClientInitializationError`.
// We use a Proxy to lazily initialize the client only when it is first queried.
// DO NOT "simplify" this back to `const prisma = new PrismaClient()`!
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return (globalForPrisma.prisma as Record<string | symbol, unknown>)[prop];
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
