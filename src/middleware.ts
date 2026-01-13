import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/login", "/register", "/"];

// Paths that require specific roles
const roleProtectedPaths: Record<string, string[]> = {
  "/upload": ["uploader", "moderator", "admin"],
  "/admin": ["admin"],
  "/moderate": ["moderator", "admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For role-based protection, you'll need to decode the JWT
  // This is a simplified version - in production, verify the token properly
  for (const [path, _roles] of Object.entries(roleProtectedPaths)) {
    if (pathname.startsWith(path)) {
      // You would decode the JWT here to check user role
      // For now, just check if token exists
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
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
