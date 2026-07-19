/**
 * FIFACoOS — Providers
 *
 * Centralized provider wrapper for the application.
 * Currently a pass-through — ready to host future providers:
 *   - Theme Provider (Phase 5)
 *   - Query Provider (if needed)
 *   - Auth Provider (Phase 3)
 *   - AI Provider (Phase 2)
 *
 * @see DEVELOPER_GUIDE.md Section 10 — Streaming
 */

export interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Application-wide provider wrapper.
 * All global context providers should be added here.
 */
export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
