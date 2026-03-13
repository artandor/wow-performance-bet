import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/api/auth",
  "/_next",
  "/favicon.ico",
];

function authMiddlewareHandler(req: any) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// In demo mode, skip auth entirely so the app works without any credentials.
export default process.env.DEMO_MODE === 'true'
  ? (_req: NextRequest) => NextResponse.next()
  : auth(authMiddlewareHandler);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
