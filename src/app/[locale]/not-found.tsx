/**
 * FIFACoOS — Not Found Page
 *
 * Custom 404 page following Next.js App Router conventions.
 * Provides a clear message and navigation back to safety.
 *
 * @see ARCHITECTURE.md Section 14 — Error Handling Philosophy
 */

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="flex flex-col items-center text-center">
          <span className="text-7xl font-extrabold text-muted-foreground/20" aria-hidden="true">
            404
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Page Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/" className="mt-6">
            <Button variant="default">Return Home</Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
