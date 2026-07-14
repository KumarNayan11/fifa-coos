/**
 * FIFACoOS — Loading Component
 *
 * Reusable loading placeholder with skeleton animation.
 * Announces loading state to screen readers via aria-label.
 *
 * @see DEVELOPER_GUIDE.md Section 14 — Accessibility Guidelines
 */

import { cn } from "@/lib/utils";
import { SKELETON_COUNT } from "@/config/constants";

// ---------------------------------------------------------------------------
// Skeleton Primitive
// ---------------------------------------------------------------------------

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Skeleton loading placeholder with pulse animation.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Loading Placeholder
// ---------------------------------------------------------------------------

export interface LoadingProps {
  /** Number of skeleton rows to display */
  count?: number;
  /** Optional accessible label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading placeholder that renders multiple skeleton rows.
 * Announces "Loading" state to screen readers.
 *
 * @example
 * ```tsx
 * <Loading count={3} label="Loading dashboard data" />
 * ```
 */
export function Loading({
  count = SKELETON_COUNT,
  label = "Loading content",
  className,
}: LoadingProps) {
  return (
    <div className={cn("space-y-4", className)} role="status" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
