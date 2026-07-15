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
 * This is the Orchestrator entry point:
 * 1. Validates incoming messages
 * 2. Invokes AI Service with knowledge context
 * 3. Streams validated response to client using async generators
 * 4. Falls back to deterministic response on failure
 *
 * @param messages - Conversation history
 * @returns AsyncGenerator streaming partial FanCopilotResponse updates
 */
export async function* chat(
  messages: AIMessage[],
): AsyncGenerator<Partial<FanCopilotResponse>, Partial<FanCopilotResponse>, unknown> {
  try {
    const latestUserMessage = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";

    // Guard: empty message
    if (!latestUserMessage.trim()) {
      const fallback = generateFallbackResponse("");
      yield fallback;
      return fallback;
    }

    // Invoke AI Service (streamObject)
    const result = processFanQuery(messages);

    // Stream partial updates to the client using native Next.js Server Action generators
    for await (const partialObject of result.partialObjectStream) {
      yield partialObject as Partial<FanCopilotResponse>;
    }

    // Get the final validated object
    const finalObject = await result.object;

    // Check confidence — fallback if below threshold
    if (shouldUseFallback(finalObject.confidence)) {
      const fallback = generateFallbackResponse(latestUserMessage);
      yield fallback;
      return fallback;
    }

    return finalObject;
  } catch (error) {
    // AI failure — trigger deterministic fallback
    console.error("[FIFACoOS] AI Service Error:", error);

    const latestUserMessage = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";
    const fallback = generateFallbackResponse(latestUserMessage);
    yield fallback;
    return fallback;
  }
}
