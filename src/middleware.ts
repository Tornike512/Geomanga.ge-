import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasRequiredRole } from "@/lib/jwt-utils";

// Paths that don't require authentication (public routes)
const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/",
  "/browse",
  "/manga", // Manga detail pages
  "/read", // Reading pages
  "/user", // Public user profiles
  "/auth/callback",
  "/api/auth",
];

// Paths that require authentication but no specific role
const protectedPaths = [
  "/profile", // User's own profile/settings
  "/library", // User's personal library
];

// Paths that require specific roles (using UserRole enum values)
const roleProtectedPaths: Record<string, string[]> = {
  "/upload": ["USER", "UPLOADER", "MODERATOR", "ADMIN"],
  "/admin": ["ADMIN"],
  "/moderate": ["MODERATOR", "ADMIN"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Check if this is a prefetch/background request
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch" ||
    (request.headers.get("rsc") === "1" &&
      request.headers.get("next-url") !== null);

  const isBackgroundRequest =
    request.headers.get("next-url") !== null &&
    request.headers.get("accept") === "*/*";

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // Check if the path requires specific roles
  const isRoleProtectedPath = Object.keys(roleProtectedPaths).some((path) =>
    pathname.startsWith(path),
  );

  // Redirect to login if accessing protected route without token
  if ((isProtectedPath || isRoleProtectedPath) && !token) {
    if (isPrefetch || isBackgroundRequest) {
      return new NextResponse(null, { status: 204 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For routes that don't match public or explicitly protected paths,
  // also require authentication (default to protected)
  if (!isPublicPath && !token) {
    if (isPrefetch || isBackgroundRequest) {
      return new NextResponse(null, { status: 204 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For role-based protection, verify user has required role
  for (const [path, roles] of Object.entries(roleProtectedPaths)) {
    if (pathname.startsWith(path)) {
      if (!token) {
        if (isPrefetch || isBackgroundRequest) {
          return new NextResponse(null, { status: 204 });
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has required role
      const hasRole = hasRequiredRole(token, roles);
      if (!hasRole) {
        if (isPrefetch || isBackgroundRequest) {
          return new NextResponse(null, { status: 204 });
        }
        const unauthorizedUrl = new URL("/", request.url);
        unauthorizedUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
