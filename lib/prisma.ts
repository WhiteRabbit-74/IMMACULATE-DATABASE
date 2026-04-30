import { PrismaClient } from "@prisma/client";
import path from "path";

// Secure Vault Access - WhiteRabbit-74
// Failsafe: Default to absolute path for local SQLite if DATABASE_URL is missing
// We use path.resolve(process.cwd()) to ensure Vercel finds the bundled file
const dbPath = path.resolve(process.cwd(), "prisma", "forensic_v81.db");
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
