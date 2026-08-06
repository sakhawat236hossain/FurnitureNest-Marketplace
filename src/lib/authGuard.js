import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth(requiredRole = null) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      ),
      session: null,
    };
  }

  if (requiredRole) {
    const userRole = session.user.role || "user";
    const rolesAllowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!rolesAllowed.includes(userRole)) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, message: "Forbidden. Access denied." },
          { status: 403 }
        ),
        session,
      };
    }
  }

  return {
    authorized: true,
    response: null,
    session,
  };
}
