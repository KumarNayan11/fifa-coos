/**
 * FIFACoOS — Container Component
 *
 * Provides consistent max-width and padding for page content.
 * Centers content horizontally with responsive side padding.
 *
 * @see design-tokens.ts — LAYOUT.maxWidth
 */

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-[1400px]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "2xl",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

/**
 * Responsive container that constrains content width and adds consistent padding.
 *
 * @example
 * ```tsx
 * <Container size="lg">
 *   <h1>Page Content</h1>
 * </Container>
 * ```
 */
export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size, className }))} {...props} />;
}
