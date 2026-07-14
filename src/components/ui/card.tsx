/**
 * FIFACoOS — Card Component
 *
 * Accessible, composable card component with header, content, and footer slots.
 * Uses semantic HTML for proper screen reader support.
 *
 * @see DEVELOPER_GUIDE.md Section 14 — Accessibility Guidelines
 */

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Card Root
// ---------------------------------------------------------------------------

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Card container with consistent styling.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content goes here</CardContent>
 *   <CardFooter>Footer actions</CardFooter>
 * </Card>
 * ```
 */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Card Header
// ---------------------------------------------------------------------------

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

// ---------------------------------------------------------------------------
// Card Title
// ---------------------------------------------------------------------------

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  );
}

// ---------------------------------------------------------------------------
// Card Description
// ---------------------------------------------------------------------------

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

// ---------------------------------------------------------------------------
// Card Content
// ---------------------------------------------------------------------------

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

// ---------------------------------------------------------------------------
// Card Footer
// ---------------------------------------------------------------------------

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
