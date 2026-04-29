import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function POST() {
  try {
    const session = await auth();
    // Broaden admin check to ensure WhiteRabbit-74 has access
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === "admin@intel.gov";
    
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "AUTH_DENIED", details: "Elevated privileges required." }, { status: 401 });
    }

    const publicDir = path.join(process.cwd(), "public");
    
    // Check if public dir exists at all
    try {
      await fs.access(publicDir);
    } catch (e) {
      return NextResponse.json({ success: false, error: "PUBLIC_DIR_NOT_FOUND", details: `Search path ${publicDir} inaccessible.` }, { status: 500 });
    }

    const mediaDirs = ["media/foto", "media/video"];
    const localFiles: string[] = [];

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
            localFiles.push(finalPath);
          }
        }
      } catch (e) {
        console.warn(`Skipping path ${dirPath}: ${e}`);
      }
    };

    for (const dir of mediaDirs) {
      await scanDir(dir, `/${dir}`);
    }

    const existingMedia = await prisma.media.findMany({ select: { filePath: true } });
    const existingPaths = new Set(existingMedia.map(m => m.filePath));

    let createdCount = 0;
    for (const filePath of localFiles) {
      if (!existingPaths.has(filePath)) {
        const isVideo = filePath.toLowerCase().endsWith(".mp4") || filePath.toLowerCase().endsWith(".webm");
        const type = isVideo ? "video" : "image";
        const fileName = path.basename(filePath, path.extname(filePath));
        const title = fileName.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

        let category = isVideo ? "video" : "photo";
        if (filePath.toLowerCase().includes("extraterrestri")) category = "artifact";
        if (filePath.toLowerCase().includes("ufo_uap")) category = "artifact";
        if (filePath.toLowerCase().includes("whistblower")) category = "evidence";
        if (filePath.toLowerCase().includes("leak")) category = "evidence";

        await prisma.media.create({
          data: {
            title,
            type,
            category,
            filePath,
            description: `Auto-ingested proof: ${path.dirname(filePath)}`,
            stars: 0
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({ success: true, createdCount, totalScanned: localFiles.length });
  } catch (error: any) {
    console.error("CRITICAL_SYNC_FAILURE:", error);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR", details: error.message }, { status: 500 });
  }
}
