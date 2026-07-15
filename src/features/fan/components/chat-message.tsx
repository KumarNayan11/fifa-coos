/**
 * FIFACoOS — Chat Message Component
 *
 * Renders a single chat message bubble.
 * Assistant messages are plain text (no markdown rendering).
 * Uses aria-live for screen reader announcements.
 *
 * @see DEVELOPER_GUIDE.md §14 — Accessibility Guidelines
 */

import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types/fan.types";

export interface ChatMessageProps {
  message: ChatMessage;
}

/**
 * Chat message bubble — user messages right-aligned, assistant left-aligned.
 * Plain text only per Phase 2 requirements.
 */
export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
        role="log"
        aria-label={`${isUser ? "You" : "Fan Copilot"} said`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <time
          className={cn(
            "mt-1 block text-[10px]",
            isUser ? "text-primary-foreground/60" : "text-muted-foreground",
          )}
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </div>
  );
}
