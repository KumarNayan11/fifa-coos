/**
 * FIFACoOS — AI Response Zod Schemas
 *
 * Strict Zod schemas for validating all AI (LLM) outputs.
 * These schemas are the "Response Validator" from AI_ARCHITECTURE.md §7.
 * If validation fails, the system triggers a deterministic fallback.
 *
 * Used with Vercel AI SDK's `streamObject` for automatic validation.
 *
 * @see AI_ARCHITECTURE.md §14 — Confidence & Validation
 * @see TECHNOLOGY_DECISIONS.md §5.7 — Zod
 */

import { z } from "zod/v4";

/**
 * Schema for a single POI reference in the AI response.
 */
export const poiReferenceSchema = z
  .string()
  .describe("The ID of a referenced Point of Interest from the provided stadium data");

/**
 * Schema for the structured Fan Copilot AI response.
 *
 * This is the exact JSON shape the LLM must return.
 * If the model hallucinates fields or returns invalid types,
 * Zod will reject the output and the fallback triggers.
 */
export const fanCopilotResponseSchema = z.object({
  /** The classified intent of the user's query */
  intent: z
    .enum(["navigate", "info", "wait_time", "faq", "general"])
    .describe("The primary intent classification of the user's query"),

  /** Natural language response for the user */
  response: z
    .string()
    .min(1)
    .describe("A concise, helpful, stadium-specific natural language response to the user's query"),

  /** Referenced POI IDs from the provided stadium data */
  suggestedPOIs: z
    .array(poiReferenceSchema)
    .default([])
    .describe(
      "Array of POI IDs referenced in the response. Only include IDs from the provided stadium data.",
    ),

  /** AI self-assessed confidence score */
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Self-assessed confidence score from 0 to 100. Set below 50 if unsure about accuracy.",
    ),
});

/**
 * TypeScript type inferred from the Zod schema.
 * This is the validated shape used throughout the application.
 */
export type FanCopilotAIResponse = z.infer<typeof fanCopilotResponseSchema>;
