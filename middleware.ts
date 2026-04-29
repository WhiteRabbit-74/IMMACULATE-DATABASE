import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// We ARE NOT using the 'auth' wrapper here because it's not compatible with Prisma on Edge
// This resolves the MIDDLEWARE_INVOCATION_FAILED error on Vercel
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // For now, we allow all access to resolve the 500 crashes
  // Security is handled at the Page/API level via getServerSession/auth()
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
