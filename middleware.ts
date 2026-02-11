import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only redirect root path to basePath
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/claudecode_todoapp1", request.url));
  }
}

export const config = {
  matcher: "/",
};
