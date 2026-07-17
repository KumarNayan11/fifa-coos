"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AutoRefreshProps {
  /**
   * The interval in milliseconds at which the page should refresh.
   */
  intervalMs: number;
}

/**
 * A Client Component that periodically triggers a server-driven refresh
 * by calling Next.js router.refresh(). It does not cause a full page reload,
 * but re-fetches Server Components.
 */
export function AutoRefresh({ intervalMs }: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (intervalMs <= 0) return;

    const intervalId = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [router, intervalMs]);

  return null;
}
