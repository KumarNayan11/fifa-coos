/**
 * FIFACoOS — POI Service
 *
 * Deterministic Point of Interest retrieval.
 * Pure functions operating on static data — no database calls.
 *
 * @see DATABASE_SCHEMA.md §7 — pois table
 */

import type { POI, POIType } from "../types/fan.types";
import { POIS } from "../data/pois";

/**
 * Get all POIs.
 */
export function getAllPOIs(): POI[] {
  return POIS;
}

/**
 * Get a single POI by ID.
 */
export function getPOIById(id: string): POI | undefined {
  return POIS.find((poi) => poi.id === id);
}

/**
 * Get POIs filtered by type (e.g., "food", "restroom", "gate").
 */
export function getPOIsByType(type: POIType): POI[] {
  return POIS.filter((poi) => poi.type === type);
}

/**
 * Get POIs within a specific zone.
 */
export function getPOIsByZone(zoneId: string): POI[] {
  return POIS.filter((poi) => poi.zoneId === zoneId);
}

/**
 * Get only accessible POIs (wheelchair ramps, elevators, etc.).
 * Optionally filter by type.
 */
export function getAccessiblePOIs(type?: POIType): POI[] {
  return POIS.filter((poi) => poi.isAccessible && (type === undefined || poi.type === type));
}

/**
 * Get multiple POIs by their IDs.
 * Returns only the POIs that exist — silently skips invalid IDs.
 */
export function getPOIsByIds(ids: string[]): POI[] {
  return ids
    .map((id) => POIS.find((poi) => poi.id === id))
    .filter((poi): poi is POI => poi !== undefined);
}

/**
 * Search POIs by name or description text.
 *
 * @param query - Search text
 * @param maxResults - Maximum number of results
 */
export function searchPOIs(query: string, maxResults: number = 10): POI[] {
  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored = POIS.map((poi) => {
    let score = 0;
    const nameL = poi.name.toLowerCase();
    const descL = poi.description.toLowerCase();
    const typeL = poi.type.replace("_", " ");

    // Exact name match
    if (nameL.includes(normalizedQuery)) {
      score += 10;
    }

    // Type match
    if (normalizedQuery.includes(typeL)) {
      score += 5;
    }

    // Word-level matching
    for (const word of queryWords) {
      if (nameL.includes(word)) score += 3;
      if (descL.includes(word)) score += 1;
    }

    return { poi, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((entry) => entry.poi);
}
