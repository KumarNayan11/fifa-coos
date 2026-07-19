"use client";

/**
 * FIFACoOS — Volunteer Chat Hook
 *
 * Manages the client-side state of the Volunteer Assistant conversation.
 * Invokes the Server Action (askVolunteerCopilotAction) without mutating it.
 */

import { useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { generateId } from "@/lib/helpers";
import { askVolunteerCopilotAction } from "../actions";

export interface VolunteerChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  referencedArticles?: string[];
}

export interface UseVolunteerChatReturn {
  messages: VolunteerChatMessage[];
  isStreaming: boolean; // Renamed semantically to match chat interface, though not actually streaming
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
}

export function useVolunteerChat(): UseVolunteerChatReturn {
  const locale = useLocale() as Locale;
  const t = useTranslations("ai");
  const [messages, setMessages] = useState<VolunteerChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      // 1. Add user message
      const userMessage: VolunteerChatMessage = {
        id: "msg_user_" + generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      try {
        // 2. Invoke Server Action with FormData
        const formData = new FormData();
        formData.append("question", content);

        const response = await askVolunteerCopilotAction(locale, { success: false }, formData);

        // 3. Process AI Response
        if (response.success && response.data) {
          const assistantMessage: VolunteerChatMessage = {
            id: "msg_ai_" + generateId(),
            role: "assistant",
            content: response.data.answer,
            timestamp: new Date(),
            referencedArticles: response.data.referencedArticles,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          // Action returned an error message
          const errorMessage: VolunteerChatMessage = {
            id: "msg_err_" + generateId(),
            role: "assistant",
            content: response.error || t("unexpectedError"),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error("Failed to ask Volunteer Copilot:", error);
        const errorMessage: VolunteerChatMessage = {
          id: "msg_err_" + generateId(),
          role: "assistant",
          content: t("unexpectedError"),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsStreaming(false);
      }
    },
    [locale, t],
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    clearConversation,
  };
}
