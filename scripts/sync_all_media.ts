import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const PHOTO_DIR = "D:\\APP DOCUMENTI UFO ANTIGRAVITY CLAUDE OPUS\\public\\media\\foto\\UFO LEAK";
const VIDEO_DIR = "D:\\APP DOCUMENTI UFO ANTIGRAVITY CLAUDE OPUS\\public\\media\\video\\VIDEO PENTAGONO";

async function syncTargetDir(dir: string, baseType: "image" | "video") {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir);
  const syncedPaths: string[] = [];

  for (const file of files) {
    if (file === ".DS_Store" || file.toLowerCase().endsWith(".stl") || file.toLowerCase().endsWith(".pdf")) continue;
    
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) continue;

    const relativePath = fullPath.replace("D:\\APP DOCUMENTI UFO ANTIGRAVITY CLAUDE OPUS\\public", "").replace(/\\/g, "/");
    let title = file.split(".")[0]
      .replace(/^\d+[\s-]*/, "") 
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Specific fixes
    if (title.toLowerCase() === "western u") title = "Western U.S. Objects";
    if (title.toLowerCase() === "mt") title = "Mt. Etna Object";
    if (title.toLowerCase() === "pr 001 unresolved uap report, africa 2022") title = "Africa 2022 UAP Report";
    if (title.toLowerCase() === "pr 012, unresolved uap report, europe 2022") title = "Europe 2022 UAP Report";

    const mediaData = {
      type: baseType,
      category: baseType === "video" ? "video" : "photo",
      title: title.toUpperCase(),
      description: `Intelligence Asset: ${title}. Recovered from authorized sector.`,
      filePath: relativePath,
      year: 2024,
      tags: `intel,classified,${baseType}`,
      stars: Math.floor(Math.random() * 50) + 10,
    };

    await prisma.media.upsert({
      where: { id: (await prisma.media.findFirst({ where: { filePath: relativePath } }))?.id || 'new-id' },
      update: mediaData,
      create: mediaData,
    });

    console.log(`✅ Synced: ${title}`);
    syncedPaths.push(relativePath);
  }
  return syncedPaths;
}

async function main() {
  console.log("🧹 Cleaning and Syncing AUTHORIZED Media Only...");
  
  const syncedPhotos = await syncTargetDir(PHOTO_DIR, "image");
  const syncedVideos = await syncTargetDir(VIDEO_DIR, "video");
  const allSyncedPaths = [...syncedPhotos, ...syncedVideos];

  // REMOVE EVERYTHING ELSE
  const allInDB = await prisma.media.findMany({ select: { id: true, filePath: true } });
  let deleted = 0;
  for (const m of allInDB) {
    if (!allSyncedPaths.includes(m.filePath)) {
      await prisma.media.delete({ where: { id: m.id } });
      deleted++;
    }
  }

  console.log(`\n✨ DONE.`);
  console.log(`✅ Total Synced: ${allSyncedPaths.length}`);
  console.log(`🗑️ Total Removed (Unwanted): ${deleted}`);
}

main().finally(() => prisma.$disconnect());

main().finally(() => prisma.$disconnect());
