import { TelemetryMetricType } from "../types";
import { Prisma } from "@prisma/client";

export class SimulationEngine {
  /**
   * Deterministically generates telemetry data for given zones and POIs
   * based on a specific timestamp. Uses Math.sin to create wave patterns
   * representing crowds coming and going.
   */
  static generateSnapshot(
    timestamp: Date,
    zones: { id: string; capacity: number }[],
    pois: { id: string; zone_id: string; type: string }[],
  ): Prisma.TelemetrySnapshotCreateManyInput[] {
    const snapshots: Prisma.TelemetrySnapshotCreateManyInput[] = [];

    // Time base for continuous patterns.
    // Cycle every 2 hours (7200000 ms)
    const timeValue = timestamp.getTime() / 7200000;

    for (const zone of zones) {
      // Hash zone id into a number to offset the sine wave deterministically
      const zoneOffset = this.hashString(zone.id) % Math.PI;

      // Base density wave (between 0 and 1)
      const baseWave = (Math.sin(timeValue * Math.PI * 2 + zoneOffset) + 1) / 2;

      // Calculate realistic density 20% to 90%
      const density = 20 + baseWave * 70;

      // Incident probability (higher when density is higher)
      const incidentProb = 1 + (density / 100) * 15; // 1% to 16%

      snapshots.push({
        zone_id: zone.id,
        metric_type: TelemetryMetricType.CROWD_DENSITY,
        metric_value: new Prisma.Decimal(density.toFixed(2)),
        recorded_at: timestamp,
      });

      snapshots.push({
        zone_id: zone.id,
        metric_type: TelemetryMetricType.INCIDENT_PROBABILITY,
        metric_value: new Prisma.Decimal(incidentProb.toFixed(2)),
        recorded_at: timestamp,
      });
    }

    for (const poi of pois) {
      const poiOffset = this.hashString(poi.id) % Math.PI;
      const baseWave = (Math.sin(timeValue * Math.PI * 2 + poiOffset) + 1) / 2;

      if (poi.type.toLowerCase().includes("gate")) {
        // Gate throughput: 0 to 50 people per minute
        const throughput = Math.floor(baseWave * 50);
        snapshots.push({
          zone_id: poi.zone_id,
          poi_id: poi.id,
          metric_type: TelemetryMetricType.THROUGHPUT,
          metric_value: new Prisma.Decimal(throughput.toFixed(2)),
          recorded_at: timestamp,
        });
      } else {
        // Concession/Restroom wait time: 1 to 20 minutes
        const waitTime = 1 + Math.floor(baseWave * 19);
        snapshots.push({
          zone_id: poi.zone_id,
          poi_id: poi.id,
          metric_type: TelemetryMetricType.WAIT_TIME,
          metric_value: new Prisma.Decimal(waitTime.toFixed(2)),
          recorded_at: timestamp,
        });
      }
    }

    return snapshots;
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
