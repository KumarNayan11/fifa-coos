import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import middleware from "../middleware";
import { updateSession } from "@/lib/supabase/middleware";

// Mock next-intl/middleware
vi.mock("next-intl/middleware", () => ({
  default: () => vi.fn((req) => NextResponse.next({ request: req })),
}));

// Mock routing since createMiddleware requires it
vi.mock("@/i18n/routing", () => ({
  routing: {
    locales: ["en", "hi"],
    defaultLocale: "en",
  },
}));

vi.mock("@/lib/supabase/middleware", () => ({
  updateSession: vi.fn(),
}));

describe("Middleware", () => {
  it("should compose next-intl and updateSession", async () => {
    const req = new NextRequest("http://localhost:3000/ops");
    const mockResponse = new NextResponse();

    // We mock updateSession to return our mockResponse
    vi.mocked(updateSession).mockResolvedValue(mockResponse);

    const res = await middleware(req);

    // It should call updateSession with the request and a base NextResponse
    expect(updateSession).toHaveBeenCalledWith(req, expect.any(NextResponse));
    expect(res).toBe(mockResponse);
  });
});
