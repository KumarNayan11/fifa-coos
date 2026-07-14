/**
 * FIFACoOS — Divider Component
 *
 * Semantic horizontal rule with optional label.
 * Uses <hr> for proper semantic meaning.
 *
 * @see DEVELOPER_GUIDE.md Section 14 — Semantic HTML
 */

import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Optional label text displayed in the center of the divider */
  label?: string;
}

/**
 * Horizontal divider with optional centered label.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="Or continue with" />
 * ```
 */
export function Divider({ label, className, ...props }: DividerProps) {
  if (label) {
    return (
      <div className={cn("relative", className)} role="separator">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{label}</span>
        </div>
      </div>
    );
  }

  return <hr className={cn("border-t", className)} {...props} />;
}
