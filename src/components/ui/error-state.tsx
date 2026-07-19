/**
 * FIFACoOS — ErrorState Component
 *
 * Placeholder UI for failed data states or operational errors.
 * Provides a consistent error state pattern across the application.
 */

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element rendered above the title. Defaults to AlertCircle if not provided. */
  icon?: React.ReactNode;
  /** Error state title */
  title: string;
  /** Optional description text explaining the error */
  description?: string;
  /** Optional action element (e.g., a Retry button) */
  action?: React.ReactNode;
}

/**
 * Error state component for when operations fail or data cannot be retrieved.
 * Matches the visual weight of EmptyState but uses error semantics.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Something went wrong"
 *   description="Failed to load telemetry data."
 *   action={<Button onClick={retry}>Retry</Button>}
 * />
 * ```
 */
export function ErrorState({
  icon = <AlertCircle className="h-12 w-12 text-destructive" />,
  title,
  description,
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-16 text-center", className)}
      role="alert"
      {...props}
    >
      <div className="mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
