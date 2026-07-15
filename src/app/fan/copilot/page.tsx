"use client";

/**
 * FIFACoOS — Copilot Chat Page
 *
 * Integrates the ChatContainer and useFanChat hook.
 */

import { ChatContainer } from "@/features/fan/components/chat-container";
import { useFanChat } from "@/features/fan/hooks/use-fan-chat";

export default function FanCopilotPage() {
  const { messages, isStreaming, streamingText, sendMessage } = useFanChat();

  return (
    <div className="h-full w-full">
      <ChatContainer
        messages={messages}
        isStreaming={isStreaming}
        streamingText={streamingText}
        onSend={sendMessage}
      />
    </div>
  );
}
