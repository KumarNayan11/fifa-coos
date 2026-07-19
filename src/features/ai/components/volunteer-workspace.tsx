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
    // Group referenced articles by heuristic categories
    const getArticleInfo = (slug: string) => {
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      let category = "General";
      let icon = "📄";

      if (slug.includes("medical") || slug.includes("emergency")) {
        category = "Emergency";
        icon = "🩺";
      } else if (slug.includes("lost") || slug.includes("child") || slug.includes("guidance")) {
        category = "Safety";
        icon = "👶";
      } else if (slug.includes("accessibility")) {
        category = "Guest Services";
        icon = "♿";
      } else if (slug.includes("ticket") || slug.includes("entry") || slug.includes("gate")) {
        category = "Entry";
        icon = "🎫";
      } else if (slug.includes("conduct") || slug.includes("volunteer")) {
        category = "HR";
        icon = "👤";
      }

      return { title, category, icon };
    };

    const groupedSources: Record<string, { slug: string; title: string; icon: string }[]> = {};

    if (msg.referencedArticles) {
      msg.referencedArticles.forEach((slug) => {
        const { title, category, icon } = getArticleInfo(slug);
        if (!groupedSources[category]) {
          groupedSources[category] = [];
        }
        groupedSources[category].push({ slug, title, icon });
      });
    }

    return {
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      footer:
        msg.referencedArticles && msg.referencedArticles.length > 0 ? (
          <div className="mt-4 border-t pt-3 space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
              Sources
            </h4>
            <div className="space-y-3">
              {Object.entries(groupedSources).map(([category, articles]) => (
                <div key={category} className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full select-none">
                    {category}
                  </span>
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 mt-1">
                    {articles.map((art) => (
                      <div
                        key={art.slug}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-150 shadow-sm text-xs"
                      >
                        <span className="text-base select-none" aria-hidden="true">
                          {art.icon}
                        </span>
                        <div className="truncate min-w-0">
                          <p className="font-semibold text-gray-800 truncate" title={art.title}>
                            {art.title}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate font-mono">{art.slug}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
