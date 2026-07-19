/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { VolunteerCopilotWorkspace } from "../components/volunteer-workspace";
import { useVolunteerChat } from "../hooks/use-volunteer-chat";
import { renderHook } from "@testing-library/react";
import { announce } from "@/lib/accessibility/announcements";

// Mock matchMedia for jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dependencies
vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/features/ai/actions", () => ({
  askVolunteerCopilotAction: vi.fn().mockResolvedValue({
    success: true,
    data: {
      answer: "Here is the operational procedure.",
      referencedArticles: ["volunteer-handbook"],
    },
  }),
}));

vi.mock("@/lib/accessibility/announcements", () => ({
  announce: vi.fn(),
}));

describe("Volunteer Assistant - Premium Experience", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Welcome Screen & Operational Prompts", () => {
    it("should render welcome screen and prompt cards initially", () => {
      render(<VolunteerCopilotWorkspace />);

      const titles = screen.getAllByText(/Volunteer Assistant/i);
      expect(titles.length).toBeGreaterThan(0);
      expect(screen.getByText(/Report an Incident/i)).toBeDefined();
      expect(screen.getByText(/Lost Child Procedure/i)).toBeDefined();
    });

    it("should hide the welcome screen when messages exist", async () => {
      // Create a mock hook specifically for this test if we need to simulate state,
      // but actually we can just fire the send event which triggers useVolunteerChat
      const { container } = render(<VolunteerCopilotWorkspace />);
      const btn = screen.getByText("Report an Incident").closest("button");

      await act(async () => {
        fireEvent.click(btn!);
      });

      // Welcome text should disappear
      expect(
        screen.queryByText(
          "Your operational guide. Quickly retrieve event procedures, protocols, and role-specific instructions.",
        ),
      ).toBeNull();
    });
  });

  describe("Conversation Actions", () => {
    it("should clear conversation via hook", async () => {
      const { result } = renderHook(() => useVolunteerChat());

      await act(async () => {
        await result.current.sendMessage("Hello");
      });

      expect(result.current.messages.length).toBeGreaterThan(0);

      act(() => {
        result.current.clearConversation();
      });

      expect(result.current.messages.length).toBe(0);
    });

    it("should map referenced articles to the message footer", async () => {
      const { result } = renderHook(() => useVolunteerChat());

      await act(async () => {
        await result.current.sendMessage("Test question");
      });

      const lastMessage = result.current.messages[result.current.messages.length - 1];
      expect(lastMessage.referencedArticles).toContain("volunteer-handbook");
    });
  });
});
