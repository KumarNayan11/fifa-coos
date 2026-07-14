/**
 * FIFACoOS — Loading Page
 *
 * Root loading state following Next.js App Router conventions.
 * Displayed while server components are being resolved.
 *
 * @see DEVELOPER_GUIDE.md Section 10 — Loading UI
 */

import { Container } from "@/components/ui/container";
import { Loading as LoadingPlaceholder } from "@/components/ui/loading";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <LoadingPlaceholder count={4} label="Loading FIFACoOS" />
      </Container>
    </main>
  );
}
