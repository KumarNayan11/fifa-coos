/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import { SignJWT } from "jose";
import { USER_ROLES } from "../config/constants";

// We need to mock Next.js server components correctly, but since middleware uses them,
// a simpler way is to test the redirect logic by providing fake NextRequests.
// However, testing Next.js edge middleware in Vitest node environment can be tricky due to missing globals like Request/Response.
// We will mock the NextRequest and NextResponse behavior.

vi.mock("next/server", () => {
  return {
    NextResponse: {
      next: vi.fn(() => ({ type: "next" })),
      redirect: vi.fn((url) => {
        const response = { type: "redirect", url: url.toString(), cookies: { delete: vi.fn() } };
        return response;
      }),
    },
  };
});

describe("Proxy Route Protection", () => {
  const setupRequest = (pathname: string, tokenValue?: string) => {
    return {
      nextUrl: {
        pathname,
      },
      url: `http://localhost:3000${pathname}`,
      cookies: {
        get: vi.fn(() => (tokenValue ? { value: tokenValue } : undefined)),
      },
    } as unknown as NextRequest;
  };

  it("should ignore non-ops routes", async () => {
    const req = setupRequest("/fan");
    const res = await proxy(req);
    expect((res as any).type).toBe("next");
  });

  it("should redirect unauthenticated users away from /ops to /ops/login", async () => {
    const req = setupRequest("/ops/dashboard");
    const res = await proxy(req);
    expect((res as any).type).toBe("redirect");
    expect((res as any).url).toContain("/ops/login");
  });

  it("should allow unauthenticated users to access /ops/login", async () => {
    const req = setupRequest("/ops/login");
    const res = await proxy(req);
    expect((res as any).type).toBe("next");
  });

  it("should redirect authenticated users away from /ops/login to /ops", async () => {
    // Generate valid token for Ops
    process.env.SESSION_SECRET = "test_super_secret_key_1234567890";
    const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET);
    const expires = new Date(Date.now() + 1000000).toISOString();

    const validToken = await new SignJWT({ role: USER_ROLES.OPS_MANAGER, expires })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    const req = setupRequest("/ops/login", validToken);
    const res = await proxy(req);

    expect((res as any).type).toBe("redirect");
    expect((res as any).url).toContain("/ops");
  });

  it("should redirect unauthorized roles to /unauthorized", async () => {
    // Generate valid token for Volunteer (not allowed in Ops)
    process.env.SESSION_SECRET = "test_super_secret_key_1234567890";
    const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET);
    const expires = new Date(Date.now() + 1000000).toISOString();

    const validToken = await new SignJWT({ role: USER_ROLES.VOLUNTEER, expires })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    const req = setupRequest("/ops/dashboard", validToken);
    const res = await proxy(req);

    expect((res as any).type).toBe("redirect");
    expect((res as any).url).toContain("/unauthorized");
  });

  it("should clear cookie and redirect to login if JWT is tampered/expired on protected route", async () => {
    const req = setupRequest("/ops/dashboard", "invalid-token-value");
    const res = await proxy(req);

    expect((res as any).type).toBe("redirect");
    expect((res as any).url).toContain("/ops/login");
    expect((res as any).cookies.delete).toHaveBeenCalledWith("fifa_coos_session");
  });
});
