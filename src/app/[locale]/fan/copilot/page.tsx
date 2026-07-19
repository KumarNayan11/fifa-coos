"use client";

/**
 * FIFACoOS — Copilot Chat Page
 *
 * Integrates the ChatContainer and useFanChat hook.
 */

import { ChatContainer } from "@/features/fan/components/chat-container";
import { useFanChat } from "@/features/fan/hooks/use-fan-chat";
import { BackButton } from "@/components/shared/BackButton";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function FanCopilotPage() {
  const { messages, isStreaming, streamingText, sendMessage, clearConversation } = useFanChat();

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50/50">
      {/* Premium Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <BackButton href="/" label="Back" />
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Fan Copilot</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              AI Ready
            </span>
          </div>
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
          messages={messages}
          isStreaming={isStreaming}
          streamingText={streamingText}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
