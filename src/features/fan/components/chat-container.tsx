"use client";

/**
 * FIFACoOS — Chat Container Component
 *
 * Main conversational chat UI — scrollable message list, auto-scroll,
 * welcome state with quick actions, and streaming indicator.
 *
 * @see PRD.md §11 — Fan Copilot interface
 */

import { ChatContainer as SharedChatContainer } from "@/components/chat/chat-container";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import type { ChatMessageData } from "@/components/chat/chat-types";
import type { ChatMessage } from "../types/fan.types";
import { STADIUM } from "../data/stadium";
import { getPOIsByIds } from "../services/poi.service";
import { POICard } from "./poi-card";

export interface ChatContainerProps {
  /** Conversation messages */
  messages: ChatMessage[];
  /** Whether AI is currently streaming */
  isStreaming: boolean;
  /** Current partial response text during streaming (unused since streaming is dropped) */
  streamingText?: string;
  /** Send a new message */
  onSend: (message: string) => void;
}

const FAN_LOADING_MESSAGES = [
  "Looking up stadium information...",
  "Searching official guidance...",
  "Preparing your response...",
];

const FAN_PROMPT_CARDS = [
  {
    title: "Find My Gate",
    prompt: "How do I get to my gate?",
    description: "Locate the quickest route to your seating section.",
    icon: "🏟️",
  },
  {
    title: "Food & Drinks",
    prompt: "Where is the nearest food court?",
    description: "Discover nearby concessions and dining options.",
    icon: "🍔",
  },
  {
    title: "Transport Options",
    prompt: "What are the transport options to leave the stadium?",
    description: "View transit schedules and parking directions.",
    icon: "🚆",
  },
  {
    title: "Accessibility Help",
    prompt: "Where are the accessible restrooms and services?",
    description: "Find accessible routes and stadium facilities.",
    icon: "♿",
  },
] as const;

export function ChatContainer({ messages, isStreaming, onSend }: ChatContainerProps) {
  // Map domain-specific messages to generic ChatMessageData
  const genericMessages: ChatMessageData[] = messages.map((msg) => {
    const suggestedPOIs =
      msg.suggestedPOIs && msg.suggestedPOIs.length > 0 ? getPOIsByIds(msg.suggestedPOIs) : [];

    return {
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      footer:
        suggestedPOIs.length > 0 ? (
          <>
            {suggestedPOIs.map((poi) => (
              <POICard key={poi.id} poi={poi} />
            ))}
          </>
        ) : undefined,
    };
  });

  return (
    <SharedChatContainer
      messages={genericMessages}
      isStreaming={isStreaming}
      onSend={onSend}
      loadingMessages={FAN_LOADING_MESSAGES}
      welcomeScreen={<FanWelcomeState onQuickAction={onSend} />}
    />
  );
}

function FanWelcomeState({ onQuickAction }: { onQuickAction: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl"
        aria-hidden="true"
      >
        🤖
      </div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to Fan Copilot</h2>
      <p className="mt-3 max-w-lg text-base text-gray-500 leading-relaxed">
        Your intelligent stadium assistant for {STADIUM.name}. Ask me about gates, food, restrooms,
        wait times, accessibility, and more.
      </p>

      <p className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
        Responses are based on official stadium information and available event guidance.
      </p>

      <div className="mt-10 w-full">
        <SuggestedPrompts cards={FAN_PROMPT_CARDS} onSelect={onQuickAction} />
      </div>
    </div>
  );
}
