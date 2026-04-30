import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: { agency: true, tags: true },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;
    const email = String(user?.email || "").toLowerCase().trim();
    const role = String((user as any)?.role || "").toUpperCase().trim();

    // Allow bypass for primary admin or if role is ADMIN
    if (!session || (email !== "admin@intel.gov" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, year, agencyId, status, coverPath, filePath, tags } = body;

    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        title,
        description,
        year: parseInt(year),
        agencyId,
        status,
        coverPath,
        filePath,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name: string) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { agency: true, tags: true },
    });

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;
    const email = String(user?.email || "").toLowerCase().trim();
    const role = String((user as any)?.role || "").toUpperCase().trim();

    if (!session || (email !== "admin@intel.gov" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Insufficient clearance" }, { status: 401 });
    }

    const body = await req.json();
    const { status, title, description, year, agencyId, operationId, tags, isFoia, foiaNumber, latitude, longitude, country, coverPath, filePath } = body;

    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(year !== undefined && { year: parseInt(year) }),
        ...(agencyId !== undefined && { agencyId }),
        ...(operationId !== undefined && { operationId: operationId || null }),
        ...(isFoia !== undefined && { isFoia }),
        ...(foiaNumber !== undefined && { foiaNumber }),
        ...(latitude !== undefined && { latitude: latitude === "" || latitude === null ? null : parseFloat(String(latitude)) }),
        ...(longitude !== undefined && { longitude: longitude === "" || longitude === null ? null : parseFloat(String(longitude)) }),
        ...(country !== undefined && { country: country || null }),
        ...(coverPath !== undefined && { coverPath }),
        ...(filePath !== undefined && { filePath }),
        ...(tags !== undefined && {
          tags: {
            set: [],
            connectOrCreate: tags.map((name: string) => ({
              where: { name },
              create: { name },
            })),
          },
        }),
      },
      include: { agency: true, tags: true, operation: true },
    });

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ error: "Failed to patch document" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;
    const email = String(user?.email || "").toLowerCase().trim();
    const role = String((user as any)?.role || "").toUpperCase().trim();

    if (!session || (email !== "admin@intel.gov" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.document.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
