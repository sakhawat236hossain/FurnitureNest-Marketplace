import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role || "user";

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isAdminRoute = pathname.startsWith("/admin");
  const isSellerRoute = pathname.startsWith("/seller");
  const isUserDashboardRoute = pathname.startsWith("/dashboard");

  // Prevent unauthenticated access to protected routes
  if ((isAdminRoute || isSellerRoute || isUserDashboardRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from visiting login/register pages
  if (isAuthPage && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "seller") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  // Enforce role-based boundaries
  if (isAdminRoute && role !== "admin") {
    if (role === "seller") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  if (isSellerRoute && role !== "seller" && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/login",
    "/register",
  ],
};
