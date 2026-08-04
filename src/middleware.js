import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = ["/dashboard", "/seller", "/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role || "user";

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      const redirectTarget = role === "seller" ? "/seller" : "/dashboard/user";
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/seller")) {
    if (role !== "seller") {
      const redirectTarget = role === "admin" ? "/admin" : "/dashboard/user";
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (role !== "user") {
      const redirectTarget = role === "seller" ? "/seller" : "/admin";
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/seller/:path*", "/admin/:path*"],
};
