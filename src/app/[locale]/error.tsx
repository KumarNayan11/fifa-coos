"use client";

/**
 * FIFACoOS — Global Error Page
 *
 * Error boundary following Next.js App Router conventions.
 * Catches rendering errors and provides a recovery action.
 * Never exposes internal stack traces to the user.
 *
 * @see ARCHITECTURE.md Section 14 — Error Handling Philosophy
 * @see DEVELOPER_GUIDE.md Section 10 — Error Boundaries
 */

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability — will integrate with Sentry in Phase 6
    console.error("[FIFACoOS Error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="flex flex-col items-center text-center">
          <span className="text-6xl font-extrabold text-muted-foreground/20" aria-hidden="true">
            Error
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="default" onClick={reset}>
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
