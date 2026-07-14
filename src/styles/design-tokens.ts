/**
 * FIFACoOS — Design Tokens
 *
 * Centralized design token system for consistent theming across all components.
 * These tokens complement the Tailwind/shadcn CSS custom properties defined
 * in globals.css. Use these constants in TypeScript when CSS classes are
 * insufficient (e.g., dynamic styles, chart colors, or programmatic layouts).
 *
 * @see globals.css for CSS custom property definitions
 * @see DEVELOPER_GUIDE.md Section 9 — Magic Numbers/Strings
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

/**
 * Semantic color tokens referencing CSS custom properties.
 * Use Tailwind classes (e.g., `bg-primary`) for styling.
 * Use these tokens when you need color values in JS/TS contexts.
 */
export const COLORS = {
  /** Core brand palette */
  brand: {
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    secondary: "var(--secondary)",
    secondaryForeground: "var(--secondary-foreground)",
  },

  /** Surface colors */
  surface: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    cardForeground: "var(--card-foreground)",
    popover: "var(--popover)",
    popoverForeground: "var(--popover-foreground)",
  },

  /** Semantic states */
  semantic: {
    destructive: "var(--destructive)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    accentForeground: "var(--accent-foreground)",
  },

  /** Interactive elements */
  interactive: {
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },

  /** Chart palette */
  chart: {
    1: "var(--chart-1)",
    2: "var(--chart-2)",
    3: "var(--chart-3)",
    4: "var(--chart-4)",
    5: "var(--chart-5)",
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

/**
 * Spacing scale (in rem) aligned with Tailwind's spacing system.
 * Use Tailwind classes (e.g., `p-4`, `gap-6`) wherever possible.
 * Use these tokens for dynamic spacing calculations.
 */
export const SPACING = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

/**
 * Border radius tokens referencing CSS custom properties set by shadcn.
 * Prefer Tailwind classes (e.g., `rounded-lg`) in components.
 */
export const BORDER_RADIUS = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  "4xl": "var(--radius-4xl)",
  full: "9999px",
  none: "0",
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/**
 * Typography tokens for font families, sizes, weights, and line heights.
 * Font families reference CSS variables set by Next.js font optimization.
 */
export const TYPOGRAPHY = {
  fontFamily: {
    sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// ---------------------------------------------------------------------------
// Layout Constants
// ---------------------------------------------------------------------------

/**
 * Layout constants for consistent page structure.
 */
export const LAYOUT = {
  /** Maximum content widths */
  maxWidth: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
    full: "100%",
  },

  /** Standard page padding */
  pagePadding: {
    mobile: "1rem",
    tablet: "1.5rem",
    desktop: "2rem",
  },

  /** Header and navigation heights */
  headerHeight: "4rem",

  /** Sidebar widths */
  sidebarWidth: {
    collapsed: "4rem",
    expanded: "16rem",
  },

  /** Breakpoints matching Tailwind defaults */
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

/**
 * Transition tokens for consistent, accessible animations.
 * Respect user's prefers-reduced-motion setting in CSS.
 */
export const TRANSITIONS = {
  /** Duration presets */
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  /** Easing curves */
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  /** Common transition presets */
  presets: {
    default: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors: "color, background-color, border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// ---------------------------------------------------------------------------
// Z-Index Scale
// ---------------------------------------------------------------------------

/**
 * Z-index scale to prevent z-index wars.
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
} as const;
