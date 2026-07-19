/**
 * FIFACoOS — Not Found Page
 *
 * Custom 404 page following Next.js App Router conventions.
 * Provides a clear message and navigation back to safety.
 *
 * @see ARCHITECTURE.md Section 14 — Error Handling Philosophy
 */

import Link from "next/link";
import { MessageCircle, ShieldCheck, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <Container size="sm">
        <div className="flex flex-col items-center text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 mb-6">
            <AlertCircle className="h-10 w-10" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Page Not Found</h1>
          <p className="mt-4 text-gray-500 text-lg max-w-md">
            The page you are looking for does not exist, has been moved, or you might not have
            access to it.
          </p>

          <div className="mt-10 grid gap-4 w-full sm:grid-cols-2">
            <Link href="/" className="w-full">
              <Button variant="default" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
            <Link href="/fan/copilot" className="w-full">
              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Fan Copilot
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t w-full">
            <Link
              href="/ops/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Staff Login
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
