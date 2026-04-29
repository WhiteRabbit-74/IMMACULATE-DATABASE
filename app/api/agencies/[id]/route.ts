import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agency = await prisma.agency.findUnique({
      where: { id: params.id },
      include: { documents: { include: { tags: true } }, _count: { select: { documents: true } } },
    });
    if (!agency) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(agency);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const agency = await prisma.agency.update({
      where: { id: params.id },
      data: {
        name: body.name,
        colorPrimary: body.colorPrimary,
        colorSecondary: body.colorSecondary,
        description: body.description,
        country: body.country,
      },
    });
    return NextResponse.json(agency);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.agency.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
