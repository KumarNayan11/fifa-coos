import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaTelemetryProvider } from "../providers/prisma-telemetry.provider";
import { TelemetryService } from "../services/telemetry.service";
import { SimulationEngine } from "../simulation/simulation-engine";
import { TelemetryMetricType } from "../types";
import { prisma } from "@/lib/prisma";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    zone: {
      findMany: vi.fn(),
    },
    poi: {
      findMany: vi.fn(),
    },
    telemetrySnapshot: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

describe("Telemetry Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SimulationEngine", () => {
    it("should deterministically generate snapshots based on time", () => {
      const timestamp = new Date("2026-07-17T12:00:00Z");
      const zones = [{ id: "zone-1", capacity: 1000 }];
      const pois = [{ id: "poi-1", zone_id: "zone-1", type: "concession" }];

      const snapshots1 = SimulationEngine.generateSnapshot(timestamp, zones, pois);
      const snapshots2 = SimulationEngine.generateSnapshot(timestamp, zones, pois);

      expect(snapshots1).toEqual(snapshots2);
      expect(snapshots1.length).toBe(3); // 2 zone metrics + 1 poi metric

      const crowdDensity = snapshots1.find(
        (s) => s.metric_type === TelemetryMetricType.CROWD_DENSITY,
      );
      const incidentProb = snapshots1.find(
        (s) => s.metric_type === TelemetryMetricType.INCIDENT_PROBABILITY,
      );
      const waitTime = snapshots1.find((s) => s.metric_type === TelemetryMetricType.WAIT_TIME);

      expect(crowdDensity).toBeDefined();
      expect(incidentProb).toBeDefined();
      expect(waitTime).toBeDefined();
    });
  });

  describe("PrismaTelemetryProvider", () => {
    it("should lazy generate telemetry if no recent snapshot exists", async () => {
      const provider = new PrismaTelemetryProvider();

      vi.mocked(prisma.telemetrySnapshot.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
        { id: "zone-1", name: "Zone 1", capacity: 1000, description: "", polygon_coordinates: {} },
      ]);
      vi.mocked(prisma.poi.findMany).mockResolvedValueOnce([]);

      vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
        { id: "zone-1", name: "Zone 1", capacity: 1000, description: "", polygon_coordinates: {} },
      ]);
      vi.mocked(prisma.poi.findMany).mockResolvedValueOnce([]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.telemetrySnapshot.findMany).mockResolvedValueOnce([] as any);
      vi.mocked(prisma.telemetrySnapshot.createMany).mockResolvedValueOnce({ count: 2 });

      await provider.getLatestTelemetry();

      expect(prisma.telemetrySnapshot.createMany).toHaveBeenCalledTimes(1);
    });

    it("should not lazy generate if recent snapshot exists", async () => {
      const provider = new PrismaTelemetryProvider();

      // recent snapshot
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.telemetrySnapshot.findFirst).mockResolvedValue({
        recorded_at: new Date(),
      } as any);

      vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.poi.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.telemetrySnapshot.findMany).mockResolvedValueOnce([]);

      await provider.getLatestTelemetry();

      expect(prisma.telemetrySnapshot.createMany).not.toHaveBeenCalled();
    });

    it("should correctly map DTOs from Prisma models", async () => {
      const provider = new PrismaTelemetryProvider();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.telemetrySnapshot.findFirst).mockResolvedValue({
        recorded_at: new Date(),
      } as any);

      vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
        { id: "z1", name: "Zone 1", capacity: 1000, description: "", polygon_coordinates: {} },
      ]);
      vi.mocked(prisma.poi.findMany).mockResolvedValueOnce([
        {
          id: "p1",
          zone_id: "z1",
          name: "Gate A",
          type: "gate",
          is_accessible: true,
          coordinates: {},
        },
      ]);

      // Mock snapshots for mapping

      vi.mocked(prisma.telemetrySnapshot.findMany).mockResolvedValueOnce([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {
          id: "1",
          zone_id: "z1",
          poi_id: null,
          metric_type: TelemetryMetricType.CROWD_DENSITY,
          metric_value: { toNumber: () => 55 } as any,
          recorded_at: new Date(),
          raw_payload: null,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {
          id: "2",
          zone_id: "z1",
          poi_id: "p1",
          metric_type: TelemetryMetricType.THROUGHPUT,
          metric_value: { toNumber: () => 30 } as any,
          recorded_at: new Date(),
          raw_payload: null,
        },
      ]);

      const result = await provider.getLatestTelemetry();

      expect(result).not.toBeNull();
      expect(result!.zones[0].crowdDensity).toBe(55);
      expect(result!.pois[0].throughput).toBe(30);
      expect(result!.globalCrowdDensity).toBe(55);
      expect(result!.gateThroughput).toBe(30);
    });
  });

  describe("TelemetryService", () => {
    it("should handle provider failures gracefully by throwing generic error", async () => {
      // Re-mock findFirst to throw Error
      vi.mocked(prisma.telemetrySnapshot.findFirst).mockRejectedValue(
        new Error("DB Connection Error"),
      );

      await expect(TelemetryService.getDashboardTelemetry()).rejects.toThrow(
        "Failed to retrieve dashboard telemetry",
      );
    });
  });
});
