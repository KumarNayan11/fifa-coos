/**
 * FIFACoOS — Accessibility Announcements
 *
 * Provides a framework-agnostic way to announce messages to screen readers
 * via the LiveRegion component. Supports both polite and assertive priorities.
 */

export type AnnouncementPriority = "polite" | "assertive";

export interface Announcement {
  message: string;
  priority: AnnouncementPriority;
  id: string; // for forcing re-announcement of identical messages
}

const listeners = new Set<(announcement: Announcement) => void>();

/**
 * Announce a message to screen readers.
 *
 * @param message The text to announce
 * @param priority "polite" (default) or "assertive"
 */
export function announce(message: string, priority: AnnouncementPriority = "polite") {
  if (!message) return;

  const announcement: Announcement = {
    message,
    priority,
    id: Math.random().toString(36).substring(2, 9),
  };

  listeners.forEach((listener) => listener(announcement));
}

/**
 * Internal hook registration for the LiveRegion component.
 */
export function subscribeToAnnouncements(callback: (announcement: Announcement) => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
