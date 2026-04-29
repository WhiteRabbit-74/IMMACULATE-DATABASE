import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const paths = {
    cwd: process.cwd(),
    dirname: __dirname,
    prismaDirExists: fs.existsSync(path.join(process.cwd(), "prisma")),
    dbExistsInPrisma: fs.existsSync(path.join(process.cwd(), "prisma", "dev.db")),
    publicDbExists: fs.existsSync(path.join(process.cwd(), "public", "database", "dev.db")),
  };

  // Try to find dev.db anywhere
  const findFile = (dir: string, fileName: string, depth = 0): string[] => {
    if (depth > 3) return [];
    let results: string[] = [];
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (item === fileName) results.push(fullPath);
        if (fs.statSync(fullPath).isDirectory()) {
          results = results.concat(findFile(fullPath, fileName, depth + 1));
        }
      }
    } catch (e) {}
    return results;
  };

  const foundAt = findFile(process.cwd(), "dev.db");

  return NextResponse.json({ ...paths, foundAt });
}
