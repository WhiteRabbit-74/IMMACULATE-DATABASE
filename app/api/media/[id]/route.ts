import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.media.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const user = session?.user;
    const email = String(user?.email || "").toLowerCase().trim();
    const role = String((user as any)?.role || "").toUpperCase().trim();

    if (!session || (email !== "admin@intel.gov" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Insufficient clearance" }, { status: 401 });
    }

    const body = await req.json();
    const media = await prisma.media.update({
      where: { id: params.id },
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        type: body.type,
        filePath: body.filePath,
        thumbnailPath: body.thumbnailPath,
        year: body.year ? parseInt(body.year) : undefined,
        tags: body.tags,
        ...(body.latitude !== undefined && { latitude: body.latitude === "" ? null : parseFloat(String(body.latitude)) }),
        ...(body.longitude !== undefined && { longitude: body.longitude === "" ? null : parseFloat(String(body.longitude)) }),
        ...(body.country !== undefined && { country: body.country || null }),
        ...(body.sensor !== undefined && { sensor: body.sensor || null }),
        ...(body.source !== undefined && { source: body.source || null }),
      },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("[MEDIA PATCH]", error);
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 });
  }
}
