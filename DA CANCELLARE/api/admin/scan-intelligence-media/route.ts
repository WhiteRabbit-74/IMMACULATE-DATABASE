import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    const email = String(user?.email || "").toLowerCase().trim();
    const role = String((user as any)?.role || "").toUpperCase().trim();

    // Basic auth check
    if (!session || (email !== "admin@intel.gov" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publicDir = path.join(process.cwd(), "public", "media", "foto");
    
    const xenoDir = path.join(publicDir, "EXTRATERRESTRI");
    const ufoDir = path.join(publicDir, "UFO UAP");
    const whistDir = path.join(publicDir, "whistblower");

    const [xenoFiles, ufoFiles, whistFiles] = await Promise.all([
      readdir(xenoDir).catch(() => []),
      readdir(ufoDir).catch(() => []),
      readdir(whistDir).catch(() => []),
    ]);

    return NextResponse.json({
      xeno: xenoFiles.filter(f => !f.startsWith(".")),
      ufo: ufoFiles.filter(f => !f.startsWith(".")),
      whistblower: whistFiles.filter(f => !f.startsWith(".")),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to scan media" }, { status: 500 });
  }
}
