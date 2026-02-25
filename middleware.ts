import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Define protected routes
const protectedRoutes = ["/dashboard", "/tasks"];
const apiProtectedRoutes = ["/api/tasks"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isApiProtectedRoute = apiProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute || isApiProtectedRoute) {
    const token = request.cookies.get("token")?.value;
    console.log(`[Middleware] Path: ${pathname}, Token present: ${!!token}`);

    // If no token, redirect to login (for pages) or return 401 (for API)
    if (!token) {
      console.log(`[Middleware] No token found, redirecting to login`);
      if (isApiProtectedRoute) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication token is missing",
            errorCode: "TOKEN_MISSING",
          },
          { status: 401 }
        );
      }

      // Redirect to login page
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    try {
      const payload = await verifyToken(token);
      console.log(`[Middleware] Token verified successfully for user: ${payload.userId}`);

      // Add userId to request headers for API routes
      if (isApiProtectedRoute) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.userId);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token
      console.log(`[Middleware] Token verification failed:`, error);
      if (isApiProtectedRoute) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
            errorCode: "TOKEN_INVALID",
          },
          { status: 401 }
        );
      }

      // Redirect to login page
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
