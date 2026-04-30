import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany();
  const baseDir = "D:/APP DOCUMENTI UFO ANTIGRAVITY CLAUDE OPUS/public";
  
  console.log("🔍 Checking all media file paths...");
  let brokenCount = 0;

  for (const m of media) {
    if (m.filePath.startsWith("http")) continue;
    
    const fullPath = path.join(baseDir, m.filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ BROKEN: ${m.title} -> ${m.filePath}`);
      brokenCount++;
    }
  }

  if (brokenCount === 0) {
    console.log("✅ All local media files verified.");
  } else {
    console.log(`⚠️ Found ${brokenCount} broken file links.`);
  }
}

main().finally(() => prisma.$disconnect());
