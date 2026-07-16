/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as actions from "../actions";
import { IncidentService } from "../services/incident.service";

// Mock auth
vi.mock("@/lib/auth", () => ({
  requireOps: vi.fn().mockResolvedValue(true),
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

describe("Incident Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call service createIncident and return success", async () => {
    const mockIncident = { id: "1" };
    (IncidentService.createIncident as any).mockResolvedValue(mockIncident);

    const result = await actions.createIncident({ title: "Test" });

    expect(IncidentService.createIncident).toHaveBeenCalledWith({ title: "Test" });
    expect(result).toEqual({ success: true, data: mockIncident });
  });

  it("should return failure if service throws", async () => {
    (IncidentService.createIncident as any).mockRejectedValue(new Error("Validation error"));

    const result = await actions.createIncident({ title: "Test" });

    expect(result).toEqual({ success: false, error: "Validation error" });
  });
});
