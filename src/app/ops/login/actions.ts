"use server";

import { verifyCredentials, createSession, setCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { USER_ROLES } from "@/config/constants";

export async function loginAction(prevState: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const isValid = verifyCredentials(username, password);

  if (!isValid) {
    return { error: "Invalid username or password" };
  }

  const token = await createSession(USER_ROLES.OPS);
  await setCookie(token);

  // Successfully authenticated
  redirect("/ops");
}
