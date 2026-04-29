import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const requests = await prisma.foiaRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("[FOIA GET]", error);
    return NextResponse.json({ error: "Failed to fetch FOIA requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, organization, subject, description } = body;

    if (!name || !email || !subject || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const foiaRequest = await prisma.foiaRequest.create({
      data: { name, email, organization, subject, description, status: "pending" },
    });

    return NextResponse.json(foiaRequest, { status: 201 });
  } catch (error) {
    console.error("[FOIA POST]", error);
    return NextResponse.json({ error: "Failed to create FOIA request" }, { status: 500 });
  }
}
