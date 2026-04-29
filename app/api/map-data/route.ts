import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [documents, anomalies, media] = await Promise.all([
      prisma.document.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          latitude: true,
          longitude: true,
          country: true,
          year: true,
          agency: { select: { name: true, colorPrimary: true } },
        },
        orderBy: { year: "desc" },
      }),
      prisma.anomaly.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          latitude: true,
          longitude: true,
          country: true,
          severity: true,
          objectType: true,
        },
      }),
      prisma.media.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
        },
        select: {
          id: true,
          title: true,
          type: true,
          category: true,
          latitude: true,
          longitude: true,
          year: true,
        }
      })
    ]);

    const docsWithCoords = documents.filter((d) => d.latitude !== null && d.longitude !== null);

    return NextResponse.json({ 
      documents: docsWithCoords, 
      anomalies,
      media 
    });
  } catch (error) {
    console.error("[MAP DATA GET]", error);
    return NextResponse.json({ error: "Failed to fetch map data" }, { status: 500 });
  }
}
