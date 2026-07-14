/**
 * FIFACoOS — Application Configuration
 *
 * Centralized application metadata and branding constants.
 * Single source of truth for app-wide identity information.
 *
 * @see DEVELOPER_GUIDE.md Section 9 — Magic Numbers/Strings
 */

export const APP_CONFIG = {
  /** Application identity */
  name: "FIFACoOS",
  fullName: "FIFA Copilot Operating System",
  description: "AI-powered Smart Stadium & Tournament Operations Platform for FIFA World Cup 2026",
  tagline:
    "Intelligent decision support for fans, organizers, volunteers, and emergency responders",

  /** Versioning */
  version: "0.2.0",
  architectureVersion: "1.0",

  /** Current implementation phase */
  phase: {
    current: 1,
    name: "Platform Foundation",
    status: "In Progress" as const,
  },

  /** Project metadata */
  repository: "https://github.com/KumarNayan11/fifa-coos",
  competition: "PromptWars Challenge 4",

  /** SEO and metadata */
  metadata: {
    title: "FIFACoOS — FIFA Copilot Operating System",
    titleTemplate: "%s | FIFACoOS",
    description:
      "AI-powered Smart Stadium & Tournament Operations Platform built for PromptWars Challenge 4",
    locale: "en",
  },
} as const;

/**
 * Technology stack summary for the landing page.
 */
export const TECH_STACK = [
  { name: "Next.js 16", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS v4", category: "Styling" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Supabase", category: "Database & Auth" },
  { name: "Prisma", category: "ORM" },
  { name: "Vercel AI SDK", category: "AI Gateway" },
  { name: "Google Gemini", category: "LLM Provider" },
  { name: "Zod", category: "Validation" },
  { name: "Zustand", category: "State Management" },
  { name: "Mapbox GL JS", category: "Maps" },
  { name: "Vitest", category: "Testing" },
] as const;

/**
 * Implementation phases for status display.
 */
export const IMPLEMENTATION_PHASES = [
  { phase: 0, name: "Repository Init", status: "complete" as const },
  { phase: 1, name: "Platform Foundation", status: "in-progress" as const },
  { phase: 2, name: "Fan Copilot", status: "not-started" as const },
  { phase: 3, name: "Ops Command Center", status: "not-started" as const },
  { phase: 4, name: "Volunteer Assistant", status: "not-started" as const },
  { phase: 5, name: "Polish & A11y", status: "not-started" as const },
  { phase: 6, name: "Hardening", status: "not-started" as const },
  { phase: 7, name: "PromptWars Submit", status: "not-started" as const },
] as const;
