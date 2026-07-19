"use client";

/**
 * FIFACoOS — Copilot Chat Page
 *
 * Integrates the ChatContainer and useFanChat hook.
 */

import { ChatContainer } from "@/features/fan/components/chat-container";
import { useFanChat } from "@/features/fan/hooks/use-fan-chat";
import { BackButton } from "@/components/shared/BackButton";

export default function FanCopilotPage() {
  const { messages, isStreaming, streamingText, sendMessage } = useFanChat();

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center border-b bg-white px-4 py-3 shadow-sm">
        <BackButton href="/" label="Back to Home" />
        <div className="ml-4 flex-1 text-sm font-medium text-gray-900">Fan Copilot</div>
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
