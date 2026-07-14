/**
 * FIFACoOS — Helper Utilities
 *
 * Generic, pure utility functions for common operations.
 * All functions are pure — no side effects, easy to test.
 *
 * @see DEVELOPER_GUIDE.md Section 9 — Pure Functions
 */

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a maximum length with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + "…";
}

/**
 * Formats a date to a locale-friendly string.
 * Returns an empty string for invalid dates.
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Creates a delay promise (useful for dev/testing).
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a simple unique ID for client-side usage.
 * Not cryptographically secure — do not use for auth tokens.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Safely parses a JSON string, returning null on failure.
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Returns a status emoji for implementation phase status.
 */
export function getStatusEmoji(status: "complete" | "in-progress" | "not-started"): string {
  const map: Record<typeof status, string> = {
    complete: "✅",
    "in-progress": "🟡",
    "not-started": "⬜",
  };
  return map[status];
}
