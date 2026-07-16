/**
 * FIFACoOS — Environment Configuration Helper
 *
 * Lightweight environment helpers for Phase 1.
 * Does NOT implement Supabase or t3-env validation — those belong to later phases.
 *
 * @see TECHNOLOGY_DECISIONS.md Section 5.11 — t3-env
 * @see DEVELOPER_GUIDE.md Section 9 — Configuration
 */

/**
 * Returns true when running in development mode.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Returns true when running in production mode.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Returns true when running in test mode.
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Safely retrieves an environment variable.
 * Throws a descriptive error if the variable is required but missing.
 *
 * @param key - The environment variable name
 * @param fallback - Optional fallback value if the variable is not set
 * @returns The environment variable value
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (value === undefined || value === "") {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Please check your .env file and ensure ${key} is set.`,
    );
  }

  return value;
}

// ---------------------------------------------------------------------------
// Authentication (Phase 3 MVP)
// ---------------------------------------------------------------------------

/**
 * Operations user credentials for Phase 3 MVP.
 */
export const env = {
  get OPS_USERNAME() {
    return getEnvVar("OPS_USERNAME");
  },
  get OPS_PASSWORD() {
    return getEnvVar("OPS_PASSWORD");
  },
  get SESSION_SECRET() {
    return getEnvVar("SESSION_SECRET");
  },
};
