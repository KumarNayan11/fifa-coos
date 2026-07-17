/**
 * FIFACoOS — Navigation Configuration
 *
 * Centralized route and navigation definitions.
 * Placeholder links for future feature phases.
 *
 * @see DEVELOPER_GUIDE.md Section 6 — Repository Organization
 */

/**
 * Application route paths.
 * Centralizes all route strings to prevent typos and simplify refactoring.
 */
export const ROUTES = {
  /** Public routes */
  home: "/",

  /** Fan Copilot routes — Phase 2 */
  fan: {
    root: "/fan",
    copilot: "/fan/copilot",
  },

  /** Operations routes — Phase 3 */
  ops: {
    root: "/ops",
    dashboard: "/ops/dashboard",
  },

  /** Volunteer routes — Phase 4 */
  volunteer: {
    root: "/volunteer",
    assistant: "/volunteer/assistant",
  },
} as const;

/**
 * Navigation items for the landing page feature cards.
 * These are placeholders — functionality will be implemented in later phases.
 */
export const NAV_ITEMS = [
  {
    label: "Fan Copilot",
    description: "AI-powered stadium assistant for navigation, wait times, and FAQs",
    href: ROUTES.fan.root,
    phase: 2,
    icon: "MessageCircle" as const,
    available: true,
  },
  {
    label: "Operations Center",
    description: "Real-time dashboard for incident management and crowd monitoring",
    href: ROUTES.ops.root,
    phase: 3,
    icon: "LayoutDashboard" as const,
    available: true,
  },
  {
    label: "Volunteer Assistant",
    description: "Policy retrieval and knowledge base for stadium volunteers",
    href: ROUTES.volunteer.root,
    phase: 4,
    icon: "HeartHandshake" as const,
    available: false,
  },
] as const;
