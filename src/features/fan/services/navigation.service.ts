/**
 * FIFACoOS — Navigation Service
 *
 * Deterministic navigation service with a MapProvider interface.
 * The UI never knows about Mapbox — it talks to this service.
 * Mapbox will be a future implementation of MapProvider.
 *
 * For Phase 2, uses a StaticMapProvider that returns
 * estimated walking times based on zone distance.
 *
 * @see SYSTEM_DESIGN.md §8.4 — Navigation Service
 * @see API_DESIGN.md §7.3 — Navigation Service contract
 */

import type { NavigationRoute, Coordinates } from "../types/fan.types";
import { getPOIById } from "./poi.service";
import { getZoneById } from "../data/stadium";

// ---------------------------------------------------------------------------
// MapProvider Interface
// ---------------------------------------------------------------------------

/**
 * Interface for map rendering and route calculation providers.
 * Mapbox GL JS will implement this in a future phase.
 * The UI and services depend only on this interface.
 */
export interface MapProvider {
  /** Calculate a route between two coordinate pairs */
  calculateRoute(
    origin: Coordinates,
    destination: Coordinates,
    options?: { accessible?: boolean },
  ): Promise<NavigationRoute | null>;
}

// ---------------------------------------------------------------------------
// Static Map Provider (Phase 2)
// ---------------------------------------------------------------------------

/**
 * Static map provider that estimates walking times based on
 * straight-line coordinate distance. No real routing engine.
 * This will be replaced by MapboxProvider when tokens are available.
 */
class StaticMapProvider implements MapProvider {
  async calculateRoute(
    origin: Coordinates,
    destination: Coordinates,
    options?: { accessible?: boolean },
  ): Promise<NavigationRoute | null> {
    // Haversine-approximated distance in meters
    const distanceMeters = this.approximateDistance(origin, destination);
    // Average walking speed: 80m/min, accessible: 50m/min
    const speed = options?.accessible ? 50 : 80;
    const estimatedMinutes = Math.max(1, Math.round(distanceMeters / speed));

    return {
      originId: "",
      destinationId: "",
      estimatedMinutes,
      directions: options?.accessible
        ? `Estimated ${estimatedMinutes} minute accessible route. Please follow the accessible pathway signs.`
        : `Estimated ${estimatedMinutes} minute walk. Follow the stadium signage.`,
      isAccessible: options?.accessible ?? false,
    };
  }

  private approximateDistance(a: Coordinates, b: Coordinates): number {
    // Simplified haversine for short distances
    const R = 6371000; // Earth radius in meters
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const x = dLng * Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180);
    return Math.sqrt(dLat * dLat + x * x) * R;
  }
}

// ---------------------------------------------------------------------------
// Navigation Service
// ---------------------------------------------------------------------------

/** Singleton static map provider */
const mapProvider: MapProvider = new StaticMapProvider();

/**
 * Calculate a navigation route between two POIs.
 *
 * @param originPoiId - Origin POI ID
 * @param destinationPoiId - Destination POI ID
 * @param options - Navigation options
 * @returns Navigation route or null if POIs not found
 */
export async function getRoute(
  originPoiId: string,
  destinationPoiId: string,
  options?: { accessible?: boolean },
): Promise<NavigationRoute | null> {
  const origin = getPOIById(originPoiId);
  const destination = getPOIById(destinationPoiId);

  if (!origin || !destination) {
    return null;
  }

  const route = await mapProvider.calculateRoute(
    origin.coordinates,
    destination.coordinates,
    options,
  );

  if (!route) return null;

  // Enrich with POI IDs and generate human-readable directions
  const destZone = getZoneById(destination.zoneId);
  const zoneName = destZone?.name ?? "the stadium";

  return {
    ...route,
    originId: originPoiId,
    destinationId: destinationPoiId,
    directions: `Head towards ${destination.name} in ${zoneName}. ${route.directions}`,
  };
}

/**
 * Get a simple direction description from one POI to another.
 * Used by the AI to provide text-based navigation guidance.
 */
export async function getDirectionsText(
  originPoiId: string,
  destinationPoiId: string,
  accessible: boolean = false,
): Promise<string> {
  const route = await getRoute(originPoiId, destinationPoiId, { accessible });

  if (!route) {
    return "Unable to calculate route. Please ask a nearby volunteer for directions.";
  }

  return route.directions;
}
