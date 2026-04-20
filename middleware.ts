import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const bearerToken = request.cookies.get("bearerToken")?.value;

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  if (pathname === "/register" && !bearerToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/corporateId";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/", "/corporateId", "/register"],
};
