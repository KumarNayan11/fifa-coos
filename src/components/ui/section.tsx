/**
 * FIFACoOS — Section Component
 *
 * Semantic page section with consistent spacing and optional heading.
 * Uses <section> with aria-labelledby for screen reader support.
 *
 * @see DEVELOPER_GUIDE.md Section 14 — Semantic HTML
 */

import { cn } from "@/lib/utils";
import { generateId } from "@/lib/helpers";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section heading — rendered as h2 */
  heading?: string;
  /** Optional description below the heading */
  description?: string;
}

/**
 * Semantic section component with consistent vertical spacing.
 *
 * @example
 * ```tsx
 * <Section heading="Technology Stack" description="Approved technologies">
 *   <TechStackList />
 * </Section>
 * ```
 */
export function Section({ heading, description, className, children, ...props }: SectionProps) {
  const headingId = heading ? `section-${generateId()}` : undefined;

  return (
    <section aria-labelledby={headingId} className={cn("py-8", className)} {...props}>
      {heading && (
        <div className="mb-6">
          <h2 id={headingId} className="text-2xl font-semibold tracking-tight">
            {heading}
          </h2>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
