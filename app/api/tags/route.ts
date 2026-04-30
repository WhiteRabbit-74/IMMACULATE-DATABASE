import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET: list all tags with document count
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { documents: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

// POST: create a new tag
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = String((session?.user as any)?.role || "").toUpperCase();
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Tag name required" }, { status: 400 });
    }
    const tag = await prisma.tag.create({ data: { name: name.trim().toLowerCase() } });
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
    }
    console.error("[TAGS POST]", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
