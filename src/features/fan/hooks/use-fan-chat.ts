"use client";

/**
 * FIFACoOS — Fan Chat Hook
 *
 * Manages the client-side state of the Fan Copilot conversation.
 * Interacts with the `chat` Server Action (Orchestrator).
 * Reconstructs the streamable object into a complete UI state.
 */

import { useState, useCallback } from "react";

import { generateId } from "@/lib/helpers";
import type { ChatMessage } from "../types/fan.types";
import { chat } from "@/app/fan/actions";

export interface UseFanChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingText: string;
  sendMessage: (content: string) => Promise<void>;
}

export function useFanChat(): UseFanChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const sendMessage = useCallback(
    async (content: string) => {
      // 1. Add user message to local state instantly
      const userMessage: ChatMessage = {
        id: "msg_user_" + generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setStreamingText("");

      try {
        // Prepare history for the server
        const history = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // 2. Call the Server Action
        console.log("Calling Server Action...");
        const finalResponse = await chat(history);
        console.log("Server Action returned:", finalResponse);

        // 3. Add assistant message to history
        if (finalResponse.response) {
          const assistantMessage: ChatMessage = {
            id: "msg_ai_" + generateId(),
            role: "assistant",
            content: finalResponse.response,
            timestamp: new Date(),
            suggestedPOIs: finalResponse.suggestedPOIs,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        // Fallback message if network fails completely (Server Action unreachable)
        const errorMessage: ChatMessage = {
          id: "msg_err_" + generateId(),
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please check your internet connection or ask a nearby volunteer for help.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsStreaming(false);
        setStreamingText("");
      }
    },
    [messages],
  );

  return {
    messages,
    isStreaming,
    streamingText,
    sendMessage,
  };
}
