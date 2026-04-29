import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [totalDocs, classified, declassified, totalAgencies, totalMedia] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { status: "classified" } }),
      prisma.document.count({ where: { status: "declassified" } }),
      prisma.agency.count(),
      prisma.media.count(),
    ]);

    return NextResponse.json({
      totalDocs,
      classified,
      declassified,
      totalAgencies,
      totalMedia,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
