import { redirect } from "next/navigation";
import type { UserRole } from "../config/constants";
import { createClient } from "./supabase/server";
import { prisma } from "./prisma";

export interface SessionPayload {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * 1. getSession
 * Reads the Supabase session and retrieves the authoritative role from Prisma.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser) {
    // Authenticated in Supabase, but not authorized/provisioned in our app
    return null;
  }

  return {
    id: user.id,
    email: user.email || "",
    role: dbUser.role as UserRole,
  };
}

/**
 * 2. requireRole
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
 * 3. requireOps
 * Convenience wrapper for Ops Manager, Security, and Admin roles.
 */
export async function requireOps() {
  return requireRole(["ops_manager", "security", "admin"]);
}

/**
 * 4. destroySession
 * Signs out of Supabase.
 */
export async function destroySession() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
