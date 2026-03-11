import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET ?? "development-secret";

const protectedRoutes = [
  { path: "/admin", role: "admin" },
  { path: "/employee", role: "employee" },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchingRoute = protectedRoutes.find((route) => pathname.startsWith(route.path));

  if (!matchingRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });
  if (token?.role === matchingRoute.role) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*"],
};
