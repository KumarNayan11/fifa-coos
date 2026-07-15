/**
 * FIFACoOS — Fan Feature Types
 *
 * Core type definitions for the Fan Copilot vertical slice.
 * These types model the domain objects used by the knowledge services,
 * AI pipeline, and UI components.
 *
 * @see DATABASE_SCHEMA.md — Conceptual entity mapping
 * @see AI_ARCHITECTURE.md §7 — Component outputs
 */

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

/** Supported chat message roles */
export type ChatRole = "user" | "assistant";

/** A single chat message in the conversation */
export interface ChatMessage {
  /** Unique message identifier */
  id: string;
  /** Who sent the message */
  role: ChatRole;
  /** Plain text content */
  content: string;
  /** When the message was created */
  timestamp: Date;
  /** Suggested POI IDs returned by the AI */
  suggestedPOIs?: string[];
}

// ---------------------------------------------------------------------------
// Stadium Geography
// ---------------------------------------------------------------------------

/** A geographic coordinate pair */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** A stadium zone / sector */
export interface Zone {
  id: string;
  name: string;
  description: string;
  capacity: number;
}

/** POI categories */
export type POIType =
  | "gate"
  | "food"
  | "restroom"
  | "medical"
  | "information"
  | "parking"
  | "atm"
  | "merchandise"
  | "first_aid"
  | "prayer_room"
  | "family_zone"
  | "vip_lounge";

/** A Point of Interest within the stadium */
export interface POI {
  id: string;
  name: string;
  type: POIType;
  zoneId: string;
  coordinates: Coordinates;
  isAccessible: boolean;
  description: string;
}

// ---------------------------------------------------------------------------
// Wait Times
// ---------------------------------------------------------------------------

/** Wait time data for a POI */
export interface WaitTime {
  poiId: string;
  /** Estimated wait in minutes */
  minutes: number;
  /** When this measurement was taken */
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Knowledge
// ---------------------------------------------------------------------------

/** FAQ categories */
export type FAQCategory =
  | "general"
  | "gates"
  | "food"
  | "accessibility"
  | "medical"
  | "parking"
  | "prohibited_items"
  | "weather"
  | "transport"
  | "security"
  | "ticketing";

/** A knowledge article / FAQ entry */
export interface KnowledgeArticle {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  /** Keywords for deterministic search matching */
  keywords: string[];
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** A navigation route between two points */
export interface NavigationRoute {
  originId: string;
  destinationId: string;
  /** Estimated walking time in minutes */
  estimatedMinutes: number;
  /** Human-readable walking directions */
  directions: string;
  /** Whether this route is wheelchair/accessible */
  isAccessible: boolean;
}

// ---------------------------------------------------------------------------
// AI Response
// ---------------------------------------------------------------------------

/** The intent classifications the AI can return */
export type FanIntent = "navigate" | "info" | "wait_time" | "faq" | "general";

/** Structured AI response after Zod validation */
export interface FanCopilotResponse {
  /** Classified intent of the user's query */
  intent: FanIntent;
  /** Natural language response text */
  response: string;
  /** Referenced POI IDs, if any */
  suggestedPOIs: string[];
  /** AI self-assessed confidence (0-100) */
  confidence: number;
}
