import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardService } from "../services/dashboard.service";
import { prisma } from "@/lib/prisma";
import { Severity, IncidentStatus } from "@prisma/client";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    incident: {
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("DashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboardMetrics", () => {
    it("should return correctly aggregated metrics", async () => {
      // Mock prisma.incident.count responses
      vi.mocked(prisma.incident.count)
        .mockResolvedValueOnce(150) // total
        .mockResolvedValueOnce(30) // open
        .mockResolvedValueOnce(120) // resolved
        .mockResolvedValueOnce(5) // created today
        .mockResolvedValueOnce(2); // unresolved critical

      // Mock prisma.incident.groupBy response
      vi.mocked(prisma.incident.groupBy).mockResolvedValueOnce([
        { severity: Severity.low, _count: { id: 50 } },
        { severity: Severity.medium, _count: { id: 60 } },
        { severity: Severity.high, _count: { id: 35 } },
        { severity: Severity.critical, _count: { id: 5 } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);

      const metrics = await DashboardService.getDashboardMetrics();

      expect(metrics.totalIncidents).toBe(150);
      expect(metrics.openIncidents).toBe(30);
      expect(metrics.resolvedIncidents).toBe(120);
      expect(metrics.incidentsCreatedToday).toBe(5);
      expect(metrics.unresolvedCriticalIncidents).toBe(2);

      // Verify severity counts
      expect(metrics.incidentsBySeverity).toEqual([
        { severity: "low", count: 50 },
        { severity: "medium", count: 60 },
        { severity: "high", count: 35 },
        { severity: "critical", count: 5 },
      ]);
    });

    it("should handle partial datasets and empty severity groups", async () => {
      vi.mocked(prisma.incident.count).mockResolvedValue(0);

      // GroupBy returning only some severities
      vi.mocked(prisma.incident.groupBy).mockResolvedValueOnce([
        { severity: Severity.high, _count: { id: 10 } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);

      const metrics = await DashboardService.getDashboardMetrics();

      expect(metrics.incidentsBySeverity).toEqual([
        { severity: "low", count: 0 },
        { severity: "medium", count: 0 },
        { severity: "high", count: 10 },
        { severity: "critical", count: 0 },
      ]);
    });
  });

  describe("getRecentIncidents", () => {
    it("should return explicitly limited and deterministically ordered recent incidents", async () => {
      const mockIncidents = [
        {
          id: "1",
          title: "Test Incident",
          status: IncidentStatus.reported,
          severity: Severity.low,
          created_at: new Date("2026-07-16T10:00:00Z"),
          updated_at: new Date("2026-07-16T10:00:00Z"),
          assignments: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.incident.findMany).mockResolvedValueOnce(mockIncidents as any);

      const result = await DashboardService.getRecentIncidents(5);

      expect(prisma.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          orderBy: { created_at: "desc" },
        }),
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
      expect(result[0].assignedPersonnel).toHaveLength(0);
    });

    it("should map assignments correctly, omitting null users", async () => {
      const mockIncidents = [
        {
          id: "2",
          title: "Critical Incident",
          status: IncidentStatus.assigned,
          severity: Severity.critical,
          created_at: new Date(),
          updated_at: new Date(),
          assignments: [
            { user: { id: "u1", full_name: "Alice" } },
            { user: null }, // edge case handled
            { user: { id: "u2", full_name: null } }, // empty name fallback
          ],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.incident.findMany).mockResolvedValueOnce(mockIncidents as any);

      const result = await DashboardService.getRecentIncidents();

      expect(result[0].assignedPersonnel).toHaveLength(2);
      expect(result[0].assignedPersonnel[0].name).toBe("Alice");
      expect(result[0].assignedPersonnel[1].name).toBe("Unknown User");
    });
  });
});
