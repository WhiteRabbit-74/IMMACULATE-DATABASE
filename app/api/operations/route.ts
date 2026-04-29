import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const operations = await prisma.operation.findMany({
      include: { _count: { select: { documents: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(operations);
  } catch (error) {
    console.error("[OPERATIONS GET]", error);
    return NextResponse.json({ error: "Failed to fetch operations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, codename, description, startYear, endYear, status, agency } = body;

    if (!name || !codename) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const operation = await prisma.operation.create({
      data: {
        name,
        codename,
        description,
        startYear: startYear ? parseInt(startYear) : undefined,
        endYear: endYear ? parseInt(endYear) : undefined,
        status: status || "active",
        agency,
      },
    });

    return NextResponse.json(operation, { status: 201 });
  } catch (error) {
    console.error("[OPERATIONS POST]", error);
    return NextResponse.json({ error: "Failed to create operation" }, { status: 500 });
  }
}
