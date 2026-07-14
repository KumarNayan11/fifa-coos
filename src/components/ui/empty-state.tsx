/**
 * FIFACoOS — EmptyState Component
 *
 * Placeholder UI for empty data states.
 * Provides a consistent empty state pattern across the application.
 *
 * @see SYSTEM_DESIGN.md Section 14 — Missing Operational Data handling
 */

import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element rendered above the title */
  icon?: React.ReactNode;
  /** Empty state title */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action element (e.g., a button) */
  action?: React.ReactNode;
}

/**
 * Empty state component for when there is no data to display.
 * Follows the architecture's graceful degradation principle.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Inbox className="h-12 w-12" />}
 *   title="No incidents"
 *   description="There are no incidents to display."
 *   action={<Button>Create Incident</Button>}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-16 text-center", className)}
      role="status"
      {...props}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
