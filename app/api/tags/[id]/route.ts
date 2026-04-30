import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// DELETE /api/tags/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const role = String((session?.user as any)?.role || "").toUpperCase();
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.tag.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TAG DELETE]", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}

// PATCH /api/tags/[id] — rename tag
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const role = String((session?.user as any)?.role || "").toUpperCase();
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: { name: name.trim().toLowerCase() },
    });
    return NextResponse.json(tag);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Tag name already in use" }, { status: 409 });
    }
    console.error("[TAG PATCH]", error);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}
