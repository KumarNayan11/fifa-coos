/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { ChatContainer } from "../components/chat-container";
import { ChatMessageBubble } from "@/components/chat/chat-message";
import { useFanChat } from "../hooks/use-fan-chat";
import { renderHook } from "@testing-library/react";
import { announce } from "@/lib/accessibility/announcements";
import type { ChatMessageData } from "@/components/chat/chat-types";

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

vi.mock("@/app/[locale]/fan/actions", () => ({
  chat: vi.fn().mockResolvedValue({ response: "Hello from AI", suggestedPOIs: [] }),
}));

vi.mock("@/lib/accessibility/announcements", () => ({
  announce: vi.fn(),
}));

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe("Fan Copilot - Premium Experience", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Welcome Screen & Suggested Prompts", () => {
    it("should render welcome screen and prompt cards initially", () => {
      render(<ChatContainer messages={[]} isStreaming={false} onSend={vi.fn()} />);

      expect(screen.getByText(/Welcome to Fan Copilot/i)).toBeDefined();
      expect(screen.getByText("Find My Gate")).toBeDefined();
      expect(screen.getByText("Food & Drinks")).toBeDefined();
    });

    it("should fire onSend when a suggested prompt card is clicked", () => {
      const onSendMock = vi.fn();
      render(<ChatContainer messages={[]} isStreaming={false} onSend={onSendMock} />);

      const findGateBtn = screen.getByText("Find My Gate").closest("button");
      fireEvent.click(findGateBtn!);

      expect(onSendMock).toHaveBeenCalledWith("How do I get to my gate?");
    });

    it("should hide the welcome screen when messages exist", () => {
      render(
        <ChatContainer
          messages={[{ id: "1", role: "user", content: "Hello", timestamp: new Date() }]}
          isStreaming={false}
          onSend={vi.fn()}
        />,
      );

      expect(screen.queryByText(/Welcome to Fan Copilot/i)).toBeNull();
      expect(screen.getByText("Hello")).toBeDefined();
    });
  });

  describe("Chat Message Formatting & Actions", () => {
    it("should parse basic markdown (bold, headers, lists)", () => {
      const message: ChatMessageData = {
        id: "1",
        role: "assistant",
        content: "### Heading\n**Bold Text**\n- Item 1\n1. Ordered Item",
        timestamp: new Date(),
      };

      const { container } = render(<ChatMessageBubble message={message} />);

      expect(screen.getByText("Heading")).toBeDefined();
      expect(container.querySelector("h3")).toBeDefined();

      expect(screen.getByText("Bold Text")).toBeDefined();
      expect(container.querySelector("strong")).toBeDefined();

      expect(screen.getByText("Item 1")).toBeDefined();
      expect(container.querySelector("li")).toBeDefined();
    });

    it("should copy response and show temporary success state", async () => {
      vi.useFakeTimers();

      const message: ChatMessageData = {
        id: "1",
        role: "assistant",
        content: "Copy this text",
        timestamp: new Date(),
      };

      render(<ChatMessageBubble message={message} />);

      const copyBtn = screen.getByTitle("Copy response");
      expect(copyBtn).toBeDefined();

      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Copy this text");

      vi.runAllTimers();
      vi.useRealTimers();
    });
  });

  describe("Conversation Controls & Loading", () => {
    it("should announce thinking state for accessibility", () => {
      render(<ChatContainer messages={[]} isStreaming={true} onSend={vi.fn()} />);

      expect(announce).toHaveBeenCalledWith("Assistant is thinking...", "polite");
    });

    it("should clear conversation via hook", async () => {
      const { result } = renderHook(() => useFanChat());

      // Start by adding a message
      await act(async () => {
        await result.current.sendMessage("Hello");
      });

      expect(result.current.messages.length).toBeGreaterThan(0);

      // Clear it
      act(() => {
        result.current.clearConversation();
      });

      expect(result.current.messages.length).toBe(0);
    });
  });
});
