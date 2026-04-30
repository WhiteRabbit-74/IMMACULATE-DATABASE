import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("📂 Importing local Intelligence Assets from 'UFO LEAK'...");

  const localDir = "D:\\APP DOCUMENTI UFO ANTIGRAVITY CLAUDE OPUS\\public\\media\\foto\\UFO LEAK";
  const files = fs.readdirSync(localDir);

  for (const file of files) {
    if (file === ".DS_Store") continue;

    const title = file.replace(/\.(webp|jpg|jpeg|png|avif)$/i, "").replace(/_/g, " ");
    const filePath = `/media/foto/UFO LEAK/${file}`;
    
    // Determine category based on filename
    let category = "photo";
    if (file.toLowerCase().includes("satellite")) category = "satellite";
    if (file.toLowerCase().includes("incident") || file.toLowerCase().includes("leak")) category = "event";
    if (file.toLowerCase().includes("trace")) category = "evidence";
    if (file.toLowerCase().includes("roswell")) category = "artifact";

    // Meta details extraction (rough guess)
    let year = 2024;
    if (file.includes("1950")) year = 1950;
    if (file.includes("1947") || file.includes("ROSWELL")) year = 1947;
    if (file.includes("STS-88")) year = 1998;

    const existing = await prisma.media.findFirst({ where: { filePath } });
    
    const mediaData = {
      type: "image",
      category,
      title: title.toUpperCase(),
      description: `Classified leak asset: ${title}`,
      filePath,
      year,
      tags: `leak,ufo,classified,${category}`,
      stars: Math.floor(Math.random() * 50) + 10,
    };

    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data: mediaData });
    } else {
      await prisma.media.create({ data: mediaData });
    }
  }

  console.log(`✅ Successfully imported ${files.length} local assets.`);
}

main().finally(() => prisma.$disconnect());
