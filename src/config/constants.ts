/**
 * FIFACoOS — Application Constants
 *
 * Centralized constants used across the application.
 * Extract literal numbers and strings with domain meaning into named constants.
 *
 * @see DEVELOPER_GUIDE.md Section 9 — Magic Numbers/Strings
 */

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

/** Default API timeout in milliseconds */
export const API_TIMEOUT_MS = 10_000;

/** Default polling interval for dashboard data in milliseconds */
export const POLLING_INTERVAL_MS = 5_000;

/** AI response timeout in milliseconds */
export const AI_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

/** Default number of items per page */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum allowed page size */
export const MAX_PAGE_SIZE = 100;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Maximum length for user chat messages */
export const MAX_MESSAGE_LENGTH = 2_000;

/** Maximum length for incident descriptions */
export const MAX_DESCRIPTION_LENGTH = 5_000;

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

/** Number of skeleton items to show during loading */
export const SKELETON_COUNT = 3;

/** Toast notification auto-dismiss duration in milliseconds */
export const TOAST_DURATION_MS = 5_000;

// ---------------------------------------------------------------------------
// Supported Locales
// ---------------------------------------------------------------------------

/** Locales supported by the platform per architecture docs */
export const SUPPORTED_LOCALES = ["en", "es", "fr", "hi"] as const;

/** Default locale */
export const DEFAULT_LOCALE = "en" as const;

// ---------------------------------------------------------------------------
// User Roles
// ---------------------------------------------------------------------------

/**
 * User roles as defined in ARCHITECTURE.md Section 7.
 * These map to Supabase auth custom claims.
 */
export const USER_ROLES = {
  FAN: "fan",
  OPS: "ops",
  VOLUNTEER: "volunteer",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
