"use client";

/**
 * FIFACoOS — Volunteer Assistant Workspace
 *
 * Professional operational chat workspace for volunteers.
 * Uses shared chat components and the `useVolunteerChat` hook.
 */

import { ChatContainer } from "@/components/chat/chat-container";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import type { ChatMessageData } from "@/components/chat/chat-types";
import { useVolunteerChat } from "../hooks/use-volunteer-chat";
import { Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VOLUNTEER_LOADING_MESSAGES = [
  "Retrieving volunteer procedures...",
  "Searching operational guidance...",
  "Reviewing official documentation...",
];

const VOLUNTEER_PROMPT_CARDS = [
  {
    title: "Report an Incident",
    prompt: "How do I report an incident?",
    description: "Learn the official reporting workflow.",
    icon: "🚨",
  },
  {
    title: "Lost Child Procedure",
    prompt: "What is the procedure for a lost child?",
    description: "Review safety and reporting steps.",
    icon: "👶",
  },
  {
    title: "Medical Emergency",
    prompt: "What do I do for a medical emergency?",
    description: "Find medical response protocols.",
    icon: "🩺",
  },
  {
    title: "Accessibility Support",
    prompt: "How can I assist guests with disabilities?",
    description: "View accessibility guidance.",
    icon: "🧑‍🦽",
  },
] as const;

export function VolunteerCopilotWorkspace() {
  const { messages, isStreaming, sendMessage, clearConversation } = useVolunteerChat();

  const genericMessages: ChatMessageData[] = messages.map((msg) => {
    return {
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      footer:
        msg.referencedArticles && msg.referencedArticles.length > 0 ? (
          <div className="mt-2 text-xs text-gray-500 border-t pt-2">
            <p className="font-semibold mb-1">Sources</p>
            <ul className="space-y-1">
              {msg.referencedArticles.map((slug) => (
                <li
                  key={slug}
                  className="flex items-center gap-1.5 before:content-['•'] before:text-gray-400"
                >
                  {slug}
                </li>
              ))}
            </ul>
          </div>
        ) : undefined,
    };
  });

  return (
    <div className="flex h-full w-full flex-col bg-gray-50/50 rounded-xl overflow-hidden border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900 tracking-tight leading-none">
              Volunteer Assistant
            </h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
              Operational Workspace
            </span>
          </div>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
            AI Ready
          </span>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Clear Chat"
            aria-label="Clear chat conversation"
          >
            <Trash2 className="h-4 w-4 mr-1.5 hidden sm:inline" />
            <span className="hidden sm:inline">Clear Chat</span>
            <Trash2 className="h-4 w-4 sm:hidden" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatContainer
          messages={genericMessages}
          isStreaming={isStreaming}
          onSend={sendMessage}
          loadingMessages={VOLUNTEER_LOADING_MESSAGES}
          maxWidthClass="max-w-3xl"
          welcomeScreen={<VolunteerWelcomeState onQuickAction={sendMessage} />}
        />
      </div>
    </div>
  );
}

function VolunteerWelcomeState({ onQuickAction }: { onQuickAction: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl text-primary"
        aria-hidden="true"
      >
        <Bot className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Volunteer Assistant</h2>
      <p className="mt-3 max-w-lg text-base text-gray-500 leading-relaxed">
        Your operational guide. Quickly retrieve event procedures, protocols, and role-specific
        instructions.
      </p>

      <p className="mt-4 text-xs font-medium text-blue-800 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
        Responses are generated from approved volunteer procedures and official operational
        guidance.
      </p>

      <div className="mt-10 w-full">
        <SuggestedPrompts cards={VOLUNTEER_PROMPT_CARDS} onSelect={onQuickAction} />
      </div>
    </div>
  );
}
