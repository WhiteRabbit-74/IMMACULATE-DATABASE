import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const anomalies = await prisma.anomaly.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(anomalies);
  } catch (error) {
    console.error("[ANOMALIES GET]", error);
    return NextResponse.json({ error: "Failed to fetch anomalies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, date, latitude, longitude, country, severity, witnesses, status, objectType, source } = body;

    if (!title || !date || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const anomaly = await prisma.anomaly.create({
      data: {
        title,
        description,
        date,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        country,
        severity: parseInt(severity) || 1,
        witnesses: parseInt(witnesses) || 0,
        status: status || "unverified",
        objectType,
        source,
      },
    });

    return NextResponse.json(anomaly, { status: 201 });
  } catch (error) {
    console.error("[ANOMALIES POST]", error);
    return NextResponse.json({ error: "Failed to create anomaly" }, { status: 500 });
  }
}
