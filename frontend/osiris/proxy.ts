import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // In dev/demo mode, skip the Supabase config fetch entirely.
  // Without this, each request waits ~7-8s for the /api/env timeout.
  // To restore: set NEXT_PUBLIC_DEV_MODE=false in .env.local
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
