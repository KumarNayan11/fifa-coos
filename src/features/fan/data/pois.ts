/**
 * FIFACoOS — Points of Interest Data
 *
 * Static POI definitions for Stadium Alpha.
 * 25+ POIs covering gates, food, restrooms, medical, info desks,
 * parking, ATMs, merchandise, prayer rooms, and family zones.
 *
 * @see DATABASE_SCHEMA.md §7 — pois table
 */

import type { POI } from "../types/fan.types";

export const POIS: POI[] = [
  // -----------------------------------------------------------------------
  // Gates
  // -----------------------------------------------------------------------
  {
    id: "poi-gate-a",
    name: "Gate A",
    type: "gate",
    zoneId: "zone-north",
    coordinates: { lat: 29.687, lng: -95.412 },
    isAccessible: true,
    description:
      "Main north entrance. Accessible ramp available. Bag check and security screening.",
  },
  {
    id: "poi-gate-b",
    name: "Gate B",
    type: "gate",
    zoneId: "zone-north",
    coordinates: { lat: 29.6868, lng: -95.41 },
    isAccessible: true,
    description: "North-east entrance near Parking Lot 1. Express lane for mobile tickets.",
  },
  {
    id: "poi-gate-c",
    name: "Gate C",
    type: "gate",
    zoneId: "zone-east",
    coordinates: { lat: 29.6855, lng: -95.4085 },
    isAccessible: false,
    description: "East stand entrance. Stairs only — use Gate A or D for accessible entry.",
  },
  {
    id: "poi-gate-d",
    name: "Gate D",
    type: "gate",
    zoneId: "zone-vip",
    coordinates: { lat: 29.684, lng: -95.4095 },
    isAccessible: true,
    description:
      "VIP and hospitality entrance. Accessible elevator to all levels. Ticket verification required.",
  },
  {
    id: "poi-gate-e",
    name: "Gate E",
    type: "gate",
    zoneId: "zone-south",
    coordinates: { lat: 29.683, lng: -95.411 },
    isAccessible: true,
    description:
      "South entrance near public transit stop. Accessible ramp and dedicated assistance staff.",
  },
  {
    id: "poi-gate-f",
    name: "Gate F",
    type: "gate",
    zoneId: "zone-south",
    coordinates: { lat: 29.6832, lng: -95.413 },
    isAccessible: false,
    description: "South-west entrance. Closest to Parking Lot 3.",
  },

  // -----------------------------------------------------------------------
  // Food & Concessions
  // -----------------------------------------------------------------------
  {
    id: "poi-food-court-north",
    name: "North Food Court",
    type: "food",
    zoneId: "zone-north",
    coordinates: { lat: 29.6865, lng: -95.411 },
    isAccessible: true,
    description:
      "Main food court with 8 vendors: burgers, pizza, tacos, sushi, salads, ice cream, BBQ, and vegetarian options.",
  },
  {
    id: "poi-food-intl",
    name: "International Food Village",
    type: "food",
    zoneId: "zone-south",
    coordinates: { lat: 29.6835, lng: -95.4115 },
    isAccessible: true,
    description:
      "Global cuisine: Indian, Middle Eastern, Mexican, Asian fusion. Halal and kosher options available.",
  },
  {
    id: "poi-food-east-kiosk",
    name: "East Stand Snack Bar",
    type: "food",
    zoneId: "zone-east",
    coordinates: { lat: 29.6852, lng: -95.409 },
    isAccessible: false,
    description: "Quick-service kiosk: hot dogs, nachos, drinks, and popcorn.",
  },
  {
    id: "poi-food-vip-dining",
    name: "VIP Dining Lounge",
    type: "food",
    zoneId: "zone-vip",
    coordinates: { lat: 29.6842, lng: -95.4098 },
    isAccessible: true,
    description:
      "Premium sit-down dining for VIP ticket holders. Full bar service and chef's menu.",
  },

  // -----------------------------------------------------------------------
  // Restrooms
  // -----------------------------------------------------------------------
  {
    id: "poi-restroom-north-1",
    name: "North Restroom Block A",
    type: "restroom",
    zoneId: "zone-north",
    coordinates: { lat: 29.6867, lng: -95.4115 },
    isAccessible: true,
    description:
      "Large restroom block near Gate A. Accessible stalls and baby changing facilities.",
  },
  {
    id: "poi-restroom-south-1",
    name: "South Restroom Block E",
    type: "restroom",
    zoneId: "zone-south",
    coordinates: { lat: 29.6833, lng: -95.4112 },
    isAccessible: true,
    description: "Restrooms near Gate E. Fully accessible. Family restroom available.",
  },
  {
    id: "poi-restroom-east-1",
    name: "East Stand Restroom",
    type: "restroom",
    zoneId: "zone-east",
    coordinates: { lat: 29.685, lng: -95.4088 },
    isAccessible: false,
    description: "Standard restrooms on East Stand Level 2. Stairs only.",
  },

  // -----------------------------------------------------------------------
  // Medical & First Aid
  // -----------------------------------------------------------------------
  {
    id: "poi-medical-north",
    name: "North Medical Station",
    type: "medical",
    zoneId: "zone-north",
    coordinates: { lat: 29.6866, lng: -95.4108 },
    isAccessible: true,
    description:
      "Primary medical facility staffed by paramedics. AED on-site. Open throughout the event.",
  },
  {
    id: "poi-medical-south",
    name: "South First Aid Post",
    type: "first_aid",
    zoneId: "zone-south",
    coordinates: { lat: 29.6834, lng: -95.4118 },
    isAccessible: true,
    description:
      "First aid post for minor injuries. Staffed by trained volunteers. Medication dispensing available.",
  },

  // -----------------------------------------------------------------------
  // Information Desks
  // -----------------------------------------------------------------------
  {
    id: "poi-info-north",
    name: "North Information Desk",
    type: "information",
    zoneId: "zone-north",
    coordinates: { lat: 29.6869, lng: -95.4112 },
    isAccessible: true,
    description:
      "Main information point. Multilingual staff, lost & found, wheelchair loans, and event programs.",
  },
  {
    id: "poi-info-south",
    name: "South Information Kiosk",
    type: "information",
    zoneId: "zone-south",
    coordinates: { lat: 29.6831, lng: -95.412 },
    isAccessible: true,
    description:
      "Self-service information kiosk with digital maps. Volunteer assistance available.",
  },

  // -----------------------------------------------------------------------
  // Parking
  // -----------------------------------------------------------------------
  {
    id: "poi-parking-1",
    name: "Parking Lot 1 (North)",
    type: "parking",
    zoneId: "zone-exterior",
    coordinates: { lat: 29.688, lng: -95.41 },
    isAccessible: true,
    description:
      "Main parking area. 5,000 spaces. Accessible parking near Gate A. $30 pre-paid / $40 day-of.",
  },
  {
    id: "poi-parking-2",
    name: "Parking Lot 2 (East)",
    type: "parking",
    zoneId: "zone-exterior",
    coordinates: { lat: 29.6855, lng: -95.407 },
    isAccessible: false,
    description: "Overflow parking. 3,000 spaces. 15-minute walk to Gate C.",
  },
  {
    id: "poi-parking-3",
    name: "Parking Lot 3 (South)",
    type: "parking",
    zoneId: "zone-exterior",
    coordinates: { lat: 29.682, lng: -95.4125 },
    isAccessible: true,
    description:
      "South lot with accessible spaces near Gate E. Public transit shuttle stop nearby.",
  },

  // -----------------------------------------------------------------------
  // ATMs & Merchandise
  // -----------------------------------------------------------------------
  {
    id: "poi-atm-north",
    name: "North ATM Station",
    type: "atm",
    zoneId: "zone-north",
    coordinates: { lat: 29.6864, lng: -95.4118 },
    isAccessible: true,
    description: "Two ATM machines near the North Food Court. No surcharge for partner banks.",
  },
  {
    id: "poi-merch-north",
    name: "Official FIFA Store",
    type: "merchandise",
    zoneId: "zone-north",
    coordinates: { lat: 29.6863, lng: -95.4105 },
    isAccessible: true,
    description:
      "Official merchandise: jerseys, scarves, match balls, souvenirs. Card payments only.",
  },

  // -----------------------------------------------------------------------
  // Special Facilities
  // -----------------------------------------------------------------------
  {
    id: "poi-prayer-room",
    name: "Multi-Faith Prayer Room",
    type: "prayer_room",
    zoneId: "zone-south",
    coordinates: { lat: 29.6836, lng: -95.4122 },
    isAccessible: true,
    description:
      "Quiet multi-faith space with ablution facilities. Open throughout the event. Located near Gate E.",
  },
  {
    id: "poi-family-zone",
    name: "Family Zone & Play Area",
    type: "family_zone",
    zoneId: "zone-north",
    coordinates: { lat: 29.6862, lng: -95.4114 },
    isAccessible: true,
    description:
      "Supervised play area for children under 12. Baby changing, nursing room, and stroller parking.",
  },
];
