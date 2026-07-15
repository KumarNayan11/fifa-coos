/**
 * FIFACoOS — Wait Time Service
 *
 * Wait time service with a WaitTimeProvider interface.
 * Phase 2 uses a StaticWaitTimeProvider that returns
 * randomized but realistic wait times.
 *
 * A TelemetryProvider can drop in later without UI changes.
 *
 * @see SYSTEM_DESIGN.md §8.6 — Simulated Telemetry Engine
 * @see TECHNOLOGY_DECISIONS.md §5.9 — Telemetry Simulation
 */

import type { WaitTime, POIType } from "../types/fan.types";
import { POIS } from "../data/pois";

// ---------------------------------------------------------------------------
// WaitTimeProvider Interface
// ---------------------------------------------------------------------------

/**
 * Interface for wait time data providers.
 * Future telemetry simulation or real sensor data will implement this.
 */
export interface WaitTimeProvider {
  /** Get current wait time for a specific POI */
  getWaitTime(poiId: string): Promise<WaitTime | null>;
  /** Get wait times for all POIs of a specific type */
  getWaitTimesByType(type: POIType): Promise<WaitTime[]>;
}

// ---------------------------------------------------------------------------
// Static Wait Time Provider (Phase 2)
// ---------------------------------------------------------------------------

/**
 * Static wait time provider that returns deterministic but varied
 * wait times based on POI type. Uses a simple seed from the POI ID
 * for consistent-per-session results.
 *
 * This will be replaced by a TelemetryWaitTimeProvider in Phase 3.
 */
class StaticWaitTimeProvider implements WaitTimeProvider {
  async getWaitTime(poiId: string): Promise<WaitTime | null> {
    const poi = POIS.find((p) => p.id === poiId);
    if (!poi) return null;

    return {
      poiId,
      minutes: this.estimateWaitMinutes(poi.type, poiId),
      updatedAt: new Date(),
    };
  }

  async getWaitTimesByType(type: POIType): Promise<WaitTime[]> {
    const matching = POIS.filter((p) => p.type === type);

    return matching.map((poi) => ({
      poiId: poi.id,
      minutes: this.estimateWaitMinutes(poi.type, poi.id),
      updatedAt: new Date(),
    }));
  }

  /**
   * Generate a realistic wait time based on POI type.
   * Uses a simple hash of the POI ID for consistency within a session.
   */
  private estimateWaitMinutes(type: POIType, poiId: string): number {
    // Simple deterministic seed from POI ID
    const seed = poiId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Base ranges by POI type (in minutes)
    const ranges: Partial<Record<POIType, [number, number]>> = {
      gate: [5, 25],
      food: [3, 18],
      restroom: [0, 8],
      medical: [0, 5],
      atm: [2, 10],
      merchandise: [5, 20],
    };

    const [min, max] = ranges[type] ?? [0, 5];
    return min + (seed % (max - min + 1));
  }
}

// ---------------------------------------------------------------------------
// Service Singleton
// ---------------------------------------------------------------------------

const provider: WaitTimeProvider = new StaticWaitTimeProvider();

/**
 * Get the current wait time for a specific POI.
 */
export async function getWaitTime(poiId: string): Promise<WaitTime | null> {
  return provider.getWaitTime(poiId);
}

/**
 * Get wait times for all POIs of a given type.
 */
export async function getWaitTimesByType(type: POIType): Promise<WaitTime[]> {
  return provider.getWaitTimesByType(type);
}

/**
 * Format a wait time as a human-readable string.
 */
export function formatWaitTime(minutes: number): string {
  if (minutes <= 0) return "No wait";
  if (minutes < 5) return `~${minutes} min (short)`;
  if (minutes < 15) return `~${minutes} min (moderate)`;
  return `~${minutes} min (long)`;
}

/**
 * Get the wait time severity level for UI color coding.
 */
export function getWaitTimeSeverity(minutes: number): "low" | "medium" | "high" {
  if (minutes < 5) return "low";
  if (minutes < 15) return "medium";
  return "high";
}
