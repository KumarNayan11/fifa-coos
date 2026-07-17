import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Need to duplicate getSecretKey and some logic since we can't easily import
// from @/config/env in middleware if it depends on node modules sometimes,
// but Next.js edge runtime supports process.env directly.
// We can try importing from auth.ts but verifySession uses process.env
const SESSION_COOKIE_NAME = "fifa_coos_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only protect /ops routes for now
  if (!pathname.startsWith("/ops")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isLoginPage = pathname === "/ops/login";

  if (!token) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/ops/login", request.url));
  }

  // Token exists, verify it
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("SESSION_SECRET is not defined");
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    // Check expiration manually just in case
    if (new Date(payload.expires as string) < new Date()) {
      throw new Error("Session expired");
    }

    const role = payload.role as string;
    const allowedRoles = ["ops_manager", "security", "admin"];

    if (!allowedRoles.includes(role)) {
      // Authenticated but unauthorized
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Authenticated and authorized
    if (isLoginPage) {
      // Already logged in, redirect away from login page
      return NextResponse.redirect(new URL("/ops", request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token, clear it and redirect to login
    const response = NextResponse.redirect(
      isLoginPage ? request.url : new URL("/ops/login", request.url),
    );
    if (!isLoginPage) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }
}

export const config = {
  matcher: ["/ops/:path*"],
};
