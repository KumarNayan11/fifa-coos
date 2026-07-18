import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { proxy } from "../proxy";
import { updateSession } from "@/lib/supabase/middleware";

vi.mock("@/lib/supabase/middleware", () => ({
  updateSession: vi.fn(),
}));

describe("Proxy Route", () => {
  it("should call updateSession with the request", async () => {
    const req = new NextRequest("http://localhost:3000/ops");
    const mockResponse = new NextResponse();
    vi.mocked(updateSession).mockResolvedValue(mockResponse);

    const res = await proxy(req);
    expect(updateSession).toHaveBeenCalledWith(req);
    expect(res).toBe(mockResponse);
  });
});
