/**
 * FIFACoOS — Stadium Alpha Data
 *
 * Static stadium metadata and zone definitions for
 * "FIFA World Cup Stadium Alpha" — a fictional but realistic
 * FIFA 2026 venue.
 *
 * @see DATABASE_SCHEMA.md §7 — zones table
 */

import type { Zone, Coordinates } from "../types/fan.types";

// ---------------------------------------------------------------------------
// Stadium Metadata
// ---------------------------------------------------------------------------

export const STADIUM = {
  id: "stadium-alpha",
  name: "FIFA World Cup Stadium Alpha",
  city: "Houston, TX",
  country: "United States",
  capacity: 72_000,
  eventName: "FIFA World Cup 2026™",
  openingTime: "14:00",
  matchKickoff: "18:00",
  address: "1 Stadium Way, Houston, TX 77001",
  emergencyNumber: "911",
  infoHotline: "+1-800-FIFA-2026",
  centerCoordinates: { lat: 29.685, lng: -95.41 } as Coordinates,
} as const;

// ---------------------------------------------------------------------------
// Stadium Zones
// ---------------------------------------------------------------------------

export const ZONES: Zone[] = [
  {
    id: "zone-north",
    name: "North Concourse",
    description:
      "Main entry concourse connecting Gates A and B. Houses primary food court, merchandise store, and family zone.",
    capacity: 18_000,
  },
  {
    id: "zone-south",
    name: "South Concourse",
    description:
      "Secondary concourse connecting Gates E and F. Features international food vendors and prayer room.",
    capacity: 16_000,
  },
  {
    id: "zone-east",
    name: "East Stand",
    description:
      "Upper and lower seating tiers with panoramic views. Accessible seating sections available on Level 1.",
    capacity: 14_000,
  },
  {
    id: "zone-west",
    name: "West Stand",
    description:
      "Premium seating area with VIP lounges. Includes press box and broadcast facilities.",
    capacity: 10_000,
  },
  {
    id: "zone-vip",
    name: "VIP & Hospitality",
    description:
      "Exclusive hospitality suites, premium dining, and private viewing areas. Accessible via Gate D.",
    capacity: 4_000,
  },
  {
    id: "zone-field",
    name: "Field Level",
    description: "Pitch-side seating and media zone. Restricted access — ticket holders only.",
    capacity: 6_000,
  },
  {
    id: "zone-exterior",
    name: "Exterior & Parking",
    description:
      "Stadium exterior grounds including parking lots, taxi/rideshare zones, and shuttle stops.",
    capacity: 4_000,
  },
];

/**
 * Look up a zone by its ID.
 */
export function getZoneById(zoneId: string): Zone | undefined {
  return ZONES.find((z) => z.id === zoneId);
}
