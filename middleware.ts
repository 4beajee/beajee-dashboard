import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const username = process.env.DASHBOARD_BASIC_AUTH_USER;
  const password = process.env.DASHBOARD_BASIC_AUTH_PASSWORD;

  if (!username || !password) return NextResponse.next();

  const header = request.headers.get("authorization");
  const unauthorized = new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Gennety Analytics"',
    },
  });

  if (!header?.startsWith("Basic ")) return unauthorized;

  const credentials = atob(header.slice(6));
  const separator = credentials.indexOf(":");
  const actualUsername = credentials.slice(0, separator);
  const actualPassword = credentials.slice(separator + 1);

  if (actualUsername !== username || actualPassword !== password) {
    return unauthorized;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
