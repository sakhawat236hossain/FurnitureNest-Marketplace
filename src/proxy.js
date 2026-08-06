import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const role = token?.role || "user";
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isSellerRoute = pathname.startsWith("/seller");
  const isUserDashboardRoute = pathname.startsWith("/dashboard");

  if ((isAdminRoute || isSellerRoute || isUserDashboardRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const destination =
      role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/dashboard/user";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(
      new URL(role === "seller" ? "/seller" : "/dashboard/user", request.url),
    );
  }

  if (isSellerRoute && role !== "seller") {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard/user", request.url),
    );
  }

  if (isUserDashboardRoute && role !== "user") {
    return NextResponse.redirect(
      new URL(role === "seller" ? "/seller" : "/admin", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/seller/:path*", "/login", "/register"],
};
