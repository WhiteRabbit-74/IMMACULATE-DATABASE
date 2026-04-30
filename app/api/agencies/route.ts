import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const agencies = await prisma.agency.findMany({
      include: { _count: { select: { documents: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(agencies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const colorPrimary = formData.get("colorPrimary") as string;
    const colorSecondary = formData.get("colorSecondary") as string;
    const description = formData.get("description") as string;
    const country = formData.get("country") as string;
    const logo = formData.get("logo") as File | null;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    let logoPath: string | null = null;
    if (logo) {
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const { v4: uuidv4 } = await import("uuid");
      
      const logosDir = path.join(process.cwd(), "public", "uploads", "logos");
      await mkdir(logosDir, { recursive: true });
      const ext = logo.name.split(".").pop();
      const logoName = `${slug}-${uuidv4().slice(0,8)}.${ext}`;
      await writeFile(path.join(logosDir, logoName), Buffer.from(await logo.arrayBuffer()));
      logoPath = `/uploads/logos/${logoName}`;
    }

    const agency = await prisma.agency.create({
      data: { name, slug, colorPrimary: colorPrimary || "#00ff00", colorSecondary: colorSecondary || "#000000", description, country, logoPath },
    });

    return NextResponse.json(agency, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create agency" }, { status: 500 });
  }
}
