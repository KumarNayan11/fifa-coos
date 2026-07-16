import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "../config/env";
import type { UserRole } from "../config/constants";

const SESSION_COOKIE_NAME = "fifa_coos_session";
const SESSION_EXPIRY_HOURS = 12;

const getSecretKey = () => new TextEncoder().encode(env.SESSION_SECRET);

export interface SessionPayload {
  role: UserRole;
  expires: string;
}

/**
 * 1. verifyCredentials
 * Validates username and password against the environment configuration.
 * (MVP approach as approved in Phase 3 Prompt 1)
 */
export function verifyCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;
  return username === env.OPS_USERNAME && password === env.OPS_PASSWORD;
}

/**
 * 2. createSession
 * Generates a signed JWT with the user's role.
 */
export async function createSession(role: UserRole): Promise<string> {
  const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

  return await new SignJWT({ role, expires: expires.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_HOURS}h`)
    .sign(getSecretKey());
}

/**
 * 3. setCookie
 * Sets the HttpOnly cookie with the provided JWT.
 */
export async function setCookie(token: string) {
  const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

/**
 * 4. verifySession
 * Decodes and verifies the JWT token.
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    // Check if manually expired
    if (new Date(payload.expires as string) < new Date()) {
      return null;
    }

    return payload as unknown as SessionPayload;
  } catch (error) {
    return null; // Token tampered, expired, or invalid
  }
}

/**
 * 5. getSession
 * Reads the token from the cookie and verifies it.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySession(token);
}

/**
 * 6. destroySession
 * Clears the session cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * 7. requireRole
 * Checks if the current session has one of the allowed roles.
 * Redirects to /ops/login or /unauthorized if not.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getSession();

  if (!session) {
    redirect("/ops/login");
  }

  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * 8. requireOps
 * Convenience wrapper for Ops and Admin roles.
 */
export async function requireOps() {
  return requireRole(["ops", "admin"]);
}
