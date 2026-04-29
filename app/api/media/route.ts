import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { auth } from "@/auth";

// Upload configuration
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const agencyId = searchParams.get("agencyId");

    const media = await prisma.media.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(agencyId ? { agencyId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("[MEDIA UPLOAD GET]", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    const email = String(user?.email || "").toLowerCase().trim();
    const role = String((user as any)?.role || "").toUpperCase().trim();

    if (!session || (email !== "admin@intel.gov" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (file) {
        // Safe directory check - will likely fail on Vercel but that's expected for POST
        if (!existsSync(UPLOAD_DIR)) {
          try { mkdirSync(UPLOAD_DIR, { recursive: true }); } catch (e) {}
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = file.name.split(".").pop();
        const filename = `media_${Date.now()}.${ext}`;
        const filePath = join(UPLOAD_DIR, filename);
        await writeFile(filePath, buffer);
        data.filePath = `/uploads/${filename}`;
        data.mimeType = file.type;
        data.fileSize = file.size;
        
        if (data.mimeType.startsWith("video/")) data.type = "video";
        else if (data.mimeType.startsWith("audio/")) data.type = "audio";
        else data.type = "image";
      }
      
      data.title = formData.get("title");
      data.description = formData.get("description");
      data.category = formData.get("category");
      data.tags = formData.get("tags");
      data.agencyId = formData.get("agencyId");
      data.year = formData.get("year");
      data.latitude = formData.get("latitude");
      data.longitude = formData.get("longitude");
      data.country = formData.get("country");
      data.sensor = formData.get("sensor");
      data.source = formData.get("source");
    }

    if (!data.filePath || !data.title) {
      return NextResponse.json({ error: "File/Path and title are required" }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        type: data.type || "image",
        category: data.category || "photo",
        title: data.title,
        description: data.description,
        filePath: data.filePath,
        thumbnailPath: data.thumbnailPath || (data.type === "image" ? data.filePath : null),
        mimeType: data.mimeType,
        fileSize: data.fileSize ? parseInt(String(data.fileSize)) : null,
        tags: data.tags,
        agencyId: data.agencyId || null,
        year: data.year ? parseInt(String(data.year)) : null,
        latitude: data.latitude ? parseFloat(String(data.latitude)) : null,
        longitude: data.longitude ? parseFloat(String(data.longitude)) : null,
        country: data.country || null,
        sensor: data.sensor || null,
        source: data.source || null,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("[MEDIA UPLOAD POST]", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}
