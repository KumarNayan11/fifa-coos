/**
 * FIFACoOS — PageHeader Component
 *
 * Consistent page header with title, description, and optional actions slot.
 * Uses semantic <header> element for accessibility.
 *
 * @see DEVELOPER_GUIDE.md Section 14 — Semantic HTML
 */

import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Page title — rendered as h1 */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Optional action buttons slot */
  actions?: React.ReactNode;
}

/**
 * Page header component with title, optional description, and action buttons.
 * Renders a single <h1> per page as recommended by SEO best practices.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Dashboard"
 *   description="Real-time stadium operations overview"
 *   actions={<Button>New Report</Button>}
 * />
 * ```
 */
export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-1 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
