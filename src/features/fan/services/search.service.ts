/**
 * FIFACoOS — Search Service
 *
 * Unified search across FAQs and POIs.
 * Aggregates results from the individual services for the AI context builder.
 *
 * @see AI_ARCHITECTURE.md §7 — Knowledge Retrieval component
 */

import type { KnowledgeArticle, POI } from "../types/fan.types";
import { searchFAQs } from "./faq.service";
import { searchPOIs } from "./poi.service";

/** Combined search results from both knowledge sources */
export interface SearchResults {
  faqs: KnowledgeArticle[];
  pois: POI[];
}

/**
 * Search across all knowledge sources (FAQs + POIs) for a given query.
 * This is the primary method used by the AI context builder
 * to gather deterministic knowledge before invoking the LLM.
 *
 * @param query - The user's natural language query
 * @param maxFAQs - Maximum FAQ results
 * @param maxPOIs - Maximum POI results
 */
export function searchKnowledge(
  query: string,
  maxFAQs: number = 3,
  maxPOIs: number = 5,
): SearchResults {
  return {
    faqs: searchFAQs(query, maxFAQs),
    pois: searchPOIs(query, maxPOIs),
  };
}
