import { prisma } from "@/lib/prisma";
import {
  TelemetryProvider,
  TelemetryDashboardDto,
  TelemetryMetricType,
  ZoneTelemetryDto,
  PoiTelemetryDto,
  TelemetryTrendDto,
} from "../types";
import { SimulationEngine } from "../simulation/simulation-engine";

// Simple in-memory lock to prevent concurrent generations in a single Node instance.
let isGenerating = false;

export class PrismaTelemetryProvider implements TelemetryProvider {
  private readonly STALE_THRESHOLD_MS = 60 * 1000; // 1 minute

  async getLatestTelemetry(): Promise<TelemetryDashboardDto | null> {
    await this.ensureDataFreshness();

    const [zones, pois, latestSnapshots] = await Promise.all([
      prisma.zone.findMany(),
      prisma.poi.findMany(),
      prisma.telemetrySnapshot.findMany({
        orderBy: { recorded_at: "desc" },
        take: 1000, // Safe limit assuming we don't have thousands of POIs
      }),
    ]);

    if (zones.length === 0 || latestSnapshots.length === 0) {
      return null;
    }

    // Group by zone and poi
    const zoneData = new Map<string, ZoneTelemetryDto>();
    const poiData = new Map<string, PoiTelemetryDto>();

    zones.forEach((z) => {
      zoneData.set(z.id, {
        zoneId: z.id,
        zoneName: z.name,
        crowdDensity: 0,
        incidentProbability: 0,
      });
    });

    pois.forEach((p) => {
      poiData.set(p.id, {
        poiId: p.id,
        poiName: p.name,
        zoneId: p.zone_id,
        type: p.type,
        waitTime: 0,
        throughput: 0,
      });
    });

    let globalDensitySum = 0;
    let globalWaitTimeSum = 0;
    let globalThroughputSum = 0;
    let waitTimeCount = 0;
    let throughputCount = 0;

    // Use a Map to only process the *latest* snapshot for each entity+metric type
    const processed = new Set<string>();

    for (const snap of latestSnapshots) {
      const key = `${snap.zone_id}-${snap.poi_id || "null"}-${snap.metric_type}`;
      if (processed.has(key)) continue;
      processed.add(key);

      const val = snap.metric_value.toNumber();

      if (!snap.poi_id) {
        // Zone level metric
        const z = zoneData.get(snap.zone_id);
        if (z) {
          if (snap.metric_type === TelemetryMetricType.CROWD_DENSITY) {
            z.crowdDensity = val;
            globalDensitySum += val;
          }
          if (snap.metric_type === TelemetryMetricType.INCIDENT_PROBABILITY) {
            z.incidentProbability = val;
          }
        }
      } else {
        // POI level metric
        const p = poiData.get(snap.poi_id);
        if (p) {
          if (snap.metric_type === TelemetryMetricType.WAIT_TIME) {
            p.waitTime = val;
            globalWaitTimeSum += val;
            waitTimeCount++;
          }
          if (snap.metric_type === TelemetryMetricType.THROUGHPUT) {
            p.throughput = val;
            globalThroughputSum += val;
            throughputCount++;
          }
        }
      }
    }

    // Compute globals
    const globalCrowdDensity = zones.length > 0 ? globalDensitySum / zones.length : 0;
    const averageWaitTime = waitTimeCount > 0 ? globalWaitTimeSum / waitTimeCount : 0;
    const gateThroughput = throughputCount > 0 ? globalThroughputSum / throughputCount : 0;

    // Mocking trends for the MVP dashboard
    const defaultTrend: TelemetryTrendDto = { value: 2.5, label: "vs last hour", isPositive: true };

    return {
      globalCrowdDensity,
      globalDensityTrend: defaultTrend,
      averageWaitTime,
      waitTimeTrend: { ...defaultTrend, isPositive: false },
      gateThroughput,
      throughputTrend: defaultTrend,
      zones: Array.from(zoneData.values()),
      pois: Array.from(poiData.values()),
    };
  }

  private async ensureDataFreshness() {
    if (isGenerating) return;

    try {
      const latestSnapshot = await prisma.telemetrySnapshot.findFirst({
        orderBy: { recorded_at: "desc" },
        select: { recorded_at: true },
      });

      const now = new Date();
      const needsGeneration =
        !latestSnapshot ||
        now.getTime() - latestSnapshot.recorded_at.getTime() > this.STALE_THRESHOLD_MS;

      if (needsGeneration) {
        // Acquire lock
        isGenerating = true;

        const zones = await prisma.zone.findMany({ select: { id: true, capacity: true } });
        const pois = await prisma.poi.findMany({ select: { id: true, zone_id: true, type: true } });

        if (zones.length > 0) {
          const snapshots = SimulationEngine.generateSnapshot(now, zones, pois);

          await prisma.telemetrySnapshot.createMany({
            data: snapshots,
          });
        }
      }
    } catch (e) {
      console.error("Failed to generate simulated telemetry:", e);
    } finally {
      // Release lock
      isGenerating = false;
    }
  }
}
