/**
 * FIFACoOS — Shared Chat Container
 *
 * Full chat container layout holding the message list and input.
 * Supports a custom Welcome Screen, custom loading messages, and scroll-to-bottom helper.
 */

import { useRef, useEffect, useState } from "react";
import { announce } from "@/lib/accessibility/announcements";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

import { ChatInput } from "./chat-input";
import { ChatMessageBubble } from "./chat-message";
import type { ChatMessageData } from "./chat-types";

export interface ChatContainerProps {
  /** Generic conversation messages */
  messages: ChatMessageData[];
  /** Whether AI is currently streaming/loading */
  isStreaming: boolean;
  /** Custom Welcome screen rendered when there are no messages */
  welcomeScreen?: React.ReactNode;
  /** Messages to display during loading/thinking state */
  loadingMessages?: string[];
  /** Send a new message */
  onSend: (message: string) => void;
  /** Optional container max-width class (e.g. max-w-4xl), defaults to max-w-2xl */
  maxWidthClass?: string;
}

export function ChatContainer({
  messages,
  isStreaming,
  welcomeScreen,
  loadingMessages = ["Thinking..."],
  onSend,
  maxWidthClass,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isEmpty = messages.length === 0;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp && messages.length > 0);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;

      if (!isScrolledUp) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isStreaming) {
      announce("Assistant is thinking...", "polite");
    } else if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      announce("Response received from Assistant", "polite");
    }
  }, [isStreaming, messages]);

  return (
    <div className="flex h-full flex-col relative bg-gray-50/50">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        <Container size="md" className={cn("py-6", maxWidthClass)}>
          {isEmpty && welcomeScreen ? (
            welcomeScreen
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}

              {isStreaming && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-3 text-sm leading-relaxed sm:max-w-[80%]">
                    <StreamingDots messages={loadingMessages} />
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>

      {showScrollButton && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-md bg-white pointer-events-auto h-8 w-8"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}

function StreamingDots({ messages }: { messages: string[] }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex items-center gap-3" aria-label="Thinking">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn("inline-block h-2 w-2 rounded-full bg-primary/60", "animate-pulse")}
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <span className="text-gray-500 italic text-sm animate-pulse">{messages[messageIndex]}</span>
      <span className="sr-only">Thinking...</span>
    </div>
  );
}
