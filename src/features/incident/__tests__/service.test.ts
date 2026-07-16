/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { IncidentService } from "../services/incident.service";
import { prisma } from "@/lib/prisma";
import { IncidentStatus, Severity } from "@prisma/client";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    incident: {
      create: vi.fn(),
      update: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      findMany: vi.fn(),
    },
    incidentAssignment: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe("IncidentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createIncident", () => {
    it("should validate and create a new incident", async () => {
      const mockData = {
        title: "Spill in North Concourse",
        description: "Large soda spill causing slip hazard.",
        severity: Severity.low,
        zone_id: "123e4567-e89b-12d3-a456-426614174000",
      };

      const expectedCreate = {
        ...mockData,
        status: IncidentStatus.reported,
      };

      (prisma.incident.create as any).mockResolvedValue({ id: "inc-1", ...expectedCreate });

      const result = await IncidentService.createIncident(mockData);

      expect(prisma.incident.create).toHaveBeenCalledWith({ data: expectedCreate });
      expect(result.id).toBe("inc-1");
    });

    it("should throw validation error on invalid data", async () => {
      const mockData = {
        title: "x", // too short
        description: "Large soda spill causing slip hazard.",
        severity: Severity.low,
        zone_id: "123e4567-e89b-12d3-a456-426614174000",
      };

      await expect(IncidentService.createIncident(mockData)).rejects.toThrow();
    });
  });

  describe("updateIncident", () => {
    it("should throw if trying to update a closed incident", async () => {
      (prisma.incident.findUniqueOrThrow as any).mockResolvedValue({
        id: "inc-1",
        status: IncidentStatus.closed,
      });

      const updateData = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "New title",
      };

      await expect(IncidentService.updateIncident(updateData)).rejects.toThrow(
        "Cannot update a closed incident",
      );
    });
  });

  describe("assignIncident", () => {
    it("should throw if incident is already resolved", async () => {
      (prisma.incident.findUniqueOrThrow as any).mockResolvedValue({
        id: "inc-1",
        status: IncidentStatus.resolved,
      });

      const assignData = {
        incident_id: "123e4567-e89b-12d3-a456-426614174000",
        user_id: "123e4567-e89b-12d3-a456-426614174001",
      };

      await expect(IncidentService.assignIncident(assignData)).rejects.toThrow(
        "Cannot assign a resolved or closed incident.",
      );
    });
  });

  describe("resolveIncident", () => {
    it("should throw if incident is not assigned", async () => {
      (prisma.incident.findUniqueOrThrow as any).mockResolvedValue({
        id: "inc-1",
        status: IncidentStatus.reported,
        assignments: [],
      });

      const resolveData = {
        incident_id: "123e4567-e89b-12d3-a456-426614174000",
      };

      await expect(IncidentService.resolveIncident(resolveData)).rejects.toThrow(
        "Cannot resolve an unassigned incident.",
      );
    });
  });
});
