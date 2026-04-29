import { PrismaClient } from "@prisma/client";

// Failsafe: Default to local SQLite if DATABASE_URL is missing
const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
