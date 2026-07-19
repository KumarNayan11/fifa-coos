"use server";

/**
 * FIFACoOS — Fan Copilot Server Actions (Orchestrator Layer)
 *
 * This is the Orchestrator entry point for the Fan Copilot.
 * It mediates between the client UI and the domain services + AIE.
 *
 * Flow: Client → Server Action → Knowledge Service → AI Service → Validated Response
 * Fallback: If AI fails or confidence < 50 → Fallback Service
 *
 * @see SYSTEM_DESIGN.md §8.3 — Service Orchestrator
 * @see API_DESIGN.md §7.6 — Orchestrator Service
 */

import { processFanQuery, type AIMessage } from "@/features/fan/services/ai.service";
import {
  generateFallbackResponse,
  shouldUseFallback,
} from "@/features/fan/services/fallback.service";
import type { FanCopilotResponse } from "@/features/fan/types/fan.types";

/**
 * Fan Copilot chat Server Action.
 *
 * Returns a fully formed response instead of streaming, avoiding Next.js
 * Server Action async iterable hanging issues.
 */
export async function chat(messages: AIMessage[]): Promise<FanCopilotResponse> {
  try {
    const latestUserMessage = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";

    if (!latestUserMessage.trim()) {
      return generateFallbackResponse("");
    }

    // Invoke AI Service (generateObject)
    const result = await processFanQuery(messages);

    if (shouldUseFallback(result.object.confidence)) {
      return generateFallbackResponse(latestUserMessage);
    }

    return result.object;
  } catch (error) {
    console.error("[FIFACoOS] AI Service Error:", error);
    const latestUserMessage = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";
    return generateFallbackResponse(latestUserMessage);
  }
}
