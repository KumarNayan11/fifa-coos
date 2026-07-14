/**
 * FIFACoOS — Configuration Barrel Export
 *
 * Public API for the config module.
 * Import from '@/config' for centralized configuration access.
 */

export { APP_CONFIG, TECH_STACK, IMPLEMENTATION_PHASES } from "./app";
export { ROUTES, NAV_ITEMS } from "./navigation";
export {
  API_TIMEOUT_MS,
  POLLING_INTERVAL_MS,
  AI_TIMEOUT_MS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MAX_MESSAGE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  SKELETON_COUNT,
  TOAST_DURATION_MS,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  USER_ROLES,
  type UserRole,
} from "./constants";
export { isDevelopment, isProduction, isTest, getEnvVar } from "./env";
export { FEATURE_FLAGS, isFeatureEnabled } from "./feature-flags";
