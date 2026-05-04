import { NextResponse, type NextRequest } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE,
  getDashboardAuthConfig,
  isValidDashboardSession,
  sanitizeNextPath,
} from "@/lib/dashboard-auth";

export async function middleware(request: NextRequest) {
  const config = getDashboardAuthConfig();
  if (!config) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const session = request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
  const isValid = await isValidDashboardSession(session);

  if (pathname === "/login") {
    if (!isValid) return NextResponse.next();
    return NextResponse.redirect(new URL(sanitizeNextPath(request.nextUrl.searchParams.get("next")), request.url));
  }

  if (isValid) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logout).*)"],
};
