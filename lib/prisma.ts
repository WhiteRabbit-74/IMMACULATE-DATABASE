import { PrismaClient } from "@prisma/client";
import path from "path";

// Secure Vault Access - WhiteRabbit-74
// Failsafe: Default to absolute path for local SQLite in public directory if DATABASE_URL is missing
// Files in public/ are guaranteed to be available at runtime on Vercel
const dbPath = path.join(process.cwd(), "public", "database", "dev.db");
const dbUrl = process.env.DATABASE_URL || `file:${dbPath}`;

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
