/**
 * FIFACoOS — FAQ Service
 *
 * Deterministic FAQ retrieval using keyword matching.
 * No vector search, no embeddings, no RAG.
 *
 * @see TECHNOLOGY_DECISIONS.md §5.8 — Deterministic Retrieval
 */

import type { KnowledgeArticle, FAQCategory } from "../types/fan.types";
import { FAQS } from "../data/faqs";

/**
 * Get all FAQs.
 */
export function getAllFAQs(): KnowledgeArticle[] {
  return FAQS;
}

/**
 * Get FAQs filtered by category.
 */
export function getFAQsByCategory(category: FAQCategory): KnowledgeArticle[] {
  return FAQS.filter((faq) => faq.category === category);
}

/**
 * Get a single FAQ by ID.
 */
export function getFAQById(id: string): KnowledgeArticle | undefined {
  return FAQS.find((faq) => faq.id === id);
}

/**
 * Search FAQs by matching keywords against a query string.
 * Returns FAQs sorted by relevance (number of keyword matches).
 *
 * This is the deterministic knowledge retrieval strategy:
 * no AI, no embeddings — pure keyword matching.
 *
 * @param query - The user's natural language query
 * @param maxResults - Maximum number of results to return
 */
export function searchFAQs(query: string, maxResults: number = 5): KnowledgeArticle[] {
  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/);

  const scored = FAQS.map((faq) => {
    let score = 0;

    for (const keyword of faq.keywords) {
      const lowerKeyword = keyword.toLowerCase();

      // Exact keyword match in the query string
      if (normalizedQuery.includes(lowerKeyword)) {
        score += 3;
      }

      // Individual word overlap
      for (const word of queryWords) {
        if (word.length > 2 && lowerKeyword.includes(word)) {
          score += 1;
        }
      }
    }

    return { faq, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((entry) => entry.faq);
}
