import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function POST() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.email !== "admin@intel.gov") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const publicDir = path.join(process.cwd(), "public");
    const mediaDirs = ["/media/foto", "/media/video"];
    const localFiles: string[] = [];

    // Helper to scan directory recursively
    const scanDir = async (dirPath: string, basePath: string) => {
      try {
        const fullPath = path.join(publicDir, dirPath);
        const entries = await fs.readdir(fullPath, { withFileTypes: true });
        for (const entry of entries) {
          const entryPath = path.join(dirPath, entry.name);
          const entryBasePath = path.join(basePath, entry.name);
          
          if (entry.isDirectory()) {
            await scanDir(entryPath, entryBasePath);
          } else if (entry.isFile()) {
            const webPath = entryBasePath.replace(/\\/g, "/");
            const finalPath = webPath.startsWith("/") ? webPath : `/${webPath}`;
            // Avoid duplicates with documents
            localFiles.push(finalPath);
          }
        }
      } catch (e) {}
    };

    for (const dir of mediaDirs) {
      await scanDir(dir, dir);
    }

    // Get existing media to avoid duplicates
    const existingMedia = await prisma.media.findMany({ select: { filePath: true } });
    const existingPaths = new Set(existingMedia.map(m => m.filePath));

    let createdCount = 0;
    for (const filePath of localFiles) {
      if (!existingPaths.has(filePath)) {
        // Determine type and category
        const isVideo = filePath.toLowerCase().endsWith(".mp4") || filePath.toLowerCase().endsWith(".webm");
        const type = isVideo ? "video" : "image";
        
        // Extract a nice title from filename
        const fileName = path.basename(filePath, path.extname(filePath));
        const title = fileName.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

        // Extract category from folder name if possible
        let category = isVideo ? "video" : "photo";
        if (filePath.includes("/EXTRATERRESTRI/")) category = "artifact";
        if (filePath.includes("/UFO_UAP/")) category = "artifact";
        if (filePath.includes("/whistblower/")) category = "evidence";
        if (filePath.includes("/UFO LEAK/")) category = "evidence";

        await prisma.media.create({
          data: {
            title,
            type,
            category,
            filePath,
            description: `Auto-synced from filesystem: ${path.dirname(filePath)}`,
            stars: 0
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({ success: true, createdCount });
  } catch (error) {
    console.error("Sync all error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
