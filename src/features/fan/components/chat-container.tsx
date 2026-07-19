"use client";

/**
 * FIFACoOS — Chat Container Component
 *
 * Main conversational chat UI — scrollable message list, auto-scroll,
 * welcome state with quick actions, and streaming indicator.
 *
 * @see PRD.md §11 — Fan Copilot interface
 */

import { useRef, useEffect } from "react";
import { announce } from "@/lib/accessibility/announcements";

import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import type { ChatMessage } from "../types/fan.types";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { QuickActions } from "./quick-actions";
import { STADIUM } from "../data/stadium";

export interface ChatContainerProps {
  /** Conversation messages */
  messages: ChatMessage[];
  /** Whether AI is currently streaming */
  isStreaming: boolean;
  /** Current partial response text during streaming */
  streamingText?: string;
  /** Send a new message */
  onSend: (message: string) => void;
}

/**
 * Full chat container: message list + input + welcome state.
 */
export function ChatContainer({
  messages,
  isStreaming,
  streamingText,
  onSend,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  // Auto-scroll on new messages or streaming updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  useEffect(() => {
    if (isStreaming) {
      announce("Copilot is thinking...", "polite");
    } else if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      announce("Response received from Copilot", "polite");
    }
  }, [isStreaming, messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <Container size="md" className="py-4">
          {isEmpty ? (
            <WelcomeState onQuickAction={onSend} />
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}

              {/* Streaming indicator */}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]">
                    {streamingText ? (
                      <p className="whitespace-pre-wrap">{streamingText}</p>
                    ) : (
                      <StreamingDots />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>

      {/* Input bar */}
      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome State (shown when no messages)
// ---------------------------------------------------------------------------

function WelcomeState({ onQuickAction }: { onQuickAction: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-2 text-4xl" aria-hidden="true">
        ⚽
      </div>
      <h2 className="text-xl font-semibold">Welcome to Fan Copilot</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your AI stadium assistant for {STADIUM.name}. Ask about gates, food, restrooms, wait times,
        accessibility, and more.
      </p>
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Try asking:</p>
        <QuickActions onSelect={onQuickAction} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streaming Dots Animation
// ---------------------------------------------------------------------------

function StreamingDots() {
  return (
    <div className="flex items-center gap-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "inline-block h-2 w-2 rounded-full bg-muted-foreground/40",
            "animate-pulse",
          )}
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
      <span className="sr-only">Fan Copilot is thinking...</span>
    </div>
  );
}
