import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/documents/bulk — bulk status update
// body: { ids: string[], status: "classified" | "declassified" }
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = String((session?.user as any)?.role || "").toUpperCase();
    if (!session || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, status, action } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No document IDs provided" }, { status: 400 });
    }

    if (action === "delete") {
      const { count } = await prisma.document.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, count, action: "deleted" });
    }

    // Default: status update
    if (!["classified", "declassified"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { count } = await prisma.document.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });

    return NextResponse.json({ success: true, count, action: "status_updated", status });
  } catch (error) {
    console.error("[BULK PATCH]", error);
    return NextResponse.json({ error: "Bulk operation failed" }, { status: 500 });
  }
}
