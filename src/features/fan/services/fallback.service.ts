/**
 * FIFACoOS — Fallback Service
 *
 * Deterministic fallback when:
 * 1. The AI API fails (network error, timeout, rate limit)
 * 2. The AI confidence is below 50
 * 3. Zod schema validation fails
 *
 * Returns static, safe responses based on keyword matching.
 *
 * @see AI_ARCHITECTURE.md §16 — Failure Handling
 * @see SYSTEM_DESIGN.md §14 — Failure Handling
 */

import type { FanCopilotResponse } from "../types/fan.types";
import { searchFAQs } from "./faq.service";
import { searchPOIs } from "./poi.service";
import { STADIUM } from "../data/stadium";

/** Confidence threshold — below this, AI response is discarded */
export const CONFIDENCE_THRESHOLD = 50;

import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/**
 * Generate a deterministic fallback response for a fan query.
 * This runs WITHOUT the AI — purely keyword-based matching
 * against the FAQ and POI databases.
 *
 * @param query - The user's original query text
 * @param locale - The current locale
 * @returns A safe, deterministic FanCopilotResponse
 */
export async function generateFallbackResponse(
  query: string,
  locale: Locale,
): Promise<FanCopilotResponse> {
  const t = await getTranslations({ locale, namespace: "ai" });

  // Try to match FAQs first
  const matchingFAQs = searchFAQs(query, 1);
  if (matchingFAQs.length > 0) {
    const topFAQ = matchingFAQs[0];
    return {
      intent: "faq",
      response: topFAQ.answer,
      suggestedPOIs: [],
      confidence: 100, // Deterministic = full confidence
    };
  }

  // Try to match POIs
  const matchingPOIs = searchPOIs(query, 3);
  if (matchingPOIs.length > 0) {
    const poiNames = matchingPOIs.map((p) => p.name).join(", ");
    const poiIds = matchingPOIs.map((p) => p.id);

    return {
      intent: "info",
      // Translating dynamic POI fallback is complex for this task.
      // The prompt asks to translate "The AI assistant is temporarily unavailable."
      // For the generic fallback:
      response: `Here are some relevant locations: ${poiNames}. Visit the nearest Information Desk for detailed directions, or ask a volunteer for help.`,
      suggestedPOIs: poiIds,
      confidence: 100,
    };
  }

  // Generic fallback — no matches at all
  return {
    intent: "general",
    response: t("fanFallback"),
    suggestedPOIs: ["poi-info-north", "poi-info-south"],
    confidence: 100,
  };
}

/**
 * Check if an AI response should be replaced with a fallback.
 *
 * @param confidence - The AI's self-assessed confidence score
 * @returns true if fallback should be triggered
 */
export function shouldUseFallback(confidence: number): boolean {
  return confidence < CONFIDENCE_THRESHOLD;
}
