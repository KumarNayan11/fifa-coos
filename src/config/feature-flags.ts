/**
 * FIFACoOS — Feature Flags
 *
 * Centralized feature flag definitions.
 * These allow incremental feature rollout across phases without code deletion.
 * All features default to disabled until their phase is implemented.
 *
 * @see IMPLEMENTATION_PLAN.md — Phased implementation
 */

export const FEATURE_FLAGS = {
  /** Phase 2 — Fan Copilot */
  FAN_COPILOT_ENABLED: true,

  /** Phase 2 — AI Chat Streaming */
  AI_STREAMING_ENABLED: true,

  /** Phase 2 — Mapbox Navigation */
  MAPS_ENABLED: false,

  /** Phase 3 — Operations Dashboard */
  OPS_DASHBOARD_ENABLED: false,

  /** Phase 3 — Incident Management */
  INCIDENT_MANAGEMENT_ENABLED: false,

  /** Phase 3 — Telemetry Visualization */
  TELEMETRY_ENABLED: false,

  /** Phase 4 — Volunteer Assistant */
  VOLUNTEER_ASSISTANT_ENABLED: false,

  /** Phase 5 — Internationalization */
  I18N_ENABLED: false,

  /** Phase 5 — Dark Mode Toggle */
  DARK_MODE_TOGGLE_ENABLED: false,
} as const;

/**
 * Check if a feature is enabled.
 *
 * @param flag - The feature flag key
 * @returns Whether the feature is currently enabled
 */
export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}
