import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const agencyId = searchParams.get("agencyId");
    const year = searchParams.get("year");
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const project = searchParams.get("project");

    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }
    if (agencyId) where.agencyId = agencyId;
    if (year) where.year = parseInt(year);
    if (status) where.status = status;
    
    const tagsToFilter = [];
    if (tag) tagsToFilter.push(tag);
    if (project) tagsToFilter.push(project);

    if (tagsToFilter.length > 0) {
      where.tags = {
        some: {
          name: { in: tagsToFilter }
        }
      };
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        agency: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS GET]", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, year, agencyId, status, filePath, coverPath, tags } = body;

    if (!title || !year || !agencyId || !filePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        year: parseInt(year),
        agencyId,
        status: status || "classified",
        filePath,
        coverPath,
        tags: tags?.length
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
    console.error("[DOCUMENTS POST]", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
