// @vitest-environment jsdom
import { render, screen, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { LiveRegion } from "@/components/shared/LiveRegion";
import { SkipNav } from "@/components/shared/SkipNav";
import { announce } from "@/lib/accessibility/announcements";

// Mock next-intl hooks
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      skipToContent: "Skip to content",
    };
    return messages[key] || key;
  },
  useLocale: () => "en",
}));

describe("Accessibility Foundation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("SkipNav Component", () => {
    it("renders as visually hidden but focusable", () => {
      render(<SkipNav />);
      const link = screen.getByRole("link", { name: /skip to content/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#main-content");
      expect(link).toHaveClass("sr-only");
      expect(link).toHaveClass("focus:not-sr-only");
    });
  });

  describe("LiveRegion Component", () => {
    it("renders polite and assertive regions", () => {
      render(<LiveRegion />);
      // Should have polite and assertive containers
      const liveRegions = document.querySelectorAll("[aria-live]");
      expect(liveRegions).toHaveLength(2);
      expect(liveRegions[0]).toHaveAttribute("aria-live", "polite");
      expect(liveRegions[1]).toHaveAttribute("aria-live", "assertive");
    });

    it("responds to announcements (async simulated)", async () => {
      vi.useFakeTimers();
      render(<LiveRegion />);

      announce("Polite announcement", "polite");

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(screen.getByText("Polite announcement")).toBeInTheDocument();

      announce("Critical error!", "assertive");
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(screen.getByText("Critical error!")).toBeInTheDocument();
      vi.useRealTimers();
    });
  });
});
