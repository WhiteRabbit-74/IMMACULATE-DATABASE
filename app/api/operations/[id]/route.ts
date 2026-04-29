import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const operation = await prisma.operation.findUnique({
      where: { id: params.id },
      include: { documents: true },
    });
    if (!operation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(operation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch operation" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, codename, description, startYear, endYear, status, agency } = body;

    const operation = await prisma.operation.update({
      where: { id: params.id },
      data: {
        name,
        codename,
        description,
        startYear: startYear ? parseInt(startYear) : undefined,
        endYear: endYear ? parseInt(endYear) : undefined,
        status,
        agency,
      },
    });

    return NextResponse.json(operation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update operation" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.operation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete operation" }, { status: 500 });
  }
}
