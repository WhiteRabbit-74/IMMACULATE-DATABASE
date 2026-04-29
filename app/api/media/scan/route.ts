import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const publicDir = path.join(process.cwd(), "public");
    const mediaDirs = ["/media/foto", "/media/video", "/uploads"];

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
            // Convert backslashes to forward slashes for web compatibility
            const webPath = entryBasePath.replace(/\\/g, "/");
            localFiles.push(webPath.startsWith("/") ? webPath : `/${webPath}`);
          }
        }
      } catch (e) {
        // Directory might not exist or be inaccessible, ignore
      }
    };

    for (const dir of mediaDirs) {
      await scanDir(dir, dir);
    }

    // Get all media from DB
    const dbMedia = await prisma.media.findMany({
      select: { filePath: true }
    });
    const dbFilePaths = new Set(dbMedia.map(m => m.filePath));

    // Also get document files to exclude them
    const dbDocs = await prisma.document.findMany({
      select: { filePath: true, coverPath: true, autoCoverPath: true }
    });
    
    dbDocs.forEach(d => {
      if (d.filePath) dbFilePaths.add(d.filePath);
      if (d.coverPath) dbFilePaths.add(d.coverPath);
      if (d.autoCoverPath) dbFilePaths.add(d.autoCoverPath);
    });

    const unregisteredFiles = localFiles.filter(file => !dbFilePaths.has(file));

    return NextResponse.json({ unregisteredFiles });
  } catch (error) {
    console.error("Scan error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { filePath, title, description, type } = await req.json();

    if (!filePath || !title || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        title,
        description: description || "Locally scanned asset",
        type,
        filePath,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Ingest error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
