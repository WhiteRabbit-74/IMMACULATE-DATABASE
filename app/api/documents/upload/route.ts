import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const session = await auth();
    const s = session as any;
    const user = s?.user || {};
    const token = s?.token || s;
    const email = String(user.email || token.email || "").toLowerCase().trim();
    const role = String(user.role || token.role || "").toUpperCase().trim();
    
    const isPrimaryAdmin = email === "admin@intel.gov" || email.includes("admin@intel.gov");
    const hasAdminRole = role === "ADMIN";

    if (!isPrimaryAdmin && !hasAdminRole) {
      console.warn(`[UPLOAD_BLOCK] Unauthorized attempt by ${email}`);
      return NextResponse.json({ error: "Unauthorized: Insufficient clearance" }, { status: 401 });
    }

    try {
      const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const cover = formData.get("cover") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const year = formData.get("year") as string;
    const agencyId = formData.get("agencyId") as string;
    const status = formData.get("status") as string;
    const country = formData.get("country") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const coverMode = formData.get("coverMode") as string; // manual | auto

    if (!file || !title || !year || !agencyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    // Get agency for path
    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 400 });
    }

    // Create upload directories
    const uploadDir = path.join(process.cwd(), "public", "uploads", agency.slug, year);
    const coversDir = path.join(process.cwd(), "public", "uploads", "covers");
    await mkdir(uploadDir, { recursive: true });
    await mkdir(coversDir, { recursive: true });

    // Save PDF file
    const fileId = uuidv4();
    const fileName = `${fileId}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    const filePathRelative = `/uploads/${agency.slug}/${year}/${fileName}`;

    // Save cover if manual upload
    let coverPathRelative: string | null = null;
    if (coverMode === "manual" && cover) {
      const coverExt = cover.name.split(".").pop();
      const coverName = `${fileId}-cover.${coverExt}`;
      const coverFilePath = path.join(coversDir, coverName);
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      await writeFile(coverFilePath, coverBuffer);
      coverPathRelative = `/uploads/covers/${coverName}`;
    }

    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // Create document in DB
    const document = await prisma.document.create({
      data: {
        title,
        description: description || null,
        year: parseInt(year),
        agencyId,
        status: status || "classified",
        filePath: filePathRelative,
        coverPath: coverPathRelative,
        fileSize: file.size,
        country: country || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        tags: tags.length
          ? {
              connectOrCreate: tags.map((name: string) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { agency: true, tags: true },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
