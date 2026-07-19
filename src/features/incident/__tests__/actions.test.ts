/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as actions from "../actions";
import { IncidentService } from "../services/incident.service";
import { ZodError } from "zod";

// Mock auth
const mockRequireRole = vi.fn().mockResolvedValue(true);
const mockRequireOps = vi.fn().mockResolvedValue(true);

vi.mock("@/lib/auth", () => ({
  requireRole: (...args: any) => mockRequireRole(...args),
  requireOps: (...args: any) => mockRequireOps(...args),
}));

// Mock service
vi.mock("../services/incident.service", () => ({
  IncidentService: {
    createIncident: vi.fn(),
    updateIncident: vi.fn(),
    assignIncident: vi.fn(),
    resolveIncident: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe("Incident Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call service createIncident and return success", async () => {
    const mockIncident = { id: "1" };
    (IncidentService.createIncident as any).mockResolvedValue(mockIncident);

    const result = await actions.createIncident({ title: "Test" });

    expect(mockRequireRole).toHaveBeenCalledWith(["ops_manager", "security", "admin", "volunteer"]);
    expect(IncidentService.createIncident).toHaveBeenCalledWith({ title: "Test" });

    // Verify cache invalidation
    const { revalidatePath, revalidateTag } = await import("next/cache");
    expect(revalidateTag).toHaveBeenCalledWith("dashboard-metrics");
    expect(revalidateTag).toHaveBeenCalledWith("incident-list");
    expect(revalidateTag).toHaveBeenCalledWith("incident-details");
    expect(revalidatePath).toHaveBeenCalledWith("/ops", "layout");

    expect(result).toEqual({ success: true, data: mockIncident });
  });

  it("should return Zod validation errors to the client", async () => {
    const zodError = new ZodError([
      { code: "custom", path: ["title"], message: "Title is required" },
    ]);
    (IncidentService.createIncident as any).mockRejectedValue(zodError);

    const result = await actions.createIncident({ title: "" });

    expect(result).toEqual({ success: false, error: "Title is required" });
  });

  it("should sanitize unknown server errors (e.g. Prisma errors)", async () => {
    // A mock Prisma error
    const prismaError = new Error("Unique constraint failed on the fields: (`id`)");
    // Suppress console.error during this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    (IncidentService.createIncident as any).mockRejectedValue(prismaError);

    const result = await actions.createIncident({ title: "Test" });

    // The client should NOT see the Prisma error
    expect(result).toEqual({ success: false, error: "An unexpected error occurred." });

    consoleSpy.mockRestore();
  });

  it("should pass through known safe error messages", async () => {
    (IncidentService.updateIncident as any).mockRejectedValue(
      new Error("Cannot update a closed incident."),
    );
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await actions.updateIncident({ id: "1" });

    expect(mockRequireOps).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Cannot update a closed incident." });

    consoleSpy.mockRestore();
  });
});
