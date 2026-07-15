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
import { getPOIsByIds } from "../services/poi.service";
import { POICard } from "./poi-card";

export interface ChatMessageProps {
  message: ChatMessage;
}

/**
 * Chat message bubble — user messages right-aligned, assistant left-aligned.
 * Plain text only per Phase 2 requirements.
 * Renders suggested POIs if included by the AI.
 */
export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const suggestedPOIs =
    message.suggestedPOIs && message.suggestedPOIs.length > 0
      ? getPOIsByIds(message.suggestedPOIs)
      : [];

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="flex w-full max-w-[85%] flex-col gap-2 sm:max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground self-end"
              : "bg-muted text-foreground self-start",
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

        {/* Render POI Cards if suggested by AI */}
        {suggestedPOIs.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {suggestedPOIs.map((poi) => (
              <POICard key={poi.id} poi={poi} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
