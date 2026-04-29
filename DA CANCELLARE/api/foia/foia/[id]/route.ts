import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, adminNotes } = body;

    const updated = await prisma.foiaRequest.update({
      where: { id: params.id },
      data: { status, adminNotes, updatedAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[FOIA PATCH]", error);
    return NextResponse.json({ error: "Failed to update FOIA request" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.foiaRequest.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FOIA DELETE]", error);
    return NextResponse.json({ error: "Failed to delete FOIA request" }, { status: 500 });
  }
}
