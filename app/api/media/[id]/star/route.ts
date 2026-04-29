import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.media.update({
      where: { id: params.id },
      data: { stars: { increment: 1 } },
    });
    return NextResponse.json({ success: true, stars: item.stars });
  } catch (error) {
    return NextResponse.json({ error: "Failed to star asset" }, { status: 500 });
  }
}
